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
    const { nome, email, assunto, mensagem, telefone } = await request.json()
    
    if (!nome || !email || !assunto || !mensagem) {
      return NextResponse.json(
        { success: false, error: "Todos os campos são obrigatórios" },
        { status: 400 }
      )
    }
    
    // Email para a loja
    const emailToStore = {
      from: MAILGUN_FROM_EMAIL,
      to: "geral@fanzone12.pt",
      subject: `Nova mensagem de contato: ${assunto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nova mensagem de contato</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${telefone || 'Não fornecido'}</p>
            <p><strong>Assunto:</strong> ${assunto}</p>
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p><strong>Mensagem:</strong></p>
              <p>${mensagem.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        </div>
      `,
      text: `
        Nova mensagem de contato
        
        Nome: ${nome}
        Email: ${email}
        Telefone: ${telefone || 'Não fornecido'}
        Assunto: ${assunto}
        
        Mensagem:
        ${mensagem}
      `
    }
    
    // Email de confirmação para o cliente
    const emailToCustomer = {
      from: MAILGUN_FROM_EMAIL,
      to: email,
      subject: "Confirmação de receção - fanzone12.pt",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Mensagem recebida!</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p>Olá ${nome},</p>
            <p>Recebemos a sua mensagem e entraremos em contacto consigo em breve.</p>
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p><strong>Assunto:</strong> ${assunto}</p>
              <p><strong>Sua mensagem:</strong></p>
              <p>${mensagem.replace(/\n/g, '<br>')}</p>
            </div>
            <p>Obrigado por contactar a fanzone12.pt!</p>
          </div>
        </div>
      `,
      text: `
        Mensagem recebida!
        
        Olá ${nome},
        
        Recebemos a sua mensagem e entraremos em contacto consigo em breve.
        
        Assunto: ${assunto}
        Sua mensagem: ${mensagem}
        
        Obrigado por contactar a fanzone12.pt!
      `
    }
    
    // Enviar ambos os emails
    const mg = createMailgunClient()
    await Promise.all([
      mg.messages.create(MAILGUN_DOMAIN, emailToStore),
      mg.messages.create(MAILGUN_DOMAIN, emailToCustomer)
    ])
    
    return NextResponse.json({
      success: true,
      message: "Mensagem enviada com sucesso!"
    })
    
  } catch (error: any) {
    console.error("Erro ao enviar mensagem de contato:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Erro ao enviar mensagem. Tente novamente mais tarde." 
      },
      { status: 500 }
    )
  }
}