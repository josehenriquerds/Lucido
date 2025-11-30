# 🏥 Sistema de Prontuário Colaborativo Multidisciplinar - Lúcido

## 📋 Visão Geral

Este sistema integra funcionalidades de **prontuário colaborativo multidisciplinar** ao Lúcido, mantendo todas as atividades lúdicas existentes e adicionando uma camada completa de gestão clínica para profissionais de saúde e educação que trabalham com crianças com TEA.

---

## 🎯 Objetivos do Sistema

### Problemas Resolvidos:
✅ **Centralização de dados** - Um único local para todas as informações da criança
✅ **Trabalho multidisciplinar** - Profissionais diferentes compartilham informações
✅ **Histórico estruturado** - Timeline cronológica de todas as intervenções
✅ **Registro de atividades lúdicas** - Jogos educativos se tornam dados clínicos
✅ **Acesso controlado** - Responsáveis visualizam, profissionais gerenciam
✅ **Colaboração** - Comentários entre profissionais em sessões

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológica

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Estilização**: Tailwind CSS 4
- **Estado**: React Context API (`ClinicalProvider` + `GameProvider`)
- **Persistência**: LocalStorage (mock) → migração futura para PostgreSQL/Supabase
- **Autenticação**: Mock via LocalStorage → migração futura para NextAuth.js

### Estrutura de Pastas

```
lucido-next/
├── app/
│   ├── (public)/              ✅ MANTIDO - Área da criança (jogos lúdicos)
│   ├── (professional)/        🆕 NOVO - Área profissional
│   │   ├── dashboard/
│   │   ├── patients/
│   │   │   └── [id]/
│   │   │       ├── timeline/
│   │   │       └── sessions/
│   │   ├── organizations/
│   │   └── settings/
│   ├── (guardian)/            🆕 NOVO - Área responsáveis
│   │   └── patient/[id]/
│   └── auth/                  🆕 NOVO - Login
│       └── login/
├── components/
│   ├── activities/            ✅ MANTIDO - Jogos lúdicos
│   ├── professional/          🆕 NOVO - Componentes clínicos
│   │   └── timeline/
│   ├── clinical-provider.tsx  🆕 Context de dados clínicos
│   └── game-provider.tsx      ✅ MANTIDO - Context de jogos
├── lib/
│   ├── types/                 🆕 Types clínicos
│   │   └── clinical.ts
│   ├── auth/                  🆕 Autenticação
│   │   └── auth-service.ts
│   ├── clinical-data.ts       🆕 Dados mock
│   ├── game-data.ts           ✅ MANTIDO - Dados de jogos
│   └── storage.ts             ✅ MANTIDO - LocalStorage
└── README.md
```

---

## 🗂️ Modelo de Dados

### Entidades Principais

#### 1. **User** (Usuário)
- Pode ser: Profissional, Responsável ou Admin
- Exemplo: Dra. Ana (Psicóloga), Maria (Mãe)

#### 2. **Organization** (Organização)
- Clínicas, escolas, consultórios
- Exemplo: "Clínica Crescer"

#### 3. **Patient** (Paciente/Criança)
- Dados: nome, idade, diagnósticos, nível de suporte
- Vinculado a organização e profissionais

#### 4. **Session** (Sessão Terapêutica)
- Registro de atendimento (psicologia, fono, TO, etc.)
- Observações, objetivos trabalhados, plano

#### 5. **Objective** (Objetivo Terapêutico)
- Meta clínica (ex: "Aumentar vocabulário expressivo")
- Status: Em andamento, Atingido, Pausado

#### 6. **TherapeuticActivity** (Atividade Terapêutica)
- Catálogo de atividades (digitais ou físicas)
- Vincula jogos lúdicos existentes

#### 7. **ActivityExecution** (Execução de Atividade)
- Registro de quando a criança faz uma atividade
- Métricas: engajamento, ajuda, resultado

#### 8. **Event** (Evento da Timeline)
- Sessões, atividades, marcos, crises, etc.
- Alimenta a timeline do paciente

#### 9. **Comment** (Comentário de Colaboração)
- Profissionais comentam em sessões
- Menciona outros (@nome)

---

## 👥 Perfis de Usuário

### 1. 👩‍⚕️ Profissional
**Acesso:**
- Dashboard com estatísticas
- Lista de pacientes atribuídos
- Timeline completa do paciente
- Registro de sessões
- Visualização de objetivos e atividades
- Comentários em sessões

**Dados de teste:**
```
Email: dra.ana@clinica.com
Senha: 123456
Papel: Psicóloga
```

### 2. 👩 Responsável (Pai/Mãe)
**Acesso:**
- Timeline simplificada (somente leitura)
- Equipe multidisciplinar
- Objetivos em andamento
- Histórico de sessões

**Dados de teste:**
```
Email: maria.santos@email.com
Senha: 123456
Papel: Mãe de Pedro
```

### 3. 🔧 Admin
**Acesso:**
- Tudo do profissional +
- Gestão de organizações
- Gestão de usuários

**Dados de teste:**
```
Email: admin@clinica.com
Senha: 123456
```

---

## 🚀 Como Usar

### 1. Acesso à Área Profissional

1. Acesse: `http://localhost:3000/auth/login`
2. Use um dos logins de teste acima
3. Você será redirecionado para `/professional/dashboard`

### 2. Visualizar Pacientes

- No dashboard, clique em "Meus Pacientes"
- Ou acesse diretamente: `/professional/patients`

### 3. Visualizar Timeline de um Paciente

- Clique em um paciente
- Será redirecionado para `/professional/patients/[id]/timeline`
- Veja todos os eventos clínicos (sessões, atividades, marcos)

### 4. Filtrar Timeline

- Use os filtros:
  - **Tipo de Evento**: Sessões, Atividades, Marcos, etc.
  - **Período**: Toda história, última semana, último mês

### 5. Área do Responsável

1. Faça login como responsável
2. Acesse `/guardian/patient/patient-1`
3. Visualize histórico (somente leitura)

---

## 📊 Dados Mock Disponíveis

### Pacientes:
- **Pedro Santos** (5 anos, TEA + Atraso na Fala)
- **Laura Oliveira** (4 anos, TEA)

### Profissionais:
- **Dra. Ana Silva** (Psicóloga - ABA)
- **Carlos Mendes** (Fonoaudiólogo)
- **Lúcia Fernandes** (Terapeuta Ocupacional)

### Sessões Registradas:
- 3 sessões de Pedro (Psicologia, Fono, TO)
- Com observações, objetivos e atividades

### Atividades no Catálogo:
- **Digitais**: Vogais Luminosas, Sílabas Borbulhantes (vinculadas aos jogos existentes)
- **Físicas**: Circuito Sensorial, Bingo das Emoções, Massinha

---

## 🔗 Integração com Sistema Lúdico Existente

### Como funciona:

1. **Área da Criança** (`/`) → Continua normal, sem mudanças
2. **Jogos existentes** → Podem enviar métricas para o prontuário
3. **Vinculação**:
   - Atividade "Vogais Luminosas" (digital) → `gameModuleId: "vowels"`
   - Quando a criança joga, cria-se um `ActivityExecution`
   - Dados aparecem na timeline do profissional

### Exemplo de Integração (Futuro):

```typescript
// No componente do jogo de vogais
import { useClinical } from "@/components/clinical-provider";

function VowelsGame() {
  const { addActivityExecution } = useClinical(); // Função a ser implementada

  const handleGameComplete = (score: number) => {
    // Registrar no prontuário
    addActivityExecution({
      patientId: "patient-1", // ID da criança logada
      activityId: "act-1", // Vogais Luminosas
      engagement: "HIGH",
      outcome: "COMPLETED",
      metricsJson: { correctAnswers: score },
    });
  };
}
```

---

## 🔐 Segurança e Permissões

### Sistema de Permissões (Mock)

```typescript
// lib/auth/auth-service.ts

isAuthenticated()  // Verifica se está logado
isProfessional()   // Verifica se é profissional
isGuardian()       // Verifica se é responsável
isAdmin()          // Verifica se é admin
```

### Regras de Acesso:

1. **Profissional** só vê pacientes atribuídos a ele
2. **Responsável** só vê dados do(s) filho(s)
3. **Admin** vê tudo

### LGPD (Implementação Mock):

- Registro de consentimentos (`Consent`)
- Logs de auditoria (`AuditLog`) - preparado, não implementado
- Acesso controlado por papel

---

## 🔧 Arquivos Principais Criados

### Types e Dados
- `lib/types/clinical.ts` - Todas as interfaces TypeScript
- `lib/clinical-data.ts` - Dados mock (pacientes, sessões, etc.)

### Autenticação
- `lib/auth/auth-service.ts` - Login/logout mock

### Context
- `components/clinical-provider.tsx` - Context de dados clínicos

### Páginas Profissionais
- `app/(professional)/layout.tsx` - Layout com sidebar
- `app/(professional)/dashboard/page.tsx` - Dashboard
- `app/(professional)/patients/page.tsx` - Lista de pacientes
- `app/(professional)/patients/[id]/timeline/page.tsx` - Timeline

### Páginas Responsáveis
- `app/(guardian)/layout.tsx` - Layout simples
- `app/(guardian)/patient/[id]/page.tsx` - Visualização

### Componentes UI
- `components/professional/timeline/timeline-event-card.tsx` - Card de evento

### Auth
- `app/auth/login/page.tsx` - Página de login

---

## 🔄 Migração Futura para Backend Real

### Quando migrar para PostgreSQL/Supabase:

1. **Instalar Prisma:**
```bash
npm install prisma @prisma/client
npx prisma init
```

2. **Copiar schema** da documentação para `prisma/schema.prisma`

3. **Substituir Context**:
   - `ClinicalProvider` passa a fazer fetch da API
   - Criar API Routes em `app/api/`

4. **Substituir Auth**:
   - Usar NextAuth.js ou Supabase Auth
   - Middleware para proteger rotas

5. **Dados mock → DB**:
   - Usar `prisma/seed.ts` para popular banco

---

## 📈 Próximos Passos / Roadmap

### Fase 1 ✅ (Concluída - Mock)
- [x] Autenticação mock
- [x] Dashboard profissional
- [x] Timeline do paciente
- [x] Área do responsável

### Fase 2 (A Implementar)
- [ ] Formulário de nova sessão
- [ ] Formulário de novo objetivo
- [ ] Sistema de comentários funcional
- [ ] Notificações de menções

### Fase 3 (Backend)
- [ ] Migrar para PostgreSQL
- [ ] API Routes
- [ ] NextAuth.js
- [ ] Deploy (Vercel + Supabase)

### Fase 4 (Integração Total)
- [ ] Jogos lúdicos enviam métricas ao prontuário
- [ ] Relatórios e gráficos
- [ ] Exportar PDF do prontuário
- [ ] Sistema de mensagens entre profissionais

---

## 🐛 Troubleshooting

### Problema: Não consigo fazer login
**Solução**: Verifique se está usando um dos emails de teste:
- `dra.ana@clinica.com`
- `maria.santos@email.com`
- `admin@clinica.com`

### Problema: Pacientes não aparecem
**Solução**: Faça login como profissional (`dra.ana@clinica.com`), pois apenas profissionais/admins veem pacientes.

### Problema: Timeline vazia
**Solução**: Os dados mock têm eventos apenas para `patient-1` (Pedro Santos).

---

## 📞 Suporte

Para dúvidas sobre:
- **Arquitetura**: Veja este README
- **Código**: Veja comentários nos arquivos `.tsx` e `.ts`
- **Tipos**: Consulte `lib/types/clinical.ts`
- **Dados Mock**: Consulte `lib/clinical-data.ts`

---

## 📄 Licença

Este sistema é parte do projeto Lúcido.

---

**🎉 Sistema pronto para desenvolvimento!**

Todas as funcionalidades core estão implementadas em mock. Basta desenvolver formulários, refinar UX e migrar para backend quando necessário.
