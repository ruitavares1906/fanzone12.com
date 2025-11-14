-- Corrigir políticas RLS para order_items
-- Este script permite que o webhook do Stripe insira itens de encomenda

-- Primeiro, vamos verificar e corrigir a tabela order_items
BEGIN;

-- Desativar RLS temporariamente se necessário
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Reativar RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes que possam estar a causar conflitos
DROP POLICY IF EXISTS "order_items_insert_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_select_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_update_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_delete_policy" ON order_items;

-- Política para permitir inserção via service role (webhook do Stripe)
CREATE POLICY "order_items_insert_policy" ON order_items
    FOR INSERT 
    WITH CHECK (true);

-- Política para permitir leitura dos itens (admin e usuário proprietário)
CREATE POLICY "order_items_select_policy" ON order_items
    FOR SELECT 
    USING (
        -- Admin pode ver tudo
        auth.jwt() ->> 'email' IN (
            SELECT email FROM admin_users
        )
        OR
        -- Usuário pode ver seus próprios itens através da ordem
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
        OR
        -- Permitir acesso via service role (para relatórios, etc.)
        auth.role() = 'service_role'
    );

-- Política para permitir atualização (apenas admin)
CREATE POLICY "order_items_update_policy" ON order_items
    FOR UPDATE 
    USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM admin_users
        )
        OR
        auth.role() = 'service_role'
    );

-- Política para permitir exclusão (apenas admin)
CREATE POLICY "order_items_delete_policy" ON order_items
    FOR DELETE 
    USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM admin_users
        )
        OR
        auth.role() = 'service_role'
    );

-- Verificar se a tabela orders também tem políticas adequadas
-- Vamos também corrigir as políticas da tabela orders se necessário

-- Desativar e reativar RLS para orders
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes da tabela orders que possam estar a causar problemas
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;
DROP POLICY IF EXISTS "orders_delete_policy" ON orders;

-- Política para permitir inserção de encomendas via service role (webhook)
CREATE POLICY "orders_insert_policy" ON orders
    FOR INSERT 
    WITH CHECK (true);

-- Política para permitir leitura das encomendas
CREATE POLICY "orders_select_policy" ON orders
    FOR SELECT 
    USING (
        -- Admin pode ver tudo
        auth.jwt() ->> 'email' IN (
            SELECT email FROM admin_users
        )
        OR
        -- Usuário pode ver suas próprias encomendas
        user_id = auth.uid()
        OR
        -- Service role pode ver tudo
        auth.role() = 'service_role'
    );

-- Política para permitir atualização (admin e service role)
CREATE POLICY "orders_update_policy" ON orders
    FOR UPDATE 
    USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM admin_users
        )
        OR
        auth.role() = 'service_role'
    );

-- Política para permitir exclusão (apenas admin)
CREATE POLICY "orders_delete_policy" ON orders
    FOR DELETE 
    USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM admin_users
        )
        OR
        auth.role() = 'service_role'
    );

COMMIT;

-- Verificar se as políticas foram criadas corretamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, policyname; 