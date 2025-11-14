import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST() {
  try {
    console.log("=== CONFIGURANDO COLUNAS DE DESCONTO ===")

    // Script SQL para adicionar colunas de desconto
    const sqlScript = `
      -- Verificar se as colunas já existem antes de adicionar
      DO $$ 
      BEGIN
          -- Adicionar coluna discount_code se não existir
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'orders' 
              AND column_name = 'discount_code'
          ) THEN
              ALTER TABLE orders ADD COLUMN discount_code VARCHAR(50);
          END IF;

          -- Adicionar coluna discount_amount se não existir
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'orders' 
              AND column_name = 'discount_amount'
          ) THEN
              ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
          END IF;

          -- Adicionar comentários às colunas
          COMMENT ON COLUMN orders.discount_code IS 'Código de desconto aplicado';
          COMMENT ON COLUMN orders.discount_amount IS 'Valor do desconto aplicado em euros';

          RAISE NOTICE 'Colunas de desconto configuradas com sucesso!';
      END $$;
    `

    // Executar o script SQL
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql: sqlScript })

    if (error) {
      console.error("Erro ao executar script SQL:", error)
      return NextResponse.json({
        success: false,
        error: error.message,
        message: "Erro ao configurar colunas de desconto"
      }, { status: 500 })
    }

    // Verificar se as colunas foram criadas
    const { data: columns, error: columnsError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'orders')
      .in('column_name', ['discount_code', 'discount_amount'])

    if (columnsError) {
      console.error("Erro ao verificar colunas:", columnsError)
      return NextResponse.json({
        success: false,
        error: columnsError.message,
        message: "Erro ao verificar colunas criadas"
      }, { status: 500 })
    }

    console.log("✅ Colunas de desconto configuradas:", columns)

    return NextResponse.json({
      success: true,
      message: "Colunas de desconto configuradas com sucesso",
      columns: columns || []
    })

  } catch (error: any) {
    console.error("❌ Erro geral na configuração das colunas:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: "Erro interno do servidor"
    }, { status: 500 })
  }
}
