import sgMail from "@sendgrid/mail"

// Configurar a API key do SendGrid
// Em produção, isso viria de uma variável de ambiente
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "SUA_API_KEY_SENDGRID"
sgMail.setApiKey(SENDGRID_API_KEY)

// Log da configuração (sem expor a chave completa)
console.log("=== CONFIGURAÇÃO SENDGRID ===")
console.log("API Key configurada:", !!(SENDGRID_API_KEY && SENDGRID_API_KEY !== "SUA_API_KEY_SENDGRID"))
console.log("API Key length:", SENDGRID_API_KEY?.length || 0)
console.log("API Key prefix:", SENDGRID_API_KEY ? SENDGRID_API_KEY.substring(0, 10) + "..." : "N/A")

interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  orderDate: string
  orderItems: Array<{
    name: string
    price: number
    quantity: number
    size: string
    customization?: string
  }>
  subtotal: number
  shipping: number
  total: number
  shippingAddress?: any // Customer shipping address
  customerPhone?: string // Customer phone
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  console.log("=== STARTING EMAIL CONFIRMATION SEND ===")
  console.log("Recipient:", data.customerEmail)
  console.log("Order number:", data.orderNumber)
  console.log("API Key configured:", !!(SENDGRID_API_KEY && SENDGRID_API_KEY !== "SUA_API_KEY_SENDGRID"))
  
  try {
    // Check if API key is configured
    if (!SENDGRID_API_KEY || SENDGRID_API_KEY === "SUA_API_KEY_SENDGRID") {
      const errorMsg = "SendGrid API Key is not configured correctly"
      console.error("❌ ERROR:", errorMsg)
      throw new Error(errorMsg)
    }

    // Function to format the address
    const formatAddress = (address: any): string => {
      if (!address) return "Address not available"
      
      try {
        const addr = typeof address === 'string' ? JSON.parse(address) : address
        const parts = []
        
        if (addr.name) parts.push(`<strong>${addr.name}</strong>`)
        if (addr.line1) parts.push(addr.line1)
        if (addr.line2) parts.push(addr.line2)
        if (addr.postal_code || addr.city) {
          const cityLine = `${addr.postal_code || ''} ${addr.city || ''}`.trim()
          if (cityLine) parts.push(cityLine)
        }
        if (addr.state) parts.push(addr.state)
        if (addr.country) parts.push(addr.country)
        
        return parts.length > 0 ? parts.join('<br>') : "Address not available"
      } catch (error) {
        console.error("Error processing address:", error)
        return "Error processing address"
      }
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0b0b; color: #eaeaea;">
        <!-- Header -->
        <div style="background-color: #0b0b0b; padding: 30px; text-align: center; border-bottom: 1px solid #2a2a2a;">
          <h1 style="color: #f2bd29; margin: 0; font-size: 24px;">✅ Order Confirmed!</h1>
          <p style="color: #bdbdbd; margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px;">
          <p style="font-size: 16px; margin: 0 0 20px 0; color: #eaeaea;">Hello <strong>${data.customerName}</strong>,</p>
          <p style="font-size: 14px; margin: 0 0 30px 0; color: #bdbdbd;">Your order has been received and is being processed.</p>
          
          <!-- Order Details -->
          <div style="background-color: #121212; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #2a2a2a;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #eaeaea;">📋 Order Details</h2>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Number:</strong> #${data.orderNumber}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Date:</strong> ${data.orderDate}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Email:</strong> ${data.customerEmail}</p>
            ${data.customerPhone ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${data.customerPhone}</p>` : ''}
          </div>

          ${data.shippingAddress ? `
          <!-- Shipping Address -->
          <div style="background-color: #121212; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #2a2a2a;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #eaeaea;">🏠 Shipping Address</h3>
            <div style="font-size: 14px; line-height: 1.6; color: #bdbdbd;">${formatAddress(data.shippingAddress)}</div>
          </div>
          ` : ''}
          
          <!-- Order Items -->
          <div style="background-color: #121212; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #2a2a2a;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #eaeaea;">🛒 Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #0b0b0b;">
                  <th style="padding: 10px; text-align: left; font-size: 14px; border-bottom: 1px solid #2a2a2a; color: #bdbdbd;">Product</th>
                  <th style="padding: 10px; text-align: left; font-size: 14px; border-bottom: 1px solid #2a2a2a; color: #bdbdbd;">Details</th>
                  <th style="padding: 10px; text-align: right; font-size: 14px; border-bottom: 1px solid #2a2a2a; color: #bdbdbd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${data.orderItems
                  .map(
                    (item) => `
                  <tr>
                    <td style="padding: 10px; font-size: 14px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
                    <td style="padding: 10px; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                      Size: ${item.size}<br>
                      Quantity: ${item.quantity}
                      ${item.customization ? `<br>Customization: ${item.customization}` : ""}
                    </td>
                    <td style="padding: 10px; font-size: 14px; text-align: right; border-bottom: 1px solid #e2e8f0;">${(item.price * item.quantity).toFixed(2)} €</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
            
            <!-- Totals -->
            <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #cbd5e1;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px; color: #666;">Subtotal:</span>
                <span style="font-size: 14px; color: #333;">${data.subtotal.toFixed(2)} €</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 14px; color: #666;">Shipping:</span>
                <span style="font-size: 14px; color: #333;">${data.shipping.toFixed(2)} €</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 1px solid #cbd5e1;">
                <span style="font-size: 16px; font-weight: bold; color: #333;">TOTAL:</span>
                <span style="font-size: 16px; font-weight: bold; color: #1d4ed8;">${data.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
          
          <!-- Next Steps -->
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #92400e;">📦 Next Steps</h3>
            <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px;">
              <li style="margin-bottom: 8px;">✅ Confirmation received</li>
              <li style="margin-bottom: 8px;">🔄 In processing</li>
              <li style="margin-bottom: 8px;">📧 Shipping notification</li>
              <li>📱 Tracking available</li>
            </ul>
          </div>
          
          <!-- Contact -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">If you have any questions, contact us:</p>
            <a href="mailto:sales@fanzone12.com" style="background-color: #1d4ed8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">📧 Contact Us</a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            © 2025 fanzone12.com. All rights reserved.
          </p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">
            🌐 <a href="https://www.fanzone12.com" style="color: #1d4ed8; text-decoration: none;">fanzone12.com</a> | 📧 sales@fanzone12.com
          </p>
        </div>
      </div>
    `

    const emailText = `
      Hello ${data.customerName},
      ✅ ORDER CONFIRMATION
      
      Thank you for your purchase! Your order #${data.orderNumber} has been received and is being processed.
      
      📋 ORDER DETAILS:
      Order Number: #${data.orderNumber}
      Date: ${data.orderDate}
      Email: ${data.customerEmail}
      Phone: ${data.customerPhone || "Not provided"}
      
      ${data.shippingAddress ? `🏠 SHIPPING ADDRESS:
      ${formatAddress(data.shippingAddress).replace(/<br>/g, '\n').replace(/<strong>/g, '').replace(/<\/strong>/g, '')}
      
      ` : ''}🛒 YOUR ORDER ITEMS:
      ${data.orderItems
        .map(
          (item) =>
            `• ${item.name}
            Size: ${item.size} | Quantity: ${item.quantity}${item.customization ? ` | Customization: ${item.customization}` : ""}
            Price: ${(item.price * item.quantity).toFixed(2)} €${item.quantity > 1 ? ` (${item.price.toFixed(2)} € × ${item.quantity})` : ''}`,
        )
        .join("\n\n")}
      
      💰 ORDER SUMMARY:
      Subtotal: ${data.subtotal.toFixed(2)} €
      Shipping: ${data.shipping.toFixed(2)} €
      ═══════════════════════
      TOTAL: ${data.total.toFixed(2)} €
      ═══════════════════════
      
      📦 NEXT STEPS:
      ✅ Confirmation received - Your order is confirmed
      🔄 In processing - We are preparing your items  
      📧 Shipping notification - You will receive another email when the order is shipped
      📱 Tracking available - You can track the delivery in real time
      
      If you have any questions about your order, please don't hesitate to contact us:
      📧 Email: sales@fanzone12.com
      🌐 Website: https://www.fanzone12.com
      
      Thank you for choosing fanzone12.com!
      
      fanzone12.com
      © 2025 All rights reserved.
    `

    // Email para o cliente
    const msgToCustomer = {
      to: data.customerEmail,
      from: "sales@fanzone12.com", // Email verificado no Mailgun
      subject: `Order Confirmation #${data.orderNumber} - fanzone12.com`,
      text: emailText,
      html: emailHtml,
    }

    // HTML for store with complete customer information
    const storeEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🚨 NEW ORDER RECEIVED</h1>
        </div>
        
        <div style="padding: 20px;">
          <div style="background-color: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #dc2626; margin-top: 0;">📋 Customer Information</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${data.customerName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${data.customerPhone || "Not provided"}</p>
              </div>
              <div>
                <p style="margin: 5px 0;"><strong>Order:</strong> #${data.orderNumber}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${data.orderDate}</p>
                <p style="margin: 5px 0;"><strong>Total:</strong> <span style="color: #dc2626; font-weight: bold;">${data.total.toFixed(2)} €</span></p>
              </div>
            </div>
          </div>

          <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #0ea5e9; margin-top: 0;">📦 Shipping Address</h3>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #0ea5e9;">
              ${formatAddress(data.shippingAddress)}
            </div>
          </div>
          
          <h3 style="color: #1f2937;">🛒 Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Product</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Details</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${data.orderItems
                .map(
                  (item) => `
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.name}</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">
                    Size: ${item.size}<br>
                    Quantity: ${item.quantity}
                    ${item.customization ? `<br>Customization: ${item.customization}` : ""}
                  </td>
                  <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">${(item.price * item.quantity).toFixed(2)} €</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr style="background-color: #f9fafb;">
                <td colspan="2" style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;"><strong>Subtotal:</strong></td>
                <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">${data.subtotal.toFixed(2)} €</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td colspan="2" style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;"><strong>Shipping:</strong></td>
                <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">${data.shipping.toFixed(2)} €</td>
              </tr>
              <tr style="background-color: #dc2626; color: white;">
                <td colspan="2" style="padding: 12px; text-align: right; border: 1px solid #dc2626;"><strong>TOTAL:</strong></td>
                <td style="padding: 12px; text-align: right; font-weight: bold; border: 1px solid #dc2626;">${data.total.toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>

          <div style="background-color: #f59e0b; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
            <p style="margin: 0; font-weight: bold;">⚡ ACTION REQUIRED: Process this order in the management system</p>
          </div>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin-top: 20px;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            📧 Automatic email from order system - fanzone12.com
          </p>
        </div>
      </div>
    `

    // Email para a loja (com informações completas)
    const msgToStore = {
      to: "sales@fanzone12.com",
      from: "sales@fanzone12.com",
      subject: `🚨 NEW ORDER #${data.orderNumber} - ${data.customerName} - ${data.total.toFixed(2)}€`,
      text: `NEW ORDER RECEIVED:

CUSTOMER:
Name: ${data.customerName}
Email: ${data.customerEmail}
Phone: ${data.customerPhone || "Not provided"}

ORDER:
Number: #${data.orderNumber}
Date: ${data.orderDate}
Total: ${data.total.toFixed(2)} €

SHIPPING ADDRESS:
${data.shippingAddress ? formatAddress(data.shippingAddress).replace(/<br>/g, '\n').replace(/<strong>/g, '').replace(/<\/strong>/g, '') : 'Not available'}

ITEMS:
${data.orderItems
  .map(
    (item) =>
      `${item.name} - Size: ${item.size}, Quantity: ${item.quantity}${item.customization ? `, Customization: ${item.customization}` : ""} - ${(item.price * item.quantity).toFixed(2)} €`,
)
.join("\n")}

TOTALS:
Subtotal: ${data.subtotal.toFixed(2)} €
Shipping: ${data.shipping.toFixed(2)} €
Total: ${data.total.toFixed(2)} €`,
      html: storeEmailHtml,
    }

    console.log("📧 Preparing email for customer:", data.customerEmail)
    console.log("📧 Preparing email for store: sales@fanzone12.com")
    console.log("📧 Store email subject:", `🚨 NEW ORDER #${data.orderNumber} - ${data.customerName} - ${data.total.toFixed(2)}€`)

    // Enviar ambos os emails
    console.log("🚀 Enviando emails...")
    console.log("📧 Customer email:", JSON.stringify({
      to: data.customerEmail,
      from: "sales@fanzone12.com",
      subject: `✅ Order Confirmed #${data.orderNumber} - fanzone12.com`
    }, null, 2))
    
    console.log("📧 Store email:", JSON.stringify({
      to: "sales@fanzone12.com",
      from: "sales@fanzone12.com",
      subject: `🚨 NEW ORDER #${data.orderNumber} - ${data.customerName} - ${data.total.toFixed(2)}€`
    }, null, 2))
    
    const results = await Promise.allSettled([
      sgMail.send(msgToCustomer), 
      sgMail.send(msgToStore)
    ])
    
    // Verificar resultados
    const customerResult = results[0]
    const storeResult = results[1]
    
    console.log("📊 Customer email result:", customerResult.status)
    if (customerResult.status === "rejected") {
      console.error("❌ Error in customer email:", customerResult.reason)
    } else {
      console.log("✅ Customer email sent successfully")
    }
    
    console.log("📊 Store email result:", storeResult.status)
    if (storeResult.status === "rejected") {
      console.error("❌ Error in store email:", storeResult.reason)
    } else {
      console.log("✅ Store email sent successfully")
    }
    
    // If at least one email was sent successfully, consider it a success
    const hasSuccessfulSend = results.some(result => result.status === "fulfilled")
    
    if (!hasSuccessfulSend) {
      throw new Error("Falha ao enviar ambos os emails")
    }

    console.log("✅ EMAIL CONFIRMATION SEND COMPLETED")
    return { success: true }
  } catch (error: any) {
    console.error("❌ ERROR SENDING CONFIRMATION EMAIL:", error)
    
    // Log detalhado do erro do SendGrid
    if (error.response) {
      console.error("📋 Detalhes da resposta do SendGrid:")
      console.error("Status:", error.response.status)
      console.error("Body:", JSON.stringify(error.response.body, null, 2))
    }
    
    return { success: false, error }
  }
}

export async function sendShippingConfirmationEmail(data: {
  orderNumber: string // deve ser o número curto, não o UUID
  customerName: string
  customerEmail: string
}) {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1d4ed8; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Shipped</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello ${data.customerName},</p>
          <p>Your order <b>#${data.orderNumber}</b> has been shipped!</p>
          <div style="background-color: #f9fafb; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h2 style="margin-top: 0;">Shipping Information</h2>
            <p><strong>Estimated Delivery:</strong> 7 to 12 business days</p>
            <p><strong>Tracking Number:</strong> Will be sent soon by email/SMS as soon as it's available.</p>
          </div>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://www.fanzone12.com/contacto" style="background-color: #1d4ed8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Contact Store</a>
          </div>
          <div style="margin: 30px 0;">
            <p>If you have any questions about your order, please don't hesitate to contact us.</p>
          </div>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin-top: 20px;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            &copy; 2025 fanzone12.com. All rights reserved.
          </p>
        </div>
      </div>
    `

    const emailText = `
      Hello ${data.customerName},
      Your order #${data.orderNumber} has been shipped!
      Estimated delivery: 7 to 12 business days.
      The tracking number will be sent soon by email/SMS as soon as it's available.
      If you have any questions, please contact us.
      fanzone12.com
    `

    // Email para o cliente
    const msgToCustomer = {
      to: data.customerEmail,
      from: "fanzone12.com <sales@fanzone12.com>",
      subject: `Your order #${data.orderNumber} has been shipped - fanzone12.com`,
      text: emailText,
      html: emailHtml,
    }

    // Enviar apenas para o cliente
    await sgMail.send(msgToCustomer)

    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    return { success: false, error }
  }
}
