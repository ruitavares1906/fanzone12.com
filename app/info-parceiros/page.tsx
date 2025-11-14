import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, TrendingUp, Gift, Shield, Star, Mail, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function InfoParceirosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-4">
            <Users className="w-4 h-4 mr-2" />
            Programa de Parceiros
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Junte-se à Nossa Rede de Parceiros
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforme a sua paixão pelo futebol numa oportunidade de negócio lucrativa. 
            Seja um parceiro oficial da Fanzone12 e ganhe comissões atrativas.
          </p>
        </div>

        {/* Vantagens Principais */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="modern-card shadow-modern hover:shadow-modern-hover transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Comissões Atrativas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
               <p className="text-gray-600">
                 Ganhe 10% de comissão em cada venda realizada através do seu código único. 
                 Pagamentos semanais automáticos!
               </p>
            </CardContent>
          </Card>

          <Card className="modern-card shadow-modern hover:shadow-modern-hover transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Gift className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Bónus e Prémios</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acesso a produtos exclusivos, descontos especiais e prémios mensais 
                para os melhores parceiros.
              </p>
            </CardContent>
          </Card>

          <Card className="modern-card shadow-modern hover:shadow-modern-hover transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Suporte Total</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Equipa dedicada para apoiar o seu sucesso. Materiais promocionais, 
                treino e acompanhamento personalizado.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Como Funciona */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Como Funciona o Programa
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Inscreva-se",
                description: "Preencha o formulário e aguarde aprovação em 24h",
                icon: "📝"
              },
              {
                step: "2", 
                title: "Receba o Seu Link",
                description: "Obtenha o seu link único de afiliado personalizado",
                icon: "🔗"
              },
              {
                step: "3",
                title: "Promova Produtos",
                description: "Partilhe produtos nas suas redes sociais e grupos",
                icon: "📱"
              },
              {
                step: "4",
                title: "Ganhe Comissões",
                description: "Receba pagamentos semanais das suas vendas",
                icon: "💰"
              }
            ].map((item, index) => (
              <Card key={index} className="modern-card shadow-modern hover:shadow-modern-hover transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Requisitos */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Requisitos para Ser Parceiro
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="modern-card shadow-modern">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Obrigatórios</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-3">
                   <li className="flex items-start space-x-2">
                     <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                     <span>Mínimo 5.000 seguidores no TikTok ou Instagram</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                     <span>Engajamento ativo nas redes sociais</span>
                   </li>
                 </ul>
              </CardContent>
            </Card>

          </div>
        </div>

         {/* Comissões */}
         <div className="mb-16">
           <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
             Como Funcionam as Comissões
           </h2>
           <div className="grid md:grid-cols-2 gap-8">
             <Card className="modern-card shadow-modern">
               <CardHeader>
                 <CardTitle className="flex items-center space-x-2">
                   <TrendingUp className="h-5 w-5 text-green-600" />
                   <span>Comissão Fixa</span>
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-center mb-6">
                   <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                     10%
                   </div>
                   <p className="text-gray-600">
                     Comissão fixa de 10% sobre todas as vendas realizadas com o seu código
                   </p>
                 </div>
               </CardContent>
             </Card>

             <Card className="modern-card shadow-modern">
               <CardHeader>
                 <CardTitle className="flex items-center space-x-2">
                   <Gift className="h-5 w-5 text-blue-600" />
                   <span>Pagamentos</span>
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <ul className="space-y-3">
                   <li className="flex items-start space-x-2">
                     <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                     <span>Pagamentos semanais automáticos</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                     <span>MB WAY ou Transferência Bancária</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                     <span>Baseado em encomendas pagas</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                     <span>Ranking mensal com prémios</span>
                   </li>
                 </ul>
               </CardContent>
             </Card>
           </div>
         </div>

         {/* Contacto */}
         <div className="mb-16">
           <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
             Contacte-nos
           </h2>
           <div className="grid md:grid-cols-2 gap-8">
             <Card className="modern-card shadow-modern text-center">
               <CardHeader>
                 <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto">
                   <Mail className="h-6 w-6 text-blue-600" />
                 </div>
                 <CardTitle>Email</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-gray-600">geral@fanzone12.pt</p>
               </CardContent>
             </Card>

             <Card className="modern-card shadow-modern text-center">
               <CardHeader>
                 <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
                   <MessageCircle className="h-6 w-6 text-green-600" />
                 </div>
                 <CardTitle>WhatsApp</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-gray-600 mb-4">+351 934 244 455</p>
                 <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                   <a 
                     href="https://wa.me/351934244455" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center space-x-2"
                   >
                     <MessageCircle className="h-4 w-4" />
                     <span>Enviar Mensagem</span>
                   </a>
                 </Button>
               </CardContent>
             </Card>
           </div>
         </div>

        {/* CTA Final */}
        <div className="text-center">
          <Card className="modern-card shadow-modern bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Pronto para Começar?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Junte-se a centenas de parceiros que já estão a ganhar com a Fanzone12. 
                O processo de candidatura é simples e rápido.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="modern-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full">
                  <Link href="/candidatura-parceiro">
                    Candidatar-se Agora
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="modern-button border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full">
                  <Link href="/contacto">
                    Saber Mais
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
