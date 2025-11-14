import { NextResponse } from "next/server"
import Stripe from "stripe"

// Inicializar o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover" as Stripe.LatestApiVersion,
})

export async function POST(request: Request) {
  try {
    const { customerEmail, orderNumber, customerName, shippingAddress } = await request.json()

    console.log("=== CRIANDO PAGAMENTO ANTECIPADO DE 8€ ===")
    console.log("Email:", customerEmail)
    console.log("Pedido:", orderNumber)
    console.log("Morada:", shippingAddress)

    // Criar sessão de checkout para pagamento antecipado de 8€
    const session = await stripe.checkout.sessions.create({
      // Deixar o Stripe escolher automaticamente os métodos ativos na conta
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Pagamento Antecipado - Pedido ${orderNumber}`,
              description: 'Taxa antecipada para produtos personalizados (pagamento à cobrança)',
            },
            unit_amount: 800, // 8€ em centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['PT', 'ES', 'FR', 'IT', 'DE', 'NL', 'BE', 'LU', 'AT', 'CH'],
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fanzone12.pt'}/sucesso?payment=upfront&order=${orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fanzone12.pt'}/carrinho`,
      metadata: {
        orderNumber,
        paymentType: 'upfront',
        customerName,
        amount: '8.00'
      },
    })

    console.log("✅ Sessão de pagamento antecipado criada:", session.id)

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id
    })

  } catch (error: any) {
    console.error("Erro ao criar pagamento antecipado:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
