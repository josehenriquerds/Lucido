"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "Recife", icon: "🪸" },
  { href: "/modules", label: "Missões", icon: "🐙" },
  { href: "/leaderboard", label: "Cardume", icon: "🐟" },
  { href: "/profile", label: "Aquário", icon: "🐠" },
  { href: "/settings", label: "Concha", icon: "🐚" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="sticky bottom-4 z-30 mx-auto mt-auto w-full max-w-3xl rounded-lagoon bg-white/16 p-4 shadow-lagoon backdrop-blur-2xl"
    >
      <ul className="grid grid-cols-5 gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  "flex flex-col items-center rounded-[24px] px-2 py-3 text-xs font-semibold uppercase tracking-tight text-reef-shadow/70 transition-all",
                  isActive && "bg-reef-coral text-white shadow-inner shadow-reef-coral/40",
                )}
              >
                <span className={clsx("text-2xl", isActive ? "animate-bounce" : "")} aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
