export const VOWEL_TARGETS = {
  A: [
    { emoji: "🐝", word: "Abelha" },
    { emoji: "✈️", word: "Avião" },
    { emoji: "⭐", word: "Astro" },
    { emoji: "🚗", word: "Auto" },
    { emoji: "🦅", word: "Águia" },
  ],
  E: [
    { emoji: "🐘", word: "Elefante" },
    { emoji: "✨", word: "Estrela" },
    { emoji: "🏫", word: "Escola" },
    { emoji: "🪜", word: "Escada" },
    { emoji: "⚔️", word: "Espada" },
  ],
  I: [
    { emoji: "🏝️", word: "Ilha" },
    { emoji: "⛪", word: "Igreja" },
    { emoji: "🧊", word: "Iglu" },
    { emoji: "🦎", word: "Iguana" },
    { emoji: "🥛", word: "Iogurte" },
  ],
  O: [
    { emoji: "8️⃣", word: "Oito" },
    { emoji: "👁️", word: "Olho" },
    { emoji: "🥚", word: "Ovo" },
    { emoji: "🌊", word: "Onda" },
    { emoji: "🐆", word: "Onça" },
  ],
  U: [
    { emoji: "🦄", word: "Unicórnio" },
    { emoji: "🍇", word: "Uva" },
    { emoji: "🐻", word: "Urso" },
    { emoji: "🏭", word: "Usina" },
    { emoji: "☂️", word: "Umbrella" },
  ],
} as const;

export const SYLLABLES = [
  "BA",
  "BE",
  "BI",
  "BO",
  "BU",
  "CA",
  "CE",
  "CI",
  "CO",
  "CU",
  "DA",
  "DE",
  "DI",
  "DO",
  "DU",
  "FA",
  "FE",
  "FI",
  "FO",
  "FU",
] as const;

export const WORD_ROUNDS = [
  { word: "GATO", emoji: "🐱" },
  { word: "CASA", emoji: "🏠" },
  { word: "BOLA", emoji: "⚽" },
  { word: "PATO", emoji: "🦆" },
  { word: "MESA", emoji: "🪑" },
] as const;

export const RHYME_ROUNDS = [
  { word: "GATO", rhymes: ["PATO", "RATO"], wrong: ["CASA", "BOLA"] },
  { word: "BOLA", rhymes: ["COLA", "MOLA"], wrong: ["PATO", "MESA"] },
  { word: "PÃO", rhymes: ["MÃO", "CÃO"], wrong: ["SOL", "LUA"] },
] as const;

export const BINGO_SYLLABLES = [
  "BA",
  "BE",
  "BI",
  "BO",
  "BU",
  "CA",
  "CE",
  "CI",
  "CO",
] as const;

export const MEMORY_PAIRS = ["A", "E", "I", "O", "U", "B", "C", "D"] as const;

export const STORY_SCENES = [
  {
    id: "scene-a",
    illustration: "🐠",
    text: "Ludo, o peixinho-palhaço, foi nadando a brincar; encontrou sua amiga ARRAIA — A de ARRAIA no mar! A de ÁGUA que espirra, A de ALGA a balançar; escolha a letra A para com Ludo rimar.",
    options: ["A", "E", "I"],
    answer: "A",
  },
  {
    id: "scene-e",
    illustration: "⭐",
    text: "Mais adiante, brilhou uma ESTRELA-DO-MAR a sorrir; E de ESTRELA, E de ESPUMA — com E vamos seguir! No brilho das ondas, é fácil de lembrar: a palavra ESTRELA começa com E do mar.",
    options: ["O", "U", "E"],
    answer: "E",
  },
  {
    id: "scene-i",
    illustration: "🦎",
    text: "Perto da ilha de corais veio a IGUANA-MARINHA surgir; I de IGUANA, I de ILHA — com I vamos repetir! No ritmo das bolhas é doce de cantar: IGUANA começa com I, é só clicar.",
    options: ["I", "A", "O"],
    answer: "I",
  },
  {
    id: "scene-o",
    illustration: "🐋",
    text: "De repente, salta a ORCA fazendo ondas abrir; O de ORCA, O de OCEANO — com O vamos aplaudir! O som redondinho faz o mar ecoar: ORCA começa com O, vamos marcar.",
    options: ["O", "E", "U"],
    answer: "O",
  },
  {
    id: "scene-u",
    illustration: "🦭",
    text: "No fim da aventura, um URSO-MARINHO veio surgir; U de URSO-MARINHO, U de UM abraço — com U vamos concluir! No abraço do oceano, é bom recordar: URSO-MARINHO começa com U do mar.",
    options: ["U", "A", "I"],
    answer: "U",
  },
] as const;

export type ModuleId =
  | "trail"
  | "vowels"
  | "syllables"
  | "words"
  | "rhymes"
  | "spelling"
  | "bingo"
  | "memory"
  | "story"
  | "parent";

export const MODULES: {
  id: ModuleId;
  name: string;
  description: string;
  icon: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  accent: string;
}[] = [
  {
    id: "trail",
    name: "Recife Principal",
    description:
      "Siga a trilha sugerida e desbloqueie habitats coloridos do fundo do mar.",
    icon: "🪸",
    difficulty: "Iniciante",
    accent: "#2563EB",
  },
  {
    id: "vowels",
    name: "Vogais Luminosas",
    description: "Combine vogais com criaturas marinhas cintilantes.",
    icon: "🐚",
    difficulty: "Iniciante",
    accent: "#2563EB",
  },
  {
    id: "syllables",
    name: "Sílabas Borbulhantes",
    description: "Arraste letras para formar sílabas nas bolhas.",
    icon: "🫧",
    difficulty: "Intermediário",
    accent: "#8B5CF6",
  },
  {
    id: "words",
    name: "Palavras de Areia",
    description: "Construa palavras completas para erguer castelos submarinos.",
    icon: "📜",
    difficulty: "Intermediário",
    accent: "#F97316",
  },
  {
    id: "rhymes",
    name: "Rimas das Marés",
    description: "Descubra sons que combinam com o ritmo das ondas.",
    icon: "🎵",
    difficulty: "Intermediário",
    accent: "#0EA5E9",
  },
  {
    id: "spelling",
    name: "Laboratório do Som",
    description:
      "Digite uma palavra, ouça a soletração e responda desafios sobre ela.",
    icon: "🔤",
    difficulty: "Intermediário",
    accent: "#6366F1",
  },
  {
    id: "bingo",
    name: "Bingo dos Recifes",
    description: "Marque sílabas sorteadas e complete o tabuleiro de corais.",
    icon: "🎲",
    difficulty: "Avançado",
    accent: "#ff305dff",
  },
  {
    id: "memory",
    name: "Memória das Pérolas",
    description: "Combine pares de cartas para resgatar pérolas brilhantes.",
    icon: "🧠",
    difficulty: "Avançado",
    accent: "#EC4899",
  },
  {
    id: "story",
    name: "História Submarina",
    description:
      "Acompanhe o peixinho-palhaço em uma aventura narrativa interativa.",
    icon: "📖",
    difficulty: "Iniciante",
    accent: "#10B981",
  },
  {
    id: "parent",
    name: "Painel da Família",
    description: "Acompanhe progresso, badges e o aquário da criança.",
    icon: "🦈",
    difficulty: "Iniciante",
    accent: "#0D9488",
  },
];
export type LeaderboardEntry = {
  id: string;
  name: string;
  avatar: string;
  score: number;
  badges: number;
};

export const LEADERBOARD_SEED: LeaderboardEntry[] = [
  { id: "1", name: "Lia do Coral", avatar: "🐠", score: 720, badges: 8 },
  { id: "2", name: "Nico Bolha", avatar: "🐙", score: 600, badges: 7 },
  { id: "3", name: "Téo Marujo", avatar: "🐟", score: 520, badges: 6 },
  { id: "4", name: "Mia Anêmona", avatar: "🪼", score: 440, badges: 5 },
  { id: "5", name: "Bia Concha", avatar: "🦀", score: 400, badges: 5 },
];

export const BADGE_DEFINITIONS = [
  {
    id: "first-steps",
    label: "Primeiro Cardume",
    description: "Complete a primeira atividade para resgatar peixinhos.",
    requirement: 1,
  },
  {
    id: "vowel-master",
    label: "Guardião das Vogais",
    description: "Acerte 10 combinações de vogais.",
    requirement: 10,
  },
  {
    id: "syllable-sailor",
    label: "Marujo das Sílabas",
    description: "Monte 5 sílabas corretas.",
    requirement: 5,
  },
  {
    id: "bingo-champion",
    label: "Campeão do Bingo",
    description: "Complete uma cartela de bingo.",
    requirement: 1,
  },
] as const;
