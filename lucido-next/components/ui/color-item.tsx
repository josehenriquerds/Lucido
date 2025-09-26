"use client";

import { useDraggable } from "@/hooks/useDragDrop";
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
  // Hook para drag usando o novo sistema
  const { dragRef, isDragging, dragProps } = useDraggable({
    itemId: id,
    itemData: {
      nome,
      emoji,
      colorId,
      type: 'color-item'
    },
    disabled: disabled || isUsed,
    onDragStart: () => onDragStart?.(),
    onDrop: (itemId, targetId, targetData) => {
      // O drop será tratado pela cartela de cor
    },
    onCancel: () => {
      // Drag cancelado - pode adicionar feedback visual se necessário
    }
  });

  const handleClick = () => {
    if (!disabled && !isUsed) {
      onDragStart?.();
    }
  };

  return (
    <div
      ref={dragRef as React.RefObject<HTMLDivElement>}
      {...dragProps}
      className={cn(
        "relative flex flex-col items-center justify-center transition-all duration-300 group",
        "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl",
        "shadow-lg border-2",
        {
          // Estado normal - com cor de fundo correspondente
          "border-gray-200 hover:shadow-xl hover:-translate-y-2 hover:rotate-1":
            !disabled && !isUsed,

          // Estado usado
          "bg-gray-100 border-gray-300 opacity-40":
            isUsed,

          // Estado desabilitado
          "bg-gray-200 border-gray-400 opacity-60":
            disabled,
        },
        dragProps.className,
        className
      )}
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