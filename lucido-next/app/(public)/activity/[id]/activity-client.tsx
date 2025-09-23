"use client";

import Link from "next/link";

import { BingoAdventure } from "@/components/activities/bingo-adventure";
import { MemoryAdventure } from "@/components/activities/memory-adventure";
import { RhymesAdventure } from "@/components/activities/rhymes-adventure";
import { SpellingAdventure } from "@/components/activities/spelling-adventure";
import { StoryAdventure } from "@/components/activities/story-adventure";
import { SyllablesAdventure } from "@/components/activities/syllables-adventure";
import { VowelsAdventure } from "@/components/activities/vowels-adventure-next";
import { WordsAdventure } from "@/components/activities/words-adventure";
import { Card } from "@/components/ui/card";

const ACTIVITY_MAP: Record<string, React.ComponentType> = {
  vowels: VowelsAdventure,
  syllables: SyllablesAdventure,
  words: WordsAdventure,
  rhymes: RhymesAdventure,
  bingo: BingoAdventure,
  memory: MemoryAdventure,
  story: StoryAdventure,
  spelling: SpellingAdventure,
};

type ActivityClientProps = {
  id: string;
};

export default function ActivityClient({ id }: ActivityClientProps) {
  const Component = ACTIVITY_MAP[id];

  if (!Component) {
    return (
      <Card className="mx-auto mt-20 max-w-xl space-y-4 p-6 text-center text-reef-shell">
        <h1 className="text-2xl font-bold">Atividade n�o encontrada</h1>
        <p className="text-reef-shell/80">
          A aventura que você tentou acessar ainda não existe. Volte para o recife principal para escolher uma missão válida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-bubble bg-reef-coral px-4 py-2 text-sm font-semibold text-reef-shell shadow-coral"
        >
          Voltar para a página inicial
        </Link>
      </Card>
    );
  }

  return <Component />;
}

