import { RotateCcw, Package, CreditCard, AlertTriangle, Clock, RefreshCw } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Devoluções e Trocas | fanzone12.pt",
  description: "Política de devoluções e trocas da loja fanzone12.pt. Saiba como devolver ou trocar os seus produtos.",
}

export default function DevolucoesPage() {
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
            <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-6">
              <RotateCcw className="w-4 h-4 mr-2" />
              Política de Devoluções
            </Badge>
            
            <h1 className="text-responsive-xl text-gray-900 mb-6 leading-tight">
              Devoluções e <span className="gradient-text-cool">Trocas</span>
            </h1>
            
            <p className="text-responsive-md text-black max-w-2xl mx-auto leading-relaxed" style={{color: 'black'}}>
              Na fanzone12.pt, queremos garantir a sua total satisfação com os nossos produtos de camisolas e sneakers. Oferecemos uma política de devoluções e trocas simples e transparente.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Content Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 text-center animate-slide-up">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Prazo de Devolução</h3>
                <p className="text-black">30 dias a partir da data de receção da encomenda</p>
              </div>

              <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 text-center animate-slide-up">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Condição do Produto</h3>
                <p className="text-black">Produto não usado, com etiquetas originais e embalagem</p>
              </div>

              <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 text-center animate-slide-up">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Reembolso</h3>
                <p className="text-black">Processado em 5-10 dias úteis após receção da devolução</p>
              </div>
            </div>

            {/* Return Process */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-r from-teal-500 to-green-500 p-3 rounded-full">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Processo de Devolução</h2>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Solicitar a Devolução",
                    content: "Para iniciar uma devolução, aceda à sua conta, secção \"As Minhas Encomendas\", e selecione a opção \"Devolver\". Alternativamente, pode contactar o nosso serviço de apoio ao cliente através do email geral@fanzone12.pt.",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    step: "2",
                    title: "Embalar o Produto",
                    content: "Coloque o produto na embalagem original ou numa embalagem adequada que proteja o artigo durante o transporte. Certifique-se de que o produto está nas mesmas condições em que o recebeu, com todas as etiquetas originais.",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    step: "3",
                    title: "Enviar o Produto",
                    content: "Após a aprovação da sua solicitação de devolução, receberá por email uma etiqueta de devolução pré-paga. Imprima a etiqueta, cole-a na embalagem e entregue num ponto de recolha CTT ou solicite a recolha na sua morada.",
                    color: "from-purple-500 to-violet-500"
                  },
                  {
                    step: "4",
                    title: "Reembolso ou Troca",
                    content: "Após recebermos e verificarmos o produto devolvido, processaremos o reembolso para o método de pagamento original ou enviaremos o produto de substituição, conforme a sua preferência.",
                    color: "from-orange-500 to-red-500"
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className={`bg-gradient-to-r ${item.color} p-3 rounded-full flex-shrink-0`}>
                        <span className="text-white font-bold text-lg">{item.step}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-black leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exchanges */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Trocas</h2>
              </div>
              <div className="space-y-4">
                <p className="text-black leading-relaxed">
                  Se desejar trocar um produto por outro tamanho, cor ou modelo, siga o mesmo processo de devolução, indicando que deseja uma troca em vez de um reembolso. Especifique o produto que deseja receber em substituição.
                </p>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-1">Nota Importante</h3>
                      <p className="text-amber-800 text-sm">
                        A disponibilidade do produto para troca está sujeita ao stock existente. Caso o produto desejado não esteja disponível, entraremos em contacto consigo para discutir alternativas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "Quem paga os custos de envio da devolução?",
                    answer: "Para devoluções devido a erro nosso (produto errado, defeituoso ou danificado), os custos de envio são suportados pela fanzone12.pt. Para devoluções por outros motivos (mudança de ideias, tamanho incorreto, etc.), o cliente é responsável pelos custos de envio, a menos que a compra original tenha sido superior a 100€."
                  },
                  {
                    question: "Quanto tempo demora o reembolso?",
                    answer: "Após recebermos e verificarmos o produto devolvido, o reembolso é processado em 2-3 dias úteis. O tempo para o valor aparecer na sua conta bancária depende da sua instituição financeira, podendo levar entre 5-10 dias úteis."
                  },
                  {
                    question: "Posso devolver produtos personalizados?",
                    answer: "Produtos personalizados (com nome, número ou emblema personalizado) não são elegíveis para devolução ou troca, exceto em caso de defeito de fabrico. Recomendamos verificar cuidadosamente os detalhes da personalização antes de finalizar a compra."
                  },
                  {
                    question: "O que fazer se receber um produto danificado?",
                    answer: "Se receber um produto danificado ou defeituoso, contacte-nos no prazo de 48 horas após a receção. Envie fotos do produto e da embalagem para geral@fanzone12.pt. Trataremos da substituição ou reembolso imediatamente, sem custos adicionais."
                  }
                ].map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-t-xl text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-black leading-relaxed">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Exclusions */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Exclusões</h2>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-3">Produtos não elegíveis para devolução ou troca:</h3>
                    <ul className="space-y-2 text-sm text-red-800">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Produtos personalizados (com nome, número ou emblema personalizado)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Produtos com desconto superior a 50%, devidamente identificados como "Sem Troca/Devolução"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Produtos sem etiquetas originais ou danificados pelo cliente</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Produtos de higiene íntima, por razões de saúde e higiene</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="glass-effect rounded-2xl p-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-full">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Contacto</h2>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Se tiver alguma dúvida sobre devoluções ou trocas, por favor contacte o nosso serviço de apoio ao cliente:
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
