import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// GET - Obter ranking público (top 3 apenas)
export async function GET() {
  try {
    // Calcular período do mês atual
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString()

    // Buscar dados diretamente sem função SQL
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("discount_code, total")
      .eq("payment_status", "paid")
      .gte("created_at", startOfMonth)
      .lte("created_at", endOfMonth)

    if (ordersError) {
      console.error("Erro ao buscar encomendas:", ordersError)
      return NextResponse.json(
        { error: "Erro ao buscar dados" },
        { status: 500 }
      )
    }

    // Agregar totais por código de desconto
    const totalsMap = new Map<string, number>()
    for (const order of orders || []) {
      if (order.discount_code) {
        const current = totalsMap.get(order.discount_code) || 0
        totalsMap.set(order.discount_code, current + Number(order.total || 0))
      }
    }

    // Buscar dados dos parceiros
    const { data: partners, error: partnersError } = await supabaseAdmin
      .from("partners")
      .select("name, discount_code")
      .in("discount_code", Array.from(totalsMap.keys()))

    if (partnersError) {
      console.error("Erro ao buscar parceiros:", partnersError)
      return NextResponse.json(
        { error: "Erro ao buscar parceiros" },
        { status: 500 }
      )
    }

    // Criar ranking
    const ranking = Array.from(totalsMap.entries())
      .map(([discount_code, total]) => {
        const partner = partners?.find(p => p.discount_code === discount_code)
        return {
          rank: 0, // Será calculado abaixo
          partner_name: partner?.name || "Parceiro Desconhecido",
          total_faturado: Number(total.toFixed(2)),
          discount_code
        }
      })
      .sort((a, b) => b.total_faturado - a.total_faturado)
      .slice(0, 3) // Top 3 apenas
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }))

    // Calcular período atual para o label
    const periodLabel = `Mês Atual (${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()})`

    return NextResponse.json({
      success: true,
      period: "monthly",
      periodLabel,
      ranking,
      hasData: ranking.length > 0
    })
  } catch (error: any) {
    console.error("Erro no ranking público:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

