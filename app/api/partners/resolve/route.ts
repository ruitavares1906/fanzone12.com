import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const q = (url.searchParams.get("q") || "").trim()
    if (!q) {
      return NextResponse.json({ error: "Parâmetro q é obrigatório" }, { status: 400 })
    }

    // Procurar por nome ou código (case-insensitive)
    const { data: byCode } = await supabaseAdmin
      .from("partners")
      .select("name, discount_code")
      .ilike("discount_code", q)
      .maybeSingle()

    if (byCode) {
      return NextResponse.json({ name: byCode.name, discount_code: byCode.discount_code })
    }

    const { data: byName } = await supabaseAdmin
      .from("partners")
      .select("name, discount_code")
      .ilike("name", q)
      .maybeSingle()

    if (byName) {
      return NextResponse.json({ name: byName.name, discount_code: byName.discount_code })
    }

    return NextResponse.json({ error: "Parceiro não encontrado" }, { status: 404 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 })
  }
}


