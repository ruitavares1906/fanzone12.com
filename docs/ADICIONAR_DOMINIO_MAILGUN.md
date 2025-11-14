# Adicionar Domínio no Mailgun - Passo a Passo

## 🚨 Problema Identificado
**Erro**: `Not Found` - Domínio `fanzone12.pt` não existe no Mailgun
**Solução**: Adicionar domínio no dashboard do Mailgun

## 🔧 Solução Passo a Passo

### **1. Aceder ao Dashboard do Mailgun**

#### **1.1. Fazer Login**
1. Ir para: https://app.mailgun.com
2. Fazer login na conta
3. Verificar se a conta está ativa

#### **1.2. Verificar Conta**
- ✅ Conta deve estar ativa
- ✅ Deve ter créditos disponíveis
- ✅ Região deve ser **EU** (Europa)

### **2. Adicionar Domínio**

#### **2.1. Navegar para Domínios**
1. No menu lateral, clicar em **"Sending"**
2. Clicar em **"Domains"**
3. Clicar em **"Add New Domain"**

#### **2.2. Configurar Domínio**
1. **Domain Name**: `fanzone12.pt`
2. **Region**: **EU** (Europa) ⚠️ **IMPORTANTE**
3. **Type**: **Production** (para emails reais)
4. Clicar em **"Add Domain"**

#### **2.3. Verificar Status**
O Mailgun vai mostrar:
- ✅ **Domain Added**: Domínio adicionado
- ⏳ **DNS Verification**: Em progresso
- 📋 **DNS Records**: Lista de registros necessários

### **3. Verificar DNS Records**

#### **3.1. Registros Necessários**
O Mailgun vai mostrar estes registros:

**TXT Records:**
```
Name: fanzone12.pt
Type: TXT
Value: v=spf1 include:mailgun.org ~all
```

**MX Records:**
```
Name: fanzone12.pt
Type: MX
Value: mxa.mailgun.org
Priority: 10

Name: fanzone12.pt
Type: MX
Value: mxb.mailgun.org
Priority: 10
```

**CNAME Record:**
```
Name: email.fanzone12.pt
Type: CNAME
Value: mailgun.org
```

#### **3.2. Verificar se Já Estão Configurados**
✅ **SPF**: `v=spf1 include:zohomail.eu include:mailgun.org ~all` (já configurado)
✅ **CNAME**: `email` → `mailgun.org` (já configurado)
❌ **MX**: Precisa adicionar registros MX do Mailgun

### **4. Adicionar Registros MX**

#### **4.1. Adicionar MX Records**
Adicionar estes registros MX:

```
Name: fanzone12.pt
Type: MX
Value: mxa.mailgun.org
Priority: 10
TTL: 60

Name: fanzone12.pt
Type: MX
Value: mxb.mailgun.org
Priority: 10
TTL: 60
```

#### **4.2. Manter Registros Existentes**
- ✅ **Zoho MX**: Manter para emails existentes
- ✅ **Mailgun MX**: Adicionar para novos emails
- ✅ **SPF**: Já inclui `mailgun.org`

### **5. Aguardar Verificação**

#### **5.1. Tempo de Propagação**
- **MX Records**: 15-30 minutos
- **Verificação**: 5-15 minutos
- **Total**: Até 1 hora

#### **5.2. Verificar Status**
1. Voltar ao dashboard do Mailgun
2. Clicar em `fanzone12.pt`
3. Verificar se status é **"Active"**
4. Se não, aguardar mais tempo

### **6. Testar Configuração**

#### **6.1. Teste Local**
```bash
# Iniciar servidor
npm run dev

# Testar configuração
curl http://localhost:3000/api/test-mailgun-config
```

#### **6.2. Teste de Envio**
```bash
# Testar envio de email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com"}'
```

#### **6.3. Teste do Formulário**
1. Ir para `/contacto`
2. Preencher formulário
3. Enviar mensagem
4. Verificar emails recebidos

## 🚨 Troubleshooting

### **Se ainda der erro 401:**
1. **Verificar API Key**: Deve começar com `key-`
2. **Verificar domínio**: Deve estar "Active" no Mailgun
3. **Aguardar**: Verificação DNS pode demorar até 24h
4. **Contactar suporte**: Se persistir o problema

### **Se emails não chegam:**
1. **Verificar spam**: Caixa de spam
2. **Verificar logs**: Console do servidor
3. **Verificar Mailgun**: Dashboard > Logs
4. **Testar com email diferente**: Gmail, Outlook, etc.

## 📊 Status Atual

### **✅ DNS Records Configurados:**
- ✅ **SPF**: Inclui `mailgun.org`
- ✅ **CNAME**: `email` aponta para `mailgun.org`
- ✅ **DKIM**: Chave pública configurada

### **❌ Falta:**
- ❌ **Domínio no Mailgun**: Não adicionado
- ❌ **MX Records**: Precisa adicionar
- ❌ **Verificação**: Aguardar verificação

## 🚀 Próximos Passos

1. **Adicionar domínio** no Mailgun
2. **Adicionar MX records** no DNS
3. **Aguardar verificação** (5-15 minutos)
4. **Testar envio** de emails
5. **Verificar receção** de emails

---

**Status**: 🔧 Domínio precisa ser adicionado no Mailgun
**Próximo**: Seguir passos 1-6 para configurar completamente
