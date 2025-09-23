import Link from "next/link";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

export function ActivityHeader({
  title,
  subtitle,
  moduleId,
  icon,
  score,
}: {
  title: string;
  subtitle: string;
  moduleId: string;
  icon: string | ReactNode;
  score: number;
}) {
  return (
    <Card variant="reef" className="mb-6 flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12" aria-hidden="true">
            {typeof icon === 'string' ? (
              <span className="text-4xl">{icon}</span>
            ) : (
              icon
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-reef-shell">{title}</h1>
            <p className="text-sm text-reef-shell/80">{subtitle}</p>
          </div>
        </div>
        <Link
          href="/"
          className="rounded-bubble bg-reef-sand px-4 py-2 text-sm font-semibold text-reef-shadow shadow-shell"
        >
          Voltar ao recife
        </Link>
      </div>
      <div className="flex items-center gap-3 text-sm text-reef-shell/80">
        <span className="rounded-full bg-reef-teal/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-reef-shell">
          Missão {moduleId}
        </span>
        <span className="rounded-full bg-reef-coral/40 px-3 py-1 text-xs font-semibold text-reef-shell">
          Pontuação {score}
        </span>
      </div>
    </Card>
  );
}

export function ActivitySection({ children }: { children: ReactNode }) {
  return (
    <Card variant="reef" className="mb-6 p-6 text-reef-shell">
      {children}
    </Card>
  );
}
