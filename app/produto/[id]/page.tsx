import { getProdutoById, getProdutos } from "@/lib/products"
import { notFound } from "next/navigation"
import { ProdutoPageClient } from "./ProdutoPageClient"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const produto = await getProdutoById(id)

  if (!produto) {
    return {
      title: "Produto não encontrado | fanzone12.pt",
    }
  }

  return {
    title: `${produto.nome} | fanzone12.pt`,
    description: produto.descricao,
  }
}

export default async function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const produto = await getProdutoById(id)

  if (!produto) {
    notFound()
  }

  return <ProdutoPageClient produto={produto} params={{ id }} />
}

export const revalidate = 86400 // Incremental Static Regeneration

