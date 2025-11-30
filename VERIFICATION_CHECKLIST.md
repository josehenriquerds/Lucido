# ✅ Checklist de Verificação - Sistema Clínico

## Antes de Rodar

### 1. Instalação
- [ ] Node.js instalado (v18+)
- [ ] NPM instalado
- [ ] Dependências instaladas (`npm install`)

### 2. Estrutura de Arquivos
- [ ] Pasta `app/(professional)/` existe
- [ ] Pasta `app/(guardian)/` existe
- [ ] Pasta `app/auth/login/` existe
- [ ] Pasta `lib/types/` existe
- [ ] Arquivo `lib/clinical-data.ts` existe
- [ ] Arquivo `components/clinical-provider.tsx` existe

---

## Testes de Funcionalidade

### 🔐 Autenticação

**Login Profissional:**
- [ ] Acessa `/auth/login`
- [ ] Clica em "👩‍⚕️ Profissional (Dra. Ana)"
- [ ] Campos preenchem automaticamente
- [ ] Clica em "Entrar"
- [ ] Redireciona para `/professional/dashboard`
- [ ] Sidebar aparece com nome "Dra. Ana Silva"

**Login Responsável:**
- [ ] Faz logout
- [ ] Login com "👩 Responsável (Maria - Mãe)"
- [ ] Redireciona para `/guardian/patient/patient-1`
- [ ] Header mostra "Maria Santos"

**Logout:**
- [ ] Clica em "Sair"
- [ ] Redireciona para `/auth/login`
- [ ] Não consegue acessar `/professional/dashboard` sem login

---

### 👩‍⚕️ Dashboard Profissional

**Estatísticas:**
- [ ] Mostra "2" em Pacientes Ativos
- [ ] Mostra número de sessões esta semana
- [ ] Mostra total de sessões

**Cards de Pacientes:**
- [ ] Exibe 2 pacientes: Pedro Santos e Laura Oliveira
- [ ] Pedro mostra "👦" (menino)
- [ ] Laura mostra "👧" (menina)
- [ ] Diagnósticos aparecem (TEA)
- [ ] Idade calculada corretamente

**Sessões Recentes:**
- [ ] Mostra últimas 5 sessões
- [ ] Data formatada em pt-BR
- [ ] Nome do profissional e tipo de sessão aparecem
- [ ] Observações truncadas

---

### 👥 Lista de Pacientes

**Acesso:**
- [ ] Dashboard → "Ver todos" ou Sidebar → "Pacientes"
- [ ] URL: `/professional/patients`

**Visualização:**
- [ ] 2 pacientes em grid responsivo
- [ ] Cards com avatar, nome, idade
- [ ] Diagnósticos em badges roxos
- [ ] Estatísticas (sessões, objetivos, profissionais)
- [ ] Hover effect nos cards

**Navegação:**
- [ ] Clicar em Pedro → vai para timeline
- [ ] Clicar em Laura → vai para timeline

---

### 📅 Timeline do Paciente

**Header:**
- [ ] Nome do paciente (Pedro Santos)
- [ ] Idade e diagnósticos
- [ ] Código interno (PAC-001)
- [ ] Botão "← Voltar"

**Abas:**
- [ ] Timeline, Sessões, Objetivos, Atividades
- [ ] Timeline está ativa (azul)
- [ ] Outras abas em cinza

**Resumo Rápido:**
- [ ] 4 cards de estatísticas
- [ ] Equipe Multidisciplinar: 3 profissionais
- [ ] Avatares dos profissionais aparecem
- [ ] Total de sessões correto
- [ ] Objetivos ativos aparecem

**Objetivos em Andamento:**
- [ ] Seção aparece se houver objetivos
- [ ] Título e área de cada objetivo
- [ ] Grid responsivo (2 colunas)

**Filtros:**
- [ ] Dropdown "Tipo de Evento" funciona
- [ ] Dropdown "Período" funciona
- [ ] Filtros aplicam na timeline
- [ ] Contador de eventos atualiza

**Cards de Eventos:**
- [ ] 5 eventos aparecem para Pedro
- [ ] Ícones corretos por tipo:
  - 📋 Sessões
  - 🎉 Marcos
  - 📌 Notas importantes
- [ ] Cores diferentes por tipo:
  - Azul (sessões)
  - Roxo (marcos)
  - Amarelo (notas)
- [ ] Data formatada (dd/mmm/yyyy HH:mm)
- [ ] Detalhes da sessão expandidos
- [ ] Nome do profissional aparece
- [ ] Observações truncadas

**Filtrar por Tipo:**
- [ ] Seleciona "Sessões" → só mostra 3 eventos
- [ ] Seleciona "Marcos" → só mostra 1 evento
- [ ] Volta "Todos" → mostra 5 eventos

**Filtrar por Período:**
- [ ] "Última semana" → mostra eventos recentes
- [ ] "Todo o histórico" → mostra todos

---

### 👨‍👩‍👧 Área do Responsável

**Login:**
- [ ] Login como `maria.santos@email.com`
- [ ] Redireciona para `/guardian/patient/patient-1`

**Layout:**
- [ ] Header roxo/rosa (diferente de profissional)
- [ ] Nome "Maria Santos" no topo
- [ ] Footer com texto "Área de visualização para responsáveis"

**Informações Gerais:**
- [ ] Nome do filho (Pedro Santos)
- [ ] Idade calculada
- [ ] Diagnósticos
- [ ] Total de sessões
- [ ] Atividades realizadas

**Equipe Multidisciplinar:**
- [ ] 3 profissionais listados
- [ ] Nome e papel de cada um
- [ ] Avatars aparecem

**Objetivos:**
- [ ] Seção de objetivos em andamento
- [ ] Títulos e descrições

**Timeline:**
- [ ] Últimos 10 eventos
- [ ] Somente leitura (sem botões de ação)
- [ ] Cards iguais aos da área profissional

---

### 🧭 Navegação

**Sidebar (Profissional):**
- [ ] 4 itens: Dashboard, Pacientes, Organização, Configurações
- [ ] Item ativo em azul
- [ ] Hover em cinza
- [ ] Logo "Lúcido" no topo
- [ ] Info do usuário embaixo do logo
- [ ] Botão "Sair" no rodapé

**Breadcrumbs:**
- [ ] URLs corretas em todas as páginas
- [ ] Back button funciona

---

### 📱 Responsividade

**Mobile (< 768px):**
- [ ] Sidebar some ou vira menu hamburger (TODO)
- [ ] Cards viram 1 coluna
- [ ] Estatísticas viram 1 coluna
- [ ] Timeline legível

**Tablet (768px - 1024px):**
- [ ] 2 colunas em grids
- [ ] Sidebar permanece

**Desktop (> 1024px):**
- [ ] 3 colunas em alguns grids
- [ ] Layout completo

---

## 🎨 Testes Visuais

### Cores:
- [ ] Profissional: Tons de azul
- [ ] Responsável: Tons de roxo/rosa
- [ ] Estados: Verde (sucesso), Vermelho (erro)

### Tipografia:
- [ ] Headings em bold
- [ ] Textos legíveis
- [ ] Hierarquia clara

### Espaçamento:
- [ ] Padding consistente (p-4, p-6)
- [ ] Gaps em grids (gap-4, gap-6)
- [ ] Margem entre seções

### Efeitos:
- [ ] Hover states em botões/cards
- [ ] Shadows em cards
- [ ] Transições suaves
- [ ] Focus rings em inputs

---

## 🔧 Testes Técnicos

### Build:
```bash
cd lucido-next
npm run build
```
- [ ] Build completa sem erros
- [ ] Sem warnings críticos de TypeScript
- [ ] Sem conflitos de rotas

### Dev:
```bash
npm run dev
```
- [ ] Inicia em http://localhost:3000
- [ ] Hot reload funciona
- [ ] Console sem erros

### Types:
- [ ] Nenhum `any` explícito
- [ ] Imports corretos
- [ ] Types exportados de `lib/types/clinical.ts`

---

## 🚨 Edge Cases

### Dados Vazios:
- [ ] Paciente sem sessões → Mensagem "Nenhuma sessão"
- [ ] Timeline vazia → Mensagem apropriada
- [ ] Filtros sem resultados → "Nenhum evento encontrado"

### Erros:
- [ ] Usuário não encontrado → Erro no login
- [ ] Paciente não encontrado → Mensagem de erro
- [ ] Navegação sem login → Redireciona para /auth/login

### Permissões:
- [ ] Profissional não vê pacientes de outro profissional
- [ ] Responsável só vê filho(s)

---

## 📊 Performance

### Lighthouse (Dev):
- [ ] Performance > 80
- [ ] Accessibility > 90
- [ ] Best Practices > 80

### Bundle Size:
- [ ] Sem dependências desnecessárias
- [ ] Code splitting automático (Next.js)

---

## ✅ Critérios de Aceitação

### Mínimo para MVP:
- [x] Login funcionando para 3 perfis
- [x] Dashboard com dados reais (mock)
- [x] Timeline do paciente completa
- [x] Filtros funcionais
- [x] Área responsável com leitura
- [x] Documentação completa

### Extras Implementados:
- [x] Design profissional e responsivo
- [x] Dados relacionados (profissionais, objetivos)
- [x] Navegação por abas
- [x] Estatísticas em tempo real

### Para V2 (Futuro):
- [ ] Formulários de registro
- [ ] Comentários colaborativos (UI)
- [ ] Integração com jogos lúdicos
- [ ] Backend real (PostgreSQL)

---

## 🎯 Resultado Esperado

Após rodar todos os testes acima:

✅ **Sistema funcionando 100% em mock**
✅ **Todas as páginas renderizando**
✅ **Navegação fluida entre áreas**
✅ **Dados mock carregando corretamente**
✅ **UI responsiva e acessível**
✅ **Pronto para adicionar formulários**

---

**Data do Checklist:** 2025-11-29
**Versão:** 1.0.0 (Mock)
