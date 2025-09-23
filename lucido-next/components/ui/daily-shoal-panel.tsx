"use client";

import { Fish, Calendar, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDailyShoal } from "@/lib/hooks/use-daily-shoal";

const DIFFICULTY_LABELS = {
  easy: "Exploração suave",
  medium: "Missão intermediária",
  hard: "Desafio corajoso",
} as const;

export type DailyShoalPanelVariant = "full" | "compact" | "minimal";

export type DailyShoalPanelProps = {
  variant?: DailyShoalPanelVariant;
  onFishClick?: (fishId: string) => void;
  showProgress?: boolean;
  showDescription?: boolean;
  className?: string;
};

export function DailyShoalPanel({
  variant = "full",
  onFishClick,
  showProgress = true,
  showDescription = true,
  className,
}: DailyShoalPanelProps) {
  const { items, rescuedCount, totalCount, progressPercentage } = useDailyShoal();

  const handleFishClick = (fishId: string) => {
    onFishClick?.(fishId);
  };

  // Variante minimal - apenas contador
  if (variant === "minimal") {
    return (
      <div className={cn("inline-flex items-center gap-2 rounded-full bg-reef-sand/10 px-4 py-2 text-sm font-semibold text-reef-shadow", className)}>
        <Fish className="h-4 w-4" />
        <span>{rescuedCount} de {totalCount}</span>
      </div>
    );
  }

  // Variante compact - sem descrição, grid menor
  if (variant === "compact") {
    return (
      <div className={cn("rounded-2xl border border-white/14 bg-white/80 p-4 shadow-[0_8px_20px_rgba(15,23,42,0.06)] backdrop-blur", className)}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-reef-shadow flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cardume do dia
          </h3>
          <span className="inline-flex items-center gap-2 rounded-full bg-reef-sand/10 px-3 py-1 text-sm font-semibold text-reef-shadow">
            <Fish className="h-4 w-4" />
            {rescuedCount} de {totalCount}
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ fishId, definition, isRescued, isNew }) => (
            <button
              key={fishId}
              type="button"
              className={cn(
                "daily-card daily-card--compact",
                isRescued ? "daily-card--rescued" : "daily-card--shadow"
              )}
              onClick={() => handleFishClick(fishId)}
            >
              <span className="daily-card__emoji" aria-hidden="true">
                {definition.emoji}
              </span>
              <span className="daily-card__name">{definition.name}</span>
              {isNew && <span className="daily-card__badge">NOVO</span>}
              {!isRescued && <span className="sr-only">Ainda não resgatado</span>}
            </button>
          ))}
        </div>

        {showProgress && (
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-reef-teal to-reef-coral transition-[width] duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-reef-shadow/60 text-center">
              {progressPercentage}% completo
            </p>
          </div>
        )}
      </div>
    );
  }

  // Variante full - layout completo
  return (
    <div className={cn("rounded-3xl border border-white/14 bg-white/80 p-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)] backdrop-blur", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-reef-shadow flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Cardume do dia
          </h3>
          {showDescription && (
            <p className="text-sm text-reef-shadow/70 mt-1">
              Dois brincalhões, seis exploradores e dois desafiadores para completar o set diário.
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-reef-sand/10 px-4 py-2 text-sm font-semibold text-reef-shadow">
            <Fish className="h-4 w-4" />
            {rescuedCount} de {totalCount}
          </span>
          {rescuedCount === totalCount && totalCount > 0 && (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              <Trophy className="h-4 w-4" />
              Completo!
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {items.map(({ fishId, definition, isRescued, isNew }) => (
          <button
            key={fishId}
            type="button"
            className={cn(
              "daily-card",
              isRescued ? "daily-card--rescued" : "daily-card--shadow"
            )}
            onClick={() => handleFishClick(fishId)}
          >
            <span className="daily-card__emoji" aria-hidden="true">
              {definition.emoji}
            </span>
            <span className="daily-card__name">{definition.name}</span>
            <span className="daily-card__difficulty">{DIFFICULTY_LABELS[definition.difficulty]}</span>
            {isNew && <span className="daily-card__badge">NOVO</span>}
            {!isRescued && <span className="sr-only">Ainda não resgatado</span>}
          </button>
        ))}
      </div>

      {showProgress && (
        <div className="mt-4">
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-reef-teal to-reef-coral transition-[width] duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-reef-shadow/70 text-center">
            Progresso diário: {progressPercentage}%
          </p>
        </div>
      )}

      <style jsx>{`
        .daily-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.35rem;
          padding: 1rem;
          border-radius: 20px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255, 255, 255, 0.92);
          text-align: left;
          min-height: 140px;
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
          cursor: pointer;
        }
        .daily-card:hover,
        .daily-card:focus-visible {
          transform: translateY(-4px);
          border-color: rgba(37, 99, 235, 0.3);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
        }
        .daily-card--shadow {
          background: rgba(241, 245, 249, 0.9);
          border-style: dashed;
          color: rgba(30, 41, 59, 0.5);
        }
        .daily-card--compact {
          min-height: 100px;
          padding: 0.75rem;
        }
        .daily-card__emoji {
          font-size: 2rem;
          line-height: 1;
        }
        .daily-card--shadow .daily-card__emoji {
          filter: grayscale(1);
          opacity: 0.32;
        }
        .daily-card__name {
          font-size: 1rem;
          font-weight: 600;
          color: rgba(15, 23, 42, 0.92);
        }
        .daily-card--shadow .daily-card__name {
          color: rgba(15, 23, 42, 0.56);
        }
        .daily-card__difficulty {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(15, 23, 42, 0.45);
        }
        .daily-card__badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.9);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          padding: 0.2rem 0.5rem;
        }

        @media (max-width: 640px) {
          .daily-card {
            min-height: 120px;
            padding: 0.875rem;
          }
          .daily-card--compact {
            min-height: 90px;
            padding: 0.625rem;
          }
          .daily-card__emoji {
            font-size: 1.75rem;
          }
          .daily-card__name {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}