import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    if (typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json({ valid: false, error: "Código obrigatório" }, { status: 400 })
    }

    const value = code.trim()
    const { data, error } = await supabaseAdmin
      .from("partners")
      .select("id, discount_code, name")
      .ilike("discount_code", value)
      .single()

    if (error || !data) {
      return NextResponse.json({ valid: false, error: "Código inválido" }, { status: 200 })
    }

    return NextResponse.json({ valid: true, code: data.discount_code, partner: data.name })
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message || "Erro" }, { status: 500 })
  }
}


