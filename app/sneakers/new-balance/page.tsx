import { Suspense } from "react"
import { getProdutos } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { ProductsSkeleton } from "@/components/products-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import Link from "next/link"

export const metadata = {
  title: "Sneakers New Balance | fanzone12.pt",
  description: "Descobre a nossa coleção exclusiva de sneakers New Balance. Conforto e qualidade americana em cada passo.",
}

async function SneakersNewBalanceContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pagina = typeof params.pagina === "string" ? parseInt(params.pagina) : 1
  const porPagina = 30

  // Filtrar produtos que são sneakers da marca New Balance
  const allProducts = await getProdutos({ categoria: "sneakers" })
  const todosNewBalanceSneakers = allProducts.filter(
    (product) => 
      product.subcategoria === "sneakers" && 
      product.marca?.toLowerCase().includes("new balance")
  )
  
  const total = todosNewBalanceSneakers.length
  const inicio = (pagina - 1) * porPagina
  const newBalanceSneakers = todosNewBalanceSneakers.slice(inicio, inicio + porPagina)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/sneakers" className="text-green-600 hover:text-green-800 transition-colors">
            ← Back to Sneakers
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sneakers New Balance
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conforto e qualidade americana em cada passo
          </p>
        </div>

        {/* Produtos */}
        {newBalanceSneakers.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Products
                </h2>
                <p className="text-gray-600 mt-1">
                  {total} product{total !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  In Stock
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  Sizes 36-45
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {newBalanceSneakers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {total > porPagina && (
              <div className="mt-12">
                <Pagination
                  total={total}
                  page={pagina}
                  perPage={porPagina}
                  basePath="/sneakers/new-balance"
                  searchParams={new URLSearchParams(params as any)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">👟</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mais Sneakers New Balance Em Breve
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Estamos a trabalhar para trazer mais modelos exclusivos da New Balance. 
              Mantém-te atento às novidades!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sneakers">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Ver Todos os Sneakers
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
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

export default function SneakersNewBalancePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <SneakersNewBalanceContent searchParams={searchParams} />
    </Suspense>
  )
}
