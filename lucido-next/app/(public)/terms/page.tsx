"use client";

import { useGame } from "@/components/game-provider";
import { Card } from "@/components/ui/card";

export default function TermsPage() {
  const { acceptedTerms, acceptTerms } = useGame();

  return (
    <div className="flex flex-col gap-6 text-reef-shell">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-reef-shell/70">Documentação oficial</p>
        <h1 className="text-3xl font-bold">Termos de Uso do Lucido</h1>
        <p className="text-reef-shell/80">
          Este documento explica como funcionam as missões educacionais no recife interativo Lucido.
        </p>
      </header>

      <Card variant="reef" className="space-y-4 p-6 text-reef-shell">
        <section>
          <h2 className="text-xl font-semibold">1. Sobre o Lucido</h2>
          <p>
            O Lucido é uma experiência lúdica de alfabetização ambientada em um recife de corais virtual. Todo o conteúdo é
            executado localmente: jogos, trilhas, áudio, mascotes e aquário funcionam sem conexão com a internet.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">2. Uso indicado</h2>
          <p>
            As missões foram planejadas para crianças em processo de alfabetização, sempre com supervisão de um responsável.
            Os desafios incluem atividades de vogais, sílabas, palavras, rimas, bingo, memória, narrativa e laboratório de
            soletração.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">3. Responsabilidades</h2>
          <ul className="ml-4 list-disc space-y-2">
            <li>O responsável escolhe quais missões podem ser acessadas e quando.</li>
            <li>As pontuações e peixinhos resgatados são motivacionais e não se tratam de avaliação escolar.</li>
            <li>Recomenda-se limitar o tempo de uso e oferecer intervalos para descanso visual e auditivo.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold">4. Direitos autorais</h2>
          <p>
            Artes, mascotes, sons e textos pertencem ao projeto Lucido Ocean Trail. É proibida a reprodução comercial sem
            autorização prévia. Uso doméstico e escolar gratuito são permitidos, mantendo referências ao projeto.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">5. Dados e consentimento</h2>
          <p>
            O Lucido não coleta nem envia dados para servidores externos. Preferências, progresso, aquário, termos aceitos e
            mascote ficam salvos apenas no armazenamento local do dispositivo (localStorage). Limpar o navegador ou usar
            outro aparelho reinicia as informações.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">6. Suporte</h2>
          <p>
            Em caso de dúvidas sobre acessibilidade, conteúdo ou uso pedagógico, entre em contato com a equipe pedagógica
            responsável pela licença deste aplicativo.
          </p>
        </section>
      </Card>

      <div className="flex flex-wrap gap-3">
        {!acceptedTerms && (
          <button
            onClick={acceptTerms}
            className="rounded-bubble bg-reef-coral px-5 py-3 text-sm font-semibold text-reef-shell shadow-coral"
          >
            Aceitar termos e continuar
          </button>
        )}
        <a href="/privacy" className="rounded-bubble bg-white/10 px-5 py-3 text-sm font-semibold text-reef-shell">
          Ler política de privacidade
        </a>
      </div>
    </div>
  );
}
