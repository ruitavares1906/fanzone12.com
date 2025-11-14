-- =====================================================
-- SCRIPT SIMPLIFICADO PARA EXECUTAR AS FUNÇÕES SQL
-- =====================================================
-- Execute este script no Supabase SQL Editor

-- 1. Criar funções de semana
CREATE OR REPLACE FUNCTION get_current_week_start()
RETURNS DATE AS $$
BEGIN
  RETURN CURRENT_DATE - (EXTRACT(DOW FROM CURRENT_DATE)::INTEGER + 6) % 7;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_current_week_end()
RETURNS DATE AS $$
BEGIN
  RETURN get_current_week_start() + INTERVAL '6 days';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_previous_week_start()
RETURNS DATE AS $$
BEGIN
  RETURN get_current_week_start() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_previous_week_end()
RETURNS DATE AS $$
BEGIN
  RETURN get_previous_week_start() + INTERVAL '6 days';
END;
$$ LANGUAGE plpgsql;

-- 2. Criar funções de mês
CREATE OR REPLACE FUNCTION get_current_month_start()
RETURNS DATE AS $$
BEGIN
  RETURN DATE_TRUNC('month', CURRENT_DATE)::DATE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_current_month_end()
RETURNS DATE AS $$
BEGIN
  RETURN (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_previous_month_start()
RETURNS DATE AS $$
BEGIN
  RETURN (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month')::DATE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_previous_month_end()
RETURNS DATE AS $$
BEGIN
  RETURN (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 day')::DATE;
END;
$$ LANGUAGE plpgsql;

-- 3. Testar as funções
SELECT 'Funções criadas com sucesso!' as status;

-- Testar função de semana atual
SELECT 
  'Semana Atual' as periodo,
  get_current_week_start() as inicio,
  get_current_week_end() as fim;

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
