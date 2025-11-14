-- =====================================================
-- CORREÇÃO DA FOREIGN KEY DA TABELA PARTNERS
-- =====================================================
-- Execute este script no Supabase SQL Editor

-- 1. Remover a foreign key constraint existente (se existir)
ALTER TABLE partners 
DROP CONSTRAINT IF EXISTS partners_user_id_fkey;

-- 2. Adicionar a foreign key correta para auth.users
ALTER TABLE partners 
ADD CONSTRAINT partners_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. Verificar se a constraint foi criada corretamente
SELECT 
  conname,
  contype,
  confrelid::regclass as foreign_table,
  confupdtype,
  confdeltype
FROM pg_constraint 
WHERE conrelid = 'partners'::regclass 
  AND conname = 'partners_user_id_fkey';

-- 4. Verificar estrutura da tabela partners
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'partners' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Mensagem de sucesso
SELECT 'Foreign key corrigida com sucesso!' as status;
