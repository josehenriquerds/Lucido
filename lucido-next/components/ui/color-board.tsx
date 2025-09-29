"use client";

import { Droppable } from "@/components/dnd";
import { Volume2, Sparkles } from "lucide-react";
import { ColorConfetti } from "./color-confetti";
import { cn } from "@/lib/utils";

interface ColorBoardProps {
  id: string;
  label: string;
  color: string;
  shadowColor: string;
  onDrop?: (itemId: string) => void;
  isComplete?: boolean;
  acceptedItems?: Array<{ id: string; nome: string; emoji: string }>;
  className?: string;
  disabled?: boolean;
  showConfetti?: boolean;
  onConfettiComplete?: () => void;
}

export function ColorBoard({
  id,
  label,
  color,
  shadowColor,
  onDrop,
  isComplete = false,
  acceptedItems = [],
  className,
  disabled = false,
  showConfetti = false,
  onConfettiComplete,
}: ColorBoardProps) {
  const handlePlaySound = () => {
    console.log(`Playing sound for color: ${label}`);
  };

  const baseClasses = cn(
    "relative rounded-3xl p-6 transition-all duration-300 min-h-[280px] sm:min-h-[320px]",
    "border-4 border-dashed shadow-xl",
    {
      // Estado normal - com fundo sutil da cor
      "hover:shadow-2xl": !isComplete,

      // Complete
      "ring-4 ring-green-400 shadow-2xl": isComplete,

      // Disabled
      "opacity-60": disabled,
    },
    className
  );

  const boardStyle = {
    borderColor: shadowColor,
    backgroundColor: `${shadowColor}20`, // Fundo sutil da cor sempre
  };

  return (
    <Droppable id={id} disabled={disabled}>
      {({ setNodeRef, isOver }) => (
        <div
          ref={setNodeRef}
          className={cn(baseClasses, isOver && "drop-zone-over")}
          style={boardStyle}
          aria-label={`Cartela de cor ${label}`}
          onClick={() => {
            // Handle click to drop (fallback for touch)
            // This will be handled by the parent component
          }}
        >
      {/* Sombra colorida no fundo */}
      <div
        className="absolute inset-0 rounded-3xl opacity-30 -z-10"
        style={{
          backgroundColor: shadowColor,
       
        }}
      />

      {/* Header com nome da cor */}
      <div className="text-center mb-4">
        <h3
          className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider drop-shadow-sm"
          style={{ color }}
        >
          {label}
        </h3>
        <button
          onClick={handlePlaySound}
          className="mt-2 flex items-center gap-1 mx-auto px-3 py-1 rounded-full bg-white/60 hover:bg-white/80 transition-colors text-sm"
          aria-label={`Ouvir nome da cor ${label}`}
        >
          <Volume2 className="w-3 h-3" />
          <span className="text-xs font-medium">Ouvir</span>
        </button>
      </div>

      {/* Área de drop */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[160px]">
        {acceptedItems.length === 0 ? (
          <div className="text-center">
            <div className="text-6xl sm:text-7xl opacity-30 mb-2">🎨</div>
            <p className="text-sm text-gray-500">
              Arraste objetos {label.toLowerCase()} aqui
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
            {acceptedItems.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col items-center p-2 bg-white/50 rounded-2xl animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-2xl sm:text-3xl mb-1">{item.emoji}</div>
                <div className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {item.nome}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Indicador de progresso */}
      {acceptedItems.length > 0 && (
        <div className="absolute top-4 right-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {acceptedItems.length}
          </div>
        </div>
      )}

      {/* Confetti para cada acerto */}
      <ColorConfetti
        active={showConfetti}
        color={color}
        onComplete={onConfettiComplete}
        duration={800}
      />

      {/* Efeito sutil de celebração quando completa */}
      {isComplete && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 text-2xl opacity-70">
            <Sparkles className="w-6 h-6 animate-pulse" style={{ color }} />
          </div>
          <div className="absolute bottom-4 left-4 text-2xl opacity-70">
            <Sparkles className="w-5 h-5 animate-pulse delay-300" style={{ color }} />
          </div>
        </div>
      )}

      {/* Borda piscante para dica */}
      {isOver && (
        <div
          className="absolute inset-0 rounded-3xl animate-pulse border-4"
          style={{
            borderColor: color,

          }}
        />
      )}
        </div>
      )}
    </Droppable>
  );
}