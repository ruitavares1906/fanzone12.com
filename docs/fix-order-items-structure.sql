-- Script para verificar e corrigir a estrutura da tabela order_items
-- Execute este script no SQL Editor do Supabase

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
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  customization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Adicionar colunas que podem estar em falta
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS customization TEXT;

-- 5. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 6. Desativar e reativar RLS com políticas adequadas
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "order_items_insert_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_select_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_update_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_delete_policy" ON order_items;

-- Política para permitir inserção via service role (webhook do Stripe)
CREATE POLICY "order_items_insert_policy" ON order_items
    FOR INSERT 
    WITH CHECK (true);

-- Política para permitir leitura
CREATE POLICY "order_items_select_policy" ON order_items
    FOR SELECT 
    USING (
        auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
        OR EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
        OR auth.role() = 'service_role'
    );

-- Política para permitir atualização (admin e service role)
CREATE POLICY "order_items_update_policy" ON order_items
    FOR UPDATE 
    USING (
        auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
        OR auth.role() = 'service_role'
    );

-- Política para permitir exclusão (admin e service role)
CREATE POLICY "order_items_delete_policy" ON order_items
    FOR DELETE 
    USING (
        auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
        OR auth.role() = 'service_role'
    );

-- 7. Verificar estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 8. Verificar se existem dados na tabela
SELECT COUNT(*) as total_items FROM order_items;

-- 9. Mostrar os primeiros 3 registos (se existirem)
SELECT * FROM order_items LIMIT 3; 