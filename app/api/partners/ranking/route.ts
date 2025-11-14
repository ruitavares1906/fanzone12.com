import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const period = url.searchParams.get("period") || "monthly" // "monthly" | "total" | "previous_month"

    let startDate: string | null = null
    let endDate: string | null = null
    let periodLabel = ""

    if (period === "monthly") {
      // Mês atual (dia 1 até hoje)
      const now = new Date()
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString()
      periodLabel = `Mês Atual (${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()})`
    } else if (period === "previous_month") {
      // Mês anterior completo
      const now = new Date()
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastDayPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      startDate = previousMonth.toISOString()
      endDate = new Date(lastDayPreviousMonth.getFullYear(), lastDayPreviousMonth.getMonth(), lastDayPreviousMonth.getDate(), 23, 59, 59, 999).toISOString()
      periodLabel = `Mês Anterior (${previousMonth.getMonth() + 1}/${previousMonth.getFullYear()})`
    }

    // Agregar total por discount_code em orders pagas
    let query = supabaseAdmin
      .from("orders")
      .select("discount_code, total, created_at")
      .eq("payment_status", "paid")

    if (startDate) {
      query = query.gte("created_at", startDate)
    }
    
    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    const { data: orders, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const totalsMap = new Map<string, number>()
    for (const o of orders || []) {
      if (!o.discount_code) continue
      const prev = totalsMap.get(o.discount_code) || 0
      totalsMap.set(o.discount_code, prev + Number(o.total || 0))
    }

    // Trazer nomes dos parceiros
    const codes = Array.from(totalsMap.keys())
    let partners: Record<string, { id: string; name: string }> = {}
    if (codes.length > 0) {
      const { data: partnersData } = await supabaseAdmin
        .from("partners")
        .select("id, name, discount_code")
        .in("discount_code", codes)
      for (const p of partnersData || []) {
        partners[p.discount_code] = { id: p.id, name: p.name }
      }
    }

    const ranking = codes
      .map((code, index) => ({
        rank: index + 1,
        discount_code: code,
        partner: partners[code]?.name || code,
        partner_id: partners[code]?.id || null,
        total: Number((totalsMap.get(code) || 0).toFixed(2)),
        commission: Number(((totalsMap.get(code) || 0) * 0.10).toFixed(2)),
      }))
      .sort((a, b) => b.total - a.total)

    // Recalcular ranks após ordenação
    ranking.forEach((item, index) => {
      item.rank = index + 1
    })

    // Para o mês anterior, só retornar dados se realmente há encomendas nesse período
    if (period === "previous_month" && orders && orders.length === 0) {
      return NextResponse.json({ 
        period, 
        periodLabel,
        dateRange: {
          start: startDate,
          end: endDate
        },
        ranking: [],
        winner: null,
        hasData: false
      })
    }

    return NextResponse.json({ 
      period, 
      periodLabel,
      dateRange: {
        start: startDate,
        end: endDate
      },
      ranking,
      winner: ranking.length > 0 ? ranking[0] : null,
      hasData: ranking.length > 0
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 })
  }
}


