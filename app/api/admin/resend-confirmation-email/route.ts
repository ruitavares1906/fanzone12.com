import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { sendOrderConfirmationEmail } from "@/lib/mailgun"

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "ID da encomenda é obrigatório" },
        { status: 400 }
      )
    }

    // Buscar detalhes da encomenda
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Encomenda não encontrada" },
        { status: 404 }
      )
    }

    // Buscar itens da encomenda
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)

    if (itemsError) {
      console.warn("Erro ao buscar itens:", itemsError.message)
    }

    // Preparar dados para email
    let items = []
    
    // Tentar usar order_items da tabela separada primeiro
    if (orderItems && orderItems.length > 0) {
      items = orderItems.map(item => ({
        name: item.name || "Produto Desconhecido",
        price: item.price,
        quantity: item.quantity,
        size: item.size || "N/A",
        customization: item.customization || undefined
      }))
    } 
    // Fallback para itens armazenados como JSON na ordem (se order_items estiver vazio)
    else if (order.items) {
      console.warn(`Encomenda ${orderId} não possui itens na tabela 'order_items'. Usando fallback para campo 'items' JSON.`)
      try {
        const orderItemsJson = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
        items = orderItemsJson.map((item: any) => {
          let itemName = item.name || "Produto Desconhecido"
          
          // Lógica de tamanho revertida e simplificada
          let itemSize = item.size || item.options?.size || "N/A"; // Prioriza item.size, depois item.options.size
          // Fallback simples para descrição se ainda for N/A ou M (default)
          if ((itemSize === "N/A" || itemSize === "M") && item.description) {
            const sizeMatch = item.description.match(/Tamanho: ([A-Z0-9\/]+)/i)
            if (sizeMatch && sizeMatch[1]) itemSize = sizeMatch[1].toUpperCase();
          }

          // Lógica de personalização revertida e simplificada
          let itemCustomization = item.customization || undefined;
          if (!itemCustomization && item.options?.name && item.options?.number) {
            itemCustomization = `${item.options.name} ${item.options.number}`;
          } else if (!itemCustomization && item.description) {
            const customMatch = item.description.match(/Personalização: (.*)/i)
            if (customMatch && customMatch[1]) itemCustomization = customMatch[1].trim();
          }

          return {
            name: itemName,
            price: item.price,
            quantity: item.quantity,
            size: itemSize,
            customization: itemCustomization
          }
        })
      } catch (e) {
        console.error(`Erro ao processar itens JSON da encomenda ${orderId}:`, e)
        items = [{
          name: "Erro ao processar itens",
          price: order.total || 0,
          quantity: 1,
          size: "N/A",
          customization: undefined
        }]
      }
    } else {
      console.error(`Encomenda ${orderId} não possui itens em 'order_items' nem no campo 'items' JSON.`)
      items = [{
          name: "Informação de itens indisponível",
          price: order.total || 0,
          quantity: 1,
          size: "N/A",
          customization: undefined
        }]
    }

    // Processar endereço de envio
    let shippingAddress = null
    if (order.shipping_address) {
      try {
        const rawAddress = typeof order.shipping_address === 'string' ? 
          JSON.parse(order.shipping_address) : order.shipping_address
        console.log("Morada processada:", rawAddress)
        
        // Mapear campos corretamente
        shippingAddress = {
          name: order.customer_name || 'Cliente',
          address: rawAddress.line1 || '',
          city: rawAddress.city || '',
          postalCode: rawAddress.postal_code || '',
          country: rawAddress.country || ''
        }
        console.log("Morada mapeada:", shippingAddress)
      } catch (e) {
        console.error("Erro ao processar endereço:", e)
      }
    } else {
      console.log("Nenhuma morada encontrada na encomenda")
    }

    // Enviar email
    console.log("=== PREPARANDO DADOS PARA EMAIL ===")
    console.log("Order number:", order.order_number)
    console.log("Customer name:", order.customer_name)
    console.log("Customer email:", order.email)
    console.log("Subtotal:", order.subtotal)
    console.log("Shipping:", order.shipping_cost)
    console.log("Total:", order.total)
    console.log("Items count:", items.length)
    
    const emailData = {
      orderNumber: order.order_number || orderId.substring(0, 8),
      customerName: order.customer_name || shippingAddress?.name || "Cliente",
      customerEmail: order.customer_email || order.email || "rui@fanzone12.pt",
      orderDate: new Date(order.created_at).toLocaleDateString("pt-PT"),
      items: items,
      subtotal: order.subtotal || (order.total_amount - (order.shipping_cost || 0)),
      shipping: order.shipping_cost || 0,
      total: order.total_amount || order.total,
      shippingAddress: shippingAddress,
      customerPhone: order.customer_phone,
      paymentMethod: order.payment_method || 'Pagamento Online',
      upfrontPayment: order.upfront_payment || 0,
      remainingPayment: order.remaining_payment || 0,
      hasPersonalizedItems: items.some(item => item.customization)
    }
    
    console.log("Dados do email:", JSON.stringify(emailData, null, 2))
    
    await sendOrderConfirmationEmail(emailData)

    return NextResponse.json({
      success: true,
      message: "Email de confirmação reenviado com sucesso"
    })

  } catch (error: any) {
    console.error("Erro ao reenviar email de confirmação:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Erro interno do servidor" 
      },
      { status: 500 }
    )
  }
} 