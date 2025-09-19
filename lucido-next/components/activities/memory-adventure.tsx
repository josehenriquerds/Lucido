"use client";

import { useEffect, useMemo, useState } from "react";

import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { MEMORY_PAIRS } from "@/lib/game-data";

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

  const matchedCount = useMemo(() => deck.filter((card) => card.matched).length, [deck]);

  useEffect(() => {
    if (matchedCount === deck.length && deck.length > 0) {
      recordModuleCompletion("memory");
      const timeout = window.setTimeout(() => {
        setDeck(createDeck());
        setFlipped([]);
      }, 1500);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [deck.length, matchedCount, recordModuleCompletion]);

  const handleFlip = (cardId: number) => {
    setDeck((current) => {
      const card = current.find((item) => item.id === cardId);
      if (!card || card.flipped || card.matched) return current;
      if (flipped.length >= 2) return current;

      const updated = current.map((item) =>
        item.id === cardId ? { ...item, flipped: true } : item,
      );
      setFlipped((previous) => [...previous, cardId]);
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
          flipped.includes(card.id) ? { ...card, matched: true } : card,
        ),
      );
      addScore("memory", 20, { effect: "success", speak: `Par encontrado: ${firstCard.value}` });
      setFlipped([]);
    } else {
      addScore("memory", 0, { effect: "error" });
      const timeout = window.setTimeout(() => {
        setDeck((current) =>
          current.map((card) =>
            flipped.includes(card.id) ? { ...card, flipped: false } : card,
          ),
        );
        setFlipped([]);
      }, 900);
      return () => window.clearTimeout(timeout);
    }
  }, [addScore, deck, flipped]);

  return (
    <div>
      <ActivityHeader
        title="Memória das Pérolas"
        subtitle="Vire as cartas e encontre os pares correspondentes."
        moduleId="memory"
        icon="🧠"
        score={scores.memory}
      />
      <ActivitySection>
        <div className="grid gap-3 sm:grid-cols-4">
          {deck.map((card) => (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className={`glass-card flex h-28 items-center justify-center rounded-3xl text-3xl font-bold transition ${
                card.flipped || card.matched ? "bg-lagoon/50" : "bg-shell/70"
              }`}
            >
              {card.flipped || card.matched ? card.value : "?"}
            </button>
          ))}
        </div>
      </ActivitySection>
    </div>
  );
}
