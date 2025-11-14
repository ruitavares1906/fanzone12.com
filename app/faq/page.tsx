import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, HelpCircle, Package, CreditCard, Truck, RotateCcw, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Perguntas Frequentes | fanzone12.pt",
  description:
    "Encontre respostas para as perguntas mais frequentes sobre a loja fanzone12.pt, produtos, envios e devoluções.",
}

export default function FAQPage() {
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
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-4 h-4 mr-2" />
              Centro de Ajuda
            </Badge>
            
            <h1 className="text-responsive-xl text-gray-900 mb-6 leading-tight">
              Perguntas <span className="gradient-text-cool">Frequentes</span>
            </h1>
            
            <p className="text-responsive-md text-black max-w-2xl mx-auto leading-relaxed mb-8" style={{color: 'black'}}>
              Encontre respostas para as perguntas mais comuns sobre os nossos produtos, envios, devoluções e muito mais.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Pesquisar nas perguntas frequentes..." 
                className="pl-12 py-3 rounded-full border-2 border-gray-200 focus:border-blue-400 bg-white/80 backdrop-blur-sm" 
              />
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { href: "#produtos", icon: Package, label: "Produtos", color: "from-blue-500 to-cyan-500" },
                { href: "#encomendas", icon: CreditCard, label: "Pagamentos", color: "from-green-500 to-emerald-500" },
                { href: "#envios", icon: Truck, label: "Envios", color: "from-purple-500 to-violet-500" },
                { href: "#devolucoes", icon: RotateCcw, label: "Devoluções", color: "from-orange-500 to-red-500" }
              ].map((item, index) => (
                <Button key={index} variant="outline" className="h-auto p-4 glass-effect border-0 hover:shadow-lg transition-all duration-300" asChild>
                  <Link href={item.href} className="flex flex-col items-center gap-2">
                    <div className={`bg-gradient-to-r ${item.color} p-2 rounded-full`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modern Content Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* Products Section */}
            <section id="produtos" className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Produtos e Tamanhos</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "As camisolas são oficiais e autênticas?",
                    answer: "Sim, todas as camisolas vendidas na nossa loja são produtos oficiais e autênticos, adquiridos diretamente dos fabricantes ou distribuidores autorizados. Cada produto vem com as etiquetas originais e garantia de autenticidade."
                  },
                  {
                    question: "Como escolher o tamanho correto?",
                    answer: "Recomendamos consultar a tabela de tamanhos disponível na página de cada produto. As camisolas de futebol geralmente têm um corte mais justo, por isso, se preferir um ajuste mais folgado, considere escolher um tamanho acima do habitual. Em caso de dúvida, contacte o nosso serviço de apoio ao cliente."
                  },
                  {
                    question: "Posso personalizar qualquer camisola?",
                    answer: "Sim, oferecemos serviço de personalização para a maioria das camisolas. Pode adicionar nome, número e, em alguns casos, emblemas. Na página do produto, selecione a opção \"Personalizar\" e siga as instruções. Note que produtos personalizados têm um prazo de entrega ligeiramente maior (1-2 dias adicionais) e não são elegíveis para devolução, exceto em caso de defeito."
                  },
                  {
                    question: "Os sneakers são originais?",
                    answer: "Sim, todos os sneakers vendidos na nossa loja são produtos originais das marcas Nike, Adidas e outras marcas premium. Cada par vem com as etiquetas originais, caixa autêntica e garantia de autenticidade. Trabalhamos diretamente com distribuidores autorizados para garantir a qualidade dos nossos produtos."
                  },
                  {
                    question: "Como escolher o tamanho correto para sneakers?",
                    answer: "Para sneakers, recomendamos escolher o seu tamanho habitual. Os sneakers têm um ajuste padrão, diferente das camisolas. Se tiver dúvidas sobre o tamanho, pode consultar a tabela de medidas ou contactar o nosso serviço de apoio ao cliente. Oferecemos tamanhos de 36 a 45, incluindo meios tamanhos para maior precisão."
                  },
                  {
                    question: "Qual é a diferença entre as versões \"adepto\" e \"Jogador\"?",
                    answer: "A versão \"adepto\" (ou \"Fan\") é a camisola padrão, feita para os adeptos, com um ajuste mais confortável e preço mais acessível. A versão \"Jogador\" (ou \"Pro\") é idêntica à usada pelos jogadores em campo, com tecnologia avançada, material mais leve e ajuste mais justo. A versão \"Jogador\" geralmente tem um preço mais elevado devido às suas características premium."
                  },
                  {
                    question: "Como cuidar das camisolas para manter a qualidade?",
                    answer: (
                      <div>
                        <p className="mb-3">Para preservar a qualidade das camisolas, recomendamos:</p>
                        <ul className="space-y-2">
                          {[
                            "Lavar à máquina a 30°C, no ciclo para roupas delicadas",
                            "Virar a camisola do avesso antes de lavar",
                            "Não usar lixívia ou amaciador",
                            "Não secar na máquina",
                            "Passar a ferro a baixa temperatura, evitando estampas e emblemas",
                            "Não limpar a seco"
                          ].map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  }
                ].map((item, index) => (
                  <AccordionItem key={index} value={`produtos-${index}`} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-t-xl text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="text-black leading-relaxed">{item.answer}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Orders Section */}
            <section id="encomendas" className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Encomendas e Pagamentos</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "Quais são os métodos de pagamento aceites?",
                    answer: (
                      <div>
                        <p className="mb-3">Aceitamos os seguintes métodos de pagamento:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          {[
                            "Cartão de crédito/débito (Visa, Mastercard, American Express)",
                            "Referência Multibanco",
                            "PayPal",
                            "Klarna",
                            "Pagamento à Cobrança (+8€)"
                          ].map((method, index) => (
                            <div key={index} className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm">{method}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg mb-3">
                          <h4 className="font-semibold text-blue-800 mb-2">💰 Pagamento à Cobrança:</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• <strong>8€ pagos antecipadamente</strong> (taxa de garantia)</li>
                            <li>• <strong>Restante pago na entrega</strong> (quando receber)</li>
                            <li>• <strong>Mais seguro:</strong> só paga o restante quando receber o produto</li>
                          </ul>
                        </div>
                        <p className="text-sm bg-green-50 p-3 rounded-lg">
                          Todos os pagamentos são processados de forma segura através de ligações encriptadas.
                        </p>
                      </div>
                    )
                  },
                  {
                    question: "Como funciona o pagamento à cobrança?",
                    answer: (
                      <div>
                        <p className="mb-3">O pagamento à cobrança oferece maior segurança e flexibilidade:</p>
                        <div className="space-y-3">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">✅ Como funciona:</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• <strong>8€ pagos agora</strong> (taxa de garantia para assegurar a encomenda)</li>
                              <li>• <strong>Restante pago na entrega</strong> (quando receber o produto)</li>
                              <li>• <strong>Sem cartão necessário</strong> para o restante valor</li>
                            </ul>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">🎯 Vantagens:</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>• Mais seguro: só paga o restante quando receber</li>
                              <li>• Ideal para compras de valor elevado</li>
                              <li>• Sem necessidade de cartão para o restante</li>
                              <li>• Garantia de que o produto chega antes de pagar tudo</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )
                  },
                  {
                    question: "Preciso criar uma conta para fazer uma compra?",
                    answer: "Não é obrigatório criar uma conta para fazer uma compra, oferecemos a opção de checkout como convidado. No entanto, criar uma conta permite-lhe acompanhar as suas encomendas, guardar endereços de entrega, aceder ao histórico de compras e beneficiar de promoções exclusivas para membros."
                  },
                  {
                    question: "Como posso acompanhar a minha encomenda?",
                    answer: "Após a expedição da sua encomenda, receberá um email com o código de rastreio e instruções sobre como acompanhar o estado da entrega. Se tiver uma conta, também pode verificar o estado da sua encomenda na secção \"As Minhas Encomendas\" da sua área de cliente."
                  },
                  {
                    question: "Posso alterar ou cancelar a minha encomenda?",
                    answer: "Pode alterar ou cancelar a sua encomenda apenas se ainda não tiver sido processada. Para isso, contacte-nos imediatamente através do email geral@fanzone12.pt. Se a encomenda já tiver sido processada ou expedida, não será possível cancelá-la, mas poderá devolvê-la após a receção, de acordo com a nossa política de devoluções."
                  },
                  {
                    question: "Os preços incluem IVA?",
                    answer: "Sim, todos os preços apresentados no nosso website incluem IVA à taxa legal em vigor (23%). A fatura com discriminação do IVA será enviada por email após a conclusão da compra e também estará disponível na sua área de cliente."
                  }
                ].map((item, index) => (
                  <AccordionItem key={index} value={`encomendas-${index}`} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-t-xl text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="text-black leading-relaxed">{item.answer}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Shipping Section */}
            <section id="envios" className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-3 rounded-full">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Envios e Entregas</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "Quais são os prazos de entrega?",
                    answer: (
                      <div>
                        <p className="mb-3">Os prazos estimados de entrega são:</p>
                        <div className="space-y-2 mb-3">
                          {[
                            { location: "Portugal Continental", time: "7-12 dias úteis" },
                            { location: "Ilhas (Madeira e Açores)", time: "10-15 dias úteis" },
                            { location: "Europa", time: "5-10 dias úteis" },
                            { location: "Resto do Mundo", time: "10-15 dias úteis" }
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
                              <span className="font-medium">{item.location}</span>
                              <span className="text-sm bg-purple-100 px-2 py-1 rounded">{item.time}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm bg-purple-50 p-3 rounded-lg">
                          Estes prazos são contados a partir da confirmação do pagamento. Produtos personalizados podem ter 1-2 dias adicionais de processamento.
                        </p>
                      </div>
                    )
                  }
                ].map((item, index) => (
                  <AccordionItem key={index} value={`envios-${index}`} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-t-xl text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="text-black leading-relaxed">{item.answer}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Contact Section */}
            <div className="glass-effect rounded-2xl p-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Ainda tem dúvidas?</h2>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Se não encontrou a resposta que procurava, não hesite em contactar-nos. A nossa equipa de apoio ao cliente está sempre disponível para ajudar.
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-emerald-600" />
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
