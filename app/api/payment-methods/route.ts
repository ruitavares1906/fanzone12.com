import { NextResponse } from "next/server"
import Stripe from "stripe"

// Inicializar o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover" as Stripe.LatestApiVersion,
})

// Mapeamento de capabilities do Stripe para métodos de pagamento
const paymentMethodMap: Record<string, { id: string; name: string; icon: string }> = {
  // Cartões (sempre disponíveis se a conta aceita pagamentos)
  card: { id: "card", name: "Credit/Debit Cards", icon: "/images/payment-visa.webp" },
  
  // Métodos regionais europeus
  bancontact_payments: { id: "bancontact", name: "Bancontact", icon: "/images/payment-bancontact.webp" },
  ideal_payments: { id: "ideal", name: "iDEAL", icon: "/images/payment-ideal.webp" },
  sofort_payments: { id: "sofort", name: "Sofort", icon: "/images/payment-sofort.webp" },
  sepa_debit_payments: { id: "sepa_debit", name: "SEPA Direct Debit", icon: "/images/payment-sepa.webp" },
  eps_payments: { id: "eps", name: "EPS", icon: "/images/payment-eps.webp" },
  giropay_payments: { id: "giropay", name: "Giropay", icon: "/images/payment-giropay.webp" },
  p24_payments: { id: "p24", name: "Przelewy24", icon: "/images/payment-p24.webp" },
  
  // Métodos específicos de Portugal
  multibanco: { id: "multibanco", name: "Multibanco", icon: "/images/payment-multibanco.webp" },
  
  // Métodos de compra agora, pague depois
  klarna_payments: { id: "klarna", name: "Klarna", icon: "/images/payment-klarna.webp" },
  afterpay_clearpay_payments: { id: "afterpay", name: "Afterpay", icon: "/images/payment-afterpay.webp" },
  
  // Outros métodos
  paypal: { id: "paypal", name: "PayPal", icon: "/images/payment-paypal.webp" },
  apple_pay: { id: "apple_pay", name: "Apple Pay", icon: "/images/payment-applepay.webp" },
  google_pay: { id: "google_pay", name: "Google Pay", icon: "/images/payment-googlepay.webp" },
  link: { id: "link", name: "Link", icon: "/images/payment-link.webp" },
  
  // Métodos específicos de países
  mbway: { id: "mbway", name: "MB Way", icon: "/images/payment-mbway.webp" },
  blik: { id: "blik", name: "BLIK", icon: "/images/payment-blik.webp" },
  alipay: { id: "alipay", name: "Alipay", icon: "/images/payment-alipay.webp" },
  wechat_pay: { id: "wechat", name: "WeChat Pay", icon: "/images/payment-wechat.webp" },
}

export async function GET() {
  try {
    // Buscar as configurações da conta Stripe
    const account = await stripe.accounts.retrieve()

    // Estrutura para armazenar os métodos de pagamento disponíveis
    // Apenas retornar cartões, PayPal e Klarna
    const availableMethods: { id: string; name: string; icon: string }[] = []

    // Adicionar cartões (sempre disponíveis se a conta aceita pagamentos)
    // Verificar se a conta tem a capability de card payments
    if (account.capabilities?.card_payments === "active" || !account.capabilities) {
      availableMethods.push(
        { id: "visa", name: "Visa", icon: "/images/payment-visa.png" },
        { id: "mastercard", name: "Mastercard", icon: "/images/payment-mastercard.webp" },
      )
    }

    // Verificar Klarna se disponível
    if (account.capabilities?.klarna_payments === "active") {
      availableMethods.push({ id: "klarna", name: "Klarna", icon: "/images/payment-klarna.webp" })
    }

    // Adicionar PayPal (assumir que está disponível)
    availableMethods.push({ id: "paypal", name: "PayPal", icon: "/images/paypal-logo-small-min-1.png" })

    // Ordenar métodos: cartões primeiro, depois PayPal, depois Klarna
    const sortedMethods = availableMethods.sort((a, b) => {
      const order = ["visa", "mastercard", "paypal", "klarna"]
      const aIndex = order.indexOf(a.id)
      const bIndex = order.indexOf(b.id)
      
      if (aIndex === -1 && bIndex === -1) return 0
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })

    return NextResponse.json({ methods: sortedMethods })
  } catch (error: any) {
    console.error("Erro ao obter métodos de pagamento:", error)
    // Em caso de erro, retornar apenas cartões, PayPal e Klarna como métodos padrão
    return NextResponse.json({
      methods: [
        { id: "visa", name: "Visa", icon: "/images/payment-visa.png" },
        { id: "mastercard", name: "Mastercard", icon: "/images/payment-mastercard.webp" },
        { id: "paypal", name: "PayPal", icon: "/images/paypal-logo-small-min-1.png" },
        { id: "klarna", name: "Klarna", icon: "/images/payment-klarna.webp" },
      ],
    })
  }
}
