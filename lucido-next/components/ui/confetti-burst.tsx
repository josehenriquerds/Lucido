"use client";

import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  emoji: string;
  scale: number;
}

interface ConfettiBurstProps {
  active: boolean;
  emojis?: string[];
  count?: number;
  duration?: number;
}

const DEFAULT_EMOJIS = ["✨", "🎉", "⭐", "💫", "🌟", "🎊", "🎈"];

export function ConfettiBurst({
  active,
  emojis = DEFAULT_EMOJIS,
  count = 24,
  duration = 2000
}: ConfettiBurstProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces: ConfettiPiece[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 1.2 + Math.random() * 1.0,
        scale: 0.6 + Math.random() * 0.8,
        emoji: emojis[i % emojis.length],
      }));
      setPieces(newPieces);

      const timeout = setTimeout(() => {
        setPieces([]);
      }, duration);

      return () => clearTimeout(timeout);
    } else {
      setPieces([]);
    }
  }, [active, count, duration, emojis]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: "-10%",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `scale(${piece.scale})`,
          }}
        >
          <span className="text-3xl" style={{
            animation: `confetti-spin ${piece.duration}s linear infinite`,
            display: 'inline-block'
          }}>
            {piece.emoji}
          </span>
        </div>
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) scale(${1});
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) scale(${0.8});
            opacity: 0;
          }
        }
        @keyframes confetti-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}
