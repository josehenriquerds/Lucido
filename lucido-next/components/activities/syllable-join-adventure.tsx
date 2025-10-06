"use client";

import { useCallback, useEffect, useState, memo } from "react";
import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { BubbleOption } from "@/components/ui/bubble-option";
import { Puzzle, RotateCcw, Trophy } from "lucide-react";
import { SYLLABLE_JOIN_WORDS } from "@/lib/game-data";
import { cn } from "@/lib/utils";

type GameState = "playing" | "celebrating" | "completed";

interface CompletedWord {
  word: string;
  emoji: string;
  syllables: readonly [string, string];
}

interface SyllableTileProps {
  syllable: string;
  onDragStart?: () => void;
  disabled?: boolean;
  isUsed?: boolean;
}

function SyllableTile({ syllable, onDragStart, disabled = false, isUsed = false }: SyllableTileProps) {
  const handleDragStart = (e: React.DragEvent) => {
    if (disabled || isUsed) return;
    e.dataTransfer.setData("text/plain", syllable);
    onDragStart?.();
  };

  const handleClick = () => {
    if (!disabled && !isUsed) {
      onDragStart?.();
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center font-bold transition-all duration-300 select-none",
        "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl",
        "text-xl sm:text-2xl md:text-3xl",
        "shadow-lg border-2",
        {
          "bg-white border-purple-400 text-purple-700 cursor-grab active:cursor-grabbing hover:shadow-xl hover:-translate-y-1":
            !disabled && !isUsed,
          "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-30":
            isUsed,
        }
      )}
      draggable={!disabled && !isUsed}
      onDragStart={handleDragStart}
      onClick={handleClick}
      aria-label={`Sílaba ${syllable}`}
    >
      <span className="relative z-10 font-extrabold">{syllable}</span>
      {!disabled && !isUsed && (
        <div
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            background: `radial-gradient(circle at 30% 30%, white, transparent)`,
          }}
        />
      )}
    </div>
  );
}

interface WordSlotProps {
  slots: (string | null)[];
  expectedSyllables: readonly [string, string];
  emoji: string;
  wordId: string;
  isCompleted: boolean;
  onDropSyllable: (wordId: string, slotIndex: number, syllable: string) => void;
}

function WordSlot({ slots, expectedSyllables, emoji, wordId, isCompleted, onDropSyllable }: WordSlotProps) {
  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    const syllable = e.dataTransfer.getData("text/plain");
    if (syllable && !isCompleted) {
      onDropSyllable(wordId, slotIndex, syllable);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="text-6xl sm:text-7xl md:text-8xl mb-2">{emoji}</div>
        {isCompleted && (
          <div className="text-lg font-bold text-green-600">
            {expectedSyllables[0]}•{expectedSyllables[1]}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
        {[0, 1].map((slotIndex) => (
          <div
            key={slotIndex}
            className={cn(
              "relative flex items-center justify-center font-bold shadow-inner transition-all duration-200",
              "h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-2xl",
              "text-2xl sm:text-3xl md:text-4xl",
              "border-2 border-dashed",
              {
                "border-green-500 bg-green-50 text-green-700": slots[slotIndex] && isCompleted,
                "border-purple-400 bg-purple-50 text-purple-700": slots[slotIndex] && !isCompleted,
                "border-gray-300 bg-white text-gray-400": !slots[slotIndex],
              }
            )}
            onDrop={(e) => handleDrop(e, slotIndex)}
            onDragOver={handleDragOver}
          >
            {slots[slotIndex] || "?"}
          </div>
        ))}
      </div>
    </div>
  );
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const Celebration = memo(function Celebration({ words, onContinue }: { words: CompletedWord[]; onContinue: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="mx-4 max-w-md rounded-3xl bg-white/95 p-8 text-center shadow-2xl">
        <div className="mb-6">
          <Trophy className="mx-auto w-16 h-16 text-yellow-500 mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-reef-coral">
            🎉 Parabéns! 🎉
          </h2>
          <p className="mt-2 text-reef-shadow/80">
            Você completou {words.length} palavra{words.length > 1 ? 's' : ''}!
          </p>
        </div>

        <div className="mb-6 space-y-3">
          {words.map((word) => (
            <div
              key={word.word}
              className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50"
            >
              <span className="text-2xl">{word.emoji}</span>
              <span className="font-bold text-lg">
                {word.syllables[0]}•{word.syllables[1]}
              </span>
            </div>
          ))}
        </div>

        <BubbleOption onClick={onContinue} state="idle">
          Continuar Aventura
        </BubbleOption>
      </div>
    </div>
  );
});

export function SyllableJoinAdventure() {
  const { scores, addScore, recordModuleCompletion } = useGame();

  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [gameState, setGameState] = useState<GameState>("playing");

  const [currentRound, setCurrentRound] = useState<Array<typeof SYLLABLE_JOIN_WORDS[number]>>([]);
  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);

  const [availableSyllables, setAvailableSyllables] = useState<string[]>([]);
  const [wordSlots, setWordSlots] = useState<Record<string, [string | null, string | null]>>({});
  const [usedSyllables, setUsedSyllables] = useState<Set<string>>(new Set());

  const initializeRound = useCallback(() => {
    const wordCount = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
    const selectedWords = shuffle([...SYLLABLE_JOIN_WORDS]).slice(0, wordCount);

    setCurrentRound(selectedWords);
    setCompletedWords([]);
    setGameState("playing");

    const syllables: string[] = [];
    const slots: Record<string, [string | null, string | null]> = {};

    selectedWords.forEach(word => {
      syllables.push(...word.silabas);
      slots[word.id] = [null, null];
    });

    setAvailableSyllables(shuffle(syllables));
    setWordSlots(slots);
    setUsedSyllables(new Set());
  }, [difficulty]);

  useEffect(() => {
    initializeRound();
  }, [initializeRound]);

  const handleDropSyllable = (wordId: string, slotIndex: number, syllable: string) => {
    // Verificar se a sílaba já está sendo usada
    if (usedSyllables.has(syllable)) return;

    // Atualizar slots
    setWordSlots(prev => {
      const updated = { ...prev };
      updated[wordId][slotIndex] = syllable;
      return updated;
    });

    setUsedSyllables(prev => new Set([...prev, syllable]));

    // Verificar se a palavra foi completada
    const updatedSlots = [...wordSlots[wordId]];
    updatedSlots[slotIndex] = syllable;

    if (updatedSlots[0] && updatedSlots[1]) {
      const word = currentRound.find(w => w.id === wordId);
      if (!word) return;

      const formedWord = updatedSlots.join("");

      if (formedWord === word.palavra) {
        // Palavra correta!
        addScore("syllable-join", 25, {
          effect: "success",
          speak: `Palavra ${word.palavra} formada!`
        });

        setCompletedWords(prev => {
          const newCompleted = [...prev, {
            word: word.palavra,
            emoji: word.emoji,
            syllables: word.silabas
          }];

          // Verificar se completou TODAS as palavras
          if (newCompleted.length >= currentRound.length) {
            setGameState("celebrating");
            recordModuleCompletion("syllable-join");

            setTimeout(() => {
              setGameState("completed");
            }, 3000);
          }

          return newCompleted;
        });
      } else {
        // Palavra incorreta - resetar
        setTimeout(() => {
          setWordSlots(prev => ({
            ...prev,
            [wordId]: [null, null]
          }));
          setUsedSyllables(prev => {
            const newSet = new Set(prev);
            updatedSlots.forEach(s => s && newSet.delete(s));
            return newSet;
          });
        }, 500);

        addScore("syllable-join", 0, { effect: "error" });
      }
    }
  };

  const handleNewGame = () => {
    initializeRound();
  };

  const handleCelebrationContinue = () => {
    setGameState("completed");
  };

  if (gameState === "celebrating") {
    return <Celebration words={completedWords} onContinue={handleCelebrationContinue} />;
  }

  return (
    <div className="relative">
      <ActivityHeader
        title="Junte as Sílabas"
        subtitle="Arraste e conecte sílabas para formar palavras completas."
        moduleId="syllable-join"
        icon={<Puzzle className="w-6 h-6" />}
        score={scores["syllable-join"] || 0}
      />

      <ActivitySection>
        {/* Controles de dificuldade */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <span className="text-sm font-semibold text-reef-shadow/60">Nível:</span>
          <div className="flex rounded-full border border-reef-shadow/10 bg-white/80 overflow-hidden">
            {(["easy", "medium", "hard"] as const).map(level => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition",
                  difficulty === level
                    ? "bg-purple-500 text-white"
                    : "text-reef-shadow/70 hover:bg-purple-50"
                )}
              >
                {level === "easy" ? "Fácil (3)" : level === "medium" ? "Médio (4)" : "Difícil (5)"}
              </button>
            ))}
          </div>

          <BubbleOption
            onClick={handleNewGame}
            state="idle"
            className="ml-auto text-sm"
          >
            Novo Jogo
          </BubbleOption>
        </div>

        {/* Área de sílabas disponíveis */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-reef-shadow/70 mb-4 text-center">
            Sílabas Disponíveis
          </h3>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 max-w-4xl mx-auto">
            {availableSyllables.map((syllable, index) => (
              <SyllableTile
                key={`${syllable}-${index}`}
                syllable={syllable}
                isUsed={usedSyllables.has(syllable)}
              />
            ))}
          </div>
        </div>

        {/* Alvos das palavras */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {currentRound.map(word => {
            const isCompleted = completedWords.some(cw => cw.word === word.palavra);

            return (
              <WordSlot
                key={word.id}
                wordId={word.id}
                slots={wordSlots[word.id] || [null, null]}
                expectedSyllables={word.silabas}
                emoji={word.emoji}
                isCompleted={isCompleted}
                onDropSyllable={handleDropSyllable}
              />
            );
          })}
        </div>

        {/* Status do progresso */}
        {gameState === "completed" && (
          <div className="mt-8 text-center">
            <div className="rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 p-6">
              <Trophy className="mx-auto w-12 h-12 text-yellow-500 mb-3" />
              <h3 className="text-xl font-bold text-reef-coral mb-2">
                Rodada Completa! 🎉
              </h3>
              <p className="text-reef-shadow/70 mb-4">
                Você formou {completedWords.length} palavra{completedWords.length > 1 ? 's' : ''} corretamente!
              </p>
              <BubbleOption onClick={handleNewGame} state="idle">
                <RotateCcw className="w-4 h-4 mr-2" />
                Jogar Novamente
              </BubbleOption>
            </div>
          </div>
        )}
      </ActivitySection>
    </div>
  );
}
