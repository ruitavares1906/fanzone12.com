import { Truck, CreditCard, Star, MessageCircle } from "lucide-react"

export function StaticInfoSections() {
  return (
    <>
      {/* Seção de Vantagens - Porquê Escolher a Fanzone12? */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              Why Choose Fanzone12?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Quality, speed and unique customization for true fans
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Fast Delivery</h3>
              <p className="text-xs sm:text-sm text-gray-600">Shipping in 7-12 business days across Europe</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Secure Payment</h3>
              <p className="text-xs sm:text-sm text-gray-600">Multiple secure payment options</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-center">
              <div className="bg-yellow-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Star className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Guaranteed Quality</h3>
              <p className="text-xs sm:text-sm text-gray-600">Official products and premium materials</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">24/7 Support</h3>
              <p className="text-xs sm:text-sm text-gray-600">WhatsApp and email always available</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
