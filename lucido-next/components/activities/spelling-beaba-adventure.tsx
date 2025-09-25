"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { LetterTile } from "@/components/ui/letter-tile";
import { CardBoard } from "@/components/ui/card-board";
import { BubbleOption } from "@/components/ui/bubble-option";
import { BookOpen, RotateCcw, Trophy, Lightbulb } from "lucide-react";
import { SPELLING_WORDS } from "@/lib/game-data";
import { cn } from "@/lib/utils";

type GameDifficulty = "easy" | "medium" | "hard";
type GameState = "playing" | "celebrating" | "completed";

interface CompletedWord {
  word: string;
  emoji: string;
  timeToComplete: number;
}

function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function Celebration({ words, onContinue }: { words: CompletedWord[]; onContinue: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-500">
      <div className="mx-4 max-w-lg rounded-3xl bg-white/95 p-8 text-center shadow-2xl animate-in slide-in-from-bottom-6 duration-700">
        <div className="mb-6">
          <Trophy className="mx-auto w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
          <h2 className="text-2xl sm:text-3xl font-bold text-reef-coral">
            🎉 Soletrando Completo! 🎉
          </h2>
          <p className="mt-2 text-reef-shadow/80">
            Você completou {words.length} palavra{words.length > 1 ? 's' : ''}!
          </p>
        </div>

        <div className="mb-6 space-y-3 max-h-40 overflow-y-auto">
          {words.map((word, index) => (
            <div
              key={word.word}
              className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{word.emoji}</span>
                <span className="font-bold text-lg text-amber-800">{word.word}</span>
              </div>
              <span className="text-sm text-amber-600">
                {word.timeToComplete.toFixed(1)}s
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

export function SpellingBeabaAdventure() {
  const { scores, addScore, recordModuleCompletion } = useGame();

  // Configurações do jogo
  const [difficulty, setDifficulty] = useState<GameDifficulty>("easy");
  const [gameState, setGameState] = useState<GameState>("playing");
  const [showHints, setShowHints] = useState(false);

  // Estado do jogo
  const [currentRound, setCurrentRound] = useState<Array<typeof SPELLING_WORDS[number]>>([]);
  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Filtrar palavras por dificuldade
  const getWordsByDifficulty = useCallback((diff: GameDifficulty) => {
    switch (diff) {
      case "easy":
        return SPELLING_WORDS.filter(w => w.letras.length === 3);
      case "medium":
        return SPELLING_WORDS.filter(w => w.letras.length === 4);
      case "hard":
        return SPELLING_WORDS.filter(w => w.letras.length === 5);
      default:
        return SPELLING_WORDS;
    }
  }, []);

  // Inicializar rodada
  const initializeRound = useCallback(() => {
    const availableWords = getWordsByDifficulty(difficulty);
    const wordCount = difficulty === "easy" ? 4 : difficulty === "medium" ? 3 : 2;
    const selectedWords = shuffle(availableWords).slice(0, wordCount);

    setCurrentRound(selectedWords);
    setCompletedWords([]);
    setGameState("playing");
    setStartTime(Date.now());

    // Gerar banco de letras
    const allNeededLetters: string[] = [];
    selectedWords.forEach(word => {
      allNeededLetters.push(...word.letras);
    });

    // Adicionar algumas letras extras para dificultar
    const extraLetters = ["B", "D", "F", "G", "H", "J", "K", "N", "Q", "W", "Y", "Z"];
    const shuffledExtras = shuffle(extraLetters);
    const extraCount = Math.min(6, selectedWords.length * 2);

    const finalLetterBank = shuffle([...allNeededLetters, ...shuffledExtras.slice(0, extraCount)]);
    setAvailableLetters(finalLetterBank);
    setUsedLetters(new Set());
  }, [difficulty, getWordsByDifficulty]);

  // Inicializar jogo
  useEffect(() => {
    initializeRound();
  }, [initializeRound]);

  const handleWordComplete = (word: string) => {
    const wordData = currentRound.find(w => w.palavra === word);
    if (!wordData) return;

    const timeToComplete = (Date.now() - startTime) / 1000;

    setCompletedWords(prev => [...prev, {
      word: wordData.palavra,
      emoji: wordData.emoji,
      timeToComplete
    }]);

    addScore("spelling-beaba", 30, {
      effect: "success",
      speak: `Palavra ${word} completada!`
    });

    // Verificar se completou todas as palavras
    if (completedWords.length + 1 >= currentRound.length) {
      setGameState("celebrating");
      recordModuleCompletion("spelling-beaba");

      setTimeout(() => {
        setGameState("completed");
      }, 4000);
    } else {
      setStartTime(Date.now()); // Reset timer para próxima palavra
    }
  };

  const handleLetterPlace = (wordIndex: number, slotIndex: number, letter: string) => {
    setUsedLetters(prev => new Set([...prev, letter]));
  };

  const handleNewGame = () => {
    initializeRound();
  };

  const handleCelebrationContinue = () => {
    setGameState("completed");
  };

  const getUsableLetters = () => {
    return availableLetters.filter(letter => {
      const letterCount = availableLetters.filter(l => l === letter).length;
      const usedCount = Array.from(usedLetters).filter(l => l === letter).length;
      return usedCount < letterCount;
    });
  };

  if (gameState === "celebrating") {
    return <Celebration words={completedWords} onContinue={handleCelebrationContinue} />;
  }

  return (
    <div className="relative">
      <ActivityHeader
        title="Soletrando (Be-a-Bá)"
        subtitle="Complete as palavras arrastando letras para os slots corretos."
        moduleId="spelling-beaba"
        icon={<BookOpen className="w-6 h-6" />}
        score={scores["spelling-beaba"] || 0}
      />

      <ActivitySection>
        {/* Controles */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <span className="text-sm font-semibold text-reef-shadow/60">Dificuldade:</span>
          <div className="flex rounded-full border border-reef-shadow/10 bg-white/80 overflow-hidden">
            {(["easy", "medium", "hard"] as const).map(level => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition",
                  difficulty === level
                    ? "bg-amber-500 text-white"
                    : "text-reef-shadow/70 hover:bg-amber-50"
                )}
              >
                {level === "easy" ? "Fácil (3)" : level === "medium" ? "Médio (4)" : "Difícil (5)"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowHints(!showHints)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition",
              showHints
                ? "bg-yellow-500 text-white"
                : "bg-white/80 text-reef-shadow/70 hover:bg-yellow-50"
            )}
          >
            <Lightbulb className="w-4 h-4" />
            Dicas
          </button>

          <BubbleOption
            onClick={handleNewGame}
            state="idle"
            className="ml-auto text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Novo Jogo
          </BubbleOption>
        </div>

        {/* Cards das palavras */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentRound.map((word, index) => {
            const isCompleted = completedWords.some(cw => cw.word === word.palavra);

            return (
              <CardBoard
                key={word.id}
                word={word}
                onComplete={handleWordComplete}
                onLetterPlace={(slotIndex, letter) => handleLetterPlace(index, slotIndex, letter)}
                showHints={showHints}
                disabled={isCompleted}
                className={isCompleted ? "opacity-75 transform scale-95" : ""}
              />
            );
          })}
        </div>

        {/* Banco de letras */}
        <div className="bg-white/80 rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-reef-shadow/80 mb-4 text-center">
            Banco de Letras
          </h3>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3 justify-items-center">
            {availableLetters.map((letter, index) => {
              const letterCount = availableLetters.filter(l => l === letter).length;
              const usedCount = Array.from(usedLetters).filter(l => l === letter).length;
              const isUsed = usedCount >= letterCount;

              return (
                <LetterTile
                  key={`${letter}-${index}`}
                  char={letter}
                  isUsed={isUsed}
                  disabled={gameState !== "playing"}
                />
              );
            })}
          </div>
        </div>

        {/* Status de progresso */}
        {gameState === "completed" && (
          <div className="mt-8 text-center">
            <div className="rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 p-6">
              <Trophy className="mx-auto w-12 h-12 text-yellow-500 mb-3" />
              <h3 className="text-xl font-bold text-reef-coral mb-2">
                Rodada Completa! 🎉
              </h3>
              <p className="text-reef-shadow/70 mb-4">
                Você soletrou {completedWords.length} palavra{completedWords.length > 1 ? 's' : ''} corretamente!
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