"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ModalTerms } from "@/components/modal-terms";
import { useGame } from "@/components/game-provider";

const UNBLOCKED_ROUTES = new Set(["/terms", "/privacy"]);

export function TermsGate() {
  const pathname = usePathname();
  const { acceptedTerms, acceptTerms } = useGame();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (acceptedTerms) {
      setOpen(false);
      return;
    }
    if (!UNBLOCKED_ROUTES.has(pathname)) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [acceptedTerms, pathname]);

  return (
    <>
      <ModalTerms open={open} onAccept={acceptTerms} />
      {!acceptedTerms && open && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-deep-blue/20" aria-hidden="true" />
      )}
    </>
  );
}
