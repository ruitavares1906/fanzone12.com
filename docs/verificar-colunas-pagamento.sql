-- Verificar se as colunas de pagamento à cobrança existem na tabela orders

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN (
    'cash_on_delivery_fee',
    'upfront_payment', 
    'remaining_payment',
    'payment_method',
    'payment_status'
)
ORDER BY column_name;
