import { RotateCcw, Package, CreditCard, AlertTriangle, Clock, RefreshCw } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Returns & Exchanges | fanzone12.com",
  description: "Returns and exchanges policy from fanzone12.com store. Learn how to return or exchange your products.",
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
              Returns Policy
            </Badge>
            
            <h1 className="text-responsive-xl text-gray-900 mb-6 leading-tight">
              Returns & <span className="gradient-text-cool">Exchanges</span>
            </h1>
            
            <p className="text-responsive-md text-black max-w-2xl mx-auto leading-relaxed" style={{color: 'black'}}>
              At fanzone12.com, we want to ensure your complete satisfaction with our jerseys and sneakers products. We offer a simple and transparent returns and exchanges policy.
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">Return Period</h3>
                <p className="text-black">30 days from the order receipt date</p>
              </div>

              <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 text-center animate-slide-up">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Product Condition</h3>
                <p className="text-black">Unused product, with original tags and packaging</p>
              </div>

              <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 text-center animate-slide-up">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Refund</h3>
                <p className="text-black">Processed within 5-10 business days after receiving the return</p>
              </div>
            </div>

            {/* Return Process */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-r from-teal-500 to-green-500 p-3 rounded-full">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Return Process</h2>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Request Return",
                    content: "To initiate a return, access your account, \"My Orders\" section, and select the \"Return\" option. Alternatively, you can contact our customer support service via email sales@fanzone12.com.",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    step: "2",
                    title: "Pack the Product",
                    content: "Place the product in the original packaging or in suitable packaging that protects the item during transport. Make sure the product is in the same condition as you received it, with all original tags.",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    step: "3",
                    title: "Send the Product",
                    content: "After your return request is approved, you will receive a prepaid return label by email. Print the label, stick it on the package and deliver it to a collection point or request collection at your address.",
                    color: "from-purple-500 to-violet-500"
                  },
                  {
                    step: "4",
                    title: "Refund or Exchange",
                    content: "After we receive and verify the returned product, we will process the refund to the original payment method or send the replacement product, according to your preference.",
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
                <h2 className="text-2xl font-bold text-gray-900">Exchanges</h2>
              </div>
              <div className="space-y-4">
                <p className="text-black leading-relaxed">
                  If you wish to exchange a product for another size, color or model, follow the same return process, indicating that you want an exchange instead of a refund. Specify the product you want to receive as replacement.
                </p>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-1">Important Note</h3>
                      <p className="text-amber-800 text-sm">
                        Product availability for exchange is subject to existing stock. If the desired product is not available, we will contact you to discuss alternatives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "Who pays the return shipping costs?",
                    answer: "For returns due to our error (wrong product, defective or damaged), shipping costs are covered by fanzone12.com. For returns for other reasons (change of mind, incorrect size, etc.), the customer is responsible for shipping costs, unless the original purchase was over €100."
                  },
                  {
                    question: "How long does the refund take?",
                    answer: "After we receive and verify the returned product, the refund is processed within 2-3 business days. The time for the amount to appear in your bank account depends on your financial institution, and may take between 5-10 business days."
                  },
                  {
                    question: "Can I return customized products?",
                    answer: "Customized products (with name, number or customized badge) are not eligible for return or exchange, except in case of manufacturing defect. We recommend carefully checking the customization details before completing the purchase."
                  },
                  {
                    question: "What to do if I receive a damaged product?",
                    answer: "If you receive a damaged or defective product, contact us within 48 hours of receipt. Send photos of the product and packaging to sales@fanzone12.com. We will handle the replacement or refund immediately, at no additional cost."
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
                <h2 className="text-2xl font-bold text-gray-900">Exclusions</h2>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-3">Products not eligible for return or exchange:</h3>
                    <ul className="space-y-2 text-sm text-red-800">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Customized products (with name, number or customized badge)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Products with discount over 50%, properly identified as \"No Exchange/Return\"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Products without original tags or damaged by the customer</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Intimate hygiene products, for health and hygiene reasons</span>
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
                <h2 className="text-2xl font-bold text-gray-900">Contact</h2>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  If you have any questions about returns or exchanges, please contact our customer support service:
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-emerald-800">sales@fanzone12.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
