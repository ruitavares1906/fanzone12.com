import { NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

// Inicializar o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover" as Stripe.LatestApiVersion,
})

export async function POST(request: Request) {
  try {
    const { eventType } = await request.json()

    if (!eventType) {
      return NextResponse.json({ error: "Tipo de evento não especificado" }, { status: 400 })
    }

    // Obter uma encomenda existente para teste
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, email, total")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (orderError || !order) {
      // Se não houver encomenda, criar uma de teste
      const { data: newOrder, error: newOrderError } = await supabase
        .from("orders")
        .insert({
          order_number: `TEST-${Date.now()}`,
          email: "teste@example.com",
          status: "processing",
          payment_status: "pending",
          total: 99.99,
          items: JSON.stringify([
            {
              id: "test-item-1",
              name: "Camisola de Teste",
              price: 89.99,
              quantity: 1,
              size: "M",
            },
          ]),
        })
        .select()
        .single()

      if (newOrderError) {
        return NextResponse.json(
          { error: "Não foi possível criar uma encomenda de teste: " + newOrderError.message },
          { status: 500 },
        )
      }

      const order = newOrder
    }

    // Simular diferentes tipos de eventos
    switch (eventType) {
      case "payment_intent.succeeded":
        await simulatePaymentIntentSucceeded(order)
        break
      case "payment_intent.payment_failed":
        await simulatePaymentIntentFailed(order)
        break
      case "checkout.session.completed":
        await simulateCheckoutSessionCompleted(order)
        break
      default:
        return NextResponse.json({ error: "Tipo de evento não suportado" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Evento ${eventType} simulado com sucesso para a encomenda ${order?.id || 'N/A'}`,
    })
  } catch (error: any) {
    console.error("Erro ao simular evento:", error)
    return NextResponse.json({ error: `Erro ao simular evento: ${error.message}` }, { status: 500 })
  }
}

// Simular evento de pagamento bem-sucedido
async function simulatePaymentIntentSucceeded(order: any) {
  // Atualizar o status de pagamento da encomenda
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id)

  if (error) {
    throw new Error(`Erro ao atualizar status de pagamento: ${error.message}`)
  }

  console.log(`[SIMULAÇÃO] PaymentIntent bem-sucedido para a encomenda ${order.id}`)
  console.log(`[SIMULAÇÃO] Status de pagamento atualizado para 'paid'`)

  return true
}

// Simular evento de falha de pagamento
async function simulatePaymentIntentFailed(order: any) {
  // Atualizar o status de pagamento da encomenda
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: "failed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id)

  if (error) {
    throw new Error(`Erro ao atualizar status de pagamento: ${error.message}`)
  }

  console.log(`[SIMULAÇÃO] PaymentIntent falhou para a encomenda ${order.id}`)
  console.log(`[SIMULAÇÃO] Status de pagamento atualizado para 'failed'`)

  return true
}

// Simular evento de checkout completo
async function simulateCheckoutSessionCompleted(order: any) {
  // Atualizar o status da encomenda
  const { error } = await supabase
    .from("orders")
    .update({
      status: "processing",
      payment_status: "paid",
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id)

  if (error) {
    throw new Error(`Erro ao atualizar status da encomenda: ${error.message}`)
  }

  console.log(`[SIMULAÇÃO] Checkout completo para a encomenda ${order.id}`)
  console.log(`[SIMULAÇÃO] Status atualizado para 'processing' e pagamento para 'paid'`)

  return true
}
