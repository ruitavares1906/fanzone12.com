-- Script para verificar e corrigir dados dos itens de pedidos
-- Execute este script no Supabase SQL Editor

-- 1. Verificar pedidos recentes com problemas
SELECT 
  o.order_number,
  o.created_at,
  oi.product_name,
  oi.unit_price,
  oi.quantity,
  oi.size,
  oi.customization
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY o.created_at DESC
LIMIT 20;

-- 2. Verificar itens com preço 0
SELECT 
  o.order_number,
  oi.product_name,
  oi.unit_price,
  oi.quantity,
  o.created_at
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE oi.unit_price = 0
AND o.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY o.created_at DESC;

-- 3. Verificar itens sem nome do produto
SELECT 
  o.order_number,
  oi.product_name,
  oi.unit_price,
  oi.quantity,
  o.created_at
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE (oi.product_name IS NULL OR oi.product_name = '' OR oi.product_name = 'Produto')
AND o.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY o.created_at DESC;

-- 4. Estatísticas dos pedidos recentes
SELECT 
  COUNT(*) as total_orders,
  COUNT(CASE WHEN oi.unit_price = 0 THEN 1 END) as items_with_zero_price,
  COUNT(CASE WHEN oi.product_name IS NULL OR oi.product_name = '' THEN 1 END) as items_without_name,
  AVG(oi.unit_price) as avg_unit_price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.created_at >= NOW() - INTERVAL '24 hours';

-- 5. Se necessário, corrigir dados (CUIDADO: só executar se confirmado)
-- UPDATE order_items 
-- SET product_name = 'Produto Corrigido'
-- WHERE product_name IS NULL OR product_name = '';

-- 6. Verificar estrutura da tabela order_items
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' AND table_schema = 'public'
ORDER BY ordinal_position;
