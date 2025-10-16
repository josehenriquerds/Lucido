"use client";

import { useCallback, useEffect, useState, memo } from "react";
import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { BubbleOption } from "@/components/ui/bubble-option";
import { Puzzle, RotateCcw, Trophy, Lightbulb } from "lucide-react";
import { SYLLABLE_JOIN_WORDS } from "@/lib/game-data";
import { cn } from "@/lib/utils";
import { ConfettiBurst } from "@/components/ui/confetti-burst";

type GameState = "playing" | "celebrating" | "completed";

interface CompletedWord {
  word: string;
  emoji: string;
  syllables: readonly [string, string];
}

type SyllableInstance = {
  syllable: string;
  id: string;
};

interface SyllableTileProps {
  syllable: string;
  syllableId: string;
  onDragStart?: (syllableId: string) => void;
  disabled?: boolean;
  isUsed?: boolean;
}

function SyllableTile({ syllable, syllableId, onDragStart, disabled = false, isUsed = false }: SyllableTileProps) {
  const handleDragStart = (e: React.DragEvent) => {
    if (disabled || isUsed) return;
    e.dataTransfer.setData("text/plain", syllable);
    e.dataTransfer.setData("syllableId", syllableId);
    onDragStart?.(syllableId);
  };

  const handleClick = () => {
    if (!disabled && !isUsed) {
      onDragStart?.(syllableId);
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
  slots: (SyllableInstance | null)[];
  expectedSyllables: readonly [string, string];
  emoji: string;
  wordId: string;
  isCompleted: boolean;
  onDropSyllable: (wordId: string, slotIndex: number, syllable: string, syllableId: string) => void;
  onRemoveSyllable: (wordId: string, slotIndex: number) => void;
  isShaking?: boolean;
}

function WordSlot({ slots, expectedSyllables, emoji, wordId, isCompleted, onDropSyllable, onRemoveSyllable, isShaking = false }: WordSlotProps) {
  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    const syllable = e.dataTransfer.getData("text/plain");
    const syllableId = e.dataTransfer.getData("syllableId");
    if (syllable && !isCompleted) {
      onDropSyllable(wordId, slotIndex, syllable, syllableId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSlotDragStart = (e: React.DragEvent, slotIndex: number) => {
    const slotEntry = slots[slotIndex];
    const syllable = slotEntry?.syllable;
    if (syllable && !isCompleted) {
      e.dataTransfer.setData("text/plain", syllable);
      if (slotEntry?.id) {
        e.dataTransfer.setData("syllableId", slotEntry.id);
      }
      // Free the slot immediately so a new syllable can be dropped while dragging
      setTimeout(() => {
        onRemoveSyllable(wordId, slotIndex);
      }, 0);
    }
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
        {[0, 1].map((slotIndex) => {
          const slotEntry = slots[slotIndex];
          const hasSyllable = Boolean(slotEntry);

          return (
            <div
              key={slotIndex}
              className={cn(
                "relative flex items-center justify-center font-bold shadow-inner transition-all duration-200",
                "h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-2xl",
                "text-2xl sm:text-3xl md:text-4xl",
                "border-2 border-dashed",
                {
                  "border-green-500 bg-green-50 text-green-700": hasSyllable && isCompleted,
                  "border-purple-400 bg-purple-50 text-purple-700 cursor-grab active:cursor-grabbing": hasSyllable && !isCompleted,
                  "border-gray-300 bg-white text-gray-400": !hasSyllable,
                  "animate-shake": isShaking,
                }
              )}
              draggable={hasSyllable && !isCompleted}
              onDragStart={(e) => handleSlotDragStart(e, slotIndex)}
              onDrop={(e) => handleDrop(e, slotIndex)}
              onDragOver={handleDragOver}
            >
              {slotEntry?.syllable ?? "?"}
            </div>
          );
        })}
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
  const [showFish, setShowFish] = useState(false);

  useEffect(() => {
    // Mostrar o peixinho após um pequeno delay
    const fishTimer = setTimeout(() => {
      setShowFish(true);
    }, 100);

    // Auto-iniciar novo jogo após 6 segundos
    const continueTimer = setTimeout(() => {
      onContinue();
    }, 10000);

    return () => {
      clearTimeout(fishTimer);
      clearTimeout(continueTimer);
    };
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-5000">
      <div className="relative mx-4 max-w-md w-full rounded-[2.5rem] bg-white p-8 sm:p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500">
        {/* Confete decorativo */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2 text-4xl animate-bounce">
          <span className="inline-block animate-spin" style={{ animationDuration: '3s' }}>🎊</span>
          <span className="inline-block animate-spin" style={{ animationDuration: '2s', animationDelay: '0.2s' }}>✨</span>
          <span className="inline-block animate-spin" style={{ animationDuration: '3s', animationDelay: '0.4s' }}>🎉</span>
        </div>

        {/* Peixinho animado chegando */}
        {showFish && (
          <div className="mb-6 animate-in slide-in-from-bottom-10 duration-7000 zoom-in-95">
            <img
              src="/amiguinho/pexe01.png"
              alt="Amiguinho"
              className="w-32 h-32 mx-auto animate-bounce"
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                animationDuration: '1s'
              }}
            />
            <div className="mt-4 text-5xl font-black text-gray-800 animate-pulse">
              Uhuuu!
            </div>
          </div>
        )}

        {/* Mensagem principal */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Parabéns! Você mandou muito bem!
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {words.length} palavra{words.length > 1 ? 's' : ''} completada{words.length > 1 ? 's' : ''} com sucesso! 🎉
          </p>
        </div>

        {/* Lista de palavras - mais sutil */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {words.map((word, index) => (
            <div
              key={word.word}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 animate-in fade-in duration-500"
              style={{ animationDelay: `${index * 100 + 500}ms` }}
            >
              <span className="text-xl">{word.emoji}</span>
              <span className="font-semibold text-sm text-gray-700">
                {word.syllables[0]}•{word.syllables[1]}
              </span>
            </div>
          ))}
        </div>

        {/* Botão de continuar */}
        <button
          onClick={onContinue}
          className="w-full px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
        >
          Continuar
        </button>

        {/* Indicador de progresso */}
        <div className="mt-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 animate-progress"
              style={{
                animation: 'progress 6s linear forwards'
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Próxima rodada em instantes...</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 6s linear forwards;
        }
      `}</style>
    </div>
  );
});

export function SyllableJoinAdventure() {
  const { scores, addScore, recordModuleCompletion } = useGame();

  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [gameState, setGameState] = useState<GameState>("playing");

  const [currentRound, setCurrentRound] = useState<Array<typeof SYLLABLE_JOIN_WORDS[number]>>([]);
  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);
  const [usedWordIds, setUsedWordIds] = useState<Set<string>>(new Set());

  const [availableSyllables, setAvailableSyllables] = useState<SyllableInstance[]>([]);
  const [wordSlots, setWordSlots] = useState<Record<string, [SyllableInstance | null, SyllableInstance | null]>>({});
  const [usedSyllableIds, setUsedSyllableIds] = useState<Set<string>>(new Set());

  const [shakingWordId, setShakingWordId] = useState<string | null>(null);
  const [syllableConfetti, setSyllableConfetti] = useState(false);
  const [wordConfetti, setWordConfetti] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintWordId, setHintWordId] = useState<string | null>(null);

  const initializeRound = useCallback(() => {
    const wordCount = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;

    setUsedWordIds(prevUsedIds => {
      // Filtrar palavras que ainda não foram usadas
      const availableWords = SYLLABLE_JOIN_WORDS.filter(word => !prevUsedIds.has(word.id));

      // Se não houver palavras suficientes disponíveis, resetar o pool
      const wordsToUse = availableWords.length >= wordCount
        ? availableWords
        : [...SYLLABLE_JOIN_WORDS];

      const selectedWords = shuffle([...wordsToUse]).slice(0, wordCount);

      // Atualizar o jogo com as palavras selecionadas
      setCurrentRound(selectedWords);
      setCompletedWords([]);
      setGameState("playing");

      const syllables: SyllableInstance[] = [];
      const slots: Record<string, [SyllableInstance | null, SyllableInstance | null]> = {};

      selectedWords.forEach((word) => {
        syllables.push({
          syllable: word.silabas[0],
          id: `${word.id}-0`,
        });
        syllables.push({
          syllable: word.silabas[1],
          id: `${word.id}-1`,
        });
        slots[word.id] = [null, null] as [SyllableInstance | null, SyllableInstance | null];
      });

      setAvailableSyllables(shuffle(syllables));
      setWordSlots(slots);
      setUsedSyllableIds(new Set());

      // Se resetamos o pool, limpar os IDs usados e adicionar apenas os novos
      if (availableWords.length < wordCount) {
        return new Set(selectedWords.map(w => w.id));
      } else {
        // Adicionar apenas os novos IDs aos já usados
        return new Set([...prevUsedIds, ...selectedWords.map(w => w.id)]);
      }
    });
  }, [difficulty]);

  useEffect(() => {
    initializeRound();
  }, [initializeRound]);

  const handleRemoveSyllable = (wordId: string, slotIndex: number) => {
    const slotEntry = wordSlots[wordId]?.[slotIndex] ?? null;

    setWordSlots(prev => {
      const updated = { ...prev };
      const slotsForWord = updated[wordId];
      if (slotsForWord) {
        const clonedSlots = [...slotsForWord] as [SyllableInstance | null, SyllableInstance | null];
        clonedSlots[slotIndex] = null;
        updated[wordId] = clonedSlots;
      }
      return updated;
    });

    if (slotEntry) {
      setUsedSyllableIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(slotEntry.id);
        return newSet;
      });
    }
  };

  const handleDropSyllable = (wordId: string, slotIndex: number, syllable: string, syllableId: string) => {
    const word = currentRound.find(w => w.id === wordId);
    if (!word) return;

    // Validate that the syllable belongs to this word
    const isSyllableValid = word.silabas[0] === syllable || word.silabas[1] === syllable;

    if (!isSyllableValid) {
      setShakingWordId(wordId);
      addScore("syllable-join", 0, { effect: "error" });

      setTimeout(() => {
        setShakingWordId(null);
      }, 500);

      return;
    }

    // Enforce the correct order for the slots
    const expectedSyllableForSlot = word.silabas[slotIndex];

    if (syllable !== expectedSyllableForSlot) {
      setShakingWordId(wordId);
      addScore("syllable-join", 0, { effect: "error" });

      setTimeout(() => {
        setShakingWordId(null);
      }, 500);

      return;
    }

    const resolvedSyllableId = syllableId || `${wordId}-${slotIndex}`;
    const previousEntry = wordSlots[wordId]?.[slotIndex] ?? null;
    const nextSlots = [...(wordSlots[wordId] || [null, null])] as [SyllableInstance | null, SyllableInstance | null];
    nextSlots[slotIndex] = { syllable, id: resolvedSyllableId };

    if (previousEntry) {
      setUsedSyllableIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(previousEntry.id);
        return newSet;
      });
    }

    setWordSlots(prev => ({
      ...prev,
      [wordId]: nextSlots,
    }));

    setUsedSyllableIds(prev => {
      const newSet = new Set(prev);
      newSet.add(resolvedSyllableId);
      return newSet;
    });

    // Trigger single-syllable confetti
    setSyllableConfetti(true);
    setTimeout(() => setSyllableConfetti(false), 2000);

    if (nextSlots[0]?.syllable && nextSlots[1]?.syllable) {
      const formedWord = `${nextSlots[0]!.syllable}${nextSlots[1]!.syllable}`;

      if (formedWord === word.palavra) {
        setWordConfetti(true);
        setTimeout(() => setWordConfetti(false), 3000);

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

          if (newCompleted.length >= currentRound.length) {
            setGameState("celebrating");
            recordModuleCompletion("syllable-join");

            setTimeout(() => {
              setGameState("completed");
            }, 3000);
          }

          return newCompleted;
        });
      }
    }
  };

  const handleNewGame = () => {
    initializeRound();
  };

  const handleCelebrationContinue = () => {
    // Ao invés de ir para "completed", inicia um novo jogo direto
    initializeRound();
  };

  const handleHint = () => {
    // Encontrar uma palavra incompleta
    const incompleteWord = currentRound.find(word => {
      const isCompleted = completedWords.some(cw => cw.word === word.palavra);
      return !isCompleted;
    });

    if (incompleteWord) {
      setHintWordId(incompleteWord.id);
      setShowHint(true);

      // Esconder a dica após 3 segundos
      setTimeout(() => {
        setShowHint(false);
        setHintWordId(null);
      }, 3000);
    }
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
            onClick={handleHint}
            state="idle"
            className="text-sm"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            Dica
          </BubbleOption>

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
            {availableSyllables.map(({ syllable, id }) => (
              <SyllableTile
                key={id}
                syllable={syllable}
                syllableId={id}
                isUsed={usedSyllableIds.has(id)}
              />
            ))}
          </div>
        </div>

        {/* Alvos das palavras */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {currentRound.map(word => {
            const isCompleted = completedWords.some(cw => cw.word === word.palavra);
            const isShaking = shakingWordId === word.id;
            const showHintForThisWord = showHint && hintWordId === word.id;

            return (
              <div key={word.id} className="relative">
                <WordSlot
                  wordId={word.id}
                  slots={wordSlots[word.id] || ([null, null] as [SyllableInstance | null, SyllableInstance | null])}
                  expectedSyllables={word.silabas}
                  emoji={word.emoji}
                  isCompleted={isCompleted}
                  onDropSyllable={handleDropSyllable}
                  onRemoveSyllable={handleRemoveSyllable}
                  isShaking={isShaking}
                />

                {showHintForThisWord && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-2 border-yellow-400 rounded-lg px-4 py-2 shadow-lg animate-bounce z-10">
                    <div className="text-sm font-bold text-yellow-800">
                      {word.silabas[0]} + {word.silabas[1]}
                    </div>
                  </div>
                )}
              </div>
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

      {/* Confetti ao acertar uma sílaba */}
      <ConfettiBurst
        active={syllableConfetti}
        emojis={["✨", "⭐", "💫"]}
        count={12}
        duration={2000}
      />

      {/* Confetti maior ao completar palavra inteira */}
      <ConfettiBurst
        active={wordConfetti}
        emojis={["🎉", "🎊", "✨", "⭐", "💫", "🌟", "🎈"]}
        count={40}
        duration={3000}
      />
    </div>
  );
}
