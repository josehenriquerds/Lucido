
export type FishDifficulty = "easy" | "medium" | "hard";
export type HabitatTheme = "shallow" | "reef" | "grotto";

export type FishDefinition = {
  id: string;
  name: string;
  emoji: string;
  difficulty: FishDifficulty;
  fact: string;
  habitat: HabitatTheme;
};

const EASY_FISH: FishDefinition[] = [
  {
    id: "sunny-tetra",
    name: "Tetra Solar",
    emoji: "🐠",
    difficulty: "easy",
    fact: "Nada em bandos iluminados perto da superfície.",
    habitat: "shallow",
  },
  {
    id: "coral-guppy",
    name: "Guppy Coralina",
    emoji: "🐟",
    difficulty: "easy",
    fact: "Segue as algas verdes para não se perder.",
    habitat: "shallow",
  },
  {
    id: "lagoon-angel",
    name: "Anjo da Lagoa",
    emoji: "🐠✨",
    difficulty: "easy",
    fact: "Abre as nadadeiras brilhantes quando alguém chega.",
    habitat: "shallow",
  },
  {
    id: "bubble-discus",
    name: "Disco de Bolhas",
    emoji: "🐠💭",
    difficulty: "easy",
    fact: "Faz círculos perfeitos com pequenas bolhas de ar.",
    habitat: "shallow",
  },
  {
    id: "pearl-sardine",
    name: "Pérola",
    emoji: "⚪",
    difficulty: "easy",
    fact: "Coleciona pedrinhas claras para decorar o recife.",
    habitat: "reef",
  },
  {
    id: "reef-butterfly",
    name: "Borbopeixe",
    emoji: "🐠",
    difficulty: "easy",
    fact: "Passeia entre corais como se voasse debaixo d'água.",
    habitat: "reef",
  },
  {
    id: "seagrass-goby",
    name: "Algas",
    emoji: "🌿",
    difficulty: "easy",
    fact: "Esconde pequenas pistas entre as algas altas.",
    habitat: "reef",
  },
  {
    id: "tide-damselfish",
    name: "Donzela das Marés",
    emoji: "🐠",
    difficulty: "easy",
    fact: "Acompanha mergulhos suaves nas aulas iniciais.",
    habitat: "shallow",
  },
  {
    id: "sparkle-clown",
    name: "Palhaço Cintilante",
    emoji: "🐡",
    difficulty: "easy",
    fact: "Solta risadas em bolhas quando alguém acerta de primeira.",
    habitat: "reef",
  },
  {
    id: "azure-rasbora",
    name: "Rasbora Azul",
    emoji: "🐠",
    difficulty: "easy",
    fact: "Brilha em azul intenso para sinalizar atenção.",
    habitat: "shallow",
  },
  {
    id: "mellow-molly",
    name: "Molinésia Serena",
    emoji: "🐠",
    difficulty: "easy",
    fact: "Nada devagar para treinar movimentos delicados.",
    habitat: "shallow",
  },
  {
    id: "sand-piperfish",
    name: "Peixe-Pipa de Areia",
    emoji: "🐟",
    difficulty: "easy",
    fact: "Desenha rotas na areia para guiar a turma.",
    habitat: "shallow",
  },
];
const MEDIUM_FISH: FishDefinition[] = [
  {
    id: "ember-lionfish",
    name: "Peixe-Leão Brasa",
    emoji: "🐟",
    difficulty: "medium",
    fact: "Expande espinhos luminosos quando o foco está alto.",
    habitat: "reef",
  },
  {
    id: "orchid-octopus",
    name: "Polvo Orquídea",
    emoji: "🐙",
    difficulty: "medium",
    fact: "Muda de cor para combinar com flores submarinas.",
    habitat: "reef",
  },
  {
    id: "cerulean-ray",
    name: "Arraia Celeste",
    emoji: "🐠",
    difficulty: "medium",
    fact: "Desliza como cometa azul para indicar a resposta certa.",
    habitat: "reef",
  },
  {
    id: "lantern-parrotfish",
    name: "Budião Lanterna",
    emoji: "🐠",
    difficulty: "medium",
    fact: "Ilumina túneis quando o desafio pede mais atenção.",
    habitat: "reef",
  },
  {
    id: "tide-boxfish",
    name: "Peixe-Caixa das Marés",
    emoji: "🐟",
    difficulty: "medium",
    fact: "Entrega pequenas recompensas ao fim das rodadas.",
    habitat: "reef",
  },
  {
    id: "sapphire-stingray",
    name: "Arraia Safira",
    emoji: "🐟",
    difficulty: "medium",
    fact: "Faz loops brilhantes após duas respostas corretas seguidas.",
    habitat: "reef",
  },
  {
    id: "swirl-cuttle",
    name: "Choco Espiral",
    emoji: "🦑",
    difficulty: "medium",
    fact: "Deixa rastros coloridos para treinar escrita no ar.",
    habitat: "reef",
  },
  {
    id: "azure-lobster",
    name: "Lagosta Azul",
    emoji: "🦞",
    difficulty: "medium",
    fact: "Organiza cartas de bingo com suas pinças precisas.",
    habitat: "reef",
  },
  {
    id: "chorus-seadrum",
    name: "Tamboril Coral",
    emoji: "🐟",
    difficulty: "medium",
    fact: "Marca o ritmo das sílabas com sininhos submersos.",
    habitat: "reef",
  },
  {
    id: "kelp-surgeon",
    name: "Cirurgião das Algas",
    emoji: "🐟",
    difficulty: "medium",
    fact: "Apara algas altas para abrir caminho ao cardume.",
    habitat: "reef",
  },
  {
    id: "bubble-mantis",
    name: "Camarão Mantis Bolha",
    emoji: "🦐",
    difficulty: "medium",
    fact: "Dispara bolhas coloridas quando a resposta é correta.",
    habitat: "reef",
  },
  {
    id: "prism-pipefish",
    name: "Peixe-Cachimbo Prisma",
    emoji: "🐠",
    difficulty: "medium",
    fact: "Amplia letras como lente para reforçar a leitura.",
    habitat: "reef",
  },
];
const HARD_FISH: FishDefinition[] = [
  {
    id: "midnight-dragonet",
    name: "Dragonete Meia-Noite",
    emoji: "🐟",
    difficulty: "hard",
    fact: "Acende pintinhas como estrelas em grutas silenciosas.",
    habitat: "grotto",
  },
  {
    id: "abyssal-angler",
    name: "Peixe-Lanterna do Abismo",
    emoji: "🐠",
    difficulty: "hard",
    fact: "Usa cristal luminoso para guiar mergulhos difíceis.",
    habitat: "grotto",
  },
  {
    id: "glacier-goby",
    name: "Gobí de Gelo",
    emoji: "🐟",
    difficulty: "hard",
    fact: "Mantém a calma mesmo em águas profundas e frias.",
    habitat: "grotto",
  },
  {
    id: "volcanic-crab",
    name: "Caranguejo Vulcânico",
    emoji: "🦀",
    difficulty: "hard",
    fact: "Protege cavernas quentes com suas pinças incandescentes.",
    habitat: "grotto",
  },
  {
    id: "aurora-squid",
    name: "Lula Aurora",
    emoji: "🦑",
    difficulty: "hard",
    fact: "Solta faíscas coloridas quando alguém vence um desafio difícil.",
    habitat: "grotto",
  },
  {
    id: "echo-orca",
    name: "Orca Ecoante",
    emoji: "🐳",
    difficulty: "hard",
    fact: "Repete sílabas com cantos para reforçar memorização.",
    habitat: "grotto",
  },
  {
    id: "galaxy-dolphin",
    name: "Golfinho Galáxia",
    emoji: "🐬",
    difficulty: "hard",
    fact: "Dá saltos brilhantes em sequências sem erros.",
    habitat: "grotto",
  },
  {
    id: "ancient-turtle",
    name: "Tartaruga Anciã",
    emoji: "🐢",
    difficulty: "hard",
    fact: "Conta histórias antigas para incentivar a persistência.",
    habitat: "grotto",
  },
  {
    id: "crystal-jelly",
    name: "Medusa de Cristal",
    emoji: "🐚",
    difficulty: "hard",
    fact: "Pulsa como cristal para marcar o ritmo das sílabas.",
    habitat: "grotto",
  },
  {
    id: "phantom-ray",
    name: "Arraia Fantasma",
    emoji: "🐟",
    difficulty: "hard",
    fact: "Aparece discreta para treinar movimentos precisos.",
    habitat: "grotto",
  },
  {
    id: "storm-swordfish",
    name: "Peixe-Espada Tempestade",
    emoji: "🐠",
    difficulty: "hard",
    fact: "Corta obstáculos difíceis com velocidade elétrica.",
    habitat: "grotto",
  },
  {
    id: "luminous-whale",
    name: "Baleia Luminescente",
    emoji: "🐋",
    difficulty: "hard",
    fact: "Cria ondas calmas para lembrar de respirar fundo.",
    habitat: "grotto",
  },
];
export const FISH_POOL: FishDefinition[] = [...EASY_FISH, ...MEDIUM_FISH, ...HARD_FISH];

export const FISH_BY_DIFFICULTY: Record<FishDifficulty, FishDefinition[]> = {
  easy: EASY_FISH,
  medium: MEDIUM_FISH,
  hard: HARD_FISH,
};

export const FISH_BY_ID: Record<string, FishDefinition> = FISH_POOL.reduce(
  (acc, fish) => {
    acc[fish.id] = fish;
    return acc;
  },
  {} as Record<string, FishDefinition>,
);

export const ALL_FISH_IDS: readonly string[] = FISH_POOL.map((fish) => fish.id);

export const DAILY_DIFFICULTY_TARGETS = {
  easy: 2,
  medium: 6,
  hard: 2,
} as const;

export const TOTAL_DAILY_TARGET =
  DAILY_DIFFICULTY_TARGETS.easy + DAILY_DIFFICULTY_TARGETS.medium + DAILY_DIFFICULTY_TARGETS.hard;

const DAY_IN_MS = 86_400_000;
const REFERENCE_DAY = Date.UTC(2024, 0, 1);

export type DailyShoal = {
  date: string;
  fishIds: string[];
};

export function getFishById(id: string): FishDefinition | undefined {
  return FISH_BY_ID[id];
}

export function createDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function currentDateKey(): string {
  return createDateKey(new Date());
}
function rotateTake<T>(items: readonly T[], start: number, amount: number): T[] {
  if (items.length === 0 || amount <= 0) {
    return [];
  }

  const result: T[] = [];
  for (let index = 0; index < amount; index += 1) {
    result.push(items[(start + index) % items.length]);
  }
  return result;
}

export function dayIndexFromDateKey(dateKey: string): number {
  const [yearRaw, monthRaw, dayRaw] = dateKey.split("-");
  const year = Number.parseInt(yearRaw ?? "", 10);
  const month = Number.parseInt(monthRaw ?? "", 10);
  const day = Number.parseInt(dayRaw ?? "", 10);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return 0;
  }

  const utc = Date.UTC(year, month - 1, day);
  return Math.max(0, Math.floor((utc - REFERENCE_DAY) / DAY_IN_MS));
}

export function buildDailyShoal(dateKey: string): DailyShoal {
  const index = dayIndexFromDateKey(dateKey);
  const easyOffset = index * DAILY_DIFFICULTY_TARGETS.easy;
  const mediumOffset = index * DAILY_DIFFICULTY_TARGETS.medium;
  const hardOffset = index * DAILY_DIFFICULTY_TARGETS.hard;

  const selection = [
    ...rotateTake(FISH_BY_DIFFICULTY.easy, easyOffset, DAILY_DIFFICULTY_TARGETS.easy),
    ...rotateTake(FISH_BY_DIFFICULTY.medium, mediumOffset, DAILY_DIFFICULTY_TARGETS.medium),
    ...rotateTake(FISH_BY_DIFFICULTY.hard, hardOffset, DAILY_DIFFICULTY_TARGETS.hard),
  ];

  return { date: dateKey, fishIds: selection.map((fish) => fish.id) };
}

export function ensureDailyShoal(dateKey: string, previous?: DailyShoal | null): DailyShoal {
  if (previous && previous.date === dateKey && previous.fishIds.length === TOTAL_DAILY_TARGET) {
    return previous;
  }
  return buildDailyShoal(dateKey);
}

export function nextUnrescuedFishId(
  ownedIds: Set<string>,
  daily: DailyShoal,
  fallbackPool: readonly string[],
): string | undefined {
  const dailyCandidate = daily.fishIds.find((fishId) => !ownedIds.has(fishId));
  if (dailyCandidate) {
    return dailyCandidate;
  }

  return fallbackPool.find((fishId) => !ownedIds.has(fishId));
}
