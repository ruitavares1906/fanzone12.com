# 🔧 Configuração do Postmark para camisola12

## ⚠️ MIGRAÇÃO COMPLETA DO SENDGRID PARA POSTMARK

### 📋 O que foi alterado:

1. ✅ **Instalação**: `npm install postmark`
2. ✅ **Arquivo principal**: `lib/postmark.ts` (substitui `lib/sendgrid.ts`)
3. ✅ **Webhook Stripe**: Atualizado para usar Postmark
4. ✅ **APIs admin**: Todas atualizadas para Postmark
5. ✅ **Contacto**: Formulário atualizado para Postmark
6. ✅ **Package.json**: Dependências atualizadas

### 🔑 Variáveis de Ambiente Necessárias:

No arquivo `.env.local`, **SUBSTITUA**:

```env
# ❌ REMOVER ESTAS LINHAS (SendGrid)
# SENDGRID_API_KEY=SG.xxxxxxxxx
# SENDGRID_FROM_EMAIL=geral@fanzone12.pt

# ✅ ADICIONAR ESTAS LINHAS (Postmark)
POSTMARK_API_TOKEN=your_postmark_api_token_here
POSTMARK_FROM_EMAIL=geral@fanzone12.pt
```

### 🚀 Como Obter o Token do Postmark:

1. **Criar conta** em [postmarkapp.com](https://postmarkapp.com)
2. **Verificar domínio** `fanzone12.pt`
3. **Criar API Token** com permissões de envio
4. **Copiar token** e colocar na variável `POSTMARK_API_TOKEN`

### 🧪 Testar a Configuração:

```bash
# Testar conexão Postmark
node test-postmark-connection.js

# Testar envio de email
curl -X POST http://localhost:3000/api/admin/send-test-email
```

### 📧 Funcionalidades Implementadas:

- ✅ **Confirmação de encomendas** (cliente + loja)
- ✅ **Emails de contacto** (cliente + loja)
- ✅ **Confirmação de envio** (cliente)
- ✅ **Emails de teste** (admin)
- ✅ **Tratamento de erros** robusto

### 🔍 Troubleshooting:

- **Erro 401**: Token inválido ou expirado
- **Erro 422**: Domínio não verificado
- **Emails não chegam**: Verificar configuração DNS

### 💰 Custos:

- **Gratuito**: 10.000 emails/mês
- **Pago**: $15/mês para 100.000 emails

---

**🎯 Status**: Migração completa realizada. Sistema pronto para usar Postmark.
