// Script para testar se o webhook está funcionando

async function testWebhook() {
  try {
    console.log('🧪 Testando webhook...');
    
    // Simular evento do Stripe
    const testEvent = {
      id: 'evt_test_webhook',
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_b1nDspKHZq3QAdTHbk2mxNKcHfrMPomgEmQ4KcMP1gywLrQvaqUqjWIglq',
          amount_total: 800,
          currency: 'eur',
          customer_email: 'teste@exemplo.com',
          metadata: {
            payment_method: 'cash_on_delivery',
            customer_email: 'teste@exemplo.com',
            cart_items: JSON.stringify([{
              id: '21',
              nome: 'Camisola Sporting 2025/26 Principal',
              quantidade: 1,
              tamanho: 'M',
              personalizado: false
            }]),
            original_total: '42.97'
          }
        }
      }
    };

    const response = await fetch('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': 'test_signature'
      },
      body: JSON.stringify(testEvent)
    });

    console.log('📊 Status:', response.status);
    console.log('📋 Response:', await response.text());
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testWebhook();
