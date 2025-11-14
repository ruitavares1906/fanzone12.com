# Correção dos Ganhos Semanais dos Parceiros

## Problema Identificado

O sistema estava apresentando inconsistências no cálculo dos ganhos semanais dos parceiros:
- Quando se carregava a "semana anterior", aparecia 0 ganhos
- Quando se carregava a "semana atual", apareciam os ganhos que deveriam ser da semana anterior
- Isso indicava um problema na lógica de cálculo das datas das semanas

## Causa Raiz

Havia uma **inconsistência entre as funções SQL no banco de dados e o código JavaScript**:

### Funções SQL (corretas):
```sql
-- Função para calcular o início da semana atual (Segunda-feira)
CREATE OR REPLACE FUNCTION get_current_week_start()
RETURNS DATE AS $$
BEGIN
  RETURN CURRENT_DATE - (EXTRACT(DOW FROM CURRENT_DATE)::INTEGER + 6) % 7;
END;
$$ LANGUAGE plpgsql;
```

### Código JavaScript (incorreto):
```javascript
// Lógica antiga
const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1
```

## Correções Implementadas

### 1. Correção do Código JavaScript

**Arquivos corrigidos:**
- `app/api/admin/partners-earnings/route.ts`
- `app/api/partners/[name]/earnings/route.ts`
- `app/api/partners/[name]/earnings/history/route.ts`

**Mudança aplicada:**
```javascript
// Lógica corrigida - mesma das funções SQL
const daysFromMonday = (currentDay + 6) % 7
```

### 2. Scripts SQL de Verificação

**Arquivos criados:**
- `verificar-funcoes-semanais.sql` - Para verificar e recriar as funções SQL
- `teste-correcao-ganhos.sql` - Para testar se a correção está funcionando

## Como Aplicar as Correções

### 1. Executar no Supabase SQL Editor:

```sql
-- Executar o script de verificação e correção
\i verificar-funcoes-semanais.sql

-- Testar se está funcionando
\i teste-correcao-ganhos.sql
```

### 2. Verificar se as funções estão corretas:

```sql
-- Teste rápido
SELECT 
  CURRENT_DATE as data_atual,
  get_current_week_start() as inicio_semana_atual,
  get_current_week_end() as fim_semana_atual,
  get_previous_week_start() as inicio_semana_anterior,
  get_previous_week_end() as fim_semana_anterior;
```

## Resultado Esperado

Após as correções:
- ✅ **Semana atual**: Mostra apenas os ganhos da semana atual (Segunda-feira a Domingo)
- ✅ **Semana anterior**: Mostra apenas os ganhos da semana anterior
- ✅ **Navegação entre semanas**: Funciona corretamente com o offset
- ✅ **Consistência**: Código JavaScript e SQL usam a mesma lógica
- ✅ **Reset correto**: Os ganhos reiniciam às 00:00h de segunda-feira

## Verificação

Para verificar se a correção funcionou:

1. Aceder ao painel administrativo: `/admin/partners-earnings`
2. Verificar se "Semana Atual" mostra os dados corretos
3. Clicar em "Semana Anterior" e verificar se mostra os dados da semana anterior
4. Testar a navegação com os botões "Semana Anterior" e "Próxima Semana"

## Notas Importantes

- **Reset semanal**: Os ganhos semanais reiniciam sempre às **00:00h de segunda-feira**
- **Cálculo**: Baseado em encomendas com `payment_status = 'paid'`
- **Comissão**: 10% sobre o valor total das encomendas pagas
- **Período**: Segunda-feira a Domingo (7 dias)
- **Exemplo**: Se hoje for quarta-feira, a semana atual vai de segunda-feira (00:00h) até domingo (23:59h)

## Arquivos Modificados

1. `app/api/admin/partners-earnings/route.ts` - API administrativa
2. `app/api/partners/[name]/earnings/route.ts` - API individual dos parceiros
3. `app/api/partners/[name]/earnings/history/route.ts` - Histórico dos parceiros
4. `verificar-funcoes-semanais.sql` - Script de correção SQL
5. `teste-correcao-ganhos.sql` - Script de teste
6. `CORRECAO_GANHOS_SEMANAIS.md` - Este documento
