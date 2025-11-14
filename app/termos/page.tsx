import Link from "next/link"
import { Shield, FileText, Scale, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Terms and Conditions | fanzone12.com",
  description: "Terms and conditions of use for the fanzone12.com online store.",
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
              Legal Information
            </Badge>
            
            <h1 className="text-responsive-xl text-gray-900 mb-6 leading-tight">
              Terms & <span className="gradient-text-cool">Conditions</span>
            </h1>
            
            <p className="text-responsive-md text-black max-w-2xl mx-auto leading-relaxed" style={{color: 'black'}}>
              Welcome to the Terms and Conditions of fanzone12.com. These terms govern the use of our website and the services offered by our online store of jerseys and sneakers.
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
                <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-black leading-relaxed">
                <p>
                  By accessing and using our website, the user agrees to comply with and be bound by these Terms and Conditions.
                </p>
                <p>
                  Continued use of our services after the publication of any changes to the Terms constitutes your acceptance of those changes.
                </p>
                <p>If you do not agree with any of the terms, please do not use our website or services.</p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Changes to Terms</h2>
              </div>
              <div className="space-y-4 text-black leading-relaxed">
                <p>
                  fanzone12.com reserves the right to modify these terms at any time. Changes take effect immediately after their publication on the website.
                </p>
                <p>
                  We will make all reasonable efforts to inform users about significant changes, but it is the user's responsibility to periodically check for updates.
                </p>
                <p>Continued use of the site after changes constitutes acceptance of the new terms.</p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. User Account</h2>
              </div>
              <div className="space-y-4 text-black leading-relaxed">
                <p>
                  To make purchases on our website, you may need to create an account. The user is responsible for maintaining the confidentiality of their account and password.
                </p>
                <p>
                  You must restrict access to your computer and other devices, and agree to accept responsibility for all activities that occur in your account.
                </p>
                <p>
                  fanzone12.com reserves the right to refuse service, close accounts or cancel orders at its discretion.
                </p>
              </div>
            </div>

            {/* Continue with remaining sections... */}
            {[
              {
                title: "4. Products and Prices",
                icon: <Scale className="h-6 w-6 text-white" />,
                gradient: "from-purple-500 to-pink-500",
                content: [
                  "fanzone12.com strives to present accurate product descriptions. However, we do not guarantee that descriptions or other website content are accurate, complete, reliable, current or error-free.",
                  "Product images are illustrative and may vary slightly from the actual product, especially in terms of color, depending on the device used for viewing.",
                  "Product prices are subject to change without notice. We reserve the right to discontinue any product at any time.",
                  "All prices include VAT at the applicable legal rate, unless otherwise indicated."
                ]
              },
              {
                title: "5. Orders and Payments",
                icon: <FileText className="h-6 w-6 text-white" />,
                gradient: "from-blue-500 to-cyan-500",
                content: [
                  "By placing an order, the user offers to purchase the product under the specified conditions. Order acceptance is subject to product availability and payment data validation.",
                  "We accept various forms of payment, including credit/debit cards, PayPal, Klarna, Apple Pay and Google Pay. All payments are processed securely.",
                  "All payments are processed securely through encrypted connections to ensure the protection of your financial information."
                ]
              },
              {
                title: "6. Shipping & Delivery",
                icon: <Shield className="h-6 w-6 text-white" />,
                gradient: "from-red-500 to-rose-500",
                content: [
                  <>
                    Information about shipping and delivery is available on our{" "}
                    <Link href="/envios" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2">
                      Shipping & Delivery
                    </Link>
                    {" "}page. fanzone12.com is not responsible for delays caused by circumstances beyond our control.
                  </>
                ]
              },
              {
                title: "7. Returns & Exchanges",
                icon: <Users className="h-6 w-6 text-white" />,
                gradient: "from-teal-500 to-green-500",
                content: [
                  <>
                    Our returns and exchanges policy is available on the{" "}
                    <Link href="/devolucoes" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2">
                      Returns & Exchanges
                    </Link>
                    {" "}page. All returns must be made in accordance with these policies.
                  </>
                ]
              },
              {
                title: "8. Intellectual Property",
                icon: <Scale className="h-6 w-6 text-white" />,
                gradient: "from-indigo-500 to-purple-500",
                content: [
                  "All website content, including texts, graphics, logos, icons, images, audio clips, digital downloads and data compilations, is the property of fanzone12.com or its content suppliers and is protected by Portuguese and international copyright laws."
                ]
              },
              {
                title: "9. Limitation of Liability",
                icon: <Shield className="h-6 w-6 text-white" />,
                gradient: "from-orange-500 to-red-500",
                content: [
                  "fanzone12.com will not be liable for any direct, indirect, incidental, consequential or punitive damages resulting from the use or inability to use our services or products."
                ]
              },
              {
                title: "10. Applicable Law",
                icon: <FileText className="h-6 w-6 text-white" />,
                gradient: "from-violet-500 to-purple-500",
                content: [
                  "These Terms and Conditions are governed and interpreted in accordance with European Union laws. Any dispute related to these terms will be subject to the exclusive jurisdiction of the competent courts."
                ]
              },
              {
                title: "11. Contact",
                icon: <Users className="h-6 w-6 text-white" />,
                gradient: "from-emerald-500 to-teal-500",
                content: [
                  <>
                    If you have any questions about these Terms and Conditions, please contact us via email sales@fanzone12.com or visit our{" "}
                    <Link href="/contacto" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2">
                      Contact
                    </Link>
                    {" "}page.
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
                <span className="text-sm text-black font-medium">Last updated: May 21, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
