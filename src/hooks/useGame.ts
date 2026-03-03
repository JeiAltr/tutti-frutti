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
// ARCHITECTURE: Single source of truth via game_state.basta_by
//
// During 'basta' status:  basta_by = "jose" or "nicol"
// During 'results'/'finished': basta_by = JSON string with full results
//
// Both players sync game_state via realtime + polling.
// When they detect stored results in basta_by, they parse and display them.
// This guarantees IDENTICAL results on both screens regardless of
// code versions, caching, or timing.
// ──────────────────────────────────────────────

interface StoredRoundResults {
  jose: Answers;
  nicol: Answers;
  points: { jose: Record<string, number>; nicol: Record<string, number> };
}

/** Try to parse stored results from basta_by JSON string */
function tryParseStoredResults(bastaBy: string | null): StoredRoundResults | null {
  if (!bastaBy || bastaBy === 'jose' || bastaBy === 'nicol') return null;
  try {
    const parsed = JSON.parse(bastaBy);
    if (parsed && parsed.jose && parsed.nicol && parsed.points) {
      return parsed as StoredRoundResults;
    }
  } catch {
    // Not JSON, just a player name
  }
  return null;
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

      // *** KEY: extract stored results from basta_by ***
      const storedResults = tryParseStoredResults(data.basta_by);
      if (storedResults) {
        setRoundResults(storedResults);
      }

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

    await supabase.from('answers').upsert({
      round: gameState.current_round,
      player,
      ...myAnswers,
    }, { onConflict: 'round,player' });

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

  // ─── Basta player: wait for answers, calculate, store in game_state ──
  useEffect(() => {
    if (!gameState || gameState.status !== 'basta' || !player) return;
    if (gameState.basta_by !== player) return;

    let active = true;

    const run = async () => {
      // Poll until both answers exist
      for (let attempt = 0; attempt < 10; attempt++) {
        if (!active) return;
        const { data } = await supabase.from('answers')
          .select('*')
          .eq('round', gameState.current_round)
          .in('player', ['jose', 'nicol']);

        if (data && data.length >= 2) break;
        await new Promise(r => setTimeout(r, 1000));
      }

      if (!active) return;
      await doCalculateAndStore();
    };

    run();
    return () => { active = false; };
  }, [gameState?.status, gameState?.basta_by, gameState?.current_round, player]);

  const doCalculateAndStore = async () => {
    if (!gameState) return;
    if (resultsCalculatedForRound.current === gameState.current_round) return;
    resultsCalculatedForRound.current = gameState.current_round;

    const { data: allAnswers } = await supabase.from('answers')
      .select('*')
      .eq('round', gameState.current_round)
      .in('player', ['jose', 'nicol']);

    let joseA = allAnswers?.find((a: any) => a.player === 'jose') as any;
    let nicolA = allAnswers?.find((a: any) => a.player === 'nicol') as any;

    const letter = normalizeLetter(gameState.current_letter) ?? '';
    if (!letter) return;

    if (!joseA) {
      joseA = { player: 'jose', round: gameState.current_round, ...emptyAnswers };
      await supabase.from('answers').upsert(joseA, { onConflict: 'round,player' });
    }
    if (!nicolA) {
      nicolA = { player: 'nicol', round: gameState.current_round, ...emptyAnswers };
      await supabase.from('answers').upsert(nicolA, { onConflict: 'round,player' });
    }

    const { jPoints, nPoints } = calculatePoints(joseA, nicolA, letter);

    const roundResultsData: StoredRoundResults = {
      jose: extractAnswers(joseA),
      nicol: extractAnswers(nicolA),
      points: { jose: jPoints, nicol: nPoints },
    };

    // Update total scores atomically
    const joseRoundTotal = Object.values(jPoints).reduce((a, b) => a + b, 0);
    const nicolRoundTotal = Object.values(nPoints).reduce((a, b) => a + b, 0);
    await supabase.rpc('increment_score', { p_player: 'jose', p_points: joseRoundTotal });
    await supabase.rpc('increment_score', { p_player: 'nicol', p_points: nicolRoundTotal });

    // Set results locally for the calculating player (instant feedback)
    setRoundResults(roundResultsData);

    // *** STORE results in basta_by as JSON and transition status ***
    // Both players will receive this via realtime/polling and parse it
    const newStatus = gameState.current_round >= TOTAL_ROUNDS ? 'finished' : 'results';
    await supabase.from('game_state')
      .update({
        status: newStatus,
        basta_by: JSON.stringify(roundResultsData),
        updated_at: new Date().toISOString(),
      })
      .eq('id', gameState.id);
  };

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
    await supabase.from('scores').update({ total_score: 0, updated_at: new Date().toISOString() }).eq('player', 'jose');
    await supabase.from('scores').update({ total_score: 0, updated_at: new Date().toISOString() }).eq('player', 'nicol');
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
