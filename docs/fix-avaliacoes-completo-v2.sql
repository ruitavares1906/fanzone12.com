-- ================================
-- SCRIPT COMPLETO: FIX SISTEMA DE AVALIAÇÕES (V2)
-- ================================

-- 1. Adicionar coluna num_avaliacoes à tabela produtos se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'produtos' 
        AND column_name = 'num_avaliacoes'
    ) THEN
        ALTER TABLE produtos ADD COLUMN num_avaliacoes INTEGER DEFAULT 0;
        RAISE NOTICE 'Coluna num_avaliacoes adicionada à tabela produtos';
    ELSE
        RAISE NOTICE 'Coluna num_avaliacoes já existe na tabela produtos';
    END IF;
END $$;

-- 2. Verificar se há uma tabela produtos (pode não existir em Supabase se for só API)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'produtos') THEN
        RAISE NOTICE 'ATENÇÃO: Tabela produtos não existe. Criando tabela básica...';
        
        CREATE TABLE produtos (
            id TEXT PRIMARY KEY,
            nome TEXT,
            avaliacao NUMERIC DEFAULT 0,
            num_avaliacoes INTEGER DEFAULT 0
        );
        
        RAISE NOTICE 'Tabela produtos criada com estrutura básica';
    END IF;
END $$;

-- 3. Atualizar todas as contagens existentes
UPDATE produtos
SET num_avaliacoes = (
    SELECT COUNT(*)
    FROM avaliacoes
    WHERE avaliacoes.produto_id = produtos.id
)
WHERE EXISTS (SELECT 1 FROM avaliacoes WHERE produto_id = produtos.id);

-- 4. Criar/atualizar função para calcular média de avaliações
CREATE OR REPLACE FUNCTION calcular_media_avaliacoes(produto_id_param TEXT)
RETURNS NUMERIC AS $$
DECLARE
  media NUMERIC;
BEGIN
  SELECT AVG(classificacao::NUMERIC) INTO media
  FROM avaliacoes
  WHERE produto_id = produto_id_param;
  
  RETURN ROUND(COALESCE(media, 0), 1);
END;
$$ LANGUAGE plpgsql;

-- 5. Criar/atualizar função para contar avaliações
CREATE OR REPLACE FUNCTION contar_avaliacoes(produto_id_param TEXT)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COUNT(*) INTO total
  FROM avaliacoes
  WHERE produto_id = produto_id_param;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- 6. Corrigir trigger para tratar INSERT, UPDATE e DELETE
CREATE OR REPLACE FUNCTION atualizar_estatisticas_produto()
RETURNS TRIGGER AS $$
DECLARE
  produto_id_para_atualizar TEXT;
BEGIN
  -- Determinar qual produto_id atualizar baseado no tipo de operação
  IF TG_OP = 'DELETE' THEN
    produto_id_para_atualizar = OLD.produto_id;
  ELSE
    produto_id_para_atualizar = NEW.produto_id;
  END IF;
  
  -- Verificar se o produto existe na tabela produtos
  IF EXISTS (SELECT 1 FROM produtos WHERE id = produto_id_para_atualizar) THEN
    -- Atualizar a média de avaliações e contagem na tabela de produtos
    UPDATE produtos
    SET 
      avaliacao = calcular_media_avaliacoes(produto_id_para_atualizar),
      num_avaliacoes = contar_avaliacoes(produto_id_para_atualizar)
    WHERE id = produto_id_para_atualizar;
  ELSE
    RAISE NOTICE 'Produto % não encontrado na tabela produtos. Pulando atualização.', produto_id_para_atualizar;
  END IF;
  
  -- Para UPDATE, também atualizar o produto antigo se mudou
  IF TG_OP = 'UPDATE' AND OLD.produto_id != NEW.produto_id THEN
    IF EXISTS (SELECT 1 FROM produtos WHERE id = OLD.produto_id) THEN
      UPDATE produtos
      SET 
        avaliacao = calcular_media_avaliacoes(OLD.produto_id),
        num_avaliacoes = contar_avaliacoes(OLD.produto_id)
      WHERE id = OLD.produto_id;
    END IF;
  END IF;
  
  -- Retornar o registro apropriado
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 7. Recriar o trigger
DROP TRIGGER IF EXISTS trigger_atualizar_estatisticas_produto ON avaliacoes;

CREATE TRIGGER trigger_atualizar_estatisticas_produto
AFTER INSERT OR UPDATE OR DELETE ON avaliacoes
FOR EACH ROW
EXECUTE FUNCTION atualizar_estatisticas_produto();

-- 8. Verificar estrutura final
SELECT 
    'produtos' as tabela,
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'produtos' 
AND column_name IN ('id', 'avaliacao', 'num_avaliacoes')

UNION ALL

SELECT 
    'avaliacoes' as tabela,
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'avaliacoes'
AND column_name IN ('id', 'produto_id', 'classificacao')

ORDER BY tabela, column_name;

-- 9. Mostrar estatísticas atuais
SELECT 
    'Total de avaliações:' as info,
    COUNT(*)::TEXT as valor
FROM avaliacoes

UNION ALL

SELECT 
    'Produtos com avaliações:' as info,
    COUNT(DISTINCT produto_id)::TEXT as valor
FROM avaliacoes;

-- 10. Mensagem final em bloco válido
DO $$
BEGIN
    RAISE NOTICE '===============================';
    RAISE NOTICE 'SISTEMA DE AVALIAÇÕES CORRIGIDO';
    RAISE NOTICE '===============================';
    RAISE NOTICE 'Execute teste: tente criar uma avaliação no website';
END $$; 