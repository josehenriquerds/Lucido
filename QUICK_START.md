# 🚀 Quick Start - Sistema Clínico Lúcido

## ⚡ Começar em 2 Minutos

### 1. Rodar o projeto

```bash
cd lucido-next
npm run dev
```

### 2. Acessar Login

```
http://localhost:3000/auth/login
```

### 3. Login Rápido (clique nos botões)

**Opção 1: Profissional**
```
👩‍⚕️ Dra. Ana Silva
dra.ana@clinica.com / 123456
```

**Opção 2: Responsável**
```
👩 Maria Santos (Mãe)
maria.santos@email.com / 123456
```

---

## 🗺️ Mapa do Sistema

### Áreas Disponíveis

```
/                              → Área da Criança (jogos lúdicos) ✅ MANTIDA
/auth/login                    → Login 🆕
/professional/dashboard        → Dashboard Profissional 🆕
/professional/patients         → Lista de Pacientes 🆕
/professional/patients/[id]/timeline → Timeline do Paciente 🆕
/guardian/patient/[id]         → Área do Responsável 🆕
```

---

## 📱 Fluxo de Uso

### Como Profissional:

1. **Login** → `/auth/login`
2. **Dashboard** → Ver estatísticas e pacientes
3. **Pacientes** → Clicar em um paciente
4. **Timeline** → Ver todos os eventos clínicos
5. **Filtrar** → Por tipo de evento ou período

### Como Responsável:

1. **Login** → `/auth/login`
2. **Visualização** → Ver timeline do filho (somente leitura)
3. **Equipe** → Ver profissionais que atendem
4. **Objetivos** → Ver metas terapêuticas

---

## 🔑 Credenciais de Teste

| Email | Senha | Papel | Acesso |
|-------|-------|-------|--------|
| dra.ana@clinica.com | 123456 | Psicóloga | Dashboard + 2 pacientes |
| maria.santos@email.com | 123456 | Mãe | Filho: Pedro |
| admin@clinica.com | 123456 | Admin | Tudo |

---

## 📊 Dados de Exemplo

### Pacientes:
- **Pedro Santos** (5 anos, TEA)
  - ID: `patient-1`
  - 3 sessões registradas
  - 3 objetivos terapêuticos
  - Equipe: Ana (Psico), Carlos (Fono), Lúcia (TO)

- **Laura Oliveira** (4 anos, TEA)
  - ID: `patient-2`
  - 1 profissional (Ana)

---

## 🛠️ Estrutura de Arquivos Importantes

### Para Modificar:

**Dados Mock:**
```
lib/clinical-data.ts
```

**Types:**
```
lib/types/clinical.ts
```

**Dashboard:**
```
app/(professional)/dashboard/page.tsx
```

**Timeline:**
```
app/(professional)/patients/[id]/timeline/page.tsx
components/professional/timeline/timeline-event-card.tsx
```

---

## 🧪 Testar Funcionalidades

### ✅ Implementado e Funcionando:

- [x] Login com 3 perfis diferentes
- [x] Dashboard profissional com estatísticas
- [x] Lista de pacientes do profissional
- [x] Timeline completa do paciente
- [x] Filtros de timeline (tipo e período)
- [x] Área do responsável (leitura)
- [x] Dados relacionados (sessões, objetivos, profissionais)
- [x] Layout responsivo

### 🚧 Preparado (Stub):

- [ ] Formulário de nova sessão
- [ ] Sistema de comentários (dados existem, UI stub)
- [ ] Formulário de objetivos
- [ ] Gestão de organização

---

## 🔄 Próximos Desenvolvimentos

### Prioridade Alta:
1. **Formulário de Sessão** - Registrar nova sessão
2. **Comentários** - Implementar UI de comentários entre profissionais
3. **Integração Jogos** - Atividades lúdicas gerarem eventos na timeline

### Prioridade Média:
4. **Formulário de Objetivos** - Criar/editar objetivos
5. **Relatórios** - Gráficos e exportação PDF
6. **Notificações** - Avisos de novos comentários

### Prioridade Baixa (Backend):
7. **Migração DB** - PostgreSQL/Supabase
8. **API Routes** - Substituir Context por API
9. **Auth Real** - NextAuth.js

---

## 💡 Dicas de Desenvolvimento

### Adicionar Novo Paciente:

Edite `lib/clinical-data.ts`:

```typescript
export const MOCK_PATIENTS: Patient[] = [
  // ... existentes
  {
    id: "patient-3",
    organizationId: "org-1",
    name: "Novo Paciente",
    birthDate: new Date("2021-01-15"),
    sex: Sex.MALE,
    diagnoses: ["TEA"],
    // ...
  },
];
```

### Adicionar Nova Sessão:

```typescript
export const MOCK_SESSIONS: Session[] = [
  // ... existentes
  {
    id: "session-nova",
    patientId: "patient-1",
    professionalId: "user-1",
    sessionType: SessionType.PSYCHOLOGY,
    sessionDate: new Date(),
    observations: "Observações...",
    // ...
  },
];
```

### Adicionar Evento na Timeline:

```typescript
export const MOCK_EVENTS: Event[] = [
  // ... existentes
  {
    id: "event-novo",
    patientId: "patient-1",
    type: EventType.MILESTONE,
    eventDate: new Date(),
    title: "Nova Conquista!",
    description: "Descrição...",
    // ...
  },
];
```

---

## ❓ FAQ

### Como adicionar mais profissionais?
Edite `MOCK_USERS` em `lib/clinical-data.ts`

### Como vincular profissional a paciente?
Adicione entrada em `MOCK_CASE_PROFESSIONALS`

### Como mudar a área de um jogo?
Edite o `gameModuleId` em `MOCK_THERAPEUTIC_ACTIVITIES`

### Como testar com outros dados?
Limpe o LocalStorage no DevTools e atualize a página

---

## 🎨 Personalização

### Cores do Tema Profissional:
```
Primária: Blue (500-600)
Secundária: Purple, Green
Neutro: Gray
```

### Cores do Tema Responsável:
```
Primária: Purple (500-600)
Secundária: Pink
Neutro: Gray
```

---

## 📞 Precisa de Ajuda?

1. **Documentação Completa**: `CLINICAL_SYSTEM_README.md`
2. **Comentários no Código**: Todos os arquivos têm comentários
3. **Types**: `lib/types/clinical.ts` - referência de todas as entidades

---

**Pronto para desenvolver! 🚀**
