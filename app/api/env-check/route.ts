import { NextResponse } from "next/server"
import { checkStripeEnv } from "@/lib/env-check"

export async function GET() {
  const stripeEnvOk = checkStripeEnv()

  return NextResponse.json({
    stripe: {
      configured: stripeEnvOk,
      secretKeyExists: !!process.env.STRIPE_SECRET_KEY,
      publishableKeyExists: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      siteUrlExists: !!process.env.NEXT_PUBLIC_SITE_URL,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "não configurado",
    },
  })
}
