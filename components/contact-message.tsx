import { Button } from "@/components/ui/button"
import { Search, MessageCircle } from "lucide-react"
import Link from "next/link"

export function ContactMessage() {
  return (
    <div className="mt-8 sm:mt-12">
      <div className="glass-effect rounded-2xl p-6 sm:p-8 shadow-modern text-center">
        <div className="mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
            Não encontrou a camisola que procura?
          </h3>
          <p className="text-gray-600 mb-6">
            Temos um catálogo completo com mais de <span className="font-bold text-blue-600">5000 camisolas</span> que não estão aqui publicadas!
          </p>
        </div>
        
        <Button asChild className="modern-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg px-8 py-3 text-lg rounded-full transition-all duration-300 hover:shadow-xl">
          <Link href="/contacto" className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Envie-nos uma mensagem
          </Link>
        </Button>
      </div>
    </div>
  )
}
