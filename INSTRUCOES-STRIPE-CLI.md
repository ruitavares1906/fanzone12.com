# 🚀 Instruções Rápidas - Stripe CLI

## 📋 Configuração para Testar Pagamentos

### 1️⃣ Instalar Stripe CLI

Download: https://stripe.com/docs/stripe-cli

```bash
# Verificar se está instalado
stripe --version
```

### 2️⃣ Autenticar no Stripe

```bash
stripe login
```

**Depois:**
- Abra o link que aparecer
- Ou use o código exibido
- Faça login na sua conta Stripe

### 3️⃣ Iniciar Webhook Listener

**Em um terminal separado, execute:**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**⚠️ IMPORTANTE:** Mantenha este comando rodando em segundo plano!

### 4️⃣ Copiar Webhook Secret

Quando iniciar o listener, você verá algo como:

```
Ready! Your webhook signing secret is whsec_abc123...
```

**Copie este valor `whsec_...`**

### 5️⃣ Configurar .env.local

Crie/adicione ao arquivo `.env.local` na raiz do projeto:

```env
STRIPE_WEBHOOK_SECRET=whsec_seu_valor_aqui
```

### 6️⃣ Iniciar Servidor

**Em OUTRO terminal, execute:**

```bash
npm run dev
```

### 7️⃣ Testar Pagamento

1. Abra: http://localhost:3000
2. Adicione produtos ao carrinho
3. Vá para o checkout
4. Complete um pagamento de teste

### 8️⃣ Verificar Resultados

No terminal do Stripe CLI, você verá logs:

```
--> checkout.session.completed [evt_...]
<-- [200] POST http://localhost:3000/api/webhooks/stripe
```

## ✅ Checklist de Sucesso

- [ ] Stripe CLI instalado
- [ ] Autenticado com `stripe login`
- [ ] Listener rodando: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Webhook secret copiado
- [ ] `STRIPE_WEBHOOK_SECRET` adicionado ao `.env.local`
- [ ] Servidor iniciado: `npm run dev`
- [ ] Pedido de teste realizado
- [ ] Logs aparecem no terminal do Stripe CLI

## 🐛 Troubleshooting

**Erro: "command not found: stripe"**
- Instale o Stripe CLI: https://stripe.com/docs/stripe-cli

**Erro: "Webhook signing secret not configured"**
- Copie o secret do terminal onde roda `stripe listen`
- Adicione ao `.env.local` como `STRIPE_WEBHOOK_SECRET`
- Reinicie o servidor: `npm run dev`

**Erro: "Connection refused"**
- Certifique-se que o servidor está rodando em `localhost:3000`
- Verifique se a URL no comando está correta

**Logs não aparecem**
- Verifique se o listener está rodando
- Reinicie o Stripe listener
- Verifique os logs do servidor (`npm run dev`)

## 📚 Documentação Completa

Para mais detalhes, consulte:

- `docs/CONFIGURAR_STRIPE_CLI_LOCAL.md` - Configuração completa
- `docs/TESTAR_WEBHOOK_LOCAL.md` - Passo a passo de testes
- `docs/CONFIGURACAO_STRIPE_WEBHOOK.md` - Configuração produção

## 🎯 Cartões de Teste Stripe

Use estes cartões para testar:

**Sucesso:**
- Número: `4242 4242 4242 4242`
- CVV: `123`
- Expiração: Qualquer data futura
- CEP: Qualquer CEP válido

**Falha:**
- Número: `4000 0000 0000 0002`
- CVV: `123`
- Expiração: Qualquer data futura

Mais cartões de teste: https://stripe.com/docs/testing

---

**⚠️ IMPORTANTE:** O listener deve ficar rodando enquanto você desenvolve/testa!

