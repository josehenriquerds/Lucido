"use client";

import { useCallback, useEffect, useState } from "react";
import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { ColorBoard } from "@/components/ui/color-board";
import { ColorItem } from "@/components/ui/color-item";
import { BubbleOption } from "@/components/ui/bubble-option";
import { Palette, RotateCcw, Trophy, Lightbulb } from "lucide-react";
import { COLOR_GAME_DATA } from "@/lib/game-data";
import { cn } from "@/lib/utils";
import { DndProvider, DragOverlayPortal } from "@/components/dnd";
import { DragEndEvent } from "@dnd-kit/core";

type GameDifficulty = "easy" | "medium" | "hard";
type GameState = "playing" | "celebrating" | "completed";

interface PlacedItem {
  id: string;
  nome: string;
  emoji: string;
  colorId: string;
}

interface ColorBoardState {
  showConfetti: boolean;
}

function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function Celebration({
  completedColors,
  accuracy,
  onContinue
}: {
  completedColors: Array<{ label: string; color: string; itemCount: number }>;
  accuracy: number;
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-500">
      <div className="mx-4 max-w-lg rounded-3xl bg-white/95 p-8 text-center shadow-2xl animate-in slide-in-from-bottom-6 duration-700">
        <div className="mb-6">
          <Trophy className="mx-auto w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
          <h2 className="text-2xl sm:text-3xl font-bold text-reef-coral">
            🎨 Cores Organizadas! 🎨
          </h2>
          <p className="mt-2 text-reef-shadow/80">
            Você organizou {completedColors.length} cor{completedColors.length > 1 ? 'es' : ''}!
          </p>
          <p className="text-sm text-reef-shadow/60 mt-1">
            Precisão: {accuracy}%
          </p>
        </div>

        <div className="mb-6 space-y-2 max-h-32 overflow-y-auto">
          {completedColors.map((color, index) => (
            <div
              key={color.label}
              className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-gray-50 to-white border"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full shadow-sm"
                  style={{ backgroundColor: color.color }}
                />
                <span className="font-bold text-lg">{color.label}</span>
              </div>
              <span className="text-sm text-gray-600">
                {color.itemCount} item{color.itemCount > 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>

        <BubbleOption onClick={onContinue} state="idle">
          Continuar Aventura
        </BubbleOption>
      </div>
    </div>
  );
}

export function ColorsAdventure() {
  const { scores, addScore, recordModuleCompletion } = useGame();

  // Configurações do jogo
  const [difficulty, setDifficulty] = useState<GameDifficulty>("easy");
  const [gameState, setGameState] = useState<GameState>("playing");
  const [showHints, setShowHints] = useState(false);

  // Estado do jogo
  const [activeColors, setActiveColors] = useState<Array<typeof COLOR_GAME_DATA.cores[number]>>([]);
  const [availableItems, setAvailableItems] = useState<Array<PlacedItem>>([]);
  const [placedItems, setPlacedItems] = useState<Record<string, PlacedItem[]>>({});
  const [usedItems, setUsedItems] = useState<Set<string>>(new Set());
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [draggedItem, setDraggedItem] = useState<PlacedItem | null>(null);
  const [boardStates, setBoardStates] = useState<Record<string, ColorBoardState>>({});

  // Filtrar cores por dificuldade
  const getColorsByDifficulty = useCallback((diff: GameDifficulty) => {
    switch (diff) {
      case "easy":
        return COLOR_GAME_DATA.cores.slice(0, 3); // 3 cores
      case "medium":
        return COLOR_GAME_DATA.cores.slice(0, 4); // 4 cores
      case "hard":
        return COLOR_GAME_DATA.cores; // 6 cores
      default:
        return COLOR_GAME_DATA.cores;
    }
  }, []);

  // Inicializar rodada
  const initializeRound = useCallback(() => {
    const selectedColors = getColorsByDifficulty(difficulty);

    // Criar lista de itens disponíveis
    const itemsPerColor = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
    const allItems: PlacedItem[] = [];

    selectedColors.forEach(color => {
      const shuffledItems = shuffle([...color.itens]).slice(0, itemsPerColor);
      shuffledItems.forEach(item => {
        allItems.push({
          id: `${color.id}-${item.id}`,
          nome: item.nome,
          emoji: item.emoji,
          colorId: color.id,
        });
      });
    });

    setActiveColors([...selectedColors]);
    setAvailableItems(shuffle(allItems));
    setPlacedItems({});
    setUsedItems(new Set());
    setGameState("playing");
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setBoardStates({});
  }, [difficulty, getColorsByDifficulty]);

  // Inicializar jogo
  useEffect(() => {
    initializeRound();
  }, [initializeRound]);

  const handleItemDrop = (colorId: string, itemId: string) => {
    const item = availableItems.find(i => i.id === itemId);
    if (!item) return;

    setTotalAttempts(prev => prev + 1);

    // Verificar se o item pertence à cor correta
    const isCorrect = item.colorId === colorId;

    if (isCorrect) {
      setCorrectAttempts(prev => prev + 1);
      setPlacedItems(prev => ({
        ...prev,
        [colorId]: [...(prev[colorId] || []), item]
      }));
      setUsedItems(prev => new Set([...prev, itemId]));

      // Ativar confetti na cartela específica
      setBoardStates(prev => ({
        ...prev,
        [colorId]: { showConfetti: true }
      }));

      addScore("colors", 15, {
        effect: "success",
        speak: `${item.nome} colocado em ${activeColors.find(c => c.id === colorId)?.label}!`
      });

      // Verificar se completou todas as cores
      const updatedPlaced = {
        ...placedItems,
        [colorId]: [...(placedItems[colorId] || []), item]
      };

      const isGameComplete = activeColors.every(color =>
        (updatedPlaced[color.id] || []).length >= (
          difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5
        )
      );

      if (isGameComplete) {
        setTimeout(() => {
          setGameState("celebrating");
          recordModuleCompletion("colors");

          setTimeout(() => {
            setGameState("completed");
          }, 4000);
        }, 500);
      }
    } else {
      addScore("colors", 0, { effect: "error" });

      // Tremer o item incorreto por um momento
      const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
      if (itemElement) {
        itemElement.classList.add('animate-shake');
        setTimeout(() => {
          itemElement.classList.remove('animate-shake');
        }, 820);
      }
    }
  };

  const handleConfettiComplete = (colorId: string) => {
    setBoardStates(prev => ({
      ...prev,
      [colorId]: { showConfetti: false }
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedItem(null);

    if (!over) return;

    const itemId = active.id as string;
    const colorId = over.id as string;

    handleItemDrop(colorId, itemId);
  };

  const handleDragStart = (event: DragEndEvent) => {
    const itemId = event.active.id as string;
    const item = availableItems.find(item => item.id === itemId);
    setDraggedItem(item || null);
  };

  const handleNewGame = () => {
    initializeRound();
  };

  const handleCelebrationContinue = () => {
    setGameState("completed");
  };

  const getAccuracy = () => {
    return totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;
  };

  const getCompletedColors = () => {
    return activeColors.map(color => ({
      label: color.label,
      color: color.color,
      itemCount: placedItems[color.id]?.length || 0
    }));
  };

  if (gameState === "celebrating") {
    return (
      <Celebration
        completedColors={getCompletedColors()}
        accuracy={getAccuracy()}
        onContinue={handleCelebrationContinue}
      />
    );
  }

  return (
    <DndProvider
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative">
        <ActivityHeader
          title="Brincando com as Cores"
          subtitle="Arraste os objetos para as cartelas das cores corretas."
          moduleId="colors"
          icon={<Palette className="w-6 h-6" />}
          score={scores["colors"] || 0}
        />

      <ActivitySection>
        {/* Controles */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <span className="text-sm font-semibold text-reef-shadow/60">Dificuldade:</span>
          <div className="flex rounded-full border border-reef-shadow/10 bg-white/80 overflow-hidden">
            {(["easy", "medium", "hard"] as const).map(level => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition",
                  difficulty === level
                    ? "bg-pink-500 text-white"
                    : "text-reef-shadow/70 hover:bg-pink-50"
                )}
              >
                {level === "easy" ? "Fácil (3)" : level === "medium" ? "Médio (4)" : "Difícil (6)"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowHints(!showHints)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition",
              showHints
                ? "bg-yellow-500 text-white"
                : "bg-white/80 text-reef-shadow/70 hover:bg-yellow-50"
            )}
          >
            <Lightbulb className="w-4 h-4" />
            Dicas
          </button>

          <BubbleOption
            onClick={handleNewGame}
            state="idle"
            className="ml-auto text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Novo Jogo
          </BubbleOption>
        </div>

        {/* Cartelas de cores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activeColors.map(color => (
            <ColorBoard
              key={color.id}
              id={color.id}
              label={color.label}
              color={color.color}
              shadowColor={color.shadowColor}
              onDrop={(itemId) => handleItemDrop(color.id, itemId)}
              acceptedItems={placedItems[color.id] || []}
              isComplete={(placedItems[color.id] || []).length >= (
                difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5
              )}
              disabled={gameState !== "playing"}
              showConfetti={boardStates[color.id]?.showConfetti || false}
              onConfettiComplete={() => handleConfettiComplete(color.id)}
            />
          ))}
        </div>

        {/* Banco de itens */}
        <div className="bg-white/80 rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-reef-shadow/80 mb-4 text-center">
            Objetos para Classificar
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 justify-items-center">
            {availableItems.map(item => (
              <ColorItem
                key={item.id}
                id={item.id}
                nome={item.nome}
                emoji={item.emoji}
                colorId={item.colorId}
                isUsed={usedItems.has(item.id)}
                disabled={gameState !== "playing"}
                data-item-id={item.id}
              />
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        {totalAttempts > 0 && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/60 rounded-full">
              <span className="text-sm text-reef-shadow/70">
                Precisão: <strong className="text-reef-shadow">{getAccuracy()}%</strong>
              </span>
              <span className="text-sm text-reef-shadow/70">
                Tentativas: <strong className="text-reef-shadow">{totalAttempts}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Status de progresso */}
        {gameState === "completed" && (
          <div className="mt-8 text-center">
            <div className="rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 p-6">
              <Trophy className="mx-auto w-12 h-12 text-yellow-500 mb-3" />
              <h3 className="text-xl font-bold text-reef-coral mb-2">
                Rodada Completa! 🎨
              </h3>
              <p className="text-reef-shadow/70 mb-4">
                Você organizou todas as cores com {getAccuracy()}% de precisão!
              </p>
              <BubbleOption onClick={handleNewGame} state="idle">
                <RotateCcw className="w-4 h-4 mr-2" />
                Jogar Novamente
              </BubbleOption>
            </div>
          </div>
        )}
      </ActivitySection>

      {/* DragOverlay para feedback visual */}
      <DragOverlayPortal className="dnd-overlay">
        {draggedItem ? (
          <ColorItem
            id={draggedItem.id}
            nome={draggedItem.nome}
            emoji={draggedItem.emoji}
            colorId={draggedItem.colorId}
            disabled={false}
            isUsed={false}
            className="pointer-events-none"
          />
        ) : null}
      </DragOverlayPortal>
    </div>
    </DndProvider>
  );
}