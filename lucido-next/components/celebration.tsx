"use client";

import { useEffect, useState } from "react";

import { useGame } from "@/components/game-provider";

export function Celebration({ trigger }: { trigger: number }) {
  const [active, setActive] = useState(false);
  const { lowStimulus } = useGame();

  useEffect(() => {
    if (trigger === 0 || lowStimulus) return;
    setActive(true);
    const timeout = window.setTimeout(() => setActive(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [lowStimulus, trigger]);

  if (!active || lowStimulus) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {Array.from({ length: 18 }, (_, index) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const duration = 2 + Math.random() * 1.5;
        const scale = 0.6 + Math.random() * 0.8;
        const emoji = ["🫧", "🐚", "⭐", "✨", "💠"][index % 5];
        return (
          <span
            key={index}
            style={{
              left: `${left}%`,
              animation: `bubbleRise ${duration}s linear ${delay}s`,
              transform: `scale(${scale})`,
            }}
            className="absolute top-full text-3xl"
          >
            {emoji}
          </span>
        );
      })}
      <style jsx>{`
        @keyframes bubbleRise {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-130vh) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
