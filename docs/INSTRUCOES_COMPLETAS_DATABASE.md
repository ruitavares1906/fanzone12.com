# 🗄️ Instruções Completas para Corrigir a Base de Dados

## ❌ Problemas Identificados

O sistema de pagamento à cobrança está a falhar porque faltam várias colunas nas tabelas `orders` e `order_items`:

### Tabela `orders` - Colunas em falta:
- `total_amount` - Valor total do pedido
- `shipping_address` - Endereço de envio (JSON)
- `shipping_cost` - Custo de envio
- `subtotal` - Subtotal antes de descontos
- `cash_on_delivery_fee` - Taxa de pagamento à cobrança (8€)
- `upfront_payment` - Valor pago antecipadamente
- `remaining_payment` - Valor restante à cobrança
- `payment_method` - Método de pagamento
- `payment_status` - Status do pagamento
- `discount_code` - Código de desconto
- `discount_amount` - Valor do desconto
- `order_items` - Itens do pedido (JSON)
- `customer_phone` - Telefone do cliente

### Tabela `order_items` - Colunas em falta:
- `is_personalized` - Se o item tem personalização
- `customization` - Detalhes da personalização (JSON)
- `size` - Tamanho do produto
- `unit_price` - Preço unitário
- `total_price` - Preço total
- `product_name` - Nome do produto

## 🚀 Solução Completa

### Passo 1: Executar Script Principal
1. Vá ao **Supabase Dashboard** → **SQL Editor**
2. Execute o ficheiro: `fix-all-database-columns.sql`
3. Este script adiciona TODAS as colunas necessárias

### Passo 2: Verificar se Funcionou
1. Execute o ficheiro: `verificar-colunas-completas.sql`
2. Confirme que todas as colunas foram criadas

### Passo 3: Testar o Sistema
1. Vá ao carrinho no site
2. Selecione "Pagamento à Cobrança"
3. Complete um pedido de teste
4. Verifique se não há mais erros

## 📋 Ficheiros Criados

1. **`fix-all-database-columns.sql`** - Script principal que adiciona todas as colunas
2. **`verificar-colunas-completas.sql`** - Script para verificar se tudo foi criado
3. **`INSTRUCOES_COMPLETAS_DATABASE.md`** - Este documento com instruções

## ⚠️ Importante

- Execute os scripts na ordem indicada
- Não execute scripts parciais - use sempre o script completo
- Após executar, teste imediatamente o sistema
- Se houver erros, verifique os logs do Supabase

## 🔧 Troubleshooting

Se ainda houver erros após executar os scripts:

1. **Verifique os logs do Supabase** para ver que colunas ainda faltam
2. **Execute o script de verificação** para confirmar o estado atual
3. **Contacte o suporte** se os problemas persistirem

## ✅ Resultado Esperado

Após executar os scripts:
- ✅ Sistema de pagamento à cobrança funciona
- ✅ Não há mais erros de colunas em falta
- ✅ Pedidos são criados com sucesso
- ✅ Emails de confirmação são enviados
