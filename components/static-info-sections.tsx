import { Truck, CreditCard, Star, Clock, MessageCircle } from "lucide-react"

export function StaticInfoSections() {
  return (
    <>
      {/* Seção de Vantagens */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              Porquê Escolher a Fanzone12?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Qualidade, rapidez e personalização única para os verdadeiros fãs
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Entrega Rápida</h3>
              <p className="text-xs sm:text-sm text-gray-600">Envio em 7-12 dias úteis para toda a Europa</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Pagamento Seguro</h3>
              <p className="text-xs sm:text-sm text-gray-600">Múltiplas opções de pagamento seguro</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-center">
              <div className="bg-yellow-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Star className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Qualidade Garantida</h3>
              <p className="text-xs sm:text-sm text-gray-600">Produtos oficiais e materiais premium</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Suporte 24/7</h3>
              <p className="text-xs sm:text-sm text-gray-600">WhatsApp e email sempre disponíveis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Processo */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              Como Funciona
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Processo simples e rápido para obter a sua camisola personalizada
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gray-100 rounded-lg p-4 sm:p-6 shadow-sm text-center">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
                1
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Escolha o Produto</h3>
              <p className="text-sm sm:text-base text-gray-600">Navegue pelo nosso catálogo e selecione a camisola desejada</p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 sm:p-6 shadow-sm text-center">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
                2
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Personalize</h3>
              <p className="text-sm sm:text-base text-gray-600">Adicione nome, número e patches personalizados</p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 sm:p-6 shadow-sm text-center">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
                3
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Receba em Casa</h3>
              <p className="text-sm sm:text-base text-gray-600">Entrega rápida e segura na sua morada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Garantias */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              Nossas Garantias
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Compromisso com a qualidade e satisfação do cliente
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="bg-green-100 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mr-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Entrega Rápida</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600">Envio em 7-12 dias úteis para toda a Europa com tracking completo</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="bg-blue-100 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mr-3">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Qualidade Premium</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600">Materiais oficiais e personalização profissional</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="bg-purple-100 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mr-3">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Suporte Dedicado</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600">Acompanhamento personalizado via WhatsApp e email</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
