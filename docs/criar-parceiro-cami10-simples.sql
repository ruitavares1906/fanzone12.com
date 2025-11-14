-- =====================================================
-- CRIAR PARCEIRO COM CÓDIGO CAMI10 (VERSÃO SIMPLES)
-- =====================================================
-- Execute este script no Supabase SQL Editor

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

-- 2. Se não existir, criar um usuário no auth.users
-- (Execute apenas se o SELECT acima não retornar resultados)
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

-- 3. Criar o parceiro
INSERT INTO partners (
  name,
  email,
  discount_code,
  user_id,
  is_active,
  created_at,
  updated_at
) 
SELECT 
  'Parceiro CAMI10',
  'parceiro.cami10@teste.com',
  'CAMI10',
  u.id,
  true,
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'parceiro.cami10@teste.com';

-- 4. Verificar se foi criado com sucesso
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

-- 5. Mostrar mensagem de sucesso
SELECT 'Parceiro CAMI10 criado com sucesso!' as status;
