"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "@/components/game-provider";

const SPECIES_LABELS: Record<string, string> = {
  "🐠": "Peixinho-palhaço",
  "🐡": "Baiacu curioso",
  "🐟": "Peixe-lua",
  "🦀": "Caranguejo coral",
  "🦐": "Camarão saltitante",
  "🐙": "Polvo brincalhão",
  "🦑": "Lula artista",
};

type FishItem = { species: string };

type FishState = {
  key: string;
  species: string;
  label: string;
  // posição base e offsets
  baseX: number;
  baseY: number;
  ax1: number; ax2: number; // amplitudes horizontais
  ay1: number; ay2: number; // amplitudes verticais
  w1: number; w2: number; w3: number; w4: number; // velocidades (rad/s)
  p1: number; p2: number; p3: number; p4: number; // fases
  drift: number; // px/s
  face: 1 | -1; // direção para flip
};

function seededRand(seed: number) {
  // PRNG simples determinístico (para movimentos estáveis entre renders)
  let x = (seed + 1) * 1103515245 + 12345;
  x = (x >>> 0) % 2147483647;
  return x / 2147483647;
}

export function AquariumPanel() {
  const { aquarium } = useGame() as { aquarium: FishItem[] };

  const [lowStim, setLowStim] = useState(false);
  const tankRef = useRef<HTMLDivElement | null>(null);
  const fishRefs = useRef(new Map<string, HTMLButtonElement>()).current;
  const statesRef = useRef<FishState[]>([]);
 const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, number>();
    aquarium.forEach((fish) => map.set(fish.species, (map.get(fish.species) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [aquarium]);

  // cria “cardume” com parâmetros naturais
  const school = useMemo(() => {
    return aquarium.map((f, i) => {
      const r = (n: number) => seededRand(i * 37 + n);
      const label = SPECIES_LABELS[f.species] ?? "Habitante do recife";
      return {
        key: `${f.species}-${i}`,
        species: f.species,
        label,
        // placeholders — valores reais setados quando o tank tiver dimensões
        baseX: 0,
        baseY: 0,
        ax1: 0, ax2: 0, ay1: 0, ay2: 0,
        w1: 0, w2: 0, w3: 0, w4: 0,
        p1: r(1) * Math.PI * 2,
        p2: r(2) * Math.PI * 2,
        p3: r(3) * Math.PI * 2,
        p4: r(4) * Math.PI * 2,
        drift: (r(5) * 2 - 1) * 14, // px/s (-6 .. 6)
        face: r(6) > 0.5 ? 1 : -1,
      } as FishState;
    });
  }, [aquarium]);

  // inicializa estados com dimensões do tanque
  useEffect(() => {
    const tank = tankRef.current;
    if (!tank) return;

    const W = tank.clientWidth;
    const H = tank.clientHeight;

    statesRef.current = school.map((s, idx) => {
      const r = (n: number) => seededRand(idx * 53 + n);
      const margin = 48; // bordas seguras
      const baseX = margin + r(1) * (W - margin * 2);
      const baseY = margin + r(2) * (H - margin * 2);

      // amplitudes mais suaves; low-stim ajustado no loop
      const ax1 = 14 + r(3) * 12;
      const ax2 = 6 + r(4) * 10;
      const ay1 = 10 + r(5) * 12;
      const ay2 = 4 + r(6) * 10;

      // velocidades baixas (rad/s) -> movimento macio
      const w1 = 0.25 + r(7) * 0.25;
      const w2 = 0.10 + r(8) * 0.15;
      const w3 = 0.30 + r(9) * 0.25;
      const w4 = 0.12 + r(10) * 0.15;

      return { ...s, baseX, baseY, ax1, ax2, ay1, ay2, w1, w2, w3, w4 };
    });
  }, [school]);

  // bolhas suaves
  useEffect(() => {
    const tank = tankRef.current;
    if (!tank) return;
    const id = setInterval(() => {
      const b = document.createElement("div");
      b.className = "bubble";
      b.style.left = Math.random() * tank.clientWidth + "px";
      b.style.width = b.style.height = 6 + Math.random() * 10 + "px";
      b.style.animationDuration = 4 + Math.random() * 4 + "s";
      tank.appendChild(b);
      setTimeout(() => b.remove(), 8000);
    }, 900);
    return () => clearInterval(id);
  }, []);

  // animação natural (soma de ondas + drift lateral + flip sutil)
  useEffect(() => {
    const tank = tankRef.current;
    if (!tank) return;

    const W = tank.clientWidth;
    const H = tank.clientHeight;
    const margin = 40;

    let last = performance.now();

    const frame = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const t = now / 1000;

      const ampScale = lowStim ? 0.55 : 1; // reduz amplitude no modo baixo estímulo
      const speedScale = lowStim ? 0.8 : 1;

      for (const s of statesRef.current) {
        // drift lateral
        s.baseX += s.drift * dt * speedScale;

        // bateu na parede? volta e vira
        if (s.baseX < margin) {
          s.baseX = margin;
          s.drift = Math.abs(s.drift);
          s.face = 1;
        } else if (s.baseX > W - margin) {
          s.baseX = W - margin;
          s.drift = -Math.abs(s.drift);
          s.face = -1;
        }

        // offsets suaves (duas ondas de baixa frequência)
        const xOff =
          ampScale * (s.ax1 * Math.sin(s.w1 * t + s.p1) + s.ax2 * Math.sin(s.w2 * t + s.p2));
        const yOff =
          ampScale * (s.ay1 * Math.sin(s.w3 * t + s.p3) + s.ay2 * Math.sin(s.w4 * t + s.p4));

        const x = s.baseX + xOff;
        const y = Math.min(Math.max(s.baseY + yOff, margin), H - margin);

        const el = fishRefs.get(s.key);
        if (el) {
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
          el.style.transform = `translate(-50%, -50%) scaleX(${s.face})`;
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [lowStim]);

  function handleFishClick() {
    // reação curtinha (sem sobresalto)
    const el = document.activeElement as HTMLButtonElement | null;
    if (!el) return;
    el.classList.add("react");
    setTimeout(() => el.classList.remove("react"), 220);
    // opcional: XP/afinidade
  }

  if (aquarium.length === 0) {
    return (
      <div className="reef-panel p-6 text-reef-shadow/70">
        <p className="text-lg font-semibold">Seu aquário está pronto!</p>
        <p className="text-sm">Complete desafios para acolher novos peixinhos resgatados do recife.</p>
      </div>
    );
  }

  return (
    <div className={`reef-panel p-6 text-reef-shadow ${lowStim ? "lowstim" : ""}`}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-bold uppercase tracking-wide text-reef-shadow">
          Aquário do Explorador
        </h2>
        <div className="flex items-center gap-3">
          <label className="inline-flex select-none items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              className="accent-reef-shadow"
              checked={lowStim}
              onChange={(e) => setLowStim(e.target.checked)}
            />
            Baixo estímulo
          </label>
          <span className="text-sm font-semibold">{aquarium.length} peixinhos</span>
        </div>
      </div>

      {/* Tanque com nado natural */}
      <div
        ref={tankRef}
        className="tank mt-4"
        role="img"
        aria-label="Tanque com peixes flutuando naturalmente, corais e bolhas"
      >

        {school.map((s) => (
          <button
            key={s.key}
            type="button"
            className="fish"
            aria-label={`${s.label} nadando`}
            title={s.label}
            ref={(el) => {
              if (el) fishRefs.set(s.key, el);
              else fishRefs.delete(s.key);
            }}
            onClick={handleFishClick}
            style={{ fontSize: "34px" }}
          >
            {s.species}
          </button>
        ))}
      </div>

      {/* Lista por espécie */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {grouped.map(([species, count]) => (
          <div
            key={species}
            className="flex items-center justify-between rounded-bubble bg-white/12 px-4 py-3 shadow-inner shadow-reef-shadow/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">
                {species}
              </span>
              <div>
                <p className="text-sm font-semibold">{SPECIES_LABELS[species] ?? "Habitante do recife"}</p>
                <p className="text-xs text-reef-shadow/60">Total: {count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* estilos globais do tanque */}
      <style jsx global>{`
        .tank {
          position: relative;
          height: 360px;
          border-radius: 20px;
          overflow: hidden;
          background:
            radial-gradient(120% 90% at 50% 10%, #ffffffcc 0%, #ffffff00 40%),
            linear-gradient(to bottom, #dff7ff, #bfeaf6);
          box-shadow: inset 0 10px 30px #00000014, 0 20px 50px #0000001a;
          isolation: isolate;
        }
        .reef {
          position: absolute;
          bottom: -8px;
          left: 10px;
          font-size: 40px;
          opacity: 0.9;
          filter: drop-shadow(0 2px 2px #0003);
          pointer-events: none;
        }
        .reef.r2 {
          left: auto;
          right: 14px;
          font-size: 44px;
          opacity: 0.85;
        }

        .bubble {
          position: absolute;
          bottom: -30px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #fff8;
          filter: blur(0.5px);
          animation: bubbleUp linear forwards;
          opacity: 0.7;
          pointer-events: none;
        }
        @keyframes bubbleUp {
          to {
            transform: translateY(-420px);
            opacity: 0;
          }
        }

        .fish {
          position: absolute;
          left: 0;
          top: 0;
          width: 56px;
          height: 56px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
          user-select: none;
          touch-action: manipulation;
          cursor: pointer;
          border: 0;
          background: transparent;
          filter: drop-shadow(0 2px 2px #0004);
          transition: transform 0.25s;
        }
        .fish.react {
          transform: translate(-50%, -50%) scale(1.06);
        }

        /* Baixo estímulo: menos bolhas */
        .lowstim .bubble {
          opacity: 0.5;
        }

        @media (prefers-reduced-motion: reduce) {
          .bubble {
            animation-duration: 6s;
          }
        }
      `}</style>
    </div>
  );
}
