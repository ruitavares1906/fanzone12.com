import { NextResponse } from "next/server"
import Mailgun from 'mailgun.js'
import FormData from 'form-data'

// Configurar o cliente Mailgun
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || ""
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || ""
const MAILGUN_FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || "geral@fanzone12.pt"

// Função para criar cliente Mailgun
function createMailgunClient() {
  const mailgun = new Mailgun(FormData)
  return mailgun.client({
    username: 'api',
    key: MAILGUN_API_KEY,
  })
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email é obrigatório" },
        { status: 400 }
      )
    }
    
    const emailData = {
      from: MAILGUN_FROM_EMAIL,
      to: email,
      subject: "Teste de Configuração do Mailgun",
      text: "Este é um email de teste para verificar se a configuração do Mailgun está funcionando corretamente.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Teste de Configuração do Mailgun</h2>
          <p>Este é um email de teste para verificar se a configuração do Mailgun está funcionando corretamente.</p>
          <p>Se você está recebendo este email, significa que a configuração está funcionando!</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Data do teste:</strong> ${new Date().toLocaleString("pt-PT")}</p>
            <p><strong>Email de destino:</strong> ${email}</p>
            <p><strong>Status:</strong> ✅ Funcionando</p>
          </div>
        </div>
      `
    }
    
    const mg = createMailgunClient()
    await mg.messages.create(MAILGUN_DOMAIN, emailData)
    
    return NextResponse.json({
      success: true,
      message: `Email de teste enviado com sucesso para ${email}`
    })
    
  } catch (error: any) {
    console.error("Erro ao enviar email de teste:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Erro ao enviar email de teste: ${error.message || 'Erro desconhecido'}` 
      },
      { status: 500 }
    )
  }
}