import { redirect } from "next/navigation"

export default async function PesquisaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pesquisa = typeof params.q === "string" ? params.q : ""
  
  if (pesquisa) {
    redirect(`/catalogo?pesquisa=${encodeURIComponent(pesquisa)}`)
  }
  
  // Se não há termo de pesquisa, redirecionar para o catálogo
  redirect("/catalogo")
} 