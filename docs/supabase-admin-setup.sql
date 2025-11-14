-- Função para criar a tabela admin_users se ela não existir
CREATE OR REPLACE FUNCTION create_admin_table()
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
      user_id UUID REFERENCES auth.users(id),
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      last_login TIMESTAMP WITH TIME ZONE
    );

    -- Habilitar RLS na tabela
    ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

    -- Criar política para permitir que administradores vejam outros administradores
    CREATE POLICY "Admins can view admin users" ON public.admin_users
      FOR SELECT USING (
        auth.uid() IN (SELECT user_id FROM public.admin_users)
      );

    -- Criar política para permitir que administradores adicionem outros administradores
    CREATE POLICY "Admins can insert admin users" ON public.admin_users
      FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT user_id FROM public.admin_users) OR
        (SELECT COUNT(*) FROM public.admin_users) = 0
      );

    -- Criar política para permitir que administradores atualizem outros administradores
    CREATE POLICY "Admins can update admin users" ON public.admin_users
      FOR UPDATE USING (
        auth.uid() IN (SELECT user_id FROM public.admin_users)
      );

    -- Criar política para permitir que administradores removam outros administradores
    CREATE POLICY "Admins can delete admin users" ON public.admin_users
      FOR DELETE USING (
        auth.uid() IN (SELECT user_id FROM public.admin_users)
      );
  END IF;
END;
$$;
