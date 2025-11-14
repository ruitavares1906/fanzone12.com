-- Criar tabela de avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produto_id TEXT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  classificacao INTEGER NOT NULL CHECK (classificacao BETWEEN 1 AND 5),
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Adicionar índice para consultas por produto_id
  CONSTRAINT fk_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- Criar política de segurança para permitir inserções anônimas
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura por qualquer pessoa
CREATE POLICY "Permitir leitura pública de avaliações" 
  ON avaliacoes FOR SELECT 
  USING (true);

-- Política para permitir inserção por qualquer pessoa
CREATE POLICY "Permitir inserção de avaliações" 
  ON avaliacoes FOR INSERT 
  WITH CHECK (true);

-- Criar função para calcular média de avaliações por produto
CREATE OR REPLACE FUNCTION calcular_media_avaliacoes(produto_id_param TEXT)
RETURNS NUMERIC AS $$
DECLARE
  media NUMERIC;
BEGIN
  SELECT AVG(classificacao) INTO media
  FROM avaliacoes
  WHERE produto_id = produto_id_param;
  
  RETURN COALESCE(media, 0);
END;
$$ LANGUAGE plpgsql;

-- Criar função para contar número de avaliações por produto
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

-- Criar trigger para atualizar a média e contagem de avaliações na tabela de produtos
CREATE OR REPLACE FUNCTION atualizar_estatisticas_produto()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar a média de avaliações e contagem na tabela de produtos
  UPDATE produtos
  SET 
    avaliacao = calcular_media_avaliacoes(NEW.produto_id),
    num_avaliacoes = contar_avaliacoes(NEW.produto_id)
  WHERE id = NEW.produto_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar o trigger
CREATE TRIGGER trigger_atualizar_estatisticas_produto
AFTER INSERT OR UPDATE OR DELETE ON avaliacoes
FOR EACH ROW
EXECUTE FUNCTION atualizar_estatisticas_produto();
