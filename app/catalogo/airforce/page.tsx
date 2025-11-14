import { getProdutos } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/pagination"
import Link from "next/link"

export const metadata = {
  title: "Nike Air Force 1 | fanzone12.pt",
  description: "Descubra a nossa coleção exclusiva de Nike Air Force 1 na fanzone12.pt. Sneakers originais com designs únicos e qualidade premium.",
}

export default async function AirForcePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pagina = typeof params.pagina === "string" ? parseInt(params.pagina) : 1
  const porPagina = 30

  // Filtrar produtos Air Force especificamente
  const allProducts = await getProdutos({ categoria: "airforce" })
  const todosAirForceProducts = allProducts.filter(
    (product) => product.categoria === "airforce"
  )
  
  const total = todosAirForceProducts.length
  const inicio = (pagina - 1) * porPagina
  const airForceProducts = todosAirForceProducts.slice(inicio, inicio + porPagina)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/sneakers/nike" className="text-orange-600 hover:text-orange-800 transition-colors">
            ← Voltar aos Sneakers Nike
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nike Air Force 1
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra a nossa coleção exclusiva de Nike Air Force 1. Sneakers originais com designs únicos e qualidade premium.
          </p>
        </div>

        {/* Produtos */}
        {airForceProducts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Todos os Produtos Air Force 1
                </h2>
                <p className="text-gray-600 mt-1">
                  {total} produto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  Em Stock
                </Badge>
                <Badge className="bg-orange-100 text-orange-800">
                  Tamanhos 36-45
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {airForceProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Paginação */}
            {total > porPagina && (
              <div className="mt-12">
                <Pagination
                  total={total}
                  page={pagina}
                  perPage={porPagina}
                  basePath="/catalogo/airforce"
                  searchParams={new URLSearchParams(params as any)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👟</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Não encontramos produtos Air Force 1 no momento.
              </p>
              <Link 
                href="/sneakers/nike"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Voltar aos Sneakers Nike
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
