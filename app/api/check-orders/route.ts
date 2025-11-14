import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    console.log("=== VERIFICANDO ENCOMENDAS ===")
    
    // Verificar se a tabela orders existe e tem dados
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    if (ordersError) {
      console.error("Erro ao buscar encomendas:", ordersError)
      return NextResponse.json({
        success: false,
        error: ordersError.message,
        orders: [],
        count: 0
      })
    }

    // Verificar se a tabela order_items existe e tem dados
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .limit(10)

    if (itemsError) {
      console.log("Erro ao buscar order_items (tabela pode não existir):", itemsError.message)
    }

    // Contar total de encomendas
    const { count, error: countError } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })

    return NextResponse.json({
      success: true,
      orders: orders || [],
      orderItems: orderItems || [],
      totalOrders: count || 0,
      message: `Encontradas ${count || 0} encomendas na base de dados`
    })
  } catch (error: any) {
    console.error("Erro geral:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      orders: [],
      count: 0
    })
  }
} 