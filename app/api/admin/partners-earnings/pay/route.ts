import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const { partnerId, periodStart, periodEnd, paymentReference } = await request.json()

    if (!partnerId || !periodStart || !periodEnd) {
      return NextResponse.json({ error: "Dados obrigatórios em falta" }, { status: 400 })
    }

    // Verificar se já existe um registro de pagamento
    const { data: existingPayment } = await supabaseAdmin
      .from("partner_payments")
      .select("*")
      .eq("partner_id", partnerId)
      .eq("period_start", periodStart)
      .eq("period_end", periodEnd)
      .single()

    if (existingPayment) {
      // Atualizar registro existente
      const { data, error } = await supabaseAdmin
        .from("partner_payments")
        .update({
          is_paid: true,
          paid_at: new Date().toISOString(),
          payment_reference: paymentReference || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingPayment.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, payment: data })
    } else {
      // Criar novo registro
      const { data, error } = await supabaseAdmin
        .from("partner_payments")
        .insert({
          partner_id: partnerId,
          period_start: periodStart,
          period_end: periodEnd,
          is_paid: true,
          paid_at: new Date().toISOString(),
          payment_reference: paymentReference || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, payment: data })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { partnerId, periodStart, periodEnd } = await request.json()

    if (!partnerId || !periodStart || !periodEnd) {
      return NextResponse.json({ error: "Dados obrigatórios em falta" }, { status: 400 })
    }

    // Marcar como não pago
    const { data, error } = await supabaseAdmin
      .from("partner_payments")
      .update({
        is_paid: false,
        paid_at: null,
        payment_reference: null,
        updated_at: new Date().toISOString()
      })
      .eq("partner_id", partnerId)
      .eq("period_start", periodStart)
      .eq("period_end", periodEnd)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, payment: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 })
  }
}
