-- Correção rápida para o problema da coluna price

-- Tornar a coluna price nullable e adicionar valor padrão
ALTER TABLE order_items ALTER COLUMN price DROP NOT NULL;
ALTER TABLE order_items ALTER COLUMN price SET DEFAULT 0;

-- Verificar se a correção funcionou
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'order_items'
  AND column_name = 'price';
