-- SCRIPT EXTREMO: MATAR TODOS OS TRIGGERS E FUNÇÕES

-- Forçar remoção de triggers específicos
DROP TRIGGER IF EXISTS trigger_atualizar_estatisticas_produto ON avaliacoes CASCADE;
DROP TRIGGER IF EXISTS atualizar_estatisticas_produto ON avaliacoes CASCADE;
DROP TRIGGER IF EXISTS update_produto_stats ON avaliacoes CASCADE;
DROP TRIGGER IF EXISTS produto_stats_trigger ON avaliacoes CASCADE;

-- Forçar remoção de funções específicas
DROP FUNCTION IF EXISTS atualizar_estatisticas_produto CASCADE;
DROP FUNCTION IF EXISTS calcular_media_avaliacoes CASCADE; 
DROP FUNCTION IF EXISTS contar_avaliacoes CASCADE;
DROP FUNCTION IF EXISTS update_produto_stats CASCADE;
DROP FUNCTION IF EXISTS produto_stats CASCADE;

-- Tentar inserção de teste direta
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao) 
VALUES ('test-123', 'Test', 'test@test.com', 'Test', 'Test', 5);

-- Ver se funcionou
SELECT * FROM avaliacoes WHERE produto_id = 'test-123';

-- Limpar
DELETE FROM avaliacoes WHERE produto_id = 'test-123'; 