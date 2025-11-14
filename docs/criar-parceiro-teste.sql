-- Criar parceiro de teste com credenciais conhecidas
-- 1. Criar usuário no auth.users
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
  'teste@parceiro.com', 
  crypt('123456', gen_salt('bf')), 
  NOW(), 
  NOW(), 
  NOW(),
  '{"name": "Parceiro Teste", "discount_code": "TESTE", "is_partner": true}',
  false, 
  'authenticated'
);

-- 2. Criar parceiro
INSERT INTO partners (name, email, discount_code, user_id, is_active, created_at, updated_at)
SELECT 
  'Parceiro Teste', 
  'teste@parceiro.com', 
  'TESTE', 
  u.id, 
  true, 
  NOW(), 
  NOW()
FROM auth.users u 
WHERE u.email = 'teste@parceiro.com';

-- 3. Verificar criação
SELECT 
  p.id, 
  p.name, 
  p.email, 
  p.discount_code, 
  p.user_id, 
  p.is_active
FROM partners p 
WHERE p.discount_code = 'TESTE';
