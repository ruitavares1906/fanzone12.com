# Configuração de Emails - Camisolas Desportivas

## Problema Identificado

Os emails de confirmação de encomenda não estão a ser enviados para os clientes. Este documento explica como configurar corretamente o sistema de emails.

## Verificação Rápida

1. Acesse `/admin/diagnostico-email` para executar diagnósticos automáticos
2. O sistema irá verificar:
   - Se a variável `SENDGRID_API_KEY` está configurada
   - Se a configuração do SendGrid está correta
   - Se consegue enviar emails de teste

## Configuração Necessária

### 1. Conta no SendGrid

1. Crie uma conta no [SendGrid](https://sendgrid.com)
2. Verifique o domínio `camisolasdesportivas.pt` ou configure um email remetente
3. Crie uma API Key com permissões de envio de email

### 2. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Site URL (usado nos templates de email)
NEXT_PUBLIC_SITE_URL=https://camisolasdesportivas.pt

# Outras variáveis necessárias...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### 3. Verificação de Email no SendGrid

**IMPORTANTE**: O email `info@camisolasdesportivas.pt` deve estar verificado no SendGrid.

#### Opção 1: Verificação de Domínio (Recomendado)
1. No dashboard do SendGrid, vá para Settings > Sender Authentication
2. Adicione o domínio `camisolasdesportivas.pt`
3. Configure os registros DNS conforme instruído

#### Opção 2: Verificação de Email Individual
1. No dashboard do SendGrid, vá para Settings > Sender Authentication
2. Clique em "Single Sender Verification"
3. Adicione `info@camisolasdesportivas.pt`
4. Verifique o email através do link enviado

## Configuração em Produção

### Vercel/Netlify
Adicione as variáveis de ambiente no dashboard da plataforma:
- `SENDGRID_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Outros Provedores
Certifique-se de que todas as variáveis de ambiente estão configuradas no ambiente de produção.

## Testes

### 1. Teste Automático
- Acesse `/admin/diagnostico-email`
- Execute os diagnósticos automáticos
- Verifique se todos os testes passam

### 2. Teste Manual
- Na mesma página, envie um email de teste para o seu próprio email
- Verifique se recebe o email

### 3. Teste de Encomenda
- Faça uma encomenda de teste usando o Stripe em modo test
- Verifique se recebe o email de confirmação

## Logs de Depuração

Os logs do sistema mostrarão informações detalhadas sobre o envio de emails:

```bash
# Logs que indicam sucesso
=== CONFIGURAÇÃO SENDGRID ===
API Key configurada: true
✅ Email para cliente enviado com sucesso
✅ ENVIO DE EMAIL DE CONFIRMAÇÃO CONCLUÍDO

# Logs que indicam problemas
❌ ERRO: SendGrid API Key não está configurada corretamente
❌ Erro no email para cliente: [detalhes do erro]
```

## Problemas Comuns

### 1. API Key não configurada
- **Sintoma**: Erro "SendGrid API Key não está configurada corretamente"
- **Solução**: Verificar se `SENDGRID_API_KEY` está definida e não é o valor padrão

### 2. Email não verificado
- **Sintoma**: Erro 403 "The from address does not match a verified Sender Identity"
- **Solução**: Verificar `info@camisolasdesportivas.pt` no SendGrid

### 3. Cota excedida
- **Sintoma**: Erro 429 ou mensagens sobre limite
- **Solução**: Verificar cota na conta do SendGrid

### 4. Ambiente de desenvolvimento
- **Sintoma**: API de teste só funciona em desenvolvimento
- **Solução**: Configurar `NODE_ENV=development` ou usar a API de produção

## Estrutura dos Emails

O sistema envia 2 emails por encomenda:

1. **Para o cliente**: Confirmação da encomenda com detalhes
2. **Para a loja**: Notificação de nova encomenda

Ambos usam templates HTML responsivos com informações completas da encomenda.

## Suporte

Se os problemas persistirem:

1. Verifique os logs da aplicação
2. Use a página de diagnóstico para identificar problemas
3. Confirme todas as configurações do SendGrid
4. Teste primeiro em ambiente de desenvolvimento

## Funcionalidades de Email Disponíveis

- ✅ Confirmação de encomenda (automático)
- ✅ Notificação de envio com tracking
- ✅ Notificações de mudança de status
- ✅ Emails de contacto
- ✅ Emails de teste para diagnóstico 