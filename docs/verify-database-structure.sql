-- SQL para verificar se a estrutura da base de dados está correta
-- Execute este script para validar que tudo está funcionando

-- 1. Verificar estrutura da tabela orders
SELECT 
  'orders' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar estrutura da tabela order_items
SELECT 
  'order_items' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar se existem pedidos na base de dados
SELECT 
  COUNT(*) as total_orders,
  COUNT(CASE WHEN is_upfront_payment = TRUE THEN 1 END) as upfront_payments,
  COUNT(CASE WHEN is_upfront_payment = FALSE THEN 1 END) as full_payments,
  COUNT(CASE WHEN payment_method = 'cash_on_delivery' THEN 1 END) as cash_on_delivery,
  COUNT(CASE WHEN payment_method = 'online' THEN 1 END) as online_payments
FROM orders;

-- 4. Verificar se existem itens de pedidos
SELECT 
  COUNT(*) as total_order_items,
  COUNT(CASE WHEN is_personalized = TRUE THEN 1 END) as personalized_items,
  COUNT(CASE WHEN customization IS NOT NULL THEN 1 END) as items_with_customization
FROM order_items;

-- 5. Verificar pedidos recentes (últimos 7 dias)
SELECT 
  order_number,
  customer_name,
  customer_email,
  payment_method,
  is_upfront_payment,
  total_amount,
  upfront_payment,
  remaining_payment,
  created_at
FROM orders 
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 10;

-- 6. Verificar itens de pedidos recentes
SELECT 
  oi.product_name,
  oi.unit_price,
  oi.quantity,
  oi.size,
  oi.customization,
  oi.is_personalized,
  o.order_number,
  o.customer_name
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.created_at >= NOW() - INTERVAL '7 days'
ORDER BY o.created_at DESC
LIMIT 10;

-- 7. Verificar se há problemas na estrutura
SELECT 
  'Verificações de integridade' as check_type,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ Nenhum pedido encontrado'
    ELSE '✅ Pedidos encontrados: ' || COUNT(*)::text
  END as result
FROM orders

UNION ALL

SELECT 
  'Verificações de integridade' as check_type,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ Nenhum item de pedido encontrado'
    ELSE '✅ Itens de pedido encontrados: ' || COUNT(*)::text
  END as result
FROM order_items

UNION ALL

SELECT 
  'Verificações de integridade' as check_type,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ Nenhum pedido com pagamento antecipado'
    ELSE '✅ Pedidos com pagamento antecipado: ' || COUNT(*)::text
  END as result
FROM orders 
WHERE is_upfront_payment = TRUE;
