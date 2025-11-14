import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { sendOrderConfirmationEmail } from "@/lib/mailgun"

interface CashOnDeliveryOrderData {
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    size?: string
    customization?: {
      name?: string
      number?: string
      patches?: string[]
    }
  }>
  subtotal: number
  shipping: number
  cashOnDeliveryFee: number
  total: number
  upfrontPayment: number
  remainingPayment: number
  hasPersonalizedItems: boolean
  discountCode?: string
  discountAmount?: number
}

export async function POST(request: Request) {
  try {
    const orderData: CashOnDeliveryOrderData = await request.json()

    console.log("=== PROCESSANDO PEDIDO À COBRANÇA ===")
    console.log("Dados do pedido:", JSON.stringify(orderData, null, 2))

    // Gerar número único do pedido
    const orderNumber = `COD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Inserir pedido na base de dados
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        shipping_address: orderData.shippingAddress,
        subtotal: orderData.subtotal,
        shipping_cost: orderData.shipping,
        total_amount: orderData.total,
        payment_method: 'cash_on_delivery',
        payment_status: orderData.hasPersonalizedItems ? 'partial' : 'pending',
        upfront_payment: orderData.upfrontPayment,
        remaining_payment: orderData.remainingPayment,
        cash_on_delivery_fee: orderData.cashOnDeliveryFee,
        discount_code: orderData.discountCode,
        discount_amount: orderData.discountAmount || 0,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (orderError) {
      console.error("Erro ao criar pedido:", orderError)
      return NextResponse.json(
        { success: false, error: "Erro ao criar pedido" },
        { status: 500 }
      )
    }

    // Inserir itens do pedido
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      size: item.size,
      customization: item.customization,
      is_personalized: !!(item.customization?.name || item.customization?.number)
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error("Erro ao inserir itens do pedido:", itemsError)
      return NextResponse.json(
        { success: false, error: "Erro ao inserir itens do pedido" },
        { status: 500 }
      )
    }

    // Email será enviado apenas após pagamento confirmado
    console.log("📧 Email será enviado após pagamento confirmado")

    console.log("✅ Pedido à cobrança criado com sucesso:", orderNumber)

    // Se tem produtos personalizados, redirecionar para pagamento antecipado
    if (orderData.hasPersonalizedItems) {
      return NextResponse.json({
        success: true,
        orderNumber,
        orderId: order.id,
        paymentMethod: 'cash_on_delivery',
        upfrontPayment: orderData.upfrontPayment,
        remainingPayment: orderData.remainingPayment,
        hasPersonalizedItems: orderData.hasPersonalizedItems,
        requiresUpfrontPayment: true,
        message: 'Pedido criado! Deve pagar 8€ antecipadamente para produtos personalizados.',
        upfrontPaymentUrl: `/api/create-upfront-payment`
      })
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: order.id,
      paymentMethod: 'cash_on_delivery',
      upfrontPayment: orderData.upfrontPayment,
      remainingPayment: orderData.remainingPayment,
      hasPersonalizedItems: orderData.hasPersonalizedItems,
      requiresUpfrontPayment: false,
      message: 'Pedido criado! Pode pagar tudo à cobrança.'
    })

  } catch (error: any) {
    console.error("Erro ao processar pedido à cobrança:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
