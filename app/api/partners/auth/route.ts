import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"

// POST - Login do parceiro
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    // Autenticar com Supabase Auth
    console.log('Tentando login para email:', email)
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      console.error('Erro de autenticação:', authError)
      console.error('AuthData:', authData)
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      )
    }

    console.log('Autenticação bem-sucedida para user:', authData.user.id)

    // Verificar se o usuário é um parceiro
    console.log('Verificando se user é parceiro:', authData.user.id)
    
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from("partners")
      .select("id, name, discount_code, email, is_active")
      .eq("user_id", authData.user.id)
      .single()

    if (partnerError || !partner) {
      console.error('Erro ao buscar parceiro:', partnerError)
      console.error('Partner data:', partner)
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: "Usuário não é um parceiro válido" },
        { status: 403 }
      )
    }

    console.log('Parceiro encontrado:', partner.name)

    if (!partner.is_active) {
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: "Conta de parceiro desativada" },
        { status: 403 }
      )
    }

    // Atualizar último login
    await supabaseAdmin
      .from("partners")
      .update({ last_login: new Date().toISOString() })
      .eq("id", partner.id)

    // Calcular estatísticas para retornar no login
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString()

    // Estatísticas mensais
    const { data: monthlyOrders } = await supabaseAdmin
      .from("orders")
      .select("total")
      .eq("discount_code", partner.discount_code)
      .eq("payment_status", "paid")
      .gte("created_at", startOfMonth)
      .lte("created_at", endOfMonth)

    const monthlyTotal = (monthlyOrders || []).reduce((sum, order) => sum + Number(order.total || 0), 0)
    const monthlyCommission = Number((monthlyTotal * 0.10).toFixed(2))

    // Estatísticas semanais
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() + 1)
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const { data: weeklyOrders } = await supabaseAdmin
      .from("orders")
      .select("total")
      .eq("discount_code", partner.discount_code)
      .eq("payment_status", "paid")
      .gte("created_at", startOfWeek.toISOString())
      .lte("created_at", endOfWeek.toISOString())

    const weeklyTotal = (weeklyOrders || []).reduce((sum, order) => sum + Number(order.total || 0), 0)
    const weeklyCommission = Number((weeklyTotal * 0.10).toFixed(2))

    // Estatísticas totais
    const { data: totalOrders } = await supabaseAdmin
      .from("orders")
      .select("total")
      .eq("discount_code", partner.discount_code)
      .eq("payment_status", "paid")

    const totalTotal = (totalOrders || []).reduce((sum, order) => sum + Number(order.total || 0), 0)
    const totalCommission = Number((totalTotal * 0.10).toFixed(2))

    // Calcular ranking mensal
    const { data: allMonthlyOrders } = await supabaseAdmin
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

    return NextResponse.json({
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
      },
      user: authData.user,
      session: authData.session,
    })
  } catch (error: any) {
    console.error("Erro no login do parceiro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Logout do parceiro
export async function DELETE() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return NextResponse.json(
        { error: "Erro ao fazer logout" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Erro no logout do parceiro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

