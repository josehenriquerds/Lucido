"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useGame } from "@/components/game-provider";
import { FishDefinition } from "@/lib/fish";

const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 } as const;
const DIFFICULTY_LABELS: Record<FishDefinition["difficulty"], string> = {
  easy: "Exploração suave",
  medium: "Missão intermediaria",
  hard: "Desafio corajoso",
};

const THEME_OPTIONS = [
  {
    id: "shallow" as const,
    label: "Mar Raso",
    gradient: "linear-gradient(180deg, #dff7ff 0%, #b9e6f7 40%, #7fb4f3 100%)",
    tint: "rgba(7, 89, 133, 0.18)",
    decoLeft: "??",
    decoRight: "??",
  },
  {
    id: "reef" as const,
    label: "Recife",
    gradient: "linear-gradient(180deg, #163d7a 0%, #0f2f5c 55%, #071d3a 100%)",
    tint: "rgba(59, 130, 246, 0.18)",
    decoLeft: "??",
    decoRight: "??",
  },
  {
    id: "grotto" as const,
    label: "Gruta",
    gradient: "linear-gradient(180deg, #060c1f 0%, #08152c 45%, #040a17 100%)",
    tint: "rgba(14, 116, 144, 0.22)",
    decoLeft: "??",
    decoRight: "?",
  },
];

type ThemeId = (typeof THEME_OPTIONS)[number]["id"];

const THEME_LOOKUP: Record<ThemeId, (typeof THEME_OPTIONS)[number]> = THEME_OPTIONS.reduce(
  (acc, option) => {
    acc[option.id] = option;
    return acc;
  },
  {} as Record<ThemeId, (typeof THEME_OPTIONS)[number]>,
);

type PanoramaFishState = {
  key: string;
  definition: FishDefinition;
  baseX: number;
  baseY: number;
  ax1: number;
  ax2: number;
  ay1: number;
  ay2: number;
  w1: number;
  w2: number;
  w3: number;
  w4: number;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  drift: number;
  face: 1 | -1;
};

function seededRand(seed: number) {
  let x = (seed + 1) * 1103515245 + 12345;
  x = (x >>> 0) % 2147483647;
  return x / 2147483647;
}

export function AquariumPanel() {
  const { aquarium, fishById, fishCatalog, dailyShoal } = useGame();

  const totalAvailable = fishCatalog.length;
  const totalRescued = aquarium.length;

  const rescuedSet = useMemo(() => new Set(aquarium.map((fish) => fish.fishId)), [aquarium]);

  const todayKey = dailyShoal.date;
  const todayFishIds = useMemo(() => {
    const set = new Set<string>();
    aquarium.forEach((fish) => {
      const acquiredDate = new Date(fish.earnedAt);
      const key = `${acquiredDate.getFullYear()}-${String(acquiredDate.getMonth() + 1).padStart(2, "0")}-${String(
        acquiredDate.getDate(),
      ).padStart(2, "0")}`;
      if (key === todayKey) {
        set.add(fish.fishId);
      }
    });
    return set;
  }, [aquarium, todayKey]);

  const rescuedEntries = useMemo(() => {
    return aquarium
      .map((entry) => {
        const definition = fishById[entry.fishId];
        if (!definition) return null;
        return { entry, definition };
      })
      .filter((item): item is { entry: (typeof aquarium)[number]; definition: FishDefinition } => Boolean(item))
      .sort((a, b) => {
        const orderDiff = DIFFICULTY_ORDER[a.definition.difficulty] - DIFFICULTY_ORDER[b.definition.difficulty];
        if (orderDiff !== 0) return orderDiff;
        return b.entry.earnedAt - a.entry.earnedAt;
      });
  }, [aquarium, fishById]);

  const groupedByDifficulty = useMemo(() => {
    const groups: Record<FishDefinition["difficulty"], { entry: (typeof aquarium)[number]; definition: FishDefinition }[]> = {
      easy: [],
      medium: [],
      hard: [],
    };
    rescuedEntries.forEach((item) => {
      groups[item.definition.difficulty].push(item);
    });
    return groups;
  }, [rescuedEntries]);

  const dailyItems = useMemo(() => {
    return dailyShoal.fishIds
      .map((fishId, index) => {
        const definition = fishById[fishId];
        if (!definition) return null;
        const isRescued = rescuedSet.has(fishId);
        return {
          fishId,
          definition,
          index,
          isRescued,
          isNew: isRescued && todayFishIds.has(fishId),
        };
      })
      .filter(
        (item): item is {
          fishId: string;
          definition: FishDefinition;
          index: number;
          isRescued: boolean;
          isNew: boolean;
        } => Boolean(item),
      );
  }, [dailyShoal.fishIds, fishById, rescuedSet, todayFishIds]);

  const dailyRescuedCount = dailyItems.filter((item) => item.isRescued).length;

  const [viewMode, setViewMode] = useState<"grid" | "panorama">("panorama");
  const [theme, setTheme] = useState<ThemeId>("reef");
  const [selectedFishId, setSelectedFishId] = useState<string | null>(null);

  const panoramaFish = useMemo(() => {
    return rescuedEntries.map((item, index) => ({
      key: `${item.entry.fishId}-${item.entry.earnedAt}-${index}`,
      fishId: item.entry.fishId,
      definition: item.definition,
      seed: index,
    }));
  }, [rescuedEntries]);

  const tankRef = useRef<HTMLDivElement | null>(null);
  const fishRefs = useRef(new Map<string, HTMLButtonElement>());
  const stateRef = useRef<PanoramaFishState[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (viewMode !== "panorama") {
      stateRef.current = [];
      return;
    }
    const tank = tankRef.current;
    if (!tank) return;

    const width = tank.clientWidth;
    const height = tank.clientHeight;
    const margin = 56;

    stateRef.current = panoramaFish.map((item, index) => {
      const baseSeed = (index + 1) * 37;
      const rand = (offset: number) => seededRand(baseSeed + offset);
      return {
        key: item.key,
        definition: item.definition,
        baseX: margin + rand(1) * (width - margin * 2),
        baseY: margin + rand(2) * (height - margin * 2),
        ax1: 18 + rand(3) * 18,
        ax2: 6 + rand(4) * 10,
        ay1: 14 + rand(5) * 16,
        ay2: 5 + rand(6) * 12,
        w1: 0.18 + rand(7) * 0.24,
        w2: 0.12 + rand(8) * 0.18,
        w3: 0.2 + rand(9) * 0.26,
        w4: 0.14 + rand(10) * 0.2,
        p1: rand(11) * Math.PI * 2,
        p2: rand(12) * Math.PI * 2,
        p3: rand(13) * Math.PI * 2,
        p4: rand(14) * Math.PI * 2,
        drift: (rand(15) * 2 - 1) * 22,
        face: rand(16) > 0.5 ? 1 : -1,
      };
    });
  }, [viewMode, panoramaFish]);

  useEffect(() => {
    if (viewMode !== "panorama") {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const tank = tankRef.current;
    if (!tank) return;

    const margin = 48;
    let last = performance.now();

    const animate = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const time = now / 1000;

      const currentWidth = tank.clientWidth;
      const currentHeight = tank.clientHeight;

      stateRef.current.forEach((fish) => {
        fish.baseX += fish.drift * dt;
        if (fish.baseX < margin) {
          fish.baseX = margin;
          fish.drift = Math.abs(fish.drift);
          fish.face = 1;
        } else if (fish.baseX > currentWidth - margin) {
          fish.baseX = currentWidth - margin;
          fish.drift = -Math.abs(fish.drift);
          fish.face = -1;
        }

        const offsetX =
  fish.ax1 * Math.sin(fish.w1 * time + fish.p1) + fish.ax2 * Math.sin(fish.w2 * time + fish.p2);
const offsetY =
  fish.ay1 * Math.sin(fish.w3 * time + fish.p3) + fish.ay2 * Math.sin(fish.w4 * time + fish.p4);

let x = fish.baseX + offsetX;
let y = fish.baseY + offsetY;

const button = fishRefs.current.get(fish.key);
if (button) {
  // metade do tamanho do ícone (48px), mas se você mudar via CSS, isso se ajusta sozinho
  const half = (button.offsetWidth || 48) / 2;

  // limites internos: margem + metade do ícone
  const minX = margin + half;
  const maxX = currentWidth - margin - half;
  const minY = margin + half;
  const maxY = currentHeight - margin - half;

  // clamp final - garante “respeitar o quadrado do aquário”
  x = Math.max(minX, Math.min(maxX, x));
  y = Math.max(minY, Math.min(maxY, y));

  // posiciona pelo centro do botão
  button.style.left = `${x}px`;
  button.style.top = `${y}px`;

  // preserva flip horizontal + permite hover escalar sem sobrescrever
  button.style.transform = `translate(-50%, -50%) scaleX(${fish.face}) scale(var(--scale, 1))`;
}

      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [viewMode]);

  const selectedDefinition = selectedFishId ? fishById[selectedFishId] : undefined;
  const selectedEntry = selectedFishId ? aquarium.find((fish) => fish.fishId === selectedFishId) : undefined;

  const themeConfig = THEME_LOOKUP[theme] ?? THEME_OPTIONS[1];
  const overallProgress = totalAvailable === 0 ? 0 : totalRescued / totalAvailable;

  return (
    <section className="reef-panel w-full max-w-full p-6 text-reef-shadow">
      <header
        className="aquarium-hero overflow-hidden rounded-[28px] border border-white/10 p-6 shadow-[0_20px_40px_rgba(3,62,107,0.18)]"
        style={{ background: themeConfig.gradient }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Aquário Vivo</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Você resgatou {totalRescued} de {totalAvailable} peixinhos</h2>
            <p className="mt-2 max-w-xl text-sm text-white/80">
             Cada missão acolhe um novo habitante no seu aquário. Complete missões diárias para ganhar peixes exclusivos!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-4xl shadow-inner shadow-black/20">
              ??
            </div>
            <div className="min-w-[120px]">
              <p className="text-xs uppercase tracking-wide text-white/70">Cardume de hoje</p>
              <p className="text-xl font-bold text-white">{dailyRescuedCount} / {dailyItems.length}</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white/90 transition-[width]"
              style={{ width: `${Math.min(100, Math.round(overallProgress * 100))}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
            Progresso geral do aquÃ¡rio
          </p>
        </div>
      </header>

      <section className="mt-8 rounded-3xl border border-white/14 bg-white/80 p-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-reef-shadow">Cardume do dia</h3>
            <p className="text-sm text-reef-shadow/70">
              Dois brincalhÃµes, seis exploradores e dois desafiadores para completar o set diÃ¡rio.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-reef-sand/10 px-4 py-2 text-sm font-semibold text-reef-shadow">
            <span className="text-base">??</span> {dailyRescuedCount} de {dailyItems.length}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {dailyItems.map(({ fishId, definition, isRescued, isNew }) => (
            <button
              key={fishId}
              type="button"
              className={`daily-card ${isRescued ? "daily-card--rescued" : "daily-card--shadow"}`}
              onClick={() => setSelectedFishId(definition.id)}
            >
              <span className="daily-card__emoji" aria-hidden="true">
                {definition.emoji}
              </span>
              <span className="daily-card__name">{definition.name}</span>
              <span className="daily-card__difficulty">{DIFFICULTY_LABELS[definition.difficulty]}</span>
              {isNew && <span className="daily-card__badge">NOVO</span>}
              {!isRescued && <span className="sr-only">Ainda nÃ£o resgatado</span>}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-reef-shadow/60">Visualização</span>
          <div className="inline-flex rounded-full border border-reef-shadow/10 bg-white/80 p-1 shadow-inner">
            <button
              type="button"
              className={`view-toggle ${viewMode === "grid" ? "view-toggle--active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              Grade
            </button>
            <button
              type="button"
              className={`view-toggle ${viewMode === "panorama" ? "view-toggle--active" : ""}`}
              onClick={() => setViewMode("panorama")}
            >
              Panorama
            </button>
          </div>
        </div>

        {viewMode === "panorama" && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-reef-shadow/60">Ambiente</span>
            <div className="inline-flex rounded-full border border-reef-shadow/10 bg-white/80 p-1 shadow-inner">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`view-toggle ${theme === option.id ? "view-toggle--active" : ""}`}
                  onClick={() => setTheme(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {viewMode === "grid" ? (
        <section className="mt-6 space-y-6">
          {(Object.keys(groupedByDifficulty) as FishDefinition["difficulty"][]).map((level) => {
            const group = groupedByDifficulty[level];
            if (group.length === 0) return null;
            return (
              <div key={level} className="rounded-3xl border border-white/18 bg-white/90 p-5 shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-reef-shadow">{DIFFICULTY_LABELS[level]}</h4>
                  <span className="text-sm font-semibold text-reef-shadow/60">{group.length} peixinhos</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.map(({ entry, definition }) => (
                    <button
                      key={entry.id}
                      type="button"
                      className="fish-card"
                      onClick={() => setSelectedFishId(definition.id)}
                    >
                      <span className="fish-card__emoji" aria-hidden="true">
                        {definition.emoji}
                      </span>
                      <div className="fish-card__body">
                        <p className="fish-card__name">{definition.name}</p>
                        <p className="fish-card__fact">{definition.fact}</p>
                      </div>
                      {todayFishIds.has(entry.fishId) && <span className="fish-card__badge">NOVO HOJE</span>}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {rescuedEntries.length === 0 && (
            <div className="rounded-3xl border border-dashed border-reef-sand/40 bg-white/70 p-6 text-center text-sm text-reef-shadow/70">
              Nenhum peixe resgatado ainda. Complete uma missão para colocar o primeiro habitante no aquário!
            </div>
          )}
        </section>
      ) : (
        <section className="mt-6">
          <div
            ref={tankRef}
            className="panorama"
            style={{ background: themeConfig.gradient }}
            aria-label="Peixes resgatados nadando livremente em um cenário interativo"
          >
            <div className="panorama__tint" style={{ background: themeConfig.tint }} />
            <span className="panorama__decor-left" aria-hidden="true">
              {themeConfig.decoLeft}
            </span>
            <span className="panorama__decor-right" aria-hidden="true">
              {themeConfig.decoRight}
            </span>
            {panoramaFish.map((item) => (
              <button
                key={item.key}
                type="button"
                className="panorama__fish"
                onClick={() => setSelectedFishId(item.definition.id)}
                ref={(el) => {
                  if (el) {
                    fishRefs.current.set(item.key, el);
                  } else {
                    fishRefs.current.delete(item.key);
                  }
                }}
                title={item.definition.name}
              >
                <span aria-hidden="true" className="text-3xl">
                  {item.definition.emoji}
                </span>
                <span className="sr-only">{item.definition.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedDefinition && (
        <div className="aquarium-modal" role="dialog" aria-modal="true">
          <div className="aquarium-modal__backdrop" aria-hidden="true" onClick={() => setSelectedFishId(null)} />
          <div className="aquarium-modal__content" role="document">
            <button type="button" className="aquarium-modal__close" onClick={() => setSelectedFishId(null)}>
              <span aria-hidden="true">?</span>
              <span className="sr-only">Fechar detalhes</span>
            </button>
            <div className="flex items-center gap-4">
              <span className="aquarium-modal__emoji" aria-hidden="true">
                {selectedDefinition.emoji}
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-reef-shadow/60">
                  {DIFFICULTY_LABELS[selectedDefinition.difficulty]}
                </p>
                <h3 className="text-2xl font-bold text-reef-shadow">{selectedDefinition.name}</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-reef-shadow/80">{selectedDefinition.fact}</p>
            {selectedEntry && (
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-reef-shadow/50">
                Resgatado em {new Date(selectedEntry.earnedAt).toLocaleDateString()}
              </p>
            )}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                className="rounded-full bg-reef-sand px-4 py-2 text-sm font-semibold text-reef-shadow shadow-sm shadow-reef-shadow/20 transition hover:-translate-y-0.5"
                onClick={() => setSelectedFishId(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .aquarium-hero {
          position: relative;
          overflow: hidden;
        }
        .aquarium-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.25), transparent 60%);
          mix-blend-mode: screen;
          pointer-events: none;
        }

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

        .view-toggle {
          padding: 0.35rem 0.9rem;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 999px;
          color: rgba(15, 23, 42, 0.65);
          transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        }
        .view-toggle--active {
          background: rgba(59, 130, 246, 0.12);
          color: rgba(15, 23, 42, 0.92);
          box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.4);
        }

        .fish-card {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 24px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(248, 250, 252, 0.95);
          text-align: left;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .fish-card:hover,
        .fish-card:focus-visible {
          transform: translateY(-5px);
          box-shadow: 0 18px 32px rgba(15, 23, 42, 0.12);
          border-color: rgba(59, 130, 246, 0.35);
        }
        .fish-card__emoji {
          font-size: 2.4rem;
          line-height: 1;
        }
        .fish-card__body {
          flex: 1;
          min-width: 0;
        }
        .fish-card__name {
          font-size: 1rem;
          font-weight: 700;
          color: rgba(15, 23, 42, 0.95);
        }
        .fish-card__fact {
          margin-top: 0.3rem;
          font-size: 0.85rem;
          color: rgba(15, 23, 42, 0.65);
          line-height: 1.4;
        }
        .fish-card__badge {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          border-radius: 999px;
          background: rgba(13, 148, 136, 0.14);
          color: rgba(13, 148, 136, 0.95);
          padding: 0.16rem 0.6rem;
        }

        .panorama {
          position: relative;
          height: 360px;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: inset 0 10px 40px rgba(8, 41, 77, 0.38), 0 18px 44px rgba(8, 41, 77, 0.28);
          background-size: cover;
          background-position: center;
        }
        .panorama__tint {
          position: absolute;
          inset: 0;
          mix-blend-mode: lighten;
          pointer-events: none;
        }
        .panorama__decor-left,
        .panorama__decor-right {
          position: absolute;
          bottom: 0.5rem;
          font-size: 2.2rem;
          opacity: 0.45;
          pointer-events: none;
        }
        .panorama__decor-left {
          left: 1rem;
        }
        .panorama__decor-right {
          right: 1rem;
        }
        .panorama__fish {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 1.8rem;
  /* o centro do botão fica exatamente em (left, top) */
  transform: translate(-50%, -50%) scale(var(--scale, 1));
  transition: transform 0.2s ease;
  will-change: left, top, transform;
}

.panorama__fish:hover,
.panorama__fish:focus-visible {
  /* não sobrescreve o scaleX aplicado via JS */
  --scale: 1.12;
}


        .aquarium-modal {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          z-index: 100000;
        }
        .aquarium-modal__backdrop {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(8px);
        }
        .aquarium-modal__content {
          position: relative;
          width: min(90vw, 420px);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.98);
          padding: 2rem;
          box-shadow: 0 24px 48px rgba(15, 23, 42, 0.25);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .aquarium-modal__close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          height: 36px;
          width: 36px;
          border-radius: 50%;
          border: none;
          background: rgba(15, 23, 42, 0.08);
          color: rgba(15, 23, 42, 0.75);
          display: grid;
          place-items: center;
        }
        .aquarium-modal__emoji {
          font-size: 3rem;
        }

        @media (max-width: 768px) {
          .panorama {
            height: 300px;
          }
        }
      `}</style>
    </section>
  );
}
