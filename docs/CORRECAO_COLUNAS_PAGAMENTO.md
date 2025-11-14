# ✅ Correção das Colunas de Pagamento à Cobrança

## **🐛 Problema Identificado:**
- **Erro**: "Could not find the 'cash_on_delivery_fee' column of 'orders' in the schema cache"
- **Causa**: Colunas necessárias para pagamento à cobrança não existem na tabela `orders`

## **🔧 Solução:**

### **1. Executar Script SQL**
Execute o ficheiro `add-cash-on-delivery-columns.sql` no Supabase SQL Editor:

```sql
-- Este script adiciona as colunas necessárias:
- cash_on_delivery_fee (DECIMAL) - Taxa de 8€
- upfront_payment (DECIMAL) - Pagamento antecipado
- remaining_payment (DECIMAL) - Valor restante
- payment_method (VARCHAR) - Método de pagamento
- payment_status (VARCHAR) - Status do pagamento
```

### **2. Verificar Colunas**
Execute `verificar-colunas-pagamento.sql` para confirmar que as colunas foram adicionadas.

### **3. Colunas Adicionadas:**
- ✅ `cash_on_delivery_fee` - Taxa adicional de 8€
- ✅ `upfront_payment` - Valor pago antecipadamente
- ✅ `remaining_payment` - Valor restante à cobrança
- ✅ `payment_method` - 'online' ou 'cash_on_delivery'
- ✅ `payment_status` - 'pending', 'paid', 'partial', 'failed'

## **📋 Instruções:**

1. **Abrir Supabase Dashboard**
2. **Ir para SQL Editor**
3. **Executar** `add-cash-on-delivery-columns.sql`
4. **Verificar** com `verificar-colunas-pagamento.sql`
5. **Testar** o pagamento à cobrança no carrinho

## **🎯 Resultado Esperado:**
- ✅ Colunas adicionadas à tabela `orders`
- ✅ API de pagamento à cobrança funcionando
- ✅ Emails enviados corretamente
- ✅ Sistema completo operacional

---

**Status**: ⏳ **Aguardando execução do SQL**
**Próximo passo**: Executar o script SQL no Supabase
