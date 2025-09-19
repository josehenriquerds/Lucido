# Lucido Ocean Trail

Aplicativo educacional inspirado no jogo original em HTML, agora reescrito em Next.js 14 (App Router) com TypeScript e Tailwind CSS. O foco continua sendo a jornada de alfabetização em um universo “Recife de Corais”, com gamificação, acessibilidade e um aquário vivo alimentado pelas missões concluídas.

## Tecnologias
- Next.js 14 (App Router) + React 19
- TypeScript estrito
- Tailwind CSS 4 com tokens temáticos do recife
- Armazenamento local (localStorage) para progresso, aquário, termos e preferências
- Web Speech Synthesis e Web Audio API para narração e efeitos opcionais

## Estrutura principal
```
app/
  (public)/
    page.tsx                # Trilha principal (recife)
    modules/page.tsx        # Biblioteca de missões
    activity/[id]/page.tsx  # Atividades (vogais, bingo, laboratório etc.)
    leaderboard/page.tsx    # Ranking do cardume
    profile/page.tsx        # Painel da família e aquário
    settings/page.tsx       # Preferências
    terms/page.tsx          # Termos de uso
    privacy/page.tsx        # Política de privacidade
components/
  activities/               # Lógicas individuais dos minijogos
  ui/                       # Componentes reutilizáveis (Card, BubbleOption, etc.)
  aquarium-panel.tsx        # Painel do aquário com contagem de peixes
lib/
  audio.ts                  # Utilidades de áudio
  game-data.ts              # Conteúdos e seeds para jogos
  storage.ts                # Acesso seguro ao localStorage
styles/
  globals.css               # Base Tailwind + tema Recifal
```

## Pré-requisitos
- Node.js 18.18 ou superior (recomendado 20+)
- npm 9+

## Instalação
```bash
npm install
```

## Desenvolvimento
```bash
npm run dev
```
A aplicação ficará disponível em `http://localhost:3000`. O modal de termos bloqueia o app até que um responsável aceite os documentos.

## Build de produção
```bash
npm run build
npm start
```

## Testes e qualidade
```bash
npm run lint
```

## Funcionalidades principais
- Modal de termos com persistência e páginas `/terms` e `/privacy`
- Trilha modular com navegação temática do recife
- Jogos de vogais, sílabas, palavras, rimas, bingo, memória, história e **Laboratório do Som** (soletração + perguntas)
- Gamificação com pontos convertidos em peixinhos resgatados para o aquário pessoal
- Modo Baixo Estímulo, narração e sons opcionais
- Mascote personalizável e painel da família com progresso detalhado e inventário de espécies

## Aquário e peixinhos
Cada 40 pontos somados nas missões resgata um novo habitante (emoji) que fica visível em todas as telas e no ranking. O aquário é salvo localmente e pode ser limpo a qualquer momento nas configurações.

## Licença
Projeto educacional interno. Ajuste o texto dos termos/conteúdos conforme a política da sua instituição antes de distribuição.
