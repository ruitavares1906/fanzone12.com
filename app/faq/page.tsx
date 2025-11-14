import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, HelpCircle, Package, CreditCard, Truck, RotateCcw, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Frequently Asked Questions | fanzone12.com",
  description:
    "Find answers to the most frequently asked questions about fanzone12.com store, products, shipping and returns.",
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
              Help Center
            </Badge>
            
            <h1 className="text-responsive-xl text-gray-900 mb-6 leading-tight">
              Frequently <span className="gradient-text-cool">Asked Questions</span>
            </h1>
            
            <p className="text-responsive-md text-black max-w-2xl mx-auto leading-relaxed mb-8" style={{color: 'black'}}>
              Find answers to the most common questions about our products, shipping, returns and more.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search frequently asked questions..." 
                className="pl-12 py-3 rounded-full border-2 border-gray-200 focus:border-blue-400 bg-white/80 backdrop-blur-sm" 
              />
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { href: "#produtos", icon: Package, label: "Products", color: "from-blue-500 to-cyan-500" },
                { href: "#encomendas", icon: CreditCard, label: "Payments", color: "from-green-500 to-emerald-500" },
                { href: "#envios", icon: Truck, label: "Shipping", color: "from-purple-500 to-violet-500" },
                { href: "#devolucoes", icon: RotateCcw, label: "Returns", color: "from-orange-500 to-red-500" }
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
                <h2 className="text-2xl font-bold text-gray-900">Products and Sizes</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "Are the jerseys official and authentic?",
                    answer: "Yes, all jerseys sold in our store are official and authentic products, purchased directly from manufacturers or authorized distributors. Each product comes with original tags and authenticity guarantee."
                  },
                  {
                    question: "How to choose the correct size?",
                    answer: "We recommend consulting the size chart available on each product page. Football jerseys usually have a tighter fit, so if you prefer a looser fit, consider choosing one size above your usual. If in doubt, contact our customer support service."
                  },
                  {
                    question: "Can I customize any jersey?",
                    answer: "Yes, we offer customization service for most jerseys. You can add name, number and, in some cases, badges. On the product page, select the \"Customize\" option and follow the instructions. Note that customized products have a slightly longer delivery time (1-2 additional days) and are not eligible for return, except in case of defect."
                  },
                  {
                    question: "Are the sneakers original?",
                    answer: "Yes, all sneakers sold in our store are original products from Nike, Adidas and other premium brands. Each pair comes with original tags, authentic box and authenticity guarantee. We work directly with authorized distributors to ensure the quality of our products."
                  },
                  {
                    question: "How to choose the correct size for sneakers?",
                    answer: "For sneakers, we recommend choosing your usual size. Sneakers have a standard fit, different from jerseys. If you have doubts about the size, you can consult the size chart or contact our customer support service. We offer sizes from 36 to 45, including half sizes for greater precision."
                  },
                  {
                    question: "What is the difference between \"Fan\" and \"Player\" versions?",
                    answer: "The \"Fan\" version is the standard jersey, made for fans, with a more comfortable fit and more affordable price. The \"Player\" (or \"Pro\") version is identical to that used by players on the field, with advanced technology, lighter material and tighter fit. The \"Player\" version usually has a higher price due to its premium features."
                  },
                  {
                    question: "How to care for jerseys to maintain quality?",
                    answer: (
                      <div>
                        <p className="mb-3">To preserve the quality of jerseys, we recommend:</p>
                        <ul className="space-y-2">
                          {[
                            "Machine wash at 30°C, on delicate cycle",
                            "Turn the jersey inside out before washing",
                            "Do not use bleach or fabric softener",
                            "Do not tumble dry",
                            "Iron at low temperature, avoiding prints and badges",
                            "Do not dry clean"
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
                <h2 className="text-2xl font-bold text-gray-900">Orders and Payments</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "What payment methods are accepted?",
                    answer: (
                      <div>
                        <p className="mb-3">We accept the following payment methods:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          {[
                            "Credit/debit card (Visa, Mastercard, American Express)",
                            "PayPal",
                            "Klarna",
                            "Apple Pay",
                            "Google Pay"
                          ].map((method, index) => (
                            <div key={index} className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm">{method}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm bg-green-50 p-3 rounded-lg">
                          All payments are processed securely through encrypted connections.
                        </p>
                      </div>
                    )
                  },
                  {
                    question: "Do I need to create an account to make a purchase?",
                    answer: "It is not mandatory to create an account to make a purchase, we offer the option of guest checkout. However, creating an account allows you to track your orders, save delivery addresses, access purchase history and benefit from exclusive member promotions."
                  },
                  {
                    question: "How can I track my order?",
                    answer: "After your order is shipped, you will receive an email with the tracking code and instructions on how to track the delivery status. If you have an account, you can also check your order status in the \"My Orders\" section of your customer area."
                  },
                  {
                    question: "Can I change or cancel my order?",
                    answer: "You can change or cancel your order only if it has not yet been processed. To do this, contact us immediately via email sales@fanzone12.com. If the order has already been processed or shipped, it will not be possible to cancel it, but you can return it after receipt, according to our returns policy."
                  },
                  {
                    question: "Do prices include VAT?",
                    answer: "Yes, all prices shown on our website include VAT at the applicable legal rate. The invoice with VAT breakdown will be sent by email after purchase completion and will also be available in your customer area."
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
                <h2 className="text-2xl font-bold text-gray-900">Shipping & Delivery</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "What are the delivery times?",
                    answer: (
                      <div>
                        <p className="mb-3">Estimated delivery times are:</p>
                        <div className="space-y-2 mb-3">
                          {[
                            { location: "Mainland Portugal", time: "7-12 business days" },
                            { location: "Islands (Madeira and Azores)", time: "10-15 business days" },
                            { location: "Europe", time: "7-12 business days" },
                            { location: "Rest of World", time: "10-15 business days" }
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
                              <span className="font-medium">{item.location}</span>
                              <span className="text-sm bg-purple-100 px-2 py-1 rounded">{item.time}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm bg-purple-50 p-3 rounded-lg">
                          These times are counted from payment confirmation. Customized products may have 1-2 additional days of processing.
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
                <h2 className="text-2xl font-bold text-gray-900">Still have questions?</h2>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  If you didn't find the answer you were looking for, don't hesitate to contact us. Our customer support team is always available to help.
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-emerald-600" />
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
