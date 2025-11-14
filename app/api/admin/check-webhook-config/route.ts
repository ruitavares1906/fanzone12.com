import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar todas as variáveis necessárias para o webhook funcionar
    const requiredVars = {
      // SendGrid
      SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== "SUA_API_KEY_SENDGRID",
      
      // Supabase
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      
      // Stripe
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      
      // Site
      NEXT_PUBLIC_SITE_URL: !!process.env.NEXT_PUBLIC_SITE_URL
    }

    const missingVars = Object.entries(requiredVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key)

    const allConfigured = missingVars.length === 0

    // Verificar especificamente a service role key (problema mais comum)
    const serviceRoleStatus = {
      exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      startsWithEyJ: process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('eyJ') || false
    }

    return NextResponse.json({
      allConfigured,
      variables: requiredVars,
      missingVars,
      serviceRoleStatus,
      details: {
        sendgridConfigured: requiredVars.SENDGRID_API_KEY,
        supabaseConfigured: requiredVars.NEXT_PUBLIC_SUPABASE_URL && requiredVars.SUPABASE_SERVICE_ROLE_KEY,
        stripeConfigured: requiredVars.STRIPE_SECRET_KEY && requiredVars.STRIPE_WEBHOOK_SECRET,
        environment: process.env.NODE_ENV
      },
      recommendations: missingVars.length > 0 ? [
        "Adicione as variáveis em falta ao arquivo .env.local",
        "A SUPABASE_SERVICE_ROLE_KEY é crítica para o webhook funcionar",
        "Reinicie o servidor após adicionar as variáveis"
      ] : [
        "Todas as variáveis estão configuradas!",
        "Teste uma encomenda para verificar se tudo funciona"
      ]
    })
  } catch (error: any) {
    console.error("Erro ao verificar configuração do webhook:", error)
    return NextResponse.json(
      { 
        allConfigured: false,
        error: error.message,
        message: "Erro ao verificar configuração"
      }, 
      { status: 500 }
    )
  }
} 