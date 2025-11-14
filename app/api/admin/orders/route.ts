import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    console.log("=== BUSCANDO ENCOMENDAS VIA API ADMIN ===")

    // Buscar encomendas com itens usando supabaseAdmin (sem restrições RLS)
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_name,
          unit_price,
          quantity,
          size,
          customization,
          is_personalized
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar encomendas:", error)
      return NextResponse.json({
        success: false,
        error: error.message,
        orders: []
      }, { status: 500 })
    }

    console.log("✅ Encomendas encontradas via API:", orders?.length || 0)
    
    // Debug dos itens das encomendas
    if (orders && orders.length > 0) {
      console.log("=== DEBUG ITENS DAS ENCOMENDAS ===")
      orders.forEach((order, index) => {
        console.log(`Encomenda ${index + 1} (${order.order_number}):`)
        console.log(`  - ID: ${order.id}`)
        console.log(`  - Itens: ${order.order_items?.length || 0}`)
        if (order.order_items && order.order_items.length > 0) {
          order.order_items.forEach((item: any, itemIndex: number) => {
            console.log(`    Item ${itemIndex + 1}: ${item.product_name} - ${item.unit_price}€ x${item.quantity}`)
          })
        } else {
          console.log("    ❌ NENHUM ITEM ENCONTRADO")
        }
      })
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
      total: orders?.length || 0
    })

  } catch (error: any) {
    console.error("❌ Erro geral na API de encomendas:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      orders: []
    }, { status: 500 })
  }
} 