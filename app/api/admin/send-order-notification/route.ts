import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import Mailgun from 'mailgun.js'
import FormData from 'form-data'

// Configurar Mailgun
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
    const { orderId, message } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "ID do pedido é obrigatório" },
        { status: 400 }
      )
    }
    
    // Buscar dados do pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    
    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Pedido não encontrado" },
        { status: 404 }
      )
    }
    
    if (!order.customer_email) {
      return NextResponse.json(
        { success: false, error: "Email do cliente não encontrado" },
        { status: 400 }
      )
    }
    
    const emailData = {
      from: MAILGUN_FROM_EMAIL,
      to: order.customer_email,
      subject: `Atualização do Pedido #${order.order_number} - fanzone12.pt`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">Atualização do Pedido #${order.order_number}</h2>
            <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 4px solid #2563eb;">
              <p>Olá ${order.customer_name},</p>
              <p>${message || 'Temos uma atualização sobre o seu pedido.'}</p>
              <p>Obrigado por escolher a fanzone12.pt!</p>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
              <p>Para dúvidas, contacte-nos através de <a href="mailto:geral@fanzone12.pt">geral@fanzone12.pt</a></p>
            </div>
          </div>
        </div>
      `,
      text: `
        Atualização do Pedido #${order.order_number}
        
        Olá ${order.customer_name},
        
        ${message || 'Temos uma atualização sobre o seu pedido.'}
        
        Obrigado por escolher a fanzone12.pt!
        
        Para dúvidas, contacte-nos através de geral@fanzone12.pt
      `
    }
    
    const mg = createMailgunClient()
    await mg.messages.create(MAILGUN_DOMAIN, emailData)
    
    return NextResponse.json({
      success: true,
      message: `Notificação enviada com sucesso para ${order.customer_email}`
    })
    
  } catch (error: any) {
    console.error("Erro ao enviar notificação de pedido:", error)
    
    if (error.message) {
      console.error("Erro Mailgun:", error.message)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Erro ao enviar notificação: ${error.message || 'Erro desconhecido'}` 
      },
      { status: 500 }
    )
  }
}