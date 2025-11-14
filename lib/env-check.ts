export function checkStripeEnv() {
  const missingVars = []

  if (!process.env.STRIPE_SECRET_KEY) {
    missingVars.push("STRIPE_SECRET_KEY")
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    missingVars.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    missingVars.push("NEXT_PUBLIC_SITE_URL")
  }

  if (missingVars.length > 0) {
    console.warn(`⚠️ Variáveis de ambiente ausentes: ${missingVars.join(", ")}`)
    return false
  }

  return true
}
