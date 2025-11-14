import { Truck, Clock, AlertCircle, MapPin, Package, Euro } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Envios e Entregas | fanzone12.pt",
  description: "Informações sobre envios, prazos de entrega e custos de envio da loja fanzone12.pt.",
}

export default function EnviosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50/30">
      {/* Modern Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-effect rounded-3xl p-8 sm:p-12 animate-fade-in">
            <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-6">
              <Truck className="w-4 h-4 mr-2" />
              Logística
            </Badge>
            
            <h1 className="text-responsive-xl text-gray-900 mb-6 leading-tight">
              Envios e <span className="gradient-text-cool">Entregas</span>
            </h1>
            
            <p className="text-responsive-md text-black max-w-2xl mx-auto leading-relaxed" style={{color: 'black'}}>
              Na fanzone12.pt, trabalhamos com os melhores parceiros de logística para garantir que as suas encomendas de camisolas e sneakers cheguem rapidamente e em perfeitas condições.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Content Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* Shipping Methods & Delivery Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Métodos de Envio</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-black mb-4">Trabalhamos com os seguintes parceiros de entrega:</p>
                  <div className="space-y-3">
                    {[
                      { name: "CTT", color: "from-blue-500 to-blue-600" },
                      { name: "CTT Expresso", color: "from-green-500 to-green-600" },
                      { name: "DHL", color: "from-yellow-500 to-orange-500" },
                      { name: "UPS", color: "from-amber-600 to-yellow-600" }
                    ].map((partner, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 bg-gradient-to-r ${partner.color} rounded-full`}></div>
                        <span className="font-medium text-gray-700">{partner.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Prazos de Entrega</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-black mb-4">Os prazos estimados de entrega são:</p>
                  <div className="space-y-3">
                    {[
                      { location: "Portugal Continental", time: "7-12 dias úteis", color: "bg-green-50 text-green-700 border-green-200" },
                      { location: "Ilhas (Madeira e Açores)", time: "10-15 dias úteis", color: "bg-blue-50 text-blue-700 border-blue-200" },
                      { location: "Europa", time: "5-10 dias úteis", color: "bg-purple-50 text-purple-700 border-purple-200" },
                      { location: "Resto do Mundo", time: "10-15 dias úteis", color: "bg-orange-50 text-orange-700 border-orange-200" }
                    ].map((item, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${item.color}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.location}</span>
                          <span className="text-sm font-semibold">{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Costs */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                  <Euro className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Custos de Envio</h2>
              </div>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Destino</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantidade</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Custo de Envio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">Portugal (Continental e Ilhas)</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Até 2 produtos</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          3,99€
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">Portugal (Continental e Ilhas)</td>
                      <td className="px-6 py-4 text-sm text-gray-700">3 produtos ou mais OU 68€+</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Grátis
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">Internacional</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Qualquer quantidade</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          Sob consulta
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">Portugal (Continental e Ilhas)</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      3,99€
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Até 2 produtos</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">Portugal (Continental e Ilhas)</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Grátis
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">3 produtos ou mais OU 68€+</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">Internacional</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                      Sob consulta
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Qualquer quantidade</p>
                </div>
              </div>
            </div>

            {/* Order Tracking */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-teal-500 to-green-500 p-3 rounded-full">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Rastreamento de Encomendas</h2>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-xl border border-teal-200">
                <p className="text-gray-700 leading-relaxed">
                  Após a expedição da sua encomenda, receberá um email com o código de rastreio e instruções sobre como acompanhar o estado da entrega. Também pode verificar o estado da sua encomenda na sua área de cliente, na secção "As Minhas Encomendas".
                </p>
              </div>
            </div>

            {/* Important Information */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Informações Importantes</h2>
              </div>
              <div className="space-y-6">
                {[
                  {
                    title: "Horário de entregas",
                    content: "As entregas são realizadas em dias úteis, entre as 9h e as 18h. Não são efetuadas entregas aos fins de semana ou feriados nacionais.",
                    color: "from-blue-50 to-cyan-50 border-blue-200"
                  },
                  {
                    title: "Morada de entrega",
                    content: "É responsabilidade do cliente fornecer uma morada de entrega correta e completa. Encomendas devolvidas devido a informações incorretas poderão estar sujeitas a custos adicionais de reenvio.",
                    color: "from-purple-50 to-violet-50 border-purple-200"
                  },
                  {
                    title: "Envio gratuito",
                    content: "O envio gratuito aplica-se a encomendas com 3 ou mais produtos OU valor acima de 68€ para Portugal Continental e Ilhas. Para outras regiões, os custos de envio serão calculados no checkout.",
                    color: "from-green-50 to-emerald-50 border-green-200"
                  },
                  {
                    title: "Atrasos na entrega",
                    content: "Em períodos de grande volume de encomendas (ex: Black Friday, Natal) ou devido a condições meteorológicas adversas, poderão ocorrer atrasos nas entregas. Faremos o possível para minimizar qualquer inconveniente.",
                    color: "from-orange-50 to-red-50 border-orange-200"
                  }
                ].map((item, index) => (
                  <div key={index} className={`bg-gradient-to-br ${item.color} p-6 rounded-xl border`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment on Delivery Section */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                  <Euro className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Pagamento à Cobrança</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Oferecemos a opção de pagamento à cobrança para maior segurança e flexibilidade:
                </p>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-3">💰 Como funciona:</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>8€ pagos antecipadamente</strong> (taxa de garantia para assegurar a encomenda)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Restante pago na entrega</strong> (quando receber o produto)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Mais seguro:</strong> só paga o restante quando receber o produto</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3">🎯 Vantagens:</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Ideal para compras de valor elevado</li>
                    <li>• Sem necessidade de cartão para o restante</li>
                    <li>• Garantia de que o produto chega antes de pagar tudo</li>
                    <li>• Maior segurança na compra</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="glass-effect rounded-2xl p-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Contacto</h2>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Se tiver alguma dúvida sobre o envio da sua encomenda, por favor contacte o nosso serviço de apoio ao cliente:
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-emerald-800">geral@fanzone12.pt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
