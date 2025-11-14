import { Suspense } from "react"
import { getProdutos } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { ProductsSkeleton } from "@/components/products-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import Link from "next/link"

export const metadata = {
  title: "Nike Air Force 1 Fontanka | fanzone12.pt",
  description: "Descobre a nossa coleção exclusiva de Nike Air Force 1 Fontanka. Edição especial com design único.",
}

async function AirForce1FontankaContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pagina = typeof params.pagina === "string" ? parseInt(params.pagina) : 1
  const porPagina = 30

  // Filtrar produtos Air Force 1 Fontanka
  const allProducts = await getProdutos({ categoria: "sneakers" })
  const airForce1FontankaProducts = allProducts.filter(
    (product) => 
      product.subcategoria === "sneakers" && 
      product.marca?.toLowerCase().includes("nike") &&
      product.categoria === "air-force-1-fontanka"
  )
  
  const total = airForce1FontankaProducts.length
  const inicio = (pagina - 1) * porPagina
  const produtos = airForce1FontankaProducts.slice(inicio, inicio + porPagina)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/sneakers/nike" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Sneakers Nike
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nike Air Force 1 Fontanka
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Edição especial com design único
          </p>
        </div>

        {produtos.length > 0 ? (
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
                  basePath="/catalogo/air-force-1-fontanka"
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
              Air Force 1 Fontanka Em Breve
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Estamos a trabalhar para trazer mais modelos Air Force 1 Fontanka. 
              Mantém-te atento às novidades!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sneakers/nike">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Ver Todos os Sneakers Nike
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

export default function AirForce1FontankaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <AirForce1FontankaContent searchParams={searchParams} />
    </Suspense>
  )
}

