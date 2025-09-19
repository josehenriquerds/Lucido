"use client";

import { useState } from "react";

import { ActivityHeader, ActivitySection } from "@/components/activities/activity-shell";
import { useGame } from "@/components/game-provider";
import { BubbleOption } from "@/components/ui/bubble-option";
import { STORY_SCENES } from "@/lib/game-data";

export function StoryAdventure() {
  const { scores, addScore, recordModuleCompletion, narrate } = useGame();
  const [index, setIndex] = useState(0);
  const scene = STORY_SCENES[index];

  const handleChoice = (choice: string) => {
    const correct = scene.answer === choice;
    if (correct) {
      addScore("vowels", 8, { effect: "success", speak: `${choice}!`, module: "story" });
      if (index + 1 === STORY_SCENES.length) {
        recordModuleCompletion("story");
        narrate("História concluída! Você dominou todas as vogais do oceano.");
        setTimeout(() => setIndex(0), 1500);
      } else {
        setIndex((value) => value + 1);
        narrate(`Muito bem! Avançando para a próxima cena: ${STORY_SCENES[index + 1].text}`);
      }
    } else {
      addScore("vowels", 0, { effect: "error" });
      narrate("Essa não é a letra correta. Tente outra vez.");
    }
  };

  return (
    <div>
      <ActivityHeader
        title="História Submarina"
        subtitle="Acompanhe o peixinho-palhaço e descubra as letras escondidas."
        moduleId="story"
        icon="📖"
        score={scores.vowels}
      />
      <ActivitySection>
        <div className="flex flex-col items-center gap-4 text-center text-reef-shell">
          <span className="text-6xl" aria-hidden="true">
            {scene.illustration}
          </span>
          <p
            className="max-w-xl text-lg text-reef-shell/90"
            dangerouslySetInnerHTML={{ __html: scene.text }}
          />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {scene.options.map((option) => (
              <BubbleOption
                key={option}
                onClick={() => handleChoice(option)}
                className="min-w-[120px] justify-center text-lg"
              >
                Letra {option}
              </BubbleOption>
            ))}
          </div>
        </div>
      </ActivitySection>
    </div>
  );
}
