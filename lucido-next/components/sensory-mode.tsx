"use client";

import { useEffect } from "react";

import { useGame } from "@/components/game-provider";

export function SensoryMode() {
  const { lowStimulus } = useGame();

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (lowStimulus) {
      document.body.setAttribute("data-low-stimulus", "on");
    } else {
      document.body.removeAttribute("data-low-stimulus");
    }
  }, [lowStimulus]);

  return null;
}
