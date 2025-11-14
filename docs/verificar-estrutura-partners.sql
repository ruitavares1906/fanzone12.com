-- =====================================================
-- VERIFICAR ESTRUTURA DA TABELA PARTNERS
-- =====================================================
-- Execute este script no Supabase SQL Editor para verificar a estrutura

-- 1. Verificar se a tabela existe
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_name = 'partners' 
  AND table_schema = 'public';

-- 2. Verificar estrutura da tabela partners
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'partners' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar se há dados
SELECT COUNT(*) as total_partners FROM partners;

-- 4. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'partners';

-- 5. Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'partners';

-- 6. Verificar índices
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'partners';

-- 7. Verificar constraints
SELECT 
  conname,
  contype,
  confrelid::regclass as foreign_table
FROM pg_constraint 
WHERE conrelid = 'partners'::regclass;
