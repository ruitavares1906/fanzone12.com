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
            Partner Program
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Join Our Partner Network
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Turn your passion for football into a profitable business opportunity. 
            Become an official Fanzone12 partner and earn attractive commissions.
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
                <CardTitle className="text-xl">Attractive Commissions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
               <p className="text-gray-600">
                 Earn 10% commission on each sale made through your unique code. 
                 Automatic weekly payments!
               </p>
            </CardContent>
          </Card>

          <Card className="modern-card shadow-modern hover:shadow-modern-hover transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Gift className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Bonuses and Prizes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Access to exclusive products, special discounts and monthly prizes 
                for top partners.
              </p>
            </CardContent>
          </Card>

          <Card className="modern-card shadow-modern hover:shadow-modern-hover transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Full Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Dedicated team to support your success. Promotional materials, 
                training and personalized follow-up.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Como Funciona */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How the Program Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Fill out the form and wait for approval within 24h",
                icon: "📝"
              },
              {
                step: "2", 
                title: "Get Your Link",
                description: "Receive your unique personalized affiliate link",
                icon: "🔗"
              },
              {
                step: "3",
                title: "Promote Products",
                description: "Share products on your social media and groups",
                icon: "📱"
              },
              {
                step: "4",
                title: "Earn Commissions",
                description: "Receive weekly payments from your sales",
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
            Requirements to Become a Partner
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="modern-card shadow-modern">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Required</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-3">
                   <li className="flex items-start space-x-2">
                     <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                     <span>Minimum 5,000 followers on TikTok or Instagram</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                     <span>Active engagement on social media</span>
                   </li>
                 </ul>
              </CardContent>
            </Card>

          </div>
        </div>

         {/* Comissões */}
         <div className="mb-16">
           <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
             How Commissions Work
           </h2>
           <div className="grid md:grid-cols-2 gap-8">
             <Card className="modern-card shadow-modern">
               <CardHeader>
                 <CardTitle className="flex items-center space-x-2">
                   <TrendingUp className="h-5 w-5 text-green-600" />
                   <span>Fixed Commission</span>
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-center mb-6">
                   <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                     10%
                   </div>
                   <p className="text-gray-600">
                     Fixed 10% commission on all sales made with your code
                   </p>
                 </div>
               </CardContent>
             </Card>

             <Card className="modern-card shadow-modern">
               <CardHeader>
                 <CardTitle className="flex items-center space-x-2">
                   <Gift className="h-5 w-5 text-blue-600" />
                   <span>Payments</span>
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <ul className="space-y-3">
                   <li className="flex items-start space-x-2">
                     <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                     <span>Automatic weekly payments</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                     <span>Bank Transfer or other methods</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                     <span>Based on paid orders</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                     <span>Monthly ranking with prizes</span>
                   </li>
                 </ul>
               </CardContent>
             </Card>
           </div>
         </div>

         {/* Contacto */}
         <div className="mb-16">
           <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
             Contact Us
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
                 <p className="text-gray-600">sales@fanzone12.com</p>
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
                     <span>Send Message</span>
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
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join hundreds of partners who are already earning with Fanzone12. 
                The application process is simple and fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="modern-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full">
                  <Link href="/candidatura-parceiro">
                    Apply Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="modern-button border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full">
                  <Link href="/contacto">
                    Learn More
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
