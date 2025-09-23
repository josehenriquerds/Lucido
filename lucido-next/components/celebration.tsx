"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { useGame } from "@/components/game-provider";

type Particle = {
  id: string;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
};

const PARTICLE_COUNT: Record<"low" | "medium" | "high", number> = {
  low: 10,
  medium: 18,
  high: 28,
};

export function Celebration({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [burstActive, setBurstActive] = useState(false);
  const { lowStimulus, celebrationIntensity, celebrationSound, audioEnabled, playEffect } = useGame();

  const particleTarget = useMemo(() => PARTICLE_COUNT[celebrationIntensity] ?? PARTICLE_COUNT.medium, [celebrationIntensity]);

  useEffect(() => {
    if (trigger === 0 || lowStimulus) {
      return;
    }

    const now = Date.now();
    setBurstActive(true);

    const nextParticles: Particle[] = Array.from({ length: particleTarget }, (_, index) => ({
      id: `${now}-${index}`,
      left: Math.random() * 100,
      size: 14 + Math.random() * 18,
      delay: Math.random() * 0.2,
      duration: 0.55 + Math.random() * 0.5,
      drift: Math.random() * 60 - 30,
    }));
    setParticles(nextParticles);

    if (celebrationSound && audioEnabled) {
      playEffect("success");
    }

    const timeout = window.setTimeout(() => {
      setBurstActive(false);
      setParticles([]);
    }, 820);

    return () => window.clearTimeout(timeout);
  }, [audioEnabled, celebrationSound, celebrationIntensity, lowStimulus, particleTarget, playEffect, trigger]);

  if ((particles.length === 0 && !burstActive) || lowStimulus) {
    return null;
  }

  return (
    <div className="celebration-layer" aria-hidden="true">
      {particles.map((particle) => {
        const bubbleStyle = {
          left: `${particle.left}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          animationDelay: `${particle.delay}s`,
          animationDuration: `${particle.duration}s`,
          '--drift': `${particle.drift}px`,
        } satisfies CSSProperties & Record<'--drift', string>;
        return (
          <span
            key={particle.id}
            className="celebration-bubble"
            style={bubbleStyle}
          />
        );
      })}
      {burstActive && (
        <div className="celebration-core">
          <div className="celebration-core__ring" />
          <div className="celebration-core__emoji">🐟</div>
        </div>
      )}
      <style jsx>{`
        .celebration-layer {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 80;
          overflow: hidden;
        }
        .celebration-bubble {
          position: absolute;
          bottom: -40px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(148, 163, 184, 0.45) 60%, transparent 100%);
          box-shadow: 0 0 12px rgba(148, 197, 233, 0.6);
          opacity: 0;
          animation: celebration-bubble-rise forwards ease-out;
        }
        @keyframes celebration-bubble-rise {
          0% {
            transform: translate3d(0, 0, 0) scale(0.4);
            opacity: 0.9;
          }
          70% {
            opacity: 0.8;
          }
          100% {
            transform: translate3d(var(--drift, 0), -110vh, 0) scale(1.05);
            opacity: 0;
          }
        }
        .celebration-core {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          gap: 0.5rem;
        }
        .celebration-core__ring {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 2px solid rgba(148, 197, 233, 0.4);
          animation: celebration-ring 0.6s ease-out;
        }
        .celebration-core__emoji {
          font-size: 3rem;
          filter: drop-shadow(0 6px 18px rgba(3, 62, 107, 0.25));
          animation: celebration-pop 0.4s ease-out;
        }
        @keyframes celebration-ring {
          0% {
            transform: scale(0.4);
            opacity: 0.75;
          }
          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }
        @keyframes celebration-pop {
          0% {
            transform: scale(0.6);
          }
          60% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .celebration-bubble {
            animation-duration: 0.6s !important;
          }
          .celebration-core__ring,
          .celebration-core__emoji {
            animation-duration: 0.3s !important;
          }
        }
      `}</style>
    </div>
  );
}





