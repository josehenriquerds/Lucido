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
        "relative flex min-h-[180px] w-full items-center overflow-hidden rounded-[28px] p-6 text-white",
        "shadow-[0_18px_32px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(0,0,0,0.16)]",
        isLocked && "opacity-70 grayscale",
      )}
      style={{ background: accent }}
    >
      <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        {stateLabel}
      </span>

      <div className="relative z-10 flex-1 pr-24">
        <h3 className="font-chelsea text-3xl leading-tight tracking-tight text-white md:text-4xl">{title}</h3>
        <p className="mt-2 max-w-[46ch] text-sm text-white/90 md:text-base">{description}</p>
        <span className="mt-4 inline-flex items-center rounded-bubble bg-white px-4 py-2 text-sm font-semibold text-reef-shadow/90">
          {isLocked ? "Desbloqueie missões anteriores" : "Entrar na missão"}
        </span>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2 right-2 z-0 select-none drop-shadow-lg"
        style={{ fontSize: "7rem", lineHeight: 1 }}
      >
        {icon}
      </span>
    </Link>
  );
}

