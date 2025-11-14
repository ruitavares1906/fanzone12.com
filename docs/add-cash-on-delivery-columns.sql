-- Adicionar colunas necessárias para pagamento à cobrança na tabela orders

-- Verificar se as colunas já existem antes de adicionar
DO $$ 
BEGIN
    -- Adicionar coluna cash_on_delivery_fee se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'cash_on_delivery_fee'
    ) THEN
        ALTER TABLE orders ADD COLUMN cash_on_delivery_fee DECIMAL(10,2) DEFAULT 0;
    END IF;

    -- Adicionar coluna upfront_payment se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'upfront_payment'
    ) THEN
        ALTER TABLE orders ADD COLUMN upfront_payment DECIMAL(10,2) DEFAULT 0;
    END IF;

    -- Adicionar coluna remaining_payment se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'remaining_payment'
    ) THEN
        ALTER TABLE orders ADD COLUMN remaining_payment DECIMAL(10,2) DEFAULT 0;
    END IF;

    -- Adicionar coluna payment_method se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'online';
    END IF;

    -- Adicionar coluna payment_status se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_status'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending';
    END IF;

    -- Adicionar comentários às colunas
    COMMENT ON COLUMN orders.cash_on_delivery_fee IS 'Taxa adicional para pagamento à cobrança (8€)';
    COMMENT ON COLUMN orders.upfront_payment IS 'Valor pago antecipadamente (para produtos personalizados)';
    COMMENT ON COLUMN orders.remaining_payment IS 'Valor restante a pagar à cobrança';
    COMMENT ON COLUMN orders.payment_method IS 'Método de pagamento: online, cash_on_delivery';
    COMMENT ON COLUMN orders.payment_status IS 'Status do pagamento: pending, paid, partial, failed';

    RAISE NOTICE 'Colunas de pagamento à cobrança adicionadas com sucesso!';
END $$;
