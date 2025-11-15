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
    const availableMethods: { id: string; name: string; icon: string }[] = []

    // Adicionar cartões (sempre disponíveis se a conta aceita pagamentos)
    // Verificar se a conta tem a capability de card payments
    if (account.capabilities?.card_payments === "active" || !account.capabilities) {
      availableMethods.push(
        { id: "visa", name: "Visa", icon: "/images/payment-visa.webp" },
        { id: "mastercard", name: "Mastercard", icon: "/images/payment-mastercard.webp" },
        { id: "amex", name: "American Express", icon: "/images/payment-amex.webp" },
      )
    }

    // Verificar todas as capabilities da conta
    if (account.capabilities) {
      // Iterar sobre todas as capabilities e verificar quais estão ativas
      Object.keys(account.capabilities).forEach((capability) => {
        const capabilityValue = account.capabilities?.[capability as keyof typeof account.capabilities]
        
        // Se a capability está ativa e temos um mapeamento para ela
        if (capabilityValue === "active" && paymentMethodMap[capability]) {
          const method = paymentMethodMap[capability]
          // Evitar duplicados
          if (!availableMethods.find(m => m.id === method.id)) {
            availableMethods.push(method)
          }
        }
      })
    }

    // Verificar métodos específicos por país
    if (account.country) {
      // MB Way é específico de Portugal
      if (account.country === "PT") {
        // Verificar se MB Way está disponível através de capabilities
        // MB Way pode estar disponível como uma capability específica ou através de settings
        const mbwayMethod = paymentMethodMap["mbway"]
        if (mbwayMethod && !availableMethods.find(m => m.id === mbwayMethod.id)) {
          // Adicionar MB Way se estiver em Portugal (pode ser verificado através de uma tentativa de criar sessão)
          // Por enquanto, adicionamos se o país for PT
          availableMethods.push(mbwayMethod)
        }
      }
    }

    // Verificar PayPal através de integração separada (não é uma capability)
    // PayPal geralmente aparece nas configurações ou pode ser verificado através de uma tentativa de criar uma sessão
    // Por enquanto, vamos assumir que se não há restrições específicas, PayPal pode estar disponível
    // Isso pode ser melhorado verificando as configurações específicas do PayPal

    // Ordenar métodos: cartões primeiro, depois outros métodos
    const sortedMethods = availableMethods.sort((a, b) => {
      const cardIds = ["visa", "mastercard", "amex", "card"]
      const aIsCard = cardIds.includes(a.id)
      const bIsCard = cardIds.includes(b.id)
      
      if (aIsCard && !bIsCard) return -1
      if (!aIsCard && bIsCard) return 1
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({ methods: sortedMethods })
  } catch (error: any) {
    console.error("Erro ao obter métodos de pagamento:", error)
    // Em caso de erro, retornar apenas cartões como métodos padrão
    return NextResponse.json({
      methods: [
        { id: "visa", name: "Visa", icon: "/images/payment-visa.webp" },
        { id: "mastercard", name: "Mastercard", icon: "/images/payment-mastercard.webp" },
      ],
    })
  }
}
