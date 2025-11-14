-- =====================================================
-- VERIFICAR PARCEIROS EXISTENTES
-- =====================================================
-- Execute este script no Supabase SQL Editor para verificar parceiros

-- 1. Verificar se há parceiros na tabela
SELECT 
  id,
  name,
  email,
  discount_code,
  user_id,
  is_active,
  created_at
FROM partners
ORDER BY created_at DESC;

-- 2. Verificar usuários no auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users
WHERE email LIKE '%@%'
ORDER BY created_at DESC;

-- 3. Verificar se há parceiros sem user_id
SELECT 
  id,
  name,
  email,
  discount_code,
  user_id,
  is_active
FROM partners
WHERE user_id IS NULL;

-- 4. Verificar se há usuários sem parceiro
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.id as partner_id,
  p.name as partner_name
FROM auth.users u
LEFT JOIN partners p ON p.user_id = u.id
WHERE u.email LIKE '%@%'
ORDER BY u.created_at DESC;

-- 5. Contar total de parceiros
SELECT COUNT(*) as total_partners FROM partners;

-- 6. Contar total de usuários
SELECT COUNT(*) as total_users FROM auth.users WHERE email LIKE '%@%';
