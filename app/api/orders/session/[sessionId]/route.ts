import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID é obrigatório" }, { status: 400 })
    }

    // Buscar pedido por session_id
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single()

    if (orderError) {
      console.error("Erro ao buscar pedido:", orderError)
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }

    // Buscar itens do pedido
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)

    if (itemsError) {
      console.error("Erro ao buscar itens do pedido:", itemsError)
    }

    // Normalizar resposta: alinhar campos e mapear itens para product_name/unit_price
    const normalizedItems = (orderItems || []).map((item: any) => ({
      product_name: item.product_name || item.name,
      unit_price: item.unit_price ?? item.price ?? 0,
      quantity: item.quantity,
      size: item.size,
      customization: item.customization,
      is_personalized: item.is_personalized,
    }))

    const normalizedOrder = {
      ...order,
      customer_email: (order as any).customer_email || (order as any).email || null,
      total_amount: (order as any).total_amount ?? (order as any).total ?? 0,
      shipping_cost: (order as any).shipping_cost ?? (order as any).shipping ?? 0,
      order_items: normalizedItems,
    }

    return NextResponse.json(normalizedOrder)

  } catch (error) {
    console.error("Erro na API de busca de pedido:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
