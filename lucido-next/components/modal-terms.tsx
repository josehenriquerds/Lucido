"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect } from "react";

export type ModalTermsProps = {
  open: boolean;
  onAccept: () => void;
  onClose?: () => void;
};

export function ModalTerms({ open, onAccept }: ModalTermsProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-reef-midnight/85 backdrop-blur"
    >
      <div className="reef-panel max-h-[92vh] w-[min(680px,94vw)] overflow-y-auto p-8 text-left">
        <header className="mb-6 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-reef-sand/80">
            Bem-vindo ao Recife Lucido
          </p>
          <h2 id="terms-title" className="text-3xl font-bold text-reef-shell">
            Precisamos do consentimento do responsável marinheiro
          </h2>
        </header>
        <p className="mb-4 text-reef-shell/80">
          Antes de liberar o mergulho educativo, pedimos que um adulto leia nossos Termos de Uso e Política de
          Privacidade. Eles explicam como o Lucido cuida das informações guardadas apenas neste dispositivo.
        </p>
        <ul className="mb-6 space-y-3 text-reef-shell">
          <li>
            <Link className="font-semibold text-reef-sand hover:text-reef-shell" href="/terms">
              Termos de Uso
            </Link>
            <span className="ml-1 text-sm text-reef-shell/70">— regras de navegação e responsabilidades do recife.</span>
          </li>
          <li>
            <Link className="font-semibold text-reef-sand hover:text-reef-shell" href="/privacy">
              Política de Privacidade
            </Link>
            <span className="ml-1 text-sm text-reef-shell/70">— como armazenamos progresso, aquário e preferências localmente.</span>
          </li>
        </ul>
        <p className="mb-6 rounded-lagoon bg-reef-teal/20 p-4 text-sm text-reef-shell">
          Nada é enviado para a internet: seus peixinhos, escolhas e conquistas permanecem apenas no seu aquário.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/terms"
            className="rounded-bubble border border-reef-sand/60 px-5 py-3 text-center text-sm font-semibold text-reef-sand transition-colors hover:bg-reef-sand/10"
          >
            Ler Termos completos
          </Link>
          <button
            onClick={onAccept}
            className={clsx(
              "rounded-bubble bg-gradient-to-r from-reef-coral to-reef-teal px-6 py-3 text-sm font-bold text-reef-shell",
              "shadow-coral transition-transform hover:-translate-y-0.5",
            )}
          >
            Concordo e quero mergulhar
          </button>
        </div>
      </div>
    </div>
  );
}
