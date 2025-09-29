"use client";

import { CSS } from "@dnd-kit/utilities";
import { useDraggable, type DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

type Props = {
  id: string;
  disabled?: boolean;
  children: (opts: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
    setNodeRef: (node: HTMLElement | null) => void;
    style: React.CSSProperties | undefined;
    isDragging: boolean;
  }) => React.ReactNode;
};

export function Draggable({ id, disabled = false, children }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <>
      {children({
        attributes,
        listeners: disabled ? {} : listeners,
        setNodeRef,
        style,
        isDragging
      })}
    </>
  );
}