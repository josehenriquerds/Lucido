"use client";

import React, { useEffect } from "react";
import { SyllableHalf } from "./syllable-half";
import { cn } from "@/lib/utils";

interface WordTargetProps {
  syllables: readonly [string, string];
  expectedPair: Record<string, string>;
  onComplete?: (word: string) => void;
  isCompleted?: boolean;
  connectedSyllables?: [string | null, string | null];
  className?: string;
  disabled?: boolean;
  wordId: string;
}

export function WordTarget({
  syllables,
  expectedPair,
  onComplete,
  isCompleted = false,
  connectedSyllables = [null, null],
  className,
  disabled = false,
  wordId,
}: WordTargetProps) {
  // Verifica automaticamente quando ambas as sílabas são conectadas
  useEffect(() => {
    if (connectedSyllables[0] && connectedSyllables[1]) {
      const word = connectedSyllables.join("");
      const isValidPair =
        (expectedPair[connectedSyllables[0]] === connectedSyllables[1]) ||
        (expectedPair[connectedSyllables[1]] === connectedSyllables[0]);

      if (isValidPair) {
        setTimeout(() => {
          onComplete?.(word);
        }, 300);
      }
    }
  }, [connectedSyllables, expectedPair, onComplete]);

  const getSyllableColor = (syllable: string) => {
    // Cores baseadas na primeira letra da sílaba
    const colorMap: Record<string, string> = {
      'S': '#3B82F6', // Blue
      'B': '#10B981', // Green
      'C': '#F59E0B', // Amber
      'P': '#8B5CF6', // Purple
      'V': '#EF4444', // Red
      'G': '#06B6D4', // Cyan
      'F': '#EC4899', // Pink
      'L': '#84CC16', // Lime
    };
    return colorMap[syllable[0]] || '#6B7280'; // Default gray
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Slots para as sílabas */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
        {[0, 1].map((index) => (
          <SyllableHalf
            key={index}
            text={connectedSyllables[index] || `target-${wordId}-${index}`}
            color={connectedSyllables[index] ? getSyllableColor(connectedSyllables[index]) : undefined}
            isTarget
            isEmpty={!connectedSyllables[index]}
            isMatched={isCompleted}
            disabled={disabled || isCompleted}
            className="drop-shadow-lg"
          />
        ))}
      </div>

      {/* Indicador de progresso */}
      {connectedSyllables[0] && connectedSyllables[1] && !isCompleted && (
        <div className="text-xs text-reef-shadow/60 animate-pulse">
          Verificando...
        </div>
      )}

      {/* Preview da palavra esperada (apenas para debug - remover em produção) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400">
          Debug: {syllables.join(' + ')}
        </div>
      )}
    </div>
  );
}