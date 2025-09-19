"use client";

import { useEffect, useMemo, useState } from "react";

import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { BubbleOption } from "@/components/ui/bubble-option";
import { Card } from "@/components/ui/card";
import { SYLLABLES } from "@/lib/game-data";

function randomSyllable() {
  return SYLLABLES[Math.floor(Math.random() * SYLLABLES.length)];
}

function generateLetters(target: string) {
  const letters = new Set(target.split(""));
  while (letters.size < 6) {
    const random = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    letters.add(random);
  }
  return Array.from(letters).sort(() => Math.random() - 0.5);
}

export function SyllablesAdventure() {
  const { scores, addScore, recordModuleCompletion } = useGame();
  const [target, setTarget] = useState(() => randomSyllable());
  const [slots, setSlots] = useState<(string | null)[]>([null, null]);
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");

  const letters = useMemo(() => generateLetters(target), [target]);

  useEffect(() => {
    setSlots([null, null]);
    setUsedLetters(new Set());
    setFeedback("idle");
  }, [target]);

  const fillSlot = (letter: string) => {
    setSlots((current) => {
      const next = [...current];
      const index = next.findIndex((slot) => slot === null);
      if (index === -1) return current;
      next[index] = letter;
      return next;
    });
    setUsedLetters((prev) => new Set(prev).add(letter));
  };

  const clearSlots = () => {
    setSlots([null, null]);
    setUsedLetters(new Set());
    setFeedback("idle");
  };

  const checkAnswer = () => {
    const answer = slots.map((slot) => slot ?? "").join("");
    if (answer === target) {
      setFeedback("correct");
      addScore("syllables", 15, {
        metric: "syllableAssemblies",
        effect: "success",
        speak: `${target} formando ${target}`,
      });
      recordModuleCompletion("syllables");
      window.setTimeout(() => {
        setTarget(randomSyllable());
      }, 1200);
    } else {
      setFeedback("incorrect");
      addScore("syllables", 0, { effect: "error" });
      window.setTimeout(clearSlots, 900);
    }
  };

  return (
    <div>
      <ActivityHeader
        title="Sílabas Borbulhantes"
        subtitle="Monte sílabas arrastando letras brilhantes." 
        moduleId="syllables"
        icon="💬"
        score={scores.syllables}
      />

      <ActivitySection>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-reef-shell/70">Monte a sílaba</p>
            <h2 className="text-3xl font-bold text-shell">{target}</h2>
          </div>
          <div className="flex items-center gap-3">
            {slots.map((slot, index) => (
              <span
                key={index}
                className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-shell/80 text-3xl font-bold text-deep-blue shadow-inner ${
                  slot ? "ring-4 ring-lagoon" : ""
                }`}
              >
                {slot ?? "?"}
              </span>
            ))}
          </div>
        </div>

        <Card className="mt-6 flex flex-wrap gap-3 bg-white/12 p-4">
          {letters.map((letter) => (
            <BubbleOption
              key={letter}
              onClick={() => fillSlot(letter)}
              disabled={usedLetters.has(letter)}
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
          <BubbleOption onClick={clearSlots} state="idle">
            Limpar
          </BubbleOption>
          {feedback === "correct" && <span className="text-sm font-semibold text-kelp">Ótimo trabalho!</span>}
          {feedback === "incorrect" && <span className="text-sm font-semibold text-coral">Tente novamente!</span>}
        </div>
      </ActivitySection>
    </div>
  );
}
