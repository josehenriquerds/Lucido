"use client";

import { BackgroundMusic } from "@/components/background-music";
import { GameProvider } from "@/components/game-provider";
import { SensoryMode } from "@/components/sensory-mode";
import { TermsGate } from "@/components/terms-gate";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
      <SensoryMode />
      <BackgroundMusic />
      <TermsGate />
      {children}
    </GameProvider>
  );
}
