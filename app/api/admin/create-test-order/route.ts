import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST() {
  try {
    console.log("=== INICIANDO CRIAÇÃO DE ENCOMENDA DE TESTE ===")

    // Gerar número da encomenda único
    const orderNumber = `TEST-${Math.floor(100000 + Math.random() * 900000)}`
    
    // Dados da encomenda de teste
    const testOrderData = {
      order_number: orderNumber,
      email: "cliente.teste@exemplo.com",
      customer_name: "Cliente Teste",
      customer_phone: "+351 912 345 678",
      status: "pending",
      payment_status: "paid",
      total: 149.97,
      subtotal: 144.98,
      shipping_cost: 4.99,
      payment_method: "Cartão de Crédito",
      shipping_method: "CTT",
      discount_code: "CAMI10", // Código de desconto para testar estatísticas
      shipping_address: JSON.stringify({
        name: "Cliente Teste",
        line1: "Rua de Teste, 123",
        line2: "2º Andar, Porta B",
        city: "Lisboa",
        postal_code: "1000-001",
        state: "Lisboa",
        country: "Portugal",
        phone: "+351 912 345 678"
      }),
      items: JSON.stringify([
        {
          name: "Camisola Sporting CP 2024/25",
          price: 89.99,
          quantity: 1,
          size: "M",
          customization: "SILVA 10"
        },
        {
          name: "Calções Sporting CP 2024/25",
          price: 54.99,
          quantity: 1,
          size: "M"
        }
      ]),
      notes: "Encomenda de teste criada automaticamente para verificação do sistema"
    }

    console.log("📦 Criando encomenda de teste:", orderNumber, "com código de desconto: CAMI10")

    // Inserir encomenda usando supabaseAdmin
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert(testOrderData)
      .select()
      .single()

    if (orderError) {
      console.error("❌ Erro ao criar encomenda:", orderError)
      throw new Error(`Erro ao criar encomenda: ${orderError.message}`)
    }

    console.log("✅ Encomenda criada com sucesso:", order.id)

    // Tentar criar itens separados na tabela order_items (se existir)
    try {
      const orderItems = [
        {
          order_id: order.id,
          name: "Camisola Sporting CP 2024/25",
          price: 89.99,
          quantity: 1,
          size: "M",
          customization: "SILVA 10"
        },
        {
          order_id: order.id,
          name: "Calções Sporting CP 2024/25",
          price: 54.99,
          quantity: 1,
          size: "M",
          customization: null
        }
      ]

      const { error: itemsError } = await supabaseAdmin
        .from("order_items")
        .insert(orderItems)

      if (itemsError) {
        console.warn("⚠️ Aviso: Não foi possível criar itens separados:", itemsError.message)
        console.log("📝 Itens ficaram salvos como JSON na encomenda")
      } else {
        console.log("✅ Itens da encomenda criados separadamente")
      }
    } catch (e) {
      console.log("📝 Tabela order_items não existe, usando JSON na encomenda")
    }

    return NextResponse.json({
      success: true,
      message: "Encomenda de teste criada com sucesso",
      order: {
        id: order.id,
        order_number: order.order_number
      }
    })

  } catch (error: any) {
    console.error("❌ ERRO GERAL:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar encomenda de teste",
        error: error.message,
        details: "Verifique se a tabela 'orders' existe e tem as colunas necessárias"
      },
      { status: 500 }
    )
  }
}
