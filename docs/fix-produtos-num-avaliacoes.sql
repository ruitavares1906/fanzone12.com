-- Adicionar coluna num_avaliacoes à tabela produtos se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'produtos' 
        AND column_name = 'num_avaliacoes'
    ) THEN
        ALTER TABLE produtos ADD COLUMN num_avaliacoes INTEGER DEFAULT 0;
    END IF;
END $$;

-- Atualizar todas as contagens existentes
UPDATE produtos
SET num_avaliacoes = (
    SELECT COUNT(*)
    FROM avaliacoes
    WHERE avaliacoes.produto_id = produtos.id
);

-- Verificar se a coluna foi criada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'produtos' 
AND column_name IN ('avaliacao', 'num_avaliacoes')
ORDER BY column_name; 