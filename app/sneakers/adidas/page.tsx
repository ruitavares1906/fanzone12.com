import { Suspense } from "react"
import { getProdutos } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { ProductsSkeleton } from "@/components/products-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import Link from "next/link"

export const metadata = {
  title: "Sneakers Adidas | fanzone12.pt",
  description: "Descobre a nossa coleção exclusiva de sneakers Adidas. Designs únicos e qualidade alemã.",
}

async function SneakersAdidasContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pagina = typeof params.pagina === "string" ? parseInt(params.pagina) : 1
  const porPagina = 30

  // Filtrar produtos que são sneakers da marca Adidas
  const allProducts = await getProdutos({ categoria: "sneakers" })
  const todosAdidasSneakers = allProducts.filter(
    (product) => 
      product.subcategoria === "sneakers" && 
      product.marca?.toLowerCase().includes("adidas")
  )
  
  const total = todosAdidasSneakers.length
  const inicio = (pagina - 1) * porPagina
  const adidasSneakers = todosAdidasSneakers.slice(inicio, inicio + porPagina)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/sneakers" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Sneakers
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sneakers Adidas
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Qualidade alemã com designs exclusivos
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {/* Originals Samba */}
          <Link href="/catalogo/samba" className="group">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-md group-hover:scale-105">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-base">👟</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                  Originals Samba
                </h3>
                <Badge className="bg-green-600 text-white px-1.5 py-0.5 text-xs font-semibold">
                  Adidas
                </Badge>
              </div>
            </div>
          </Link>

          {/* Originals Gazelle */}
          <Link href="/catalogo/gazelle" className="group">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-md group-hover:scale-105">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-base">👟</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                  Originals Gazelle
                </h3>
                <Badge className="bg-green-600 text-white px-1.5 py-0.5 text-xs font-semibold">
                  Adidas
                </Badge>
              </div>
            </div>
          </Link>

          {/* Superstar */}
          <Link href="/catalogo/superstar" className="group">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-md group-hover:scale-105">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-base">👟</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                  Superstar
                </h3>
                <Badge className="bg-green-600 text-white px-1.5 py-0.5 text-xs font-semibold">
                  Adidas
                </Badge>
              </div>
            </div>
          </Link>

          {/* Handball SPZL */}
          <Link href="/catalogo/handball-spzl" className="group">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-md group-hover:scale-105">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-base">👟</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                  Handball SPZL
                </h3>
                <Badge className="bg-green-600 text-white px-1.5 py-0.5 text-xs font-semibold">
                  Adidas
                </Badge>
              </div>
            </div>
          </Link>

          {/* Campus */}
          <Link href="/catalogo/campus" className="group">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-md group-hover:scale-105">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-base">👟</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                  Campus
                </h3>
                <Badge className="bg-green-600 text-white px-1.5 py-0.5 text-xs font-semibold">
                  Adidas
                </Badge>
              </div>
            </div>
          </Link>
        </div>

        {/* Produtos */}
        {adidasSneakers.length > 0 ? (
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
                <Badge className="bg-blue-100 text-blue-800">
                  Sizes 36-45
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {adidasSneakers.map((product) => (
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
                  basePath="/sneakers/adidas"
                  searchParams={new URLSearchParams(params as any)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">👟</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mais Sneakers Adidas Em Breve
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Estamos a trabalhar para trazer mais modelos exclusivos da Adidas. 
              Mantém-te atento às novidades!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sneakers">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Ver Todos os Sneakers
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
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

export default function SneakersAdidasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <SneakersAdidasContent searchParams={searchParams} />
    </Suspense>
  )
} 