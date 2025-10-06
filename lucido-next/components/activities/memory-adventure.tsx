"use client";

import { useEffect, useMemo, useState } from "react";
import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";

const MISMATCH_DELAY = 900;
const RESET_DELAY = 2600;

const CONFETTI_EMOJIS = ["🫧", "🐚", "✨", "💎", "🌊"] as const;

// ---- Decks ----
type DeckType = "letters" | "emoji" | "syllables";

const LETTERS = "AEIOUBCDFGHJKLMNPQRSTVWXYZ".split("");
const OCEAN_EMOJIS = ["🪼","🐟","🐠","🐡","🦀","🦞","🦐","🪸","🐙","🐬","🐳","🐋","🦈","🌊","🐚","🐢"];

const SYLLABLES = [
  "PA","PE","PI","PO","PU",
  "MA","ME","MI","MO","MU",
  "CA","CO","CU","CE","CI",
  "LA","LE","LI","LO","LU",
  "BA","BE","BI","BO","BU",
  "FA","FE","FI","FO","FU",
  "RA","RE","RI","RO","RU",
  "TA","TE","TI","TO","TU",
  "NA","NE","NI","NO","NU",
];

// Bordas por letra (A=Amarelo, E=Verde, etc.)
export const LETTER_BORDER_COLORS: Record<string, string> = {
  A: "#FCD34D", B: "#60A5FA", C: "#06B6D4", D: "#F59E0B", E: "#22C55E",
  F: "#84CC16", G: "#10B981", H: "#0EA5E9", I: "#3B82F6", J: "#818CF8",
  K: "#8B5CF6", L: "#EC4899", M: "#EF4444", N: "#F472B6", O: "#FB923C",
  P: "#A3E635", Q: "#14B8A6", R: "#F43F5E", S: "#64748B", T: "#22D3EE",
  U: "#D946EF", V: "#34D399", W: "#F97316", X: "#94A3B8", Y: "#EAB308", Z: "#06D6A0",
};

function firstLetter(val: string) { return (val[0] || "").toUpperCase(); }

// Emoji “companheiro” dentro da carta (ex.: A → 🪼)
const LETTER_COMPANION: Partial<Record<string, string>> = {
  A: "🪼", E: "🐢", I: "🐠", O: "🐙", U: "🐬",
};
function companionEmojiFor(value: string, deck: DeckType) {
  if (deck === "emoji") return value; // o próprio emoji
  const key = firstLetter(value);
  return LETTER_COMPANION[key] ?? OCEAN_EMOJIS[key.charCodeAt(0) % OCEAN_EMOJIS.length] ?? "🌊";
}

type MemoryCard = {
  id: number;
  value: string;     // letra, sílaba ou emoji
  flipped: boolean;
  matched: boolean;
  isFiller?: boolean; // curinga no 3×3
};

function shuffle<T>(arr: T[], seed = Date.now()): T[] {
  const a = arr.slice();
  let r = seed % 2147483647;
  const rnd = () => (r = (r * 48271) % 2147483647) / 2147483647;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickPairs(count: number, deckType: DeckType): string[] {
  if (deckType === "letters") return LETTERS.slice(0, count);
  if (deckType === "syllables") return SYLLABLES.slice(0, count);
  // emoji
  const base = [...OCEAN_EMOJIS];
  while (base.length < count) base.push(...OCEAN_EMOJIS);
  return base.slice(0, count);
}

function createDeck(boardSize: 2 | 3 | 4, deckType: DeckType): MemoryCard[] {
  const total = boardSize * boardSize;

  if (boardSize === 3) {
    // 3×3 => 4 pares + 1 curinga ★
    const pairs = pickPairs(4, deckType);
    const values = shuffle([...pairs, ...pairs]);
    const deck: MemoryCard[] = values.map((value, index) => ({
      id: index, value, flipped: false, matched: false,
    }));
    deck.push({ id: 99999, value: "★", flipped: true, matched: true, isFiller: true });
    return shuffle(deck);
  }

  // 2×2 => 2 pares, 4×4 => 8 pares
  const pairCount = total / 2;
  const values = shuffle([...pickPairs(pairCount, deckType), ...pickPairs(pairCount, deckType)]);
  return values.map((value, index) => ({ id: index, value, flipped: false, matched: false }));
}

function ConfettiBurst({ active }: { active: boolean }) {
  const pieces = useMemo(() => {
    if (!active) return [] as { left: number; delay: number; duration: number; scale: number; emoji: string }[];
    return Array.from({ length: 28 }, (_, index) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.35,
      duration: 1.4 + Math.random() * 1.3,
      scale: 0.75 + Math.random() * 0.9,
      emoji: CONFETTI_EMOJIS[index % CONFETTI_EMOJIS.length],
    }));
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{ left: `${p.left}%`, animation: `pearls-confetti ${p.duration}s linear ${p.delay}s`, transform: `translateY(-20%) scale(${p.scale})` }}
          className="absolute top-[-10%] text-3xl"
        >
          {p.emoji}
        </span>
      ))}
      <style jsx>{`
        @keyframes pearls-confetti {
          0% { opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(120vh) scale(1.05); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export function MemoryAdventure() {
  const { scores, addScore, recordModuleCompletion } = useGame();

  // ---- Controles solicitados: 2, 3, 4 ----
  const [boardSize, setBoardSize] = useState<2 | 3 | 4>(2);
  // ---- Decks sem "misto": Letras / Sílabas / Emojis ----
  const [deckType, setDeckType] = useState<DeckType>("letters");

  const [deck, setDeck] = useState<MemoryCard[]>(() => createDeck(2, "letters"));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [winCelebration, setWinCelebration] = useState(false);
  const [matchGlowIds, setMatchGlowIds] = useState<number[]>([]);

  // re-cria deck ao trocar tamanho/tipo
  useEffect(() => {
    setDeck(createDeck(boardSize, deckType));
    setFlipped([]); setIsResolving(false); setWinCelebration(false);
    setMatchGlowIds([]);
  }, [boardSize, deckType]);

  const matchedCount = useMemo(() => deck.filter(c => c.matched || c.isFiller).length, [deck]);
  const allMatched = deck.length > 0 && matchedCount === deck.length;

  useEffect(() => {
    if (!allMatched) return;
    recordModuleCompletion("memory");
    setWinCelebration(true);
    setIsResolving(true);

    const t = window.setTimeout(() => {
      setDeck(createDeck(boardSize, deckType));
      setFlipped([]); setIsResolving(false); setWinCelebration(false);
      setMatchGlowIds([]);
    }, RESET_DELAY);
    return () => window.clearTimeout(t);
  }, [allMatched, boardSize, deckType, recordModuleCompletion]);

  const handleFlip = (cardId: number) => {
    setDeck(current => {
      const card = current.find(i => i.id === cardId);
      if (!card || card.flipped || card.matched || card.isFiller || isResolving) return current;
      if (flipped.length >= 2) return current;

      const updated = current.map(i => i.id === cardId ? { ...i, flipped: true } : i);
      const next = [...flipped, cardId];
      setFlipped(next);
      if (next.length === 2) setIsResolving(true);
      return updated;
    });
  };

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    const c1 = deck.find(c => c.id === a);
    const c2 = deck.find(c => c.id === b);
    if (!c1 || !c2) return;

    if (c1.value === c2.value) {
      setDeck(cur => cur.map(c => (flipped.includes(c.id) ? { ...c, matched: true } : c)));
      setMatchGlowIds(flipped);
      addScore("memory", 20, { effect: "success", speak: `Par encontrado: ${c1.value}` });
      window.setTimeout(() => setMatchGlowIds([]), 600);
      setFlipped([]); setIsResolving(false);
      return;
    }

    // erro
    addScore("memory", 0, { effect: "error" });
    const t = window.setTimeout(() => {
      setDeck(cur => cur.map(c => (flipped.includes(c.id) ? { ...c, flipped: false } : c)));
      setFlipped([]); setIsResolving(false);
    }, MISMATCH_DELAY);
    return () => window.clearTimeout(t);
  }, [addScore, deck, flipped]);

  const columnsClass = boardSize === 2 ? "grid-cols-2" : boardSize === 3 ? "grid-cols-3" : "grid-cols-4";

  return (
    <div className="relative">
      <ConfettiBurst active={winCelebration} />

      {winCelebration && (
        <div className="pointer-events-none fixed inset-0 z-40 grid place-items-center bg-black/30 animate-fadeOut">
          <div className="mx-4 rounded-3xl bg-white/95 px-8 py-10 text-center shadow-[0_24px_48px_rgba(9,37,64,0.25)] animate-popIn">
            <p className="text-4xl md:text-5xl font-extrabold text-reef-coral drop-shadow-sm">
              🎉 Parabéns por completar o Jogo da Memória! 🎉
            </p>
            <p className="mt-3 text-reef-shadow/80">Novo baralho chegando em instantes…</p>
          </div>
        </div>
      )}

      <ActivityHeader
        title="Memória das Pérolas"
        subtitle="Vire as cartas e encontre os pares correspondentes."
        moduleId="memory"
        icon="🐚"
        score={scores.memory}
      />

      {/* Controles */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-reef-shadow/60">Tamanho</span>
        <div className="inline-flex overflow-hidden rounded-full border border-reef-shadow/10 bg-white/80 shadow-inner">
          {[2,3,4].map(n => (
            <button
              key={n}
              onClick={() => setBoardSize(n as 2|3|4)}
              type="button"
              className={`px-3 py-1 text-sm font-semibold ${boardSize === n ? "bg-reef-sand/30 text-reef-shadow" : "text-reef-shadow/70 hover:bg-reef-sand/20"}`}
            >
              {n}×{n}
            </button>
          ))}
        </div>

        <span className="ml-3 text-xs font-semibold uppercase tracking-wider text-reef-shadow/60">Deck</span>
        <div className="inline-flex overflow-hidden rounded-full border border-reef-shadow/10 bg-white/80 shadow-inner">
          {(["letters","syllables","emoji"] as DeckType[]).map(t => (
            <button
              key={t}
              onClick={() => setDeckType(t)}
              type="button"
              className={`px-3 py-1 text-sm font-semibold capitalize ${deckType === t ? "bg-reef-sand/30 text-reef-shadow" : "text-reef-shadow/70 hover:bg-reef-sand/20"}`}
            >
              {t === "letters" ? "Letras" : t === "syllables" ? "Sílabas" : "Emojis"}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setDeck(createDeck(boardSize, deckType));
            setFlipped([]); setIsResolving(false); setMatchGlowIds([]); setWinCelebration(false);
          }}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-reef-teal/20 px-4 py-2 text-sm font-semibold text-reef-shadow hover:-translate-y-0.5 transition"
        >
          🔄 Novo Jogo
        </button>
      </div>

      <ActivitySection>
        <div className={`grid ${columnsClass} gap-3 sm:gap-4`}>
          {deck.map(card => {
            const isActive = card.flipped || card.matched || card.isFiller;
            const isMatchGlow = matchGlowIds.includes(card.id);

            const baseRing = card.matched
              ? "ring-4 ring-reef-teal shadow-[0_16px_32px_rgba(15,163,177,0.25)]"
              : isActive
              ? "ring-4 ring-reef-sand"
              : "ring-2 ring-transparent";

            // borda por letra (letras e sílabas)
            const borderKey = firstLetter(card.value);
            const letterBorder =
              isActive && (deckType === "letters" || deckType === "syllables") && LETTER_BORDER_COLORS[borderKey]
                ? { boxShadow: `0 0 0 4px ${LETTER_BORDER_COLORS[borderKey]} inset, 0 8px 18px rgba(0,0,0,.08)` }
                : undefined;

            const companion = companionEmojiFor(card.value, deckType);

            return (
              <button
                key={card.id}
                onClick={() => handleFlip(card.id)}
                disabled={(isResolving && !isActive) || card.isFiller}
                className={`relative h-16 sm:h-20 md:h-24 lg:h-28 w-full transition-transform duration-300 hover:-translate-y-1 disabled:cursor-not-allowed ${baseRing}`}
                style={{  borderRadius: 18 }}
                aria-pressed={isActive}
                aria-label={card.isFiller ? "Carta especial" : `Carta ${card.id}`}
              >
                <div
                  className={`relative h-full w-full [transform-style:preserve-3d] transition-transform duration-500 ${isMatchGlow ? "animate-glowPulse" : ""}`}
                  style={{ transform: isActive ? "rotateY(0deg)" : "rotateY(180deg)", borderRadius: 18 }}
                >
                  {/* Frente: valor + emoji interno */}
                  <span
                    className="absolute inset-0 grid place-items-center rounded-[18px] bg-white text-3xl sm:text-4xl font-black text-reef-shadow [backface-visibility:hidden]"
                    style={letterBorder}
                  >
                    <span className="relative inline-block">
                      {deckType === "emoji" ? companion : card.value}
                      {/* Badge de emoji interno (para letras/sílabas) */}
                     
                    </span>
                  </span>

                  {/* Verso: ? */}
                  <span
                    className="absolute inset-0 grid place-items-center rounded-[18px] bg-reef-teal/15 text-4xl font-bold text-reef-shadow [backface-visibility:hidden]"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    ?
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </ActivitySection>

      <style jsx>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(3px); }
          30%, 50%, 70% { transform: translateX(-5px); }
          40%, 60% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake ${MISMATCH_DELAY}ms cubic-bezier(.36,.07,.19,.97) both; }

        @keyframes glowPulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.35); }
          50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0.2); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0); }
        }
        .animate-glowPulse { animation: glowPulse .65s ease-out 1; }

        @keyframes popIn {
          0% { transform: translateY(8px) scale(.96); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-popIn { animation: popIn .35s ease-out both; }

        @keyframes fadeOut {
          0%, 80% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-fadeOut { animation: fadeOut ${RESET_DELAY}ms ease-in forwards; }
      `}</style>
    </div>
  );
}
