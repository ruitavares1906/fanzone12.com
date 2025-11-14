import { getProdutos } from "@/lib/products"
import { aplicarFiltroCor } from "@/lib/color-filter-utils"
import { ProductCard } from "@/components/product-card"
import { SneakersColorFilter } from "@/components/sneakers-color-filter"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/pagination"
import Link from "next/link"

export const metadata = {
  title: "Nike SB Dunk Low | fanzone12.pt",
  description: "Discover our collection exclusiva de Nike SB Dunk Low na fanzone12.pt. Sneakers originais com designs únicos e qualidade premium.",
}

export default async function DunkLowPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pagina = typeof params.pagina === "string" ? parseInt(params.pagina) : 1
  const porPagina = 30
  const cor = typeof params.cor === "string" ? params.cor : undefined

  // Usar a mesma lógica da página de sneakers
  const allProducts = await getProdutos({ categoria: "sneakers" })
  let allProductsDunkLow = allProducts.filter(
    (product) => 
      product.categoria === "dunk-low" && 
      product.marca?.toLowerCase().includes("nike")
  )

  // Aplicar filtro de cor se especificado
  allProductsDunkLow = aplicarFiltroCor(allProductsDunkLow, cor)
  
  const total = allProductsDunkLow.length
  const inicio = (pagina - 1) * porPagina
  const dunkLowProducts = allProductsDunkLow.slice(inicio, inicio + porPagina)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/sneakers/nike" className="text-purple-600 hover:text-purple-800 transition-colors">
            ← Back to Sneakers Nike
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nike SB Dunk Low
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our collection exclusiva de Nike SB Dunk Low. Sneakers originais com designs únicos e qualidade premium.
          </p>
        </div>

        {/* Filtros de Cor */}
        <SneakersColorFilter basePath="/catalogo/dunk-low" />

        {/* Produtos */}
        {dunkLowProducts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  All Products Nike SB Dunk Low
                </h2>
                <p className="text-gray-600 mt-1">
                  {total} product{total !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  In Stock
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  Sizes 36-45
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {dunkLowProducts.map((product) => (
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
                  basePath="/catalogo/dunk-low"
                  searchParams={new URLSearchParams(params as any)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👟</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                We could not find products Nike SB Dunk Low at the moment.
              </p>
              <Link 
                href="/sneakers/nike"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
              >
                Back to Sneakers Nike
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

