"use client";

import { useState } from "react";

import { useGame } from "@/components/game-provider";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  const {
    audioEnabled,
    toggleAudio,
    lowStimulus,
    toggleLowStimulus,
    acceptedTerms,
    acceptTerms,
    resetScores,
  } = useGame();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="flex flex-col gap-6 text-reef-shell">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-reef-shell/70">Configurações</p>
        <h1 className="text-3xl font-bold">Personalize sua experiência subaquática</h1>
        <p className="text-reef-shell/80">Ajuste sons, estímulos visuais e controle os dados locais do aquário.</p>
      </header>

      <Card variant="reef" className="flex flex-col gap-4 p-6">
        <h2 className="text-xl font-bold">Som e narração</h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm text-reef-shell">Áudio ambiente e narração das palavras</span>
            <button
              onClick={toggleAudio}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                audioEnabled ? "bg-reef-teal text-reef-shell" : "bg-white/10 text-reef-shell"
              }`}
            >
              {audioEnabled ? "Ligado" : "Desligado"}
            </button>
          </label>
          <p className="text-xs text-reef-shell/70">
            Inclui a soletração das palavras e efeitos curtos quando um peixinho é resgatado.
          </p>
        </div>
      </Card>

      <Card variant="reef" className="flex flex-col gap-4 p-6">
        <h2 className="text-xl font-bold">Acessibilidade</h2>
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-reef-shell">Modo baixo estímulo (remove partículas e animações)</span>
          <button
            onClick={toggleLowStimulus}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              lowStimulus ? "bg-reef-algae text-reef-shell" : "bg-white/10 text-reef-shell"
            }`}
          >
            {lowStimulus ? "Ligado" : "Desligado"}
          </button>
        </label>
      </Card>

      <Card variant="reef" className="flex flex-col gap-4 p-6">
        <h2 className="text-xl font-bold">Termos e privacidade</h2>
        <p className="text-sm text-reef-shell/80">
          {acceptedTerms
            ? "Consentimento registrado neste dispositivo."
            : "Você ainda precisa aceitar os documentos para liberar todo o conteúdo."}
        </p>
        {!acceptedTerms && (
          <button
            onClick={acceptTerms}
            className="self-start rounded-bubble bg-reef-coral px-4 py-2 text-sm font-semibold text-reef-shell shadow-coral"
          >
            Aceitar agora
          </button>
        )}
        <div className="flex flex-wrap gap-3 text-sm">
          <a className="text-reef-sand underline" href="/terms">
            Ver Termos de Uso
          </a>
          <a className="text-reef-sand underline" href="/privacy">
            Ver Política de Privacidade
          </a>
        </div>
      </Card>

      <Card variant="reef" className="flex flex-col gap-4 p-6">
        <h2 className="text-xl font-bold">Dados locais</h2>
        <p className="text-sm text-reef-shell/80">
          Tudo fica salvo apenas neste dispositivo: peixinhos, badges e preferências. Você pode limpar o progresso sempre que quiser.
        </p>
        {confirmReset ? (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                resetScores();
                setConfirmReset(false);
              }}
              className="rounded-bubble bg-reef-coral px-4 py-2 text-sm font-semibold text-reef-shell"
            >
              Confirmar limpeza
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="rounded-bubble bg-white/10 px-4 py-2 text-sm font-semibold text-reef-shell"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="self-start rounded-bubble bg-white/10 px-4 py-2 text-sm font-semibold text-reef-shell"
          >
            Limpar progresso salvo
          </button>
        )}
      </Card>
    </div>
  );
}
