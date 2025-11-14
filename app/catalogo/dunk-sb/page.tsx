import { Suspense } from "react"
import { getProdutos } from "@/lib/products"
import { aplicarFiltroCor } from "@/lib/color-filter-utils"
import { ProductCard } from "@/components/product-card"
import { ProductsSkeleton } from "@/components/products-skeleton"
import { SneakersColorFilter } from "@/components/sneakers-color-filter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import Link from "next/link"

export const metadata = {
  title: "Nike Dunk SB | fanzone12.pt",
  description: "Descobre a nossa coleção exclusiva de Nike Dunk SB. Designs únicos e qualidade premium.",
}

async function DunkSBContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pagina = typeof params.pagina === "string" ? parseInt(params.pagina) : 1
  const porPagina = 30
  const cor = typeof params.cor === "string" ? params.cor : undefined

  // Filtrar produtos Dunk SB
  const allProducts = await getProdutos({ categoria: "sneakers" })
  let dunkSBProducts = allProducts.filter(
    (product) => 
      product.subcategoria === "sneakers" && 
      product.marca?.toLowerCase().includes("nike") &&
      product.categoria === "dunk-sb"
  )

  // Aplicar filtro de cor se especificado
  dunkSBProducts = aplicarFiltroCor(dunkSBProducts, cor)

  const total = dunkSBProducts.length
  const inicio = (pagina - 1) * porPagina
  const produtos = dunkSBProducts.slice(inicio, inicio + porPagina)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/sneakers/nike" className="text-orange-600 hover:text-orange-800 transition-colors">
            ← Voltar aos Sneakers Nike
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nike Dunk SB
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descobre a nossa coleção exclusiva de Nike Dunk SB. Designs únicos e qualidade premium.
          </p>
        </div>

        {/* Filtros de Cor */}
        <SneakersColorFilter basePath="/catalogo/dunk-sb" />

        {produtos.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Produtos Disponíveis
                </h2>
                <p className="text-gray-600 mt-1">
                  {total} produto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  Em Stock
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  Tamanhos 36-45
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {produtos.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {total > porPagina && (
              <div className="mt-12">
                <Pagination
                  total={total}
                  page={pagina}
                  perPage={porPagina}
                  basePath="/catalogo/dunk-sb"
                  searchParams={new URLSearchParams(params as any)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">👟</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mais Nike Dunk SB Em Breve
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Estamos a trabalhar para trazer mais modelos exclusivos de Nike Dunk SB.
              Mantém-te atento às novidades!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sneakers/nike">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Ver Todos os Sneakers Nike
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                  Contactar-nos
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DunkSBPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <DunkSBContent searchParams={searchParams} />
    </Suspense>
  )
}
