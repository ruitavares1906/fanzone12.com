-- Função para configurar as tabelas de administração diretamente
CREATE OR REPLACE FUNCTION setup_admin_tables_direct()
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

  -- 2. Criar tabela de pedidos (se ainda não existir)
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

  -- 6. Desabilitar RLS temporariamente para permitir inserções diretas
  ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
  ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
  ALTER TABLE order_status_history DISABLE ROW LEVEL SECURITY;
  ALTER TABLE order_tracking DISABLE ROW LEVEL SECURITY;
  ALTER TABLE customers DISABLE ROW LEVEL SECURITY;

  -- 7. Criar função para adicionar administrador
  CREATE OR REPLACE FUNCTION add_admin_user(admin_email TEXT, admin_name TEXT)
  RETURNS TEXT AS $$
  DECLARE
    user_id UUID;
  BEGIN
    -- Verificar se o usuário existe na tabela auth.users
    SELECT id INTO user_id FROM auth.users WHERE email = admin_email;
    
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

  RETURN 'Tabelas de administração configuradas com sucesso!';
END;
$$ LANGUAGE plpgsql;
