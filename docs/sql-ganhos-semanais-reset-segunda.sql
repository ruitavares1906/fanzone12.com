-- =====================================================
-- SQL - GANHOS SEMANAIS COM RESET ÀS 00:00H DE SEGUNDA-FEIRA
-- =====================================================

-- Função para calcular o início da semana atual (Segunda-feira às 00:00h)
CREATE OR REPLACE FUNCTION get_current_week_start()
RETURNS DATE AS $$
BEGIN
  -- Obter o dia da semana atual (0=Domingo, 1=Segunda, ..., 6=Sábado)
  -- Ajustar para que Segunda = 0, Domingo = 6
  RETURN CURRENT_DATE - (EXTRACT(DOW FROM CURRENT_DATE)::INTEGER + 6) % 7;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular o fim da semana atual (Domingo às 23:59h)
CREATE OR REPLACE FUNCTION get_current_week_end()
RETURNS DATE AS $$
BEGIN
  RETURN get_current_week_start() + INTERVAL '6 days';
END;
$$ LANGUAGE plpgsql;

-- Função para calcular o início da semana anterior (Segunda-feira às 00:00h)
CREATE OR REPLACE FUNCTION get_previous_week_start()
RETURNS DATE AS $$
BEGIN
  RETURN get_current_week_start() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Função para calcular o fim da semana anterior (Domingo às 23:59h)
CREATE OR REPLACE FUNCTION get_previous_week_end()
RETURNS DATE AS $$
BEGIN
  RETURN get_previous_week_start() + INTERVAL '6 days';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- QUERY: Ganhos da Semana Atual (Segunda-feira a Domingo)
-- =====================================================
SELECT 
  p.name as partner_name,
  p.discount_code,
  COUNT(o.id) as orders_count,
  SUM(o.total) as total_sales,
  ROUND(SUM(o.total) * 0.10, 2) as commission_10_percent,
  get_current_week_start() as week_start,
  get_current_week_end() as week_end
FROM partners p
LEFT JOIN orders o ON p.discount_code = o.discount_code
  AND o.payment_status = 'paid'
  AND o.created_at >= get_current_week_start()
  AND o.created_at <= get_current_week_end() + INTERVAL '23:59:59'
WHERE p.discount_code IS NOT NULL
GROUP BY p.id, p.name, p.discount_code
HAVING SUM(o.total) > 0
ORDER BY total_sales DESC;

-- =====================================================
-- QUERY: Ganhos da Semana Anterior (Segunda-feira a Domingo)
-- =====================================================
SELECT 
  p.name as partner_name,
  p.discount_code,
  COUNT(o.id) as orders_count,
  SUM(o.total) as total_sales,
  ROUND(SUM(o.total) * 0.10, 2) as commission_10_percent,
  get_previous_week_start() as week_start,
  get_previous_week_end() as week_end
FROM partners p
LEFT JOIN orders o ON p.discount_code = o.discount_code
  AND o.payment_status = 'paid'
  AND o.created_at >= get_previous_week_start()
  AND o.created_at <= get_previous_week_end() + INTERVAL '23:59:59'
WHERE p.discount_code IS NOT NULL
GROUP BY p.id, p.name, p.discount_code
HAVING SUM(o.total) > 0
ORDER BY total_sales DESC;

-- =====================================================
-- QUERY: Comparação Semana Atual vs Semana Anterior
-- =====================================================
WITH current_week AS (
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
    AND o.created_at >= get_current_week_start()
    AND o.created_at <= get_current_week_end() + INTERVAL '23:59:59'
  WHERE p.discount_code IS NOT NULL
  GROUP BY p.id, p.name, p.discount_code
),
previous_week AS (
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
    AND o.created_at >= get_previous_week_start()
    AND o.created_at <= get_previous_week_end() + INTERVAL '23:59:59'
  WHERE p.discount_code IS NOT NULL
  GROUP BY p.id, p.name, p.discount_code
)
SELECT 
  COALESCE(cw.partner_name, pw.partner_name) as partner_name,
  COALESCE(cw.discount_code, pw.discount_code) as discount_code,
  COALESCE(cw.total_sales, 0) as current_week_sales,
  COALESCE(cw.commission, 0) as current_week_commission,
  COALESCE(pw.total_sales, 0) as previous_week_sales,
  COALESCE(pw.commission, 0) as previous_week_commission,
  COALESCE(cw.total_sales, 0) - COALESCE(pw.total_sales, 0) as sales_difference,
  COALESCE(cw.commission, 0) - COALESCE(pw.commission, 0) as commission_difference,
  CASE 
    WHEN COALESCE(pw.total_sales, 0) = 0 AND COALESCE(cw.total_sales, 0) > 0 THEN 100.0
    WHEN COALESCE(pw.total_sales, 0) = 0 THEN 0.0
    ELSE ROUND(((COALESCE(cw.total_sales, 0) - COALESCE(pw.total_sales, 0)) / pw.total_sales) * 100, 2)
  END as percentage_change,
  get_current_week_start() as current_week_start,
  get_current_week_end() as current_week_end,
  get_previous_week_start() as previous_week_start,
  get_previous_week_end() as previous_week_end
FROM current_week cw
FULL OUTER JOIN previous_week pw ON cw.partner_id = pw.partner_id
WHERE COALESCE(cw.total_sales, 0) > 0 OR COALESCE(pw.total_sales, 0) > 0
ORDER BY current_week_sales DESC;

-- =====================================================
-- QUERY: Histórico de Semanas (Últimas 8 semanas)
-- =====================================================
WITH week_ranges AS (
  SELECT 
    generate_series(
      get_current_week_start() - INTERVAL '7 weeks',
      get_current_week_start(),
      INTERVAL '1 week'
    )::DATE as week_start
),
weekly_earnings AS (
  SELECT 
    wr.week_start,
    wr.week_start + INTERVAL '6 days' as week_end,
    p.name as partner_name,
    p.discount_code,
    COUNT(o.id) as orders_count,
    COALESCE(SUM(o.total), 0) as total_sales,
    ROUND(COALESCE(SUM(o.total), 0) * 0.10, 2) as commission
  FROM week_ranges wr
  CROSS JOIN partners p
  LEFT JOIN orders o ON p.discount_code = o.discount_code
    AND o.payment_status = 'paid'
    AND o.created_at >= wr.week_start
    AND o.created_at <= wr.week_start + INTERVAL '6 days 23:59:59'
  WHERE p.discount_code IS NOT NULL
  GROUP BY wr.week_start, p.id, p.name, p.discount_code
  HAVING COALESCE(SUM(o.total), 0) > 0
)
SELECT 
  week_start,
  week_end,
  partner_name,
  discount_code,
  orders_count,
  total_sales,
  commission,
  ROW_NUMBER() OVER (PARTITION BY week_start ORDER BY total_sales DESC) as weekly_rank
FROM weekly_earnings
ORDER BY week_start DESC, total_sales DESC;
