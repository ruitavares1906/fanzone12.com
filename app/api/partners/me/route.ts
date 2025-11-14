import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"

// GET - Obter dados do parceiro autenticado
export async function GET() {
  try {
    console.log('API /api/partners/me chamada')
    
    // Verificar se o usuário está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    console.log('Session error:', sessionError)
    console.log('Session exists:', !!session)
    console.log('User ID:', session?.user?.id)

    if (sessionError || !session) {
      console.log('Retornando 401 - não autenticado')
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    // Obter dados do parceiro
    console.log('Buscando parceiro com user_id:', session.user.id)
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from("partners")
      .select("id, name, discount_code, email")
      .eq("user_id", session.user.id)
      .single()

    console.log('Partner error:', partnerError)
    console.log('Partner found:', !!partner)
    console.log('Partner data:', partner)

    if (partnerError || !partner) {
      console.log('Retornando 404 - parceiro não encontrado')
      return NextResponse.json(
        { error: "Parceiro não encontrado ou não autorizado" },
        { status: 404 }
      )
    }

    // Calcular estatísticas mensais
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString()

    const { data: monthlyOrders, error: monthlyError } = await supabaseAdmin
      .from("orders")
      .select("total")
      .eq("discount_code", partner.discount_code)
      .eq("payment_status", "paid")
      .gte("created_at", startOfMonth)
      .lte("created_at", endOfMonth)

    const monthlyTotal = (monthlyOrders || []).reduce((sum, order) => sum + Number(order.total || 0), 0)
    const monthlyCommission = Number((monthlyTotal * 0.10).toFixed(2))

    // Calcular estatísticas semanais
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() + 1) // Segunda-feira
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const { data: weeklyOrders, error: weeklyError } = await supabaseAdmin
      .from("orders")
      .select("total")
      .eq("discount_code", partner.discount_code)
      .eq("payment_status", "paid")
      .gte("created_at", startOfWeek.toISOString())
      .lte("created_at", endOfWeek.toISOString())

    const weeklyTotal = (weeklyOrders || []).reduce((sum, order) => sum + Number(order.total || 0), 0)
    const weeklyCommission = Number((weeklyTotal * 0.10).toFixed(2))

    // Calcular estatísticas totais
    const { data: totalOrders, error: totalError } = await supabaseAdmin
      .from("orders")
      .select("total")
      .eq("discount_code", partner.discount_code)
      .eq("payment_status", "paid")

    const totalTotal = (totalOrders || []).reduce((sum, order) => sum + Number(order.total || 0), 0)
    const totalCommission = Number((totalTotal * 0.10).toFixed(2))

    // Calcular ranking mensal
    const { data: allMonthlyOrders, error: rankingError } = await supabaseAdmin
      .from("orders")
      .select("discount_code, total")
      .eq("payment_status", "paid")
      .gte("created_at", startOfMonth)
      .lte("created_at", endOfMonth)

    const monthlyTotals = new Map<string, number>()
    for (const order of allMonthlyOrders || []) {
      if (order.discount_code) {
        const current = monthlyTotals.get(order.discount_code) || 0
        monthlyTotals.set(order.discount_code, current + Number(order.total || 0))
      }
    }

    const sortedTotals = Array.from(monthlyTotals.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([code], index) => ({ code, rank: index + 1 }))

    const monthlyRank = sortedTotals.find(item => item.code === partner.discount_code)?.rank || null

    const responseData = {
      success: true,
      partner: {
        id: partner.id,
        name: partner.name,
        discount_code: partner.discount_code,
        email: partner.email,
        stats: {
          monthly: {
            total: monthlyTotal,
            commission: monthlyCommission,
            rank: monthlyRank
          },
          weekly: {
            total: weeklyTotal,
            commission: weeklyCommission
          },
          total: {
            total: totalTotal,
            commission: totalCommission
          }
        }
      }
    }

    console.log('Retornando dados do parceiro:', JSON.stringify(responseData, null, 2))
    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("Erro ao obter dados do parceiro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

