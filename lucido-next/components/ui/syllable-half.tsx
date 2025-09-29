"use client";

import { Draggable, Droppable } from "@/components/dnd";
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
  // Novos props para identificação
  syllableId?: string;
  targetId?: string;
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
  syllableId = text,
  targetId = `target-${text}`,
}: SyllableHalfProps) {

  const baseClasses = cn(
    "relative flex items-center justify-center rounded-full font-bold transition-all duration-300",
    "border-2 shadow-lg",
    {
      // Target específico
      "border-dashed border-gray-300 bg-white/80": isTarget && isEmpty,

      // Sílaba normal
      "border-white bg-white shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1":
        !isTarget && !isEmpty,

      // Matched state
      "ring-4 ring-green-400 animate-success-bounce": isMatched,

      // Sizes responsivas
      "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24": true,
      "text-lg sm:text-xl md:text-2xl": true,
    },
    className
  );

  const syllableStyle = !isTarget && !isEmpty && !isMatched
    ? {
        background: `linear-gradient(135deg, ${color}20, ${color}40)`,
        borderColor: color,
        color: color,
      }
    : undefined;

  const ariaLabel = isTarget
    ? isEmpty
      ? "Área de soltar sílaba"
      : `Sílaba ${text} conectada`
    : `Sílaba ${text}`;

  const content = (
    <>
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
    </>
  );

  // Se é um target (drop zone)
  if (isTarget) {
    return (
      <Droppable id={targetId} disabled={disabled}>
        {({ setNodeRef, isOver }) => (
          <div
            ref={setNodeRef}
            className={cn(baseClasses, isOver && !isEmpty && "drop-zone-over")}
            style={syllableStyle}
            aria-label={ariaLabel}
            onClick={() => {
              // Handle click to drop (fallback for touch)
              // This will be handled by the parent component
            }}
          >
            {content}
          </div>
        )}
      </Droppable>
    );
  }

  // Se é um elemento arrastável
  return (
    <Draggable id={syllableId} disabled={disabled || !draggable}>
      {({ setNodeRef, attributes, listeners, style, isDragging }) => (
        <div
          ref={setNodeRef}
          style={{ ...style, ...syllableStyle }}
          {...attributes}
          {...listeners}
          className={cn(
            baseClasses,
            "drag-handle touch-none",
            isDragging && "opacity-50"
          )}
          aria-label={ariaLabel}
          onPointerDown={() => onDragStart?.()}
        >
          {content}
        </div>
      )}
    </Draggable>
  );
}