import { Suspense } from "react"
import { getProdutos } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { ProductsSkeleton } from "@/components/products-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Sneakers Nike | fanzone12.pt",
  description: "Descobre a nossa coleção exclusiva de sneakers Nike. Inovação e estilo americano em cada passo.",
}

async function SneakersNikeContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pagina = typeof params.pagina === "string" ? parseInt(params.pagina) : 1
  const porPagina = 30

  // Filtrar produtos que são sneakers da marca Nike
  const allProducts = await getProdutos({ categoria: "sneakers" })
  const todosNikeSneakers = allProducts.filter(
    (product) => 
      product.subcategoria === "sneakers" && 
      product.marca?.toLowerCase().includes("nike")
  )
  
  const total = todosNikeSneakers.length
  const inicio = (pagina - 1) * porPagina
  const nikeSneakers = todosNikeSneakers.slice(inicio, inicio + porPagina)

  // Filtrar produtos Air Force especificamente
  const airForceProducts = allProducts.filter(
    (product) => 
      product.categoria === "airforce" && 
      product.marca?.toLowerCase().includes("nike")
  )

  // Filtrar produtos Nike SB Dunk Low especificamente
  const dunkLowProducts = allProducts.filter(
    (product) => 
      product.categoria === "dunk-low" && 
      product.marca?.toLowerCase().includes("nike")
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/sneakers" className="text-orange-600 hover:text-orange-800 transition-colors">
            ← Back to Sneakers
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sneakers Nike
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Inovação e estilo americano em cada passo
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {/* Air Force 1 Low */}
          <Link href="/catalogo/air-force-1-low" className="group">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md group-hover:scale-105">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-base">👟</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                  Air Force 1 Low
                </h3>
                <Badge className="bg-blue-600 text-white px-1.5 py-0.5 text-xs font-semibold">
                  Nike
                </Badge>
              </div>
            </div>
          </Link>

          {/* Air Jordan 1 Low */}
          <Link href="/catalogo/air-jordan-1-low" className="group">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-md group-hover:scale-105">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-base">👟</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                  Air Jordan 1 Low
                </h3>
                <Badge className="bg-red-600 text-white px-1.5 py-0.5 text-xs font-semibold">
                  Nike
                </Badge>
              </div>
            </div>
          </Link>

          {/* Air Force 1 High */}
          <Link href="/catalogo/air-force-1-high" className="group">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md group-hover:scale-105">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-base">👟</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                  Air Force 1 High
                </h3>
                <Badge className="bg-blue-600 text-white px-1.5 py-0.5 text-xs font-semibold">
                  Nike
                </Badge>
              </div>
            </div>
          </Link>

          {/* Air Force 1 Fontanka */}
          <Link href="/catalogo/air-force-1-fontanka" className="group">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md group-hover:scale-105">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-base">👟</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                  Air Force 1 Fontanka
                </h3>
                <Badge className="bg-blue-600 text-white px-1.5 py-0.5 text-xs font-semibold">
                  Nike
                </Badge>
              </div>
            </div>
          </Link>

          {/* Air Force Shadow */}
          <Link href="/catalogo/air-force-shadow" className="group">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md group-hover:scale-105">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-base">👟</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                  Air Force Shadow
                </h3>
                <Badge className="bg-blue-600 text-white px-1.5 py-0.5 text-xs font-semibold">
                  Nike
                </Badge>
              </div>
            </div>
          </Link>

          {/* Dunk SB */}
          <Link href="/catalogo/dunk-sb" className="group">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-all duration-200 hover:shadow-md group-hover:scale-105">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-base">👟</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                  Dunk SB
                </h3>
                <Badge className="bg-purple-600 text-white px-1.5 py-0.5 text-xs font-semibold">
                  Nike
                </Badge>
              </div>
            </div>
          </Link>
        </div>

        {/* Produtos */}
        {nikeSneakers.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  All Products Nike
                </h2>
                <p className="text-gray-600 mt-1">
                  {total} product{total !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  In Stock
                </Badge>
                <Badge className="bg-orange-100 text-orange-800">
                  Sizes 36-45
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {nikeSneakers.map((product) => (
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
                  basePath="/sneakers/nike"
                  searchParams={new URLSearchParams(params as any)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">👟</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sneakers Nike Em Breve
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Estamos a trabalhar com a Nike para trazer os melhores modelos exclusivos. 
              Just Do It - mantém-te atento!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sneakers">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Ver Todos os Sneakers
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

export default function SneakersNikePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <SneakersNikeContent searchParams={searchParams} />
    </Suspense>
  )
} 