"use client";

import { useEffect, useMemo, useState } from "react";
import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { BubbleOption } from "@/components/ui/bubble-option";
import { SyllableCard } from "@/components/ui/syllable-card";
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
      const idx = next.findIndex((s) => s === null);
      if (idx === -1) return current;
      next[idx] = letter;
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
    const answer = slots.map((s) => s ?? "").join("");
    if (answer === target) {
      setFeedback("correct");
      addScore("syllables", 15, {
        metric: "syllableAssemblies",
        effect: "success",
        speak: `${target} formando ${target}`,
      });
      recordModuleCompletion("syllables");
      window.setTimeout(() => setTarget(randomSyllable()), 1200);
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
        {/* CONTAINER CENTRAL PARA CONTER O LARGURÃO EM TELAS GRANDES */}
        <div className="mx-auto w-full max-w-6xl px-4">
          {/* TOPO: CARD + SLOTS AGRUPADOS (sem 'justify-between') */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12 lg:justify-start">
            <div className="text-center lg:text-left">
              <p className="text-sm uppercase tracking-wide text-reef-shadow/60 mb-3">
                Monte a sílaba
              </p>
              <SyllableCard
                syllable={target}
                isPrimary
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 mx-auto lg:mx-0"
              />
            </div>

            <div className="flex flex-col items-center lg:items-start gap-3">
              <p className="text-sm text-reef-shadow/70">Arraste as letras aqui</p>
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                {slots.map((slot, i) => (
                  <div
                    key={i}
                    className={`relative flex items-center justify-center rounded-2xl border-2 border-dashed font-bold shadow-inner transition-all duration-200
                                h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24
                                text-3xl sm:text-4xl lg:text-5xl
                                ${slot ? "border-green-500 bg-green-50 text-green-700" : "border-gray-300 bg-white text-gray-400"}`}
                  >
                    {slot || "?"}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LISTA DE LETRAS MAIS COMPACTA/ALINHADA NO DESKTOP */}
          <div className="mt-8">
            <p className="text-sm text-reef-shadow/70 mb-4 text-center">Escolha as letras</p>
            {/* 6 colunas no desktop para caber tudo numa linha; no mobile aumenta gradualmente */}
            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto">
              {letters.map((letter) => (
                <button
                  key={letter}
                  onClick={() => fillSlot(letter)}
                  disabled={usedLetters.has(letter)}
                  className={`
                    w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-20 lg:h-20
                    rounded-2xl border-2 font-bold text-2xl sm:text-3xl md:text-4xl
                    transition-all duration-200
                    ${
                      usedLetters.has(letter)
                        ? "opacity-30 pointer-events-none bg-gray-100 border-gray-200 text-gray-400"
                        : "bg-white border-blue-400 text-blue-600 hover:bg-blue-50 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    }
                  `}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* AÇÕES CENTRAL NO MOBILE, ALINHADA À ESQUERDA NO DESKTOP */}
          <div className="mt-6 flex flex-wrap items-center gap-3 justify-center lg:justify-start">
            <BubbleOption onClick={checkAnswer} state={feedback === "correct" ? "correct" : "idle"}>
              Verificar
            </BubbleOption>
            <BubbleOption onClick={clearSlots} state="idle">
              Limpar
            </BubbleOption>
            {feedback === "correct" && (
              <span className="text-sm font-semibold text-kelp">Ótimo trabalho!</span>
            )}
            {feedback === "incorrect" && (
              <span className="text-sm font-semibold text-coral">Tente novamente!</span>
            )}
          </div>
        </div>
      </ActivitySection>
    </div>
  );
}
