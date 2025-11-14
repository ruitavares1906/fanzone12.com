# 🔥 Solução Rápida - Emails de Encomenda

## ❌ Problema
Os emails de confirmação de encomenda não estão a ser enviados devido a:
1. **Política RLS do Supabase** a bloquear inserções
2. **Falta da Service Role Key** no webhook

## ✅ Solução em 3 Passos

### 1. **Adicionar Variável de Ambiente**
No arquivo `.env.local` na raiz do projeto, adicione:

```bash
# Esta é a variável que está em falta!
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Se também não tiver o SendGrid:
SENDGRID_API_KEY=SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**🔍 Onde encontrar a Service Role Key:**
1. Vá ao dashboard do Supabase
2. Projeto > Settings > API
3. Copie a chave "service_role" (não a "anon" pública)

### 2. **Executar o Script SQL**
Execute o arquivo `fix-order-items-rls-policy.sql` no SQL Editor do Supabase para corrigir as políticas RLS.

### 3. **Reiniciar o Servidor**
```bash
# Pare o servidor (Ctrl+C) e reinicie
npm run dev
```

## 🧪 Testar a Solução

### Opção A: Diagnóstico Automático
1. Acesse `/admin/diagnostico-email`
2. Clique em "Executar Diagnósticos"
3. Todos os testes devem passar ✅

### Opção B: Teste de Encomenda
1. Faça uma encomenda de teste
2. Verifique se:
   - A encomenda aparece no admin
   - Os itens estão salvos
   - O email de confirmação é enviado

## 🎯 O que Foi Corrigido

### Antes:
```
❌ Webhook usa cliente Supabase padrão (anônimo)
❌ RLS bloqueia inserções na tabela order_items  
❌ Encomenda salva MAS itens não são salvos
❌ Email não é enviado porque processo falha
```

### Depois:
```
✅ Webhook usa cliente admin (service role)
✅ Service role bypassa RLS
✅ Encomenda E itens são salvos
✅ Email é enviado com sucesso
```

## 🚨 Variáveis Necessárias

Para o sistema funcionar completamente, precisa destas variáveis no `.env.local`:

```bash
# SendGrid (para emails)
SENDGRID_API_KEY=SG.XXXXXXXXXX

# Supabase (base de dados)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (pagamentos)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Site
NEXT_PUBLIC_SITE_URL=https://camisolasdesportivas.pt
```

## 💡 Se o Problema Persistir

1. **Verifique os logs** do servidor para erros específicos
2. **Use a página de diagnóstico** para identificar o problema exato
3. **Confirme que reiniciou o servidor** após adicionar variáveis
4. **Verifique no Supabase** se as políticas RLS foram aplicadas

---

**Resultado esperado**: Emails de confirmação enviados automaticamente após cada encomenda! 🎉 