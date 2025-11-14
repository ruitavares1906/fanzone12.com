-- Remover o trigger problemático
DROP TRIGGER IF EXISTS trigger_atualizar_estatisticas_produto ON avaliacoes;

-- Remover a função problemática
DROP FUNCTION IF EXISTS atualizar_estatisticas_produto();

-- Testar se as avaliações funcionam agora
SELECT 'Trigger removido, teste agora as avaliações' as status; 