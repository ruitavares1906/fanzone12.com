import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const url = new URL(request.url)
    const partnerName = decodeURIComponent(params.name)
    const pageParam = parseInt(url.searchParams.get("page") || "1", 10)
    const limitParam = parseInt(url.searchParams.get("limit") || "20", 10)
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
    const limit = isNaN(limitParam) || limitParam < 1 ? 20 : Math.min(limitParam, 100)
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Encontrar parceiro por nome
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from("partners")
      .select("id, discount_code, name")
      .ilike("name", partnerName)
      .single()

    if (partnerError || !partner) {
      return NextResponse.json({ error: "Parceiro não encontrado" }, { status: 404 })
    }

    // Buscar encomendas com o discount_code do parceiro
    const { data: orders, error: ordersError, count } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, customer_name, items, total, status, payment_status, created_at", { count: 'exact' })
      .eq("discount_code", partner.discount_code)
      .order("created_at", { ascending: false })
      .range(from, to)

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      partner: { id: partner.id, name: partner.name }, 
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.max(1, Math.ceil(count / limit)) : 1,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 })
  }
}


