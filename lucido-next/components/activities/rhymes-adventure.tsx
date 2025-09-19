"use client";

import { useMemo, useState } from "react";

import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { BubbleOption } from "@/components/ui/bubble-option";
import { RHYME_ROUNDS } from "@/lib/game-data";

type RhymeRound = (typeof RHYME_ROUNDS)[number];

function randomRound(): RhymeRound {
  return RHYME_ROUNDS[Math.floor(Math.random() * RHYME_ROUNDS.length)];
}

export function RhymesAdventure() {
  const { scores, addScore, recordModuleCompletion } = useGame();
  const [round, setRound] = useState<RhymeRound>(() => randomRound());
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");

  const options = useMemo(() => {
    const merged = [...round.rhymes, ...round.wrong];
    return merged.sort(() => Math.random() - 0.5);
  }, [round]);

  const rhymeSet = useMemo(() => new Set<string>(round.rhymes), [round]);

  const checkAnswer = (word: string) => {
    setSelected(word);
    const isCorrect = rhymeSet.has(word);
    if (isCorrect) {
      setFeedback("correct");
      addScore("rhymes", 15, { effect: "success", speak: `${round.word} rima com ${word}`, module: "rhymes" });
      recordModuleCompletion("rhymes");
      window.setTimeout(() => {
        setRound(randomRound());
        setSelected(null);
        setFeedback("idle");
      }, 1200);
    } else {
      setFeedback("incorrect");
      addScore("rhymes", 0, { effect: "error" });
      window.setTimeout(() => {
        setSelected(null);
        setFeedback("idle");
      }, 700);
    }
  };

  return (
    <div>
      <ActivityHeader
        title="Rimas das Marés"
        subtitle="Escolha palavras que combinam com o som do desafio."
        moduleId="rhymes"
        icon="🎵"
        score={scores.rhymes}
      />
      <ActivitySection>
        <p className="text-sm uppercase tracking-wide text-reef-shell/70">Palavra base</p>
        <h2 className="mb-6 text-3xl font-bold text-reef-shell">{round.word}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {options.map((word) => (
            <BubbleOption
              key={word}
              onClick={() => checkAnswer(word)}
              active={selected === word}
              state={selected === word ? feedback : "idle"}
              className="justify-center text-lg"
            >
              {word}
            </BubbleOption>
          ))}
        </div>
        {feedback === "correct" && <p className="mt-4 text-sm font-semibold text-reef-algae">Boa! Essa rima combina muito.</p>}
        {feedback === "incorrect" && <p className="mt-4 text-sm font-semibold text-reef-coral">Essa não rima, tente outra!</p>}
      </ActivitySection>
    </div>
  );
}
