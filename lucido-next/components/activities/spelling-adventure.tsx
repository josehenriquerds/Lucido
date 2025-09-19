"use client";

import { FormEvent, useMemo, useState } from "react";

import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { BubbleOption } from "@/components/ui/bubble-option";
import { Card } from "@/components/ui/card";

const VOWEL_REGEX = /[AEIOUÁÉÍÓÚÂÊÔÃÕ]/gi;
const CONSONANT_REGEX = /[BCDFGHJKLMNPQRSTVWXYZÇ]/gi;

function sanitizeWord(input: string) {
  return input
    .replace(/[^A-ZÁÉÍÓÚÂÊÔÃÕÇ]/gi, "")
    .toUpperCase();
}

function countMatches(source: string, regex: RegExp) {
  const matches = source.match(regex);
  return matches ? matches.length : 0;
}

function estimateSyllables(word: string) {
  const vowelGroups = word.split(/[^AEIOUÁÉÍÓÚÂÊÔÃÕ]+/).filter(Boolean).length;
  if (vowelGroups <= 1) return 1;
  return Math.max(1, Math.round(vowelGroups * 0.9));
}

type SpellQuestion = {
  id: string;
  prompt: string;
  answer: string;
  options?: string[];
  type: "choice" | "input";
};

function buildQuestions(word: string): SpellQuestion[] {
  const vowels = countMatches(word, VOWEL_REGEX);
  const consonants = countMatches(word, CONSONANT_REGEX);
  const letters = word.length;
  const firstLetter = word[0] ?? "";
  const lastLetter = word[word.length - 1] ?? "";
  const syllables = estimateSyllables(word);

  const numberOptions = (correct: number) => {
    const base = new Set([correct]);
    while (base.size < 4) {
      const variation = Math.max(0, correct + Math.floor(Math.random() * 5) - 2);
      base.add(variation);
    }
    return Array.from(base).sort((a, b) => a - b).map(String);
  };

  return [
    {
      id: "vowels",
      prompt: "Quantas vogais essa palavra tem?",
      answer: String(vowels),
      options: numberOptions(vowels),
      type: "choice",
    },
    {
      id: "consonants",
      prompt: "Quantas consoantes essa palavra tem?",
      answer: String(consonants),
      options: numberOptions(consonants),
      type: "choice",
    },
    {
      id: "letters",
      prompt: "Quantas letras no total?",
      answer: String(letters),
      options: numberOptions(letters),
      type: "choice",
    },
    {
      id: "first",
      prompt: "Qual é a primeira letra?",
      answer: firstLetter,
      type: "input",
    },
    {
      id: "last",
      prompt: "Qual é a última letra?",
      answer: lastLetter,
      type: "input",
    },
    {
      id: "syllables",
      prompt: "Quantas batidas sonoras (sílabas) você percebe?",
      answer: String(syllables),
      options: numberOptions(syllables),
      type: "choice",
    },
  ];
}

export function SpellingAdventure() {
  const { scores, addScore, recordModuleCompletion, narrate } = useGame();
  const [wordInput, setWordInput] = useState("");
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [questions, setQuestions] = useState<SpellQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");

  const activeQuestion = questions[index];

  const spelledWord = useMemo(() => {
    if (!currentWord) return "";
    return currentWord.split("").join(" · ");
  }, [currentWord]);

  const handleSubmitWord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sanitized = sanitizeWord(wordInput);
    if (!sanitized) {
      setFeedback("incorrect");
      narrate("Digite uma palavra para começarmos.");
      return;
    }

    setCurrentWord(sanitized);
    setQuestions(buildQuestions(sanitized));
    setIndex(0);
    setFeedback("idle");
    narrate(`Vamos soletrar ${sanitized.split("").join(", ")}`);
    addScore("words", 8, {
      speak: `Soletrando ${sanitized}`,
      effect: "transition",
      module: "spelling",
    });
  };

  const handleChoice = (value: string) => {
    if (!activeQuestion || !currentWord) return;
    const normalized = value.trim().toUpperCase();
    const correct = activeQuestion.answer.toUpperCase();
    const isCorrect = normalized === correct;

    if (isCorrect) {
      setFeedback("correct");
      addScore("spelling", 12, {
        effect: "success",
        speak: "Resposta certa!",
        module: "spelling",
      });
      if (index + 1 >= questions.length) {
        recordModuleCompletion("spelling");
        narrate("Você completou todos os desafios dessa palavra!");
      }
      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setFeedback("idle");
      }, 900);
    } else {
      setFeedback("incorrect");
      addScore("spelling", 0, { effect: "error" });
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  const finished = Boolean(currentWord) && index >= questions.length;

  return (
    <div>
      <ActivityHeader
        title="Laboratório do Som"
        subtitle="Digite qualquer palavra, ouça a soletração e responda perguntas sobre ela."
        moduleId="spelling"
        icon="🔤"
        score={scores.spelling}
      />

      <ActivitySection>
        <form onSubmit={handleSubmitWord} className="flex flex-col gap-4 text-reef-shell">
          <label className="text-sm uppercase tracking-wide text-reef-shell/70">
            Escolha uma palavra para explorarmos
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={wordInput}
              onChange={(event) => setWordInput(event.target.value)}
              placeholder="Ex: oceano"
              className="flex-1 rounded-bubble border border-reef-sand/40 bg-white/10 px-4 py-3 text-lg text-reef-shell shadow-inner focus:border-reef-sand"
            />
            <button
              type="submit"
              className="rounded-bubble bg-reef-coral px-6 py-3 text-sm font-bold text-reef-shell shadow-coral transition hover:-translate-y-0.5"
            >
              Soletrar
            </button>
          </div>
          {currentWord && (
            <Card variant="reef" className="p-5 text-center text-2xl font-bold tracking-[0.6em] text-reef-shell">
              {spelledWord}
            </Card>
          )}
        </form>
      </ActivitySection>

      {activeQuestion && (
        <ActivitySection>
          <h2 className="mb-4 text-xl font-bold text-reef-shell">Pergunta {index + 1} de {questions.length}</h2>
          <p className="mb-4 text-reef-shell/80">{activeQuestion.prompt}</p>
          {activeQuestion.type === "choice" && activeQuestion.options ? (
            <div className="flex flex-wrap gap-3">
              {activeQuestion.options.map((option) => (
                <BubbleOption
                  key={option}
                  onClick={() => handleChoice(option)}
                  state={feedback === "correct" ? "correct" : feedback === "incorrect" ? "incorrect" : "idle"}
                  className="min-w-[72px] justify-center"
                >
                  {option}
                </BubbleOption>
              ))}
            </div>
          ) : (
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                const input = new FormData(event.currentTarget).get("answer");
                handleChoice(String(input ?? ""));
              }}
            >
              <input
                name="answer"
                autoComplete="off"
                className="rounded-bubble border border-reef-sand/40 bg-white/10 px-4 py-3 text-lg text-reef-shell focus:border-reef-sand"
              />
              <button
                type="submit"
                className="rounded-bubble bg-reef-teal px-6 py-3 text-sm font-semibold text-reef-shell shadow-lagoon transition hover:-translate-y-0.5"
              >
                Responder
              </button>
            </form>
          )}
          {feedback === "correct" && (
            <p className="mt-4 text-sm font-semibold text-reef-algae">Excelente! Vamos para a próxima correnteza.</p>
          )}
          {feedback === "incorrect" && (
            <p className="mt-4 text-sm font-semibold text-reef-coral">Quase! Tente novamente observando a palavra.</p>
          )}
        </ActivitySection>
      )}

      {finished && currentWord && (
        <ActivitySection>
          <h2 className="mb-2 text-xl font-bold text-reef-shell">Missão concluída!</h2>
          <p className="text-reef-shell/80">
            Você explorou a palavra <strong>{currentWord}</strong>. Escolha outra palavra para continuar enchendo o aquário.
          </p>
          <button
            onClick={() => {
              setWordInput("");
              setCurrentWord(null);
              setQuestions([]);
              setIndex(0);
              setFeedback("idle");
            }}
            className="mt-4 rounded-bubble bg-reef-sand px-5 py-3 text-sm font-semibold text-reef-shadow shadow-shell hover:-translate-y-0.5"
          >
            Escolher nova palavra
          </button>
        </ActivitySection>
      )}
    </div>
  );
}
