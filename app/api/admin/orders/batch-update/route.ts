import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { sendOrderConfirmationEmail, sendShippingConfirmationEmail } from "@/lib/mailgun"

export async function POST(request: Request) {
  try {
    const { orderIds, field, value } = await request.json()

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "IDs das encomendas são obrigatórios" }, { status: 400 })
    }

    if (!field || !value) {
      return NextResponse.json({ error: "Campo e valor são obrigatórios" }, { status: 400 })
    }

    // Validar campo permitido - apenas campos que existem na tabela
    const allowedFields = ['status', 'payment_status', 'notes']
    if (!allowedFields.includes(field)) {
      return NextResponse.json({ error: "Campo não permitido" }, { status: 400 })
    }

    // Buscar detalhes das encomendas antes de atualizar
    const { data: ordersData, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .in('id', orderIds)

    if (fetchError) {
      console.error('Erro ao buscar encomendas:', fetchError)
      return NextResponse.json({ error: "Erro ao buscar encomendas" }, { status: 500 })
    }

    // Atualizar todas as encomendas selecionadas
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .in('id', orderIds)

    if (error) {
      console.error('Erro ao atualizar encomendas:', error)
      return NextResponse.json({ error: "Erro ao atualizar encomendas" }, { status: 500 })
    }

    // Enviar emails baseado no tipo de alteração
    const emailPromises = ordersData.map(async (order) => {
      try {
        if (field === 'status' && value === 'shipped') {
          // Email de confirmação de envio
          await sendShippingConfirmationEmail({
            orderNumber: order.order_number || order.id.substring(0, 8),
            customerName: order.customer_name || order.email,
            customerEmail: order.email,
            carrier: order.carrier,
            trackingNumber: order.tracking_number,
            trackingUrl: order.tracking_url
          })
        } else if (field === 'payment_status' && value === 'paid') {
          // Para confirmação de pagamento, podemos enviar um email personalizado
          // ou usar a função de confirmação de encomenda existente
          console.log(`Pagamento confirmado para encomenda ${order.id}`)
        } else if (field === 'status' && value === 'completed') {
          // Email de confirmação de entrega
          console.log(`Encomenda ${order.id} marcada como entregue`)
        } else if (field === 'status' && value === 'cancelled') {
          // Email de cancelamento
          console.log(`Encomenda ${order.id} cancelada`)
        }
      } catch (emailError) {
        console.error(`Erro ao enviar email para encomenda ${order.id}:`, emailError)
        // Não falhar a operação se o email falhar
      }
    })

    // Aguardar todos os emails serem enviados
    await Promise.allSettled(emailPromises)

    return NextResponse.json({ 
      success: true, 
      message: `${orderIds.length} encomenda(s) atualizada(s) com sucesso`,
      updatedCount: orderIds.length,
      emailsSent: emailPromises.length
    })

  } catch (error) {
    console.error('Erro na API batch-update:', error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
} 