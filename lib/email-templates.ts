// Templates de email simplificados e fáceis de ler

export function getOrderConfirmationHtml(data: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">✅ Order Confirmed!</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0;">Thank you for your trust</p>
        </div>
        
        <!-- Saudação -->
        <div style="margin-bottom: 25px;">
          <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 20px;">Hello ${data.customerName}!</h2>
          <p style="color: #6b7280; margin: 0; line-height: 1.6;">
            We have received your order and are already preparing it. Here are the details:
          </p>
        </div>
        
        <!-- Número da encomenda -->
        <div style="background-color: #f3f4f6; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #2563eb;">
          <h3 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Order Number</h3>
          <p style="color: #2563eb; margin: 0; font-size: 24px; font-weight: bold;">#${data.orderNumber}</p>
        </div>
        
        <!-- Itens da encomenda -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Order Items</h3>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px;">
            ${data.orderItems.map((item: any) => `
              <div style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between;">
                <div>
                  <strong style="color: #1f2937;">${item.name}</strong><br>
                  <span style="color: #6b7280; font-size: 14px;">Size: ${item.size} | Quantity: ${item.quantity}</span>
                  ${item.customization ? `<br><span style="color: #2563eb; font-size: 14px;">Customization: ${item.customization}</span>` : ''}
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
          <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Order Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280;">Subtotal:</span>
            <span style="color: #1f2937; font-weight: 600;">${data.subtotal.toFixed(2)}€</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280;">Shipping:</span>
            <span style="color: #1f2937; font-weight: 600;">${data.shipping.toFixed(2)}€</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #2563eb; margin-top: 10px;">
            <span style="color: #2563eb; font-size: 18px; font-weight: bold;">Total:</span>
            <span style="color: #2563eb; font-size: 20px; font-weight: bold;">${data.total.toFixed(2)}€</span>
          </div>
        </div>
        
        <!-- Morada de envio -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">Shipping Address</h3>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; color: #6b7280; line-height: 1.6;">
            ${data.shippingAddress ? formatAddress(data.shippingAddress) : 'Address not available'}
          </div>
        </div>
        
        <!-- Próximos passos -->
        <div style="background-color: #fef3c7; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #f59e0b;">
          <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">Next Steps</h3>
          <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Order preparation (1-2 business days)</li>
            <li>Shipping (7-12 business days)</li>
            <li>Estimated total time: 7-12 business days</li>
          </ul>
          <p style="color: #2563eb; margin: 10px 0 0 0; font-weight: 600;">
            Estimated total time: 7-12 business days
          </p>
        </div>
        
        <!-- Call to action -->
        <div style="text-align: center; margin: 25px 0;">
          <a href="https://www.fanzone12.com/contacto" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Contact Store
          </a>
        </div>
        
        <!-- Mensagem final -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0; font-size: 16px;">
            Thank you for choosing fanzone12.com!
          </p>
          <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">
            If you have any questions, please don't hesitate to contact us.
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 14px;">
        <p style="margin: 0;">fanzone12.com</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">Automatic email - do not reply</p>
      </div>
    </div>
  `
}

export function getOrderConfirmationText(data: any) {
  return `
    ✅ ORDER CONFIRMED!
    
    Hello ${data.customerName}!
    
    We have received your order and are already preparing it. Here are the details:
    
    Order Number: #${data.orderNumber}
    
    ORDER ITEMS:
    ${data.orderItems.map((item: any) => `
    - ${item.name} (Size: ${item.size}, Quantity: ${item.quantity}) - ${(item.price * item.quantity).toFixed(2)}€
    `).join('')}
    
    ORDER SUMMARY:
    Subtotal: ${data.subtotal.toFixed(2)}€
    Shipping: ${data.shipping.toFixed(2)}€
    Total: ${data.total.toFixed(2)}€
    
    SHIPPING ADDRESS:
    ${data.shippingAddress ? formatAddress(data.shippingAddress) : 'Address not available'}
    
    NEXT STEPS:
    - Order preparation (1-2 business days)
    - Shipping (7-12 business days)
    - Estimated total time: 7-12 business days
    
    Thank you for choosing fanzone12.com!
    
    If you have any questions, contact us at sales@fanzone12.com
    
    ---
    fanzone12.com
    Automatic email
  `
}

// Função auxiliar para formatar endereço
function formatAddress(address: any) {
  if (!address) return 'Address not available'
  
  return `
    ${address.name || ''}
    ${address.address || ''}
    ${address.city || ''} ${address.postalCode || ''}
    ${address.country || ''}
  `.trim()
}
