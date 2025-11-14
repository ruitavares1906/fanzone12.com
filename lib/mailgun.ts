// Removido imports desnecessários para usar fetch nativo

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || "your_mailgun_api_key_here"
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || "your_mailgun_domain_here"
const MAILGUN_FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || "geral@fanzone12.pt"

console.log("=== CONFIGURAÇÃO MAILGUN ===")
console.log("MAILGUN_API_KEY:", MAILGUN_API_KEY ? "Configurado" : "Não configurado")
console.log("MAILGUN_DOMAIN:", MAILGUN_DOMAIN)
console.log("MAILGUN_FROM_EMAIL:", MAILGUN_FROM_EMAIL)

// Função removida - usando fetch nativo

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  orderDate: string
  items: Array<{
    name: string
    quantity: number
    price: number
    size?: string
    customization?: any
  }>
  subtotal: number
  shipping: number
  total: number
  shippingAddress?: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
  } | null
  paymentMethod?: string
  upfrontPayment?: number
  remainingPayment?: number
  hasPersonalizedItems?: boolean
}

export async function sendAdminOrderNotification(data: OrderEmailData) {
  try {
    console.log("=== ENVIANDO NOTIFICAÇÃO PARA ADMIN ===")
    console.log("Dados do pedido:", JSON.stringify(data, null, 2))

    const itemsHtml = data.items.map(item => `
      <div style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between;">
        <div>
          <strong style="color: #1f2937;">${item.name}</strong><br>
          <span style="color: #6b7280; font-size: 14px;">Tamanho: ${item.size} | Quantidade: ${item.quantity}</span>
          ${item.customization ? `<br><span style="color: #2563eb; font-size: 14px;">Personalização: ${JSON.stringify(item.customization)}</span>` : ''}
        </div>
        <div style="text-align: right;">
          <span style="color: #2563eb; font-weight: bold;">${(item.price * item.quantity).toFixed(2)}€</span>
        </div>
      </div>
    `).join('')

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; background-color: #2563eb; color: white; padding: 20px; border-radius: 8px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🛒 NOVO PEDIDO RECEBIDO</h1>
            <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 18px;">Pedido #${data.orderNumber}</p>
          </div>

          <!-- Dados do cliente -->
          <div style="background-color: #f3f4f6; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">👤 Dados do Cliente</h3>
            <p style="margin: 5px 0;"><strong>Nome:</strong> ${data.customerName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
            ${data.customerPhone ? `<p style="margin: 5px 0;"><strong>Telefone:</strong> ${data.customerPhone}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Data:</strong> ${data.orderDate}</p>
          </div>

          <!-- Endereço de envio -->
          ${data.shippingAddress ? `
          <div style="background-color: #f0f9ff; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📍 Endereço de Envio</h3>
            <p style="margin: 5px 0;"><strong>${data.shippingAddress.name || 'Cliente'}</strong></p>
            <p style="margin: 5px 0;">${data.shippingAddress.address || 'Endereço não disponível'}</p>
            <p style="margin: 5px 0;">${data.shippingAddress.postalCode || ''} ${data.shippingAddress.city || ''}</p>
            <p style="margin: 5px 0;">${data.shippingAddress.country || ''}</p>
          </div>
          ` : `
          <div style="background-color: #fef3c7; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📍 Endereço de Envio</h3>
            <p style="margin: 5px 0; color: #92400e;">Endereço não disponível</p>
          </div>
          `}

          <!-- Itens do pedido -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📦 Itens do Pedido</h3>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px;">
              ${itemsHtml}
            </div>
          </div>

          <!-- Resumo financeiro -->
          <div style="background-color: #f3f4f6; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">💰 Resumo Financeiro</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280;">Subtotal:</span>
              <span style="color: #1f2937; font-weight: 600;">${(data.subtotal || 0).toFixed(2)}€</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280;">Envio:</span>
              <span style="color: #1f2937; font-weight: 600;">${(data.shipping || 0).toFixed(2)}€</span>
            </div>
            ${data.paymentMethod === 'Pagamento à Cobrança' ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280;">Taxa à cobrança:</span>
              <span style="color: #1f2937; font-weight: 600;">8.00€</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; background-color: #d1fae5; padding: 8px; border-radius: 4px;">
              <span style="color: #064e3b; font-weight: bold;">✅ Pago antecipadamente:</span>
              <span style="color: #064e3b; font-weight: bold;">${(data.upfrontPayment || 0).toFixed(2)}€</span>
            </div>
            <div style="display: flex; justify-content: space-between; background-color: #fef3c7; padding: 8px; border-radius: 4px;">
              <span style="color: #92400e; font-weight: bold;">💰 A cobrar na entrega:</span>
              <span style="color: #92400e; font-weight: bold;">${(data.remainingPayment || 0).toFixed(2)}€</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #2563eb; margin-top: 10px;">
              <span style="color: #2563eb; font-size: 18px; font-weight: bold;">TOTAL:</span>
              <span style="color: #2563eb; font-size: 20px; font-weight: bold;">${(data.total || 0).toFixed(2)}€</span>
            </div>
          </div>

          <!-- Informações de pagamento -->
          <div style="background-color: #f0f9ff; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">💳 Método de Pagamento</h3>
            <p style="color: #6b7280; margin: 0; font-size: 16px;">
              <strong>${data.paymentMethod || 'Pagamento Online'}</strong>
            </p>
          </div>

          <!-- Ações -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Acesse o painel administrativo para gerir este pedido.
            </p>
          </div>
        </div>
      </div>
    `

    const formData = new FormData()
    formData.append('from', `Fanzone12.pt <${MAILGUN_FROM_EMAIL}>`)
    formData.append('to', 'geral@fanzone12.pt')
    formData.append('subject', `🛒 Novo Pedido #${data.orderNumber} - ${data.customerName} - ${(data.total || 0).toFixed(2)}€`)
    formData.append('html', emailHtml)

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na resposta do Mailgun (admin):", response.status, errorText)
      throw new Error(`Mailgun API error: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log("Resposta do Mailgun (admin):", result)

    console.log("✅ Notificação para admin enviada via Mailgun")
    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar notificação para admin via Mailgun:", error)
    throw error
  }
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    console.log("=== ENVIANDO EMAIL DE CONFIRMAÇÃO ===")
    console.log("Dados recebidos:", JSON.stringify(data, null, 2))
    console.log("Subtotal:", data.subtotal)
    console.log("Shipping:", data.shipping)
    console.log("Total:", data.total)
    console.log("Upfront payment:", data.upfrontPayment)
    console.log("Remaining payment:", data.remainingPayment)
    
    // Usar o template simplificado
    const itemsHtml = data.items.map(item => `
      <div style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between;">
        <div>
          <strong style="color: #1f2937;">${item.name}</strong><br>
          <span style="color: #6b7280; font-size: 14px;">Tamanho: ${item.size} | Quantidade: ${item.quantity}</span>
          ${item.customization ? `<br><span style="color: #2563eb; font-size: 14px;">Personalização: ${JSON.stringify(item.customization)}</span>` : ''}
        </div>
        <div style="text-align: right;">
          <span style="color: #2563eb; font-weight: bold;">${(item.price * item.quantity).toFixed(2)}€</span>
        </div>
      </div>
    `).join('')

    const emailData = {
      from: MAILGUN_FROM_EMAIL,
      to: data.customerEmail,
      subject: `✅ Pedido Confirmado #${data.orderNumber} - fanzone12.pt`,
      html: `
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
                ${itemsHtml}
              </div>
            </div>

            <!-- Resumo financeiro -->
            <div style="background-color: #f3f4f6; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Resumo do Pedido</h3>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Subtotal:</span>
                <span style="color: #1f2937; font-weight: 600;">${(data.subtotal || 0).toFixed(2)}€</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Envio:</span>
                <span style="color: #1f2937; font-weight: 600;">${(data.shipping || 0).toFixed(2)}€</span>
              </div>
              ${data.paymentMethod === 'Pagamento à Cobrança' ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Taxa à cobrança:</span>
                <span style="color: #1f2937; font-weight: 600;">8.00€</span>
              </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #2563eb; margin-top: 10px;">
                <span style="color: #2563eb; font-size: 18px; font-weight: bold;">Total:</span>
                <span style="color: #2563eb; font-size: 20px; font-weight: bold;">${(data.total || 0).toFixed(2)}€</span>
              </div>
            </div>

            <!-- Informações de Pagamento -->
            ${data.paymentMethod === 'Pagamento à Cobrança' ? `
            <div style="background-color: #d1fae5; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #10b981;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">💰 Informações de Pagamento</h3>
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 16px;">
                <strong>Método:</strong> Pagamento à Cobrança
              </p>
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
                <span style="color: #1e40af; font-weight: bold;">${(data.upfrontPayment || 0).toFixed(2)}€</span>
              </div>
              <div style="display: flex; justify-content: space-between; background-color: #fef3c7; padding: 8px; border-radius: 4px;">
                <span style="color: #92400e; font-weight: bold;">💰 A pagar na entrega:</span>
                <span style="color: #92400e; font-weight: bold;">${(data.remainingPayment || 0).toFixed(2)}€</span>
              </div>
            </div>
            ` : ''}

            <!-- Morada de envio -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">Morada de Envio</h3>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; color: #6b7280; line-height: 1.6;">
                ${data.shippingAddress ? `
                  ${data.shippingAddress.name || 'Cliente'}<br>
                  ${data.shippingAddress.address || 'Endereço não disponível'}<br>
                  ${data.shippingAddress.city || ''}, ${data.shippingAddress.postalCode || ''}<br>
                  ${data.shippingAddress.country || ''}
                ` : 'Morada não disponível'}
              </div>
            </div>

            <!-- Próximos passos -->
            <div style="background-color: #fef3c7; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #f59e0b;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">Próximos Passos</h3>
              <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.6;">
                ${data.paymentMethod === 'Pagamento à Cobrança' ? '<li>Pagamento antecipado de 8€</li>' : ''}
                <li>Preparação da encomenda (1-2 dias úteis)</li>
                <li>Envio via CTT (7-8 dias úteis)</li>
                <li>Tempo total estimado: 10-12 dias úteis</li>
                ${data.paymentMethod === 'Pagamento à Cobrança' ? '<li>Pagamento do restante valor à cobrança</li>' : ''}
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
      `,
      text: `
        ✅ PEDIDO CONFIRMADO!

        Olá ${data.customerName}!

        Recebemos a sua encomenda e já estamos a prepará-la. Aqui estão os detalhes:

        Número da Encomenda: #${data.orderNumber}

        ITENS DA ENCOMENDA:
        ${data.items.map(item => `
        - ${item.name} (Tamanho: ${item.size}, Quantidade: ${item.quantity}) - ${(item.price * item.quantity).toFixed(2)}€
        `).join('')}

        RESUMO DO PEDIDO:
        Subtotal: ${(data.subtotal || 0).toFixed(2)}€
        Envio: ${(data.shipping || 0).toFixed(2)}€
        ${data.paymentMethod === 'Pagamento à Cobrança' ? `Taxa à cobrança: 8.00€` : ''}
        Total: ${(data.total || 0).toFixed(2)}€

        ${data.paymentMethod === 'Pagamento à Cobrança' ? `
        INFORMAÇÕES DE PAGAMENTO:
        Método: Pagamento à Cobrança
        ✅ PAGAMENTO ANTECIPADO CONFIRMADO
        Já pagou 8€ antecipadamente. O restante será pago na entrega.

        ✅ Já pago antecipadamente: ${(data.upfrontPayment || 0).toFixed(2)}€
        💰 A pagar na entrega: ${(data.remainingPayment || 0).toFixed(2)}€
        ` : ''}

        MORADA DE ENVIO:
        ${data.shippingAddress ? `
        ${data.shippingAddress.name || 'Cliente'}
        ${data.shippingAddress.address || 'Endereço não disponível'}
        ${data.shippingAddress.city || ''}, ${data.shippingAddress.postalCode || ''}
        ${data.shippingAddress.country || ''}
        ` : 'Morada não disponível'}

        PRÓXIMOS PASSOS:
        ${data.paymentMethod === 'Pagamento à Cobrança' ? '- Pagamento antecipado de 8€' : ''}
        - Preparação da encomenda (1-2 dias úteis)
        - Envio via CTT (7-8 dias úteis)
        - Tempo total estimado: 10-12 dias úteis
        ${data.paymentMethod === 'Pagamento à Cobrança' ? '- Pagamento do restante valor à cobrança' : ''}

        - Tempo total estimado: 10-12 dias úteis  

        Obrigado por escolher a fanzone12.pt!

        Se tiver alguma dúvida, contacte-nos através de geral@fanzone12.pt

        ---
        fanzone12.pt
        Email automático - não responder
      `
    }

    // Enviar email para o cliente usando API direta
    console.log("=== ENVIANDO EMAIL VIA MAILGUN ===")
    console.log("Domain:", MAILGUN_DOMAIN)
    console.log("From:", emailData.from)
    console.log("To:", emailData.to)
    console.log("Subject:", emailData.subject)
    
    // Usar fetch diretamente como no teste que funcionou
    const formData = new FormData()
    formData.append('from', emailData.from)
    formData.append('to', emailData.to)
    formData.append('subject', emailData.subject)
    formData.append('html', emailData.html)
    formData.append('text', emailData.text)
    
    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
      },
      body: formData
    })
    
    const result = await response.text()
    console.log("Resultado do Mailgun:", result)
    
    if (!response.ok) {
      throw new Error(`Erro do Mailgun: ${response.status} - ${result}`)
    }

    console.log("✅ Email de confirmação enviado via Mailgun")
    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar email de confirmação via Mailgun:", error)
    throw error
  }
}

export async function sendShippingConfirmationEmail(data: {
  orderNumber: string
  customerName: string
  customerEmail: string
}) {
  try {
    console.log("=== ENVIANDO EMAIL DE CONFIRMAÇÃO DE ENVIO ===")
    console.log("Dados recebidos:", JSON.stringify(data, null, 2))

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Encomenda Enviada - fanzone12.pt</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin: 0;">🚚 Encomenda Enviada!</h1>
          </div>
          
          <div style="background-color: #d1fae5; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #10b981;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">📦 Informações de Envio</h3>
            <p style="color: #6b7280; margin: 0; font-size: 16px;">
              A sua encomenda <strong>#${data.orderNumber}</strong> foi enviada e está a caminho!
            </p>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📋 Próximos Passos</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Receberá um email com o código de rastreamento</li>
              <li>Pode acompanhar o envio através do site dos CTT</li>
              <li>Tempo estimado de entrega: 7-8 dias úteis</li>
              <li>Em caso de dúvidas, contacte-nos</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Obrigado pela sua compra!<br>
              <strong>fanzone12.pt</strong>
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    const formData = new FormData()
    formData.append('from', `Fanzone12.pt <${MAILGUN_FROM_EMAIL}>`)
    formData.append('to', data.customerEmail)
    formData.append('subject', `🚚 Encomenda #${data.orderNumber} Enviada - fanzone12.pt`)
    formData.append('html', emailHtml)

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na resposta do Mailgun:", response.status, errorText)
      throw new Error(`Mailgun API error: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log("Resposta do Mailgun:", result)

    console.log("✅ Email de confirmação de envio enviado via Mailgun")
    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar email de confirmação de envio via Mailgun:", error)
    throw error
  }
}
