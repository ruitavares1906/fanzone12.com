// Templates de email simplificados e fáceis de ler

export function getOrderConfirmationHtml(data: any) {
  const isCashOnDelivery = data.paymentMethod === 'Pagamento à Cobrança'
  const hasUpfrontPayment = data.upfrontPayment && data.upfrontPayment > 0

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">✅ Pedido Confirmado!</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0;">Obrigado pela sua confiança</p>
        </div>
        
        <!-- Saudação -->
        <div style="margin-bottom: 25px;">
          <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 20px;">Olá ${data.customerName}!</h2>
          <p style="color: #6b7280; margin: 0; line-height: 1.6;">
            Recebemos a sua encomenda e já estamos a prepará-la. Aqui estão os detalhes:
          </p>
        </div>
        
        <!-- Número da encomenda -->
        <div style="background-color: #f3f4f6; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #2563eb;">
          <h3 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Número da Encomenda</h3>
          <p style="color: #2563eb; margin: 0; font-size: 24px; font-weight: bold;">#${data.orderNumber}</p>
        </div>
        
        <!-- Itens da encomenda -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Itens da Encomenda</h3>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px;">
            ${data.orderItems.map((item: any) => `
              <div style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between;">
                <div>
                  <strong style="color: #1f2937;">${item.name}</strong><br>
                  <span style="color: #6b7280; font-size: 14px;">Tamanho: ${item.size} | Quantidade: ${item.quantity}</span>
                  ${item.customization ? `<br><span style="color: #2563eb; font-size: 14px;">Personalização: ${item.customization}</span>` : ''}
                </div>
                <div style="text-align: right;">
                  <span style="color: #2563eb; font-weight: bold;">${(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Resumo financeiro -->
        <div style="background-color: #f3f4f6; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
          <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Resumo do Pedido</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280;">Subtotal:</span>
            <span style="color: #1f2937; font-weight: 600;">${data.subtotal.toFixed(2)}€</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280;">Envio:</span>
            <span style="color: #1f2937; font-weight: 600;">${data.shipping.toFixed(2)}€</span>
          </div>
          ${isCashOnDelivery ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280;">Taxa à cobrança:</span>
            <span style="color: #1f2937; font-weight: 600;">8.00€</span>
          </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #2563eb; margin-top: 10px;">
            <span style="color: #2563eb; font-size: 18px; font-weight: bold;">Total:</span>
            <span style="color: #2563eb; font-size: 20px; font-weight: bold;">${data.total.toFixed(2)}€</span>
          </div>
        </div>
        
        <!-- Informações de Pagamento -->
        ${isCashOnDelivery ? `
        <div style="background-color: ${hasUpfrontPayment ? '#fef3c7' : '#d1fae5'}; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid ${hasUpfrontPayment ? '#f59e0b' : '#10b981'};">
          <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">💰 Informações de Pagamento</h3>
          <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 16px;">
            <strong>Método:</strong> Pagamento à Cobrança
          </p>
          ${hasUpfrontPayment ? `
          <div style="background-color: #10b981; padding: 15px; border-radius: 4px; margin: 10px 0;">
            <p style="color: #064e3b; margin: 0; font-weight: bold; font-size: 16px;">
              ✅ PAGAMENTO ANTECIPADO CONFIRMADO
            </p>
            <p style="color: #064e3b; margin: 5px 0 0 0; font-size: 14px;">
              Já pagou 8€ antecipadamente. O restante será pago na entrega.
            </p>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px; background-color: #f0f9ff; padding: 8px; border-radius: 4px;">
            <span style="color: #1e40af; font-weight: bold;">✅ Já pago antecipadamente:</span>
            <span style="color: #1e40af; font-weight: bold;">${data.upfrontPayment.toFixed(2)}€</span>
          </div>
          <div style="display: flex; justify-content: space-between; background-color: #fef3c7; padding: 8px; border-radius: 4px;">
            <span style="color: #92400e; font-weight: bold;">💰 A pagar na entrega:</span>
            <span style="color: #92400e; font-weight: bold;">${data.remainingPayment.toFixed(2)}€</span>
          </div>
          ` : `
          <p style="color: #059669; margin: 0; font-weight: bold;">
            ✅ Pode pagar tudo à cobrança quando receber o produto
          </p>
          `}
        </div>
        ` : ''}
        
        <!-- Morada de envio -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">Morada de Envio</h3>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; color: #6b7280; line-height: 1.6;">
            ${data.shippingAddress ? formatAddress(data.shippingAddress) : 'Morada não disponível'}
          </div>
        </div>
        
        <!-- Próximos passos -->
        <div style="background-color: #fef3c7; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #f59e0b;">
          <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">Próximos Passos</h3>
          <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.6;">
            ${isCashOnDelivery && hasUpfrontPayment ? '<li>Pagamento antecipado de 8€</li>' : ''}
            <li>Preparação da encomenda (1-2 dias úteis)</li>
            <li>Envio via CTT (7-8 dias úteis)</li>
            <li>Tempo total estimado: 10-12 dias úteis</li>
            ${isCashOnDelivery ? '<li>Pagamento do restante valor à cobrança</li>' : ''}
          </ul>
          <p style="color: #2563eb; margin: 10px 0 0 0; font-weight: 600;">
            Tempo total estimado: 10-12 dias úteis
          </p>
        </div>
        
        <!-- Call to action -->
        <div style="text-align: center; margin: 25px 0;">
          <a href="https://www.fanzone12.pt/contacto" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Contactar Loja
          </a>
        </div>
        
        <!-- Mensagem final -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0; font-size: 16px;">
            Obrigado por escolher a fanzone12.pt!
          </p>
          <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">
            Se tiver alguma dúvida, não hesite em contactar-nos.
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 14px;">
        <p style="margin: 0;">fanzone12.pt</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">Email automático - não responder</p>
      </div>
    </div>
  `
}

export function getOrderConfirmationText(data: any) {
  const isCashOnDelivery = data.paymentMethod === 'Pagamento à Cobrança'
  const hasUpfrontPayment = data.upfrontPayment && data.upfrontPayment > 0

  return `
    ✅ PEDIDO CONFIRMADO!
    
    Olá ${data.customerName}!
    
    Recebemos a sua encomenda e já estamos a prepará-la. Aqui estão os detalhes:
    
    Número da Encomenda: #${data.orderNumber}
    
    ITENS DA ENCOMENDA:
    ${data.orderItems.map((item: any) => `
    - ${item.name} (Tamanho: ${item.size}, Quantidade: ${item.quantity}) - ${(item.price * item.quantity).toFixed(2)}€
    `).join('')}
    
    RESUMO DO PEDIDO:
    Subtotal: ${data.subtotal.toFixed(2)}€
    Envio: ${data.shipping.toFixed(2)}€
    ${isCashOnDelivery ? `Taxa à cobrança: 8.00€` : ''}
    Total: ${data.total.toFixed(2)}€
    
    ${isCashOnDelivery ? `
    INFORMAÇÕES DE PAGAMENTO:
    Método: Pagamento à Cobrança
    ${hasUpfrontPayment ? `
    ✅ PAGAMENTO ANTECIPADO CONFIRMADO
    Já pagou 8€ antecipadamente. O restante será pago na entrega.
    
    ✅ Já pago antecipadamente: ${data.upfrontPayment.toFixed(2)}€
    💰 A pagar na entrega: ${data.remainingPayment.toFixed(2)}€
    ` : `
    ✅ Pode pagar tudo à cobrança quando receber o produto
    `}
    ` : ''}
    
    MORADA DE ENVIO:
    ${data.shippingAddress ? formatAddress(data.shippingAddress) : 'Morada não disponível'}
    
    PRÓXIMOS PASSOS:
    ${isCashOnDelivery && hasUpfrontPayment ? '- Pagamento antecipado de 8€' : ''}
    - Preparação da encomenda (1-2 dias úteis)
    - Envio via CTT (7-8 dias úteis)
    ${isCashOnDelivery ? '- Pagamento do restante valor à cobrança' : ''}
    
    - Tempo total estimado: 10-12 dias úteis    
    
    Obrigado por escolher a fanzone12.pt!
    
    Se tiver alguma dúvida, contacte-nos através de geral@fanzone12.pt
    
    ---
    fanzone12.pt
    Email automático
  `
}

// Função auxiliar para formatar endereço
function formatAddress(address: any) {
  if (!address) return 'Morada não disponível'
  
  return `
    ${address.name || ''}
    ${address.address || ''}
    ${address.city || ''} ${address.postalCode || ''}
    ${address.country || ''}
  `.trim()
}
