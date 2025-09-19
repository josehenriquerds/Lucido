"use client";

import { useMemo, useState } from "react";

import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { BubbleOption } from "@/components/ui/bubble-option";
import { Card } from "@/components/ui/card";
import { WORD_ROUNDS } from "@/lib/game-data";

function randomWord() {
  return WORD_ROUNDS[Math.floor(Math.random() * WORD_ROUNDS.length)];
}

function buildLetters(word: string) {
  const letters = word.split("");
  const consonants = "BCDFGHJKLMNPQRSTVWXYZ";
  while (letters.length < word.length + 4) {
    letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
  }
  return letters.sort(() => Math.random() - 0.5);
}

export function WordsAdventure() {
  const { scores, addScore, recordModuleCompletion } = useGame();
  const [round, setRound] = useState(() => randomWord());
  const [slots, setSlots] = useState<(string | null)[]>(() => Array(round.word.length).fill(null));
  const [usedLetters, setUsedLetters] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");

  const letters = useMemo(() => buildLetters(round.word), [round]);

  const resetRound = () => {
    setSlots(Array(round.word.length).fill(null));
    setUsedLetters(new Set());
    setFeedback("idle");
  };

  const fillSlot = (letter: string, index: number) => {
    setSlots((current) => {
      const next = [...current];
      const emptyIndex = next.findIndex((slot) => slot === null);
      if (emptyIndex === -1) return current;
      next[emptyIndex] = letter;
      return next;
    });
    setUsedLetters((prev) => new Set(prev).add(index));
  };

  const checkAnswer = () => {
    const formed = slots.map((slot) => slot ?? "").join("");
    if (formed === round.word) {
      setFeedback("correct");
      addScore("words", 20, { effect: "success", speak: `${round.word}` });
      recordModuleCompletion("words");
      window.setTimeout(() => {
        const next = randomWord();
        setRound(next);
        setSlots(Array(next.word.length).fill(null));
        setUsedLetters(new Set());
        setFeedback("idle");
      }, 1200);
    } else {
      setFeedback("incorrect");
      addScore("words", 0, { effect: "error" });
      window.setTimeout(resetRound, 900);
    }
  };

  return (
    <div>
      <ActivityHeader
        title="Palavras de Areia"
        subtitle="Monte palavras completas usando as bolhas disponíveis."
        moduleId="words"
        icon="🏖️"
        score={scores.words}
      />

      <ActivitySection>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl" aria-hidden="true">
              {round.emoji}
            </span>
            <div>
              <p className="text-sm uppercase tracking-wide text-reef-shell/70">Construa</p>
              <h2 className="text-3xl font-bold text-shell">{round.word}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {slots.map((slot, index) => (
              <span
                key={index}
                className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-2xl font-bold text-deep-blue shadow-inner ${
                  slot ? "ring-4 ring-lagoon" : ""
                }`}
              >
                {slot ?? "?"}
              </span>
            ))}
          </div>
        </div>

        <Card className="mt-6 flex flex-wrap gap-3 bg-white/12 p-4">
          {letters.map((letter, index) => (
            <BubbleOption
              key={`${letter}-${index}`}
              onClick={() => fillSlot(letter, index)}
              disabled={usedLetters.has(index)}
              className="min-w-[64px] justify-center text-2xl"
            >
              {letter}
            </BubbleOption>
          ))}
        </Card>

        <div className="mt-6 flex flex-wrap gap-3">
          <BubbleOption onClick={checkAnswer} state={feedback === "correct" ? "correct" : "idle"}>
            Verificar
          </BubbleOption>
          <BubbleOption onClick={resetRound}>Limpar</BubbleOption>
          {feedback === "correct" && <span className="text-sm font-semibold text-kelp">Perfeito!</span>}
          {feedback === "incorrect" && <span className="text-sm font-semibold text-coral">Quase! Tente outra vez.</span>}
        </div>
      </ActivitySection>
    </div>
  );
}
