# 🚀 Configuração do Postmark para camisola12

## 📋 O que é o Postmark?

O **Postmark** é um serviço de email transacional especializado em **deliverability** (entrega de emails). É uma excelente alternativa ao SendGrid com:

- ✅ **10.000 emails gratuitos por mês** (vs 100 do SendGrid)
- ✅ **Melhor deliverability** (maior taxa de entrega)
- ✅ **Interface mais simples** e intuitiva
- ✅ **Suporte técnico** superior

## 🔧 Passos para Configurar

### 1. Criar Conta no Postmark
1. Aceda a [postmarkapp.com](https://postmarkapp.com)
2. Clique em **"Get Started Free"**
3. Crie uma conta gratuita

### 2. Configurar Domínio
1. No dashboard, clique em **"Sending Domains"**
2. Clique em **"Add Domain"**
3. Adicione: `fanzone12.pt`
4. Siga as instruções para verificar o domínio

### 3. Obter API Token
1. Vá para **"API Tokens"**
2. Clique em **"Create Token"**
3. Nome: `camisola12-production`
4. Permissões: **"Send emails"**
5. Copie o token gerado

### 4. Atualizar Variáveis de Ambiente

No arquivo `.env.local`, substitua:

```env
# ❌ REMOVER (SendGrid)
# SENDGRID_API_KEY=SG.xxxxxxxxx
# SENDGRID_FROM_EMAIL=sales@fanzone12.com

# ✅ ADICIONAR (Postmark)
POSTMARK_API_TOKEN=your_postmark_api_token_here
POSTMARK_FROM_EMAIL=sales@fanzone12.com
```

### 5. Verificar Configuração

Após configurar, teste com:

```bash
curl -X POST http://localhost:3000/api/admin/send-test-email
```

## 📧 Estrutura dos Emails

### Emails de Encomenda
- **Cliente**: Confirmação de pedido
- **Loja**: Notificação de nova encomenda

### Emails de Contacto
- **Cliente**: Confirmação de mensagem
- **Loja**: Notificação de novo contacto

### Emails de Envio
- **Cliente**: Confirmação de envio

## 🔍 Troubleshooting

### Erro: "Unauthorized"
- Verificar se o `POSTMARK_API_TOKEN` está correto
- Confirmar se o domínio está verificado

### Erro: "Domain not verified"
- Completar a verificação do domínio no Postmark
- Aguardar propagação DNS (pode demorar até 24h)

### Emails não chegam
- Verificar pasta de spam
- Confirmar configurações de DNS
- Contactar suporte Postmark se necessário

## 📊 Monitorização

No dashboard Postmark pode ver:
- ✅ Taxa de entrega
- ❌ Bounces e rejeições
- 📈 Estatísticas de envio
- 🔍 Logs detalhados

## 💰 Custos

- **Gratuito**: 10.000 emails/mês
- **Pago**: $15/mês para 100.000 emails
- **Sem custos ocultos** ou taxas de setup

## 🎯 Vantagens vs SendGrid

| Funcionalidade | SendGrid | Postmark |
|----------------|----------|----------|
| Emails gratuitos | 100/dia | 10.000/mês |
| Deliverability | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Interface | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Suporte | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Preço | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

**✅ Recomendação**: O Postmark é a escolha ideal para camisola12, oferecendo mais emails gratuitos e melhor qualidade de entrega.
