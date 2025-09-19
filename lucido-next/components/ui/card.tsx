import type { HTMLAttributes } from "react";
import clsx from "clsx";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "glass" | "reef" | "outline";
};

export function Card({ className, variant = "glass", ...props }: CardProps) {
  const variantClasses = {
    glass: "glass-card",
    reef: "reef-panel",
    outline: "rounded-bubble border border-reef-shell/40 bg-reef-shell/10 backdrop-blur-lg",
  } as const;

  return <div className={clsx("relative", variantClasses[variant], className)} {...props} />;
}
