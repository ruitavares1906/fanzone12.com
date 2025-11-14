-- Criar tabela para controlar pagamentos dos parceiros
CREATE TABLE IF NOT EXISTS partner_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_reference TEXT,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices únicos para evitar duplicatas
  UNIQUE(partner_id, period_start, period_end)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_partner_payments_partner_id ON partner_payments(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_payments_period ON partner_payments(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_partner_payments_is_paid ON partner_payments(is_paid);
CREATE INDEX IF NOT EXISTS idx_partner_payments_paid_at ON partner_payments(paid_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_partner_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_partner_payments_updated_at ON partner_payments;
CREATE TRIGGER trigger_update_partner_payments_updated_at
  BEFORE UPDATE ON partner_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_partner_payments_updated_at();

-- RLS (Row Level Security) - apenas admins podem acessar
ALTER TABLE partner_payments ENABLE ROW LEVEL SECURITY;

-- Política para admins
CREATE POLICY "Admins can manage partner payments" ON partner_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        'admin@camisolas.pt',
        'rui@camisolas.pt'
      )
    )
  );

-- Comentários para documentação
COMMENT ON TABLE partner_payments IS 'Controla os pagamentos das comissões aos parceiros';
COMMENT ON COLUMN partner_payments.partner_id IS 'ID do parceiro';
COMMENT ON COLUMN partner_payments.period_start IS 'Data de início do período de comissões';
COMMENT ON COLUMN partner_payments.period_end IS 'Data de fim do período de comissões';
COMMENT ON COLUMN partner_payments.commission_amount IS 'Valor da comissão a pagar';
COMMENT ON COLUMN partner_payments.is_paid IS 'Se o pagamento foi efetuado';
COMMENT ON COLUMN partner_payments.paid_at IS 'Data e hora do pagamento';
COMMENT ON COLUMN partner_payments.payment_reference IS 'Referência do pagamento (MB WAY, transferência, etc.)';
COMMENT ON COLUMN partner_payments.payment_method IS 'Método de pagamento utilizado';
COMMENT ON COLUMN partner_payments.notes IS 'Notas adicionais sobre o pagamento';
