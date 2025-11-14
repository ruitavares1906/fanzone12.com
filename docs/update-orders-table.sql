-- SQL para atualizar a tabela orders com o campo is_upfront_payment
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar campo is_upfront_payment na tabela orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_upfront_payment BOOLEAN DEFAULT FALSE;

-- 2. Adicionar comentário para documentar o campo
COMMENT ON COLUMN orders.is_upfront_payment IS 'Indica se é um pagamento antecipado (8€) ou pagamento completo';

-- 3. Criar índice para melhor performance em queries
CREATE INDEX IF NOT EXISTS idx_orders_is_upfront_payment ON orders(is_upfront_payment);

-- 4. Verificar se existem outros campos necessários (adicionar se não existirem)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cash_on_delivery_fee DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS upfront_payment DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS remaining_payment DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2) DEFAULT 0;

-- 5. Verificar estrutura da tabela order_items (se necessário)
-- A tabela order_items deve ter estes campos:
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  customization TEXT,
  is_personalized BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_name ON order_items(product_name);
CREATE INDEX IF NOT EXISTS idx_order_items_is_personalized ON order_items(is_personalized);

-- 7. Verificar se a tabela orders tem todos os campos necessários
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 8. Verificar se a tabela order_items tem todos os campos necessários
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 9. Atualizar registros existentes (se necessário)
-- Marcar pedidos existentes como não antecipados se o campo for NULL
UPDATE orders 
SET is_upfront_payment = FALSE 
WHERE is_upfront_payment IS NULL;

-- 10. Verificar dados após atualização
SELECT 
  COUNT(*) as total_orders,
  COUNT(CASE WHEN is_upfront_payment = TRUE THEN 1 END) as upfront_payments,
  COUNT(CASE WHEN is_upfront_payment = FALSE THEN 1 END) as full_payments
FROM orders;
