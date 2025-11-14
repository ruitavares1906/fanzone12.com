-- ================================
-- SCRIPT: SETUP CAPAS DE TELEMÓVEL
-- ================================
-- Este script adiciona as colunas necessárias para suportar
-- a categoria de capas de telemóvel no sistema

-- 1. Adicionar coluna marca_telemovel (Apple ou Samsung)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'produtos' 
        AND column_name = 'marca_telemovel'
    ) THEN
        ALTER TABLE produtos ADD COLUMN marca_telemovel TEXT;
        RAISE NOTICE 'Coluna marca_telemovel adicionada à tabela produtos';
    ELSE
        RAISE NOTICE 'Coluna marca_telemovel já existe na tabela produtos';
    END IF;
END $$;

-- 2. Adicionar coluna modelo_telemovel (iPhone 16, Galaxy S25, etc.)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'produtos' 
        AND column_name = 'modelo_telemovel'
    ) THEN
        ALTER TABLE produtos ADD COLUMN modelo_telemovel TEXT;
        RAISE NOTICE 'Coluna modelo_telemovel adicionada à tabela produtos';
    ELSE
        RAISE NOTICE 'Coluna modelo_telemovel já existe na tabela produtos';
    END IF;
END $$;

-- 3. Adicionar coluna personalizacao_nome_numero (boolean)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'produtos' 
        AND column_name = 'personalizacao_nome_numero'
    ) THEN
        ALTER TABLE produtos ADD COLUMN personalizacao_nome_numero BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Coluna personalizacao_nome_numero adicionada à tabela produtos';
    ELSE
        RAISE NOTICE 'Coluna personalizacao_nome_numero já existe na tabela produtos';
    END IF;
END $$;

-- 4. Criar constraint para validar marca_telemovel (apenas Apple ou Samsung)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.constraint_column_usage
        WHERE table_name = 'produtos'
        AND constraint_name = 'produtos_marca_telemovel_check'
    ) THEN
        ALTER TABLE produtos 
        ADD CONSTRAINT produtos_marca_telemovel_check 
        CHECK (marca_telemovel IS NULL OR marca_telemovel IN ('Apple', 'Samsung'));
        RAISE NOTICE 'Constraint marca_telemovel_check adicionada';
    ELSE
        RAISE NOTICE 'Constraint marca_telemovel_check já existe';
    END IF;
END $$;

-- 5. Criar índice para pesquisa por marca de telemóvel
CREATE INDEX IF NOT EXISTS idx_produtos_marca_telemovel 
ON produtos(marca_telemovel) 
WHERE marca_telemovel IS NOT NULL;

-- 6. Criar índice para pesquisa por modelo de telemóvel
CREATE INDEX IF NOT EXISTS idx_produtos_modelo_telemovel 
ON produtos(modelo_telemovel) 
WHERE modelo_telemovel IS NOT NULL;

-- 7. Criar índice para produtos com personalização
CREATE INDEX IF NOT EXISTS idx_produtos_personalizacao_nome_numero 
ON produtos(personalizacao_nome_numero) 
WHERE personalizacao_nome_numero = TRUE;

-- 8. Criar índice composto para categoria capas
CREATE INDEX IF NOT EXISTS idx_produtos_capas 
ON produtos(categoria, marca_telemovel, modelo_telemovel) 
WHERE categoria = 'capas';

-- 9. Verificar se as colunas foram criadas com sucesso
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'produtos' 
AND column_name IN ('marca_telemovel', 'modelo_telemovel', 'personalizacao_nome_numero')
ORDER BY ordinal_position;

-- 10. Mostrar estatísticas (opcional)
DO $$
DECLARE
    total_produtos INTEGER;
    total_capas INTEGER;
    total_apple INTEGER;
    total_samsung INTEGER;
    total_personalizaveis INTEGER;
BEGIN
    -- Contar produtos totais
    SELECT COUNT(*) INTO total_produtos FROM produtos;
    
    -- Contar capas
    SELECT COUNT(*) INTO total_capas 
    FROM produtos 
    WHERE categoria = 'capas';
    
    -- Contar capas Apple
    SELECT COUNT(*) INTO total_apple 
    FROM produtos 
    WHERE categoria = 'capas' AND marca_telemovel = 'Apple';
    
    -- Contar capas Samsung
    SELECT COUNT(*) INTO total_samsung 
    FROM produtos 
    WHERE categoria = 'capas' AND marca_telemovel = 'Samsung';
    
    -- Contar capas personalizáveis
    SELECT COUNT(*) INTO total_personalizaveis 
    FROM produtos 
    WHERE categoria = 'capas' AND personalizacao_nome_numero = TRUE;
    
    RAISE NOTICE '=== ESTATÍSTICAS ===';
    RAISE NOTICE 'Total de produtos: %', total_produtos;
    RAISE NOTICE 'Total de capas: %', total_capas;
    RAISE NOTICE 'Capas Apple: %', total_apple;
    RAISE NOTICE 'Capas Samsung: %', total_samsung;
    RAISE NOTICE 'Capas personalizáveis: %', total_personalizaveis;
END $$;

-- ================================
-- FIM DO SCRIPT
-- ================================

-- NOTAS DE USO:
-- 
-- Para adicionar uma capa de telemóvel:
-- 
-- INSERT INTO produtos (
--   id, nome, descricao, preco, imagem,
--   categoria, subcategoria,
--   marca_telemovel, modelo_telemovel, personalizacao_nome_numero
-- ) VALUES (
--   'capa-iphone-16-pro',
--   'Capa iPhone 16 Pro Transparente Personalizada',
--   'Capa premium com proteção total e personalização',
--   15.99,
--   '/images/capas/iphone-16-pro.jpg',
--   'capas',
--   'capas-telemovel',
--   'Apple',
--   'iPhone 16 Pro',
--   true
-- );

