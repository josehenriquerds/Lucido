"use client";

import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-6 text-reef-shell">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-reef-shell/70">Documentação oficial</p>
        <h1 className="text-3xl font-bold">Política de Privacidade do Lucido</h1>
        <p className="text-reef-shell/80">
          Respeitamos a privacidade das crianças. Esta política descreve como as informações são tratadas no recife digital.
        </p>
      </header>

      <Card variant="reef" className="space-y-4 p-6 text-reef-shell">
        <section>
          <h2 className="text-xl font-semibold">1. Coleta de dados</h2>
          <p>
            O Lucido não coleta dados pessoais e não envia informações para a internet. O progresso, pontuação, aquário,
            escolha de mascote e preferências são armazenados exclusivamente no navegador do dispositivo utilizado.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">2. Armazenamento local</h2>
          <p>
            Utilizamos localStorage para guardar: pontuações, configuração de áudio, modo baixo estímulo, avatar, nome de
            exibição, aquário de peixinhos resgatados e aceite dos termos. Esses dados podem ser apagados nas configurações
            do aplicativo ou limpando o navegador.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">3. Dados de crianças</h2>
          <p>
            O Lucido foi concebido para ser seguro: não solicita informações sensíveis, não possui anúncios e não realiza
            rastreamento de uso. Recomenda-se que um responsável auxilie a criança nas configurações e acompanhe seu
            progresso.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">4. Acessibilidade e áudio</h2>
          <p>
            Recursos de narração e efeitos sonoros são gerados localmente e podem ser desligados a qualquer momento. O modo
            baixo estímulo reduz partículas e animações para tornar o ambiente mais confortável.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">5. Alterações</h2>
          <p>
            Qualquer atualização desta política será disponibilizada no próprio aplicativo, com data e resumo das mudanças.
            Use sempre a versão mais recente para garantir a melhor experiência.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">6. Contato</h2>
          <p>
            Para dúvidas relacionadas à privacidade, procure o responsável pedagógico ou administrador do Lucido na sua
            escola ou organização.
          </p>
        </section>
      </Card>
    </div>
  );
}
