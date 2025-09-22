"use client";

import { useMemo, useState } from "react";

import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { Card } from "@/components/ui/card";
import { VOWEL_TARGETS } from "@/lib/game-data";

const VOWELS = Object.keys(VOWEL_TARGETS) as (keyof typeof VOWEL_TARGETS)[];

type VowelOption = {
  id: string;
  emoji: string;
  word: string;
  correct: boolean;
  state: "idle" | "correct" | "incorrect";
};

type DragRound = {
  vowel: (typeof VOWELS)[number];
  options: VowelOption[];
};

function buildOption(params: {
  id: string;
  emoji: string;
  word: string;
  correct: boolean;
  state?: VowelOption["state"];
}): VowelOption {
  return {
    ...params,
    state: params.state ?? "idle",
  };
}

function createRound(vowelOverride?: (typeof VOWELS)[number]): DragRound {
  const vowel = vowelOverride ?? VOWELS[Math.floor(Math.random() * VOWELS.length)];
  const correctList = VOWEL_TARGETS[vowel];
  const correct = correctList[Math.floor(Math.random() * correctList.length)];

  const distractors: VowelOption[] = VOWELS.filter((item) => item !== vowel)
    .map((other) => VOWEL_TARGETS[other][Math.floor(Math.random() * VOWEL_TARGETS[other].length)])
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .map((item, index) =>
      buildOption({
        id: `${item.word}-${index}`,
        emoji: item.emoji,
        word: item.word,
        correct: false,
      }),
    );

  const round: DragRound = {
    vowel,
    options: [
      buildOption({
        id: `${correct.word}-certo`,
        emoji: correct.emoji,
        word: correct.word,
        correct: true,
      }),
      ...distractors,
    ].sort(() => Math.random() - 0.5),
  };

  return round;
}

export function VowelsAdventure() {
  const { scores, addScore, recordModuleCompletion, narrate } = useGame();
  const [selected, setSelected] = useState<(typeof VOWELS)[number]>("A");
  const [round, setRound] = useState<DragRound>(() => createRound("A"));

  const exampleWords = useMemo(
    () =>
      VOWELS.map((vowel) => ({
        vowel,
        sample: VOWEL_TARGETS[vowel][0]?.word ?? "",
      })),
    [],
  );

  const handleSelect = (vowel: (typeof VOWELS)[number]) => { setSelected(vowel); setRound(createRound(vowel)); addScore("vowels", 5, { metric: "vowelMatches", effect: "click", speak: `Letra ${vowel}` }); narrate(`Excelente escolha! Vamos combinar a letra ${vowel} com a figura correta.`);
  };

  const handleDrop = (targetId: string, droppedVowel: string | null) => {
    setRound((current) => {
      const next: DragRound = {
        ...current,
        options: current.options.map((option) => {
          if (option.id !== targetId) {
            return { ...option, state: "idle" };
          }

          if (option.correct && droppedVowel === current.vowel) {
            addScore("vowels", 10, {
              metric: "vowelMatches",
              effect: "success",
              speak: `${current.vowel} de ${option.word}`,
            });
            recordModuleCompletion("vowels");
            window.setTimeout(() => setRound(createRound()), 1100);
            return { ...option, state: "correct" };
          }

          addScore("vowels", 0, { effect: "error" });
          return { ...option, state: "incorrect" };
        }),
      };
      return next;
    });
  };

  return (
    <div>
      <ActivityHeader
        title="Vogais Mágicas"
        subtitle="Pratique identificação de vogais e faça combinações com os habitantes do oceano."
        moduleId="vowels"
        icon="??"
        score={scores.vowels}
      />

      <ActivitySection>
        <h2 className="mb-4 text-2xl font-bold text-shell">Escolha uma letra</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {exampleWords.map(({ vowel, sample }) => (
            <button
              key={vowel}
              onClick={() => handleSelect(vowel)}
              className={`glass-card flex flex-col items-center justify-center gap-3 rounded-3xl p-5 text-3xl transition hover:-translate-y-1 hover:shadow-lg ${
                selected === vowel ? "ring-4 ring-seafoam" : ""
              }`}
            >
              <span className="text-4xl font-bold text-deep-blue">{vowel}</span>
              <span className="text-xs uppercase tracking-wide text-reef-shell/70">{sample}</span>
            </button>
          ))}
        </div>
      </ActivitySection>

      <ActivitySection>
        <h2 className="mb-4 text-2xl font-bold text-shell">Arraste a letra até a figura certa</h2>
        <div className="flex flex-col gap-6 md:flex-row">
          <Card className="flex h-full min-h-[200px] flex-col items-center justify-center gap-4 p-8 text-center">
            <span
              draggable
              onDragStart={(event) => {
                event.dataTransfer?.setData("text/plain", round.vowel);
                event.dataTransfer?.setDragImage(event.currentTarget, 40, 40);
              }}
              className="bubble-inset flex h-28 w-28 cursor-grab items-center justify-center rounded-3xl bg-white/20 text-6xl font-bold text-deep-blue shadow-lagoon"
            >
              {round.vowel}
            </span>
            <p className="text-sm text-reef-shell/70">Também é possível tocar na figura para responder.</p>
          </Card>
          <div className="grid flex-1 gap-5 sm:grid-cols-3">
            {round.options.map((option) => (
              <div
                key={option.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const data = event.dataTransfer?.getData("text/plain") ?? null;
                  handleDrop(option.id, data);
                }}
                onClick={() => handleDrop(option.id, round.vowel)}
                className={`glass-card flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl p-6 text-center transition hover:-translate-y-1 ${
                  option.state === "correct"
                    ? "bg-reef-algae/80 text-reef-shell scale-110"
                    : option.state === "incorrect"
                      ? "bg-reef-coral/80 text-shell"
                      : ""
                }`}
              >
                <span className="text-5xl md:text-6xl\" aria-hidden="true">
                  {option.emoji}
                </span>
                <span className="text-xl font-semibold">{option.word}</span>
              </div>
            ))}
          </div>
        </div>
      </ActivitySection>
    </div>
  );
}


