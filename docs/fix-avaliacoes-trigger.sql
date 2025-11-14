-- Corrigir o trigger para tratar corretamente INSERT, UPDATE e DELETE
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
  
  -- Atualizar a média de avaliações e contagem na tabela de produtos
  UPDATE produtos
  SET 
    avaliacao = calcular_media_avaliacoes(produto_id_para_atualizar),
    num_avaliacoes = contar_avaliacoes(produto_id_para_atualizar)
  WHERE id = produto_id_para_atualizar;
  
  -- Para UPDATE, também atualizar o produto antigo se mudou
  IF TG_OP = 'UPDATE' AND OLD.produto_id != NEW.produto_id THEN
    UPDATE produtos
    SET 
      avaliacao = calcular_media_avaliacoes(OLD.produto_id),
      num_avaliacoes = contar_avaliacoes(OLD.produto_id)
    WHERE id = OLD.produto_id;
  END IF;
  
  -- Retornar o registro apropriado
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Recriar o trigger
DROP TRIGGER IF EXISTS trigger_atualizar_estatisticas_produto ON avaliacoes;

CREATE TRIGGER trigger_atualizar_estatisticas_produto
AFTER INSERT OR UPDATE OR DELETE ON avaliacoes
FOR EACH ROW
EXECUTE FUNCTION atualizar_estatisticas_produto(); 