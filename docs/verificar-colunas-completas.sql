-- Script para verificar se todas as colunas necessárias existem

-- Verificar estrutura completa da tabela orders
SELECT 
    'ORDERS' as tabela,
    column_name as coluna,
    data_type as tipo,
    column_default as valor_padrao,
    is_nullable as pode_ser_null
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'orders'
ORDER BY column_name;

-- Verificar estrutura completa da tabela order_items
SELECT 
    'ORDER_ITEMS' as tabela,
    column_name as coluna,
    data_type as tipo,
    column_default as valor_padrao,
    is_nullable as pode_ser_null
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'order_items'
ORDER BY column_name;

-- Verificar especificamente as colunas que a API usa
SELECT 'COLUNAS CRÍTICAS ORDERS' as status;
SELECT column_name 
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'orders'
  AND column_name IN (
    'order_number', 'customer_name', 'customer_email', 'customer_phone',
    'shipping_address', 'subtotal', 'shipping_cost', 'total_amount',
    'payment_method', 'payment_status', 'upfront_payment', 'remaining_payment',
    'cash_on_delivery_fee', 'discount_code', 'discount_amount', 'status'
  )
ORDER BY column_name;

SELECT 'COLUNAS CRÍTICAS ORDER_ITEMS' as status;
SELECT column_name 
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'order_items'
  AND column_name IN (
    'order_id', 'product_id', 'product_name', 'quantity', 'unit_price',
    'total_price', 'size', 'customization', 'is_personalized'
  )
ORDER BY column_name;
