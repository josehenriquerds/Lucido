export type LetterKey = "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V"|"W"|"X"|"Y"|"Z";

export type LetterTheme = {
  color: string;            // cor principal (texto/borda)
  bg?: string;              // bg sólido ou gradiente
  emoji?: string;           // fallback emoji
  image?: string;           // caminho de imagem (opcional)
  labelPT: string;          // "A de Abelha"
};

export const LETTER_THEME: Record<LetterKey, LetterTheme> = {
  A: {
    color: "#F59E0B",
    bg: "linear-gradient(180deg, #FEF3C7, #FDE68A)",
    emoji: "🐝",
    image: "/phonics/A_abelha.png",
    labelPT: "A de Abelha"
  },
  E: {
    color: "#3B82F6",
    bg: "linear-gradient(180deg, #DBEAFE, #93C5FD)",
    emoji: "🐘",
    image: "/phonics/E_elefante.png",
    labelPT: "E de Elefante"
  },
  I: {
    color: "#8B5CF6",
    bg: "linear-gradient(180deg, #EDE9FE, #C4B5FD)",
    emoji: "🦎",
    image: "/phonics/I_iguana.png",
    labelPT: "I de Iguana"
  },
  O: {
    color: "#F97316",
    bg: "linear-gradient(180deg, #FED7AA, #FB923C)",
    emoji: "👁️",
    image: "/phonics/O_olho.png",
    labelPT: "O de Olho"
  },
  U: {
    color: "#10B981",
    bg: "linear-gradient(180deg, #D1FAE5, #6EE7B7)",
    emoji: "🦄",
    image: "/phonics/U_unicornio.png",
    labelPT: "U de Unicórnio"
  },
  B: {
    color: "#06B6D4",
    bg: "linear-gradient(180deg, #CFFAFE, #67E8F9)",
    emoji: "🚲",
    image: "/phonics/B_bicicleta.png",
    labelPT: "B de Bicicleta"
  },
  C: {
    color: "#84CC16",
    bg: "linear-gradient(180deg, #ECFCCB, #BEF264)",
    emoji: "🏠",
    image: "/phonics/C_casa.png",
    labelPT: "C de Casa"
  },
  D: {
    color: "#F59E0B",
    bg: "linear-gradient(180deg, #FEF3C7, #FCD34D)",
    emoji: "🐶",
    image: "/phonics/D_dog.png",
    labelPT: "D de Dog"
  },
  F: {
    color: "#EF4444",
    bg: "linear-gradient(180deg, #FEE2E2, #FCA5A5)",
    emoji: "🌸",
    image: "/phonics/F_flor.png",
    labelPT: "F de Flor"
  },
  G: {
    color: "#059669",
    bg: "linear-gradient(180deg, #D1FAE5, #A7F3D0)",
    emoji: "🐱",
    image: "/phonics/G_gato.png",
    labelPT: "G de Gato"
  },
  H: {
    color: "#7C3AED",
    bg: "linear-gradient(180deg, #F3E8FF, #DDD6FE)",
    emoji: "🍯",
    image: "/phonics/H_honey.png",
    labelPT: "H de Honey"
  },
  J: {
    color: "#DC2626",
    bg: "linear-gradient(180deg, #FEE2E2, #F87171)",
    emoji: "🦒",
    image: "/phonics/J_jirafa.png",
    labelPT: "J de Jirafa"
  },
  K: {
    color: "#B45309",
    bg: "linear-gradient(180deg, #FEF3C7, #F3CC30)",
    emoji: "🥝",
    image: "/phonics/K_kiwi.png",
    labelPT: "K de Kiwi"
  },
  L: {
    color: "#059669",
    bg: "linear-gradient(180deg, #ECFDF5, #A7F3D0)",
    emoji: "🦁",
    image: "/phonics/L_leao.png",
    labelPT: "L de Leão"
  },
  M: {
    color: "#7C2D12",
    bg: "linear-gradient(180deg, #FEF7ED, #FDBA74)",
    emoji: "🐒",
    image: "/phonics/M_macaco.png",
    labelPT: "M de Macaco"
  },
  N: {
    color: "#1E40AF",
    bg: "linear-gradient(180deg, #EFF6FF, #93C5FD)",
    emoji: "☁️",
    image: "/phonics/N_nuvem.png",
    labelPT: "N de Nuvem"
  },
  P: {
    color: "#BE185D",
    bg: "linear-gradient(180deg, #FDF2F8, #F9A8D4)",
    emoji: "🦆",
    image: "/phonics/P_pato.png",
    labelPT: "P de Pato"
  },
  Q: {
    color: "#7C2D12",
    bg: "linear-gradient(180deg, #FEF7ED, #FED7AA)",
    emoji: "🧀",
    image: "/phonics/Q_queijo.png",
    labelPT: "Q de Queijo"
  },
  R: {
    color: "#DC2626",
    bg: "linear-gradient(180deg, #FEE2E2, #FECACA)",
    emoji: "🐭",
    image: "/phonics/R_rato.png",
    labelPT: "R de Rato"
  },
  S: {
    color: "#0891B2",
    bg: "linear-gradient(180deg, #E0F7FA, #4DD0E1)",
    emoji: "🐍",
    image: "/phonics/S_serpente.png",
    labelPT: "S de Serpente"
  },
  T: {
    color: "#059669",
    bg: "linear-gradient(180deg, #F0FDF4, #BBF7D0)",
    emoji: "🐢",
    image: "/phonics/T_tartaruga.png",
    labelPT: "T de Tartaruga"
  },
  V: {
    color: "#7C2D12",
    bg: "linear-gradient(180deg, #FEF7ED, #FDE68A)",
    emoji: "🐄",
    image: "/phonics/V_vaca.png",
    labelPT: "V de Vaca"
  },
  W: {
    color: "#1F2937",
    bg: "linear-gradient(180deg, #F9FAFB, #D1D5DB)",
    emoji: "🌐",
    image: "/phonics/W_web.png",
    labelPT: "W de Web"
  },
  X: {
    color: "#7C2D12",
    bg: "linear-gradient(180deg, #FEF7ED, #FDE68A)",
    emoji: "☂️",
    image: "/phonics/X_xale.png",
    labelPT: "X de Xale"
  },
  Y: {
    color: "#EAB308",
    bg: "linear-gradient(180deg, #FEFCE8, #FEF08A)",
    emoji: "🧘",
    image: "/phonics/Y_yoga.png",
    labelPT: "Y de Yoga"
  },
  Z: {
    color: "#374151",
    bg: "linear-gradient(180deg, #F9FAFB, #E5E7EB)",
    emoji: "🦓",
    image: "/phonics/Z_zebra.png",
    labelPT: "Z de Zebra"
  }
};

/**
 * Obtém o tema de uma letra
 */
export function getLetterTheme(letter: string): LetterTheme | null {
  const upperLetter = letter.toUpperCase() as LetterKey;
  return LETTER_THEME[upperLetter] || null;
}

/**
 * Obtém a primeira letra de uma sílaba e seu tema
 */
export function getSyllableTheme(syllable: string): LetterTheme | null {
  if (!syllable || syllable.length === 0) return null;
  return getLetterTheme(syllable[0]);
}

/**
 * Gera estilos CSS dinâmicos para uma letra
 */
export function getLetterStyles(letter: string, emphasized = false) {
  const theme = getLetterTheme(letter);
  if (!theme) return {};

  const fontSize = emphasized
    ? "clamp(40px, 10vw, 112px)"
    : "clamp(32px, 8vw, 88px)";

  return {
    fontSize,
    color: theme.color,
    background: theme.bg,
    boxShadow: `0 0 0 ${emphasized ? '6px' : '4px'} ${theme.color} inset`,
  };
}