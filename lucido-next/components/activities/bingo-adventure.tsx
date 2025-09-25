"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { SyllableCard } from "@/components/ui/syllable-card";
import { CheckCircle, Dice6, PartyPopper } from "lucide-react";
import { BINGO_SYLLABLES } from "@/lib/game-data";
import { getSyllableTheme } from "@/lib/letter-theme";
import { cn } from "@/lib/utils";

type BingoCell = { syllable: string; marked: boolean };

function shuffle<T>(arr: readonly T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
function createBoard(): BingoCell[] {
  return shuffle(BINGO_SYLLABLES).map((syllable) => ({ syllable, marked: false }));
}

/* Confete leve com emoji */
const CONFETTI_EMOJIS = ["🫧", "🐚", "✨", "💎", "🌊"] as const;
function ConfettiBurst({ active, seed = 0 }: { active: boolean; seed?: number }) {
  const pieces = useMemo(() => {
    if (!active) return [] as { left: number; delay: number; duration: number; emoji: string }[];
    return Array.from({ length: 28 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.35,
      duration: 1.1 + Math.random() * 1.2,
      emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
    }));
  }, [active, seed]);
  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-[-8%] text-3xl"
          style={{ left: `${p.left}%`, animation: `fall ${p.duration}s linear ${p.delay}s` }}
        >
          {p.emoji}
        </span>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% { opacity: 0; transform: translateY(-20%) scale(.85); }
          15% { opacity: 1; }
          100% { opacity: 0; transform: translateY(110vh) scale(1.05); }
        }
      `}</style>
    </div>
  );
}

export function BingoAdventure() {
  const { scores, addScore, recordModuleCompletion, registerMetric, narrate } = useGame();

  const [board, setBoard] = useState<BingoCell[]>(() => createBoard());
  const [called, setCalled] = useState<string>("");
  const [round, setRound] = useState(0);
  const [pendingNext, setPendingNext] = useState(false);

  const [win, setWin] = useState(false);
  const [winKey, setWinKey] = useState(0);

  const remaining = useMemo(() => board.filter((c) => !c.marked), [board]);
  const calledTheme = called ? getSyllableTheme(called.toUpperCase()) : null;

  const callNext = useCallback(() => {
    const available = board.filter((c) => !c.marked);
    if (available.length === 0) {
      addScore("bingo", 30, { effect: "success", speak: "Cartela completa!", module: "bingo" });
      recordModuleCompletion("bingo");
      registerMetric("bingoWins");
      narrate("Parabéns! Você completou o Bingo!");

      setWin(true);
      setWinKey((k) => k + 1);

      const next = createBoard();
      setTimeout(() => {
        setBoard(next);
        setRound((v) => v + 1);
        setCalled(next[0]?.syllable ?? "");
        setWin(false);
      }, 2200);
      return;
    }
    const sel = available[Math.floor(Math.random() * available.length)];
    setCalled(sel.syllable);
    narrate(`Procure pela sílaba ${sel.syllable}`);
  }, [addScore, board, narrate, recordModuleCompletion, registerMetric]);

  useEffect(() => { if (!called) callNext(); }, [called, callNext]);

  useEffect(() => {
    if (!pendingNext) return;
    const t = window.setTimeout(() => { callNext(); setPendingNext(false); }, 650);
    return () => window.clearTimeout(t);
  }, [callNext, pendingNext]);

  const handleMark = (syllable: string) => {
    if (syllable !== called) return;
    setBoard((cur) => cur.map((c) => (c.syllable === syllable ? { ...c, marked: true } : c)));
    addScore("bingo", 10, { effect: "success", speak: `Você marcou ${syllable}`, module: "bingo" });
    setPendingNext(true);
  };

  return (
    <div>
      <ActivityHeader
        title="Bingo dos Recifes"
        subtitle="Marque as sílabas sorteadas para completar a cartela."
        moduleId="bingo"
        icon={<Dice6 className="w-8 h-8" />}
        score={scores.bingo}
      />

      <ActivitySection>
        {/* Barra com rodada, chamada e restantes — MESMO LAYOUT, mais estilizado */}
        <div className="mb-6">
          <div className="rounded-[26px] bg-white/85 backdrop-blur px-4 sm:px-6 py-4 shadow-[0_12px_28px_rgba(15,23,42,.08)] flex items-center justify-between">
            <div className="text-xs sm:text-sm uppercase tracking-wide text-reef-shadow/60">
              Rodada atual
              <div className="text-2xl sm:text-3xl font-black text-reef-shadow leading-none mt-1">{round + 1}</div>
            </div>

            {/* Sílaba chamada central, com cor e emoji */}
            <div className="relative">
              <div className="px-3 sm:px-4 py-2 rounded-full bg-white shadow-[0_10px_30px_rgba(2,6,23,.10)] flex items-center gap-2">
                <span className="text-[11px] sm:text-xs uppercase tracking-wide text-reef-shadow/70">Sílaba chamada:</span>
                <span
                  className="font-extrabold"
                  style={{
                    color: calledTheme?.color ?? "#ef4444",
                    textShadow: "0 1px 0 rgba(255,255,255,.6)",
                    fontSize: "clamp(18px,3.6vw,28px)",
                    letterSpacing: ".02em",
                  }}
                >
                  {called || "—"}
                </span>
                {calledTheme?.emoji && <span className="text-xl sm:text-2xl">{calledTheme.emoji}</span>}
              </div>
            </div>

            <div className="text-xs sm:text-sm text-right text-reef-shadow/60">
              Restam <strong className="text-reef-shadow">{remaining.length}</strong> bolhas
            </div>
          </div>
        </div>

        {/* Cartela no MESMO formato (pílulas em 3 colunas) */}
        <div className="mx-auto max-w-[min(1200px,96vw)]">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {board.map((cell) => {
              const theme = getSyllableTheme(cell.syllable.toUpperCase());
              return (
                <div key={cell.syllable} className="relative">
                  <SyllableCard
                    syllable={cell.syllable}
                    asButton
                    marked={cell.marked}
                    onClick={() => handleMark(cell.syllable)}
                    className={cn(
                      "min-h-[48px] sm:min-h-[56px] md:min-h-[64px] lg:min-h-[72px] xl:min-h-[80px]",
                      !cell.marked && "hover:shadow-[0_14px_34px_rgba(15,23,42,.12)]"
                    )}
                    showHelperImage
                  />

                  {/* Carimbo animado quando marca */}
                  {cell.marked && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[18px]">
                      <div
                        className="grid place-items-center rounded-full bg-emerald-500 text-white animate-stamp"
                        style={{ width: "clamp(32px, 6vw, 48px)", height: "clamp(32px, 6vw, 48px)" }}
                        aria-hidden
                      >
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                  )}

                  {/* Borda viva piscando 150ms ao marcar */}
                  {cell.marked && (
                    <span
                      className="pointer-events-none absolute inset-0 rounded-[18px] animate-glow"
                      style={{ boxShadow: `0 0 0 3px ${theme?.color ?? "#22c55e"} inset` }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Confete + overlay de vitória */}
        <ConfettiBurst active={win} seed={winKey} />
        {win && (
          <div className="pointer-events-none fixed inset-0 z-[55] grid place-items-center bg-black/30">
            <div className="mx-4 rounded-3xl bg-white/95 px-8 py-8 text-center shadow-[0_24px_48px_rgba(9,37,64,0.25)] animate-popIn">
              <p className="text-2xl sm:text-3xl font-extrabold text-reef-coral flex items-center justify-center gap-2">
                <PartyPopper className="w-6 h-6" /> Parabéns! <PartyPopper className="w-6 h-6" />
              </p>
              <p className="mt-1 text-reef-shadow/80">Você completou o Bingo dos Recifes!</p>
            </div>
          </div>
        )}
      </ActivitySection>

      <style jsx>{`
        /* animações */
        @keyframes popIn {
          0% { transform: translateY(8px) scale(.96); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-popIn { animation: popIn .35s ease-out both; }

        @keyframes stamp {
          0% { transform: scale(.6); opacity: 0; }
          60% { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-stamp { animation: stamp .42s cubic-bezier(.2,.9,.2,1) both; }

        @keyframes glow {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0); }
          30% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.25); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0); }
        }
        .animate-glow { animation: glow 600ms ease-out 1; }

        @keyframes fall {
          0% { opacity: 0; transform: translateY(-20%) scale(.85); }
          15% { opacity: 1; }
          100% { opacity: 0; transform: translateY(110vh) scale(1.05); }
        }

        @keyframes correctPulse {
          0% { background-color: rgba(16,185,129,.14); }
          100% { background-color: rgba(16,185,129,.08); }
        }
        .animate-correctPulse { animation: correctPulse .9s ease-out both; }
      `}</style>
    </div>
  );
}
