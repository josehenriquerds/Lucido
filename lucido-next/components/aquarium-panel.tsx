"use client";

import { useMemo } from "react";

import { useGame } from "@/components/game-provider";

const SPECIES_LABELS: Record<string, string> = {
  "🐠": "Peixinho-palhaço",
  "🐡": "Baiacu curioso",
  "🐟": "Peixe-lua",
  "🦀": "Caranguejo coral",
  "🦐": "Camarão saltitante",
  "🐙": "Polvo brincalhão",
  "🦑": "Lula artista",
  "🪸": "Mini recife",
};

export function AquariumPanel() {
  const { aquarium } = useGame();

  const grouped = useMemo(() => {
    const map = new Map<string, number>();
    aquarium.forEach((fish) => {
      map.set(fish.species, (map.get(fish.species) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [aquarium]);

  if (aquarium.length === 0) {
    return (
      <div className="reef-panel p-6 text-reef-shadow/70">
        <p className="text-lg font-semibold">Seu aquário está pronto!</p>
        <p className="text-sm">Complete desafios para acolher novos peixinhos resgatados do recife.</p>
      </div>
    );
  }

  return (
    <div className="reef-panel p-6 text-reef-shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold uppercase tracking-wide text-reef-shadow">Aquário do Explorador</h2>
        <span className="text-sm font-semibold">{aquarium.length} peixinhos</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {grouped.map(([species, count]) => (
          <div
            key={species}
            className="flex items-center justify-between rounded-bubble bg-white/12 px-4 py-3 shadow-inner shadow-reef-shadow/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">
                {species}
              </span>
              <div>
                <p className="text-sm font-semibold">{SPECIES_LABELS[species] ?? "Habitante do recife"}</p>
                <p className="text-xs text-reef-shadow/60">Total: {count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
