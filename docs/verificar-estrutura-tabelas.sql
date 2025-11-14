-- Verificar estrutura da tabela orders
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Verificar estrutura da tabela order_items
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;

-- Verificar se existem pedidos
SELECT COUNT(*) as total_orders FROM orders;

-- Verificar se existem itens de pedidos
SELECT COUNT(*) as total_order_items FROM order_items;

-- Verificar últimos pedidos
SELECT order_number, customer_name, customer_email, total_amount, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;

-- Verificar itens dos últimos pedidos
SELECT oi.order_id, oi.product_name, oi.quantity, oi.unit_price, o.order_number
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
ORDER BY o.created_at DESC
LIMIT 10;
