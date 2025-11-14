-- Script para verificar se os itens das encomendas estão a ser guardados
-- Execute este script no Supabase SQL Editor

-- 1. Verificar encomendas recentes
SELECT 
  id,
  order_number,
  created_at,
  total,
  payment_status,
  status
FROM orders 
WHERE created_at >= NOW() - INTERVAL '1 day'
ORDER BY created_at DESC
LIMIT 5;

-- 2. Verificar itens das encomendas recentes
SELECT 
  o.id as order_id,
  o.order_number,
  o.created_at,
  o.total as order_total,
  COUNT(oi.id) as item_count,
  COALESCE(SUM(oi.unit_price * oi.quantity), 0) as items_total
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.created_at >= NOW() - INTERVAL '1 day'
GROUP BY o.id, o.order_number, o.created_at, o.total
ORDER BY o.created_at DESC;

-- 3. Verificar detalhes dos itens de uma encomenda específica
-- (Substitua 'ORDER_ID_AQUI' pelo ID real de uma encomenda recente)
/*
SELECT 
  oi.id,
  oi.product_name,
  oi.unit_price,
  oi.quantity,
  oi.size,
  oi.customization,
  oi.is_personalized,
  oi.created_at
FROM order_items oi
WHERE oi.order_id = 'ORDER_ID_AQUI'
ORDER BY oi.created_at;
*/

-- 4. Verificar se há itens com problemas
SELECT 
  'Itens sem nome' as problema,
  COUNT(*) as quantidade
FROM order_items 
WHERE product_name IS NULL OR product_name = '';

SELECT 
  'Itens com preço zero' as problema,
  COUNT(*) as quantidade
FROM order_items 
WHERE unit_price = 0 OR unit_price IS NULL;

-- 5. Verificar estrutura da tabela order_items
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;

-- 6. Verificar se a tabela order_items existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'order_items'
) as table_exists;
