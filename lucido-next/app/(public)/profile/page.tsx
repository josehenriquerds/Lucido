"use client";

import { useGame } from "@/components/game-provider";
import { Card } from "@/components/ui/card";
import { BADGE_DEFINITIONS, MODULES } from "@/lib/game-data";

const MODULE_LABELS = MODULES.reduce<Record<string, string>>((acc, module) => {
  acc[module.id] = module.name;
  return acc;
}, {});

const AVATARS = ["🐠", "🐡", "🐟", "🦀", "🦐", "🐙", "🦑", "🪸"] as const;

const intensityOptions: { value: "low" | "medium" | "high"; label: string; helper: string }[] = [
  { value: "low", label: "Suave", helper: "Animacao delicada para feedback discreto." },
  { value: "medium", label: "Padrao", helper: "Bolhas moderadas com destaque rapido." },
  { value: "high", label: "Impactante", helper: "Explosao cheia de energia para celebrar vitorias." },
];

export default function ProfilePage() {
  const {
    playerName,
    setPlayerName,
    avatar,
    setAvatar,
    scores,
    moduleProgress,
    earnedBadges,
    aquarium,
    totalFish,
    fishById,
    fishCatalog,
    celebrationIntensity,
    setCelebrationIntensity,
    celebrationSound,
    setCelebrationSound,
  } = useGame();

  const rescuedDetails = aquarium.map((entry) => ({
    entry,
    definition: fishById[entry.fishId],
  }));

  return (
    <div className="flex flex-col gap-6 text-reef-shell">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-reef-shell/70">Painel da familia</p>
        <h1 className="text-3xl font-bold">Explorador(a): {playerName}</h1>
        <p className="text-reef-shell/80">
          Ajuste mascotes, acompanhe o cardume e monitore o progresso das missoes submarinas.
        </p>
      </header>

      <Card variant="reef" className="flex flex-col gap-4 p-6">
        <h2 className="text-xl font-bold">Identidade do explorador</h2>
        <label className="flex flex-col gap-2 text-sm text-reef-shell/70">
          Nome exibido nas missoes
          <input
            defaultValue={playerName}
            onBlur={(event) => {
              const value = event.target.value.trim();
              if (value) setPlayerName(value);
            }}
            className="rounded-bubble border border-reef-sand/40 bg-white/10 px-4 py-3 text-base text-reef-shell focus:border-reef-sand"
          />
        </label>
        <div>
          <p className="mb-2 text-sm text-reef-shell/70">Escolha um mascote para guiar o recife</p>
          <div className="flex flex-wrap gap-3">
            {AVATARS.map((option) => (
              <button
                key={option}
                onClick={() => setAvatar(option)}
                className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-inner transition ${
                  avatar === option ? "bg-reef-coral text-reef-shell" : "bg-white/10"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card variant="reef" className="p-6">
        <h2 className="mb-4 text-xl font-bold">Festa de acerto</h2>
        <p className="text-sm text-reef-shell/70">
          Personalize intensidade das particulas e som para manter o feedback confortavel.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {intensityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCelebrationIntensity(option.value)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                celebrationIntensity === option.value
                  ? "border-reef-algae bg-white/20 text-reef-shell"
                  : "border-white/16 bg-white/8 text-reef-shell/70"
              }`}
            >
              <span className="block">{option.label}</span>
              <span className="block text-[0.65rem] font-normal uppercase tracking-[0.18em]">{option.helper}</span>
            </button>
          ))}
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-reef-shell/80">
          <input
            type="checkbox"
            checked={celebrationSound}
            onChange={(event) => setCelebrationSound(event.target.checked)}
            className="h-4 w-4 rounded border border-reef-shell/40 bg-white text-reef-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reef-coral/60"
          />
          Ativar som da celebracao
        </label>
      </Card>

      <Card variant="reef" className="p-6">
        <h2 className="mb-4 text-xl font-bold">Cardume resgatado</h2>
        <p className="mb-3 text-sm text-reef-shell/80">
          Total de peixinhos no aquario: <strong>{totalFish}</strong> de {fishCatalog.length}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rescuedDetails.map(({ entry, definition }) => (
            <div
              key={entry.id}
              className="flex gap-3 rounded-2xl border border-white/20 bg-white/12 p-4 shadow-inner shadow-reef-shadow/20"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 text-3xl" aria-hidden="true">
                {definition?.emoji ?? "🐟"}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-reef-shell">{definition?.name ?? "Habitante misterioso"}</p>
                <p className="text-xs text-reef-shell/60">{definition?.fact ?? "Peixinho aguardando identificacao."}</p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-reef-shell/50">
                  Resgatado em {new Date(entry.earnedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {rescuedDetails.length === 0 && (
            <p className="rounded-2xl border border-dashed border-white/30 bg-white/6 p-4 text-sm text-reef-shell/70">
              Resgate peixes completando missoes!
            </p>
          )}
        </div>
      </Card>

      <Card variant="reef" className="p-6">
        <h2 className="mb-4 text-xl font-bold">Progresso por modulo</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(moduleProgress).map(([moduleId, value]) => (
            <div key={moduleId} className="flex items-center justify-between rounded-bubble bg-white/10 px-4 py-3">
              <span className="text-sm font-semibold uppercase tracking-wide text-reef-shell/70">
                {MODULE_LABELS[moduleId] ?? moduleId}
              </span>
              <span className="text-lg font-bold text-reef-shell">{value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card variant="reef" className="p-6">
        <h2 className="mb-4 text-xl font-bold">Badges</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {BADGE_DEFINITIONS.map((badge) => {
            const unlocked = earnedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex flex-col gap-2 rounded-bubble border px-4 py-3 ${
                  unlocked ? "border-reef-algae bg-white/12" : "border-white/20 bg-white/6"
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {unlocked ? "🏅" : "🎖️"}
                </span>
                <span className="font-semibold text-reef-shell">{badge.label}</span>
                <p className="text-sm text-reef-shell/70">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card variant="reef" className="p-6">
        <h2 className="mb-4 text-xl font-bold">Resumo de pontos</h2>
        <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {Object.entries(scores)
            .filter(([key]) => key !== "total")
            .map(([key, value]) => (
              <li key={key} className="rounded-bubble bg-white/10 px-4 py-3 text-sm text-reef-shell">
                <p className="uppercase tracking-wide text-reef-shell/60">{key}</p>
                <p className="text-2xl font-semibold">{value}</p>
              </li>
            ))}
        </ul>
      </Card>
    </div>
  );
}
