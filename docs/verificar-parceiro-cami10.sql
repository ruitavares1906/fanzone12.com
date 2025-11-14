-- Verificar parceiro CAMI10
SELECT 
  p.id, 
  p.name, 
  p.email, 
  p.discount_code, 
  p.user_id, 
  p.is_active,
  p.created_at
FROM partners p 
WHERE p.discount_code = 'CAMI10';

-- Verificar usuário associado
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  u.raw_user_meta_data
FROM auth.users u
WHERE u.email = 'parceiro.cami10@teste.com';

-- Verificar se há encomendas com o código CAMI10
SELECT 
  id,
  order_number,
  total,
  payment_status,
  discount_code,
  created_at
FROM orders 
WHERE discount_code = 'CAMI10'
ORDER BY created_at DESC;