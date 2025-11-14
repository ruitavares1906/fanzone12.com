-- Função para criar a tabela admin_users e configurar RLS
CREATE OR REPLACE FUNCTION setup_admin_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se a tabela já existe
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_users'
  ) THEN
    -- Criar a tabela admin_users
    CREATE TABLE public.admin_users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      user_id UUID,
      is_super_admin BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      last_login TIMESTAMP WITH TIME ZONE
    );

    -- Habilitar RLS
    ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

    -- Criar política para permitir acesso a administradores
    CREATE POLICY "Admins can view admin users" ON public.admin_users
      FOR SELECT USING (
        auth.email() IN (SELECT email FROM public.admin_users)
      );
      
    -- Criar política para permitir inserção durante a configuração
    CREATE POLICY "Anyone can insert during setup" ON public.admin_users
      FOR INSERT WITH CHECK (
        NOT EXISTS (SELECT 1 FROM public.admin_users) OR
        auth.email() IN (SELECT email FROM public.admin_users)
      );
  END IF;
END;
$$;
