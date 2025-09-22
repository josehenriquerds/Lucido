"use client";

import { useEffect, useMemo, useState } from "react";

import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { Card } from "@/components/ui/card";
import { VOWEL_TARGETS } from "@/lib/game-data";

const VOWELS = Object.keys(VOWEL_TARGETS) as (keyof typeof VOWEL_TARGETS)[];

const CONSONANT_TARGETS: Record<string, { emoji: string; word: string }[]> = {
  B: [
    { emoji: "🐝", word: "ABELHA" },
    { emoji: "🥖", word: "BAGUETE" },
  ],
  C: [
    { emoji: "🐶", word: "CACHORRO" },
    { emoji: "🥥", word: "COCO" },
  ],
  D: [
    { emoji: "🎲", word: "DADO" },
    { emoji: "🦆", word: "PATO" },
  ],
  F: [
    { emoji: "🍟", word: "FRITAS" },
    { emoji: "🐟", word: "PEIXE" },
  ],
  M: [
    { emoji: "🐒", word: "MACACO" },
    { emoji: "🍝", word: "MACARRÃO" },
  ],
  P: [
    { emoji: "🎈", word: "PIPA" },
    { emoji: "🥐", word: "PÃO" },
  ],
  Q: [
    { emoji: "🧀", word: "QUEIJO" },
    { emoji: "❓", word: "QUEM" },
  ],
  S: [
    { emoji: "🐍", word: "SERPENTE" },
    { emoji: "🌞", word: "SOL" },
  ],
  T: [
    { emoji: "🍅", word: "TOMATE" },
    { emoji: "🚜", word: "TRATOR" },
  ],
  V: [
    { emoji: "🎻", word: "VIOLINO" },
    { emoji: "🌋", word: "VULCÃO" },
  ],
};

type Mode = "vogais" | "consoantes" | "mesclado" | "alfabeto";

type Option = {
  id: string;
  emoji: string;
  word: string;
  correct: boolean;
  state: "idle" | "correct" | "incorrect";
};

type Round = {
  letter: string;
  options: Option[];
};

function build(params: Partial<Option> & Pick<Option, "id" | "emoji" | "word" | "correct">): Option {
  return { state: "idle", ...params } as Option;
}

function poolForMode(mode: Mode): string[] {
  switch (mode) {
    case "vogais":
      return VOWELS as string[];
    case "consoantes":
      return Object.keys(CONSONANT_TARGETS);
    case "mesclado":
      return [...(VOWELS as string[]), ...Object.keys(CONSONANT_TARGETS)];
    case "alfabeto":
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    default:
      return VOWELS as string[];
  }
}

function targetsFor(letter: string): { emoji: string; word: string }[] {
  if ((VOWELS as string[]).includes(letter)) {
    return VOWEL_TARGETS[letter as keyof typeof VOWEL_TARGETS].map((item) => ({
      emoji: item.emoji,
      word: item.word,
    }));
  }
  if (CONSONANT_TARGETS[letter]) {
    return CONSONANT_TARGETS[letter].map((item) => ({
      emoji: item.emoji,
      word: item.word,
    }));
  }
  return [{ emoji: "🔤", word: letter }];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function createRound(mode: Mode, force?: string): Round {
  const pool = poolForMode(mode);
  const available = pool.length > 0 ? pool : ["A"];
  const letter = force && available.includes(force) ? force : available[Math.floor(Math.random() * available.length)];
  const correctChoices = targetsFor(letter);
  const correct = correctChoices[Math.floor(Math.random() * correctChoices.length)] ?? { emoji: "🔤", word: letter };

  const distractors = shuffle(available.filter((value) => value !== letter))
    .slice(0, 2)
    .map((other, index) => {
      const source = targetsFor(other)[0] ?? { emoji: "🔤", word: other };
      return build({ id: `${source.word}-${index}`, emoji: source.emoji, word: source.word, correct: false });
    });

  return {
    letter,
    options: shuffle([
      build({ id: `${correct.word}-certo`, emoji: correct.emoji, word: correct.word, correct: true }),
      ...distractors,
    ]),
  };
}

function initialRound(mode: Mode, force?: string): Round {
  const pool = poolForMode(mode);
  const available = pool.length > 0 ? pool : ["A"];
  const letter = force && available.includes(force) ? force : available[0];
  const correctSource = targetsFor(letter)[0] ?? { emoji: "🔤", word: letter };
  const distractors = available
    .filter((value) => value !== letter)
    .slice(0, 2)
    .map((other, index) => {
      const source = targetsFor(other)[0] ?? { emoji: "🔤", word: other };
      return build({ id: `${source.word}-${index}`, emoji: source.emoji, word: source.word, correct: false });
    });

  return {
    letter,
    options: [build({ id: `${correctSource.word}-certo`, emoji: correctSource.emoji, word: correctSource.word, correct: true }), ...distractors],
  };
}

export function VowelsAdventure() {
  const { scores, addScore, recordModuleCompletion, narrate } = useGame();
  const [mode, setMode] = useState<Mode>("vogais");
  const [selected, setSelected] = useState<string>("A");
  const [round, setRound] = useState<Round>(() => initialRound("vogais", "A"));
  const [celebrate, setCelebrate] = useState<null | { word: string; emoji: string }>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    setRound(createRound(mode, selected));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const letters = useMemo(
    () =>
      poolForMode(mode)
        .map((letter) => ({ letter, sample: targetsFor(letter)[0]?.word ?? "" }))
        .slice(0, 32),
    [mode],
  );

  const handleSelect = (letter: string) => {
    setSelected(letter);
    setRound(createRound(mode, letter));
    addScore("vowels", 5, { metric: "vowelMatches", effect: "click", speak: `Letra ${letter}` });
    narrate(`Excelente escolha! Vamos combinar a letra ${letter} com a figura correta.`);
    setPickerOpen(false);
  };

  const handleDrop = (targetId: string, dragged: string | null) => {
    setRound((current) => {
      const next: Round = {
        ...current,
        options: current.options.map((option) => {
          if (option.id !== targetId) {
            return { ...option, state: "idle" };
          }

          if (option.correct && dragged === current.letter) {
            addScore("vowels", 10, { metric: "vowelMatches", effect: "success", speak: `${current.letter} de ${option.word}` });
            recordModuleCompletion("vowels");
            setCelebrate({ word: option.word, emoji: option.emoji });
            window.setTimeout(() => {
              setCelebrate(null);
              setRound(createRound(mode));
            }, 1300);
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
    <div className="font-lexenddeca">
      <ActivityHeader
        title="Vogais Mágicas"
        subtitle="Pratique identificação de letras e faça combinações com os habitantes do oceano."
        moduleId="vowels"
        icon="🐚"
        score={scores.vowels}
      />

      <ActivitySection>
        <div className="mb-3 flex flex-wrap gap-2">
          {(["vogais", "consoantes", "mesclado", "alfabeto"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setRound(createRound(m, selected));
              }}
              className={`rounded-bubble px-3 py-2 text-sm font-semibold ${mode === m ? "bg-reef-teal text-white" : "bg-white text-reef-shadow"}`}
            >
              {m}
            </button>
          ))}
        </div>

        <h2 className="mb-4 text-3xl font-bold text-shell">Escolha uma letra</h2>

        <div className="relative inline-block">
          <button
            className="rounded-bubble bg-white px-5 py-3 text-lg font-semibold text-reef-shadow shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
            onClick={() => setPickerOpen((value) => !value)}
          >
            Letra: {selected} ▾
          </button>

          {pickerOpen && (
            <div className="absolute z-20 mt-2 w-[min(92vw,740px)] max-w-[740px] rounded-3xl bg-white p-4 shadow-[0_16px_32px_rgba(0,0,0,0.16)]">
              <div className="grid max-h-[60vh] grid-cols-4 gap-3 overflow-auto sm:grid-cols-6 md:grid-cols-8">
                {letters.map(({ letter, sample }) => (
                  <button
                    key={letter}
                    onClick={() => handleSelect(letter)}
                    className={`glass-card flex flex-col items-center justify-center gap-2 rounded-2xl p-4 text-2xl transition hover:-translate-y-1 hover:shadow-lg ${
                      selected === letter ? "ring-4 ring-seafoam" : ""
                    }`}
                  >
                    <span className="text-3xl font-bold text-deep-blue">{letter}</span>
                    <span className="text-[11px] uppercase tracking-wide text-reef-shell/70">{sample}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ActivitySection>

      <ActivitySection>
        <h2 className="mb-4 text-4xl font-bold text-shell">Arraste a letra até a figura certa</h2>
        <div className="flex flex-col gap-6 md:flex-row">
          <Card className="flex h-full min-h-[360px] flex-col items-center justify-center gap-6 p-10 text-center">
            <span
              draggable
              onDragStart={(event) => {
                event.dataTransfer?.setData("text/plain", round.letter);
                event.dataTransfer?.setDragImage(event.currentTarget, 48, 48);
              }}
              className="bubble-inset flex h-40 w-40 cursor-grab items-center justify-center rounded-3xl bg-white/20 text-8xl font-bold text-deep-blue shadow-lagoon"
            >
              {round.letter}
            </span>
            <p className="text-base md:text-lg text-reef-shell/70">Você também pode tocar na figura para responder.</p>
          </Card>

          <div className="grid flex-1 gap-6 sm:grid-cols-3">
            {round.options.map((option) => (
              <div
                key={option.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const data = event.dataTransfer?.getData("text/plain") ?? null;
                  handleDrop(option.id, data);
                }}
                onClick={() => handleDrop(option.id, round.letter)}
                className={`glass-card relative flex cursor-pointer flex-col items-center justify-center gap-5 rounded-3xl p-8 text-center transition hover:-translate-y-1 ${
                  option.state === "correct"
                    ? "bg-reef-algae/80 text-reef-shell scale-[1.02]"
                    : option.state === "incorrect"
                    ? "bg-reef-coral/80 text-shell"
                    : ""
                }`}
              >
                <span className="text-6xl md:text-7xl" aria-hidden="true">
                  {option.emoji}
                </span>
                <span className="text-2xl font-semibold">{option.word}</span>
                {option.state === "correct" && <span className="pointer-events-none absolute inset-0 rounded-3xl ring-4 ring-white/70" />}
              </div>
            ))}
          </div>
        </div>
      </ActivitySection>

      {celebrate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/20">
          <div className="rounded-3xl bg-white px-10 py-8 text-center shadow-lagoon">
            <div className="mb-3 text-7xl">{celebrate.emoji}</div>
            <div className="text-3xl font-chelsea text-reef-shadow">{celebrate.word}</div>
          </div>
        </div>
      )}
    </div>
  );
}

