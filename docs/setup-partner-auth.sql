-- =====================================================
-- CONFIGURAÇÃO DE AUTENTICAÇÃO INDIVIDUAL PARA PARCEIROS
-- =====================================================

-- 1. Adicionar coluna user_id na tabela partners para vincular com auth.users
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Adicionar colunas de autenticação na tabela partners
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Criar índice para user_id
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);

-- 4. Habilitar RLS na tabela partners
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- 5. Remover políticas existentes para evitar duplicação
DROP POLICY IF EXISTS "Parceiros podem ver apenas seus próprios dados" ON partners;
DROP POLICY IF EXISTS "Parceiros podem atualizar apenas seus próprios dados" ON partners;
DROP POLICY IF EXISTS "Admins podem ver todos os parceiros" ON partners;

-- 6. Criar políticas de segurança
-- Política para parceiros verem apenas seus próprios dados
CREATE POLICY "Parceiros podem ver apenas seus próprios dados"
  ON partners FOR SELECT
  USING (auth.uid() = user_id);

-- Política para parceiros atualizarem apenas seus próprios dados
CREATE POLICY "Parceiros podem atualizar apenas seus próprios dados"
  ON partners FOR UPDATE
  USING (auth.uid() = user_id);

-- Política para admins verem todos os parceiros
CREATE POLICY "Admins podem ver todos os parceiros"
  ON partners FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- 7. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_partners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_partners_updated_at ON partners;
CREATE TRIGGER trigger_update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_partners_updated_at();

-- 9. Criar função para vincular parceiro com usuário autenticado
CREATE OR REPLACE FUNCTION link_partner_to_user(
  partner_email TEXT,
  partner_discount_code TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  partner_record RECORD;
  user_record RECORD;
BEGIN
  -- Buscar o parceiro pelo email ou código de desconto
  SELECT * INTO partner_record 
  FROM partners 
  WHERE email = partner_email OR discount_code = partner_discount_code;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Parceiro não encontrado';
  END IF;
  
  -- Buscar o usuário autenticado
  SELECT * INTO user_record 
  FROM auth.users 
  WHERE id = auth.uid();
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;
  
  -- Vincular o parceiro ao usuário
  UPDATE partners 
  SET user_id = auth.uid(), 
      email = COALESCE(partner_record.email, user_record.email),
      updated_at = NOW()
  WHERE id = partner_record.id;
  
  RETURN TRUE;
END;
$$;

-- 10. Criar função para obter dados do parceiro autenticado
CREATE OR REPLACE FUNCTION get_authenticated_partner_data()
RETURNS TABLE (
  id UUID,
  name TEXT,
  discount_code TEXT,
  email TEXT,
  is_active BOOLEAN,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.discount_code,
    p.email,
    p.is_active,
    p.last_login,
    p.created_at,
    p.updated_at
  FROM partners p
  WHERE p.user_id = auth.uid();
END;
$$;

-- 11. Criar função para obter ranking mensal limitado (top 3)
CREATE OR REPLACE FUNCTION get_monthly_ranking_top3()
RETURNS TABLE (
  rank INTEGER,
  partner_name TEXT,
  total_faturado DECIMAL(10,2),
  discount_code TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  start_date TIMESTAMP WITH TIME ZONE;
  end_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calcular período do mês atual
  start_date := date_trunc('month', NOW());
  end_date := date_trunc('month', NOW()) + interval '1 month' - interval '1 second';
  
  RETURN QUERY
  WITH partner_totals AS (
    SELECT 
      p.name as partner_name,
      p.discount_code,
      COALESCE(SUM(o.total), 0) as total_faturado
    FROM partners p
    LEFT JOIN orders o ON o.discount_code = p.discount_code 
      AND o.payment_status = 'paid'
      AND o.created_at >= start_date 
      AND o.created_at <= end_date
    GROUP BY p.id, p.name, p.discount_code
  )
  SELECT 
    ROW_NUMBER() OVER (ORDER BY total_faturado DESC)::INTEGER as rank,
    partner_name,
    total_faturado,
    discount_code
  FROM partner_totals
  WHERE total_faturado > 0
  ORDER BY total_faturado DESC
  LIMIT 3;
END;
$$;

-- 12. Criar função para obter dados do parceiro autenticado com estatísticas
CREATE OR REPLACE FUNCTION get_partner_stats()
RETURNS TABLE (
  partner_id UUID,
  partner_name TEXT,
  discount_code TEXT,
  total_mensal DECIMAL(10,2),
  total_semanal DECIMAL(10,2),
  total_geral DECIMAL(10,2),
  comissao_mensal DECIMAL(10,2),
  comissao_semanal DECIMAL(10,2),
  comissao_geral DECIMAL(10,2),
  rank_mensal INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  partner_user_id UUID;
  start_of_month TIMESTAMP WITH TIME ZONE;
  start_of_week TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Obter ID do parceiro autenticado
  SELECT user_id INTO partner_user_id 
  FROM partners 
  WHERE user_id = auth.uid();
  
  IF partner_user_id IS NULL THEN
    RAISE EXCEPTION 'Parceiro não encontrado ou não autenticado';
  END IF;
  
  -- Calcular períodos
  start_of_month := date_trunc('month', NOW());
  start_of_week := date_trunc('week', NOW());
  
  RETURN QUERY
  WITH partner_data AS (
    SELECT p.id, p.name, p.discount_code
    FROM partners p
    WHERE p.user_id = auth.uid()
  ),
  monthly_stats AS (
    SELECT 
      COALESCE(SUM(o.total), 0) as total_mensal,
      COALESCE(SUM(o.total * 0.10), 0) as comissao_mensal
    FROM partner_data pd
    LEFT JOIN orders o ON o.discount_code = pd.discount_code 
      AND o.payment_status = 'paid'
      AND o.created_at >= start_of_month
  ),
  weekly_stats AS (
    SELECT 
      COALESCE(SUM(o.total), 0) as total_semanal,
      COALESCE(SUM(o.total * 0.10), 0) as comissao_semanal
    FROM partner_data pd
    LEFT JOIN orders o ON o.discount_code = pd.discount_code 
      AND o.payment_status = 'paid'
      AND o.created_at >= start_of_week
  ),
  total_stats AS (
    SELECT 
      COALESCE(SUM(o.total), 0) as total_geral,
      COALESCE(SUM(o.total * 0.10), 0) as comissao_geral
    FROM partner_data pd
    LEFT JOIN orders o ON o.discount_code = pd.discount_code 
      AND o.payment_status = 'paid'
  ),
  ranking AS (
    SELECT 
      ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(o.total), 0) DESC) as rank_mensal
    FROM partners p
    LEFT JOIN orders o ON o.discount_code = p.discount_code 
      AND o.payment_status = 'paid'
      AND o.created_at >= start_of_month
    GROUP BY p.id
    HAVING p.user_id = auth.uid()
  )
  SELECT 
    pd.id as partner_id,
    pd.name as partner_name,
    pd.discount_code,
    ms.total_mensal,
    ws.total_semanal,
    ts.total_geral,
    ms.comissao_mensal,
    ws.comissao_semanal,
    ts.comissao_geral,
    r.rank_mensal
  FROM partner_data pd
  CROSS JOIN monthly_stats ms
  CROSS JOIN weekly_stats ws
  CROSS JOIN total_stats ts
  CROSS JOIN ranking r;
END;
$$;

-- 13. Atualizar último login quando parceiro acessa
CREATE OR REPLACE FUNCTION update_partner_last_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE partners 
  SET last_login = NOW()
  WHERE user_id = auth.uid();
  
  RETURN NEW;
END;
$$;

-- 14. Criar trigger para atualizar último login (removido - triggers não podem ser AFTER SELECT)
-- DROP TRIGGER IF EXISTS trigger_update_partner_last_login ON partners;
-- CREATE TRIGGER trigger_update_partner_last_login
--   AFTER SELECT ON partners
--   FOR EACH ROW
--   EXECUTE FUNCTION update_partner_last_login();
-- 
-- NOTA: Triggers AFTER SELECT não são suportados no PostgreSQL.
-- O último login deve ser atualizado através de uma função chamada explicitamente
-- ou através de um trigger em UPDATE quando o usuário faz login.

-- 15. Comentários finais
COMMENT ON FUNCTION link_partner_to_user IS 'Vincula um parceiro existente a um usuário autenticado';
COMMENT ON FUNCTION get_authenticated_partner_data IS 'Retorna dados do parceiro autenticado';
COMMENT ON FUNCTION get_monthly_ranking_top3 IS 'Retorna ranking mensal limitado ao top 3';
COMMENT ON FUNCTION get_partner_stats IS 'Retorna estatísticas completas do parceiro autenticado';

