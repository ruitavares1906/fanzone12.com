# Solução Final para o Problema de Email

## 🚨 Problema Atual
**Erro**: `Unauthorized` (401) - `Forbidden` no Mailgun
**Causa**: Domínio `fanzone12.pt` não está configurado no Mailgun

## ✅ Soluções Implementadas

### **1. API de Contacto Atualizada**
- ✅ **Fallback automático**: Mailgun → SendGrid
- ✅ **Logs detalhados**: Para debug
- ✅ **Mensagens de erro**: Mais informativas

### **2. Sistema de Fallback**
```typescript
// Tenta Mailgun primeiro
if (MAILGUN_API_KEY && MAILGUN_DOMAIN) {
  // Enviar via Mailgun
}

// Se falhar, tenta SendGrid
if (!emailSent && SENDGRID_API_KEY) {
  // Enviar via SendGrid
}
```

## 🔧 Soluções Imediatas

### **Opção 1: Configurar Mailgun Corretamente**

#### **1.1. Aceder ao Mailgun**
1. Ir para: https://app.mailgun.com
2. Fazer login
3. Verificar se a conta está ativa

#### **1.2. Adicionar Domínio**
1. "Sending" > "Domains"
2. "Add New Domain"
3. Inserir: `fanzone12.pt`
4. Região: **EU** (Europa)
5. "Add Domain"

#### **1.3. Verificar API Key**
1. "Settings" > "API Keys"
2. Verificar se está ativa
3. Se necessário, gerar nova API Key
4. Atualizar `.env.local`

#### **1.4. Configurar DNS**
Adicionar estes registros DNS:
```
TXT: v=spf1 include:mailgun.org ~all
TXT: k=rsa; p=YOUR_DKIM_PUBLIC_KEY
MX: 10 mxa.mailgun.org
MX: 10 mxb.mailgun.org
CNAME: email.fanzone12.pt -> mailgun.org
```

### **Opção 2: Usar SendGrid (Recomendado)**

#### **2.1. Configurar SendGrid**
1. Aceder a: https://app.sendgrid.com
2. Criar conta gratuita
3. "Settings" > "API Keys"
4. "Create API Key"
5. Copiar a API Key

#### **2.2. Atualizar .env.local**
```env
# Comentar Mailgun (problema atual)
# MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# MAILGUN_DOMAIN=fanzone12.pt
# MAILGUN_FROM_EMAIL=geral@fanzone12.pt

# Ativar SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=geral@fanzone12.pt
```

#### **2.3. Instalar SendGrid**
```bash
npm install @sendgrid/mail
```

### **Opção 3: Usar Domínio de Teste**

#### **3.1. Usar Sandbox do Mailgun**
```env
MAILGUN_DOMAIN=sandbox-123.mailgun.org
MAILGUN_FROM_EMAIL=postmaster@sandbox-123.mailgun.org
```

#### **3.2. Limitação**
- Só funciona para emails verificados
- Bom para testes

## 🧪 Como Testar

### **1. Teste Local**
```bash
# Iniciar servidor
npm run dev

# Testar formulário
# Ir para http://localhost:3000/contacto
# Preencher e enviar
```

### **2. Verificar Logs**
```bash
# Verificar console do servidor
# Deve mostrar:
# 📧 Tentando enviar via Mailgun...
# ❌ Erro no Mailgun: [erro]
# 📧 Tentando enviar via SendGrid...
# ✅ Emails enviados via SendGrid
```

### **3. Teste de Configuração**
```bash
# Testar Mailgun
curl http://localhost:3000/api/test-mailgun-config

# Testar SendGrid
curl http://localhost:3000/api/test-email
```

## 📊 Status Atual

### **✅ Implementado**
- ✅ API com fallback Mailgun → SendGrid
- ✅ Logs detalhados para debug
- ✅ Mensagens de erro informativas
- ✅ Suporte a ambos os serviços

### **🔧 Próximo Passo**
**Escolher uma opção:**
1. **Configurar Mailgun** (mais trabalho, mas domínio próprio)
2. **Usar SendGrid** (mais fácil, funciona imediatamente)
3. **Usar sandbox** (só para testes)

## 🚀 Recomendação

**Para resolver rapidamente:**
1. **Usar SendGrid** (Opção 2)
2. **Instalar**: `npm install @sendgrid/mail`
3. **Configurar**: API Key do SendGrid
4. **Testar**: Formulário de contacto

**Para produção:**
1. **Configurar Mailgun** (Opção 1)
2. **Verificar domínio** no Mailgun
3. **Configurar DNS** corretamente
4. **Testar** envio de emails

---

**Status**: 🔧 Configuração necessária
**Próximo**: Escolher e configurar serviço de email
