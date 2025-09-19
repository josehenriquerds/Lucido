import clsx from "clsx";

const SCHOOL_EMOJI = ["🐠", "🐡", "🐟", "🦀", "🦐", "🐙", "🦑", "🪸"];

export function PearlProgress({
  currentFish,
  goal = 24,
  label = "Cardume",
}: {
  currentFish: number;
  goal?: number;
  label?: string;
}) {
  const ratio = Math.max(0, Math.min(currentFish / goal, 1));
  const slots = Array.from({ length: goal });

  return (
    <div
      className="reef-panel p-5"
      role="progressbar"
      aria-label={label}
      aria-valuenow={currentFish}
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-valuetext={`${currentFish} peixinhos resgatados`}
    >
      <div className="mb-3 flex items-center justify-between text-reef-shell/90">
        <span className="text-sm font-semibold uppercase tracking-wide">{label}</span>
        <span className="text-sm font-semibold">{currentFish} / {goal}</span>
      </div>
      <div className="grid grid-cols-8 gap-2">
        {slots.map((_, index) => {
          const collected = index < currentFish;
          const icon = SCHOOL_EMOJI[index % SCHOOL_EMOJI.length];
          return (
            <span
              key={index}
              aria-hidden="true"
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-full border border-reef-shell/30 text-xl",
                collected ? "bg-reef-algae/60 text-reef-shell shadow-inner shadow-reef-algae/50" : "bg-white/10 text-reef-shell/40",
              )}
            >
              {icon}
            </span>
          );
        })}
      </div>
      <div className="mt-3 h-1 rounded-full bg-white/10">
        <div
          className="h-1 rounded-full bg-reef-coral transition-all"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
