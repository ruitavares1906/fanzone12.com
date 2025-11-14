-- Adicionar colunas de desconto na tabela orders

-- Verificar se as colunas já existem antes de adicionar
DO $$ 
BEGIN
    -- Adicionar coluna discount_code se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'discount_code'
    ) THEN
        ALTER TABLE orders ADD COLUMN discount_code VARCHAR(50);
    END IF;

    -- Adicionar coluna discount_amount se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'discount_amount'
    ) THEN
        ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
    END IF;

    -- Adicionar coluna order_items se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'order_items'
    ) THEN
        ALTER TABLE orders ADD COLUMN order_items JSONB;
    END IF;

    -- Adicionar coluna customer_phone se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'customer_phone'
    ) THEN
        ALTER TABLE orders ADD COLUMN customer_phone VARCHAR(20);
    END IF;

    -- Adicionar comentários às colunas
    COMMENT ON COLUMN orders.discount_code IS 'Código de desconto aplicado';
    COMMENT ON COLUMN orders.discount_amount IS 'Valor do desconto aplicado em euros';
    COMMENT ON COLUMN orders.order_items IS 'Itens do pedido em formato JSON';
    COMMENT ON COLUMN orders.customer_phone IS 'Telefone do cliente';

    RAISE NOTICE 'Colunas de desconto adicionadas com sucesso!';
END $$;
