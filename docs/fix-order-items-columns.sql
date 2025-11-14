-- SQL para verificar e corrigir a estrutura da tabela order_items

-- 1. Verificar se a tabela order_items existe
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'order_items' AND table_schema = 'public';

-- 2. Verificar a estrutura atual da tabela order_items
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Criar a tabela order_items se não existir
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  name TEXT,
  price DECIMAL(10, 2),
  quantity INTEGER DEFAULT 1,
  size TEXT,
  customization TEXT
);

-- 4. Adicionar colunas que podem estar em falta
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS id UUID DEFAULT uuid_generate_v4();
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS order_id UUID;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS customization TEXT;

-- 5. Adicionar timestamps opcionais (se necessário)
-- ALTER TABLE order_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
-- ALTER TABLE order_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 6. Adicionar chave primária se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'order_items' AND constraint_type = 'PRIMARY KEY'
    ) THEN
        ALTER TABLE order_items ADD PRIMARY KEY (id);
    END IF;
END$$;

-- 7. Adicionar foreign key se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'order_items' AND constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order_id 
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
    END IF;
END$$;

-- 8. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 9. Verificar estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 10. Teste de inserção simples
-- INSERT INTO order_items (order_id, name, price, quantity, size, customization) 
-- VALUES (
--   (SELECT id FROM orders LIMIT 1), 
--   'Produto Teste', 
--   19.99, 
--   1, 
--   'M', 
--   'Nome: TESTE'
-- );

-- 11. Verificar dados existentes
SELECT COUNT(*) as total_items FROM order_items; 