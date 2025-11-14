# Verificar Domínio no Mailgun - fanzone12.pt

## ✅ DNS Records Configurados Corretamente

Vejo que já tens os registros DNS necessários:

### **Registros Mailgun Configurados:**
- ✅ **SPF**: `v=spf1 include:zohomail.eu include:mailgun.org ~all`
- ✅ **CNAME**: `email` → `mailgun.org`
- ✅ **DKIM**: `s1._domainkey` com chave pública

## 🔧 Próximos Passos

### **1. Verificar Domínio no Mailgun**

#### **1.1. Aceder ao Dashboard**
1. Ir para: https://app.mailgun.com
2. Fazer login na conta
3. Ir para "Sending" > "Domains"

#### **1.2. Adicionar Domínio**
1. Clicar em "Add New Domain"
2. Inserir: `fanzone12.pt`
3. Escolher região: **EU** (Europa)
4. Clicar em "Add Domain"

#### **1.3. Verificar Status**
O Mailgun vai mostrar:
- ✅ **DNS Records**: Já configurados
- ⏳ **Verification**: Em progresso
- ✅ **Status**: Deve mudar para "Active"

### **2. Verificar API Key**

#### **2.1. Obter API Key Correta**
1. Ir para "Settings" > "API Keys"
2. Verificar se a API Key está ativa
3. Se necessário, gerar nova API Key
4. Copiar a nova API Key

#### **2.2. Atualizar .env.local**
```env
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=fanzone12.pt
MAILGUN_FROM_EMAIL=geral@fanzone12.pt
```

### **3. Testar Configuração**

#### **3.1. Teste Local**
```bash
# Iniciar servidor
npm run dev

# Testar configuração
curl http://localhost:3000/api/test-mailgun-config
```

#### **3.2. Teste de Envio**
```bash
# Testar envio de email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com"}'
```

## 🚨 Possíveis Problemas

### **1. Domínio Não Verificado**
- **Sintoma**: Erro 401 Unauthorized
- **Solução**: Aguardar verificação DNS (5-15 minutos)

### **2. API Key Incorreta**
- **Sintoma**: Erro 401 Unauthorized
- **Solução**: Verificar API Key no dashboard

### **3. Região Incorreta**
- **Sintoma**: Erro 401 Unauthorized
- **Solução**: Usar região EU (Europa)

## 📊 Status dos DNS Records

### **✅ Configurados Corretamente:**
- ✅ **SPF**: Inclui `mailgun.org`
- ✅ **CNAME**: `email` aponta para `mailgun.org`
- ✅ **DKIM**: Chave pública configurada

### **⏳ Aguardando:**
- ⏳ **Verificação**: Mailgun deve verificar os registros
- ⏳ **Status**: Deve mudar para "Active"

## 🧪 Teste Completo

### **1. Verificar Status no Mailgun**
1. Ir para "Sending" > "Domains"
2. Clicar em `fanzone12.pt`
3. Verificar se status é "Active"
4. Se não, aguardar verificação

### **2. Testar API**
```bash
# Testar configuração
curl http://localhost:3000/api/test-mailgun-config

# Deve retornar:
# {
#   "success": true,
#   "message": "Configuração do Mailgun está funcionando!"
# }
```

### **3. Testar Formulário**
1. Ir para `/contacto`
2. Preencher formulário
3. Enviar mensagem
4. Verificar emails recebidos

## 🔧 Troubleshooting

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

---

**Status**: 🔧 Domínio precisa ser verificado no Mailgun
**Próximo**: Adicionar domínio no Mailgun e aguardar verificação
