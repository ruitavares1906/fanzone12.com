import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Verificar se a tabela admin_users existe
    const { error: tableError } = await supabase.from("admin_users").select("count").limit(1).single()

    // Se a tabela não existir
    if (tableError && tableError.code === "PGRST116") {
      return NextResponse.json({ exists: false, message: "A tabela de administradores não existe" })
    }

    // Verificar se existem administradores
    const { data, error } = await supabase.from("admin_users").select("count").single()

    if (error) {
      return NextResponse.json({ error: "Erro ao verificar administradores", details: error.message }, { status: 500 })
    }

    const count = data?.count || 0
    return NextResponse.json({ exists: count > 0, count })
  } catch (error: any) {
    return NextResponse.json({ error: "Erro interno", details: error.message }, { status: 500 })
  }
}
