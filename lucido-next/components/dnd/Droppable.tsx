"use client";

import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  disabled?: boolean;
  children: (opts: {
    setNodeRef: (node: HTMLElement | null) => void;
    isOver: boolean;
  }) => React.ReactNode;
};

export function Droppable({ id, disabled = false, children }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled
  });

  return <>{children({ setNodeRef, isOver })}</>;
}