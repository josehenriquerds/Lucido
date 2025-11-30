# 🔧 Troubleshooting - Sistema Clínico Lúcido

## ❌ Problema: Rotas 404 (professional/dashboard não funciona)

### Causa:
Você adicionou novas rotas enquanto o servidor estava rodando. O Next.js precisa ser **reiniciado** para detectar novos arquivos de rota.

### ✅ Solução:

1. **Pare o servidor** (Ctrl+C no terminal)
2. **Limpe o cache**:
   ```bash
   cd lucido-next
   rm -rf .next
   ```
3. **Reinicie o servidor**:
   ```bash
   npm run dev
   ```
4. **Acesse novamente**:
   ```
   http://localhost:3000/auth/login
   ```

---

## ❌ Problema: Login não funciona / não redireciona

### Verificar:
1. Abra DevTools (F12)
2. Aba "Console" - veja se há erros
3. Aba "Application" > "Local Storage" > `http://localhost:3000`
4. Veja se `lucido:clinical-auth` está lá após login

### Se o LocalStorage está vazio:
- A função `login()` não está sendo chamada
- Verifique se clicou em "Entrar" ou no botão de quick login

### Se redireciona para 404:
- Reinicie o servidor (veja solução acima)

---

## ❌ Problema: Página em branco / não renderiza

### Verificar no Console:
```
Uncaught Error: useClinical must be used within ClinicalProvider
```

### Solução:
O layout precisa do `ClinicalProvider`. Verifique se o arquivo `app/(professional)/layout.tsx` existe e tem:

```tsx
import { ClinicalProvider } from "@/components/clinical-provider";

// ...
return (
  <ClinicalProvider>
    {children}
  </ClinicalProvider>
);
```

---

## ❌ Problema: Erro de TypeScript

### Erro comum:
```
Cannot find module '@/lib/types/clinical'
```

### Solução:
1. Verifique se o arquivo existe:
   ```bash
   ls -la lucido-next/lib/types/clinical.ts
   ```
2. Se não existir, o arquivo não foi criado. Copie do repositório.

---

## ❌ Problema: Build falha

### Erro comum:
```
You cannot have two parallel pages that resolve to the same path
```

### Solução:
Renomeie uma das páginas conflitantes. Exemplo:
- `/settings` conflita com `/(public)/settings` e `/(professional)/settings`
- Renomeie para `/profile-settings`

---

## ❌ Problema: Dados não aparecem (lista vazia)

### Causa:
O usuário logado não tem pacientes atribuídos.

### Solução:
1. Faça login como `dra.ana@clinica.com` (tem 2 pacientes)
2. OU edite `lib/clinical-data.ts` e adicione mais dados

---

## ❌ Problema: Estilos não aplicam (Tailwind)

### Causa:
O Tailwind não está compilando as novas classes.

### Solução:
1. Reinicie o servidor
2. Verifique se `tailwind.config.ts` tem:
   ```ts
   content: [
     "./app/**/*.{js,ts,jsx,tsx}",
     "./components/**/*.{js,ts,jsx,tsx}",
   ]
   ```

---

## ❌ Problema: "use client" missing

### Erro:
```
You're importing a component that needs useState. It only works in a Client Component
```

### Solução:
Adicione `"use client"` no topo do arquivo:
```tsx
"use client";

import { useState } from "react";
// ...
```

---

## 🔍 Comandos Úteis para Debug

### Ver todas as rotas criadas:
```bash
cd lucido-next
find app -name "page.tsx" | sort
```

### Ver estrutura de pastas:
```bash
tree app -L 3
# ou no Windows:
dir app /s /b | findstr page.tsx
```

### Verificar se build funciona:
```bash
npm run build
```

### Limpar tudo e recomeçar:
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

---

## 📊 Checklist Rápido de Verificação

Antes de pedir ajuda, verifique:

- [ ] Servidor reiniciado após adicionar novas rotas?
- [ ] Cache `.next/` foi limpo?
- [ ] URL está correta? (`/auth/login`, não `/login`)
- [ ] Console do navegador não tem erros?
- [ ] LocalStorage tem a sessão após login?
- [ ] Arquivo `page.tsx` existe na rota esperada?
- [ ] Layout tem o Provider necessário?

---

## 🆘 Ainda com Problema?

1. **Tire um screenshot** do erro no console
2. **Verifique** qual URL você está tentando acessar
3. **Confirme** se o arquivo de rota existe
4. **Reinicie** o servidor (resolve 90% dos problemas)

---

## ✅ Passo a Passo: Como Começar do Zero

Se nada funciona, faça isso:

```bash
# 1. Pare o servidor (Ctrl+C)

# 2. Vá para a pasta do projeto
cd lucido-next

# 3. Limpe o cache
rm -rf .next

# 4. Reinstale dependências (se necessário)
npm install

# 5. Rode o build para verificar erros
npm run build

# 6. Se build OK, rode dev
npm run dev

# 7. Acesse http://localhost:3000/auth/login

# 8. Clique no botão "👩‍⚕️ Profissional (Dra. Ana)"

# 9. Clique em "Entrar"

# 10. Deve redirecionar para /professional/dashboard
```

---

**Se seguir estes passos, o sistema VAI funcionar! 🚀**
