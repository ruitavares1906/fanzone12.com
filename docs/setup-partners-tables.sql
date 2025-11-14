-- Extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de parceiros
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  discount_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_partners_discount_code ON partners(discount_code);

-- Adicionar coluna discount_code em orders (para tracking do parceiro)
ALTER TABLE IF EXISTS orders
  ADD COLUMN IF NOT EXISTS discount_code TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON orders(discount_code);

-- Tabela opcional de comissões dos parceiros
CREATE TABLE IF NOT EXISTS partner_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  commission_value DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(order_id)
);

CREATE INDEX IF NOT EXISTS idx_partner_commissions_partner_id ON partner_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_commissions_created_at ON partner_commissions(created_at);


