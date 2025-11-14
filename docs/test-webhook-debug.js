// Script para testar se o webhook está sendo chamado
const http = require('http');

// Simular evento do Stripe
const testEvent = {
  id: 'evt_test_webhook',
  object: 'event',
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_b1E56fotXpRM9XpuoxAOFU0jYp7JPPgc98rynuyFfc3XJpUbB62JNFVDQZ',
      amount_total: 800,
      currency: 'eur',
      customer_email: 'ultrasstyle321@gmail.com',
      metadata: {
        payment_method: 'cash_on_delivery',
        customer_email: 'ultrasstyle321@gmail.com',
        cart_items: JSON.stringify([{
          id: '21',
          nome: 'Camisola Sporting 2025/26 Principal',
          quantidade: 4,
          tamanho: '08-09 anos',
          personalizado: false
        }, {
          id: '21',
          nome: 'Camisola Sporting 2025/26 Principal',
          quantidade: 1,
          tamanho: '06-07 anos',
          personalizado: true
        }]),
        original_total: '74.96'
      }
    }
  }
};

const postData = JSON.stringify(testEvent);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/webhooks/stripe',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Stripe-Signature': 'test_signature'
  }
};

console.log('🧪 Testando webhook...');
console.log('📋 Evento:', testEvent.type);
console.log('🆔 Session ID:', testEvent.data.object.id);

const req = http.request(options, (res) => {
  console.log('📊 Status:', res.statusCode);
  console.log('📋 Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📄 Response:', data);
  });
});

req.on('error', (error) => {
  console.error('❌ Erro:', error.message);
});

req.write(postData);
req.end();
