-- Verificar se a tabela admin_users existe
DO $$
BEGIN
    -- Verificar se a tabela existe
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
    ) THEN
        -- Tabela existe, verificar se o usuário já está registrado como admin
        -- Substitua 'seu_email@exemplo.com' pelo seu email de login
        IF NOT EXISTS (
            SELECT 1 FROM admin_users WHERE email = 'seu_email@exemplo.com'
        ) THEN
            -- Obter o user_id do usuário autenticado
            INSERT INTO admin_users (email, name, user_id, is_super_admin, created_at)
            SELECT 
                auth.users.email,
                COALESCE(auth.users.raw_user_meta_data->>'name', 'Administrador'),
                auth.users.id,
                TRUE,
                NOW()
            FROM auth.users
            WHERE auth.users.email = 'seu_email@exemplo.com';
            
            RAISE NOTICE 'Usuário administrador adicionado com sucesso!';
        ELSE
            RAISE NOTICE 'O usuário já está registrado como administrador.';
        END IF;
    ELSE
        -- Tabela não existe, criar a tabela e adicionar o usuário
        CREATE TABLE IF NOT EXISTS admin_users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            user_id UUID,
            is_super_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_login TIMESTAMP WITH TIME ZONE
        );
        
        -- Adicionar o usuário como administrador
        -- Substitua 'seu_email@exemplo.com' pelo seu email de login
        INSERT INTO admin_users (email, name, user_id, is_super_admin)
        SELECT 
            auth.users.email,
            COALESCE(auth.users.raw_user_meta_data->>'name', 'Administrador'),
            auth.users.id,
            TRUE
        FROM auth.users
        WHERE auth.users.email = 'seu_email@exemplo.com';
        
        RAISE NOTICE 'Tabela admin_users criada e usuário administrador adicionado com sucesso!';
    END IF;
END $$;
