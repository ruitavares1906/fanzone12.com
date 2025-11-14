import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const orderId = resolvedParams.id

    console.log("=== BUSCANDO PEDIDO ===")
    console.log("Order ID:", orderId)
    console.log("Request URL:", request.url)

    // Buscar o pedido
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_number', orderId)
      .single()

    console.log("Resultado da busca do pedido:")
    console.log("Order:", order)
    console.log("Error:", orderError)

    if (orderError || !order) {
      console.error("❌ Pedido não encontrado:", orderError)
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      )
    }

    // Buscar itens do pedido
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)

    console.log("Resultado da busca dos itens:")
    console.log("Order items:", orderItems)
    console.log("Items error:", itemsError)

    if (itemsError) {
      console.error("❌ Erro ao buscar itens:", itemsError)
      return NextResponse.json(
        { error: "Erro ao buscar itens do pedido" },
        { status: 500 }
      )
    }

    console.log("✅ Pedido encontrado:", order.order_number)
    console.log("✅ Itens encontrados:", orderItems?.length || 0)

    // Mapear os itens para o formato correto
    const mappedItems = orderItems?.map(item => ({
      product_name: item.product_name,
      unit_price: item.unit_price || item.price || 0,
      quantity: item.quantity,
      size: item.size,
      customization: item.customization,
      is_personalized: item.is_personalized
    })) || []

    console.log("Itens mapeados:", mappedItems)

    return NextResponse.json({
      ...order,
      order_items: mappedItems
    })

  } catch (error: any) {
    console.error("Erro ao buscar pedido:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
