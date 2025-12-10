import { NextResponse } from "next/server"
import Stripe from "stripe"
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/mailgun"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Inicializar o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover" as Stripe.LatestApiVersion,
})

// Webhook secret para verificar a assinatura do Stripe
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

// Helper para logging baseado no ambiente
const isProduction = process.env.NODE_ENV === 'production'
const logger = isProduction ? console.info : console.log

// Função utilitária para detectar pagamento antecipado
function checkIfUpfrontPayment(session: Stripe.Checkout.Session): boolean {
  const metadata = session.metadata as Record<string, string> | null
  const amountTotal = session.amount_total
  
  // Verificações múltiplas para robustez
  return (
    metadata?.payment_method === 'cash_on_delivery' ||
    metadata?.payment_method === 'upfront' ||
    (amountTotal === 800 && metadata?.amount === '8.00') ||
    (amountTotal === 800 && !!metadata?.orderNumber) ||
    (amountTotal === 800 && (session.line_items?.data?.[0]?.description?.includes('Taxa antecipada') ?? false)) ||
    (amountTotal === 800 && (session.line_items?.data?.[0]?.description?.includes('Pagamento antecipado') ?? false))
  )
}

// Função para envio de emails com retry
async function sendEmailWithRetry(emailFunction: () => Promise<any>, emailType: string, maxRetries = 3): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await emailFunction()
      logger(`✅ Email de ${emailType} enviado com sucesso (tentativa ${attempt})`)
      return
    } catch (error) {
      logger(`❌ Erro ao enviar email de ${emailType} (tentativa ${attempt}/${maxRetries}):`, error)
      
      if (attempt === maxRetries) {
        logger(`❌ Falha definitiva no envio do email de ${emailType} após ${maxRetries} tentativas`)
        throw error
      }
      
      // Aguardar antes da próxima tentativa (backoff exponencial)
      const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
      logger(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

export async function POST(request: Request) {
  try {
    logger("=== WEBHOOK DO STRIPE INICIADO ===")
    logger("Timestamp:", new Date().toISOString())
    logger("URL:", request.url)
    logger("Method:", request.method)

    const body = await request.text()
    const signature = request.headers.get("stripe-signature") || ""

    logger("=== WEBHOOK RECEBIDO ===")
    logger("Headers:", Object.fromEntries(request.headers.entries()))
    logger("Signature:", signature ? "Presente" : "Ausente")
    logger("Webhook Secret configurado:", endpointSecret ? "Sim" : "Não")
    logger("Body length:", body.length)
    
    if (isProduction) {
      logger("⚠️ Modo produção: logs sensíveis reduzidos")
    } else {
      logger("Body preview:", body.substring(0, 200) + "...")
    }

    // Validação robusta do body
    if (!body || body.trim().length === 0) {
      console.error("❌ Body vazio ou inválido")
      return NextResponse.json({ error: "Body vazio" }, { status: 400 })
    }

    // Verificar se o JSON é válido antes de processar
    let isValidJson = false
    try {
      JSON.parse(body)
      isValidJson = true
      console.log("✅ JSON válido")
    } catch (jsonErr: any) {
      console.error("❌ JSON inválido detectado:")
      console.error("Erro JSON:", jsonErr.message)
      console.error("Posição do erro:", jsonErr.message.match(/position (\d+)/)?.[1] || "desconhecida")
      console.error("Body completo (primeiros 1000 chars):", body.substring(0, 1000))
      console.error("Body completo (últimos 1000 chars):", body.substring(Math.max(0, body.length - 1000)))
      
      // Tentar encontrar caracteres problemáticos
      const problemChars = body.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g)
      if (problemChars) {
        console.error("Caracteres problemáticos encontrados:", problemChars)
      }
      
      return NextResponse.json({ error: `JSON inválido: ${jsonErr.message}` }, { status: 400 })
    }

    if (!endpointSecret) {
      console.error("ERRO CRÍTICO: STRIPE_WEBHOOK_SECRET não está configurado!")
      return NextResponse.json({ error: "Webhook secret não configurado" }, { status: 500 })
    }

    let event: Stripe.Event

    try {
      // Verificar a assinatura do webhook (permitir testes locais)
      if (signature && endpointSecret) {
        console.log("🔐 Verificando assinatura do webhook...")
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
        console.log("✅ Evento verificado com sucesso:", event.type)
        console.log("Event ID:", event.id)
        console.log("Event created:", new Date(event.created * 1000).toISOString())
      } else {
        // Para testes locais, parsear o JSON diretamente
        console.log("⚠️ Modo de teste - parseando JSON diretamente")
        if (!isValidJson) {
          throw new Error("JSON inválido detectado anteriormente")
        }
        event = JSON.parse(body) as Stripe.Event
        console.log("✅ Evento parseado para teste:", event.type)
      }
    } catch (err: any) {
      console.error("=== ERRO NA VERIFICAÇÃO DO WEBHOOK ===")
      console.error("Erro:", err.message)
      console.error("Stack:", err.stack)
      console.error("Signature recebida:", signature)
      console.error("Webhook secret usado:", endpointSecret.substring(0, 10) + "...")
      console.error("Body length:", body.length)
      console.error("Body type:", typeof body)
      
      // Log adicional para debug
      if (err.message.includes("Unterminated string")) {
        console.error("🔍 Problema de string não terminada detectado")
        const stringMatches = body.match(/"[^"]*$/g)
        if (stringMatches) {
          console.error("Strings não terminadas encontradas:", stringMatches)
        }
      }
      
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Lidar com o evento
    console.log(`🔄 Processando evento: ${event.type}`)

    // Verificar se o evento pertence a esta loja
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session
      const storeId = session.metadata?.store
      
      // Se for um pagamento desta loja (tem 'store: fanzone12') OU se for um pagamento antigo/legacy que devemos tentar processar
      // Mas para resolver o conflito atual, vamos ser estritos: só processar se tiver a tag correta
      if (storeId !== 'fanzone12') {
        console.log(`⚠️ Evento ignorado: Pertence a outra loja (store: ${storeId || 'undefined'})`)
        return NextResponse.json({ received: true, status: 'ignored_other_store' })
      }
    }

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        console.log(`✅ Checkout session completed: ${session.id}`)
        console.log("Session details:", {
          id: session.id,
          payment_status: session.payment_status,
          customer_email: session.customer_details?.email,
          amount_total: session.amount_total
        })

        // Processar o pedido concluído
        try {
          await handleCompletedCheckout(session)
          console.log("✅ Pedido processado com sucesso")
        } catch (error) {
          console.error("❌ Erro ao processar pedido:", error)
          throw error
        }
        break

      case "checkout.session.async_payment_succeeded":
        const asyncSession = event.data.object as Stripe.Checkout.Session
        console.log(`✅ Async payment succeeded: ${asyncSession.id}`)
        
        try {
          await handleAsyncPaymentSucceeded(asyncSession)
          console.log("✅ Pagamento assíncrono processado com sucesso")
        } catch (error) {
          console.error("❌ Erro ao processar pagamento assíncrono:", error)
          throw error
        }
        break

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`💰 PaymentIntent for ${paymentIntent.amount} was successful!`)

        // Atualizar o status de pagamento se houver um pedido associado
        await updatePaymentStatus(paymentIntent)
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.log(`❌ Payment failed for PaymentIntent: ${failedPayment.id}`)

        // Atualizar o status de pagamento para falha
        await updatePaymentStatusFailed(failedPayment)
        break

      default:
        console.log(`⚠️ Unhandled event type ${event.type}`)
    }

    console.log("✅ Webhook processado com sucesso")
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("=== ERRO GERAL NO WEBHOOK ===")
    console.error("Erro:", error)
    console.error("Stack:", error instanceof Error ? error.stack : "N/A")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Função para atualizar o status de pagamento quando o pagamento é bem-sucedido
async function updatePaymentStatus(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Verificar se há metadados com o ID do pedido
    const orderId = paymentIntent.metadata?.order_id

    if (!orderId) {
      console.log("Nenhum ID de pedido encontrado nos metadados do PaymentIntent")
      return
    }

    // Atualizar o status de pagamento do pedido
    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) {
      console.error("Erro ao atualizar status de pagamento:", error)
      return
    }

    console.log(`Status de pagamento atualizado para 'paid' para o pedido ${orderId}`)
  } catch (error) {
    console.error("Erro ao processar atualização de status de pagamento:", error)
  }
}

// Função para atualizar o status de pagamento quando o pagamento falha
async function updatePaymentStatusFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Verificar se há metadados com o ID do pedido
    const orderId = paymentIntent.metadata?.order_id

    if (!orderId) {
      console.log("Nenhum ID de pedido encontrado nos metadados do PaymentIntent")
      return
    }

    // Atualizar o status de pagamento do pedido
    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) {
      console.error("Erro ao atualizar status de pagamento:", error)
      return
    }

    console.log(`Status de pagamento atualizado para 'failed' para o pedido ${orderId}`)
  } catch (error) {
    console.error("Erro ao processar atualização de status de pagamento:", error)
  }
}

// Função para enviar emails (cliente + admin) - evita duplicação
async function sendEmails(order: any, orderItems: any[], paymentMethodText: string, customerData: any, shippingAddress?: any) {
  try {
    logger("=== ENVIANDO EMAILS (CLIENTE + ADMIN) ===")
    
    if (!isProduction) {
      logger("Shipping address recebido:", shippingAddress)
      logger("Order shipping_address:", order.shipping_address)
    }
    
    // Usar shippingAddress passado como parâmetro ou fallback para order.shipping_address
    const finalShippingAddress = shippingAddress || order.shipping_address
    
    // Preparar dados para emails
    const emailData = {
      orderNumber: order.order_number,
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      orderDate: new Date(order.created_at).toLocaleDateString('en-US'),
      items: orderItems.map(item => {
        if (!isProduction) {
          logger("Mapeando item para email:", {
            product_name: item.product_name,
            unit_price: item.unit_price,
            quantity: item.quantity,
            size: item.size,
            customization: item.customization
          })
        }
        return {
          name: item.product_name,
          price: item.unit_price,
          quantity: item.quantity,
          size: item.size,
          customization: item.customization
        }
      }),
      subtotal: order.subtotal || (order.total_amount - order.shipping_cost),
      shipping: order.shipping_cost,
      total: order.total_amount,
      shippingAddress: finalShippingAddress,
      paymentMethod: paymentMethodText,
      upfrontPayment: order.upfront_payment || 0,
      remainingPayment: order.remaining_payment || 0,
      hasPersonalizedItems: orderItems.some(item => item.is_personalized)
    }
    
    console.log("Email data shippingAddress:", emailData.shippingAddress)

    // Enviar email de confirmação para o cliente com retry
    logger("=== ENVIANDO EMAIL DE CONFIRMAÇÃO PARA CLIENTE ===")
    await sendEmailWithRetry(() => sendOrderConfirmationEmail(emailData), "confirmação")

    // Enviar notificação para admin com retry
    logger("=== ENVIANDO NOTIFICAÇÃO PARA ADMIN ===")
    await sendEmailWithRetry(() => sendAdminOrderNotification(emailData), "admin")
  } catch (error) {
    console.error("❌ Erro geral ao enviar emails:", error)
  }
}

// Helper para processar comissões
async function processCommission(order: any) {
  try {
    if (order.discount_code && order.payment_status === "paid") {
      // Buscar parceiro pelo discount_code
      const { data: partner, error: partnerError } = await supabaseAdmin
        .from("partners")
        .select("id, discount_code")
        .eq("discount_code", order.discount_code)
        .single()

      if (!partnerError && partner) {
        // Verificar se já existe comissão para esta encomenda
        const { data: existingCommission } = await supabaseAdmin
            .from("partner_commissions")
            .select("id")
            .eq("order_id", order.id)
            .single()

        if (existingCommission) {
            console.log("⚠️ Comissão já registada para esta encomenda.")
            return
        }

        const commissionValue = Number((order.total * 0.10).toFixed(2))

        // Inserir comissão
        const { error: commissionError } = await supabaseAdmin
          .from("partner_commissions")
          .insert({
            partner_id: partner.id,
            order_id: order.id,
            commission_value: commissionValue,
          })

        if (commissionError) {
          console.error("Erro ao criar comissão do parceiro:", commissionError)
        } else {
          console.log("✅ Comissão registada:", commissionValue)
        }
      }
    }
  } catch (commissionCatchError) {
    console.error("Erro no processamento de comissão:", commissionCatchError)
  }
}

async function handleAsyncPaymentSucceeded(session: Stripe.Checkout.Session) {
  try {
    logger("=== PROCESSANDO PAGAMENTO ASSÍNCRONO (ASYNC SUCCESS) ===")
    logger("Session ID:", session.id)

    // 1. Procurar a encomenda existente pelo session_id
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("stripe_session_id", session.id)
      .single()

    if (orderError || !order) {
      console.error("❌ Encomenda não encontrada para pagamento assíncrono:", session.id)
      // Opcional: Criar a encomenda aqui se não existir?
      // Por agora, seguimos a regra estrita de atualizar.
      return
    }

    console.log("✅ Encomenda encontrada:", order.id)
    
    // 2. Atualizar status para paid
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq("id", order.id)
      .select()
      .single()
      
    if (updateError) {
      console.error("❌ Erro ao atualizar status da encomenda (Async):", updateError)
      throw updateError
    }

    console.log("✅ Status atualizado para PAID")

    // 3. Processar comissão
    await processCommission(updatedOrder)

    // 4. Buscar itens da encomenda para o email
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", updatedOrder.id)
    
    if (itemsError) {
       console.error("❌ Erro ao buscar itens para email:", itemsError)
       return
    }

    // 5. Preparar dados e enviar emails
    const customerData = {
       name: updatedOrder.customer_name,
       email: updatedOrder.customer_email,
       phone: updatedOrder.customer_phone
    }
    
    const paymentMethodText = updatedOrder.payment_method === 'cash_on_delivery' ? "Cash on Delivery" : "Online Payment"
    
    // shipping_address já está no objeto order, mas sendEmails espera o formato talvez diferente ou usa o do order
    // A função sendEmails usa `order.shipping_address` como fallback, então podemos passar null se quisermos usar o do DB
    
    await sendEmails(updatedOrder, orderItems, paymentMethodText, customerData, updatedOrder.shipping_address)
    
  } catch (error) {
    console.error("=== ERRO NO PAGAMENTO ASSÍNCRONO ===")
    console.error("Erro:", error)
    throw error
  }
}

async function handleCompletedCheckout(session: Stripe.Checkout.Session) {
  try {
    logger("=== INICIANDO PROCESSAMENTO DO CHECKOUT ===")
    logger("Session ID:", session.id)
    
    // Verificar se é um pagamento antecipado usando função utilitária
    const isUpfrontPayment = checkIfUpfrontPayment(session)
    
    if (isUpfrontPayment) {
      logger("=== PAGAMENTO ANTECIPADO DETECTADO ===")
      await handleUpfrontPayment(session)
      return
    }
    
    // Recuperar detalhes da sessão com expansão completa
    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product', 'customer_details']
    })
    console.log("Sessão expandida obtida")

    // Recuperar detalhes do cliente
    const customerEmail = expandedSession.customer_details?.email || ""
    const customerName = expandedSession.customer_details?.name || ""
    const customerPhone = expandedSession.customer_details?.phone || ""
    const shippingAddress = expandedSession.customer_details?.address
    
    // Buscar o usuário pelo email (se estiver autenticado)
    let userId = null
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", customerEmail)
      .single()

    if (userData) {
      userId = userData.id
    }

     // Metadados da sessão
     const sessionDiscountCode = (expandedSession.metadata && (expandedSession.metadata as any).discount_code) || null
     const paymentMethod = (expandedSession.metadata && (expandedSession.metadata as any).payment_method) || 'online'
     
    const originalTotal = (expandedSession.metadata && (expandedSession.metadata as any).original_total) ? 
      parseFloat((expandedSession.metadata as any).original_total) : 0

    // Calcular valores baseado no método de pagamento
    const totalAmount = (session.amount_total || 0) / 100
    const shippingCost = (session.shipping_cost?.amount_total || 0) / 100
    
    let upfrontPayment = 0
    let remainingPayment = totalAmount
    
    if (paymentMethod === 'cash_on_delivery') {
      upfrontPayment = 8.00 // Sempre 8€ antecipadamente
      remainingPayment = originalTotal // Restante = total original (sem subtrair os €8)
    }

    // --- IDEMPOTÊNCIA: Verificar se a encomenda já existe ---
    const { data: existingOrder } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("stripe_session_id", session.id)
        .single()
    
    let order: any;
    let orderItems: any[] = [];
    
    if (existingOrder) {
        logger("⚠️ Encomenda já existe. Atualizando status...")
        
        // Atualizar status e updated_at
        const { data: updatedOrder, error: updateError } = await supabaseAdmin
             .from('orders')
             .update({
                 payment_status: session.payment_status, // Pode ser 'paid' ou 'unpaid'/'no_payment_required'
                 updated_at: new Date().toISOString()
             })
             .eq('id', existingOrder.id)
             .select()
             .single()
             
        if (updateError) throw updateError;
        order = updatedOrder;
        
        // Se formos enviar email, precisamos dos items
        if (order.payment_status === 'paid') {
             const { data: items } = await supabaseAdmin
                .from('order_items')
                .select('*')
                .eq('order_id', order.id)
             orderItems = items || [];
        }
        
    } else {
        // --- CRIAR NOVA ENCOMENDA ---
        // Preparar dados do pedido
        const orderData = {
          user_id: userId,
          stripe_session_id: session.id,
          order_number: Math.floor(100000 + Math.random() * 900000).toString(),
          status: "processing",
          payment_status: session.payment_status === "paid" ? "paid" : "pending",
          total: paymentMethod === 'cash_on_delivery' ? originalTotal : totalAmount,
          total_amount: paymentMethod === 'cash_on_delivery' ? originalTotal : totalAmount,
          subtotal: paymentMethod === 'cash_on_delivery' ? (originalTotal - shippingCost) : (totalAmount - shippingCost),
          shipping_cost: shippingCost,
          shipping_address: shippingAddress,
          billing_address: expandedSession.customer_details,
          payment_method: paymentMethod,
          email: customerEmail,
          customer_name: customerName,
          customer_phone: customerPhone,
          discount_code: sessionDiscountCode || null,
          cash_on_delivery_fee: paymentMethod === 'cash_on_delivery' ? 8.00 : 0,
          upfront_payment: upfrontPayment,
          remaining_payment: remainingPayment,
          is_upfront_payment: paymentMethod === 'cash_on_delivery',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        console.log("=== CRIANDO NOVA ENCOMENDA ===")
        const { data: newOrder, error: orderError } = await supabaseAdmin
          .from("orders")
          .insert(orderData)
          .select()
          .single()

        if (orderError) {
          console.error("=== ERRO AO SALVAR PEDIDO ===")
          throw orderError
        }
        order = newOrder;
        
        // --- PROCESSAR ITENS ---
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
           expand: ['data.price.product']
        })
        
        // Mapear itens (lógica de parsing existente)
        orderItems = lineItems.data.map((item) => {
           const description = item.description || ""
           const sizeMatch = description.match(/Tamanho:\s*([A-Z0-9-]+)/i)
           const size = sizeMatch ? sizeMatch[1] : "M"
           const customizationMatch = description.match(/Personalização:\s*([^•]+?)(?:\s*•|$)/i)
           const customization = customizationMatch ? customizationMatch[1].trim() : null
           const productName = description.split(/Tamanho:|•/)[0].trim()
           const unitPrice = (item.amount_total || 0) / 100 / (item.quantity || 1)
           
           let finalUnitPrice = unitPrice
           if (unitPrice === 0 && (item as any).price_data?.unit_amount) {
             finalUnitPrice = ((item as any).price_data.unit_amount || 0) / 100
           }
           const finalProductName = productName || description || "Produto"
           
           return {
             order_id: order.id,
             product_name: finalProductName,
             quantity: item.quantity || 1,
             unit_price: finalUnitPrice,
             size: size,
             customization: customization,
             is_personalized: !!customization,
           }
        })
        
        if (orderItems.length > 0) {
            const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems)
            if (itemsError) throw itemsError
        }
    }

    // --- VERIFICAÇÃO ESTRITA DE PAGAMENTO (Gatekeeper) ---
    if (order.payment_status === 'paid') {
        console.log("✅ Pagamento confirmado (PAID). Processando emails e comissões.")
        
        // Processar comissão se ainda não foi processada
        await processCommission(order)
        
        // Preparar dados para email
        const customerData = {
           name: customerName,
           email: customerEmail,
           phone: customerPhone
        }
        
        const paymentMethodText = paymentMethod === 'cash_on_delivery' ? "Cash on Delivery" : "Online Payment"
        
        const formattedShippingAddress = shippingAddress ? {
           name: customerName || 'Customer',
           address: shippingAddress.line1 || '',
           city: shippingAddress.city || '',
           postalCode: shippingAddress.postal_code || '',
           country: shippingAddress.country || ''
        } : null
        
        await sendEmails(order, orderItems, paymentMethodText, customerData, formattedShippingAddress)
        
    } else {
        console.log(`⏳ Status do pagamento: ${order.payment_status}. Emails NÃO enviados.`)
        console.log("Aguardando confirmação de pagamento (async_payment_succeeded) ou webhook futuro.")
    }

    console.log("✅ PROCESSAMENTO COMPLETO DO PEDIDO FINALIZADO")

  } catch (error) {
    console.error("=== ERRO CRÍTICO NO PROCESSAMENTO ===")
    console.error("Erro:", error)
    console.error("Stack:", error instanceof Error ? error.stack : "N/A")
    throw error
  }
}

async function handleUpfrontPayment(session: Stripe.Checkout.Session) {
  try {
    console.log("=== PROCESSANDO PAGAMENTO ANTECIPADO ===")
    console.log("Session ID:", session.id)
    console.log("Metadata:", session.metadata)
    console.log("Amount total:", session.amount_total)
    console.log("Payment status:", session.payment_status)
    
    const orderNumber = session.metadata?.orderNumber
    console.log("Order number from metadata:", orderNumber)
    
    if (!orderNumber) {
      console.error("❌ Número do pedido não encontrado nos metadados")
      console.error("Metadata disponível:", JSON.stringify(session.metadata, null, 2))
      console.error("Tentando extrair da descrição...")
      
      // Tentar extrair da descrição se não estiver nos metadados
      const descriptionMatch = session.line_items?.data?.[0]?.description?.match(/Pedido\s+([A-Z0-9-]+)/i)
      if (descriptionMatch) {
        const extractedOrderNumber = descriptionMatch[1]
        console.log("Número do pedido extraído da descrição:", extractedOrderNumber)
        return await processUpfrontPaymentWithOrderNumber(session, extractedOrderNumber)
      }
      
      return
    }
    
    await processUpfrontPaymentWithOrderNumber(session, orderNumber)
    
  } catch (error) {
    console.error("=== ERRO NO PROCESSAMENTO DO PAGAMENTO ANTECIPADO ===")
    console.error("Erro:", error)
    throw error
  }
}

async function processUpfrontPaymentWithOrderNumber(session: Stripe.Checkout.Session, orderNumber: string) {
  try {
    console.log("=== PROCESSANDO PAGAMENTO ANTECIPADO COM NÚMERO ===")
    console.log("Order number:", orderNumber)
    
    console.log("Buscando pedido:", orderNumber)
    
    // Buscar o pedido original
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()
    
    if (orderError || !order) {
      console.error("❌ Pedido não encontrado:", orderError)
      return
    }
    
    console.log("✅ Pedido encontrado:", order.id)
    
    // Atualizar status do pagamento para pago
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id)
    
    if (updateError) {
      console.error("❌ Erro ao atualizar pedido:", updateError)
      return
    }
    
    console.log("✅ Status do pedido atualizado para pago")
    
    // Buscar itens do pedido
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)
    
    if (itemsError || !orderItems) {
      console.error("❌ Erro ao buscar itens do pedido:", itemsError)
      return
    }
    
    console.log("✅ Itens do pedido encontrados:", orderItems.length)
    
     // Enviar emails usando função centralizada
     const customerData = {
       name: order.customer_name,
       email: order.customer_email,
       phone: order.customer_phone
     }
     
     await sendEmails(order, orderItems, 'Cash on Delivery (€8 upfront)', customerData)
    
    console.log("✅ PAGAMENTO ANTECIPADO PROCESSADO COM SUCESSO")
    
  } catch (error) {
    console.error("=== ERRO NO PROCESSAMENTO DO PAGAMENTO ANTECIPADO ===")
    console.error("Erro:", error)
    throw error
  }
}
