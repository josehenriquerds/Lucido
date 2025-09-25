"use client";

import { useState, useEffect } from "react";
import { LetterSlot } from "./letter-slot";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardBoardProps {
  word: {
    id: string;
    palavra: string;
    letras: readonly string[];
    emoji: string;
    categoria: string;
  };
  onComplete?: (word: string) => void;
  onLetterPlace?: (index: number, letter: string) => void;
  showHints?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CardBoard({
  word,
  onComplete,
  onLetterPlace,
  showHints = false,
  disabled = false,
  className,
}: CardBoardProps) {
  const [slots, setSlots] = useState<(string | null)[]>(
    new Array(word.letras.length).fill(null)
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Reset slots when word changes
  useEffect(() => {
    setSlots(new Array(word.letras.length).fill(null));
    setIsCompleted(false);
    setShowCelebration(false);
  }, [word.letras.length, word.id]);

  const handleLetterDrop = (index: number, letter: string) => {
    if (disabled || isCompleted) return;

    const newSlots = [...slots];
    newSlots[index] = letter;
    setSlots(newSlots);
    onLetterPlace?.(index, letter);

    // Check if word is complete
    if (newSlots.every(slot => slot !== null)) {
      const formedWord = newSlots.join("");
      if (formedWord === word.palavra) {
        setIsCompleted(true);
        setShowCelebration(true);
        setTimeout(() => {
          onComplete?.(word.palavra);
          setShowCelebration(false);
        }, 1500);
      } else {
        // Incorrect word - shake and clear after delay
        setTimeout(() => {
          setSlots(new Array(word.letras.length).fill(null));
        }, 1000);
      }
    }
  };

  const handlePlaySound = () => {
    // Placeholder for audio implementation
    console.log(`Playing sound for: ${word.palavra}`);
  };

  const isSlotCorrect = (index: number) => {
    return slots[index] === word.letras[index];
  };

  return (
    <div
      className={cn(
        "relative bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-200",
        "transition-all duration-500",
        {
          "ring-4 ring-green-400 shadow-2xl": isCompleted,
          "animate-pulse": showCelebration,
        },
        className
      )}
    >
      {/* Emoji e categoria */}
      <div className="text-center mb-6">
        <div className="text-6xl sm:text-7xl md:text-8xl mb-3 animate-bounce-subtle">
          {word.emoji}
        </div>
        {/* <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">
          {word.categoria}
        </div> */}
      </div>

      {/* Slots das letras */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 mb-6">
        {word.letras.map((letter, index) => (
          <LetterSlot
            key={index}
            index={index}
            acceptChar={letter}
            currentLetter={slots[index] || undefined}
            onDrop={(droppedLetter) => handleLetterDrop(index, droppedLetter)}
            isEmpty={slots[index] === null}
            isCorrect={isSlotCorrect(index)}
            showHint={showHints}
            disabled={disabled || isCompleted}
          />
        ))}
      </div>

      {/* Palavra completa (quando terminado) */}
      {isCompleted && (
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
            {word.palavra}
          </div>
          <button
            onClick={handlePlaySound}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-sm font-medium">Ouvir palavra</span>
          </button>
        </div>
      )}

      {/* Efeito de celebração */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-blue-200/30 rounded-3xl animate-pulse" />
          <div className="absolute top-4 right-4 text-4xl animate-bounce">🎉</div>
          <div className="absolute bottom-4 left-4 text-4xl animate-bounce delay-150">⭐</div>
          <div className="absolute top-4 left-4 text-4xl animate-bounce delay-300">🎊</div>
        </div>
      )}

      {/* Debug info (desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
          {word.palavra}
        </div>
      )}
    </div>
  );
}