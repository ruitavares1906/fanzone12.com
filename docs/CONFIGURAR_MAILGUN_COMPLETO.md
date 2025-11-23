# Configuração Completa do Mailgun - fanzone12.pt

## 🚨 Problema Atual
**Erro**: `Unauthorized` (401) - `Forbidden`
**Causa**: API Key do Mailgun não configurada ou domínio não verificado

## 🔧 Solução Passo a Passo

### **1. Criar Conta no Mailgun**

#### **1.1. Registar-se**
1. Aceder a: https://www.mailgun.com
2. Clicar em "Sign Up"
3. Preencher dados da conta
4. Verificar email

#### **1.2. Escolher Plano**
- **Plano Gratuito**: 5,000 emails/mês, 100 emails/dia
- **Plano Pago**: Emails ilimitados, suporte prioritário

### **2. Obter API Key**

#### **2.1. Aceder ao Dashboard**
1. Fazer login em: https://app.mailgun.com
2. Ir para "Settings" > "API Keys"

#### **2.2. Copiar API Key**
1. Encontrar "Private API Key"
2. Clicar em "Copy" ou "Show"
3. **IMPORTANTE**: Guardar esta chave em local seguro

### **3. Configurar Domínio**

#### **3.1. Adicionar Domínio**
1. Ir para "Sending" > "Domains"
2. Clicar em "Add New Domain"
3. Inserir: `fanzone12.pt`
4. Escolher região: **EU** (Europa)

#### **3.2. Verificar Domínio**
O Mailgun vai mostrar registros DNS que precisas de adicionar:

**Registros TXT necessários:**
```
# Verificação de domínio
TXT: v=spf1 include:mailgun.org ~all

# Verificação DKIM
TXT: k=rsa; p=YOUR_DKIM_PUBLIC_KEY
```

**Registros MX necessários:**
```
MX: 10 mxa.mailgun.org
MX: 10 mxb.mailgun.org
```

**Registro CNAME:**
```
CNAME: email.fanzone12.pt -> mailgun.org
```

### **4. Configurar Variáveis de Ambiente**

#### **4.1. Criar/Editar .env.local**
```env
# Mailgun Configuration
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=fanzone12.pt
MAILGUN_FROM_EMAIL=sales@fanzone12.com

# Outras configurações
NEXT_PUBLIC_SITE_URL=https://www.fanzone12.pt
```

#### **4.2. Verificar Formato da API Key**
- ✅ Deve começar com `key-`
- ✅ Deve ter cerca de 32 caracteres
- ✅ Exemplo: `key-1234567890abcdef1234567890abcdef`

### **5. Testar Configuração**

#### **5.1. Teste Local**
```bash
# Iniciar servidor
npm run dev

# Testar configuração
curl http://localhost:3000/api/test-mailgun-config
```

#### **5.2. Teste de Envio**
```bash
# Testar envio de email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com"}'
```

### **6. Verificar DNS**

#### **6.1. Verificar Registros**
Usar ferramentas online:
- https://dnschecker.org
- https://mxtoolbox.com

#### **6.2. Tempo de Propagação**
- **TXT records**: 5-15 minutos
- **MX records**: 15-30 minutos
- **CNAME**: 5-15 minutos

### **7. Troubleshooting**

#### **7.1. Erro 401 - Unauthorized**
```bash
# Verificar se API Key está correta
echo $MAILGUN_API_KEY

# Verificar formato
# Deve começar com "key-"
```

#### **7.2. Erro 403 - Forbidden**
- Verificar se domínio está verificado
- Verificar se registros DNS estão corretos
- Aguardar propagação DNS (até 24h)

#### **7.3. Emails não chegam**
- Verificar caixa de spam
- Verificar logs do Mailgun
- Verificar se domínio está ativo

### **8. Configuração Alternativa (SendGrid)**

Se o Mailgun não funcionar, podes usar SendGrid:

#### **8.1. Configurar SendGrid**
```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=sales@fanzone12.com
```

#### **8.2. Atualizar API de Contacto**
O sistema já suporta SendGrid como alternativa.

### **9. Verificação Final**

#### **9.1. Checklist**
- [ ] Conta Mailgun criada
- [ ] API Key copiada
- [ ] Domínio adicionado
- [ ] DNS configurado
- [ ] Variáveis de ambiente definidas
- [ ] Teste de configuração passou
- [ ] Teste de envio passou

#### **9.2. Teste Completo**
1. Ir para `/contacto`
2. Preencher formulário
3. Enviar mensagem
4. Verificar email de confirmação
5. Verificar email em `sales@fanzone12.com`

## 📞 Suporte

### **Mailgun Support**
- **Documentação**: https://documentation.mailgun.com/
- **Suporte**: https://help.mailgun.com/
- **Status**: https://status.mailgun.com/

### **Problemas Comuns**
1. **API Key incorreta**: Verificar se copiou corretamente
2. **Domínio não verificado**: Aguardar propagação DNS
3. **Registros DNS incorretos**: Verificar com ferramentas online
4. **Limite de quota**: Verificar uso no dashboard

---

**Status**: 🔧 Configuração necessária
**Próximo**: Seguir passos 1-5 para configurar Mailgun
