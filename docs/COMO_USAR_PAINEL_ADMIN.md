# 🎯 Como Usar o Painel Admin - Guia Prático

## 🚀 Acesso Rápido gg

### 📋 **Listar Encomendas**
```
http://localhost:3000/admin/encomendas
```

### 🔧 **Diagnóstico de Email**
```
http://localhost:3000/admin/diagnostico-email
```

---

## 📋 Gestão de Encomendas

### 1️⃣ **Ver Todas as Encomendas**
1. Acesse `/admin/encomendas`
2. Verá lista com todas as encomendas
3. Use filtros para pesquisar:
   - **Pesquisar**: Por número, email, ID
   - **Status**: Pendente, Processamento, Enviado, etc.
   - **Pagamento**: Pendente, Pago, Falhou, etc.

### 2️⃣ **Criar Encomenda de Teste**
- **Botão "Criar Teste"** no topo da página
- Cria automaticamente uma encomenda completa
- Aparece imediatamente na lista
- Útil para testar o sistema

### 3️⃣ **Ver Detalhes da Encomenda**
- Clique no ícone **👁️** ao lado da encomenda
- Verá página completa com:
  - ✅ **Informações do cliente** (nome, email, telefone)
  - ✅ **Morada de entrega** formatada
  - ✅ **Produtos** (nome, tamanho, quantidade, personalização)
  - ✅ **Valores** (subtotal, envio, total)
  - ✅ **Gestão de tracking**

---

## 📦 Gestão de Envios

### 🚚 **Adicionar Tracking**
1. Na página de detalhes da encomenda
2. Secção **"Informações de Envio e Rastreio"** (azul)
3. Preencher:
   - **Número de rastreio** (ex: RR123456789PT)
   - **Método de envio** (CTT, CTT Expresso, etc.)
   - **Data estimada de entrega**
4. Clique **"Salvar Informações de Envio"**

### 📧 **Enviar Email de Tracking**
1. Após adicionar tracking
2. Clique **"Enviar Email de Rastreio ao Cliente"**
3. Cliente recebe email com:
   - Link direto para tracking CTT
   - Data estimada de entrega
   - Informações da encomenda

---

## ⚡ Ações de Status

### 🔄 **Mudar Status da Encomenda**
Na página de detalhes, use os botões:

- **🔄 Em Processamento** - Quando começar a preparar
- **🚚 Enviado** - Quando enviar (requer tracking)
- **✅ Entregue** - Quando confirmar entrega
- **❌ Cancelar** - Para cancelar encomenda

**💡 Dica**: Cliente recebe email automático quando muda status!

---

## 📧 Sistema de Emails

### 📬 **Tipos de Email Disponíveis**
1. **Reenviar Confirmação**
   - Reenvia email original da encomenda
   - Inclui morada e produtos completos
   
2. **Email de Tracking**
   - Só disponível se status = "Enviado" + tracking
   - Link direto para CTT
   
3. **Mensagem Personalizada**
   - Email customizado para o cliente
   - Digite sua mensagem
   - Template profissional

### 🔧 **Como Enviar Emails**
1. Na página de detalhes da encomenda
2. Secção **"Ações de Email"** (lateral direita)
3. Clique no botão desejado
4. Para mensagem personalizada: digite no popup

---

## 🔍 Diagnóstico e Debug

### 🩺 **Verificar Estado do Sistema**
1. Acesse `/admin/diagnostico-email`
2. Clique **"Executar Diagnóstico"**
3. Verá:
   - ✅ Estado da configuração SendGrid
   - ✅ Conectividade com email
   - ✅ Variáveis de ambiente
   - ✅ Webhooks do Stripe

### 📧 **Testar Emails**
1. Na página de diagnóstico
2. Digite um email de teste
3. Escolha:
   - **Email simples** - Teste básico
   - **Email de encomenda** - Com morada e produtos

### 🔍 **Debug de Encomendas**
- Na lista de encomendas verá **informações debug**
- Mostra total de encomendas na base de dados
- Lista últimas encomendas encontradas
- Útil para identificar problemas

---

## 🎯 Workflow Típico

### 📋 **Processo Completo de Uma Encomenda**

1. **🛒 Encomenda Criada**
   - Cliente faz encomenda no site
   - Email automático enviado (confirmação)
   - Aparece na lista admin como "Pendente"

2. **🔄 Processar Encomenda**
   - Clique "Em Processamento"
   - Cliente recebe notificação
   - Prepare os produtos

3. **📦 Adicionar Tracking**
   - Quando enviar pelos CTT
   - Adicione número de tracking
   - Selecione "CTT" como método

4. **🚚 Marcar como Enviado**
   - Clique "Enviado"
   - Email de tracking enviado automaticamente
   - Cliente pode rastrear no CTT

5. **✅ Confirmar Entrega**
   - Quando cliente confirmar recebimento
   - Clique "Entregue"
   - Processo completo!

---

## 💡 Dicas Úteis

### ⚡ **Ações Rápidas**
- **F5** - Atualizar lista de encomendas
- **Botão Atualizar** - Recarregar dados
- **Filtros** - Usar para encontrar encomendas específicas

### 🔍 **Pesquisa Eficiente**
- Pesquise por:
  - Nome do cliente
  - Email
  - Número da encomenda
  - ID da encomenda
  - Número de tracking

### 📧 **Emails Seguros**
- Todos os emails têm template profissional
- Incluem informações da loja
- Links funcionais para site e contacto
- Referência sempre à encomenda específica

### 🛠️ **Resolução de Problemas**
1. **Encomenda não aparece**: Use botão "Criar Teste"
2. **Email não funciona**: Acesse diagnóstico
3. **Tracking não funciona**: Verifique formato CTT
4. **Erro geral**: Verifique logs do servidor

---

## 🎉 Funcionalidades Principais

✅ **Ver todas as encomendas** com filtros  
✅ **Detalhes completos** (cliente, morada, produtos)  
✅ **Gestão de tracking CTT** com links diretos  
✅ **Envio de emails** (confirmação, tracking, personalizado)  
✅ **Mudança de status** com notificações automáticas  
✅ **Criação de encomendas teste** para debug  
✅ **Sistema de diagnóstico** integrado  

**🚀 O painel está completo e pronto para usar!** 