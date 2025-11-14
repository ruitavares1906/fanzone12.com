# Configuração do Webhook do Stripe - fanzone12.pt

## Resumo da Atualização

O webhook do Stripe foi atualizado para usar a nova versão da API e o novo domínio **fanzone12.pt**.

## Configuração do Webhook no Stripe Dashboard

### 1. Acessar o Dashboard do Stripe
- Faça login no [dashboard.stripe.com](https://dashboard.stripe.com)
- Navegue para "Developers" > "Webhooks"

### 2. Criar Novo Endpoint
- Clique em "Add endpoint"
- **URL do endpoint**: `https://www.fanzone12.pt/api/webhooks/stripe`
- **Descrição**: "Webhook para processamento de pedidos - fanzone12.pt"

### 3. Configurar Eventos
Selecione os seguintes eventos para escutar:

#### Eventos Obrigatórios:
- ✅ `checkout.session.completed` - Checkout finalizado
- ✅ `payment_intent.succeeded` - Pagamento bem-sucedido  
- ✅ `payment_intent.payment_failed` - Falha no pagamento

#### Evento Opcional:
- ✅ `climate.order.created` - Pedido de sustentabilidade (se habilitado)

### 4. Versão da API
- **Versão da API**: `2025-09-30.clover`
- Esta é a versão mais recente e estável da API do Stripe

### 5. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_... # ou sk_test_... para desenvolvimento
STRIPE_WEBHOOK_SECRET=whsec_... # Secret do webhook
NEXT_PUBLIC_SITE_URL=https://www.fanzone12.pt
```

## Funcionalidades do Webhook

### 1. Processamento de Checkout
- ✅ Criação automática de pedidos
- ✅ Salvamento de itens do pedido
- ✅ Cálculo de comissões de parceiros (10%)
- ✅ Envio de emails de confirmação

### 2. Gestão de Pagamentos
- ✅ Atualização de status de pagamento
- ✅ Processamento de falhas de pagamento
- ✅ Tracking de comissões

### 3. Integração com Parceiros
- ✅ Detecção de códigos de desconto
- ✅ Cálculo automático de comissões
- ✅ Registro de ganhos dos parceiros

## Arquivos Atualizados

### 1. Webhook Principal
- **Arquivo**: `app/api/webhooks/stripe/route.ts`
- **Mudanças**: 
  - Versão da API atualizada para `2025-09-30.clover`
  - Processamento de eventos otimizado

### 2. Simulação de Webhook
- **Arquivo**: `app/api/admin/simulate-webhook/route.ts`
- **Mudanças**: Versão da API atualizada

### 3. Checkout Sessions
- **Arquivo**: `app/api/create-checkout-session/route.ts`
- **Mudanças**: 
  - Versão da API atualizada
  - URL padrão alterada para `fanzone12.pt`

### 4. Outros Arquivos Stripe
- `app/api/test-checkout/route.ts`
- `app/api/payment-methods/route.ts`
- `app/api/checkout-session/route.ts`

## Testando o Webhook

### 1. Teste Manual
```bash
# Testar configuração
curl https://www.fanzone12.pt/api/test-mailgun-config

# Simular evento
curl -X POST https://www.fanzone12.pt/api/admin/simulate-webhook \
  -H "Content-Type: application/json" \
  -d '{"eventType":"checkout.session.completed"}'
```

### 2. Teste no Dashboard
- Acesse `/admin/testar-webhook` no painel administrativo
- Use os botões de simulação de eventos
- Verifique os logs para confirmar processamento

### 3. Teste Real
- Faça um pedido de teste no site
- Verifique se o webhook é chamado
- Confirme se o pedido é criado corretamente

## Monitoramento

### 1. Logs do Webhook
- Todos os eventos são logados no console
- Erros são capturados e reportados
- Status de processamento é rastreado

### 2. Dashboard do Stripe
- Acesse "Developers" > "Webhooks" > "Seu endpoint"
- Verifique logs de tentativas
- Monitore taxa de sucesso

### 3. Logs da Aplicação
- Verifique logs do servidor
- Monitore processamento de pedidos
- Confirme envio de emails

## Troubleshooting

### 1. Webhook não é chamado
- ✅ Verifique se a URL está correta
- ✅ Confirme se o endpoint está acessível
- ✅ Verifique se os eventos estão selecionados

### 2. Erro de assinatura
- ✅ Confirme se `STRIPE_WEBHOOK_SECRET` está correto
- ✅ Verifique se a chave secreta corresponde ao webhook
- ✅ Teste com eventos de desenvolvimento

### 3. Processamento falha
- ✅ Verifique logs do webhook
- ✅ Confirme configuração do banco de dados
- ✅ Teste com simulação de eventos

## Próximos Passos

1. **Configurar webhook no Stripe Dashboard**
2. **Testar com eventos de desenvolvimento**
3. **Verificar processamento de pedidos**
4. **Monitorar logs e performance**
5. **Configurar alertas de erro**

## Suporte

Para problemas com o Stripe:
- [Documentação oficial](https://stripe.com/docs/webhooks)
- [Suporte técnico](https://support.stripe.com/)
- [Status da API](https://status.stripe.com/)

---

**Status**: ✅ Webhook atualizado para fanzone12.pt
**Versão da API**: 2025-09-30.clover
**URL do Webhook**: https://www.fanzone12.pt/api/webhooks/stripe
**Data**: $(date)
**Versão**: 2.0
