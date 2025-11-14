import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    console.log("=== VERIFICANDO ESTRUTURA DAS TABELAS ===")

    // Verificar se a tabela orders existe
    const { data: ordersData, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .limit(1)

    console.log("Orders table check:")
    console.log("Data:", ordersData)
    console.log("Error:", ordersError)

    // Verificar se a tabela order_items existe
    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .limit(1)

    console.log("Order_items table check:")
    console.log("Data:", itemsData)
    console.log("Error:", itemsError)

    // Buscar últimos pedidos
    const { data: recentOrders, error: recentError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    console.log("Recent orders:")
    console.log("Data:", recentOrders)
    console.log("Error:", recentError)

    // Buscar itens dos últimos pedidos
    const { data: recentItems, error: recentItemsError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    console.log("Recent order items:")
    console.log("Data:", recentItems)
    console.log("Error:", recentItemsError)

    return NextResponse.json({
      orders: {
        data: ordersData,
        error: ordersError
      },
      order_items: {
        data: itemsData,
        error: itemsError
      },
      recent_orders: {
        data: recentOrders,
        error: recentError
      },
      recent_items: {
        data: recentItems,
        error: recentItemsError
      }
    })

  } catch (error: any) {
    console.error("Erro ao verificar tabelas:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
