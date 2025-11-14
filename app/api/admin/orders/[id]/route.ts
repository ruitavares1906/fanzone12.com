import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const orderId = resolvedParams.id
    console.log("=== BUSCANDO DETALHES DA ENCOMENDA VIA API ADMIN ===", orderId)

    // Buscar dados da encomenda específica usando supabaseAdmin
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)

    if (orderError) {
      console.error("Erro ao buscar encomenda:", orderError)
      return NextResponse.json({
        success: false,
        error: orderError.message
      }, { status: 500 })
    }

    if (!orderData || orderData.length === 0) {
      console.log("Encomenda não encontrada:", orderId)
      return NextResponse.json({
        success: false,
        error: "Encomenda não encontrada"
      }, { status: 404 })
    }

    const order = orderData[0]

    // Buscar items da encomenda
    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)

    if (itemsError) {
      console.warn("Erro ao buscar items (pode não existir tabela):", itemsError.message)
    }

    // Combinar dados
    const combinedOrder = {
      ...order,
      order_items: itemsData || []
    }

    console.log("✅ Detalhes da encomenda encontrados via API:", orderId)
    console.log("Items encontrados:", itemsData?.length || 0)

    return NextResponse.json({
      success: true,
      order: combinedOrder
    })

  } catch (error: any) {
    console.error("❌ Erro geral na API de detalhes da encomenda:", error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const orderId = resolvedParams.id
    const body = await request.json()
    
    console.log("=== ATUALIZANDO ENCOMENDA VIA API ADMIN ===", orderId)

    // Primeiro, verificar se a encomenda existe
    const { data: existingOrder, error: checkError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()

    if (checkError || !existingOrder) {
      return NextResponse.json({
        success: false,
        error: "Encomenda não encontrada"
      }, { status: 404 })
    }

    // Preparar dados para update, incluindo apenas campos que existem
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Campos básicos que provavelmente existem
    if (body.tracking_number !== undefined) updateData.tracking_number = body.tracking_number
    if (body.status !== undefined) updateData.status = body.status
    if (body.payment_status !== undefined) updateData.payment_status = body.payment_status
    if (body.shipping_method !== undefined) updateData.shipping_method = body.shipping_method
    if (body.notes !== undefined) updateData.notes = body.notes

    // Para estimated_delivery, vamos verificar se existe na estrutura atual
    if (body.estimated_delivery !== undefined) {
      // Se já existe no objeto atual, podemos tentar atualizar
      if ('estimated_delivery' in existingOrder) {
        updateData.estimated_delivery = body.estimated_delivery
      } else {
        console.warn("Campo estimated_delivery não existe na tabela, pulando...")
      }
    }

    // Fazer o update
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()
      .single()

    if (updateError) {
      console.error("Erro ao atualizar encomenda:", updateError)
      return NextResponse.json({
        success: false,
        error: updateError.message
      }, { status: 500 })
    }

    console.log("✅ Encomenda atualizada via API:", orderId)

    return NextResponse.json({
      success: true,
      order: updatedOrder
    })

  } catch (error: any) {
    console.error("❌ Erro geral ao atualizar encomenda:", error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
} 