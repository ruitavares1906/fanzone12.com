-- =====================================================
-- SQL - RANKING MENSAL COM RESET DIA 1 DE CADA MÊS
-- =====================================================

-- Função para obter o primeiro dia do mês atual
CREATE OR REPLACE FUNCTION get_current_month_start()
RETURNS DATE AS $$
BEGIN
  RETURN DATE_TRUNC('month', CURRENT_DATE)::DATE;
END;
$$ LANGUAGE plpgsql;

-- Função para obter o último dia do mês atual
CREATE OR REPLACE FUNCTION get_current_month_end()
RETURNS DATE AS $$
BEGIN
  RETURN (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
END;
$$ LANGUAGE plpgsql;

-- Função para obter o primeiro dia do mês anterior
CREATE OR REPLACE FUNCTION get_previous_month_start()
RETURNS DATE AS $$
BEGIN
  RETURN (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month')::DATE;
END;
$$ LANGUAGE plpgsql;

-- Função para obter o último dia do mês anterior
CREATE OR REPLACE FUNCTION get_previous_month_end()
RETURNS DATE AS $$
BEGIN
  RETURN (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 day')::DATE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- QUERY: Ranking Mensal Atual (Dia 1 até hoje)
-- =====================================================
SELECT 
  p.name as partner_name,
  p.discount_code,
  COUNT(o.id) as orders_count,
  SUM(o.total) as total_sales,
  ROUND(SUM(o.total) * 0.10, 2) as commission_10_percent,
  ROW_NUMBER() OVER (ORDER BY SUM(o.total) DESC) as monthly_rank,
  get_current_month_start() as month_start,
  CURRENT_DATE as month_end,
  EXTRACT(DAY FROM CURRENT_DATE) as days_into_month
FROM partners p
LEFT JOIN orders o ON p.discount_code = o.discount_code
  AND o.payment_status = 'paid'
  AND o.created_at >= get_current_month_start()
  AND o.created_at <= CURRENT_DATE + INTERVAL '23:59:59'
WHERE p.discount_code IS NOT NULL
GROUP BY p.id, p.name, p.discount_code
HAVING SUM(o.total) > 0
ORDER BY total_sales DESC;

-- =====================================================
-- QUERY: Ranking Mensal Anterior (Mês Completo)
-- =====================================================
SELECT 
  p.name as partner_name,
  p.discount_code,
  COUNT(o.id) as orders_count,
  SUM(o.total) as total_sales,
  ROUND(SUM(o.total) * 0.10, 2) as commission_10_percent,
  ROW_NUMBER() OVER (ORDER BY SUM(o.total) DESC) as monthly_rank,
  get_previous_month_start() as month_start,
  get_previous_month_end() as month_end
FROM partners p
LEFT JOIN orders o ON p.discount_code = o.discount_code
  AND o.payment_status = 'paid'
  AND o.created_at >= get_previous_month_start()
  AND o.created_at <= get_previous_month_end() + INTERVAL '23:59:59'
WHERE p.discount_code IS NOT NULL
GROUP BY p.id, p.name, p.discount_code
HAVING SUM(o.total) > 0
ORDER BY total_sales DESC;

-- =====================================================
-- QUERY: Último Vencedor do Mês Anterior
-- =====================================================
WITH previous_month_winner AS (
  SELECT 
    p.name as partner_name,
    p.discount_code,
    COUNT(o.id) as orders_count,
    SUM(o.total) as total_sales,
    ROUND(SUM(o.total) * 0.10, 2) as commission_10_percent,
    ROW_NUMBER() OVER (ORDER BY SUM(o.total) DESC) as monthly_rank,
    get_previous_month_start() as month_start,
    get_previous_month_end() as month_end
  FROM partners p
  LEFT JOIN orders o ON p.discount_code = o.discount_code
    AND o.payment_status = 'paid'
    AND o.created_at >= get_previous_month_start()
    AND o.created_at <= get_previous_month_end() + INTERVAL '23:59:59'
  WHERE p.discount_code IS NOT NULL
  GROUP BY p.id, p.name, p.discount_code
  HAVING SUM(o.total) > 0
  ORDER BY total_sales DESC
  LIMIT 1
)
SELECT 
  partner_name,
  discount_code,
  orders_count,
  total_sales,
  commission_10_percent,
  monthly_rank,
  month_start,
  month_end,
  '🏆 VENCEDOR DO MÊS ANTERIOR' as status
FROM previous_month_winner;

-- =====================================================
-- QUERY: Comparação Mês Atual vs Mês Anterior
-- =====================================================
WITH current_month AS (
  SELECT 
    p.id as partner_id,
    p.name as partner_name,
    p.discount_code,
    COUNT(o.id) as orders_count,
    COALESCE(SUM(o.total), 0) as total_sales,
    ROUND(COALESCE(SUM(o.total), 0) * 0.10, 2) as commission
  FROM partners p
  LEFT JOIN orders o ON p.discount_code = o.discount_code
    AND o.payment_status = 'paid'
    AND o.created_at >= get_current_month_start()
    AND o.created_at <= CURRENT_DATE + INTERVAL '23:59:59'
  WHERE p.discount_code IS NOT NULL
  GROUP BY p.id, p.name, p.discount_code
),
previous_month AS (
  SELECT 
    p.id as partner_id,
    p.name as partner_name,
    p.discount_code,
    COUNT(o.id) as orders_count,
    COALESCE(SUM(o.total), 0) as total_sales,
    ROUND(COALESCE(SUM(o.total), 0) * 0.10, 2) as commission
  FROM partners p
  LEFT JOIN orders o ON p.discount_code = o.discount_code
    AND o.payment_status = 'paid'
    AND o.created_at >= get_previous_month_start()
    AND o.created_at <= get_previous_month_end() + INTERVAL '23:59:59'
  WHERE p.discount_code IS NOT NULL
  GROUP BY p.id, p.name, p.discount_code
)
SELECT 
  COALESCE(cm.partner_name, pm.partner_name) as partner_name,
  COALESCE(cm.discount_code, pm.discount_code) as discount_code,
  COALESCE(cm.total_sales, 0) as current_month_sales,
  COALESCE(cm.commission, 0) as current_month_commission,
  COALESCE(pm.total_sales, 0) as previous_month_sales,
  COALESCE(pm.commission, 0) as previous_month_commission,
  COALESCE(cm.total_sales, 0) - COALESCE(pm.total_sales, 0) as sales_difference,
  COALESCE(cm.commission, 0) - COALESCE(pm.commission, 0) as commission_difference,
  CASE 
    WHEN COALESCE(pm.total_sales, 0) = 0 AND COALESCE(cm.total_sales, 0) > 0 THEN 100.0
    WHEN COALESCE(pm.total_sales, 0) = 0 THEN 0.0
    ELSE ROUND(((COALESCE(cm.total_sales, 0) - COALESCE(pm.total_sales, 0)) / pm.total_sales) * 100, 2)
  END as percentage_change,
  get_current_month_start() as current_month_start,
  CURRENT_DATE as current_month_end,
  get_previous_month_start() as previous_month_start,
  get_previous_month_end() as previous_month_end
FROM current_month cm
FULL OUTER JOIN previous_month pm ON cm.partner_id = pm.partner_id
WHERE COALESCE(cm.total_sales, 0) > 0 OR COALESCE(pm.total_sales, 0) > 0
ORDER BY current_month_sales DESC;

-- =====================================================
-- QUERY: Histórico de Rankings Mensais (Últimos 6 meses)
-- =====================================================
WITH month_ranges AS (
  SELECT 
    generate_series(
      DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months',
      DATE_TRUNC('month', CURRENT_DATE),
      INTERVAL '1 month'
    )::DATE as month_start
),
monthly_rankings AS (
  SELECT 
    mr.month_start,
    (mr.month_start + INTERVAL '1 month' - INTERVAL '1 day')::DATE as month_end,
    p.name as partner_name,
    p.discount_code,
    COUNT(o.id) as orders_count,
    COALESCE(SUM(o.total), 0) as total_sales,
    ROUND(COALESCE(SUM(o.total), 0) * 0.10, 2) as commission,
    ROW_NUMBER() OVER (PARTITION BY mr.month_start ORDER BY COALESCE(SUM(o.total), 0) DESC) as monthly_rank
  FROM month_ranges mr
  CROSS JOIN partners p
  LEFT JOIN orders o ON p.discount_code = o.discount_code
    AND o.payment_status = 'paid'
    AND o.created_at >= mr.month_start
    AND o.created_at <= mr.month_start + INTERVAL '1 month' - INTERVAL '1 day' + INTERVAL '23:59:59'
  WHERE p.discount_code IS NOT NULL
  GROUP BY mr.month_start, p.id, p.name, p.discount_code
  HAVING COALESCE(SUM(o.total), 0) > 0
)
SELECT 
  month_start,
  month_end,
  partner_name,
  discount_code,
  orders_count,
  total_sales,
  commission,
  monthly_rank,
  CASE WHEN monthly_rank = 1 THEN '🏆' ELSE '' END as winner_badge
FROM monthly_rankings
ORDER BY month_start DESC, monthly_rank ASC;

-- =====================================================
-- QUERY: Dashboard Completo - Resumo Mensal
-- =====================================================
WITH current_month_stats AS (
  SELECT 
    COUNT(DISTINCT p.id) as total_partners,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_sales,
    COALESCE(SUM(o.total) * 0.10, 0) as total_commissions,
    MAX(o.total) as highest_order,
    AVG(o.total) as average_order
  FROM partners p
  LEFT JOIN orders o ON p.discount_code = o.discount_code
    AND o.payment_status = 'paid'
    AND o.created_at >= get_current_month_start()
    AND o.created_at <= CURRENT_DATE + INTERVAL '23:59:59'
  WHERE p.discount_code IS NOT NULL
),
previous_month_stats AS (
  SELECT 
    COUNT(DISTINCT p.id) as total_partners,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_sales,
    COALESCE(SUM(o.total) * 0.10, 0) as total_commissions
  FROM partners p
  LEFT JOIN orders o ON p.discount_code = o.discount_code
    AND o.payment_status = 'paid'
    AND o.created_at >= get_previous_month_start()
    AND o.created_at <= get_previous_month_end() + INTERVAL '23:59:59'
  WHERE p.discount_code IS NOT NULL
)
SELECT 
  'MÊS ATUAL' as period,
  cms.total_partners,
  cms.total_orders,
  ROUND(cms.total_sales, 2) as total_sales,
  ROUND(cms.total_commissions, 2) as total_commissions,
  ROUND(cms.highest_order, 2) as highest_order,
  ROUND(cms.average_order, 2) as average_order,
  get_current_month_start() as period_start,
  CURRENT_DATE as period_end
FROM current_month_stats cms
UNION ALL
SELECT 
  'MÊS ANTERIOR' as period,
  pms.total_partners,
  pms.total_orders,
  ROUND(pms.total_sales, 2) as total_sales,
  ROUND(pms.total_commissions, 2) as total_commissions,
  NULL as highest_order,
  NULL as average_order,
  get_previous_month_start() as period_start,
  get_previous_month_end() as period_end
FROM previous_month_stats pms;
