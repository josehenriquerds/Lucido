"use client";

import { cn } from "@/lib/utils";

interface LetterTileProps {
  char: string;
  onDragStart?: () => void;
  disabled?: boolean;
  className?: string;
  draggable?: boolean;
  isUsed?: boolean;
}

export function LetterTile({
  char,
  onDragStart,
  disabled = false,
  className,
  draggable = true,
  isUsed = false,
}: LetterTileProps) {
  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable || disabled || isUsed) return;
    e.dataTransfer.setData("text/plain", char);
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
        "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl",
        "text-lg sm:text-xl md:text-2xl",
        "shadow-lg border-2",
        {
          // Estado normal
          "bg-white border-amber-300 text-amber-800 cursor-grab active:cursor-grabbing hover:shadow-xl hover:-translate-y-1":
            !disabled && !isUsed && draggable,

          // Estado usado
          "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-50":
            isUsed,

          // Estado desabilitado
          "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed":
            disabled,
        },
        className
      )}
      draggable={draggable && !disabled && !isUsed}
      onDragStart={handleDragStart}
      onClick={handleClick}
      aria-label={`Letra ${char}`}
    >
      <span className="relative z-10 font-extrabold">{char}</span>

      {/* Efeito de brilho sutil */}
      {!disabled && !isUsed && (
        <div
          className="absolute inset-0 rounded-xl opacity-20"
          style={{
            background: `radial-gradient(circle at 30% 30%, white, transparent)`,
          }}
        />
      )}
    </div>
  );
}