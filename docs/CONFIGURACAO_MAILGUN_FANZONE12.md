# Configuração do Mailgun - fanzone12.pt

## Resumo da Migração

O sistema de email foi migrado do **Postmark** para o **Mailgun** e atualizado para usar o novo domínio **fanzone12.pt**.

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```env
# Mailgun Configuration
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=fanzone12.pt
MAILGUN_FROM_EMAIL=sales@fanzone12.com
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
- Use `sales@fanzone12.com` como `MAILGUN_FROM_EMAIL`
- Certifique-se de que este email está verificado no domínio

## Configuração DNS

Para verificar o domínio `fanzone12.pt` no Mailgun, adicione os seguintes registros DNS:

### Registros TXT (Verificação)
```
# Verificação de domínio
TXT: v=spf1 include:mailgun.org ~all

# Verificação DKIM
TXT: k=rsa; p=YOUR_DKIM_PUBLIC_KEY
```

### Registros MX
```
# Mailgun MX
MX: 10 mxa.mailgun.org
MX: 10 mxb.mailgun.org
```

### Registro CNAME
```
# Tracking de emails
CNAME: email.fanzone12.pt -> mailgun.org
```

## Arquivos Modificados

### 1. Biblioteca Principal
- **Arquivo**: `lib/mailgun.ts`
- **Mudanças**: 
  - Email padrão atualizado para `sales@fanzone12.com`
  - Templates atualizados com novo domínio

### 2. Rotas API Atualizadas
- `app/api/webhooks/stripe/route.ts`
- `app/api/admin/send-test-email/route.ts`
- `app/api/admin/resend-confirmation-email/route.ts`
- `app/api/admin/orders/batch-update/route.ts`
- `app/api/admin/send-custom-email/route.ts`
- `app/api/admin/send-order-notification/route.ts`
- `app/api/admin/send-shipping-email/route.ts`
- `app/api/contact/route.ts`
- `app/api/test-email/route.ts`
- `app/api/test-mailgun-config/route.ts`

### 3. Configurações de Ambiente
- `lib/env-config.ts` - URL padrão atualizada
- `app/api/create-checkout-session/route.ts` - URL de fallback atualizada

## Funcionalidades Implementadas

### 1. Emails de Confirmação de Pedido
- Envio automático após pagamento via Stripe
- Template HTML responsivo com branding fanzone12.pt
- Detalhes completos do pedido
- Links para redes sociais atualizados

### 2. Emails de Confirmação de Envio
- Notificação quando pedido é enviado
- Informações de rastreamento (opcional)
- Template atualizado com novo domínio

### 3. Emails de Contato
- Formulário de contato
- Confirmação para o cliente
- Notificação para a loja (sales@fanzone12.com)

### 4. Emails Administrativos
- Teste de configuração
- Emails personalizados
- Notificações de pedidos

## Testando a Configuração

### 1. Teste de Configuração
```bash
curl https://www.fanzone12.pt/api/test-mailgun-config
```

### 2. Teste de Envio
```bash
curl -X POST https://www.fanzone12.pt/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com"}'
```

### 3. Teste de Email de Pedido
```bash
curl -X POST https://www.fanzone12.pt/api/admin/send-test-email \
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
2. **Verificar domínio no Mailgun**
3. **Configurar registros DNS**
4. **Testar envio de emails**
5. **Monitorar entregas**

## Suporte

Para problemas com o Mailgun:
- [Documentação oficial](https://documentation.mailgun.com/)
- [Suporte técnico](https://help.mailgun.com/)
- [Status da API](https://status.mailgun.com/)

---

**Status**: ✅ Configuração atualizada para fanzone12.pt
**Email**: sales@fanzone12.com
**Domínio**: fanzone12.pt
**Data**: $(date)
**Versão**: 2.0
