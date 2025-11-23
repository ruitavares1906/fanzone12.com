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
    const { to, subject, message } = await request.json()
    
    if (!to || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }
    
    if (!MAILGUN_API_KEY || MAILGUN_API_KEY === "your_mailgun_api_key_here") {
      return NextResponse.json(
        { success: false, error: "Mailgun API Key not configured" },
        { status: 500 }
      )
    }
    
    const emailData = {
      from: MAILGUN_FROM_EMAIL,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">Message from fanzone12.com</h2>
            <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 4px solid #2563eb;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
              <p>This message was sent from the fanzone12.com admin panel</p>
              <p>To reply, please use: <a href="mailto:sales@fanzone12.com">sales@fanzone12.com</a></p>
            </div>
          </div>
        </div>
      `,
      text: message
    }
    
    const mg = createMailgunClient()
    await mg.messages.create(MAILGUN_DOMAIN, emailData)
    
    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${to}`
    })
    
  } catch (error: any) {
    console.error("Error sending custom email:", error)
    
    if (error.message) {
      console.error("Mailgun Error:", error.message)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Error sending email: ${error.message || 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
}
