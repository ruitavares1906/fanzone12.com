# Configuração da Candidatura de Parceiros

## 📋 Alterações Realizadas

### 1. **Formulário Atualizado**
- ✅ Removido: Taxa de engajamento
- ✅ Adicionado: Visualizações médias por vídeo/reels
- ✅ Validação: Mínimo 5.000 seguidores
- ✅ Integração: API route para processamento

### 2. **API Route Criada**
- 📁 `app/api/candidatura-parceiro/route.ts`
- 🔧 Processamento de dados
- 📧 Envio de email via Mailgun
- 💾 Inserção na base de dados

### 3. **Base de Dados**
- 📁 `database/candidaturas_parceiros.sql`
- 🗄️ Tabela completa com triggers
- 📊 Views para estatísticas
- 🔍 Índices para performance

## 🚀 Configuração Necessária

### 1. **Variáveis de Ambiente**
Adicione ao seu `.env.local`:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/fanzone12

# Mailgun Configuration
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=your_mailgun_domain_here
MAILGUN_FROM=noreply@fanzone12.pt
ADMIN_EMAIL=sales@fanzone12.com
```

### 2. **Base de Dados**
Execute o SQL em `database/candidaturas_parceiros.sql`:

```bash
psql -d your_database -f database/candidaturas_parceiros.sql
```

### 3. **Dependências**
Já instaladas automaticamente:
- `pg` - Cliente PostgreSQL
- `@types/pg` - Tipos TypeScript

## 📧 Funcionalidades do Email

### **Email de Notificação**
- **Para:** Email configurado em `ADMIN_EMAIL`
- **Assunto:** "Nova Candidatura de Parceiro - [Nome]"
- **Conteúdo:** Todos os dados da candidatura formatados

### **Dados Incluídos:**
- ✅ Informações pessoais (nome, email, telefone)
- ✅ Redes sociais (Instagram, TikTok)
- ✅ Métricas (seguidores, visualizações)
- ✅ Experiência e motivação
- ✅ ID da candidatura para referência

## 🗄️ Estrutura da Base de Dados

### **Tabela Principal:**
```sql
candidaturas_parceiros (
  id, nome, email, telefone,
  instagram, tiktok, seguidores, visualizacoes,
  experiencia, motivacao, status, data_candidatura
)
```

### **Status Possíveis:**
- `pendente` - Aguardando análise
- `em_analise` - Em análise
- `aprovada` - Aprovada
- `rejeitada` - Rejeitada

### **Funcionalidades Extras:**
- 🔄 Triggers para atualização automática
- 📊 Views para estatísticas
- 📝 Histórico de mudanças de status
- 🔍 Índices para performance

## 🎯 Como Testar

1. **Acesse:** `/candidatura-parceiro`
2. **Preencha:** Formulário completo
3. **Submeta:** Candidatura
4. **Verifique:** Email recebido
5. **Confirme:** Dados na base de dados

## 🔧 Troubleshooting

### **Erro de Conexão DB:**
- Verifique `DATABASE_URL`
- Confirme que PostgreSQL está rodando
- Execute o SQL de criação das tabelas

### **Erro de Email:**
- Verifique `MAILGUN_API_KEY`
- Confirme `MAILGUN_DOMAIN`
- Teste com email válido

### **Erro de Validação:**
- Mínimo 5.000 seguidores
- Pelo menos uma rede social
- Campos obrigatórios preenchidos

## 📱 URLs Importantes

- **Candidatura:** `/candidatura-parceiro`
- **Informações:** `/info-parceiros`
- **API:** `/api/candidatura-parceiro`

---

✅ **Sistema completo e funcional!** 🚀
