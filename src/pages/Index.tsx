import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, Player, Answers, TOTAL_ROUNDS } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const CATEGORY_LABELS: Record<keyof Answers, string> = {
  nombre: 'Nombre',
  apellido: 'Apellido',
  color: 'Color',
  animal: 'Animal',
  fruta_verdura: 'Fruta o Verdura',
  cosa: 'Cosa',
  pais: 'País',
};

const Index = () => {
  const [player, setPlayer] = useState<Player | null>(null);
  const { gameState, myAnswers, setMyAnswers, scores, roundResults, connect, disconnect, startRound, pressBasta, nextRound, restartGame } = useGame(player);
  const [showBasta, setShowBasta] = useState(false);

  // Connect/disconnect on player select
  useEffect(() => {
    if (player) {
      connect(player);
      const handleUnload = () => { disconnect(player); };
      window.addEventListener('beforeunload', handleUnload);
      return () => {
        window.removeEventListener('beforeunload', handleUnload);
        disconnect(player);
      };
    }
  }, [player]);

  // Show basta animation
  useEffect(() => {
    if (gameState?.status === 'basta') {
      setShowBasta(true);
      const timer = setTimeout(() => setShowBasta(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState?.status]);

  // LOGIN SCREEN
  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(330,60%,92%)] via-[hsl(270,40%,92%)] to-[hsl(30,30%,92%)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Tutti Frutti
            </h1>
            <p className="text-2xl md:text-3xl text-primary">💖 José & Nicol</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setPlayer('jose')}
              className="text-lg px-8 py-6 rounded-2xl bg-[hsl(var(--jose))] hover:bg-[hsl(var(--jose))/0.9] text-white shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              Entrar como José 💙
            </Button>
            <Button
              onClick={() => setPlayer('nicol')}
              className="text-lg px-8 py-6 rounded-2xl bg-[hsl(var(--nicol))] hover:bg-[hsl(var(--nicol))/0.9] text-white shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              Entrar como Nicol 💜
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const bothConnected = gameState?.jose_connected && gameState?.nicol_connected;
  const isPlaying = gameState?.status === 'playing';
  const isBasta = gameState?.status === 'basta';
  const isResults = gameState?.status === 'results';
  const isWaiting = gameState?.status === 'waiting';
  const isFinished = gameState?.status === 'finished';

  // BASTA OVERLAY
  const bastaOverlay = (
    <AnimatePresence>
      {showBasta && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-center"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">¡BASTA! 💫</h2>
            <p className="text-xl md:text-2xl text-white/90 mt-4">
              Ronda terminada por {gameState?.basta_by === 'jose' ? 'José' : 'Nicol'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Determine winner
  const getWinner = () => {
    if (scores.jose > scores.nicol) return { name: 'José', emoji: '💙' };
    if (scores.nicol > scores.jose) return { name: 'Nicol', emoji: '💜' };
    return null; // tie
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(330,60%,92%)] via-[hsl(270,40%,92%)] to-[hsl(30,30%,92%)] p-4">
      {bastaOverlay}

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tutti Frutti 💖</h1>
        <div className="flex justify-center gap-6 mt-2 text-sm font-medium">
          <span className="text-[hsl(var(--jose))]">José: {scores.jose} 💙</span>
          <span className="text-[hsl(var(--nicol))]">Nicol: {scores.nicol} 💜</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Jugando como {player === 'jose' ? 'José 💙' : 'Nicol 💜'} · Ronda {gameState?.current_round ?? 1} de {TOTAL_ROUNDS}
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        {/* WAITING SCREEN */}
        {isWaiting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
            <Card className="bg-card/80 backdrop-blur border-border/50">
              <CardContent className="p-8 space-y-4">
                <div className="space-y-2">
                  <p className={`text-sm ${gameState?.jose_connected ? 'text-[hsl(var(--jose))]' : 'text-muted-foreground'}`}>
                    {gameState?.jose_connected ? '✅ José conectado' : '⏳ Esperando a José...'}
                  </p>
                  <p className={`text-sm ${gameState?.nicol_connected ? 'text-[hsl(var(--nicol))]' : 'text-muted-foreground'}`}>
                    {gameState?.nicol_connected ? '✅ Nicol conectada' : '⏳ Esperando a Nicol...'}
                  </p>
                </div>

                {bothConnected && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-primary font-semibold text-lg mb-4">José y Nicol están listos 💕</p>
                    <Button onClick={startRound} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-4 text-lg">
                      Empezar Ronda {gameState?.current_round ?? 1} 🎲
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* PLAYING SCREEN */}
        {isPlaying && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border-2 border-primary">
                <span className="text-5xl font-bold text-primary">{gameState?.current_letter}</span>
              </div>
            </motion.div>

            <Card className="bg-card/80 backdrop-blur border-border/50">
              <CardContent className="p-4 space-y-3">
                {(Object.keys(CATEGORY_LABELS) as (keyof Answers)[]).map((key, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {CATEGORY_LABELS[key]}
                    </label>
                    <Input
                      value={myAnswers[key]}
                      onChange={(e) => setMyAnswers(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={`${CATEGORY_LABELS[key]} con ${gameState?.current_letter}...`}
                      className="bg-background/60 border-border/50 rounded-xl"
                    />
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Button
              onClick={pressBasta}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-6 text-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              ¡Basta! 💘
            </Button>
          </motion.div>
        )}

        {/* ROUND RESULTS SCREEN */}
        {(isBasta || isResults) && roundResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-foreground">Resultados Ronda {gameState?.current_round} 📊</h2>

            <Card className="bg-card/80 backdrop-blur border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="p-3 text-left text-muted-foreground font-medium">Categoría</th>
                        <th className="p-3 text-center text-[hsl(var(--jose))] font-medium">José 💙</th>
                        <th className="p-3 text-center text-[hsl(var(--nicol))] font-medium">Nicol 💜</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Object.keys(CATEGORY_LABELS) as (keyof Answers)[]).map(key => (
                        <tr key={key} className="border-b border-border/30">
                          <td className="p-3 font-medium text-foreground">{CATEGORY_LABELS[key]}</td>
                          <td className="p-3 text-center">
                            <span className="block text-foreground">{roundResults.jose[key] || '—'}</span>
                            <span className={`text-xs font-bold ${roundResults.points.jose[key] === 10 ? 'text-green-600' : roundResults.points.jose[key] === 5 ? 'text-amber-500' : 'text-destructive'}`}>
                              +{roundResults.points.jose[key]}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="block text-foreground">{roundResults.nicol[key] || '—'}</span>
                            <span className={`text-xs font-bold ${roundResults.points.nicol[key] === 10 ? 'text-green-600' : roundResults.points.nicol[key] === 5 ? 'text-amber-500' : 'text-destructive'}`}>
                              +{roundResults.points.nicol[key]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-8 text-lg font-bold">
              <span className="text-[hsl(var(--jose))]">José: {scores.jose} 💙</span>
              <span className="text-[hsl(var(--nicol))]">Nicol: {scores.nicol} 💜</span>
            </div>

            {isResults && (
              <Button
                onClick={nextRound}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-5 text-lg"
              >
                Siguiente Ronda 💞
              </Button>
            )}
          </motion.div>
        )}

        {/* BASTA waiting for results */}
        {isBasta && !roundResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">Calculando resultados...</p>
          </motion.div>
        )}

        {/* FINISHED - WINNER SCREEN */}
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center space-y-6"
          >
            <Card className="bg-card/80 backdrop-blur border-border/50">
              <CardContent className="p-8 space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">🎉 ¡Juego Terminado! 🎉</h2>
                  <p className="text-muted-foreground">{TOTAL_ROUNDS} rondas completadas</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center gap-8 text-2xl font-bold">
                    <span className="text-[hsl(var(--jose))]">José: {scores.jose} 💙</span>
                    <span className="text-[hsl(var(--nicol))]">Nicol: {scores.nicol} 💜</span>
                  </div>

                  {(() => {
                    const winner = getWinner();
                    if (winner) {
                      return (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 120, delay: 0.8 }}
                        >
                          <p className="text-4xl md:text-5xl font-bold text-primary">
                            🏆 ¡{winner.name} gana! {winner.emoji}
                          </p>
                          <p className="text-lg text-muted-foreground mt-2">¡Felicidades! 🥳💖</p>
                        </motion.div>
                      );
                    }
                    return (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 120, delay: 0.8 }}
                      >
                        <p className="text-4xl md:text-5xl font-bold text-primary">
                          🤝 ¡Empate! 💕
                        </p>
                        <p className="text-lg text-muted-foreground mt-2">¡Son el uno para el otro! 😍</p>
                      </motion.div>
                    );
                  })()}
                </motion.div>

                {/* Show last round results if available */}
                {roundResults && (
                  <div className="pt-4 border-t border-border/30">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Última ronda:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="p-2 text-left text-muted-foreground">Cat.</th>
                            <th className="p-2 text-center text-[hsl(var(--jose))]">José</th>
                            <th className="p-2 text-center text-[hsl(var(--nicol))]">Nicol</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Object.keys(CATEGORY_LABELS) as (keyof Answers)[]).map(key => (
                            <tr key={key} className="border-b border-border/30">
                              <td className="p-2 text-foreground">{CATEGORY_LABELS[key]}</td>
                              <td className="p-2 text-center">
                                <span className="block text-foreground">{roundResults.jose[key] || '—'}</span>
                                <span className={`text-xs font-bold ${roundResults.points.jose[key] === 10 ? 'text-green-600' : roundResults.points.jose[key] === 5 ? 'text-amber-500' : 'text-destructive'}`}>
                                  +{roundResults.points.jose[key]}
                                </span>
                              </td>
                              <td className="p-2 text-center">
                                <span className="block text-foreground">{roundResults.nicol[key] || '—'}</span>
                                <span className={`text-xs font-bold ${roundResults.points.nicol[key] === 10 ? 'text-green-600' : roundResults.points.nicol[key] === 5 ? 'text-amber-500' : 'text-destructive'}`}>
                                  +{roundResults.points.nicol[key]}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <Button
                    onClick={restartGame}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-5 text-lg font-bold shadow-lg"
                  >
                    🔄 Jugar de Nuevo (10 Rondas)
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
