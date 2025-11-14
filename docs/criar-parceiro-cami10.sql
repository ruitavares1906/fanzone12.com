-- =====================================================
-- CRIAR PARCEIRO COM CÓDIGO CAMI10
-- =====================================================
-- Execute este script no Supabase SQL Editor para criar um parceiro de teste

-- 1. Verificar se já existe um parceiro com código CAMI10
SELECT 
  id,
  name,
  email,
  discount_code,
  user_id,
  is_active
FROM partners 
WHERE discount_code = 'CAMI10';

-- 2. Se não existir, criar um parceiro de teste
-- (Execute apenas se o SELECT acima não retornar resultados)

-- Primeiro, verificar se o usuário já existe
DO $$
DECLARE
  user_exists boolean;
  partner_exists boolean;
  new_user_id uuid;
BEGIN
  -- Verificar se usuário já existe
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'parceiro.cami10@teste.com') INTO user_exists;
  
  -- Verificar se parceiro já existe
  SELECT EXISTS(SELECT 1 FROM partners WHERE discount_code = 'CAMI10') INTO partner_exists;
  
  -- Se parceiro já existe, não fazer nada
  IF partner_exists THEN
    RAISE NOTICE 'Parceiro CAMI10 já existe';
    RETURN;
  END IF;
  
  -- Se usuário não existe, criar
  IF NOT user_exists THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      role
    ) VALUES (
      gen_random_uuid(),
      'parceiro.cami10@teste.com',
      crypt('123456', gen_salt('bf')), -- Senha: 123456
      NOW(),
      NOW(),
      NOW(),
      '{"name": "Parceiro CAMI10", "discount_code": "CAMI10", "is_partner": true}',
      false,
      'authenticated'
    );
    RAISE NOTICE 'Usuário parceiro.cami10@teste.com criado';
  END IF;
  
  -- Obter ID do usuário
  SELECT id INTO new_user_id FROM auth.users WHERE email = 'parceiro.cami10@teste.com';
  
  -- Criar parceiro
  INSERT INTO partners (
    name,
    email,
    discount_code,
    user_id,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    'Parceiro CAMI10',
    'parceiro.cami10@teste.com',
    'CAMI10',
    new_user_id,
    true,
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'Parceiro CAMI10 criado com sucesso';
END $$;

-- 3. Verificar se foi criado com sucesso
SELECT 
  p.id,
  p.name,
  p.email,
  p.discount_code,
  p.user_id,
  p.is_active,
  u.email as auth_email
FROM partners p
LEFT JOIN auth.users u ON u.id = p.user_id
WHERE p.discount_code = 'CAMI10';

-- 4. Mostrar mensagem de sucesso
SELECT 'Parceiro CAMI10 criado com sucesso!' as status;
