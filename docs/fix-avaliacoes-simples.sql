-- ================================
-- SOLUÇÃO ALTERNATIVA: REMOVER TRIGGER PROBLEMÁTICO
-- ================================

-- Opção 1: Remover completamente o trigger problemático
DROP TRIGGER IF EXISTS trigger_atualizar_estatisticas_produto ON avaliacoes;
DROP FUNCTION IF EXISTS atualizar_estatisticas_produto();

-- Verificar se foi removido
SELECT 
    trigger_name, 
    event_manipulation, 
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_atualizar_estatisticas_produto';

-- Testar inserção na tabela avaliacoes
INSERT INTO avaliacoes (
    produto_id,
    nome,
    email,
    titulo,
    conteudo,
    classificacao
) VALUES (
    'teste-produto-id',
    'Teste Nome',
    'teste@email.com',
    'Teste Titulo',
    'Teste Conteudo',
    5
);

-- Ver se funcionou
SELECT * FROM avaliacoes WHERE produto_id = 'teste-produto-id';

-- Limpar teste
DELETE FROM avaliacoes WHERE produto_id = 'teste-produto-id';

RAISE NOTICE '================================';
RAISE NOTICE 'TRIGGER PROBLEMÁTICO REMOVIDO';
RAISE NOTICE '================================';
RAISE NOTICE 'Agora as avaliações devem funcionar';
RAISE NOTICE 'Mas não vão atualizar automaticamente';
RAISE NOTICE 'as estatísticas na tabela produtos'; 