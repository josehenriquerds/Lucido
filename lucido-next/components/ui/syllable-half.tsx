"use client";

import { useDraggable, useDropZone } from "@/hooks/useDragDrop";
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

  // Hook para drag (quando é um elemento arrastável)
  const dragHook = useDraggable({
    itemId: syllableId,
    itemData: { text, color, type: 'syllable' },
    disabled: disabled || !draggable || isTarget,
    onDragStart: () => onDragStart?.(),
    onDrop: (itemId, targetId, targetData) => {
      // O drop será tratado pelo target
    },
    onCancel: () => {
      // Drag cancelado - nenhuma ação necessária
    }
  });

  // Hook para drop zone (quando é um target)
  const dropHook = useDropZone({
    targetId: targetId,
    targetData: { expectedText: text, type: 'syllable-target' },
    disabled: disabled || !isTarget,
    onDrop: (droppedItemId, targetId, droppedData) => {
      if (droppedData?.text) {
        onDrop?.(droppedData.text);
      }
    }
  });

  const baseClasses = cn(
    "relative flex items-center justify-center rounded-full font-bold transition-all duration-300",
    "border-2 shadow-lg",
    {
      // Target específico
      "border-dashed border-gray-300 bg-white/80": isTarget && isEmpty,
      "drop-target-hover": isTarget && isEmpty,

      // Sílaba normal
      "border-white bg-white shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1":
        !isTarget && !isEmpty,

      // Matched state
      "ring-4 ring-green-400 animate-success-bounce": isMatched,

      // Sizes responsivas
      "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24": true,
      "text-lg sm:text-xl md:text-2xl": true,
    },
    // Adiciona classes do drag system
    isTarget ? '' : dragHook.dragProps.className,
    isTarget ? dropHook.dropProps.className : '',
    className
  );

  // Combina props baseado no tipo (draggable vs target)
  const targetProps = isTarget ? dropHook.dropProps : {};
  const dragProps = isTarget ? {} : dragHook.dragProps;

  const combinedProps = {
    className: baseClasses,
    style: !isTarget && !isEmpty && !isMatched
      ? {
          background: `linear-gradient(135deg, ${color}20, ${color}40)`,
          borderColor: color,
          color: color,
        }
      : undefined,
    'aria-label': isTarget
      ? isEmpty
        ? "Área de soltar sílaba"
        : `Sílaba ${text} conectada`
      : `Sílaba ${text}`,
    ...targetProps,
    ...dragProps
  };

  return (
    <div
      ref={isTarget ? undefined : (dragHook.dragRef as React.RefObject<HTMLDivElement>)}
      {...combinedProps}
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