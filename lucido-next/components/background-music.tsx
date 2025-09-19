"use client";

import { useEffect, useRef } from "react";

import { useGame } from "@/components/game-provider";

const SOURCE = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { audioEnabled } = useGame();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) {
      audioRef.current = new Audio(SOURCE);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
    }

    const audio = audioRef.current;

    if (audioEnabled) {
      audio
        .play()
        .catch(() => {
          /* autoplay pode ser bloqueado */
        });
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [audioEnabled]);

  return null;
}
