import { useMemo } from "react";
import { useGame } from "@/components/game-provider";
import { FishDefinition } from "@/lib/fish";

export type DailyShoalItem = {
  fishId: string;
  definition: FishDefinition;
  index: number;
  isRescued: boolean;
  isNew: boolean;
};

export type DailyShoalData = {
  items: DailyShoalItem[];
  rescuedCount: number;
  totalCount: number;
  progressPercentage: number;
  date: string;
};

/**
 * Hook para gerenciar dados do cardume diário
 */
export function useDailyShoal(): DailyShoalData {
  const { aquarium, fishById, dailyShoal } = useGame();

  const rescuedSet = useMemo(() => new Set(aquarium.map((fish) => fish.fishId)), [aquarium]);

  const todayKey = dailyShoal.date;
  const todayFishIds = useMemo(() => {
    const set = new Set<string>();
    aquarium.forEach((fish) => {
      const acquiredDate = new Date(fish.earnedAt);
      const key = `${acquiredDate.getFullYear()}-${String(acquiredDate.getMonth() + 1).padStart(2, "0")}-${String(
        acquiredDate.getDate(),
      ).padStart(2, "0")}`;
      if (key === todayKey) {
        set.add(fish.fishId);
      }
    });
    return set;
  }, [aquarium, todayKey]);

  const dailyItems = useMemo(() => {
    return dailyShoal.fishIds
      .map((fishId, index) => {
        const definition = fishById[fishId];
        if (!definition) return null;
        const isRescued = rescuedSet.has(fishId);
        return {
          fishId,
          definition,
          index,
          isRescued,
          isNew: isRescued && todayFishIds.has(fishId),
        };
      })
      .filter((item): item is DailyShoalItem => Boolean(item));
  }, [dailyShoal.fishIds, fishById, rescuedSet, todayFishIds]);

  const rescuedCount = dailyItems.filter((item) => item.isRescued).length;
  const totalCount = dailyItems.length;
  const progressPercentage = totalCount > 0 ? Math.round((rescuedCount / totalCount) * 100) : 0;

  return {
    items: dailyItems,
    rescuedCount,
    totalCount,
    progressPercentage,
    date: dailyShoal.date,
  };
}