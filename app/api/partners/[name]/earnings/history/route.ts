import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

function getMonday(date: Date) {
  const d = new Date(date)
  const day = d.getDay() // 0=Sun, 1=Mon, ...
  // Usar a mesma lógica das funções SQL: (day + 6) % 7
  const diff = (day + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const url = new URL(request.url)
    const limitParam = url.searchParams.get("limit")
    const limit = Math.min(Math.max(parseInt(limitParam || "8", 10) || 8, 1), 24)
    const partnerName = decodeURIComponent(params.name)

    const { data: partner, error: partnerError } = await supabaseAdmin
      .from("partners")
      .select("id, discount_code, name")
      .ilike("name", partnerName)
      .single()

    if (partnerError || !partner) {
      return NextResponse.json({ error: "Parceiro não encontrado" }, { status: 404 })
    }

    // Construir intervalos semanais: de segunda-feira a domingo, últimas N semanas (reset às 00:00h de segunda-feira)
    const now = new Date()
    const currentMonday = getMonday(now)

    const weeks: Array<{ start: Date; end: Date }> = []
    for (let i = 0; i < limit; i++) {
      const start = new Date(currentMonday)
      start.setDate(currentMonday.getDate() - i * 7)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      weeks.push({ start, end })
    }

    const results: Array<{
      weekIndex: number
      start: string
      end: string
      ordersCount: number
      totalPaid: number
      commission: number
    }> = []

    for (let i = 0; i < weeks.length; i++) {
      const w = weeks[i]
      const { data: paidOrders } = await supabaseAdmin
        .from("orders")
        .select("total, created_at")
        .eq("discount_code", partner.discount_code)
        .eq("payment_status", "paid")
        .gte("created_at", w.start.toISOString())
        .lte("created_at", w.end.toISOString())

      const totalPaid = (paidOrders || []).reduce((sum, o: any) => sum + Number(o.total || 0), 0)
      const commission = Number((totalPaid * 0.10).toFixed(2))
      results.push({
        weekIndex: i, // 0 = semana atual, 1 = anterior, etc.
        start: w.start.toISOString(),
        end: w.end.toISOString(),
        ordersCount: paidOrders?.length || 0,
        totalPaid: Number(totalPaid.toFixed(2)),
        commission,
      })
    }

    return NextResponse.json({ partner: { id: partner.id, name: partner.name }, weeks: results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 })
  }
}


