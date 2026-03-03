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

export function useGame(player: Player | null) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myAnswers, setMyAnswers] = useState<Answers>({ ...emptyAnswers });
  const [scores, setScores] = useState<Scores>({ jose: 0, nicol: 0 });
  const [roundResults, setRoundResults] = useState<{ jose: Answers; nicol: Answers; points: { jose: Record<string, number>; nicol: Record<string, number> } } | null>(null);
  const resultsCalculatedForRound = useRef<number | null>(null);

  // Initial fetch + realtime with safe polling fallback
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

  // Reset answers when round changes to playing
  useEffect(() => {
    if (gameState?.status === 'playing') {
      setMyAnswers({ ...emptyAnswers });
      setRoundResults(null);
      resultsCalculatedForRound.current = null;
    }
  }, [gameState?.status, gameState?.current_round]);

  // Connect player
  const connect = useCallback(async (p: Player) => {
    if (!gameState?.id) return;
    const col = p === 'jose' ? 'jose_connected' : 'nicol_connected';
    await supabase
      .from('game_state')
      .update({ [col]: true, updated_at: new Date().toISOString() })
      .eq('id', gameState.id);
  }, [gameState?.id]);

  // Disconnect player
  const disconnect = useCallback(async (p: Player) => {
    if (!gameState?.id) return;
    const col = p === 'jose' ? 'jose_connected' : 'nicol_connected';
    await supabase
      .from('game_state')
      .update({ [col]: false, updated_at: new Date().toISOString() })
      .eq('id', gameState.id);
  }, [gameState?.id]);

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

    // Si otro jugador ya inició la ronda al mismo tiempo, no generamos otra letra.
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

  // Press Basta - save answers with upsert to avoid duplicates
  const pressBasta = useCallback(async () => {
    if (!player || !gameState) return;

    // Upsert my answers (unique on round+player)
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

  // When status changes to basta, the OTHER player also saves answers
  useEffect(() => {
    if (!gameState || gameState.status !== 'basta' || !player) return;
    if (gameState.basta_by === player) return;

    // Save my answers (I'm NOT the one who pressed basta)
    const saveAnswers = async () => {
      await supabase.from('answers').upsert({
        round: gameState.current_round,
        player,
        ...myAnswers,
      }, { onConflict: 'round,player' });
    };
    saveAnswers();
  }, [gameState?.status]);

  // Only the player who pressed basta calculates results (single source of truth)
  useEffect(() => {
    if (!gameState || gameState.status !== 'basta' || !player) return;
    if (gameState.basta_by !== player) return;

    let isChecking = true;

    const checkAndCalculate = async () => {
      // Esperar hasta que estén ambas respuestas o pasen 10 segundos
      for (let i = 0; i < 10; i++) {
        if (!isChecking) return;
        const { data: allAnswers } = await supabase.from('answers')
          .select('*')
          .eq('round', gameState.current_round);

        if (allAnswers && allAnswers.length >= 2) {
          break; // Tenemos ambas respuestas
        }
        await new Promise(r => setTimeout(r, 1000));
      }

      if (!isChecking) return;
      doCalculateResults();
    };

    checkAndCalculate();

    return () => { isChecking = false; };
  }, [gameState?.status, gameState?.basta_by, gameState?.current_round, player]);

  const doCalculateResults = async () => {
    if (!gameState) return;
    // Prevent double-calculation for same round
    if (resultsCalculatedForRound.current === gameState.current_round) return;

    const { data: allAnswers } = await supabase.from('answers')
      .select('*')
      .eq('round', gameState.current_round);

    let joseA = allAnswers?.find((a: any) => a.player === 'jose') as any;
    let nicolA = allAnswers?.find((a: any) => a.player === 'nicol') as any;

    const letter = normalizeLetter(gameState.current_letter) ?? '';
    if (!letter) return;

    // Si por alguna razón de red un jugador no guardó sus respuestas, insertamos una vacía para evitar que el juego se trabe
    if (!joseA) {
      joseA = { player: 'jose', round: gameState.current_round, ...emptyAnswers };
      await supabase.from('answers').upsert(joseA, { onConflict: 'round,player' });
    }
    if (!nicolA) {
      nicolA = { player: 'nicol', round: gameState.current_round, ...emptyAnswers };
      await supabase.from('answers').upsert(nicolA, { onConflict: 'round,player' });
    }

    // Mark as calculated BEFORE doing DB calls to prevent race
    resultsCalculatedForRound.current = gameState.current_round;

    const { jPoints, nPoints } = calculatePoints(joseA, nicolA, letter);

    const joseRoundTotal = Object.values(jPoints).reduce((a, b) => a + b, 0);
    const nicolRoundTotal = Object.values(nPoints).reduce((a, b) => a + b, 0);

    // Use RPC to atomically increment scores (avoids race condition)
    await supabase.rpc('increment_score', { p_player: 'jose', p_points: joseRoundTotal });
    await supabase.rpc('increment_score', { p_player: 'nicol', p_points: nicolRoundTotal });

    // NOTE: We do NOT call setRoundResults here.
    // Both players (including the one who pressed Basta) will load results
    // through the hydrateResults effect once the status changes to 'results'.
    // This ensures both players see identical data from the DB.

    // Move to results (or finished if last round)
    const newStatus = gameState.current_round >= TOTAL_ROUNDS ? 'finished' : 'results';
    await supabase.from('game_state').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', gameState.id);
  };

  // Rehydrate results after refresh (when status is already "results" or "finished")
  useEffect(() => {
    const isResultsPhase = gameState?.status === 'results' || gameState?.status === 'finished';
    if (!gameState || !isResultsPhase || roundResults) return;

    let isHydrating = true;

    const hydrateResults = async () => {
      // Reintentar hasta 10 veces si las respuestas no están listas
      for (let i = 0; i < 10; i++) {
        if (!isHydrating) return;
        const { data: allAnswers } = await supabase
          .from('answers')
          .select('*')
          .eq('round', gameState.current_round);

        if (allAnswers && allAnswers.length >= 2) {
          const joseA = allAnswers.find((a: any) => a.player === 'jose') as any;
          const nicolA = allAnswers.find((a: any) => a.player === 'nicol') as any;
          if (joseA && nicolA) {
            const letter = normalizeLetter(gameState.current_letter) ?? '';
            if (letter) {
              const { jPoints, nPoints } = calculatePoints(joseA, nicolA, letter);
              setRoundResults({
                jose: extractAnswers(joseA),
                nicol: extractAnswers(nicolA),
                points: { jose: jPoints, nicol: nPoints },
              });
              return; // Carga exitosa exitosamente
            }
          }
        }
        await new Promise(r => setTimeout(r, 1000));
      }
    };

    hydrateResults();
    return () => { isHydrating = false; };
  }, [gameState?.status, gameState?.current_round, gameState?.current_letter, roundResults]);

  // Next round
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

  // Restart game (new 10 rounds)
  const restartGame = useCallback(async () => {
    // Reset scores
    await supabase.from('scores').update({ total_score: 0, updated_at: new Date().toISOString() }).eq('player', 'jose');
    await supabase.from('scores').update({ total_score: 0, updated_at: new Date().toISOString() }).eq('player', 'nicol');
    // Delete all answers
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
