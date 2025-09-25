"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { SyllableHalf } from "@/components/ui/syllable-half";
import { WordTarget } from "@/components/ui/word-target";
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

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function Celebration({ words, onContinue }: { words: CompletedWord[]; onContinue: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-in fade-in duration-300">
      <div className="mx-4 max-w-md rounded-3xl bg-white/95 p-8 text-center shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
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
          {words.map((word, index) => (
            <div
              key={word.word}
              className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50"
              style={{ animationDelay: `${index * 200}ms` }}
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
}

export function SyllableJoinAdventure() {
  const { scores, addScore, recordModuleCompletion } = useGame();

  // Configuração da rodada
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [gameState, setGameState] = useState<GameState>("playing");

  // Palavras da rodada atual
  const [currentRound, setCurrentRound] = useState<Array<typeof SYLLABLE_JOIN_WORDS[number]>>([]);
  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);

  // Estado do jogo
  const [availableSyllables, setAvailableSyllables] = useState<string[]>([]);
  const [wordTargets, setWordTargets] = useState<Record<string, [string | null, string | null]>>({});
  const [usedSyllables, setUsedSyllables] = useState<Set<string>>(new Set());

  // Mapeamento de pares esperados
  const expectedPairs = useMemo(() => {
    const pairs: Record<string, string> = {};
    currentRound.forEach(word => {
      const [syl1, syl2] = word.silabas;
      pairs[syl1] = syl2;
      pairs[syl2] = syl1;
    });
    return pairs;
  }, [currentRound]);

  // Inicializar rodada
  const initializeRound = useCallback(() => {
    const wordCount = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
    const selectedWords = shuffle([...SYLLABLE_JOIN_WORDS]).slice(0, wordCount);

    setCurrentRound(selectedWords);
    setCompletedWords([]);
    setGameState("playing");

    // Criar lista de sílabas disponíveis
    const syllables: string[] = [];
    const targets: Record<string, [string | null, string | null]> = {};

    selectedWords.forEach(word => {
      syllables.push(...word.silabas);
      targets[word.id] = [null, null];
    });

    setAvailableSyllables(shuffle(syllables));
    setWordTargets(targets);
    setUsedSyllables(new Set());
  }, [difficulty]);

  // Inicializar jogo
  useEffect(() => {
    initializeRound();
  }, [difficulty, initializeRound]);

  const handleSyllableConnect = (wordId: string, index: number, syllable: string) => {
    // Remover sílaba de outros lugares se já estava conectada
    setWordTargets(prev => {
      const updated = { ...prev };

      // Remover a sílaba de qualquer posição anterior
      Object.keys(updated).forEach(id => {
        updated[id] = updated[id].map(s => s === syllable ? null : s) as [string | null, string | null];
      });

      // Conectar na nova posição
      updated[wordId][index] = syllable;

      return updated;
    });

    setUsedSyllables(prev => new Set([...prev, syllable]));
  };

  const handleWordComplete = (wordId: string, completedWord: string) => {
    const word = currentRound.find(w => w.id === wordId);
    if (!word) return;

    // Verificar se a palavra está correta
    if (completedWord === word.palavra) {
      setCompletedWords(prev => [...prev, {
        word: word.palavra,
        emoji: word.emoji,
        syllables: word.silabas
      }]);

      addScore("syllable-join", 25, {
        effect: "success",
        speak: `Palavra ${word.palavra} formada!`
      });

      // Verificar se completou todas as palavras
      if (completedWords.length + 1 >= currentRound.length) {
        setGameState("celebrating");
        recordModuleCompletion("syllable-join");

        setTimeout(() => {
          setGameState("completed");
        }, 3000);
      }
    } else {
      // Palavra incorreta - resetar esse target
      setWordTargets(prev => ({
        ...prev,
        [wordId]: [null, null]
      }));

      addScore("syllable-join", 0, { effect: "error" });
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
        subtitle="Arraste e conecte metades de sílabas para formar palavras completas."
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
            {/* <RotateCcw className="w-4 h-4 mr-2" /> */}
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
              <SyllableHalf
                key={`${syllable}-${index}`}
                text={syllable}
                draggable={!usedSyllables.has(syllable)}
                disabled={usedSyllables.has(syllable)}
                className={usedSyllables.has(syllable) ? "opacity-30" : ""}
              />
            ))}
          </div>
        </div>

        {/* Alvos das palavras */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {currentRound.map(word => {
            const isCompleted = completedWords.some(cw => cw.word === word.palavra);

            return (
              <div key={word.id} className="text-center">
                <div className="mb-4">
                  <div className="sm:text-5xl mb-2" style={{ fontSize: "10rem", lineHeight: 1 }}>{word.emoji}</div>
                  {isCompleted ? (
                    <div className="text-lg font-bold text-green-600">
                      {word.silabas[0]}•{word.silabas[1]}
                    </div>
                  ) : (
                    <div className="text-sm text-reef-shadow/60">
                      {/* {word.categoria} */}
                    </div>
                  )
                  }
                </div>

                <WordTarget
                  syllables={word.silabas}
                  expectedPair={expectedPairs}
                  onComplete={(completedWord) => handleWordComplete(word.id, completedWord)}
                  isCompleted={isCompleted}
                  connectedSyllables={wordTargets[word.id]}
                  onSyllableConnect={(index, syllable) =>
                    handleSyllableConnect(word.id, index, syllable)
                  }
                  disabled={isCompleted}
                />
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
    </div>
  );
}