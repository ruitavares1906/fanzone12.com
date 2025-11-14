# Configuração do Mailgun

## Resumo da Migração

O sistema de email foi migrado do **Postmark** para o **Mailgun** para resolver problemas de limite de créditos e melhorar a confiabilidade do envio de emails.

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```env
# Mailgun Configuration
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=your_mailgun_domain_here
MAILGUN_FROM_EMAIL=geral@fanzone12.pt
```

## Como Obter as Credenciais

### 1. Criar Conta no Mailgun
- Acesse [mailgun.com](https://www.mailgun.com)
- Crie uma conta gratuita
- Verifique seu email

### 2. Obter API Key
- No dashboard do Mailgun, vá para "Settings" > "API Keys"
- Copie a "Private API Key"
- Cole no `MAILGUN_API_KEY`

### 3. Configurar Domínio
- No dashboard, vá para "Sending" > "Domains"
- Adicione o domínio `fanzone12.pt`
- Siga as instruções de verificação DNS
- Use o domínio verificado no `MAILGUN_DOMAIN`

### 4. Configurar Email de Envio
- Use `geral@fanzone12.pt` como `MAILGUN_FROM_EMAIL`
- Certifique-se de que este email está verificado no domínio

## Arquivos Modificados

### 1. Package.json
- Removido: `postmark`
- Adicionado: `mailgun-js`

### 2. Nova Biblioteca
- **Criado**: `lib/mailgun.ts` - Funções de envio de email

### 3. Rotas API Atualizadas
- `app/api/webhooks/stripe/route.ts`
- `app/api/admin/send-test-email/route.ts`
- `app/api/admin/resend-confirmation-email/route.ts`
- `app/api/admin/orders/batch-update/route.ts`
- `app/api/admin/send-custom-email/route.ts`
- `app/api/admin/send-order-notification/route.ts`
- `app/api/admin/send-shipping-email/route.ts`
- `app/api/contact/route.ts`
- `app/api/test-email/route.ts`
- `app/api/test-mailgun-config/route.ts` (novo)

## Funcionalidades Implementadas

### 1. Emails de Confirmação de Pedido
- Envio automático após pagamento via Stripe
- Template HTML responsivo
- Detalhes completos do pedido

### 2. Emails de Confirmação de Envio
- Notificação quando pedido é enviado
- Informações de rastreamento (opcional)

### 3. Emails de Contato
- Formulário de contato
- Confirmação para o cliente
- Notificação para a loja

### 4. Emails Administrativos
- Teste de configuração
- Emails personalizados
- Notificações de pedidos

## Testando a Configuração

### 1. Teste de Configuração
```bash
curl http://localhost:3000/api/test-mailgun-config
```

### 2. Teste de Envio
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com"}'
```

### 3. Teste de Email de Pedido
```bash
curl -X POST http://localhost:3000/api/admin/send-test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","testOrderEmail":true}'
```

## Limites e Quotas

### Plano Gratuito
- 5,000 emails/mês
- 100 emails/dia
- Domínios verificados: 1

### Plano Pago
- Emails ilimitados
- Domínios múltiplos
- Suporte prioritário

## Troubleshooting

### 1. Erro de Autenticação
- Verifique se a API Key está correta
- Confirme se o domínio está verificado

### 2. Emails não entregues
- Verifique os logs do Mailgun
- Confirme configurações DNS
- Verifique se o domínio está ativo

### 3. Limite de quota
- Verifique uso no dashboard
- Considere upgrade do plano

## Monitoramento

### Dashboard Mailgun
- Acesse o dashboard para monitorar entregas
- Verifique logs de envio
- Monitore taxa de entrega

### Logs da Aplicação
- Todos os envios são logados no console
- Erros são capturados e reportados
- Status de entrega é rastreado

## Próximos Passos

1. **Configurar variáveis de ambiente**
2. **Testar configuração básica**
3. **Verificar domínio no Mailgun**
4. **Testar envio de emails**
5. **Monitorar entregas**

## Suporte

Para problemas com o Mailgun:
- [Documentação oficial](https://documentation.mailgun.com/)
- [Suporte técnico](https://help.mailgun.com/)
- [Status da API](https://status.mailgun.com/)

---

**Status**: ✅ Migração completa do Postmark para Mailgun
**Data**: $(date)
**Versão**: 1.0
