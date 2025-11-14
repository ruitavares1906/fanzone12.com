-- =====================================================
-- TESTE DA CORREÇÃO DOS GANHOS SEMANAIS
-- =====================================================

-- 1. Verificar se as funções estão funcionando corretamente
SELECT 
  'VERIFICAÇÃO FUNÇÕES' as secao,
  CURRENT_DATE as data_atual,
  EXTRACT(DOW FROM CURRENT_DATE) as dia_semana,
  get_current_week_start() as inicio_semana_atual,
  get_current_week_end() as fim_semana_atual,
  get_previous_week_start() as inicio_semana_anterior,
  get_previous_week_end() as fim_semana_anterior;

-- 2. Verificar se as datas fazem sentido
SELECT 
  'VERIFICAÇÃO DATAS' as secao,
  CASE 
    WHEN get_current_week_start() <= CURRENT_DATE AND CURRENT_DATE <= get_current_week_end() 
    THEN 'OK - Data atual está na semana atual'
    ELSE 'ERRO - Data atual não está na semana atual'
  END as validacao_semana_atual,
  CASE 
    WHEN get_previous_week_start() < get_current_week_start() 
    THEN 'OK - Semana anterior é anterior à atual'
    ELSE 'ERRO - Semana anterior não é anterior à atual'
  END as validacao_ordem_semanas,
  CASE 
    WHEN get_current_week_start() + INTERVAL '6 days' = get_current_week_end()
    THEN 'OK - Semana atual tem 7 dias'
    ELSE 'ERRO - Semana atual não tem 7 dias'
  END as validacao_duracao_semana;

-- 3. Verificar dados de encomendas por semana
SELECT 
  'DADOS SEMANA ATUAL' as secao,
  COUNT(*) as total_encomendas,
  COUNT(DISTINCT discount_code) as total_parceiros,
  SUM(total) as valor_total,
  ROUND(SUM(total) * 0.10, 2) as comissao_total
FROM orders 
WHERE payment_status = 'paid' 
  AND discount_code IS NOT NULL
  AND created_at >= get_current_week_start()
  AND created_at <= get_current_week_end() + INTERVAL '23:59:59';

SELECT 
  'DADOS SEMANA ANTERIOR' as secao,
  COUNT(*) as total_encomendas,
  COUNT(DISTINCT discount_code) as total_parceiros,
  SUM(total) as valor_total,
  ROUND(SUM(total) * 0.10, 2) as comissao_total
FROM orders 
WHERE payment_status = 'paid' 
  AND discount_code IS NOT NULL
  AND created_at >= get_previous_week_start()
  AND created_at <= get_previous_week_end() + INTERVAL '23:59:59';

-- 4. Comparação detalhada por parceiro
WITH current_week AS (
  SELECT 
    discount_code,
    COUNT(*) as orders_count,
    SUM(total) as total_sales,
    ROUND(SUM(total) * 0.10, 2) as commission
  FROM orders 
  WHERE payment_status = 'paid' 
    AND discount_code IS NOT NULL
    AND created_at >= get_current_week_start()
    AND created_at <= get_current_week_end() + INTERVAL '23:59:59'
  GROUP BY discount_code
),
previous_week AS (
  SELECT 
    discount_code,
    COUNT(*) as orders_count,
    SUM(total) as total_sales,
    ROUND(SUM(total) * 0.10, 2) as commission
  FROM orders 
  WHERE payment_status = 'paid' 
    AND discount_code IS NOT NULL
    AND created_at >= get_previous_week_start()
    AND created_at <= get_previous_week_end() + INTERVAL '23:59:59'
  GROUP BY discount_code
)
SELECT 
  'COMPARAÇÃO PARCEIROS' as secao,
  COALESCE(cw.discount_code, pw.discount_code) as codigo_parceiro,
  COALESCE(cw.total_sales, 0) as semana_atual_vendas,
  COALESCE(cw.commission, 0) as semana_atual_comissao,
  COALESCE(pw.total_sales, 0) as semana_anterior_vendas,
  COALESCE(pw.commission, 0) as semana_anterior_comissao,
  CASE 
    WHEN COALESCE(cw.total_sales, 0) > 0 AND COALESCE(pw.total_sales, 0) = 0 
    THEN 'NOVO - Só tem vendas na semana atual'
    WHEN COALESCE(cw.total_sales, 0) = 0 AND COALESCE(pw.total_sales, 0) > 0 
    THEN 'ANTIGO - Só tem vendas na semana anterior'
    WHEN COALESCE(cw.total_sales, 0) > 0 AND COALESCE(pw.total_sales, 0) > 0 
    THEN 'CONTÍNUO - Tem vendas em ambas as semanas'
    ELSE 'SEM VENDAS'
  END as status_parceiro
FROM current_week cw
FULL OUTER JOIN previous_week pw ON cw.discount_code = pw.discount_code
WHERE COALESCE(cw.total_sales, 0) > 0 OR COALESCE(pw.total_sales, 0) > 0
ORDER BY COALESCE(cw.total_sales, 0) DESC;

-- 5. Verificar se há sobreposição de dados entre as semanas
SELECT 
  'VERIFICAÇÃO SOBREPOSIÇÃO' as secao,
  COUNT(*) as encomendas_sobrepostas
FROM orders 
WHERE payment_status = 'paid' 
  AND discount_code IS NOT NULL
  AND created_at >= get_current_week_start()
  AND created_at <= get_current_week_end() + INTERVAL '23:59:59'
  AND created_at >= get_previous_week_start()
  AND created_at <= get_previous_week_end() + INTERVAL '23:59:59';

-- 6. Resumo final
SELECT 
  'RESUMO FINAL' as secao,
  'Semana atual: ' || get_current_week_start() || ' a ' || get_current_week_end() as periodo_atual,
  'Semana anterior: ' || get_previous_week_start() || ' a ' || get_previous_week_end() as periodo_anterior,
  'Data atual: ' || CURRENT_DATE as data_atual,
  'Dia da semana: ' || CASE EXTRACT(DOW FROM CURRENT_DATE)
    WHEN 0 THEN 'Domingo'
    WHEN 1 THEN 'Segunda'
    WHEN 2 THEN 'Terça'
    WHEN 3 THEN 'Quarta'
    WHEN 4 THEN 'Quinta'
    WHEN 5 THEN 'Sexta'
    WHEN 6 THEN 'Sábado'
  END as dia_semana_atual;
