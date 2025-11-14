# 🧪 Testar Webhook Local - Passo a Passo

## 1. **Verificar se o Stripe CLI está rodando**

Execute em um terminal:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Deve aparecer:**
```
Ready! You are using Stripe API Version [2025-09-30.clover]. 
Your webhook signing secret is whsec_... (^C to quit)
```

## 2. **Verificar se o servidor está rodando**

Em outro terminal:
```bash
npm run dev
```

**Deve aparecer:**
```
- Local:        http://localhost:3000
- ready - started server on 0.0.0.0:3000
```

## 3. **Fazer um pedido de teste**

1. Abra `http://localhost:3000`
2. Adicione produtos ao carrinho
3. Vá para o checkout
4. Escolha "Pagamento à Cobrança"
5. Complete o pagamento no Stripe

## 4. **Verificar logs do webhook**

No terminal do Stripe CLI, deve aparecer:
```
2024-01-15 10:30:00 --> checkout.session.completed [evt_1234567890]
2024-01-15 10:30:01 <-- [200] POST http://localhost:3000/api/webhooks/stripe
```

## 5. **Verificar se o pedido foi criado**

Teste a API:
```bash
curl "http://localhost:3000/api/orders/session/SEU_SESSION_ID"
```

## 🚨 **Problemas Comuns**

### **Se não aparecer logs do webhook:**
- Verifique se o Stripe CLI está rodando
- Verifique se a URL está correta: `localhost:3000/api/webhooks/stripe`
- Reinicie o Stripe CLI

### **Se aparecer erro 404 na página de sucesso:**
- O webhook não processou o pedido
- Verifique os logs do webhook
- Verifique se o pedido foi salvo no Supabase

### **Se não receber emails:**
- Verifique se o Mailgun está configurado
- Verifique os logs do webhook
- Confirme se o pedido foi salvo no Supabase

## 🎯 **Resultado Esperado**

Após fazer um pedido:
- ✅ Redirecionamento para `localhost:3000/sucesso`
- ✅ Dados do pedido aparecem na página
- ✅ Emails enviados (cliente + admin)
- ✅ Pedido salvo no Supabase
