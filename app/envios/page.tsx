import { Truck, Clock, AlertCircle, MapPin, Package, Euro } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Shipping & Delivery | fanzone12.com",
  description: "Information about shipping, delivery times and shipping costs from fanzone12.com store.",
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
              Logistics
            </Badge>
            
            <h1 className="text-responsive-xl text-gray-900 mb-6 leading-tight">
              Shipping & <span className="gradient-text-cool">Delivery</span>
            </h1>
            
            <p className="text-responsive-md text-black max-w-2xl mx-auto leading-relaxed" style={{color: 'black'}}>
              At fanzone12.com, we work with the best logistics partners to ensure your jerseys and sneakers orders arrive quickly and in perfect condition.
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
                  <h2 className="text-2xl font-bold text-gray-900">Shipping Methods</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-black mb-4">We work with the following delivery partners:</p>
                  <div className="space-y-3">
                    {[
                      { name: "DHL", color: "from-yellow-500 to-orange-500" },
                      { name: "UPS", color: "from-amber-600 to-yellow-600" },
                      { name: "FedEx", color: "from-blue-500 to-indigo-600" },
                      { name: "DPD", color: "from-red-500 to-pink-600" },
                      { name: "GLS", color: "from-green-500 to-emerald-600" }
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
                  <h2 className="text-2xl font-bold text-gray-900">Delivery Times</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-black mb-4">Estimated delivery times are:</p>
                  <div className="space-y-3">
                    {[
                      { location: "Europe", time: "7-12 business days", color: "bg-purple-50 text-purple-700 border-purple-200" },
                      { location: "Rest of World", time: "10-15 business days", color: "bg-orange-50 text-orange-700 border-orange-200" }
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
                <h2 className="text-2xl font-bold text-gray-900">Shipping Costs</h2>
              </div>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Destination</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Shipping Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">Europe (EU/EEE + UK)</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Up to 2 products</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          €4.00
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">Europe (EU/EEE + UK)</td>
                      <td className="px-6 py-4 text-sm text-gray-700">3 products or more OR €68+</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Free
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">International</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Any quantity</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          On request
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
                    <span className="text-sm font-medium text-gray-900">Europe (EU/EEE + UK)</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      €4.00
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Up to 2 products</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">Europe (EU/EEE + UK)</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Free
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">3 products or more OR €68+</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">International</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                      On request
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Any quantity</p>
                </div>
              </div>
            </div>

            {/* Order Tracking */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-teal-500 to-green-500 p-3 rounded-full">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Order Tracking</h2>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-xl border border-teal-200">
                <p className="text-gray-700 leading-relaxed">
                  After your order is shipped, you will receive an email with the tracking code and instructions on how to track the delivery status. You can also check your order status in your customer area, in the "My Orders" section.
                </p>
              </div>
            </div>

            {/* Important Information */}
            <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Important Information</h2>
              </div>
              <div className="space-y-6">
                {[
                  {
                    title: "Delivery hours",
                    content: "Deliveries are made on business days, between 9am and 6pm. No deliveries are made on weekends or national holidays.",
                    color: "from-blue-50 to-cyan-50 border-blue-200"
                  },
                  {
                    title: "Delivery address",
                    content: "It is the customer's responsibility to provide a correct and complete delivery address. Orders returned due to incorrect information may be subject to additional reshipping costs.",
                    color: "from-purple-50 to-violet-50 border-purple-200"
                  },
                  {
                    title: "Free shipping",
                    content: "Free shipping applies to orders with 3 or more products OR value above €68 for Europe (EU/EEE + UK). For other regions, shipping costs will be calculated at checkout.",
                    color: "from-green-50 to-emerald-50 border-green-200"
                  },
                  {
                    title: "Delivery delays",
                    content: "During periods of high order volume (e.g., Black Friday, Christmas) or due to adverse weather conditions, delivery delays may occur. We will do our best to minimize any inconvenience.",
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

            {/* Contact Section */}
            <div className="glass-effect rounded-2xl p-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Contact</h2>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  If you have any questions about shipping your order, please contact our customer support service:
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
