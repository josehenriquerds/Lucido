"use client";

import { useGame } from "@/components/game-provider";
import { Card } from "@/components/ui/card";

const FISH_VALUE = 40;

export default function LeaderboardPage() {
  const { leaderboard, totalFish } = useGame();
  const [first, second, third, ...rest] = leaderboard;

  return (
    <div className="flex flex-col gap-6 text-reef-shell">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-reef-shell/70">Ranking do cardume</p>
        <h1 className="text-3xl font-bold">Quem salvou mais peixinhos?</h1>
        <p className="text-reef-shell/80">
          Resgatar peixes em cada missão aumenta sua posição no recife. Você já tem {totalFish} habitantes no aquário!
        </p>
      </header>

      <Card variant="reef" className="grid gap-4 bg-white/10 p-6 md:grid-cols-3">
        {[first, second, third].filter(Boolean).map((entry, index) => (
          <div key={entry?.id ?? index} className="flex flex-col items-center gap-3">
            <span className="text-5xl" aria-hidden="true">
              {entry?.avatar}
            </span>
            <span className="text-lg font-bold text-reef-shell">{entry?.name}</span>
            <span className="text-sm text-reef-shell/70">{entry ? Math.round(entry.score / FISH_VALUE) : 0} peixes resgatados</span>
            <span className="rounded-full bg-reef-sand/40 px-3 py-1 text-xs uppercase tracking-wide text-reef-shell">
              {index === 0 ? "1º" : index === 1 ? "2º" : "3º"} lugar
            </span>
          </div>
        ))}
      </Card>

      <Card variant="reef" className="p-6">
        <h2 className="mb-4 text-xl font-bold">Classificação completa</h2>
        <ul className="space-y-3">
          {rest.map((entry, index) => (
            <li key={entry.id} className="flex items-center justify-between rounded-bubble bg-white/12 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-reef-shell/70">{index + 4}º</span>
                <span className="text-3xl" aria-hidden="true">
                  {entry.avatar}
                </span>
                <span className="font-semibold text-reef-shell">{entry.name}</span>
              </div>
              <div className="text-right text-sm text-reef-shell/70">
                <p>{Math.round(entry.score / FISH_VALUE)} peixes</p>
                <p>{entry.badges} badges</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
