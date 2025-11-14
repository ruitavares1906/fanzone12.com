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
    default:
      start = null
  }
  return { start, end }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const filter = url.searchParams.get("filter") || "currentWeek"
    // offset: permite navegar para semanas/dias anteriores
    const offsetRaw = parseInt(url.searchParams.get("offset") || "0", 10)
    const offset = isNaN(offsetRaw) ? 0 : offsetRaw
    const customStart = url.searchParams.get("customStart")
    const customEnd = url.searchParams.get("customEnd")

    let { start: startDate, end: endDate } = getDateRange(filter, customStart || undefined, customEnd || undefined)

    // Aplicar offset para semanas/dias anteriores
    if (offset !== 0 && startDate) {
      if (filter === "today" || filter === "yesterday") {
        startDate = new Date(startDate)
        startDate.setDate(startDate.getDate() - offset)
        endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
      } else if (filter === "currentWeek" || filter === "previousWeek") {
        startDate = new Date(startDate)
        startDate.setDate(startDate.getDate() - (offset * 7))
        endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6)
        endDate.setHours(23, 59, 59, 999)
      } else if (filter === "last7days") {
        startDate = new Date(startDate)
        startDate.setDate(startDate.getDate() - (offset * 7))
        endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6)
        endDate.setHours(23, 59, 59, 999)
      } else if (filter === "last30days") {
        startDate = new Date(startDate)
        startDate.setDate(startDate.getDate() - (offset * 30))
        endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 29)
        endDate.setHours(23, 59, 59, 999)
      }
    }

    // Buscar todos os parceiros
    const { data: partners, error: partnersError } = await supabaseAdmin
      .from("partners")
      .select("id, name, discount_code")

    if (partnersError) {
      return NextResponse.json({ error: partnersError.message }, { status: 500 })
    }

    // Para cada parceiro, calcular ganhos
    const partnersWithEarnings = await Promise.all(
      (partners || []).map(async (partner) => {
        let query = supabaseAdmin
          .from("orders")
          .select("total, created_at, id")
          .eq("discount_code", partner.discount_code)
          .eq("payment_status", "paid")

        if (startDate) {
          query = query.gte("created_at", startDate.toISOString())
        }
        
        if (endDate) {
          query = query.lte("created_at", endDate.toISOString())
        }

        const { data: paidOrders } = await query
        const totalPaid = (paidOrders || []).reduce((sum, o: any) => sum + Number(o.total || 0), 0)
        const commission = Number((totalPaid * 0.10).toFixed(2))

        // Verificar se já foi pago (tabela pode não existir ainda)
        let paymentRecord = null
        try {
          const { data } = await supabaseAdmin
            .from("partner_payments")
            .select("is_paid, paid_at, payment_reference")
            .eq("partner_id", partner.id)
            .eq("period_start", startDate?.toISOString().split('T')[0])
            .eq("period_end", endDate?.toISOString().split('T')[0])
            .single()
          paymentRecord = data
        } catch (error) {
          // Tabela pode não existir ainda, continuar sem erro
          console.log("Tabela partner_payments não existe ainda ou erro:", error)
        }

        return {
          ...partner,
          totalPaid,
          commission,
          ordersCount: paidOrders?.length || 0,
          isPaid: paymentRecord?.is_paid || false,
          paidAt: paymentRecord?.paid_at,
          paymentReference: paymentRecord?.payment_reference,
          dateRange: {
            start: startDate?.toISOString(),
            end: endDate?.toISOString()
          }
        }
      })
    )

    // Filtrar apenas parceiros com ganhos > 0
    const partnersWithEarningsFiltered = partnersWithEarnings.filter(p => p.commission > 0)

    // Calcular totais
    // totalCommission: somatório APENAS do que está por pagar no período selecionado
    const totalCommission = partnersWithEarningsFiltered
      .filter((p) => !p.isPaid)
      .reduce((sum, p) => sum + p.commission, 0)
    const totalPaid = partnersWithEarningsFiltered.reduce((sum, p) => sum + p.totalPaid, 0)
    const totalOrders = partnersWithEarningsFiltered.reduce((sum, p) => sum + p.ordersCount, 0)

    // Calcular comissões em dívida da semana anterior (para alerta)
    const { start: prevWeekStart, end: prevWeekEnd } = getDateRange("previousWeek")
    let unpaidPreviousWeek = 0
    
    if (prevWeekStart && prevWeekEnd) {
      for (const partner of partners || []) {
        // Total pago (encomendas) na semana anterior
        let prevQuery = supabaseAdmin
          .from("orders")
          .select("total, created_at, id")
          .eq("discount_code", partner.discount_code)
          .eq("payment_status", "paid")
          .gte("created_at", prevWeekStart.toISOString())
          .lte("created_at", prevWeekEnd.toISOString())

        const { data: prevOrders } = await prevQuery
        const prevTotalPaid = (prevOrders || []).reduce((sum, o: any) => sum + Number(o.total || 0), 0)
        const prevCommission = Number((prevTotalPaid * 0.10).toFixed(2))

        if (prevCommission > 0) {
          // Verificar se semana anterior já foi marcada como paga
          let prevPayment: any = null
          try {
            const { data } = await supabaseAdmin
              .from("partner_payments")
              .select("is_paid")
              .eq("partner_id", partner.id)
              .eq("period_start", prevWeekStart.toISOString().split('T')[0])
              .eq("period_end", prevWeekEnd.toISOString().split('T')[0])
              .maybeSingle()
            prevPayment = data
          } catch (_) {}

          if (!prevPayment?.is_paid) {
            unpaidPreviousWeek += prevCommission
          }
        }
      }
    }

    return NextResponse.json({
      filter,
      dateRange: {
        start: startDate?.toISOString(),
        end: endDate?.toISOString()
      },
      partners: partnersWithEarningsFiltered.sort((a, b) => b.commission - a.commission),
      summary: {
        totalPartners: partnersWithEarningsFiltered.length,
        totalCommission,
        totalPaid,
        totalOrders,
        unpaidPreviousWeek
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 })
  }
}
