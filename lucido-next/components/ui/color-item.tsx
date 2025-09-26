"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ColorItemProps {
  id: string;
  nome: string;
  emoji: string;
  colorId: string;
  onDragStart?: () => void;
  disabled?: boolean;
  isUsed?: boolean;
  className?: string;
}

export function ColorItem({
  id,
  nome,
  emoji,
  colorId,
  onDragStart,
  disabled = false,
  isUsed = false,
  className,
}: ColorItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number; y: number; element: HTMLElement | null }>({ x: 0, y: 0, element: null });
  const handleDragStart = (e: React.DragEvent) => {
    if (disabled || isUsed) return;
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.setData("application/color-id", colorId);
    onDragStart?.();
  };

  const handleClick = () => {
    if (!disabled && !isUsed) {
      onDragStart?.();
    }
  };

  // Touch events para mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isUsed) return;

    const touch = e.touches[0];
    if (!touch) return;

    setIsDragging(true);
    touchRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      element: e.currentTarget as HTMLElement
    };

    onDragStart?.();

    // Previne scroll no mobile
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !touchRef.current.element) return;

    const touch = e.touches[0];
    if (!touch) return;

    // Move o elemento visualmente
    const element = touchRef.current.element;
    const deltaX = touch.clientX - touchRef.current.x;
    const deltaY = touch.clientY - touchRef.current.y;

    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    element.style.zIndex = '1000';
    element.style.opacity = '0.8';

    // Encontra elemento sob o toque
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const boardElement = elementBelow?.closest('[data-color-board]') as HTMLElement;

    // Highlight na cartela de cor
    document.querySelectorAll('[data-color-board]').forEach(board => {
      board.classList.remove('drag-over-highlight');
    });

    if (boardElement) {
      boardElement.classList.add('drag-over-highlight');
    }

    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !touchRef.current.element) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    // Reset visual state
    const element = touchRef.current.element;
    element.style.transform = '';
    element.style.zIndex = '';
    element.style.opacity = '';

    // Remove highlights
    document.querySelectorAll('[data-color-board]').forEach(board => {
      board.classList.remove('drag-over-highlight');
    });

    // Encontra elemento de destino
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const boardElement = elementBelow?.closest('[data-color-board]') as HTMLElement;

    if (boardElement) {
      // Dispara evento customizado para simular drop
      const dropEvent = new CustomEvent('itemDrop', {
        detail: { itemId: id, colorId }
      });
      boardElement.dispatchEvent(dropEvent);
    }

    setIsDragging(false);
    touchRef.current = { x: 0, y: 0, element: null };
  };

  return (
    <div
      ref={dragRef}
      className={cn(
        "relative flex flex-col items-center justify-center transition-all duration-300 select-none group",
        "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl",
        "shadow-lg border-2",
        {
          // Estado normal - com cor de fundo correspondente
          "border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-xl hover:-translate-y-2 hover:rotate-1":
            !disabled && !isUsed,

          // Estado usado
          "bg-gray-100 border-gray-300 opacity-40 cursor-not-allowed":
            isUsed,

          // Estado desabilitado
          "bg-gray-200 border-gray-400 opacity-60 cursor-not-allowed":
            disabled,
        },
        className
      )}
      draggable={!disabled && !isUsed}
      onDragStart={handleDragStart}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      aria-label={`Arrastar ${nome} para cartela ${colorId}`}
      style={
        !disabled && !isUsed
          ? {
              backgroundColor: `${getColorForId(colorId)}15`, // Fundo sutil da cor
              borderColor: getColorForId(colorId),
            }
          : undefined
      }
    >
      {/* Emoji principal */}
      <div className="text-3xl sm:text-4xl md:text-5xl mb-1 filter drop-shadow-sm">
        {emoji}
      </div>

      {/* Nome do item */}
      <div className="text-xs sm:text-sm font-bold text-gray-700 text-center leading-tight px-1">
        {nome}
      </div>

      {/* Efeito de brilho sutil quando não usado */}
      {!disabled && !isUsed && (
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"
          style={{
            background: `radial-gradient(circle at 30% 30%, white, transparent)`,
          }}
        />
      )}

      {/* Indicador de categoria por cor (pequeno ponto) */}
      {!isUsed && (
        <div className="absolute top-2 right-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{
              backgroundColor: getColorForId(colorId),
            }}
          />
        </div>
      )}

      {/* Efeito de tremor quando erro */}
      <style jsx>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0) rotate(-0.5deg); }
          20%, 80% { transform: translate3d(2px, 0, 0) rotate(0.5deg); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0) rotate(-1deg); }
          40%, 60% { transform: translate3d(4px, 0, 0) rotate(1deg); }
        }
        .animate-shake { animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
}

// Helper para cores dos indicadores
function getColorForId(colorId: string): string {
  const colorMap: Record<string, string> = {
    vermelho: "#EF4444",
    amarelo: "#EAB308",
    azul: "#3B82F6",
    verde: "#22C55E",
    roxo: "#8B5CF6",
    laranja: "#F97316",
  };
  return colorMap[colorId] || "#6B7280";
}