"use client";

import { useEffect, useMemo, useState } from "react";

import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { MEMORY_PAIRS } from "@/lib/game-data";

const MISMATCH_DELAY = 1600;
const RESET_DELAY = 2400;

const CONFETTI_EMOJIS = ["🫧", "🐚", "✨", "💎", "🌊"] as const;

function ConfettiBurst({ active }: { active: boolean }) {
  const pieces = useMemo(() => {
    if (!active) return [] as { left: number; delay: number; duration: number; scale: number; emoji: string }[];
    return Array.from({ length: 26 }, (_, index) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.35,
      duration: 1.4 + Math.random() * 1.3,
      scale: 0.75 + Math.random() * 0.9,
      emoji: CONFETTI_EMOJIS[index % CONFETTI_EMOJIS.length],
    }));
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece, index) => (
        <span
          key={index}
          style={{
            left: `${piece.left}%`,
            animation: `pearls-confetti ${piece.duration}s linear ${piece.delay}s`,
            transform: `scale(${piece.scale})`,
          }}
          className="absolute top-[-10%] text-3xl"
        >
          {piece.emoji}
        </span>
      ))}
      <style jsx>{`
        @keyframes pearls-confetti {
          0% {
            transform: translateY(-20%) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) scale(1.05);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

type MemoryCard = {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
};

function createDeck(): MemoryCard[] {
  const values = [...MEMORY_PAIRS, ...MEMORY_PAIRS];
  return values
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({ id: index, value, flipped: false, matched: false }));
}

export function MemoryAdventure() {
  const { scores, addScore, recordModuleCompletion } = useGame();
  const [deck, setDeck] = useState<MemoryCard[]>(() => createDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [winCelebration, setWinCelebration] = useState(false);

  const matchedCount = useMemo(() => deck.filter((card) => card.matched).length, [deck]);

  useEffect(() => {
    if (matchedCount === deck.length && deck.length > 0) {
      recordModuleCompletion("memory");
      setWinCelebration(true);
      setIsResolving(true);
      const timeout = window.setTimeout(() => {
        setDeck(createDeck());
        setFlipped([]);
        setIsResolving(false);
        setWinCelebration(false);
      }, RESET_DELAY);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [deck.length, matchedCount, recordModuleCompletion]);

  const handleFlip = (cardId: number) => {
    setDeck((current) => {
      const card = current.find((item) => item.id === cardId);
      if (!card || card.flipped || card.matched || isResolving) return current;
      if (flipped.length >= 2) return current;

      const updated = current.map((item) =>
        item.id === cardId ? { ...item, flipped: true } : item,
      );
      const nextFlipped = [...flipped, cardId];
      setFlipped(nextFlipped);
      if (nextFlipped.length === 2) {
        setIsResolving(true);
      }
      return updated;
    });
  };

  useEffect(() => {
    if (flipped.length !== 2) return;

    const [firstId, secondId] = flipped;
    const firstCard = deck.find((card) => card.id === firstId);
    const secondCard = deck.find((card) => card.id === secondId);
    if (!firstCard || !secondCard) return;

    if (firstCard.value === secondCard.value) {
      setDeck((current) =>
        current.map((card) =>
          flipped.includes(card.id)
            ? { ...card, matched: true }
            : card,
        ),
      );
      addScore("memory", 20, {
        effect: "success",
        speak: `Par encontrado: ${firstCard.value}`,
      });
      setFlipped([]);
      setIsResolving(false);
      return;
    }

    addScore("memory", 0, { effect: "error" });
    const timeout = window.setTimeout(() => {
      setDeck((current) =>
        current.map((card) =>
          flipped.includes(card.id)
            ? { ...card, flipped: false }
            : card,
        ),
      );
      setFlipped([]);
      setIsResolving(false);
    }, MISMATCH_DELAY);

    return () => window.clearTimeout(timeout);
  }, [addScore, deck, flipped]);

  return (
    <div className="relative">
      <ConfettiBurst active={winCelebration} />

      {winCelebration && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-black/20">
          <div className="rounded-3xl bg-white px-10 py-8 text-center shadow-[0_24px_48px_rgba(9,37,64,0.25)]">
            <p className="text-3xl font-chelsea text-reef-coral">Parabéns!</p>
            <p className="mt-2 text-lg text-reef-shadow/80">Você encontrou todas as pérolas brilhantes!</p>
          </div>
        </div>
      )}

      <ActivityHeader
        title="Memória das Pérolas"
        subtitle="Vire as cartas e encontre os pares correspondentes."
        moduleId="memory"
        icon="🐚"
        score={scores.memory}
      />

      <ActivitySection>
        <div className="grid gap-4 sm:grid-cols-4">
          {deck.map((card) => {
            const isActive = card.flipped || card.matched;
            const ringClass = card.matched
              ? "ring-4 ring-reef-teal shadow-[0_16px_32px_rgba(15,163,177,0.25)]"
              : isActive
              ? "ring-4 ring-reef-sand"
              : "ring-2 ring-transparent";

            return (
              <button
                key={card.id}
                onClick={() => handleFlip(card.id)}
                disabled={isResolving && !isActive}
                className={`relative h-32 w-full perspective-1000 transition-transform duration-300 hover:-translate-y-1 disabled:cursor-not-allowed ${ringClass}`}
              >
                <div
                  className="relative h-full w-full rounded-3xl [transform-style:preserve-3d] transition-transform duration-500"
                  style={{
                    transform: isActive ? "rotateY(0deg)" : "rotateY(180deg)",
                  }}
                >
                  <span
                    className="absolute inset-0 flex items-center justify-center rounded-3xl bg-reef-teal/15 text-4xl font-bold text-reef-shadow [backface-visibility:hidden]"
                  >
                    {card.value}
                  </span>
                  <span
                    className="absolute inset-0 flex items-center justify-center rounded-3xl bg-reef-shell/10 text-4xl font-bold text-reef-shadow [backface-visibility:hidden]"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    ?
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </ActivitySection>
    </div>
  );
}
