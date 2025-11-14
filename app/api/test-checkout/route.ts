import { NextResponse } from "next/server"
import Stripe from "stripe"

// Verificar se temos a chave do Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY não está configurada!")
}

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  console.error("NEXT_PUBLIC_SITE_URL não está configurada!")
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover" as Stripe.LatestApiVersion,
})

export async function POST(request: Request) {
  try {
    console.log("=== INICIANDO CHECKOUT DE TESTE ===")
    console.log("STRIPE_SECRET_KEY configurada:", !!process.env.STRIPE_SECRET_KEY)
    console.log("NEXT_PUBLIC_SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL)

    const body = await request.json()
    const { email } = body

    console.log("Dados recebidos:", { email })

    if (!email) {
      console.log("Email não fornecido")
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      throw new Error("NEXT_PUBLIC_SITE_URL não está configurada")
    }

    console.log("Criando sessão de teste para:", email)

    const sessionData = {
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Produto de Teste",
              description: "Produto para teste de integração - 50 cêntimos",
            },
            unit_amount: 50,
          },
          quantity: 1,
        },
      ],
      mode: "payment" as const,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/carrinho`,
      customer_email: email,
      locale: "pt" as const,
      billing_address_collection: "required" as const,
      phone_number_collection: {
        enabled: true,
      },
    }

    console.log("Dados da sessão:", JSON.stringify(sessionData, null, 2))

    const session = await stripe.checkout.sessions.create(sessionData)

    console.log("Sessão criada com sucesso:", {
      id: session.id,
      url: session.url,
      customer_email: session.customer_email,
    })

    if (!session.url) {
      throw new Error("URL da sessão não foi gerada")
    }

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("=== ERRO NO CHECKOUT DE TESTE ===")
    console.error("Tipo do erro:", error.constructor.name)
    console.error("Mensagem:", error.message)
    console.error("Stack:", error.stack)
    
    if (error.type === 'StripeError') {
      console.error("Detalhes do erro Stripe:", {
        type: error.type,
        code: error.code,
        param: error.param,
        detail: error.detail,
      })
    }

    return NextResponse.json(
      { 
        error: "Erro ao criar sessão de teste",
        details: error.message,
        type: error.type,
      },
      { status: 500 }
    )
  }
} 