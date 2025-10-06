"use client";

import { useEffect, useState } from "react";

interface ColorConfettiProps {
  active: boolean;
  color: string;
  onComplete?: () => void;
  duration?: number;
}

const confettiEmojis = ["✨", "⭐", "🎉", "🎊", "💫", "🌟"];

export function ColorConfetti({
  active,
  color,
  onComplete,
  duration = 1000
}: ColorConfettiProps) {
  const [pieces, setPieces] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    emoji: string;
    rotation: number;
    scale: number;
  }>>([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 300,
        duration: 800 + Math.random() * 400,
        emoji: confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)],
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4,
      }));

      setPieces(newPieces);

      const timeout = setTimeout(() => {
        onComplete?.();
        setPieces([]);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [active, duration, onComplete]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute text-2xl animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: '-10%',
            animationDelay: `${piece.delay}ms`,
            animationDuration: `${piece.duration}ms`,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            color: color,
          }}
        >
          {piece.emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg) scale(1);
            opacity: 1;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }

        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}