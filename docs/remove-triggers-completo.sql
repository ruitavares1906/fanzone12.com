-- ================================
-- REMOÇÃO COMPLETA DE TODOS OS TRIGGERS PROBLEMÁTICOS
-- ================================

-- 1. Listar todos os triggers na tabela avaliacoes
SELECT 
    trigger_name, 
    event_manipulation, 
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'avaliacoes';

-- 2. Remover TODOS os triggers da tabela avaliacoes
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT trigger_name
        FROM information_schema.triggers
        WHERE event_object_table = 'avaliacoes'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name || ' ON avaliacoes';
        RAISE NOTICE 'Trigger removido: %', trigger_record.trigger_name;
    END LOOP;
END $$;

-- 3. Remover todas as funções relacionadas
DROP FUNCTION IF EXISTS atualizar_estatisticas_produto() CASCADE;
DROP FUNCTION IF EXISTS calcular_media_avaliacoes(TEXT) CASCADE;
DROP FUNCTION IF EXISTS contar_avaliacoes(TEXT) CASCADE;

-- 4. Verificar se ainda existem triggers
SELECT 
    'Triggers restantes:' as info,
    COUNT(*)::TEXT as quantidade
FROM information_schema.triggers
WHERE event_object_table = 'avaliacoes';

-- 5. Verificar se ainda existem funções relacionadas
SELECT 
    'Funções relacionadas:' as info,
    COUNT(*)::TEXT as quantidade
FROM information_schema.routines
WHERE routine_name LIKE '%avaliac%' OR routine_name LIKE '%produto%';

-- 6. Testar inserção simples
INSERT INTO avaliacoes (
    produto_id,
    nome,
    email,
    titulo,
    conteudo,
    classificacao
) VALUES (
    'teste-final-123',
    'Teste Final',
    'teste@final.com',
    'Teste Final Titulo',
    'Teste Final Conteudo',
    4
);

-- 7. Verificar se a inserção funcionou
SELECT 
    'Teste inserção:' as resultado,
    CASE 
        WHEN COUNT(*) > 0 THEN 'SUCESSO'
        ELSE 'FALHOU'
    END as status
FROM avaliacoes 
WHERE produto_id = 'teste-final-123';

-- 8. Limpar teste
DELETE FROM avaliacoes WHERE produto_id = 'teste-final-123'; 