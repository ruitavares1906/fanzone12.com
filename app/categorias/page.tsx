import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Categorias de Produtos | fanzone12.pt",
  description: "Guia completo das categorias de produtos para organização do catálogo.",
}

export default function CategoriasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Guia de Categorias de Produtos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sistema organizado para categorização de sneakers por marca e modelo
          </p>
        </div>

        {/* Nike Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">N</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Nike</h2>
                <p className="text-sm text-gray-600 font-normal">6 categorias disponíveis</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Air Force 1 Low</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-blue-100 px-2 py-1 rounded text-xs">air-force-1-low</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "nike"</li>
                  <li>• nome: "air force 1 low"</li>
                </ul>
                <Link href="/catalogo/air-force-1-low" className="text-blue-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold text-gray-900 mb-2">Air Jordan 1 Low</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-red-100 px-2 py-1 rounded text-xs">air-jordan-1-low</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "nike"</li>
                  <li>• nome: "air jordan 1 low"</li>
                </ul>
                <Link href="/catalogo/air-jordan-1-low" className="text-red-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Air Force 1 High</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-blue-100 px-2 py-1 rounded text-xs">air-force-1-high</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "nike"</li>
                  <li>• nome: "air force 1 high"</li>
                </ul>
                <Link href="/catalogo/air-force-1-high" className="text-blue-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Air Force 1 Fontanka</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-blue-100 px-2 py-1 rounded text-xs">air-force-1-fontanka</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "nike"</li>
                  <li>• nome: "air force 1 fontanka"</li>
                </ul>
                <Link href="/catalogo/air-force-1-fontanka" className="text-blue-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Air Force Shadow</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-blue-100 px-2 py-1 rounded text-xs">air-force-shadow</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "nike"</li>
                  <li>• nome: "air force shadow"</li>
                </ul>
                <Link href="/catalogo/air-force-shadow" className="text-blue-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-2">Dunk SB</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-purple-100 px-2 py-1 rounded text-xs">dunk-sb</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "nike"</li>
                  <li>• nome: "dunk sb"</li>
                </ul>
                <Link href="/catalogo/dunk-sb" className="text-purple-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Adidas Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">A</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Adidas</h2>
                <p className="text-sm text-gray-600 font-normal">5 categorias disponíveis</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-2">Originals Samba</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-green-100 px-2 py-1 rounded text-xs">samba</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "adidas"</li>
                  <li>• nome: "samba"</li>
                </ul>
                <Link href="/catalogo/samba" className="text-green-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-2">Originals Gazelle</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-green-100 px-2 py-1 rounded text-xs">gazelle</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "adidas"</li>
                  <li>• nome: "gazelle"</li>
                </ul>
                <Link href="/catalogo/gazelle" className="text-green-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-2">Superstar</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-green-100 px-2 py-1 rounded text-xs">superstar</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "adidas"</li>
                  <li>• nome: "superstar"</li>
                </ul>
                <Link href="/catalogo/superstar" className="text-green-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-2">Handball SPZL</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-green-100 px-2 py-1 rounded text-xs">handball-spzl</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "adidas"</li>
                  <li>• nome: "handball spzl"</li>
                </ul>
                <Link href="/catalogo/handball-spzl" className="text-green-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-2">Campus</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-green-100 px-2 py-1 rounded text-xs">campus</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "adidas"</li>
                  <li>• nome: "campus"</li>
                </ul>
                <Link href="/catalogo/campus" className="text-green-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Balance Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">N</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">New Balance</h2>
                <p className="text-sm text-gray-600 font-normal">16 categorias disponíveis</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">990</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-990</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "990"</li>
                </ul>
                <Link href="/catalogo/nb-990" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">991</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-991</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "991"</li>
                </ul>
                <Link href="/catalogo/nb-991" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">992</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-992</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "992"</li>
                </ul>
                <Link href="/catalogo/nb-992" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">993</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-993</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "993"</li>
                </ul>
                <Link href="/catalogo/nb-993" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">997</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-997</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "997"</li>
                </ul>
                <Link href="/catalogo/nb-997" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">998</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-998</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "998"</li>
                </ul>
                <Link href="/catalogo/nb-998" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">999</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-999</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "999"</li>
                </ul>
                <Link href="/catalogo/nb-999" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">2002R</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-2002r</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "2002r"</li>
                </ul>
                <Link href="/catalogo/nb-2002r" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">327</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-327</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "327"</li>
                </ul>
                <Link href="/catalogo/nb-327" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">530</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-530</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "530"</li>
                </ul>
                <Link href="/catalogo/nb-530" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">550</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-550</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "550"</li>
                </ul>
                <Link href="/catalogo/nb-550" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">574</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-574</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "574"</li>
                </ul>
                <Link href="/catalogo/nb-574" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">610</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-610</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "610"</li>
                </ul>
                <Link href="/catalogo/nb-610" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">1906R</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-1906r</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "1906r"</li>
                </ul>
                <Link href="/catalogo/nb-1906r" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">9060</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-9060</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "9060"</li>
                </ul>
                <Link href="/catalogo/nb-9060" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">410</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-410</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "410"</li>
                </ul>
                <Link href="/catalogo/nb-410" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">1000</h3>
                <p className="text-sm text-gray-600 mb-3">Categoria: <code className="bg-gray-100 px-2 py-1 rounded text-xs">nb-1000</code></p>
                <p className="text-xs text-gray-500 mb-2">Filtro no produto:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• marca: "new balance"</li>
                  <li>• nome: "1000"</li>
                </ul>
                <Link href="/catalogo/nb-1000" className="text-gray-600 text-xs hover:underline">
                  Ver página →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">📋 Como Usar Este Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">1. Para Adicionar Produtos:</h4>
                <p className="text-sm text-blue-800 mb-2">Quando adicionar um produto ao sistema, use estes campos:</p>
                <ul className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>• <strong>marca</strong>: "Nike", "Adidas", ou "New Balance"</li>
                  <li>• <strong>categoria</strong>: nome do modelo (ex: "air-force-1-low", "samba", "newbalance")</li>
                  <li>• <strong>subcategoria</strong>: "sneakers"</li>
                  <li>• <strong>nome</strong>: deve conter o modelo específico</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">2. Exemplos de Produtos:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <strong>Nike Air Force 1 Low Branco</strong><br/>
                    marca: "Nike"<br/>
                    categoria: "air-force-1-low"<br/>
                    nome: "Nike Air Force 1 Low Branco"<br/>
                    → Aparece em: Air Force 1 Low
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <strong>Adidas Samba Verde</strong><br/>
                    marca: "Adidas"<br/>
                    categoria: "samba"<br/>
                    nome: "Adidas Originals Samba Verde"<br/>
                    → Aparece em: Originals Samba
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <strong>New Balance 990 Cinza</strong><br/>
                    marca: "New Balance"<br/>
                    categoria: "newbalance"<br/>
                    nome: "New Balance 990 Cinza"<br/>
                    → Aparece em: New Balance (todos)
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <strong>Nike Dunk SB Low</strong><br/>
                    marca: "Nike"<br/>
                    categoria: "dunk-sb"<br/>
                    nome: "Nike Dunk SB Low Branco"<br/>
                    → Aparece em: Dunk SB
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-blue-900 mb-2">3. Categorias Simplificadas:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <strong>Nike & Adidas</strong><br/>
                    categoria: nome do modelo<br/>
                    ex: "air-force-1-low", "samba"
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <strong>New Balance</strong><br/>
                    categoria: "newbalance"<br/>
                    → Todos os modelos juntos
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-blue-900 mb-2">4. URLs das Categorias:</h4>
                <p className="text-sm text-blue-800">Todas as categorias têm URLs próprias:</p>
                <code className="text-xs bg-blue-100 px-2 py-1 rounded block mt-1">
                  /catalogo/[categoria] → ex: /catalogo/air-force-1-low
                </code>
              </div>

              <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Importante:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Use sempre a primeira letra maiúscula nas marcas</li>
                  <li>• Teste sempre se o produto aparece na categoria correta</li>
                  <li>• Consulte o guia completo em: <code className="bg-yellow-100 px-1 rounded">docs/guia-categorias-completo.md</code></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
