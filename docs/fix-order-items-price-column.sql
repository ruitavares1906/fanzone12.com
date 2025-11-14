-- Script para corrigir o problema da coluna price na tabela order_items

-- Verificar se a coluna price existe e se tem restrições NOT NULL
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'order_items'
  AND column_name IN ('price', 'unit_price');

-- Se a coluna price existir e não permitir NULL, vamos torná-la nullable ou adicionar valor padrão
DO $$ 
BEGIN
    -- Verificar se a coluna price existe
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'order_items' 
        AND column_name = 'price'
    ) THEN
        -- Tornar a coluna price nullable se não for
        ALTER TABLE order_items ALTER COLUMN price DROP NOT NULL;
        
        -- Adicionar valor padrão se não existir
        ALTER TABLE order_items ALTER COLUMN price SET DEFAULT 0;
        
        RAISE NOTICE 'Coluna price corrigida - agora permite NULL e tem valor padrão 0';
    ELSE
        RAISE NOTICE 'Coluna price não existe - será criada se necessário';
    END IF;
END $$;

-- Verificar se a coluna unit_price existe, se não existir, criar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'order_items' 
        AND column_name = 'unit_price'
    ) THEN
        ALTER TABLE order_items ADD COLUMN unit_price DECIMAL(10,2);
        RAISE NOTICE 'Coluna unit_price criada';
    ELSE
        RAISE NOTICE 'Coluna unit_price já existe';
    END IF;
END $$;

-- Verificar estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'order_items'
  AND column_name IN ('price', 'unit_price', 'total_price')
ORDER BY column_name;
