import Link from "next/link";
import clsx from "clsx";

const STATUS_LABEL: Record<"locked" | "available" | "completed", string> = {
  locked: "Bloqueado",
  available: "Explorar",
  completed: "Revisitar",
};

export function Checkpoint({
  href,
  title,
  description,
  icon,
  status = "available",
  accent = "#2563EB",
  progress = 0,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
  status?: "locked" | "available" | "completed";
  accent?: string;
  progress?: number;
}) {
  const isLocked = status === "locked";
  const stateLabel = progress > 0 ? `${progress}x concluído` : STATUS_LABEL[status];

  return (
    <Link
      href={href}
      className={clsx(
        "flex h-full flex-col justify-between rounded-[28px] p-6 text-white shadow-[0_18px_32px_rgba(0,0,0,0.12)] transition-all",
        "hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(0,0,0,0.16)]",
        isLocked && "opacity-70 grayscale",
      )}
      style={{ background: accent }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 text-left">
          <span className="text-4xl" aria-hidden="true">
            {icon}
          </span>
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            <p className="text-sm text-white/80">{description}</p>
          </div>
        </div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {stateLabel}
        </span>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm font-semibold text-white/90">
        <span>{isLocked ? "Desbloqueie missões anteriores" : "Abrir missão"}</span>
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}
