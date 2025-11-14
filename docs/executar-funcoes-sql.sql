-- =====================================================
-- SCRIPT PARA EXECUTAR AS FUNÇÕES SQL
-- =====================================================
-- Execute este script no Supabase SQL Editor para criar as funções necessárias

-- 1. Executar o script de ganhos semanais
\i sql-ganhos-semanais-reset-segunda.sql

-- 2. Executar o script de ranking mensal
\i sql-ranking-mensal-reset-dia1.sql

-- 3. Testar as funções criadas
SELECT 'Testando funções...' as status;

-- Testar função de semana atual
SELECT 
  'Semana Atual' as periodo,
  get_current_week_start() as inicio,
  get_current_week_end() as fim;

-- Testar função de semana anterior
SELECT 
  'Semana Anterior' as periodo,
  get_previous_week_start() as inicio,
  get_previous_week_end() as fim;

-- Testar função de mês atual
SELECT 
  'Mês Atual' as periodo,
  get_current_month_start() as inicio,
  get_current_month_end() as fim;

-- Testar função de mês anterior
SELECT 
  'Mês Anterior' as periodo,
  get_previous_month_start() as inicio,
  get_previous_month_end() as fim;

-- =====================================================
-- QUERIES DE TESTE RÁPIDO
-- =====================================================

-- Teste 1: Verificar se há dados de parceiros
SELECT 
  'Parceiros' as tabela,
  COUNT(*) as total
FROM partners
WHERE discount_code IS NOT NULL;

-- Teste 2: Verificar se há encomendas pagas
SELECT 
  'Encomendas Pagas' as tabela,
  COUNT(*) as total,
  SUM(total) as valor_total
FROM orders
WHERE payment_status = 'paid' 
  AND discount_code IS NOT NULL;

-- Teste 3: Verificar encomendas da semana atual
SELECT 
  'Encomendas Semana Atual' as periodo,
  COUNT(*) as total,
  SUM(total) as valor_total
FROM orders
WHERE payment_status = 'paid' 
  AND discount_code IS NOT NULL
  AND created_at >= get_current_week_start()
  AND created_at <= get_current_week_end() + INTERVAL '23:59:59';

-- Teste 4: Verificar encomendas do mês atual
SELECT 
  'Encomendas Mês Atual' as periodo,
  COUNT(*) as total,
  SUM(total) as valor_total
FROM orders
WHERE payment_status = 'paid' 
  AND discount_code IS NOT NULL
  AND created_at >= get_current_month_start()
  AND created_at <= CURRENT_DATE + INTERVAL '23:59:59';

SELECT 'Funções criadas e testadas com sucesso!' as resultado;
