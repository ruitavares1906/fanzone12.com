import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("=== VERIFICANDO E CORRIGINDO TABELA ORDER_ITEMS ===")
    
    // Primeiro verificar se a tabela existe e sua estrutura
    const { data: tableExists, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'order_items')
      .eq('table_schema', 'public')
      .single()

    if (tableError || !tableExists) {
      console.log("❌ Tabela order_items não existe. Criando...")
      
      // Criar a tabela order_items com a estrutura correta
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          size TEXT,
          customization TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
      `
      
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
      
      if (createError) {
        console.error("Erro ao criar tabela:", createError)
        throw createError
      }
      
      console.log("✅ Tabela order_items criada com sucesso")
    } else {
      console.log("✅ Tabela order_items existe")
      
      // Verificar a estrutura atual
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'order_items')
        .eq('table_schema', 'public')
        .order('ordinal_position')

      if (columnsError) {
        console.error("Erro ao verificar colunas:", columnsError)
        throw columnsError
      }

      console.log("Estrutura atual da tabela order_items:")
      columns.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
      })

      // Verificar se há um campo product_id problemático
      const productIdColumn = columns.find(col => col.column_name === 'product_id')
      
      if (productIdColumn) {
        console.log("⚠️ Campo product_id encontrado. Verificando se é UUID...")
        
        if (productIdColumn.data_type === 'uuid') {
          console.log("❌ Campo product_id é UUID. Removendo...")
          
          // Remover o campo product_id se for UUID
          const dropColumnSQL = `ALTER TABLE order_items DROP COLUMN IF EXISTS product_id;`
          
          const { error: dropError } = await supabase.rpc('exec_sql', { sql: dropColumnSQL })
          
          if (dropError) {
            console.error("Erro ao remover coluna product_id:", dropError)
            throw dropError
          }
          
          console.log("✅ Campo product_id removido com sucesso")
        }
      }

      // Verificar se todas as colunas necessárias existem
      const requiredColumns = ['id', 'order_id', 'name', 'price', 'quantity', 'size', 'customization', 'created_at', 'updated_at']
      const existingColumns = columns.map(col => col.column_name)
      const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col))

      if (missingColumns.length > 0) {
        console.log("❌ Colunas em falta:", missingColumns)
        
        // Adicionar colunas em falta
        const alterTableSQL = missingColumns.map(col => {
          switch (col) {
            case 'name':
              return 'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS name TEXT;'
            case 'price':
              return 'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);'
            case 'quantity':
              return 'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;'
            case 'size':
              return 'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size TEXT;'
            case 'customization':
              return 'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS customization TEXT;'
            case 'created_at':
              return 'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();'
            case 'updated_at':
              return 'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();'
            default:
              return null
          }
        }).filter(Boolean).join('\n')

        if (alterTableSQL) {
          const { error: alterError } = await supabase.rpc('exec_sql', { sql: alterTableSQL })
          
          if (alterError) {
            console.error("Erro ao adicionar colunas:", alterError)
            throw alterError
          }
          
          console.log("✅ Colunas adicionadas com sucesso")
        }
      } else {
        console.log("✅ Todas as colunas necessárias existem")
      }
    }

    // Verificar se há dados problemáticos na tabela
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .limit(5)

    if (itemsError) {
      console.error("Erro ao verificar dados:", itemsError)
    } else {
      console.log(`📊 Tabela order_items tem ${itemsData.length} registos (primeiros 5 mostrados)`)
      itemsData.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, JSON.stringify(item, null, 2))
      })
    }

    return NextResponse.json({
      success: true,
      message: "Verificação e correção da tabela order_items concluída",
      details: {
        tableExists: !!tableExists,
        structureFixed: true
      }
    })

  } catch (error: any) {
    console.error("=== ERRO AO CORRIGIR TABELA ===")
    console.error("Erro:", error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
} 