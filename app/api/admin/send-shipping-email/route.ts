import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Mailgun from 'mailgun.js'
import FormData from 'form-data'
import { getTrackingUrl, getCarrierLabel } from "@/lib/shipping-carriers"

// Configurar Mailgun
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || ""
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || ""
const MAILGUN_FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || "sales@fanzone12.com"

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
    const { orderId, trackingNumber, carrier, estimatedDelivery } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      )
    }
    
    if (!trackingNumber) {
      return NextResponse.json(
        { success: false, error: "Tracking number is required" },
        { status: 400 }
      )
    }
    
    if (!carrier) {
      return NextResponse.json(
        { success: false, error: "Carrier is required" },
        { status: 400 }
      )
    }
    
    // Gerar link de tracking
    const trackingUrl = getTrackingUrl(carrier, trackingNumber)
    const carrierName = getCarrierLabel(carrier)
    
    // Buscar dados do pedido
    const { data: order, error: orderError } = await supabaseAdmin
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
    
    if (!order.email) {
      return NextResponse.json(
        { success: false, error: "Customer email not found" },
        { status: 400 }
      )
    }
    
    // Atualizar o tracking number e carrier na base de dados
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        tracking_number: trackingNumber,
        carrier: carrier,
        tracking_url: trackingUrl,
        status: 'shipped',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
    
    if (updateError) {
      console.error("Erro ao atualizar tracking number:", updateError)
      return NextResponse.json(
        { success: false, error: "Error updating tracking number" },
        { status: 500 }
      )
    }
    
    const emailData = {
      from: MAILGUN_FROM_EMAIL,
      to: order.email,
      subject: `Order #${order.order_number} Shipped - fanzone12.com`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">🚚 Order Shipped!</h2>
            <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 4px solid #10b981;">
              <p>Hello ${order.customer_name || 'Customer'},</p>
              <p>Great news! Your order #${order.order_number} has been shipped and is on its way!</p>
              
              ${trackingNumber && carrier ? `
                <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <h3 style="color: #0369a1; margin: 0 0 10px 0;">📦 Tracking Information</h3>
                  <p style="margin: 5px 0;"><strong>Carrier:</strong> ${carrierName}</p>
                  <p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
                  ${trackingUrl ? `
                    <p style="margin: 10px 0;">
                      <a href="${trackingUrl}" 
                         style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                        🔍 Track Order
                      </a>
                    </p>
                  ` : ''}
                </div>
              ` : ''}
              
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                  ⏰ Delivery Information
                </h3>
                <div style="color: #166534; font-size: 15px; line-height: 1.6;">
                  <p style="margin: 0 0 10px 0;"><strong>Total Time:</strong> 7 to 12 business days</p>
                  <p style="margin: 0 0 10px 0;"><strong>Process:</strong></p>
                  <ul style="margin: 5px 0; padding-left: 20px;">
                    <li>International shipping (5-9 business days)</li>
                    <li>Customs clearance (if applicable)</li>
                    <li>Final delivery (2-3 business days)</li>
                  </ul>
                  <p style="margin: 10px 0 0 0; font-style: italic; color: #6b7280;">
                    Note: The tracking code will be available once the order is processed by the carrier.
                  </p>
                </div>
              </div>
              
              <p>Thank you for choosing fanzone12.com!</p>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
              <p>For questions, contact us at <a href="mailto:sales@fanzone12.com">sales@fanzone12.com</a></p>
            </div>
          </div>
        </div>
      `,
      text: `
        Order Shipped!
        
        Hello ${order.customer_name || 'Customer'},
        
        Great news! Your order #${order.order_number} has been shipped and is on its way!
        
        ${trackingNumber && carrier ? `
        Tracking Information:
        Carrier: ${carrierName}
        Tracking Number: ${trackingNumber}
        Tracking Link: ${trackingUrl || 'N/A'}
        ` : ''}
        
        DELIVERY INFORMATION:
        Total Time: 7 to 12 business days
        
        Process:
        - International shipping (5-9 business days)
        - Customs clearance (if applicable)
        - Final delivery (2-3 business days)
        
        Note: The tracking code will be available once the order is processed by the carrier.
        
        Thank you for choosing fanzone12.com!
        
        For questions, contact us at sales@fanzone12.com
      `
    }
    
    const mg = createMailgunClient()
    await mg.messages.create(MAILGUN_DOMAIN, emailData)
    
    return NextResponse.json({
      success: true,
      message: `Shipping email sent successfully to ${order.email}`
    })
    
  } catch (error: any) {
    console.error("Erro ao enviar email de envio:", error)
    
    if (error.message) {
      console.error("Erro Mailgun:", error.message)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Error sending shipping email: ${error.message || 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
}