"use client";

import { DragOverlay } from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function DragOverlayPortal({ children, className }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <DragOverlay className={className}>
      {children}
    </DragOverlay>,
    document.body
  );
}