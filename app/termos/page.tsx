import Link from "next/link"
import { Shield, FileText, Scale, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Termos e Condições | fanzone12.pt",
  description: "Termos e condições de utilização da loja online fanzone12.pt.",
}

export default function TermosPage() {
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
              <FileText className="w-4 h-4 mr-2" />
              Informações Legais
            </Badge>
            
            <h1 className="text-responsive-xl text-gray-900 mb-6 leading-tight">
              Termos e <span className="gradient-text-cool">Condições</span>
            </h1>
            
            <p className="text-responsive-md text-black max-w-2xl mx-auto leading-relaxed" style={{color: 'black'}}>
              Bem-vindo aos Termos e Condições da fanzone12.pt. Estes termos regem a utilização do nosso website e os serviços oferecidos pela nossa loja online de camisolas e sneakers.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Content Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* Section 1 */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Aceitação dos Termos</h2>
              </div>
              <div className="space-y-4 text-black leading-relaxed">
                <p>
                  Ao aceder e utilizar o nosso website, o utilizador concorda em cumprir e ficar vinculado aos presentes Termos e Condições.
                </p>
                <p>
                  A utilização contínua dos nossos serviços após a publicação de quaisquer alterações aos Termos constitui a sua aceitação dessas alterações.
                </p>
                <p>Se não concordar com algum dos termos, pedimos que não utilize o nosso website ou serviços.</p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Alterações aos Termos</h2>
              </div>
              <div className="space-y-4 text-black leading-relaxed">
                <p>
                  A fanzone12.pt reserva-se o direito de modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a sua publicação no website.
                </p>
                <p>
                  Faremos todos os esforços razoáveis para informar os utilizadores sobre alterações significativas, mas é responsabilidade do utilizador verificar periodicamente se existem atualizações.
                </p>
                <p>A continuação do uso do site após as alterações constitui a aceitação dos novos termos.</p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Conta de Utilizador</h2>
              </div>
              <div className="space-y-4 text-black leading-relaxed">
                <p>
                  Para efetuar compras no nosso website, poderá ser necessário criar uma conta. O utilizador é responsável por manter a confidencialidade da sua conta e senha.
                </p>
                <p>
                  Deve restringir o acesso ao seu computador e outros dispositivos, e concorda em aceitar a responsabilidade por todas as atividades que ocorram na sua conta.
                </p>
                <p>
                  A fanzone12.pt reserva-se o direito de recusar o serviço, encerrar contas ou cancelar encomendas a seu critério.
                </p>
              </div>
            </div>

            {/* Continue with remaining sections... */}
            {[
              {
                title: "4. Produtos e Preços",
                icon: <Scale className="h-6 w-6 text-white" />,
                gradient: "from-purple-500 to-pink-500",
                content: [
                  "A fanzone12.pt esforça-se por apresentar descrições precisas dos produtos. No entanto, não garantimos que as descrições ou outros conteúdos do website sejam precisos, completos, fiáveis, atuais ou livres de erros.",
                  "As imagens dos produtos são ilustrativas e podem variar ligeiramente do produto real, especialmente em termos de cor, dependendo do dispositivo utilizado para visualização.",
                  "Os preços dos produtos estão sujeitos a alterações sem aviso prévio. Reservamo-nos o direito de descontinuar qualquer produto a qualquer momento.",
                  "Todos os preços incluem IVA à taxa legal em vigor, salvo indicação em contrário."
                ]
              },
              {
                title: "5. Encomendas e Pagamentos",
                icon: <FileText className="h-6 w-6 text-white" />,
                gradient: "from-blue-500 to-cyan-500",
                content: [
                  "Ao efetuar uma encomenda, o utilizador oferece-se para comprar o produto nas condições especificadas. A aceitação da encomenda está sujeita à disponibilidade do produto e à validação dos dados de pagamento.",
                  "Aceitamos várias formas de pagamento, incluindo cartões de crédito/débito, MB WAY, referência multibanco, PayPal e pagamento à cobrança. Todos os pagamentos são processados de forma segura.",
                  "Para pagamento à cobrança: taxa adicional de 8€ (paga antecipadamente) + restante pago na entrega. Esta opção oferece maior segurança ao cliente, que só paga o restante quando receber o produto."
                ]
              },
              {
                title: "6. Envios e Entregas",
                icon: <Shield className="h-6 w-6 text-white" />,
                gradient: "from-red-500 to-rose-500",
                content: [
                  <>
                    As informações sobre envios e entregas estão disponíveis na nossa página de{" "}
                    <Link href="/envios" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2">
                      Envios e Entregas
                    </Link>
                    . A fanzone12.pt não se responsabiliza por atrasos causados por circunstâncias fora do nosso controlo.
                  </>
                ]
              },
              {
                title: "7. Devoluções e Trocas",
                icon: <Users className="h-6 w-6 text-white" />,
                gradient: "from-teal-500 to-green-500",
                content: [
                  <>
                    A nossa política de devoluções e trocas está disponível na página de{" "}
                    <Link href="/devolucoes" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2">
                      Devoluções e Trocas
                    </Link>
                    . Todas as devoluções devem ser feitas de acordo com estas políticas.
                  </>
                ]
              },
              {
                title: "8. Propriedade Intelectual",
                icon: <Scale className="h-6 w-6 text-white" />,
                gradient: "from-indigo-500 to-purple-500",
                content: [
                  "Todo o conteúdo do website, incluindo textos, gráficos, logótipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade da fanzone12.pt ou dos seus fornecedores de conteúdo e está protegido por leis de direitos de autor portuguesas e internacionais."
                ]
              },
              {
                title: "9. Limitação de Responsabilidade",
                icon: <Shield className="h-6 w-6 text-white" />,
                gradient: "from-orange-500 to-red-500",
                content: [
                  "A fanzone12.pt não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos resultantes da utilização ou incapacidade de utilização dos nossos serviços ou produtos."
                ]
              },
              {
                title: "10. Lei Aplicável",
                icon: <FileText className="h-6 w-6 text-white" />,
                gradient: "from-violet-500 to-purple-500",
                content: [
                  "Estes Termos e Condições são regidos e interpretados de acordo com as leis de Portugal. Qualquer disputa relacionada com estes termos será sujeita à jurisdição exclusiva dos tribunais portugueses."
                ]
              },
              {
                title: "11. Contacto",
                icon: <Users className="h-6 w-6 text-white" />,
                gradient: "from-emerald-500 to-teal-500",
                content: [
                  <>
                    Se tiver alguma dúvida sobre estes Termos e Condições, por favor contacte-nos através do email geral@fanzone12.pt ou visite a nossa página de{" "}
                    <Link href="/contacto" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2">
                      Contacto
                    </Link>
                    .
                  </>
                ]
              }
            ].map((section, index) => (
              <div key={index} className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`bg-gradient-to-r ${section.gradient} p-3 rounded-full`}>
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <div className="space-y-4 text-black leading-relaxed">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="glass-effect rounded-2xl p-8 text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full">
                <FileText className="w-4 h-4 text-black" />
                <span className="text-sm text-black font-medium">Última atualização: 21 de Maio de 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
