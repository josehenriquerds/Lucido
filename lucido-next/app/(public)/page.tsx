"use client";

import Link from "next/link";
import { useEffect } from "react";

import { AquariumPanel } from "@/components/aquarium-panel";
import { Celebration } from "@/components/celebration";
import { useGame } from "@/components/game-provider";
import { Card } from "@/components/ui/card";
import { Checkpoint } from "@/components/ui/checkpoint";
import { MODULES } from "@/lib/game-data";
import { DailyShoalPanel } from "@/components/ui/daily-shoal-panel";

type ScoreDisplayKey = "vowels" | "syllables" | "words" | "rhymes" | "spelling" | "bingo" | "memory";

const SCORE_SECTIONS: { key: ScoreDisplayKey; label: string; icon: string }[] = [
  { key: "vowels", label: "Vogais", icon: "🐚" },
  { key: "syllables", label: "Sílabas", icon: "🫧" },
  { key: "words", label: "Palavras", icon: "📜" },
  { key: "rhymes", label: "Rimas", icon: "🎵" },
  { key: "spelling", label: "Laboratório", icon: "🔤" },
  { key: "bingo", label: "Bingo", icon: "🎲" },
  { key: "memory", label: "Memória", icon: "🧠" },
];

const AVAILABLE_MODULES = MODULES.filter((module) => module.id !== "trail" && module.id !== "parent");

export default function HomePage() {
  const { scores, moduleProgress, avatar, playerName, narrate, metrics, totalFish } = useGame();

  useEffect(() => {
    narrate("O recife Ludico está pronto! Vamos resgatar peixinhos para o aquário?");
  }, [narrate]);

  return (
    <>
      <Celebration trigger={scores.total} />
      <section className="reef-panel flex flex-col gap-6 rounded-[36px] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e6ebff] text-5xl shadow-inner shadow-[#cbd5ff]">
              {avatar}
            </span>
            <div className="text-reef-shadow">
              <h1 className="text-3xl font-bold">Olá, {playerName}!</h1>
              <p className="text-reef-shadow/70">
                Você já completou {metrics.activitiesCompleted} missões e resgatou {totalFish} peixinhos para o aquário.
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="self-start rounded-bubble bg-reef-coral px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(249,115,22,0.25)] transition hover:-translate-y-0.5"
          >
            Ver aquário completo
          </Link>
        </div>
        {/* <PearlProgress currentFish={totalFish} goal={24} label="Cardume resgatado" /> */}
        <DailyShoalPanel></DailyShoalPanel>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card variant="reef" className="p-5 text-reef-shadow">
          <h2 className="mb-4 text-xl font-bold">Pontuação por missão</h2>
          <dl className="grid grid-cols-2 gap-3">
            {SCORE_SECTIONS.map(({ key, label, icon }) => (
              <div key={key} className="rounded-bubble bg-[#e6ebff] p-4">
                <dt className="text-xs uppercase tracking-wide text-reef-shadow/60">
                  <span className="mr-2" aria-hidden="true">
                    {icon}
                  </span>
                  {label}
                </dt>
                <dd className="text-2xl font-semibold text-reef-shadow">{scores[key]}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <AquariumPanel />
      </section>

      <section className="relative mt-6">
        <h2 className="mb-4 text-xl font-bold text-reef-shadow">Missões do recife</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {AVAILABLE_MODULES.map((module) => {
            const completions = moduleProgress[module.id] ?? 0;
            const status = completions > 0 ? "completed" : "available";
            return (
              <Checkpoint
                key={module.id}
                href={`/activity/${module.id}`}
                title={module.name}
                description={module.description}
                icon={module.icon}
                status={status}
                accent={module.accent}
                progress={completions}
              />
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <Card variant="reef" className="flex flex-col gap-4 p-5 text-reef-shadow md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Quer explorar outro habitat?</h2>
            <p className="text-reef-shadow/70">
              Visite o mapa de missões para escolher animais-guia, desafios de leitura e cuidar do seu aquário.
            </p>
          </div>
          <Link
            href="/modules"
            className="rounded-bubble bg-reef-teal px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,163,177,0.25)] transition hover:-translate-y-0.5"
          >
            Abrir mapa do recife
          </Link>
        </Card>
      </section>
    </>
  );
}
