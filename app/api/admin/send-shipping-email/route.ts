import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
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
    const { orderId, trackingNumber, estimatedDelivery } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "ID do pedido é obrigatório" },
        { status: 400 }
      )
    }
    
    if (!trackingNumber) {
      return NextResponse.json(
        { success: false, error: "Número de rastreio é obrigatório" },
        { status: 400 }
      )
    }
    
    // Buscar dados do pedido
    const { data: order, error: orderError } = await supabaseAdmin
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
    
    if (!order.email) {
      return NextResponse.json(
        { success: false, error: "Email do cliente não encontrado" },
        { status: 400 }
      )
    }
    
    // Atualizar o tracking number na base de dados
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        tracking_number: trackingNumber,
        status: 'shipped',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
    
    if (updateError) {
      console.error("Erro ao atualizar tracking number:", updateError)
      return NextResponse.json(
        { success: false, error: "Erro ao atualizar número de rastreio" },
        { status: 500 }
      )
    }
    
    const emailData = {
      from: MAILGUN_FROM_EMAIL,
      to: order.email,
      subject: `Pedido #${order.order_number} Enviado - fanzone12.pt`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">🚚 Pedido Enviado!</h2>
            <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 4px solid #10b981;">
              <p>Olá ${order.customer_name || 'Cliente'},</p>
              <p>Ótimas notícias! O seu pedido #${order.order_number} foi enviado e está a caminho!</p>
              
              ${trackingNumber ? `
                <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <h3 style="color: #0369a1; margin: 0 0 10px 0;">📦 Informações de Rastreamento</h3>
                  <p style="margin: 5px 0;"><strong>Código de Rastreamento:</strong> ${trackingNumber}</p>
                  <p style="margin: 5px 0;"><strong>Transportadora:</strong> CTT Expresso</p>
                  <p style="margin: 10px 0;">
                    <a href="https://appserver.ctt.pt/CustomerArea/PublicArea_Detail?ObjectCodeInput=${trackingNumber}&SearchInput=${trackingNumber}" 
                       style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                      🔍 Rastrear Encomenda
                    </a>
                  </p>
                </div>
              ` : ''}
              
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                  ⏰ Informações de Entrega
                </h3>
                <div style="color: #166534; font-size: 15px; line-height: 1.6;">
                  <p style="margin: 0 0 10px 0;"><strong>Prazo Total:</strong> 7 a 12 dias úteis</p>
                  <p style="margin: 0 0 10px 0;"><strong>Processo:</strong></p>
                  <ul style="margin: 5px 0; padding-left: 20px;">
                    <li>Envio internacional (5-9 dias úteis)</li>
                    <li>Chegada aos CTT em Madrid</li>
                    <li>Entrega final em Portugal (2-3 dias úteis)</li>
                  </ul>
                  <p style="margin: 10px 0 0 0; font-style: italic; color: #6b7280;">
                    Nota: O código de rastreamento só ficará disponível quando a encomenda chegar aos CTT em Madrid.
                  </p>
                </div>
              </div>
              
              <p>Obrigado por escolher a fanzone12.pt!</p>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
              <p>Para dúvidas, contacte-nos através de <a href="mailto:geral@fanzone12.pt">geral@fanzone12.pt</a></p>
            </div>
          </div>
        </div>
      `,
      text: `
        Pedido Enviado!
        
        Olá ${order.customer_name || 'Cliente'},
        
        Ótimas notícias! O seu pedido #${order.order_number} foi enviado e está a caminho!
        
        ${trackingNumber ? `
        Informações de Rastreamento:
        Código de Rastreamento: ${trackingNumber}
        Transportadora: CTT Expresso
        Link de Rastreamento: https://appserver.ctt.pt/CustomerArea/PublicArea_Detail?ObjectCodeInput=${trackingNumber}&SearchInput=${trackingNumber}
        ` : ''}
        
        INFORMAÇÕES DE ENTREGA:
        Prazo Total: 7 a 12 dias úteis
        
        Processo:
        - Envio internacional (5-9 dias úteis)
        - Chegada aos CTT em Madrid
        - Entrega final em Portugal (2-3 dias úteis)
        
        Nota: O código de rastreamento só ficará disponível quando a encomenda chegar aos CTT em Madrid.
        
        Obrigado por escolher a fanzone12.pt!
        
        Para dúvidas, contacte-nos através de geral@fanzone12.pt
      `
    }
    
    const mg = createMailgunClient()
    await mg.messages.create(MAILGUN_DOMAIN, emailData)
    
    return NextResponse.json({
      success: true,
      message: `Email de envio enviado com sucesso para ${order.email}`
    })
    
  } catch (error: any) {
    console.error("Erro ao enviar email de envio:", error)
    
    if (error.message) {
      console.error("Erro Mailgun:", error.message)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Erro ao enviar email de envio: ${error.message || 'Erro desconhecido'}` 
      },
      { status: 500 }
    )
  }
}