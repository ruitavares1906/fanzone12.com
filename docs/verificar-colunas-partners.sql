-- =====================================================
-- SCRIPT PARA VERIFICAR COLUNAS DA TABELA PARTNERS
-- =====================================================
-- Execute este script no Supabase SQL Editor para ver quais colunas existem

-- 1. Verificar estrutura da tabela partners
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'partners' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se a tabela existe
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_name = 'partners' 
  AND table_schema = 'public';

-- 3. Verificar dados de exemplo (se existirem)
SELECT * FROM partners LIMIT 5;

-- 4. Verificar se há dados
SELECT COUNT(*) as total_partners FROM partners;
