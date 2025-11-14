-- Listar todos os parceiros
SELECT 
  p.id, 
  p.name, 
  p.email, 
  p.discount_code, 
  p.user_id, 
  p.is_active,
  p.created_at
FROM partners p 
ORDER BY p.created_at DESC;

-- Listar todos os usuários
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  u.raw_user_meta_data
FROM auth.users u
WHERE u.raw_user_meta_data->>'is_partner' = 'true'
ORDER BY u.created_at DESC;
