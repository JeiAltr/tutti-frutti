import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidForCategory, normalizeWord } from './validations';

export type Player = 'jose' | 'nicol';
export type GameStatus = 'waiting' | 'playing' | 'basta' | 'results' | 'finished';
export const TOTAL_ROUNDS = 10;

export interface GameState {
  id: string;
  current_letter: string | null;
  current_round: number;
  status: GameStatus;
  basta_by: string | null;
  jose_connected: boolean;
  nicol_connected: boolean;
  used_letters: string[];
}

export interface Answers {
  nombre: string;
  apellido: string;
  color: string;
  animal: string;
  fruta_verdura: string;
  cosa: string;
  pais: string;
}

export interface Scores {
  jose: number;
  nicol: number;
}

const CATEGORIES = ['nombre', 'apellido', 'color', 'animal', 'fruta_verdura', 'cosa', 'pais'] as const;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const pickRandomLetter = (usedLetters: string[]): string => {
  const available = LETTERS.filter(l => !usedLetters.includes(l));
  if (available.length === 0) return LETTERS[Math.floor(Math.random() * LETTERS.length)];
  return available[Math.floor(Math.random() * available.length)];
};

const normalizeLetter = (value: string | null | undefined): string | null => {
  const candidate = (value ?? '').trim().toUpperCase();
  return candidate.length === 1 && LETTERS.includes(candidate) ? candidate : null;
};

const emptyAnswers: Answers = { nombre: '', apellido: '', color: '', animal: '', fruta_verdura: '', cosa: '', pais: '' };

/**
 * Calculate points for a round. This is deterministic:
 * same inputs always produce same outputs.
 */
function calculatePoints(joseA: any, nicolA: any, letter: string) {
  const jPoints: Record<string, number> = {};
  const nPoints: Record<string, number> = {};

  CATEGORIES.forEach(cat => {
    const jVal = (joseA[cat] || '').trim();
    const nVal = (nicolA[cat] || '').trim();

    const jNorm = normalizeWord(jVal);
    const nNorm = normalizeWord(nVal);
    const letterLow = letter.toLowerCase();

    const jStartsRight = jNorm.length >= 3 && jNorm.startsWith(letterLow);
    const nStartsRight = nNorm.length >= 3 && nNorm.startsWith(letterLow);

    const jValid = jStartsRight && isValidForCategory(cat, jVal);
    const nValid = nStartsRight && isValidForCategory(cat, nVal);

    if (!jValid) jPoints[cat] = 0;
    else if (jNorm === nNorm && nValid) jPoints[cat] = 5;
    else jPoints[cat] = 10;

    if (!nValid) nPoints[cat] = 0;
    else if (nNorm === jNorm && jValid) nPoints[cat] = 5;
    else nPoints[cat] = 10;
  });

  return { jPoints, nPoints };
}

function extractAnswers(row: any): Answers {
  return {
    nombre: row.nombre ?? '',
    apellido: row.apellido ?? '',
    color: row.color ?? '',
    animal: row.animal ?? '',
    fruta_verdura: row.fruta_verdura ?? '',
    cosa: row.cosa ?? '',
    pais: row.pais ?? '',
  };
}

// ──────────────────────────────────────────────
// We store the round results (answers + points) as a special row in
// the `answers` table with player = '_round_results_'. This guarantees
// both clients read the EXACT same results from the DB, eliminating
// any possibility of desync due to different code versions, caching,
// or race conditions.
// ──────────────────────────────────────────────
const RESULTS_PLAYER_KEY = '_round_results_';

interface StoredRoundResults {
  jose: Answers;
  nicol: Answers;
  points: { jose: Record<string, number>; nicol: Record<string, number> };
}

export function useGame(player: Player | null) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myAnswers, setMyAnswers] = useState<Answers>({ ...emptyAnswers });
  const [scores, setScores] = useState<Scores>({ jose: 0, nicol: 0 });
  const [roundResults, setRoundResults] = useState<StoredRoundResults | null>(null);
  const resultsCalculatedForRound = useRef<number | null>(null);

  // ─── Initial fetch + realtime ───────────────────────────
  useEffect(() => {
    let isMounted = true;

    const applyScores = (scoresData: any[]) => {
      const s: Scores = { jose: 0, nicol: 0 };
      scoresData.forEach((r: any) => { s[r.player as Player] = r.total_score; });
      if (isMounted) setScores(s);
    };

    const applyGameState = (data: any) => {
      if (!data || !isMounted) return;
      setGameState({
        ...data,
        current_letter: normalizeLetter(data.current_letter),
      } as GameState);
    };

    const fetchSnapshot = async () => {
      try {
        const [stateRes, scoresRes] = await Promise.all([
          supabase.from('game_state').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('scores').select('*'),
        ]);

        if (stateRes.data) applyGameState(stateRes.data);
        if (scoresRes.data) applyScores(scoresRes.data as any[]);
      } catch (error) {
        console.error('fetchSnapshot error:', error);
      }
    };

    const channel = supabase
      .channel('game-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state' }, (payload) => {
        if (!isMounted || !payload.new) return;
        applyGameState(payload.new);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, async () => {
        if (!isMounted) return;
        const { data } = await supabase.from('scores').select('*');
        if (data) applyScores(data as any[]);
      })
      .subscribe();

    fetchSnapshot();
    const pollId = setInterval(fetchSnapshot, 2000);

    return () => {
      isMounted = false;
      clearInterval(pollId);
      supabase.removeChannel(channel);
    };
  }, []);

  // ─── Reset when round changes to playing ─────────────
  useEffect(() => {
    if (gameState?.status === 'playing') {
      setMyAnswers({ ...emptyAnswers });
      setRoundResults(null);
      resultsCalculatedForRound.current = null;
    }
  }, [gameState?.status, gameState?.current_round]);

  // ─── Connect / Disconnect ────────────────────────────
  const connect = useCallback(async (p: Player) => {
    if (!gameState?.id) return;
    const col = p === 'jose' ? 'jose_connected' : 'nicol_connected';
    await supabase
      .from('game_state')
      .update({ [col]: true, updated_at: new Date().toISOString() })
      .eq('id', gameState.id);
  }, [gameState?.id]);

  const disconnect = useCallback(async (p: Player) => {
    if (!gameState?.id) return;
    const col = p === 'jose' ? 'jose_connected' : 'nicol_connected';
    await supabase
      .from('game_state')
      .update({ [col]: false, updated_at: new Date().toISOString() })
      .eq('id', gameState.id);
  }, [gameState?.id]);

  // ─── Start Round ─────────────────────────────────────
  const startRound = useCallback(async () => {
    if (!gameState?.id || gameState.status !== 'waiting') return;

    const usedLetters = gameState.used_letters ?? [];
    const letter = pickRandomLetter(usedLetters);
    const newUsedLetters = [...usedLetters, letter];
    const { data: updated } = await supabase
      .from('game_state')
      .update({
        current_letter: letter,
        status: 'playing',
        basta_by: null,
        current_round: gameState.current_round,
        used_letters: newUsedLetters,
        updated_at: new Date().toISOString(),
      })
      .eq('id', gameState.id)
      .eq('status', 'waiting')
      .select('id')
      .maybeSingle();

    if (!updated) {
      const { data } = await supabase.from('game_state').select('*').eq('id', gameState.id).maybeSingle();
      if (data) {
        setGameState({
          ...data,
          current_letter: normalizeLetter(data.current_letter),
        } as GameState);
      }
    }
  }, [gameState]);

  // ─── Press Basta ─────────────────────────────────────
  const pressBasta = useCallback(async () => {
    if (!player || !gameState) return;

    // Upsert my answers
    await supabase.from('answers').upsert({
      round: gameState.current_round,
      player,
      ...myAnswers,
    }, { onConflict: 'round,player' });

    // Update game state to basta
    await supabase
      .from('game_state')
      .update({
        status: 'basta',
        basta_by: player,
        updated_at: new Date().toISOString(),
      })
      .eq('id', gameState.id);
  }, [player, gameState, myAnswers]);

  // ─── Other player saves answers when basta detected ──
  useEffect(() => {
    if (!gameState || gameState.status !== 'basta' || !player) return;
    if (gameState.basta_by === player) return;

    const saveAnswers = async () => {
      await supabase.from('answers').upsert({
        round: gameState.current_round,
        player,
        ...myAnswers,
      }, { onConflict: 'round,player' });
    };
    saveAnswers();
  }, [gameState?.status]);

  // ─── Basta player: wait for both answers, calculate, store results ──
  useEffect(() => {
    if (!gameState || gameState.status !== 'basta' || !player) return;
    if (gameState.basta_by !== player) return;

    let active = true;

    const run = async () => {
      // Poll until both real answers exist (up to 10 seconds)
      for (let attempt = 0; attempt < 10; attempt++) {
        if (!active) return;
        const { data } = await supabase.from('answers')
          .select('*')
          .eq('round', gameState.current_round)
          .neq('player', RESULTS_PLAYER_KEY);

        if (data && data.length >= 2) break;
        await new Promise(r => setTimeout(r, 1000));
      }

      if (!active) return;
      await doCalculateAndStore();
    };

    run();
    return () => { active = false; };
  }, [gameState?.status, gameState?.basta_by, gameState?.current_round, player]);

  /**
   * Single source of truth: calculate points, store them in DB,
   * update scores, and transition to results.
   */
  const doCalculateAndStore = async () => {
    if (!gameState) return;
    if (resultsCalculatedForRound.current === gameState.current_round) return;
    resultsCalculatedForRound.current = gameState.current_round;

    // Fetch answers from DB
    const { data: allAnswers } = await supabase.from('answers')
      .select('*')
      .eq('round', gameState.current_round)
      .neq('player', RESULTS_PLAYER_KEY);

    let joseA = allAnswers?.find((a: any) => a.player === 'jose') as any;
    let nicolA = allAnswers?.find((a: any) => a.player === 'nicol') as any;

    const letter = normalizeLetter(gameState.current_letter) ?? '';
    if (!letter) return;

    // Insert empty answers if a player didn't save in time
    if (!joseA) {
      joseA = { player: 'jose', round: gameState.current_round, ...emptyAnswers };
      await supabase.from('answers').upsert(joseA, { onConflict: 'round,player' });
    }
    if (!nicolA) {
      nicolA = { player: 'nicol', round: gameState.current_round, ...emptyAnswers };
      await supabase.from('answers').upsert(nicolA, { onConflict: 'round,player' });
    }

    // Calculate points
    const { jPoints, nPoints } = calculatePoints(joseA, nicolA, letter);

    const roundResultsData: StoredRoundResults = {
      jose: extractAnswers(joseA),
      nicol: extractAnswers(nicolA),
      points: { jose: jPoints, nicol: nPoints },
    };

    // *** STORE results in DB as a special "answers" row ***
    // We serialize the full results into the `nombre` field as JSON.
    // This ensures BOTH players read the EXACT same calculated results.
    await supabase.from('answers').upsert({
      round: gameState.current_round,
      player: RESULTS_PLAYER_KEY,
      nombre: JSON.stringify(roundResultsData),
      apellido: null, color: null, animal: null,
      fruta_verdura: null, cosa: null, pais: null,
    }, { onConflict: 'round,player' });

    // Update total scores atomically
    const joseRoundTotal = Object.values(jPoints).reduce((a, b) => a + b, 0);
    const nicolRoundTotal = Object.values(nPoints).reduce((a, b) => a + b, 0);
    await supabase.rpc('increment_score', { p_player: 'jose', p_points: joseRoundTotal });
    await supabase.rpc('increment_score', { p_player: 'nicol', p_points: nicolRoundTotal });

    // Set results locally for the calculating player
    setRoundResults(roundResultsData);

    // Transition game status
    const newStatus = gameState.current_round >= TOTAL_ROUNDS ? 'finished' : 'results';
    await supabase.from('game_state')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', gameState.id);
  };

  // ─── Both players: load stored results from DB when status is results/finished ──
  useEffect(() => {
    const isResultsPhase = gameState?.status === 'results' || gameState?.status === 'finished';
    if (!gameState || !isResultsPhase || roundResults) return;

    let active = true;

    const loadResults = async () => {
      // Poll until the stored results row exists (up to 10 seconds)
      for (let attempt = 0; attempt < 10; attempt++) {
        if (!active) return;

        const { data } = await supabase.from('answers')
          .select('nombre')
          .eq('round', gameState.current_round)
          .eq('player', RESULTS_PLAYER_KEY)
          .maybeSingle();

        if (data?.nombre) {
          try {
            const parsed = JSON.parse(data.nombre) as StoredRoundResults;
            setRoundResults(parsed);
            return; // Success!
          } catch (e) {
            console.error('Failed to parse stored results:', e);
          }
        }

        await new Promise(r => setTimeout(r, 1000));
      }
    };

    loadResults();
    return () => { active = false; };
  }, [gameState?.status, gameState?.current_round, roundResults]);

  // ─── Next Round ──────────────────────────────────────
  const nextRound = useCallback(async () => {
    if (!gameState) return;
    await supabase.from('game_state').update({
      current_round: gameState.current_round + 1,
      status: 'waiting',
      current_letter: null,
      basta_by: null,
      updated_at: new Date().toISOString(),
    }).eq('id', gameState.id);
    setMyAnswers({ ...emptyAnswers });
    setRoundResults(null);
    resultsCalculatedForRound.current = null;
  }, [gameState]);

  // ─── Restart Game ────────────────────────────────────
  const restartGame = useCallback(async () => {
    // Reset scores
    await supabase.from('scores').update({ total_score: 0, updated_at: new Date().toISOString() }).eq('player', 'jose');
    await supabase.from('scores').update({ total_score: 0, updated_at: new Date().toISOString() }).eq('player', 'nicol');
    // Delete ALL answers (including stored results rows)
    await supabase.from('answers').delete().not('id', 'is', null);

    const targetGameId = gameState?.id ?? (
      await supabase.from('game_state').select('id').order('updated_at', { ascending: false }).limit(1).maybeSingle()
    ).data?.id;

    if (targetGameId) {
      await supabase.from('game_state').update({
        current_round: 1,
        status: 'waiting',
        current_letter: null,
        basta_by: null,
        jose_connected: false,
        nicol_connected: false,
        used_letters: [],
        updated_at: new Date().toISOString(),
      }).eq('id', targetGameId);
    }

    setMyAnswers({ ...emptyAnswers });
    setRoundResults(null);
    resultsCalculatedForRound.current = null;
  }, [gameState?.id]);

  return {
    gameState,
    myAnswers,
    setMyAnswers,
    scores,
    roundResults,
    connect,
    disconnect,
    startRound,
    pressBasta,
    nextRound,
    restartGame,
  };
}
