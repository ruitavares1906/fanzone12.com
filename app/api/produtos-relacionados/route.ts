import { NextRequest, NextResponse } from "next/server"
import { getProdutosRelacionados } from "@/lib/products"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id")
  const categoria = searchParams.get("categoria")

  if (!id || !categoria) {
    return NextResponse.json(
      { error: "id and categoria are required" },
      { status: 400 }
    )
  }

  try {
    const produtos = await getProdutosRelacionados(id, categoria)
    return NextResponse.json(produtos)
  } catch (error) {
    console.error("Error fetching related products:", error)
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    )
  }
}

