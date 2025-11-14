-- SOLUÇÃO EXTREMA: RECRIAR TABELA AVALIACOES COMPLETAMENTE LIMPA

-- 1. Fazer backup das avaliações existentes (se houver)
CREATE TABLE IF NOT EXISTS avaliacoes_backup AS 
SELECT * FROM avaliacoes;

-- 2. Remover a tabela original
DROP TABLE IF EXISTS avaliacoes CASCADE;

-- 3. Recriar tabela completamente limpa
CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id TEXT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  classificacao INTEGER NOT NULL CHECK (classificacao BETWEEN 1 AND 5),
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar políticas de segurança básicas
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública" 
  ON avaliacoes FOR SELECT 
  USING (true);

CREATE POLICY "Permitir inserção pública" 
  ON avaliacoes FOR INSERT 
  WITH CHECK (true);

-- 5. Restaurar dados do backup (se existir)
INSERT INTO avaliacoes (id, produto_id, nome, email, titulo, conteudo, classificacao, data_criacao)
SELECT id, produto_id, nome, email, titulo, conteudo, classificacao, data_criacao 
FROM avaliacoes_backup
WHERE EXISTS (SELECT 1 FROM avaliacoes_backup);

-- 6. Testar inserção
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao) 
VALUES ('final-test', 'Final Test', 'final@test.com', 'Final Test', 'Final Test', 5);

-- 7. Verificar se funcionou
SELECT 'SUCESSO! Tabela avaliacoes funcionando' as resultado
WHERE EXISTS (SELECT 1 FROM avaliacoes WHERE produto_id = 'final-test');

-- 8. Limpar teste
DELETE FROM avaliacoes WHERE produto_id = 'final-test';

-- 9. Remover backup
DROP TABLE IF EXISTS avaliacoes_backup; 