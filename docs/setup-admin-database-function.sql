-- Função para configurar o banco de dados administrativo
CREATE OR REPLACE FUNCTION setup_admin_database()
RETURNS TEXT AS $$
BEGIN
  -- Habilitar a extensão UUID se ainda não estiver habilitada
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- 1. Criar tabela de administradores
  CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    user_id UUID,
    is_super_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
  );

  -- 2. Criar tabela de pedidos
  CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending',
    total DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2),
    shipping DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    email TEXT,
    customer_id UUID,
    payment_intent_id TEXT,
    payment_method TEXT,
    tracking_number TEXT,
    shipping_address JSONB,
    billing_address JSONB,
    items JSONB,
    notes TEXT
  );

  -- 3. Criar tabela de histórico de status de pedidos
  CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
  );

  -- 4. Criar tabela de rastreamento de pedidos
  CREATE TABLE IF NOT EXISTS order_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    tracking_number TEXT NOT NULL,
    carrier TEXT,
    shipping_date TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    status TEXT
  );

  -- 5. Criar tabela de clientes (simplificada)
  CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
  );

  -- 6. Criar função para adicionar administrador
  CREATE OR REPLACE FUNCTION add_admin_user(admin_email TEXT, admin_name TEXT)
  RETURNS TEXT AS $$
  DECLARE
    user_id UUID;
  BEGIN
    -- Verificar se o usuário existe na tabela auth.users
    SELECT id INTO user_id FROM auth.users WHERE email = admin_email;
    
    IF user_id IS NULL THEN
      RETURN 'Usuário não encontrado na autenticação. Registre-se primeiro.';
    END IF;
    
    -- Verificar se o usuário já é um administrador
    IF EXISTS (SELECT 1 FROM admin_users WHERE email = admin_email) THEN
      RETURN 'Este usuário já é um administrador.';
    END IF;
    
    -- Adicionar o usuário como administrador
    INSERT INTO admin_users (email, name, user_id, is_super_admin, created_at)
    VALUES (admin_email, admin_name, user_id, TRUE, NOW());
    
    RETURN 'Administrador adicionado com sucesso!';
  END;
  $$ LANGUAGE plpgsql;

  -- 7. Configurar políticas de segurança (RLS)

  -- Habilitar RLS nas tabelas
  ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
  ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
  ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;
  ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

  -- Política para admin_users: apenas super_admin pode gerenciar outros admins
  BEGIN
    DROP POLICY IF EXISTS admin_users_super_admin_policy ON admin_users;
    EXCEPTION WHEN OTHERS THEN NULL;
  END;
  CREATE POLICY admin_users_super_admin_policy ON admin_users
    USING (
      (SELECT is_super_admin FROM admin_users WHERE user_id = auth.uid()) = TRUE
    );

  -- Política para visualização de admin_users: admins podem ver outros admins
  BEGIN
    DROP POLICY IF EXISTS admin_users_view_policy ON admin_users;
    EXCEPTION WHEN OTHERS THEN NULL;
  END;
  CREATE POLICY admin_users_view_policy ON admin_users
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
    );

  -- Política para orders: admins podem ver e gerenciar todos os pedidos
  BEGIN
    DROP POLICY IF EXISTS orders_admin_policy ON orders;
    EXCEPTION WHEN OTHERS THEN NULL;
  END;
  CREATE POLICY orders_admin_policy ON orders
    USING (
      EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
    );

  -- Política para order_status_history: admins podem ver e gerenciar
  BEGIN
    DROP POLICY IF EXISTS order_status_history_admin_policy ON order_status_history;
    EXCEPTION WHEN OTHERS THEN NULL;
  END;
  CREATE POLICY order_status_history_admin_policy ON order_status_history
    USING (
      EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
    );

  -- Política para order_tracking: admins podem ver e gerenciar
  BEGIN
    DROP POLICY IF EXISTS order_tracking_admin_policy ON order_tracking;
    EXCEPTION WHEN OTHERS THEN NULL;
  END;
  CREATE POLICY order_tracking_admin_policy ON order_tracking
    USING (
      EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
    );

  -- Política para customers: admins podem ver e gerenciar
  BEGIN
    DROP POLICY IF EXISTS customers_admin_policy ON customers;
    EXCEPTION WHEN OTHERS THEN NULL;
  END;
  CREATE POLICY customers_admin_policy ON customers
    USING (
      EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
    );

  -- 8. Criar função para verificar se um usuário é administrador
  CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
  RETURNS BOOLEAN AS $$
  BEGIN
    RETURN EXISTS (
      SELECT 1 FROM admin_users WHERE email = user_email
    );
  END;
  $$ LANGUAGE plpgsql;

  -- 9. Criar função para verificar se um usuário é super administrador
  CREATE OR REPLACE FUNCTION is_super_admin(user_email TEXT)
  RETURNS BOOLEAN AS $$
  BEGIN
    RETURN EXISTS (
      SELECT 1 FROM admin_users WHERE email = user_email AND is_super_admin = TRUE
    );
  END;
  $$ LANGUAGE plpgsql;

  -- 10. Inserir dados de exemplo (opcional)
  -- Inserir um pedido de exemplo
  INSERT INTO orders (
    order_number, 
    status, 
    total, 
    subtotal, 
    shipping, 
    email, 
    shipping_address, 
    items
  ) VALUES (
    'ORD-' || SUBSTRING(uuid_generate_v4()::text, 1, 8),
    'pending',
    59.99,
    54.99,
    5.00,
    'cliente@exemplo.com',
    '{"name": "João Silva", "street": "Rua Exemplo", "number": "123", "city": "Lisboa", "postal_code": "1000-001", "country": "Portugal"}',
    '[{"id": 1, "name": "Camisola Sporting 2024/25", "price": 54.99, "quantity": 1, "size": "M"}]'
  );

  RETURN 'Banco de dados configurado com sucesso!';
END;
$$ LANGUAGE plpgsql;
