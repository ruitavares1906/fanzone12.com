// Função para obter a URL base do site
export function getSiteUrl(): string {
  // Verificar se a variável de ambiente está definida
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL

  // Se a URL não estiver definida ou for inválida, usar um fallback
  if (!envUrl || !envUrl.startsWith("http")) {
    console.warn("NEXT_PUBLIC_SITE_URL não está definido ou é inválido. Usando fallback.")

    // Em ambiente de desenvolvimento, usar localhost
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000"
    }

    // Em produção, usar um domínio padrão
    return "https://www.fanzone12.pt"
  }

  return envUrl
}

// Função para verificar se as variáveis de ambiente do Stripe estão configuradas
export function checkStripeConfig(): { isValid: boolean; missingVars: string[] } {
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

  return {
    isValid: missingVars.length === 0,
    missingVars,
  }
}
