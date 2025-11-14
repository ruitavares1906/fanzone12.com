import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("=== VERIFICANDO ESTRUTURA DAS TABELAS ===")
    
    // Verificar tabela orders
    const { data: ordersStructure, error: ordersError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable")
      .eq("table_name", "orders")
      .order("ordinal_position")

    if (ordersError) {
      console.error("Erro ao verificar tabela orders:", ordersError)
    } else {
      console.log("Estrutura da tabela orders:", ordersStructure)
    }

    // Verificar tabela order_items
    const { data: itemsStructure, error: itemsError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable")
      .eq("table_name", "order_items")
      .order("ordinal_position")

    if (itemsError) {
      console.error("Erro ao verificar tabela order_items:", itemsError)
    } else {
      console.log("Estrutura da tabela order_items:", itemsStructure)
    }

    // Tentar criar um pedido de teste para verificar quais campos estão faltando
    const testOrder = {
      stripe_session_id: "test_session_123",
      order_number: "123456",
      status: "test",
      payment_status: "pending",
      total: 10.50,
      shipping_cost: 4.00,
      email: "test@example.com",
      customer_name: "Teste Cliente",
      customer_phone: "123456789",
      shipping_address: {
        line1: "Rua Teste, 123",
        city: "Lisboa",
        postal_code: "1000-001",
        country: "PT"
      },
      billing_address: {
        name: "Teste Cliente",
        email: "test@example.com",
        phone: "123456789"
      },
      payment_method: "card",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log("Tentando inserir pedido de teste:", testOrder)

    const { data: testResult, error: testError } = await supabase
      .from("orders")
      .insert(testOrder)
      .select()

    if (testError) {
      console.error("Erro ao inserir pedido de teste:", testError)
      console.error("Detalhes do erro:", JSON.stringify(testError, null, 2))
    } else {
      console.log("Pedido de teste inserido com sucesso:", testResult)
      
      // Remover o pedido de teste
      if (testResult && testResult[0]) {
        await supabase.from("orders").delete().eq("id", testResult[0].id)
        console.log("Pedido de teste removido")
      }
    }

    return NextResponse.json({
      success: true,
      ordersStructure,
      itemsStructure,
      testError: testError ? {
        message: testError.message,
        code: testError.code,
        details: testError.details,
        hint: testError.hint
      } : null
    })

  } catch (error) {
    console.error("Erro ao verificar tabelas:", error)
    return NextResponse.json(
      { error: "Erro ao verificar estrutura das tabelas" },
      { status: 500 }
    )
  }
} 