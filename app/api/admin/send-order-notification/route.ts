import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import Mailgun from 'mailgun.js'
import FormData from 'form-data'

// Configurar Mailgun
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
    const { orderId, message } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
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
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }
    
    if (!order.customer_email) {
      return NextResponse.json(
        { success: false, error: "Customer email not found" },
        { status: 400 }
      )
    }
    
    const emailData = {
      from: MAILGUN_FROM_EMAIL,
      to: order.customer_email,
      subject: `Order Update #${order.order_number} - fanzone12.com`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">Order Update #${order.order_number}</h2>
            <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 4px solid #2563eb;">
              <p>Hello ${order.customer_name},</p>
              <p>${message || 'We have an update regarding your order.'}</p>
              <p>Thank you for choosing fanzone12.com!</p>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
              <p>For any questions, please contact us at <a href="mailto:sales@fanzone12.com">sales@fanzone12.com</a></p>
            </div>
          </div>
        </div>
      `,
      text: `
        Order Update #${order.order_number}
        
        Hello ${order.customer_name},
        
        ${message || 'We have an update regarding your order.'}
        
        Thank you for choosing fanzone12.com!
        
        For any questions, please contact us at sales@fanzone12.com
      `
    }
    
    const mg = createMailgunClient()
    await mg.messages.create(MAILGUN_DOMAIN, emailData)
    
    return NextResponse.json({
      success: true,
      message: `Notification sent successfully to ${order.customer_email}`
    })
    
  } catch (error: any) {
    console.error("Error sending order notification:", error)
    
    if (error.message) {
      console.error("Mailgun Error:", error.message)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Error sending notification: ${error.message || 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
}
