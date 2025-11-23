// Removido imports desnecessários para usar fetch nativo
import { getCarrierLabel } from "@/lib/shipping-carriers"

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || "your_mailgun_api_key_here"
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || "your_mailgun_domain_here"
const MAILGUN_FROM_EMAIL = "sales@fanzone12.com"

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
    console.log("=== SENDING ADMIN NOTIFICATION ===")
    console.log("Order data:", JSON.stringify(data, null, 2))

    const itemsHtml = data.items.map(item => `
      <div style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between;">
        <div>
          <strong style="color: #1f2937;">${item.name}</strong><br>
          <span style="color: #6b7280; font-size: 14px;">Size: ${item.size} | Quantity: ${item.quantity}</span>
          ${item.customization ? `<br><span style="color: #2563eb; font-size: 14px;">Customization: ${JSON.stringify(item.customization)}</span>` : ''}
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
            <h1 style="color: white; margin: 0; font-size: 28px;">🛒 NEW ORDER RECEIVED</h1>
            <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 18px;">Order #${data.orderNumber}</p>
          </div>

          <!-- Dados do cliente -->
          <div style="background-color: #f3f4f6; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">👤 Customer Details</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${data.customerName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
            ${data.customerPhone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${data.customerPhone}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Date:</strong> ${data.orderDate}</p>
          </div>

          <!-- Endereço de envio -->
          ${data.shippingAddress ? `
          <div style="background-color: #f0f9ff; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📍 Shipping Address</h3>
            <p style="margin: 5px 0;"><strong>${data.shippingAddress.name || 'Customer'}</strong></p>
            <p style="margin: 5px 0;">${data.shippingAddress.address || 'Address not available'}</p>
            <p style="margin: 5px 0;">${data.shippingAddress.postalCode || ''} ${data.shippingAddress.city || ''}</p>
            <p style="margin: 5px 0;">${data.shippingAddress.country || ''}</p>
          </div>
          ` : `
          <div style="background-color: #fef3c7; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📍 Shipping Address</h3>
            <p style="margin: 5px 0; color: #92400e;">Address not available</p>
          </div>
          `}

          <!-- Itens do pedido -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📦 Order Items</h3>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px;">
              ${itemsHtml}
            </div>
          </div>

          <!-- Resumo financeiro -->
          <div style="background-color: #f3f4f6; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">💰 Financial Summary</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280;">Subtotal:</span>
              <span style="color: #1f2937; font-weight: 600;">${(data.subtotal || 0).toFixed(2)}€</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280;">Shipping:</span>
              <span style="color: #1f2937; font-weight: 600;">${(data.shipping || 0).toFixed(2)}€</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #2563eb; margin-top: 10px;">
              <span style="color: #2563eb; font-size: 18px; font-weight: bold;">TOTAL:</span>
              <span style="color: #2563eb; font-size: 20px; font-weight: bold;">${(data.total || 0).toFixed(2)}€</span>
            </div>
          </div>

          <!-- Informações de pagamento -->
          <div style="background-color: #f0f9ff; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">💳 Payment Method</h3>
            <p style="color: #6b7280; margin: 0; font-size: 16px;">
              <strong>${data.paymentMethod || 'Online Payment'}</strong>
            </p>
          </div>

          <!-- Ações -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Access the admin panel to manage this order.
            </p>
          </div>
        </div>
      </div>
    `

    const formData = new FormData()
    formData.append('from', `Fanzone12.com <${MAILGUN_FROM_EMAIL}>`)
    formData.append('to', 'sales@fanzone12.com')
    formData.append('subject', `🛒 New Order #${data.orderNumber} - ${data.customerName} - ${(data.total || 0).toFixed(2)}€`)
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

    console.log("✅ Admin notification sent via Mailgun")
    return { success: true }
  } catch (error) {
    console.error("Error sending admin notification via Mailgun:", error)
    throw error
  }
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    console.log("=== SENDING CONFIRMATION EMAIL ===")
    console.log("Received data:", JSON.stringify(data, null, 2))
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
          <span style="color: #6b7280; font-size: 14px;">Size: ${item.size} | Quantity: ${item.quantity}</span>
          ${item.customization ? `<br><span style="color: #2563eb; font-size: 14px;">Customization: ${JSON.stringify(item.customization)}</span>` : ''}
        </div>
        <div style="text-align: right;">
          <span style="color: #2563eb; font-weight: bold;">${(item.price * item.quantity).toFixed(2)}€</span>
        </div>
      </div>
    `).join('')

    const emailData = {
      from: MAILGUN_FROM_EMAIL,
      to: data.customerEmail,
      subject: `✅ Order Confirmed #${data.orderNumber} - fanzone12.com`,
      html: `
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
                ${itemsHtml}
              </div>
            </div>

            <!-- Resumo financeiro -->
            <div style="background-color: #f3f4f6; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Order Summary</h3>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Subtotal:</span>
                <span style="color: #1f2937; font-weight: 600;">${(data.subtotal || 0).toFixed(2)}€</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Shipping:</span>
                <span style="color: #1f2937; font-weight: 600;">${(data.shipping || 0).toFixed(2)}€</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #2563eb; margin-top: 10px;">
                <span style="color: #2563eb; font-size: 18px; font-weight: bold;">Total:</span>
                <span style="color: #2563eb; font-size: 20px; font-weight: bold;">${(data.total || 0).toFixed(2)}€</span>
              </div>
            </div>

            <!-- Morada de envio -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">Shipping Address</h3>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; color: #6b7280; line-height: 1.6;">
                ${data.shippingAddress ? `
                  ${data.shippingAddress.name || 'Customer'}<br>
                  ${data.shippingAddress.address || 'Address not available'}<br>
                  ${data.shippingAddress.city || ''}, ${data.shippingAddress.postalCode || ''}<br>
                  ${data.shippingAddress.country || ''}
                ` : 'Address not available'}
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
      `,
      text: `
        ✅ ORDER CONFIRMED!

        Hello ${data.customerName}!

        We have received your order and are already preparing it. Here are the details:

        Order Number: #${data.orderNumber}

        ORDER ITEMS:
        ${data.items.map(item => `
        - ${item.name} (Size: ${item.size}, Quantity: ${item.quantity}) - ${(item.price * item.quantity).toFixed(2)}€
        `).join('')}

        ORDER SUMMARY:
        Subtotal: ${(data.subtotal || 0).toFixed(2)}€
        Shipping: ${(data.shipping || 0).toFixed(2)}€
        Total: ${(data.total || 0).toFixed(2)}€

        SHIPPING ADDRESS:
        ${data.shippingAddress ? `
        ${data.shippingAddress.name || 'Customer'}
        ${data.shippingAddress.address || 'Address not available'}
        ${data.shippingAddress.city || ''}, ${data.shippingAddress.postalCode || ''}
        ${data.shippingAddress.country || ''}
        ` : 'Address not available'}

        NEXT STEPS:
        - Order preparation (1-2 business days)
        - Shipping (7-12 business days)
        - Estimated total time: 7-12 business days

        Thank you for choosing fanzone12.com!

        If you have any questions, contact us at sales@fanzone12.com

        ---
        fanzone12.com
        Automatic email - do not reply
      `
    }

    // Send email to customer using direct API
    console.log("=== SENDING EMAIL VIA MAILGUN ===")
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
    console.log("Mailgun result:", result)
    
    if (!response.ok) {
      throw new Error(`Mailgun error: ${response.status} - ${result}`)
    }

    console.log("✅ Confirmation email sent via Mailgun")
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
  carrier?: string
  trackingNumber?: string
  trackingUrl?: string
}) {
  try {
    console.log("=== SENDING SHIPPING CONFIRMATION EMAIL ===")
    console.log("Received data:", JSON.stringify(data, null, 2))

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Shipped - fanzone12.com</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin: 0;">🚚 Order Shipped!</h1>
          </div>
          
          <div style="background-color: #d1fae5; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #10b981;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">📦 Shipping Information</h3>
            <p style="color: #6b7280; margin: 0; font-size: 16px;">
              Your order <strong>#${data.orderNumber}</strong> has been shipped and is on its way!
            </p>
            ${data.carrier && data.trackingNumber ? `
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <h4 style="color: #0369a1; margin: 0 0 10px 0; font-size: 16px;">Tracking Information</h4>
              <p style="margin: 5px 0; color: #1f2937;"><strong>Carrier:</strong> {{carrier_name}}</p>
              <p style="margin: 5px 0; color: #1f2937;"><strong>Tracking Number:</strong> {{tracking_number}}</p>
              ${data.trackingUrl ? `
              <p style="margin: 10px 0;">
                <a href="{{tracking_link}}" 
                   style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                  🔍 Track Order
                </a>
              </p>
              ` : ''}
            </div>
            ` : ''}
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📋 Next Steps</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>You will receive an email with the tracking code</li>
              <li>You can track the shipment through the carrier's website</li>
              <li>Estimated delivery time: 7-12 business days</li>
              <li>If you have any questions, please contact us</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Thank you for your purchase!<br>
              <strong>fanzone12.com</strong>
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    // Replace placeholders with actual values
    let finalHtml = emailHtml
    if (data.carrier && data.trackingNumber) {
      const carrierName = getCarrierLabel(data.carrier)
      finalHtml = finalHtml.replace(/\{\{carrier_name\}\}/g, carrierName)
      finalHtml = finalHtml.replace(/\{\{tracking_number\}\}/g, data.trackingNumber)
      if (data.trackingUrl) {
        finalHtml = finalHtml.replace(/\{\{tracking_link\}\}/g, data.trackingUrl)
      }
    }

    const formData = new FormData()
    formData.append('from', `Fanzone12.com <${MAILGUN_FROM_EMAIL}>`)
    formData.append('to', data.customerEmail)
    formData.append('subject', `🚚 Order #${data.orderNumber} Shipped - fanzone12.com`)
    formData.append('html', finalHtml)

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

    console.log("✅ Shipping confirmation email sent via Mailgun")
    return { success: true }
  } catch (error) {
    console.error("Error sending shipping confirmation email via Mailgun:", error)
    throw error
  }
}

// Export additional email functions
export { 
  sendPaymentFailedEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail,
  sendPasswordResetEmail,
  sendAccountCreatedEmail
} from './mailgun-extra'
