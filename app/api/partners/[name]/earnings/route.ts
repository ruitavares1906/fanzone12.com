import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

function getDateRange(filter: string, customStart?: string, customEnd?: string) {
  const now = new Date()
  let start: Date | null = null
  let end: Date | null = null

  switch (filter) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
      break
    case "yesterday":
      const yesterday = new Date(now)
      yesterday.setDate(now.getDate() - 1)
      start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
      end = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999)
      break
    case "last7days":
      start = new Date(now)
      start.setDate(now.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
      break
    case "last30days":
      start = new Date(now)
      start.setDate(now.getDate() - 29)
      start.setHours(0, 0, 0, 0)
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
      break
    case "currentWeek":
      // Semana atual (Segunda-feira a Domingo) - Reset às 00:00h de segunda-feira
      const currentDay = now.getDay() // 0=Domingo, 1=Segunda, ..., 6=Sábado
      const daysFromMonday = (currentDay + 6) % 7 // Mesma lógica da função SQL get_current_week_start()
      start = new Date(now)
      start.setDate(now.getDate() - daysFromMonday)
      start.setHours(0, 0, 0, 0)
      end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      break
    case "previousWeek":
      // Semana anterior (Segunda-feira a Domingo) - Reset às 00:00h de segunda-feira
      const prevDay = now.getDay()
      const prevDaysFromMonday = (prevDay + 6) % 7
      start = new Date(now)
      start.setDate(now.getDate() - prevDaysFromMonday - 7)
      start.setHours(0, 0, 0, 0)
      end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      break
    case "custom":
      if (customStart && customEnd) {
        start = new Date(customStart)
        end = new Date(customEnd)
        end.setHours(23, 59, 59, 999)
      }
      break
    case "daily":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case "weekly":
      start = new Date(now)
      start.setDate(now.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      break
    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case "total":
      start = null
      end = null
      break
    default:
      start = null
  }
  return { start, end }
}

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const url = new URL(request.url)
    const filter = url.searchParams.get("filter") || "currentWeek"
    const customStart = url.searchParams.get("customStart")
    const customEnd = url.searchParams.get("customEnd")
    const partnerName = decodeURIComponent(params.name)

    const { data: partner, error: partnerError } = await supabaseAdmin
      .from("partners")
      .select("id, discount_code, name")
      .ilike("name", partnerName)
      .single()

    if (partnerError || !partner) {
      return NextResponse.json({ error: "Parceiro não encontrado" }, { status: 404 })
    }

    const { start: startDate, end: endDate } = getDateRange(filter, customStart || undefined, customEnd || undefined)

    // Ganhos baseados em orders pagas
    let query = supabaseAdmin
      .from("orders")
      .select("total, created_at")
      .eq("discount_code", partner.discount_code)
      .eq("payment_status", "paid")

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString())
    }
    
    if (endDate) {
      query = query.lte("created_at", endDate.toISOString())
    }

    const { data: paidOrders, error: ordersError } = await query

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 500 })
    }

    const totalPaid = (paidOrders || []).reduce((sum, o: any) => sum + Number(o.total || 0), 0)
    const commission = Number((totalPaid * 0.10).toFixed(2))

    // Calcular comparação com semana anterior se for semana atual
    let previousWeekCommission = 0
    if (filter === "currentWeek") {
      const { start: prevStart, end: prevEnd } = getDateRange("previousWeek")
      let prevQuery = supabaseAdmin
        .from("orders")
        .select("total, created_at")
        .eq("discount_code", partner.discount_code)
        .eq("payment_status", "paid")
        .gte("created_at", prevStart!.toISOString())
        .lte("created_at", prevEnd!.toISOString())

      const { data: prevOrders } = await prevQuery
      const prevTotalPaid = (prevOrders || []).reduce((sum, o: any) => sum + Number(o.total || 0), 0)
      previousWeekCommission = Number((prevTotalPaid * 0.10).toFixed(2))
    }

    return NextResponse.json({
      partner: { id: partner.id, name: partner.name },
      filter,
      totalPaid,
      commission,
      previousWeekCommission: filter === "currentWeek" ? previousWeekCommission : null,
      dateRange: {
        start: startDate?.toISOString(),
        end: endDate?.toISOString()
      },
      note: "Os ganhos são calculados apenas sobre encomendas marcadas como pagas pelo administrador.",
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 })
  }
}


