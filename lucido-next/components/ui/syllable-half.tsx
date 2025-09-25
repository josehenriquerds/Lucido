"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SyllableHalfProps {
  text: string;
  color?: string;
  onDrop?: (droppedText: string) => void;
  onDragStart?: () => void;
  draggable?: boolean;
  isMatched?: boolean;
  isTarget?: boolean;
  isEmpty?: boolean;
  className?: string;
  disabled?: boolean;
}

export function SyllableHalf({
  text,
  color = "#3B82F6",
  onDrop,
  onDragStart,
  draggable = true,
  isMatched = false,
  isTarget = false,
  isEmpty = false,
  className,
  disabled = false,
}: SyllableHalfProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable || disabled) return;
    e.dataTransfer.setData("text/plain", text);
    onDragStart?.();
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isTarget || disabled) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isTarget || disabled) return;
    e.preventDefault();
    const droppedText = e.dataTransfer.getData("text/plain");
    setIsDragOver(false);
    onDrop?.(droppedText);
  };

  const baseClasses = cn(
    "relative flex items-center justify-center rounded-full font-bold transition-all duration-300 select-none",
    "border-2 shadow-lg",
    {
      // Estados de drag
      "cursor-grab active:cursor-grabbing": draggable && !disabled && !isTarget,
      "cursor-not-allowed opacity-50": disabled,

      // Target específico
      "border-dashed border-gray-300 bg-white/80": isTarget && isEmpty && !isDragOver,
      "border-dashed border-blue-400 bg-blue-50 scale-105": isTarget && isEmpty && isDragOver,

      // Sílaba normal
      "border-white bg-white shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1":
        !isTarget && !isEmpty,

      // Matched state
      "ring-4 ring-green-400 animate-pulse": isMatched,

      // Sizes responsivas
      "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24": true,
      "text-lg sm:text-xl md:text-2xl": true,
    },
    className
  );

  return (
    <div
      className={baseClasses}
      draggable={draggable && !disabled && !isTarget}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={
        !isTarget && !isEmpty && !isMatched
          ? {
              background: `linear-gradient(135deg, ${color}20, ${color}40)`,
              borderColor: color,
              color: color,
            }
          : undefined
      }
      aria-label={
        isTarget
          ? isEmpty
            ? "Área de soltar sílaba"
            : `Sílaba ${text} conectada`
          : `Sílaba ${text}`
      }
    >
      {isEmpty && isTarget ? (
        <span className="text-gray-400 text-xl">?</span>
      ) : (
        <>
          <span className="relative z-10">{text}</span>
          {/* Efeito de brilho sutil */}
          {!isTarget && !isEmpty && (
            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{
                background: `radial-gradient(circle at 30% 30%, white, transparent)`,
              }}
            />
          )}
        </>
      )}
    </div>
  );
}