-- =====================================================
-- SCRIPT PARA VERIFICAR E CORRIGIR FUNÇÕES SEMANAIS
-- Reset às 00:00h de segunda-feira
-- =====================================================

-- 1. Verificar se as funções existem
SELECT 
  'get_current_week_start' as function_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE p.proname = 'get_current_week_start' AND n.nspname = 'public'
  ) THEN 'EXISTE' ELSE 'NÃO EXISTE' END as status
UNION ALL
SELECT 
  'get_current_week_end' as function_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE p.proname = 'get_current_week_end' AND n.nspname = 'public'
  ) THEN 'EXISTE' ELSE 'NÃO EXISTE' END as status
UNION ALL
SELECT 
  'get_previous_week_start' as function_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE p.proname = 'get_previous_week_start' AND n.nspname = 'public'
  ) THEN 'EXISTE' ELSE 'NÃO EXISTE' END as status
UNION ALL
SELECT 
  'get_previous_week_end' as function_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE p.proname = 'get_previous_week_end' AND n.nspname = 'public'
  ) THEN 'EXISTE' ELSE 'NÃO EXISTE' END as status;

-- 2. Recriar as funções com a lógica correta
DROP FUNCTION IF EXISTS get_current_week_start();
-- Função para calcular o início da semana atual (Segunda-feira às 00:00h)
CREATE OR REPLACE FUNCTION get_current_week_start()
RETURNS DATE AS $$
BEGIN
  -- Obter o dia da semana atual (0=Domingo, 1=Segunda, ..., 6=Sábado)
  -- Ajustar para que Segunda = 0, Domingo = 6
  RETURN CURRENT_DATE - (EXTRACT(DOW FROM CURRENT_DATE)::INTEGER + 6) % 7;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS get_current_week_end();
CREATE OR REPLACE FUNCTION get_current_week_end()
RETURNS DATE AS $$
BEGIN
  RETURN get_current_week_start() + INTERVAL '6 days';
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS get_previous_week_start();
CREATE OR REPLACE FUNCTION get_previous_week_start()
RETURNS DATE AS $$
BEGIN
  RETURN get_current_week_start() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS get_previous_week_end();
CREATE OR REPLACE FUNCTION get_previous_week_end()
RETURNS DATE AS $$
BEGIN
  RETURN get_previous_week_start() + INTERVAL '6 days';
END;
$$ LANGUAGE plpgsql;

-- 3. Testar as funções
SELECT 
  'TESTE FUNÇÕES' as teste,
  CURRENT_DATE as data_atual,
  EXTRACT(DOW FROM CURRENT_DATE) as dia_semana_atual,
  get_current_week_start() as inicio_semana_atual,
  get_current_week_end() as fim_semana_atual,
  get_previous_week_start() as inicio_semana_anterior,
  get_previous_week_end() as fim_semana_anterior;

-- 4. Verificar dados de exemplo
SELECT 
  'DADOS EXEMPLO' as tipo,
  COUNT(*) as total_orders,
  COUNT(DISTINCT discount_code) as total_partners,
  SUM(total) as valor_total
FROM orders 
WHERE payment_status = 'paid' 
  AND discount_code IS NOT NULL
  AND created_at >= get_current_week_start()
  AND created_at <= get_current_week_end() + INTERVAL '23:59:59';

-- 5. Comparar semana atual vs anterior
WITH current_week_data AS (
  SELECT 
    discount_code,
    COUNT(*) as orders_count,
    SUM(total) as total_sales
  FROM orders 
  WHERE payment_status = 'paid' 
    AND discount_code IS NOT NULL
    AND created_at >= get_current_week_start()
    AND created_at <= get_current_week_end() + INTERVAL '23:59:59'
  GROUP BY discount_code
),
previous_week_data AS (
  SELECT 
    discount_code,
    COUNT(*) as orders_count,
    SUM(total) as total_sales
  FROM orders 
  WHERE payment_status = 'paid' 
    AND discount_code IS NOT NULL
    AND created_at >= get_previous_week_start()
    AND created_at <= get_previous_week_end() + INTERVAL '23:59:59'
  GROUP BY discount_code
)
SELECT 
  COALESCE(cw.discount_code, pw.discount_code) as discount_code,
  COALESCE(cw.total_sales, 0) as semana_atual_vendas,
  COALESCE(cw.orders_count, 0) as semana_atual_encomendas,
  COALESCE(pw.total_sales, 0) as semana_anterior_vendas,
  COALESCE(pw.orders_count, 0) as semana_anterior_encomendas,
  COALESCE(cw.total_sales, 0) - COALESCE(pw.total_sales, 0) as diferenca_vendas
FROM current_week_data cw
FULL OUTER JOIN previous_week_data pw ON cw.discount_code = pw.discount_code
WHERE COALESCE(cw.total_sales, 0) > 0 OR COALESCE(pw.total_sales, 0) > 0
ORDER BY COALESCE(cw.total_sales, 0) DESC;
