"use client";



import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";



import { playTone, SoundEffect, speakText } from "@/lib/audio";

import { readStorage, writeStorage } from "@/lib/storage";

import {

  BADGE_DEFINITIONS,

  LEADERBOARD_SEED,

  ModuleId,

  type LeaderboardEntry,

} from "@/lib/game-data";

import {

  ALL_FISH_IDS,

  DailyShoal,

  FishDefinition,

  FISH_BY_ID,

  FISH_POOL,

  currentDateKey,

  ensureDailyShoal,

  getFishById,

} from "@/lib/fish";



const FISH_THRESHOLD = 40;



type BadgeId = (typeof BADGE_DEFINITIONS)[number]["id"];



type ScoreBoard = {

  vowels: number;

  syllables: number;

  words: number;

  rhymes: number;

  spelling: number;

  bingo: number;

  memory: number;

  "syllable-join": number;

  "spelling-beaba": number;

  colors: number;

  total: number;

};



type ProgressMetrics = {

  activitiesCompleted: number;

  vowelMatches: number;

  syllableAssemblies: number;

  bingoWins: number;

};



type ModuleProgress = Record<ModuleId, number>;



type AquariumFish = {

  id: string;

  fishId: string;

  module?: ModuleId;

  earnedAt: number;

};



type StoredAquariumRecord = Partial<AquariumFish> & {

  species?: string;

};



type CelebrationIntensity = "low" | "medium" | "high";



const SCORE_DEFAULT: ScoreBoard = {

  vowels: 0,

  syllables: 0,

  words: 0,

  rhymes: 0,

  spelling: 0,

  bingo: 0,

  memory: 0,

  "syllable-join": 0,

  "spelling-beaba": 0,

  colors: 0,

  total: 0,

};



const METRICS_DEFAULT: ProgressMetrics = {

  activitiesCompleted: 0,

  vowelMatches: 0,

  syllableAssemblies: 0,

  bingoWins: 0,

};



const MODULE_PROGRESS_DEFAULT: ModuleProgress = {

  trail: 0,

  vowels: 0,

  syllables: 0,

  words: 0,

  rhymes: 0,

  spelling: 0,

  bingo: 0,

  memory: 0,

  story: 0,

  parent: 0,

  "syllable-join": 0,

  "spelling-beaba": 0,

  colors: 0,

};



const STORAGE_KEYS = {

  scores: "lucido:scores",

  metrics: "lucido:metrics",

  avatar: "lucido:avatar",

  playerName: "lucido:player-name",

  audio: "lucido:audio-enabled",

  lowStimulus: "lucido:low-stimulus",

  terms: "lucido:terms-accepted",

  moduleProgress: "lucido:module-progress",

  badges: "lucido:badges",

  aquarium: "lucido:aquarium",

  dailyShoal: "lucido:daily-shoal",

  celebrationIntensity: "lucido:celebration-intensity",

  celebrationSound: "lucido:celebration-sound",

};



const badgeCheckers: Record<BadgeId, (metrics: ProgressMetrics) => boolean> = {

  "first-steps": (metrics) => metrics.activitiesCompleted >= 1,

  "vowel-master": (metrics) => metrics.vowelMatches >= 10,

  "syllable-sailor": (metrics) => metrics.syllableAssemblies >= 5,

  "bingo-champion": (metrics) => metrics.bingoWins >= 1,

};



type ScoreKey = Exclude<keyof ScoreBoard, "total">;



type AddScoreOptions = {

  metric?: keyof ProgressMetrics;

  increment?: number;

  speak?: string;

  effect?: SoundEffect;

  module?: ModuleId;

};



type GameContextValue = {

  scores: ScoreBoard;

  addScore: (key: ScoreKey, amount: number, options?: AddScoreOptions) => void;

  resetScores: () => void;

  metrics: ProgressMetrics;

  registerMetric: (metric: keyof ProgressMetrics, amount?: number) => void;

  moduleProgress: ModuleProgress;

  recordModuleCompletion: (module: ModuleId) => void;

  earnedBadges: BadgeId[];

  aquarium: AquariumFish[];

  totalFish: number;

  avatar: string;

  setAvatar: (avatar: string) => void;

  playerName: string;

  setPlayerName: (name: string) => void;

  audioEnabled: boolean;

  toggleAudio: () => void;

  lowStimulus: boolean;

  toggleLowStimulus: () => void;

  celebrationIntensity: CelebrationIntensity;

  setCelebrationIntensity: (value: CelebrationIntensity) => void;

  celebrationSound: boolean;

  setCelebrationSound: (value: boolean) => void;

  acceptedTerms: boolean;

  acceptTerms: () => void;

  playEffect: (effect: SoundEffect) => void;

  narrate: (text: string) => void;

  leaderboard: LeaderboardEntry[];

  fishCatalog: FishDefinition[];

  fishById: Record<string, FishDefinition>;

  dailyShoal: DailyShoal;

};



const GameContext = createContext<GameContextValue | null>(null);



function loadModuleProgress(): ModuleProgress {

  const stored = readStorage<ModuleProgress | null>(STORAGE_KEYS.moduleProgress, null);

  if (!stored) {

    return { ...MODULE_PROGRESS_DEFAULT };

  }

  return { ...MODULE_PROGRESS_DEFAULT, ...stored };

}



function normalizeAquariumEntry(entry: StoredAquariumRecord, fallbackId: string): AquariumFish | null {

  if (!entry) return null;

  const id = entry.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const earnedAt = typeof entry.earnedAt === "number" ? entry.earnedAt : Date.now();

  if (entry.fishId) {

    return { id, fishId: entry.fishId, module: entry.module, earnedAt };

  }

  if (entry.species) {

    const matched = FISH_POOL.find((fish) => fish.emoji === entry.species);

    const fishId = matched?.id ?? fallbackId;

    return { id, fishId, module: entry.module, earnedAt };

  }

  return null;

}



export function GameProvider({ children }: { children: React.ReactNode }) {

  const [scores, setScores] = useState<ScoreBoard>(SCORE_DEFAULT);

  const [metrics, setMetrics] = useState<ProgressMetrics>(METRICS_DEFAULT);

  const [moduleProgress, setModuleProgress] = useState<ModuleProgress>(MODULE_PROGRESS_DEFAULT);

  const [earnedBadges, setEarnedBadges] = useState<BadgeId[]>([]);

  const [avatar, setAvatarState] = useState("🐠");

  const [playerName, setPlayerNameState] = useState("Explorador(a) do Recife");

  const [audioEnabled, setAudioEnabled] = useState(true);

  const [lowStimulus, setLowStimulus] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [aquarium, setAquarium] = useState<AquariumFish[]>([]);

  const [dailyShoal, setDailyShoal] = useState<DailyShoal>(() => ensureDailyShoal(currentDateKey()));

  const [celebrationIntensity, setCelebrationIntensityState] = useState<CelebrationIntensity>("medium");

  const [celebrationSound, setCelebrationSoundState] = useState(true);



  useEffect(() => {

    setScores(readStorage(STORAGE_KEYS.scores, SCORE_DEFAULT));

    setMetrics(readStorage(STORAGE_KEYS.metrics, METRICS_DEFAULT));

    setAvatarState(readStorage(STORAGE_KEYS.avatar, "🐠"));

    setPlayerNameState(readStorage(STORAGE_KEYS.playerName, "Explorador(a) do Recife"));

    setAudioEnabled(readStorage(STORAGE_KEYS.audio, true));

    setLowStimulus(readStorage(STORAGE_KEYS.lowStimulus, false));

    setAcceptedTerms(readStorage(STORAGE_KEYS.terms, false));

    setModuleProgress(loadModuleProgress());

    setEarnedBadges(readStorage(STORAGE_KEYS.badges, [] as BadgeId[]));



    const rawAquarium = readStorage(STORAGE_KEYS.aquarium, [] as StoredAquariumRecord[]);

    const fallbackId = FISH_POOL[0]?.id ?? "sunny-tetra";

    const normalizedAquarium = rawAquarium

      .map((record) => normalizeAquariumEntry(record, fallbackId))

      .filter((item): item is AquariumFish => Boolean(item));

    setAquarium(normalizedAquarium);



    const storedShoal = readStorage(STORAGE_KEYS.dailyShoal, null as DailyShoal | null);

    const today = currentDateKey();

    const resolvedShoal = ensureDailyShoal(today, storedShoal);

    setDailyShoal(resolvedShoal);

    writeStorage(STORAGE_KEYS.dailyShoal, resolvedShoal);



    const storedIntensity = readStorage<string>(STORAGE_KEYS.celebrationIntensity, "medium");

    if (storedIntensity === "low" || storedIntensity === "medium" || storedIntensity === "high") {
      setCelebrationIntensityState(storedIntensity as CelebrationIntensity);
    }

    setCelebrationSoundState(readStorage(STORAGE_KEYS.celebrationSound, true));

  }, []);



  useEffect(() => {

    if (typeof window === "undefined") {

      return;

    }

    const interval = window.setInterval(() => {

      setDailyShoal((previous) => {

        const today = currentDateKey();

        if (previous.date === today) {

          return previous;

        }

        const next = ensureDailyShoal(today);

        writeStorage(STORAGE_KEYS.dailyShoal, next);

        return next;

      });

    }, 600000);

    return () => window.clearInterval(interval);

  }, []);



  useEffect(() => {

    writeStorage(STORAGE_KEYS.scores, scores);

  }, [scores]);



  useEffect(() => {

    writeStorage(STORAGE_KEYS.metrics, metrics);

    const unlocked = BADGE_DEFINITIONS.filter((badge) => badgeCheckers[badge.id]?.(metrics)).map((badge) => badge.id);

    setEarnedBadges((previous) => {

      if (unlocked.every((badge) => previous.includes(badge)) && previous.every((badge) => unlocked.includes(badge))) {

        return previous;

      }

      writeStorage(STORAGE_KEYS.badges, unlocked);

      return unlocked;

    });

  }, [metrics]);



  useEffect(() => {

    writeStorage(STORAGE_KEYS.avatar, avatar);

  }, [avatar]);



  useEffect(() => {

    writeStorage(STORAGE_KEYS.playerName, playerName);

  }, [playerName]);



  useEffect(() => {

    writeStorage(STORAGE_KEYS.audio, audioEnabled);

  }, [audioEnabled]);



  useEffect(() => {

    writeStorage(STORAGE_KEYS.lowStimulus, lowStimulus);

  }, [lowStimulus]);



  useEffect(() => {

    writeStorage(STORAGE_KEYS.terms, acceptedTerms);

  }, [acceptedTerms]);



  useEffect(() => {

    writeStorage(STORAGE_KEYS.moduleProgress, moduleProgress);

  }, [moduleProgress]);



  useEffect(() => {

    writeStorage(STORAGE_KEYS.celebrationIntensity, celebrationIntensity);

  }, [celebrationIntensity]);



  useEffect(() => {

    writeStorage(STORAGE_KEYS.celebrationSound, celebrationSound);

  }, [celebrationSound]);



  const addScore = useCallback(

    (key: ScoreKey, amount: number, options?: AddScoreOptions) => {

      const awardedFish: FishDefinition[] = [];



      setScores((previous) => {

        const updatedValue = previous[key] + amount;

        const updatedTotal = previous.total + amount;

        const previousFish = Math.floor(Math.max(previous.total, 0) / FISH_THRESHOLD);

        const newFishTotal = Math.floor(Math.max(updatedTotal, 0) / FISH_THRESHOLD);

        const gained = Math.max(0, newFishTotal - previousFish);



        if (gained > 0) {

          setAquarium((current) => {

            const ownedIds = new Set(current.map((fish) => fish.fishId));

            const additions: AquariumFish[] = [];

            const todayPool = dailyShoal.fishIds.filter((id) => !ownedIds.has(id));

            const remainingPool = ALL_FISH_IDS.filter((id) => !ownedIds.has(id));

            const baseTime = Date.now();



            for (let index = 0; index < gained; index += 1) {

              const nextFishId = todayPool.shift() ?? remainingPool.shift();

              if (!nextFishId) {

                break;

              }



              ownedIds.add(nextFishId);

              const definition = getFishById(nextFishId);

              if (definition) {

                awardedFish.push(definition);

              }



              additions.push({

                id: `${baseTime}-${index}-${Math.random().toString(16).slice(2)}`,

                fishId: nextFishId,

                module: options?.module,

                earnedAt: baseTime + index,

              });

            }



            if (additions.length === 0) {

              return current;

            }



            const nextAquarium = [...current, ...additions];

            writeStorage(STORAGE_KEYS.aquarium, nextAquarium);

            return nextAquarium;

          });

        }



        return {

          ...previous,

          [key]: updatedValue,

          total: updatedTotal,

        };

      });



      if (options?.metric) {

        const delta = options.increment ?? 1;

        setMetrics((prev) => ({

          ...prev,

          [options.metric!]: prev[options.metric!] + delta,

        }));

      }



      if (options?.speak) {

        speakText(options.speak, audioEnabled);

      }



      if (options?.effect) {

        playTone(options.effect, audioEnabled);

      }



      if (awardedFish.length > 0) {

        playTone("success", audioEnabled);

        const message =

          awardedFish.length === 1

            ? `Voce resgatou ${awardedFish[0].name}!`

            : `Voce resgatou ${awardedFish.length} peixinhos: ${awardedFish.map((fish) => fish.name).join(", ")}.`;

        speakText(message, audioEnabled);

      }

    },

    [audioEnabled, dailyShoal],

  );



  const resetScores = useCallback(() => {

    setScores(SCORE_DEFAULT);

    setMetrics(METRICS_DEFAULT);

    setModuleProgress(MODULE_PROGRESS_DEFAULT);

    setEarnedBadges([] as BadgeId[]);

    setAquarium([]);

    writeStorage(STORAGE_KEYS.aquarium, []);

  }, []);



  const registerMetric = useCallback((metric: keyof ProgressMetrics, amount = 1) => {

    setMetrics((prev) => ({

      ...prev,

      [metric]: prev[metric] + amount,

    }));

  }, []);



  const recordModuleCompletion = useCallback((module: ModuleId) => {

    setModuleProgress((prev) => ({

      ...prev,

      [module]: (prev[module] ?? 0) + 1,

    }));

    setMetrics((prev) => ({

      ...prev,

      activitiesCompleted: prev.activitiesCompleted + 1,

    }));

  }, []);



  const setAvatar = useCallback(

    (value: string) => {

      setAvatarState(value);

      playTone("click", audioEnabled);

    },

    [audioEnabled],

  );



  const setPlayerName = useCallback((value: string) => {

    setPlayerNameState(value);

  }, []);



  const toggleAudio = useCallback(() => {

    setAudioEnabled((prev) => !prev);

  }, []);



  const toggleLowStimulus = useCallback(() => {

    setLowStimulus((prev) => !prev);

  }, []);



  const setCelebrationIntensity = useCallback((value: CelebrationIntensity) => {

    setCelebrationIntensityState(value);

  }, []);



  const setCelebrationSound = useCallback((value: boolean) => {

    setCelebrationSoundState(value);

  }, []);



  const acceptTerms = useCallback(() => {

    setAcceptedTerms(true);

  }, []);



  const playEffect = useCallback(

    (effect: SoundEffect) => {

      playTone(effect, audioEnabled);

    },

    [audioEnabled],

  );



  const narrate = useCallback(

    (text: string) => {

      speakText(text, audioEnabled);

    },

    [audioEnabled],

  );



  const leaderboard = useMemo<LeaderboardEntry[]>(() => {

    const userEntry: LeaderboardEntry = {

      id: "player",

      name: playerName,

      avatar,

      score: aquarium.length * FISH_THRESHOLD,

      badges: earnedBadges.length,

    };



    const combined = [...LEADERBOARD_SEED, userEntry];

    return combined

      .sort((a, b) => b.score - a.score)

      .map((entry, index) => ({

        ...entry,

        id: entry.id === "player" ? entry.id : `${index}-${entry.id}`,

      }));

  }, [aquarium.length, avatar, earnedBadges.length, playerName]);



  const value: GameContextValue = {

    scores,

    addScore,

    resetScores,

    metrics,

    registerMetric,

    moduleProgress,

    recordModuleCompletion,

    earnedBadges,

    aquarium,

    totalFish: aquarium.length,

    avatar,

    setAvatar,

    playerName,

    setPlayerName,

    audioEnabled,

    toggleAudio,

    lowStimulus,

    toggleLowStimulus,

    celebrationIntensity,

    setCelebrationIntensity,

    celebrationSound,

    setCelebrationSound,

    acceptedTerms,

    acceptTerms,

    playEffect,

    narrate,

    leaderboard,

    fishCatalog: FISH_POOL,

    fishById: FISH_BY_ID,

    dailyShoal,

  };



  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;

}



export function useGame() {

  const context = useContext(GameContext);

  if (!context) {

    throw new Error("useGame must be used within GameProvider");

  }

  return context;

}

