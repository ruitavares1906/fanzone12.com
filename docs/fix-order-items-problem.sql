-- SQL para diagnosticar e corrigir o problema do product_id UUID

-- 1. Verificar se a tabela order_items existe
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'order_items' AND table_schema = 'public';

-- 2. Verificar a estrutura atual da tabela order_items
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Se a tabela order_items tiver um campo product_id como UUID, removê-lo:
-- ALTER TABLE order_items DROP COLUMN IF EXISTS product_id;

-- 4. Verificar estrutura da tabela orders
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Adicionar campos em falta na tabela orders (se necessário):
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address JSONB;

-- 6. Adicionar campos em falta na tabela order_items (se necessário):
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS customization TEXT;

-- 7. Criar a tabela order_items se não existir (com estrutura correta):
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  customization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 9. Verificar dados existentes na tabela order_items
SELECT COUNT(*) as total_items FROM order_items;

-- 10. Mostrar primeiros 3 registos da tabela order_items (se existirem)
SELECT * FROM order_items LIMIT 3; 