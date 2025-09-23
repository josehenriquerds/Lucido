"use client";

import { useEffect, useMemo, useState } from "react";

import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { BubbleOption } from "@/components/ui/bubble-option";
import { Card } from "@/components/ui/card";
import { SyllableCard } from "@/components/ui/syllable-card";
import { LetterCard } from "@/components/ui/letter-card";
import { MessageCircle } from "lucide-react";
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
        icon={<MessageCircle className="w-6 h-6" />}
        score={scores.syllables}
      />

      <ActivitySection>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm uppercase tracking-wide text-reef-shadow/60 mb-4">Monte a sílaba</p>
            <SyllableCard
              syllable={target}
              isPrimary
              className="w-40 h-40 mx-auto md:mx-0"
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-reef-shadow/70">Arraste as letras aqui</p>
            <div className="flex items-center gap-3">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={`relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white border-2 border-dashed border-gray-300 text-2xl font-bold shadow-inner transition-all duration-200 ${
                    slot ? "border-green-500 bg-green-50" : "border-gray-300"
                  }`}
                >
                  {slot ? (
                    <LetterCard
                      value={slot}
                      className="w-16 h-16 !p-1"
                      showHelperImage={false}
                    />
                  ) : (
                    <span className="text-gray-400 text-3xl">?</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-reef-shadow/70 mb-4 text-center">Escolha as letras</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {letters.map((letter) => (
              <LetterCard
                key={letter}
                value={letter}
                asButton
                onClick={() => fillSlot(letter)}
                disabled={usedLetters.has(letter)}
                className={`w-20 h-20 ${usedLetters.has(letter) ? "opacity-50 pointer-events-none" : ""}`}
                showHelperImage={false}
              />
            ))}
          </div>
        </div>

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
