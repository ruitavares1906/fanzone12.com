import { NextResponse } from "next/server"
import { checkStripeConfig, getSiteUrl } from "@/lib/env-config"

export async function GET() {
  const stripeConfig = checkStripeConfig()
  const siteUrl = getSiteUrl()

  return NextResponse.json({
    stripeConfig,
    siteUrl,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}
