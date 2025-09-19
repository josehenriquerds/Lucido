"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { Card } from "@/components/ui/card";
import { BINGO_SYLLABLES } from "@/lib/game-data";

type BingoCell = {
  syllable: string;
  marked: boolean;
};

function shuffle<T>(array: readonly T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function createBoard(): BingoCell[] {
  return shuffle(BINGO_SYLLABLES).map((syllable) => ({ syllable, marked: false }));
}

export function BingoAdventure() {
  const { scores, addScore, recordModuleCompletion, registerMetric, narrate } = useGame();
  const [board, setBoard] = useState<BingoCell[]>(() => createBoard());
  const [called, setCalled] = useState<string>("");
  const [round, setRound] = useState(0);
  const [pendingNext, setPendingNext] = useState(false);

  const remaining = useMemo(() => board.filter((cell) => !cell.marked), [board]);

  const callNext = useCallback(() => {
    const available = board.filter((cell) => !cell.marked);
    if (available.length === 0) {
      addScore("bingo", 30, { effect: "success", speak: "Cartela completa!", module: "bingo" });
      recordModuleCompletion("bingo");
      registerMetric("bingoWins");
      const nextBoard = createBoard();
      setTimeout(() => {
        setBoard(nextBoard);
        setRound((value) => value + 1);
        setCalled(nextBoard[0]?.syllable ?? "");
      }, 1000);
      return;
    }
    const selection = available[Math.floor(Math.random() * available.length)];
    setCalled(selection.syllable);
    narrate(`Procure pela sílaba ${selection.syllable}`);
  }, [addScore, board, narrate, recordModuleCompletion, registerMetric]);

  useEffect(() => {
    if (!called) {
      callNext();
    }
  }, [called, callNext]);

  useEffect(() => {
    if (pendingNext) {
      const timeout = window.setTimeout(() => {
        callNext();
        setPendingNext(false);
      }, 700);
      return () => window.clearTimeout(timeout);
    }
  }, [callNext, pendingNext]);

  const handleMark = (syllable: string) => {
    if (syllable !== called) return;
    setBoard((current) =>
      current.map((cell) =>
        cell.syllable === syllable ? { ...cell, marked: true } : cell,
      ),
    );
    addScore("bingo", 10, { effect: "success", speak: `Você marcou ${syllable}`, module: "bingo" });
    setPendingNext(true);
  };

  return (
    <div>
      <ActivityHeader
        title="Bingo dos Recifes"
        subtitle="Marque as sílabas sorteadas para completar a cartela."
        moduleId="bingo"
        icon="🎲"
        score={scores.bingo}
      />
      <ActivitySection>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-reef-shell/70">Rodada atual</p>
            <h2 className="text-3xl font-bold text-reef-shell">{round + 1}</h2>
          </div>
          <Card variant="reef" className="flex items-center gap-4 bg-white/10 px-5 py-3 text-lg font-bold text-reef-shell">
            <span>Sílaba chamada:</span>
            <span className="text-3xl text-reef-coral">{called || "?"}</span>
          </Card>
          <span className="text-sm text-reef-shell/70">Restam {remaining.length} bolhas</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {board.map((cell) => (
            <button
              key={cell.syllable}
              onClick={() => handleMark(cell.syllable)}
              className={`glass-card flex items-center justify-center rounded-3xl p-6 text-3xl font-bold transition hover:-translate-y-1 ${
                cell.marked ? "bg-reef-algae/70 text-reef-shell" : ""
              }`}
            >
              {cell.syllable}
            </button>
          ))}
        </div>
      </ActivitySection>
    </div>
  );
}
