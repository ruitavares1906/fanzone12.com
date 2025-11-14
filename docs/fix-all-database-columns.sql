-- Script completo para adicionar TODAS as colunas necessárias nas tabelas orders e order_items

-- ==============================================
-- TABELA ORDERS - Adicionar colunas em falta
-- ==============================================
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

    -- Adicionar colunas de endereço e custos se não existirem
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'shipping_address'
    ) THEN
        ALTER TABLE orders ADD COLUMN shipping_address JSONB;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'shipping_cost'
    ) THEN
        ALTER TABLE orders ADD COLUMN shipping_cost DECIMAL(10,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'subtotal'
    ) THEN
        ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2);
    END IF;

    -- Adicionar comentários às colunas da tabela orders
    COMMENT ON COLUMN orders.cash_on_delivery_fee IS 'Taxa adicional para pagamento à cobrança (8€)';
    COMMENT ON COLUMN orders.upfront_payment IS 'Valor pago antecipadamente (para produtos personalizados)';
    COMMENT ON COLUMN orders.remaining_payment IS 'Valor restante a pagar à cobrança';
    COMMENT ON COLUMN orders.payment_method IS 'Método de pagamento: online, cash_on_delivery';
    COMMENT ON COLUMN orders.payment_status IS 'Status do pagamento: pending, paid, partial, failed';
    COMMENT ON COLUMN orders.discount_code IS 'Código de desconto aplicado';
    COMMENT ON COLUMN orders.discount_amount IS 'Valor do desconto aplicado em euros';
    COMMENT ON COLUMN orders.order_items IS 'Itens do pedido em formato JSON';
    COMMENT ON COLUMN orders.customer_phone IS 'Telefone do cliente';
    COMMENT ON COLUMN orders.total_amount IS 'Valor total do pedido';
    COMMENT ON COLUMN orders.shipping_address IS 'Endereço de envio em formato JSON';
    COMMENT ON COLUMN orders.shipping_cost IS 'Custo de envio';
    COMMENT ON COLUMN orders.subtotal IS 'Subtotal antes de descontos e envio';

    RAISE NOTICE 'Colunas da tabela orders adicionadas com sucesso!';
END $$;

-- ==============================================
-- TABELA ORDER_ITEMS - Adicionar colunas em falta
-- ==============================================
DO $$ 
BEGIN
    -- Adicionar coluna is_personalized se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'is_personalized'
    ) THEN
        ALTER TABLE order_items ADD COLUMN is_personalized BOOLEAN DEFAULT FALSE;
    END IF;

    -- Adicionar coluna customization se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'customization'
    ) THEN
        ALTER TABLE order_items ADD COLUMN customization JSONB;
    END IF;

    -- Adicionar coluna size se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'size'
    ) THEN
        ALTER TABLE order_items ADD COLUMN size VARCHAR(10);
    END IF;

    -- Adicionar coluna unit_price se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'unit_price'
    ) THEN
        ALTER TABLE order_items ADD COLUMN unit_price DECIMAL(10,2);
    END IF;

    -- Corrigir coluna price se existir (tornar nullable e adicionar valor padrão)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'price'
    ) THEN
        -- Tornar a coluna price nullable
        ALTER TABLE order_items ALTER COLUMN price DROP NOT NULL;
        -- Adicionar valor padrão
        ALTER TABLE order_items ALTER COLUMN price SET DEFAULT 0;
    END IF;

    -- Adicionar coluna total_price se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'total_price'
    ) THEN
        ALTER TABLE order_items ADD COLUMN total_price DECIMAL(10,2);
    END IF;

    -- Adicionar coluna product_name se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'product_name'
    ) THEN
        ALTER TABLE order_items ADD COLUMN product_name VARCHAR(255);
    END IF;

    -- Adicionar comentários às colunas da tabela order_items
    COMMENT ON COLUMN order_items.is_personalized IS 'Indica se o item tem personalização';
    COMMENT ON COLUMN order_items.customization IS 'Detalhes da personalização em formato JSON';
    COMMENT ON COLUMN order_items.size IS 'Tamanho do produto';
    COMMENT ON COLUMN order_items.unit_price IS 'Preço unitário do produto';
    COMMENT ON COLUMN order_items.total_price IS 'Preço total (unit_price * quantity)';
    COMMENT ON COLUMN order_items.product_name IS 'Nome do produto';

    RAISE NOTICE 'Colunas da tabela order_items adicionadas com sucesso!';
END $$;

-- ==============================================
-- VERIFICAÇÃO FINAL - Listar todas as colunas
-- ==============================================

-- Verificar colunas da tabela orders
SELECT 'ORDERS TABLE' as table_name, column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'orders'
  AND column_name IN (
    'cash_on_delivery_fee', 'upfront_payment', 'remaining_payment', 
    'payment_method', 'payment_status', 'discount_code', 'discount_amount', 
    'order_items', 'customer_phone', 'total_amount', 'shipping_address', 
    'shipping_cost', 'subtotal'
  )
ORDER BY column_name;

-- Verificar colunas da tabela order_items
SELECT 'ORDER_ITEMS TABLE' as table_name, column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'order_items'
  AND column_name IN (
    'is_personalized', 'customization', 'size', 'unit_price', 
    'total_price', 'product_name'
  )
ORDER BY column_name;

-- Mensagem final
SELECT 'SCRIPT EXECUTADO COM SUCESSO!' as status;
