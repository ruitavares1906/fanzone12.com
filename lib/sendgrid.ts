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
  shippingAddress?: any // Morada de envio do cliente
  customerPhone?: string // Telefone do cliente
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  console.log("=== INICIANDO ENVIO DE EMAIL DE CONFIRMAÇÃO ===")
  console.log("Destinatário:", data.customerEmail)
  console.log("Número da encomenda:", data.orderNumber)
  console.log("API Key configurada:", !!(SENDGRID_API_KEY && SENDGRID_API_KEY !== "SUA_API_KEY_SENDGRID"))
  
  try {
    // Verificar se a API key está configurada
    if (!SENDGRID_API_KEY || SENDGRID_API_KEY === "SUA_API_KEY_SENDGRID") {
      const errorMsg = "SendGrid API Key não está configurada corretamente"
      console.error("❌ ERRO:", errorMsg)
      throw new Error(errorMsg)
    }

    // Função para formatar a morada
    const formatAddress = (address: any): string => {
      if (!address) return "Morada não disponível"
      
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
        
        return parts.length > 0 ? parts.join('<br>') : "Morada não disponível"
      } catch (error) {
        console.error("Erro ao processar morada:", error)
        return "Erro ao processar morada"
      }
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0b0b; color: #eaeaea;">
        <!-- Cabeçalho -->
        <div style="background-color: #0b0b0b; padding: 30px; text-align: center; border-bottom: 1px solid #2a2a2a;">
          <h1 style="color: #f2bd29; margin: 0; font-size: 24px;">✅ Pedido Confirmado!</h1>
          <p style="color: #bdbdbd; margin: 10px 0 0 0; font-size: 16px;">Obrigado pela sua compra</p>
        </div>
        
        <!-- Conteúdo principal -->
        <div style="padding: 30px;">
          <p style="font-size: 16px; margin: 0 0 20px 0; color: #eaeaea;">Olá <strong>${data.customerName}</strong>,</p>
          <p style="font-size: 14px; margin: 0 0 30px 0; color: #bdbdbd;">O seu pedido foi recebido e está a ser processado.</p>
          
          <!-- Detalhes do pedido -->
          <div style="background-color: #121212; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #2a2a2a;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #eaeaea;">📋 Detalhes do Pedido</h2>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Número:</strong> #${data.orderNumber}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Data:</strong> ${data.orderDate}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Email:</strong> ${data.customerEmail}</p>
            ${data.customerPhone ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Telefone:</strong> ${data.customerPhone}</p>` : ''}
          </div>

          ${data.shippingAddress ? `
          <!-- Morada de envio -->
          <div style="background-color: #121212; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #2a2a2a;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #eaeaea;">🏠 Morada de Envio</h3>
            <div style="font-size: 14px; line-height: 1.6; color: #bdbdbd;">${formatAddress(data.shippingAddress)}</div>
          </div>
          ` : ''}
          
          <!-- Itens do pedido -->
          <div style="background-color: #121212; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #2a2a2a;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #eaeaea;">🛒 Itens do Pedido</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #0b0b0b;">
                  <th style="padding: 10px; text-align: left; font-size: 14px; border-bottom: 1px solid #2a2a2a; color: #bdbdbd;">Produto</th>
                  <th style="padding: 10px; text-align: left; font-size: 14px; border-bottom: 1px solid #2a2a2a; color: #bdbdbd;">Detalhes</th>
                  <th style="padding: 10px; text-align: right; font-size: 14px; border-bottom: 1px solid #2a2a2a; color: #bdbdbd;">Preço</th>
                </tr>
              </thead>
              <tbody>
                ${data.orderItems
                  .map(
                    (item) => `
                  <tr>
                    <td style="padding: 10px; font-size: 14px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
                    <td style="padding: 10px; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                      Tamanho: ${item.size}<br>
                      Quantidade: ${item.quantity}
                      ${item.customization ? `<br>Personalização: ${item.customization}` : ""}
                    </td>
                    <td style="padding: 10px; font-size: 14px; text-align: right; border-bottom: 1px solid #e2e8f0;">${(item.price * item.quantity).toFixed(2)} €</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
            
            <!-- Totais -->
            <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #cbd5e1;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px; color: #666;">Subtotal:</span>
                <span style="font-size: 14px; color: #333;">${data.subtotal.toFixed(2)} €</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 14px; color: #666;">Envio:</span>
                <span style="font-size: 14px; color: #333;">${data.shipping.toFixed(2)} €</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 1px solid #cbd5e1;">
                <span style="font-size: 16px; font-weight: bold; color: #333;">TOTAL:</span>
                <span style="font-size: 16px; font-weight: bold; color: #1d4ed8;">${data.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
          
          <!-- Próximos passos -->
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #92400e;">📦 Próximos Passos</h3>
            <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px;">
              <li style="margin-bottom: 8px;">✅ Confirmação recebida</li>
              <li style="margin-bottom: 8px;">🔄 Em processamento</li>
              <li style="margin-bottom: 8px;">📧 Notificação de envio</li>
              <li>📱 Tracking disponível</li>
            </ul>
          </div>
          
          <!-- Contacto -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">Se tiver dúvidas, contacte-nos:</p>
            <a href="mailto:geral@fanzone12.pt" style="background-color: #1d4ed8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">📧 Contactar-nos</a>
          </div>
        </div>
        
        <!-- Rodapé -->
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            © 2025 fanzone12.pt. Todos os direitos reservados.
          </p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">
            🌐 <a href="https://www.fanzone12.pt" style="color: #1d4ed8; text-decoration: none;">fanzone12.pt</a> | 📧 geral@fanzone12.pt
          </p>
        </div>
      </div>
    `

    const emailText = `
      Olá ${data.customerName},
      ✅ CONFIRMAÇÃO DE PEDIDO
      
      Obrigado pela sua compra! O seu pedido #${data.orderNumber} foi recebido e está sendo processado.
      
      📋 DETALHES DO PEDIDO:
      Número do Pedido: #${data.orderNumber}
      Data: ${data.orderDate}
      Email: ${data.customerEmail}
      Telefone: ${data.customerPhone || "Não fornecido"}
      
      ${data.shippingAddress ? `🏠 MORADA DE ENVIO:
      ${formatAddress(data.shippingAddress).replace(/<br>/g, '\n').replace(/<strong>/g, '').replace(/<\/strong>/g, '')}
      
      ` : ''}🛒 ITENS DO SEU PEDIDO:
      ${data.orderItems
        .map(
          (item) =>
            `• ${item.name}
            Tamanho: ${item.size} | Quantidade: ${item.quantity}${item.customization ? ` | Personalização: ${item.customization}` : ""}
            Preço: ${(item.price * item.quantity).toFixed(2)} €${item.quantity > 1 ? ` (${item.price.toFixed(2)} € × ${item.quantity})` : ''}`,
        )
        .join("\n\n")}
      
      💰 RESUMO DE VALORES:
      Subtotal: ${data.subtotal.toFixed(2)} €
      Envio: ${data.shipping.toFixed(2)} €
      ═══════════════════════
      TOTAL: ${data.total.toFixed(2)} €
      ═══════════════════════
      
      📦 PRÓXIMOS PASSOS:
      ✅ Confirmação recebida - O seu pedido está confirmado
      🔄 Em processamento - Estamos a preparar os seus itens  
      📧 Notificação de envio - Receberá outro email quando o pedido for enviado
      📱 Tracking disponível - Poderá acompanhar a entrega em tempo real
      
      Se tiver alguma dúvida sobre o seu pedido, não hesite em contactar-nos:
      📧 Email: geral@fanzone12.pt
      🌐 Site: https://www.fanzone12.pt
      
      Obrigado por escolher a fanzone12.pt!
      
      fanzone12.pt
      © 2025 Todos os direitos reservados.
    `

    // Email para o cliente
    const msgToCustomer = {
      to: data.customerEmail,
      from: "geral@fanzone12.pt", // Email verificado no SendGrid
      subject: `Confirmação de Pedido #${data.orderNumber} - fanzone12.pt`,
      text: emailText,
      html: emailHtml,
    }

    // HTML específico para a loja com informações completas do cliente
    const storeEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🚨 NOVA ENCOMENDA RECEBIDA</h1>
        </div>
        
        <div style="padding: 20px;">
          <div style="background-color: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #dc2626; margin-top: 0;">📋 Informações do Cliente</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 5px 0;"><strong>Nome:</strong> ${data.customerName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
                <p style="margin: 5px 0;"><strong>Telefone:</strong> ${data.customerPhone || "Não fornecido"}</p>
              </div>
              <div>
                <p style="margin: 5px 0;"><strong>Pedido:</strong> #${data.orderNumber}</p>
                <p style="margin: 5px 0;"><strong>Data:</strong> ${data.orderDate}</p>
                <p style="margin: 5px 0;"><strong>Total:</strong> <span style="color: #dc2626; font-weight: bold;">${data.total.toFixed(2)} €</span></p>
              </div>
            </div>
          </div>

          <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #0ea5e9; margin-top: 0;">📦 Morada de Envio</h3>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #0ea5e9;">
              ${formatAddress(data.shippingAddress)}
            </div>
          </div>
          
          <h3 style="color: #1f2937;">🛒 Itens do Pedido</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Produto</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Detalhes</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">Preço</th>
              </tr>
            </thead>
            <tbody>
              ${data.orderItems
                .map(
                  (item) => `
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.name}</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">
                    Tamanho: ${item.size}<br>
                    Quantidade: ${item.quantity}
                    ${item.customization ? `<br>Personalização: ${item.customization}` : ""}
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
                <td colspan="2" style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;"><strong>Envio:</strong></td>
                <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">${data.shipping.toFixed(2)} €</td>
              </tr>
              <tr style="background-color: #dc2626; color: white;">
                <td colspan="2" style="padding: 12px; text-align: right; border: 1px solid #dc2626;"><strong>TOTAL:</strong></td>
                <td style="padding: 12px; text-align: right; font-weight: bold; border: 1px solid #dc2626;">${data.total.toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>

          <div style="background-color: #f59e0b; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
            <p style="margin: 0; font-weight: bold;">⚡ AÇÃO NECESSÁRIA: Processar esta encomenda no sistema de gestão</p>
          </div>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin-top: 20px;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            📧 Email automático do sistema de encomendas - fanzone12.pt
          </p>
        </div>
      </div>
    `

    // Email para a loja (com informações completas)
    const msgToStore = {
      to: "geral@fanzone12.pt",
      from: "noreply@fanzone12.pt", // Usar remetente diferente para evitar problemas
      subject: `🚨 NOVA ENCOMENDA #${data.orderNumber} - ${data.customerName} - ${data.total.toFixed(2)}€`,
      text: `NOVA ENCOMENDA RECEBIDA:

CLIENTE:
Nome: ${data.customerName}
Email: ${data.customerEmail}
Telefone: ${data.customerPhone || "Não fornecido"}

PEDIDO:
Número: #${data.orderNumber}
Data: ${data.orderDate}
Total: ${data.total.toFixed(2)} €

MORADA DE ENVIO:
${data.shippingAddress ? formatAddress(data.shippingAddress).replace(/<br>/g, '\n').replace(/<strong>/g, '').replace(/<\/strong>/g, '') : 'Não disponível'}

ITENS:
${data.orderItems
  .map(
    (item) =>
      `${item.name} - Tamanho: ${item.size}, Quantidade: ${item.quantity}${item.customization ? `, Personalização: ${item.customization}` : ""} - ${(item.price * item.quantity).toFixed(2)} €`,
)
.join("\n")}

TOTAIS:
Subtotal: ${data.subtotal.toFixed(2)} €
Envio: ${data.shipping.toFixed(2)} €
Total: ${data.total.toFixed(2)} €`,
      html: storeEmailHtml,
    }

    console.log("📧 Preparando envio para cliente:", data.customerEmail)
    console.log("📧 Preparando envio para loja: geral@fanzone12.pt")
    console.log("📧 Assunto do email para loja:", `🚨 NOVA ENCOMENDA #${data.orderNumber} - ${data.customerName} - ${data.total.toFixed(2)}€`)

    // Enviar ambos os emails
    console.log("🚀 Enviando emails...")
    console.log("📧 Email para cliente:", JSON.stringify({
      to: data.customerEmail,
      from: "geral@fanzone12.pt",
      subject: `✅ Pedido Confirmado #${data.orderNumber} - fanzone12.pt`
    }, null, 2))
    
    console.log("📧 Email para loja:", JSON.stringify({
      to: "geral@fanzone12.pt",
      from: "geral@fanzone12.pt",
      subject: `🚨 NOVA ENCOMENDA #${data.orderNumber} - ${data.customerName} - ${data.total.toFixed(2)}€`
    }, null, 2))
    
    const results = await Promise.allSettled([
      sgMail.send(msgToCustomer), 
      sgMail.send(msgToStore)
    ])
    
    // Verificar resultados
    const customerResult = results[0]
    const storeResult = results[1]
    
    console.log("📊 Resultado envio para cliente:", customerResult.status)
    if (customerResult.status === "rejected") {
      console.error("❌ Erro no email para cliente:", customerResult.reason)
    } else {
      console.log("✅ Email para cliente enviado com sucesso")
    }
    
    console.log("📊 Resultado envio para loja:", storeResult.status)
    if (storeResult.status === "rejected") {
      console.error("❌ Erro no email para loja:", storeResult.reason)
    } else {
      console.log("✅ Email para loja enviado com sucesso")
    }
    
    // Se pelo menos um email foi enviado com sucesso, considerar sucesso
    const hasSuccessfulSend = results.some(result => result.status === "fulfilled")
    
    if (!hasSuccessfulSend) {
      throw new Error("Falha ao enviar ambos os emails")
    }

    console.log("✅ ENVIO DE EMAIL DE CONFIRMAÇÃO CONCLUÍDO")
    return { success: true }
  } catch (error: any) {
    console.error("❌ ERRO AO ENVIAR EMAIL DE CONFIRMAÇÃO:", error)
    
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
          <h1 style="color: white; margin: 0;">Pedido Enviado</h1>
        </div>
        <div style="padding: 20px;">
          <p>Olá ${data.customerName},</p>
          <p>O seu pedido <b>#${data.orderNumber}</b> foi enviado!</p>
          <div style="background-color: #f9fafb; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h2 style="margin-top: 0;">Informações de Envio</h2>
            <p><strong>Entrega Estimada:</strong> 7 a 12 dias úteis</p>
            <p><strong>Número de Rastreio:</strong> Será enviado em breve por email/SMS assim que estiver disponível.</p>
          </div>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://www.fanzone12.pt/contacto" style="background-color: #1d4ed8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Contactar Loja</a>
          </div>
          <div style="margin: 30px 0;">
            <p>Se tiver alguma dúvida sobre o seu pedido, não hesite em contactar-nos.</p>
          </div>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin-top: 20px;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            &copy; 2025 fanzone12.pt. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `

    const emailText = `
      Olá ${data.customerName},
      O seu pedido #${data.orderNumber} foi enviado!
      Entrega estimada: 7 a 12 dias úteis.
      O número de rastreio será enviado em breve por email/SMS assim que estiver disponível.
      Se tiver alguma dúvida, contacte-nos.
      fanzone12.pt
    `

    // Email para o cliente
    const msgToCustomer = {
      to: data.customerEmail,
      from: "fanzone12.pt <geral@fanzone12.pt>",
      subject: `O seu pedido #${data.orderNumber} foi enviado - fanzone12.pt`,
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
