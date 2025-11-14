import { Shield, Lock, Eye, Users, Database, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Política de Privacidade | fanzone12.pt",
  description: "Política de privacidade e proteção de dados da loja online fanzone12.pt.",
}

export default function PrivacidadePage() {
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
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Proteção de Dados
            </Badge>
            
            <h1 className="text-responsive-xl text-gray-900 mb-6 leading-tight">
              Política de <span className="gradient-text-cool">Privacidade</span>
            </h1>
            
            <p className="text-responsive-md text-black max-w-2xl mx-auto leading-relaxed" style={{color: 'black'}}>
              A fanzone12.pt está empenhada em proteger a sua privacidade. Esta Política de Privacidade explica como recolhemos, utilizamos e protegemos as suas informações pessoais na nossa loja de camisolas e sneakers.
              </p>
            </div>
            </div>
          </section>

      {/* Modern Content Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* Section 1 - Information Collection */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Informações que Recolhemos</h2>
              </div>
              <div className="space-y-6 text-black leading-relaxed">
                <p>Podemos recolher os seguintes tipos de informações:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Informações Pessoais</h3>
                    </div>
                    <p className="text-sm text-blue-700">Nome, endereço de email, morada de entrega e faturação, e dados de pagamento.</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Eye className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Informações de Utilização</h3>
                    </div>
                    <p className="text-sm text-green-700">Como interage com o nosso website, incluindo páginas visitadas e produtos visualizados.</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-900">Informações do Dispositivo</h3>
                    </div>
                    <p className="text-sm text-purple-700">Tipo de dispositivo, sistema operativo, tipo de navegador e endereço IP.</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Lock className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-900">Cookies e Tecnologias</h3>
                    </div>
                    <p className="text-sm text-orange-700">Informações recolhidas através de cookies, web beacons e tecnologias semelhantes.</p>
                  </div>
            </div>

                <p className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <strong className="text-blue-900">Nota:</strong> Recolhemos estas informações quando cria uma conta, faz uma compra, subscreve a nossa newsletter, participa em promoções ou inquéritos, ou comunica connosco.
              </p>
            </div>
            </div>

            {/* Continue with remaining sections using the same modern pattern */}
            {[
              {
                title: "2. Como Utilizamos as Suas Informações",
                icon: <Shield className="h-6 w-6 text-white" />,
                gradient: "from-green-500 to-emerald-500",
                content: (
                  <div className="space-y-4">
                    <p>Utilizamos as suas informações para:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Processar e entregar as suas encomendas",
                        "Gerir a sua conta e fornecer suporte ao cliente",
                        "Enviar comunicações sobre os seus pedidos",
                        "Enviar newsletters e materiais promocionais",
                        "Personalizar a sua experiência",
                        "Melhorar o nosso website e serviços",
                        "Prevenir fraudes e garantir segurança",
                        "Cumprir obrigações legais"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <strong className="text-green-900">Base Legal:</strong> Processamos os seus dados pessoais apenas quando temos uma base legal para o fazer, como o seu consentimento, a execução de um contrato, o cumprimento de obrigações legais ou os nossos interesses legítimos.
              </p>
            </div>
                )
              },
              {
                title: "3. Partilha de Informações",
                icon: <Users className="h-6 w-6 text-white" />,
                gradient: "from-purple-500 to-violet-500",
                content: (
                  <div className="space-y-4">
                    <p>Não vendemos ou alugamos as suas informações pessoais a terceiros. Podemos partilhar as suas informações com:</p>
                    <div className="space-y-3">
                      {[
                        { title: "Prestadores de Serviços", desc: "Que nos ajudam a operar o nosso negócio (processamento de pagamentos, entregas, etc.)" },
                        { title: "Parceiros de Marketing", desc: "Apenas se tiver consentido em receber comunicações de marketing" },
                        { title: "Autoridades Legais", desc: "Quando exigido por lei ou para proteger os nossos direitos" }
                      ].map((item, index) => (
                        <div key={index} className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-purple-700">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              },
              {
                title: "4. Cookies e Tecnologias Semelhantes",
                icon: <Lock className="h-6 w-6 text-white" />,
                gradient: "from-orange-500 to-red-500",
                content: (
                  <p>Utilizamos cookies e tecnologias semelhantes para melhorar a sua experiência no nosso website, analisar como os utilizadores navegam e personalizar o conteúdo. Pode gerir as suas preferências de cookies através das definições do seu navegador.</p>
                )
              },
              {
                title: "5. Segurança de Dados",
                icon: <Shield className="h-6 w-6 text-white" />,
                gradient: "from-red-500 to-pink-500",
                content: (
                  <div className="space-y-4">
                    <p>Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger as suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { icon: <Lock className="h-5 w-5" />, title: "Encriptação", color: "text-red-600 bg-red-50" },
                        { icon: <Shield className="h-5 w-5" />, title: "Proteção", color: "text-red-600 bg-red-50" },
                        { icon: <AlertTriangle className="h-5 w-5" />, title: "Monitorização", color: "text-red-600 bg-red-50" }
                      ].map((item, index) => (
                        <div key={index} className={`${item.color} p-4 rounded-lg text-center`}>
                          <div className="flex justify-center mb-2">{item.icon}</div>
                          <span className="font-medium text-sm">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              },
              {
                title: "6. Retenção de Dados",
                icon: <Database className="h-6 w-6 text-white" />,
                gradient: "from-indigo-500 to-purple-500",
                content: (
                  <p>Mantemos as suas informações pessoais apenas pelo tempo necessário para cumprir os fins para os quais foram recolhidas, incluindo para satisfazer requisitos legais, contabilísticos ou de relatórios.</p>
                )
              },
              {
                title: "7. Os Seus Direitos",
                icon: <Users className="h-6 w-6 text-white" />,
                gradient: "from-teal-500 to-green-500",
                content: (
                  <div className="space-y-4">
              <p>De acordo com o Regulamento Geral de Proteção de Dados (RGPD), tem os seguintes direitos:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Direito de acesso às suas informações pessoais",
                        "Direito de retificação de dados incorretos",
                        "Direito ao apagamento dos seus dados",
                        "Direito à limitação do tratamento",
                        "Direito à portabilidade dos dados",
                        "Direito de oposição ao tratamento",
                        "Direito de retirar o consentimento"
                      ].map((right, index) => (
                        <div key={index} className="flex items-center gap-2 bg-teal-50 p-3 rounded-lg">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span className="text-sm text-teal-700">{right}</span>
                        </div>
                      ))}
                    </div>
                    <p className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
                      <strong className="text-teal-900">Para exercer os seus direitos:</strong> Contacte-nos através do email privacidade@fanzone12.pt.
              </p>
            </div>
                )
              },
              {
                title: "8. Alterações a Esta Política",
                icon: <Eye className="h-6 w-6 text-white" />,
                gradient: "from-violet-500 to-purple-500",
                content: (
                  <p>Podemos atualizar esta Política de Privacidade periodicamente. Quaisquer alterações serão publicadas nesta página com uma data de atualização revista. Recomendamos que consulte regularmente esta política para se manter informado sobre como protegemos as suas informações.</p>
                )
              },
              {
                title: "9. Contacto",
                icon: <Shield className="h-6 w-6 text-white" />,
                gradient: "from-emerald-500 to-teal-500",
                content: (
                  <div className="space-y-4">
                    <p>Se tiver alguma dúvida sobre esta Política de Privacidade ou sobre as nossas práticas de proteção de dados, por favor contacte-nos:</p>
                    <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-full">
                          <Shield className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-emerald-900 mb-1">Email de Privacidade</h3>
                          <p className="text-emerald-700">privacidade@fanzone12.pt</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            ].map((section, index) => (
              <div key={index} className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`bg-gradient-to-r ${section.gradient} p-3 rounded-full`}>
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <div className="text-black leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="glass-effect rounded-2xl p-8 text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full">
                <Shield className="w-4 h-4 text-black" />
                <span className="text-sm text-black font-medium">Última atualização: 21 de Maio de 2025</span>
            </div>
            </div>
        </div>
        </div>
      </section>
    </div>
  )
}
