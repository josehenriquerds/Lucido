import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export type BubbleOptionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  state?: "idle" | "correct" | "incorrect";
};

export function BubbleOption({ className, active, state = "idle", ...props }: BubbleOptionProps) {
  const stateClasses = {
    idle: "bg-reef-shell/20 text-reef-shell hover:bg-reef-shell/30",
    correct: "bg-reef-algae/80 text-reef-shell shadow-inner shadow-reef-algae/40",
    incorrect: "bg-reef-coral/80 text-reef-shell",
  } as const;

  return (
    <button
      className={clsx(
        "bubble-inset rounded-full px-6 py-3 text-lg font-semibold transition-all",
        "focus-visible:scale-105 focus-visible:ring-4",
        "disabled:cursor-not-allowed disabled:opacity-60",
        active && "scale-105 ring-2 ring-reef-sand/70",
        stateClasses[state],
        className,
      )}
      {...props}
    />
  );
}
