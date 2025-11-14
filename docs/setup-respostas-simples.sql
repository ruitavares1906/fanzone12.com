-- Script simples para adicionar funcionalidade de respostas às avaliações
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar coluna parent_id para respostas
ALTER TABLE avaliacoes 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES avaliacoes(id) ON DELETE CASCADE;

-- 2. Adicionar coluna is_admin_reply para identificar respostas de admin
ALTER TABLE avaliacoes 
ADD COLUMN IF NOT EXISTS is_admin_reply BOOLEAN DEFAULT FALSE;

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_avaliacoes_parent_id ON avaliacoes(parent_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_produto_parent ON avaliacoes(produto_id, parent_id);

-- 4. Verificar resultado
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'avaliacoes' AND column_name = 'parent_id')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'avaliacoes' AND column_name = 'is_admin_reply')
    THEN '✅ Funcionalidade de respostas configurada com sucesso!'
    ELSE '❌ Erro na configuração'
  END as status;

-- 5. Mostrar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'avaliacoes' 
ORDER BY ordinal_position; 