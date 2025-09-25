"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface LetterSlotProps {
  index: number;
  acceptChar?: string;
  onDrop?: (letter: string) => void;
  currentLetter?: string;
  isCorrect?: boolean;
  isEmpty?: boolean;
  showHint?: boolean;
  className?: string;
  disabled?: boolean;
}

export function LetterSlot({
  index,
  acceptChar,
  onDrop,
  currentLetter,
  isCorrect = false,
  isEmpty = true,
  showHint = false,
  className,
  disabled = false,
}: LetterSlotProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    const droppedLetter = e.dataTransfer.getData("text/plain");
    setIsDragOver(false);
    onDrop?.(droppedLetter);
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center font-bold transition-all duration-300",
        "w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl",
        "text-xl sm:text-2xl md:text-3xl",
        "border-3 shadow-inner",
        {
          // Slot vazio
          "bg-white/90 border-dashed border-gray-300": isEmpty && !isDragOver && !showHint,

          // Drag over
          "bg-blue-50 border-solid border-blue-400 scale-105": isDragOver,

          // Com letra correta
          "bg-green-50 border-solid border-green-400 text-green-700": isCorrect && !isEmpty,

          // Com letra incorreta
          "bg-red-50 border-solid border-red-400 text-red-700 animate-shake":
            !isEmpty && !isCorrect && currentLetter,

          // Mostrar dica
          "bg-yellow-50 border-solid border-yellow-400 animate-pulse": showHint,

          // Desabilitado
          "opacity-50 cursor-not-allowed": disabled,
        },
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label={`Slot ${index + 1} ${currentLetter ? `com letra ${currentLetter}` : 'vazio'}`}
      role="button"
      tabIndex={0}
    >
      {isEmpty ? (
        showHint && acceptChar ? (
          <span className="text-gray-400 text-base opacity-60">{acceptChar}</span>
        ) : (
          <span className="text-gray-400 text-2xl">?</span>
        )
      ) : (
        <span className="relative z-10 font-black">{currentLetter}</span>
      )}

      {/* Efeito de encaixe quando correto */}
      {isCorrect && !isEmpty && (
        <>
          <div className="absolute inset-0 rounded-2xl bg-green-200 opacity-30 animate-ping" />
          <div
            className="absolute inset-0 rounded-2xl opacity-30"
            style={{
              background: `radial-gradient(circle at center, rgba(34, 197, 94, 0.3), transparent)`,
            }}
          />
        </>
      )}

      {/* Indicador de posição do slot */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <span className="text-xs text-gray-500 font-medium">{index + 1}</span>
      </div>
    </div>
  );
}