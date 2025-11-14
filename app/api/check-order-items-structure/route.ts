import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("=== VERIFICANDO ESTRUTURA DA TABELA ORDER_ITEMS ===")
    
    // Verificar se a tabela existe
    const { data: tableExists, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'order_items')
      .eq('table_schema', 'public')
      .maybeSingle()

    if (tableError) {
      console.error("Erro ao verificar tabela:", tableError)
      return NextResponse.json({
        success: false,
        error: tableError.message
      }, { status: 500 })
    }

    if (!tableExists) {
      console.log("❌ Tabela order_items não existe")
      return NextResponse.json({
        success: false,
        message: "Tabela order_items não existe",
        tableExists: false
      })
    }

    console.log("✅ Tabela order_items existe")

    // Verificar estrutura da tabela
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'order_items')
      .eq('table_schema', 'public')
      .order('ordinal_position')

    if (columnsError) {
      console.error("Erro ao verificar colunas:", columnsError)
      return NextResponse.json({
        success: false,
        error: columnsError.message
      }, { status: 500 })
    }

    console.log("Estrutura da tabela order_items:")
    const columnInfo = columns.map(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
      return {
        name: col.column_name,
        type: col.data_type,
        nullable: col.is_nullable,
        default: col.column_default
      }
    })

    // Verificar se as colunas necessárias existem
    const requiredColumns = ['id', 'order_id', 'name', 'price', 'quantity', 'size', 'customization']
    const existingColumns = columns.map(col => col.column_name)
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col))
    const hasTimestamps = existingColumns.includes('created_at') && existingColumns.includes('updated_at')

    // Testar inserção simples
    let insertTestResult = null
    try {
      console.log("Testando inserção simples...")
      
      // Criar um pedido de teste primeiro
      const testOrderData = {
        stripe_session_id: "test_session_" + Date.now(),
        order_number: "TEST_" + Date.now(),
        status: "test",
        payment_status: "pending",
        total: 1.00,
        email: "test@example.com",
        customer_name: "Teste",
        customer_phone: "123456789"
      }

      const { data: testOrder, error: orderError } = await supabase
        .from('orders')
        .insert(testOrderData)
        .select()
        .single()

      if (orderError) {
        throw new Error(`Erro ao criar pedido de teste: ${orderError.message}`)
      }

      // Testar inserção de item
      const testItemData = {
        order_id: testOrder.id,
        name: "Produto Teste",
        price: 1.00,
        quantity: 1,
        size: "M",
        customization: "Teste"
      }

      const { data: testItem, error: itemError } = await supabase
        .from('order_items')
        .insert(testItemData)
        .select()
        .single()

      if (itemError) {
        throw new Error(`Erro ao inserir item de teste: ${itemError.message}`)
      }

      // Limpar dados de teste
      await supabase.from('order_items').delete().eq('id', testItem.id)
      await supabase.from('orders').delete().eq('id', testOrder.id)

      insertTestResult = "✅ Inserção de teste bem-sucedida"
      console.log(insertTestResult)

    } catch (testError: any) {
      insertTestResult = `❌ Erro na inserção de teste: ${testError.message}`
      console.error(insertTestResult)
    }

    return NextResponse.json({
      success: true,
      message: "Verificação da estrutura concluída",
      details: {
        tableExists: true,
        columns: columnInfo,
        missingColumns,
        hasTimestamps,
        insertTest: insertTestResult
      }
    })

  } catch (error: any) {
    console.error("=== ERRO AO VERIFICAR ESTRUTURA ===")
    console.error("Erro:", error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
} 