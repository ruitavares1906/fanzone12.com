import { NextResponse } from "next/server"
import Mailgun from 'mailgun.js'
import FormData from 'form-data'

export async function GET() {
  try {
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN
    const MAILGUN_FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL

    console.log("=== TESTE DE CONFIGURAÇÃO MAILGUN ===")
    console.log("API Key configurada:", !!(MAILGUN_API_KEY && MAILGUN_API_KEY !== "your_mailgun_api_key_here"))
    console.log("Domain configurado:", !!(MAILGUN_DOMAIN && MAILGUN_DOMAIN !== "your_mailgun_domain_here"))
    console.log("From Email configurado:", !!(MAILGUN_FROM_EMAIL && MAILGUN_FROM_EMAIL !== "your_mailgun_from_email_here"))
    console.log("API Key length:", MAILGUN_API_KEY?.length || 0)
    console.log("Domain:", MAILGUN_DOMAIN)
    console.log("From Email:", MAILGUN_FROM_EMAIL)

    if (!MAILGUN_API_KEY || MAILGUN_API_KEY === "your_mailgun_api_key_here") {
      return NextResponse.json({
        success: false,
        error: "MAILGUN_API_KEY não está configurada",
        details: {
          apiKeyConfigured: false,
          domainConfigured: !!(MAILGUN_DOMAIN && MAILGUN_DOMAIN !== "your_mailgun_domain_here"),
          fromEmailConfigured: !!(MAILGUN_FROM_EMAIL && MAILGUN_FROM_EMAIL !== "your_mailgun_from_email_here")
        }
      })
    }

    if (!MAILGUN_DOMAIN || MAILGUN_DOMAIN === "your_mailgun_domain_here") {
      return NextResponse.json({
        success: false,
        error: "MAILGUN_DOMAIN não está configurado",
        details: {
          apiKeyConfigured: true,
          domainConfigured: false,
          fromEmailConfigured: !!(MAILGUN_FROM_EMAIL && MAILGUN_FROM_EMAIL !== "your_mailgun_from_email_here")
        }
      })
    }

    // Testar conexão com Mailgun
    const mailgun = new Mailgun(FormData)
    const mg = mailgun.client({
      username: 'api',
      key: MAILGUN_API_KEY,
    })

    try {
      // Testar envio de email
      const testEmail = {
        from: MAILGUN_FROM_EMAIL || "sales@fanzone12.com",
        to: "test@example.com",
        subject: "Teste de Configuração Mailgun",
        text: "Este é um teste de configuração do Mailgun"
      }

      console.log("Testando envio de email...")
      const result = await mg.messages.create(MAILGUN_DOMAIN, testEmail)
      console.log("Resultado do teste:", result)

      return NextResponse.json({
        success: true,
        message: "Configuração do Mailgun está funcionando!",
        details: {
          apiKeyConfigured: true,
          domainConfigured: true,
          fromEmailConfigured: !!(MAILGUN_FROM_EMAIL && MAILGUN_FROM_EMAIL !== "your_mailgun_from_email_here"),
          testResult: result
        }
      })

    } catch (testError: any) {
      console.error("Erro no teste de envio:", testError)
      return NextResponse.json({
        success: false,
        error: `Erro no teste de envio: ${testError.message}`,
        details: {
          apiKeyConfigured: true,
          domainConfigured: true,
          fromEmailConfigured: !!(MAILGUN_FROM_EMAIL && MAILGUN_FROM_EMAIL !== "your_mailgun_from_email_here"),
          testError: testError.message
        }
      })
    }

  } catch (error: any) {
    console.error("Erro geral:", error)
    return NextResponse.json({
      success: false,
      error: `Erro geral: ${error.message}`,
      details: {
        apiKeyConfigured: false,
        domainConfigured: false,
        fromEmailConfigured: false
      }
    })
  }
}
