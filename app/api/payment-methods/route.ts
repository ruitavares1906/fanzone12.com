import { NextResponse } from "next/server"
import Stripe from "stripe"

// Inicializar o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover" as Stripe.LatestApiVersion,
})

export async function GET() {
  try {
    // Buscar as configurações da conta Stripe
    const account = await stripe.accounts.retrieve()

    // Estrutura para armazenar os métodos de pagamento disponíveis
    const availableMethods: { id: string; name: string; icon: string }[] = []

    // Adicionar cartões (sempre disponíveis)
    availableMethods.push(
      { id: "visa", name: "Visa", icon: "/images/payment-visa.webp" },
      { id: "mastercard", name: "Mastercard", icon: "/images/payment-mastercard.webp" },
    )

    // Verificar capacidades específicas da conta
    if (account.capabilities) {
      if (account.capabilities.sepa_debit === "active" || account.capabilities.transfers === "active") {
        availableMethods.push({ id: "transfer", name: "Transferência Bancária", icon: "/images/payment-transfer.webp" })
      }

      if (account.capabilities.multibanco === "active") {
        availableMethods.push({ id: "multibanco", name: "Multibanco", icon: "/images/payment-multibanco.webp" })
      }

      // Add payment methods available in EU/EEE + UK
      // MB Way is Portugal-specific, so we check for EU countries
      const euCountries = ['PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'AT', 'GR', 'IE', 'FI', 'DK', 'SE', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'EE', 'LV', 'LT', 'CY', 'MT', 'LU', 'IS', 'LI', 'NO', 'CH', 'GB']
      if (account.country && euCountries.includes(account.country)) {
        // Add region-specific payment methods if needed
        if (account.country === "PT") {
          availableMethods.push({ id: "mbway", name: "MB Way", icon: "/images/payment-mbway.webp" })
        }
      }

      // Adicionar PayPal se integrado
      if (account.settings?.payments?.statement_descriptor_kana) {
        availableMethods.push({ id: "paypal", name: "PayPal", icon: "/images/payment-paypal.webp" })
      }

      // Adicionar Klarna se disponível
      if (account.capabilities.klarna_payments === "active") {
        availableMethods.push({ id: "klarna", name: "Klarna", icon: "/images/payment-klarna.webp" })
      }
    }

    return NextResponse.json({ methods: availableMethods })
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
