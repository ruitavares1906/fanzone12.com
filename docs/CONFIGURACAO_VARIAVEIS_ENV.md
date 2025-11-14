# 🔧 Configuração de Variáveis de Ambiente

## ⚠️ PROBLEMA IDENTIFICADO
O webhook do Stripe não está funcionando corretamente porque faltam variáveis de ambiente críticas, especialmente a `SUPABASE_SERVICE_ROLE_KEY`.

## 📋 Variáveis Necessárias

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# ===== SUPABASE =====
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# ⚠️ CRÍTICA: Chave de serviço do Supabase
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# ===== STRIPE =====
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# ===== SENDGRID =====
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here

# ===== NEXT.JS =====
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## 🔍 Como Encontrar as Chaves

### Supabase
1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **Settings** > **API**
4. Copie:
   - **URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role**: `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **CRÍTICA**

### Stripe
1. Acesse o [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá para **Developers** > **API keys**
3. Copie:
   - **Publishable key**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key**: `STRIPE_SECRET_KEY`
4. Para o webhook secret:
   - Vá para **Developers** > **Webhooks**
   - Clique no seu webhook
   - Copie o **Signing secret**: `STRIPE_WEBHOOK_SECRET`

### SendGrid
1. Acesse o [SendGrid Dashboard](https://app.sendgrid.com)
2. Vá para **Settings** > **API Keys**
3. Copie sua API key: `SENDGRID_API_KEY`

## 🚀 Passos para Resolver

1. **Crie o arquivo `.env.local`** na raiz do projeto
2. **Preencha todas as variáveis** com os valores reais
3. **Reinicie o servidor** completamente:
   ```bash
   # Pare o servidor (Ctrl+C)
   npm run dev
   # ou
   yarn dev
   ```
4. **Teste o webhook** fazendo uma compra de teste
5. **Verifique os emails** para admin em `geral@fanzone12.pt`

## 🔧 Teste Rápido

Após configurar as variáveis, teste o email para admin:

```bash
curl -X POST http://localhost:3000/api/admin/test-admin-email-simple
```

## ❗ Pontos Críticos

- **`SUPABASE_SERVICE_ROLE_KEY`** é essencial para o webhook salvar pedidos
- **`STRIPE_WEBHOOK_SECRET`** é necessário para validar webhooks
- **`SENDGRID_API_KEY`** deve começar com `SG.`
- **Reiniciar o servidor** é obrigatório após adicionar variáveis

## 🐛 Diagnóstico

Se ainda não funcionar após configurar:

1. Verifique os logs do servidor
2. Teste o webhook do Stripe
3. Confirme se o domínio está verificado no SendGrid
4. Verifique a pasta de spam do email

---

**Nota**: O cliente está recebendo emails, mas o admin não. Isso indica que o SendGrid funciona, mas o webhook pode não estar processando corretamente devido às variáveis em falta. 