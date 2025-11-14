import { NextResponse } from "next/server"

export async function GET() {
  // Obter informações sobre o ambiente
  const environment = process.env.NODE_ENV || "unknown"
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "não definido"
  const hasStripeKey = !!process.env.STRIPE_SECRET_KEY
  const hasStripePublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  // Criar uma URL de teste para verificar se é válida
  let testUrl = ""
  let isValidUrl = false

  try {
    testUrl = `${siteUrl}/sucesso?session_id=test`
    new URL(testUrl) // Isso lançará um erro se a URL for inválida
    isValidUrl = true
  } catch (error) {
    isValidUrl = false
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment,
    siteUrl,
    hasStripeKey,
    hasStripePublishableKey,
    testUrl,
    isValidUrl,
    headers: {
      host: process.env.VERCEL_URL || "não disponível",
      url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "não disponível",
    },
  })
}
