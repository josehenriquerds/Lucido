"use client";

import Link from "next/link";

import { useGame } from "@/components/game-provider";
import { MODULES } from "@/lib/game-data";

const DISPLAY_MODULES = MODULES.filter((module) => module.id !== "trail");

export default function ModulesPage() {
  const { moduleProgress } = useGame();

  return (
    <div className="flex flex-col gap-6 text-reef-shadow">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-reef-shadow/50">Mapa do recife</p>
        <h1 className="text-3xl font-bold">Escolha a próxima missão submarina</h1>
        <p className="text-reef-shadow/70">
          Cada missão adiciona peixinhos ao aquário e fortalece habilidades de leitura, escrita e consciência sonora.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {DISPLAY_MODULES.map((module) => {
          const timesPlayed = moduleProgress[module.id] ?? 0;
          return (
            <div
              key={module.id}
              style={{ background: module.accent }}
              className="flex h-full flex-col justify-between rounded-[28px] p-6 text-white shadow-[0_18px_32px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-4xl" aria-hidden="true">
                    {module.icon}
                  </span>
                  <h2 className="text-xl font-bold">{module.name}</h2>
                  <p className="text-sm text-white/80">{module.description}</p>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  {module.difficulty}
                </span>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-white/80">
                  {timesPlayed} {timesPlayed === 1 ? "mergulho" : "mergulhos"} concluído(s)
                </span>
                {module.id === "parent" ? (
                  <Link
                    href="/profile"
                    className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
                  >
                    Abrir painel da família
                  </Link>
                ) : (
                  <Link
                    href={`/activity/${module.id}`}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-reef-shadow transition hover:brightness-95"
                  >
                    Iniciar missão
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
