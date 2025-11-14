# 🔧 Configurar Stripe CLI para Testes Locais

## 1. **Autenticar no Stripe CLI**

Execute no terminal:
```bash
stripe login
```

- Abra o link que aparece: `https://dashboard.stripe.com/stripecli/confirm_auth?t=...`
- Ou use o código: `proper-frugal-awed-amply`
- Faça login na sua conta Stripe

## 2. **Iniciar o Webhook Listener**

Após autenticação, execute:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**IMPORTANTE:** Mantenha este comando rodando em um terminal separado!

## 3. **Obter a Chave do Webhook**

Em outro terminal, execute:
```bash
stripe listen --print-secret
```

Copie a chave que aparece (algo como `whsec_...`)

## 4. **Configurar Variável de Ambiente**

Adicione ao seu arquivo `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_aqui
```

## 5. **Testar o Fluxo Completo**

1. **Mantenha o webhook rodando** em um terminal
2. **Inicie o servidor** em outro terminal: `npm run dev`
3. **Faça um pedido** no localhost
4. **Verifique os logs** do webhook para ver se está recebendo eventos

## 6. **Verificar Logs**

O webhook mostrará logs como:
```
2024-01-15 10:30:00 --> checkout.session.completed [evt_1234567890]
2024-01-15 10:30:01 <-- [200] POST http://localhost:3000/api/webhooks/stripe
```

## 🎯 **Resultado Esperado**

- ✅ Redirecionamento para `localhost:3000/sucesso`
- ✅ Dados do pedido aparecem na página de sucesso
- ✅ Emails enviados (cliente + admin)
- ✅ Pedido salvo no Supabase

## 🚨 **Troubleshooting**

**Se não receber emails:**
- Verifique se o Mailgun está configurado
- Verifique os logs do webhook
- Confirme se o pedido foi salvo no Supabase

**Se aparecerem zeros na página de sucesso:**
- Verifique se o webhook está processando
- Confirme se a API `/api/orders/session/[sessionId]` está funcionando
