import { NextResponse } from "next/server"
import Mailgun from 'mailgun.js'
import FormData from 'form-data'

// Configurar o cliente Mailgun
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || ""
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || ""
const MAILGUN_FROM_EMAIL = "sales@fanzone12.com"

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
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }
    
    // Email para a loja
    const emailToStore = {
      from: MAILGUN_FROM_EMAIL,
      to: "sales@fanzone12.com",
      subject: `New contact message: ${assunto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Message</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${telefone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${assunto}</p>
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p><strong>Message:</strong></p>
              <p>${mensagem.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        </div>
      `,
      text: `
        New contact message
        
        Name: ${nome}
        Email: ${email}
        Phone: ${telefone || 'Not provided'}
        Subject: ${assunto}
        
        Message:
        ${mensagem}
      `
    }
    
    // Email de confirmação para o cliente
    const emailToCustomer = {
      from: MAILGUN_FROM_EMAIL,
      to: email,
      subject: "Message Received - fanzone12.com",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Message Received!</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p>Hello ${nome},</p>
            <p>We have received your message and will contact you soon.</p>
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p><strong>Subject:</strong> ${assunto}</p>
              <p><strong>Your message:</strong></p>
              <p>${mensagem.replace(/\n/g, '<br>')}</p>
            </div>
            <p>Thank you for contacting fanzone12.com!</p>
          </div>
        </div>
      `,
      text: `
        Message Received!
        
        Hello ${nome},
        
        We have received your message and will contact you soon.
        
        Subject: ${assunto}
        Your message: ${mensagem}
        
        Thank you for contacting fanzone12.com!
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
      message: "Message sent successfully!"
    })
    
  } catch (error: any) {
    console.error("Error sending contact message:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Error sending message. Please try again later." 
      },
      { status: 500 }
    )
  }
}