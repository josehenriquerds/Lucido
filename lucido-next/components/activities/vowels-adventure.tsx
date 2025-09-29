"use client";

import { useMemo, useState } from "react";

import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { Card } from "@/components/ui/card";
import { LetterCard } from "@/components/ui/letter-card";
import { Sparkles } from "lucide-react";
import { VOWEL_TARGETS } from "@/lib/game-data";
import { DndProvider, Draggable, Droppable, DragOverlayPortal } from "@/components/dnd";
import { DragEndEvent } from "@dnd-kit/core";

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
  const [draggedVowel, setDraggedVowel] = useState<string | null>(null);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedVowel(null);

    if (!over) return;

    const targetId = over.id as string;
    const droppedVowel = active.id as string;

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

  const handleOptionClick = (targetId: string) => {
    handleDragEnd({
      active: { id: round.vowel },
      over: { id: targetId }
    } as DragEndEvent);
  };

  return (
    <DndProvider
      onDragStart={(event) => setDraggedVowel(event.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div>
        <ActivityHeader
          title="Vogais Mágicas"
          subtitle="Pratique identificação de vogais e faça combinações com os habitantes do oceano."
          moduleId="vowels"
          icon={<Sparkles className="w-6 h-6" />}
          score={scores.vowels}
        />

      <ActivitySection>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-reef-shadow mb-2">Escolha uma letra</h2>
          <p className="text-sm text-reef-shadow/70">Toque em uma vogal para praticar</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {exampleWords.map(({ vowel, sample }) => (
            <div key={vowel} className="relative">
              <LetterCard
                value={vowel}
                asButton
                onClick={() => handleSelect(vowel)}
                pressed={selected === vowel}
                className={selected === vowel ? "ring-4 ring-blue-500/70 ring-offset-2" : ""}
              >
                <p className="mt-2 text-xs uppercase tracking-wide text-reef-shadow/60 text-center">
                  {sample}
                </p>
              </LetterCard>
            </div>
          ))}
        </div>
      </ActivitySection>

      <ActivitySection>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-reef-shadow mb-2">Encontre a figura que combina</h2>
          <p className="text-sm text-reef-shadow/70">Arraste a letra ou toque na figura correta</p>
        </div>
        <div className="flex flex-col gap-6 md:flex-row">
          <Card className="flex h-full min-h-[200px] flex-col items-center justify-center gap-4 p-6 text-center">
            <Draggable id={round.vowel}>
              {({ setNodeRef, attributes, listeners, style, isDragging }) => (
                <div
                  ref={setNodeRef}
                  style={style}
                  {...attributes}
                  {...listeners}
                  className={`drag-handle touch-none ${isDragging ? 'opacity-50' : ''}`}
                  aria-label={`Arrastar letra ${round.vowel}`}
                >
                  <LetterCard
                    value={round.vowel}
                    emphasized
                    className="w-32 h-32"
                  />
                </div>
              )}
            </Draggable>
            <p className="text-sm text-reef-shadow/60">Arraste ou toque na figura</p>
          </Card>
          <div className="grid flex-1 gap-5 sm:grid-cols-3">
            {round.options.map((option) => (
              <Droppable key={option.id} id={option.id}>
                {({ setNodeRef, isOver }) => (
                  <div
                    ref={setNodeRef}
                    onClick={() => handleOptionClick(option.id)}
                    className={`glass-card flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl p-6 text-center transition-all duration-300 hover:-translate-y-1 min-h-[160px] touch-manipulation ${
                      option.state === "correct"
                        ? "bg-green-100 border-green-500 border-2 scale-105 shadow-lg"
                        : option.state === "incorrect"
                          ? "bg-red-100 border-red-500 border-2 opacity-75"
                          : isOver
                            ? "drop-zone-over"
                            : "hover:shadow-lg"
                    }`}
                    aria-label={`Soltar letra na opção ${option.word}`}
                  >
                    <span className="text-5xl md:text-6xl transition-transform duration-300" aria-hidden="true">
                      {option.emoji}
                    </span>
                    <span className="text-lg font-semibold text-reef-shadow">{option.word}</span>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </ActivitySection>

      {/* DragOverlay para feedback visual */}
      <DragOverlayPortal className="dnd-overlay">
        {draggedVowel ? (
          <LetterCard
            value={draggedVowel}
            emphasized
            className="w-32 h-32"
          />
        ) : null}
      </DragOverlayPortal>
    </div>
    </DndProvider>
  );
}


