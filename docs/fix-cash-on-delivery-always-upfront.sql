-- Script para adicionar colunas necessárias para pagamento à cobrança sempre antecipado
-- Execute este script no Supabase SQL Editor

-- Verificar se as colunas já existem antes de adicionar
DO $$ 
BEGIN
    -- Adicionar colunas de pagamento à cobrança
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'cash_on_delivery_fee'
    ) THEN
        ALTER TABLE orders ADD COLUMN cash_on_delivery_fee DECIMAL(10,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'upfront_payment'
    ) THEN
        ALTER TABLE orders ADD COLUMN upfront_payment DECIMAL(10,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'remaining_payment'
    ) THEN
        ALTER TABLE orders ADD COLUMN remaining_payment DECIMAL(10,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'online';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_status'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending';
    END IF;

    -- Adicionar colunas de desconto
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'discount_code'
    ) THEN
        ALTER TABLE orders ADD COLUMN discount_code VARCHAR(50);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'discount_amount'
    ) THEN
        ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
    END IF;

    -- Adicionar colunas de itens e contacto
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'order_items'
    ) THEN
        ALTER TABLE orders ADD COLUMN order_items JSONB;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'customer_phone'
    ) THEN
        ALTER TABLE orders ADD COLUMN customer_phone VARCHAR(20);
    END IF;

    -- Adicionar coluna total_amount se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'total_amount'
    ) THEN
        ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2);
    END IF;

    -- Adicionar coluna subtotal se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'subtotal'
    ) THEN
        ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2);
    END IF;

    -- Adicionar coluna shipping_cost se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'shipping_cost'
    ) THEN
        ALTER TABLE orders ADD COLUMN shipping_cost DECIMAL(10,2) DEFAULT 0;
    END IF;

    -- Adicionar comentários às colunas
    COMMENT ON COLUMN orders.cash_on_delivery_fee IS 'Taxa adicional para pagamento à cobrança (8€)';
    COMMENT ON COLUMN orders.upfront_payment IS 'Valor pago antecipadamente (sempre 8€ para pagamento à cobrança)';
    COMMENT ON COLUMN orders.remaining_payment IS 'Valor restante a pagar à cobrança (total - 8€)';
    COMMENT ON COLUMN orders.payment_method IS 'Método de pagamento: online, cash_on_delivery';
    COMMENT ON COLUMN orders.payment_status IS 'Status do pagamento: pending, paid, partial, failed';
    COMMENT ON COLUMN orders.discount_code IS 'Código de desconto aplicado';
    COMMENT ON COLUMN orders.discount_amount IS 'Valor do desconto aplicado em euros';
    COMMENT ON COLUMN orders.order_items IS 'Itens do pedido em formato JSON';
    COMMENT ON COLUMN orders.customer_phone IS 'Telefone do cliente';
    COMMENT ON COLUMN orders.total_amount IS 'Valor total do pedido';
    COMMENT ON COLUMN orders.subtotal IS 'Subtotal dos itens (antes de descontos)';
    COMMENT ON COLUMN orders.shipping_cost IS 'Custo de envio';

    RAISE NOTICE 'Todas as colunas necessárias foram adicionadas com sucesso!';
END $$;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'orders'
  AND column_name IN (
    'cash_on_delivery_fee', 'upfront_payment', 'remaining_payment', 
    'payment_method', 'payment_status', 'discount_code', 'discount_amount', 
    'order_items', 'customer_phone', 'total_amount', 'subtotal', 'shipping_cost'
  )
ORDER BY column_name;
