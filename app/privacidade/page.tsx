import { Shield, Lock, Eye, Users, Database, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Privacy Policy | fanzone12.com",
  description: "Privacy policy and data protection from the fanzone12.com online store.",
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
              Data Protection
            </Badge>
            
            <h1 className="text-responsive-xl text-gray-900 mb-6 leading-tight">
              Privacy <span className="gradient-text-cool">Policy</span>
            </h1>
            
            <p className="text-responsive-md text-black max-w-2xl mx-auto leading-relaxed" style={{color: 'black'}}>
              fanzone12.com is committed to protecting your privacy. This Privacy Policy explains how we collect, use and protect your personal information in our jerseys and sneakers store.
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
                <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
              </div>
              <div className="space-y-6 text-black leading-relaxed">
                <p>We may collect the following types of information:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Personal Information</h3>
                    </div>
                    <p className="text-sm text-blue-700">Name, email address, delivery and billing address, and payment data.</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Eye className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Usage Information</h3>
                    </div>
                    <p className="text-sm text-green-700">How you interact with our website, including pages visited and products viewed.</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-900">Device Information</h3>
                    </div>
                    <p className="text-sm text-purple-700">Device type, operating system, browser type and IP address.</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Lock className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-900">Cookies and Technologies</h3>
                    </div>
                    <p className="text-sm text-orange-700">Information collected through cookies, web beacons and similar technologies.</p>
                  </div>
            </div>

                <p className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <strong className="text-blue-900">Note:</strong> We collect this information when you create an account, make a purchase, subscribe to our newsletter, participate in promotions or surveys, or communicate with us.
              </p>
            </div>
            </div>

            {/* Continue with remaining sections using the same modern pattern */}
            {[
              {
                title: "2. How We Use Your Information",
                icon: <Shield className="h-6 w-6 text-white" />,
                gradient: "from-green-500 to-emerald-500",
                content: (
                  <div className="space-y-4">
                    <p>We use your information to:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Process and deliver your orders",
                        "Manage your account and provide customer support",
                        "Send communications about your orders",
                        "Send newsletters and promotional materials",
                        "Personalize your experience",
                        "Improve our website and services",
                        "Prevent fraud and ensure security",
                        "Comply with legal obligations"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <strong className="text-green-900">Legal Basis:</strong> We process your personal data only when we have a legal basis to do so, such as your consent, contract performance, compliance with legal obligations or our legitimate interests.
              </p>
            </div>
                )
              },
              {
                title: "3. Information Sharing",
                icon: <Users className="h-6 w-6 text-white" />,
                gradient: "from-purple-500 to-violet-500",
                content: (
                  <div className="space-y-4">
                    <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
                    <div className="space-y-3">
                      {[
                        { title: "Service Providers", desc: "Who help us operate our business (payment processing, deliveries, etc.)" },
                        { title: "Marketing Partners", desc: "Only if you have consented to receive marketing communications" },
                        { title: "Legal Authorities", desc: "When required by law or to protect our rights" }
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
                title: "4. Cookies and Similar Technologies",
                icon: <Lock className="h-6 w-6 text-white" />,
                gradient: "from-orange-500 to-red-500",
                content: (
                  <p>We use cookies and similar technologies to improve your experience on our website, analyze how users navigate and personalize content. You can manage your cookie preferences through your browser settings.</p>
                )
              },
              {
                title: "5. Data Security",
                icon: <Shield className="h-6 w-6 text-white" />,
                gradient: "from-red-500 to-pink-500",
                content: (
                  <div className="space-y-4">
                    <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure or destruction.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { icon: <Lock className="h-5 w-5" />, title: "Encryption", color: "text-red-600 bg-red-50" },
                        { icon: <Shield className="h-5 w-5" />, title: "Protection", color: "text-red-600 bg-red-50" },
                        { icon: <AlertTriangle className="h-5 w-5" />, title: "Monitoring", color: "text-red-600 bg-red-50" }
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
                title: "6. Data Retention",
                icon: <Database className="h-6 w-6 text-white" />,
                gradient: "from-indigo-500 to-purple-500",
                content: (
                  <p>We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to meet legal, accounting or reporting requirements.</p>
                )
              },
              {
                title: "7. Your Rights",
                icon: <Users className="h-6 w-6 text-white" />,
                gradient: "from-teal-500 to-green-500",
                content: (
                  <div className="space-y-4">
              <p>In accordance with the General Data Protection Regulation (GDPR), you have the following rights:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Right to access your personal information",
                        "Right to rectification of incorrect data",
                        "Right to erasure of your data",
                        "Right to restriction of processing",
                        "Right to data portability",
                        "Right to object to processing",
                        "Right to withdraw consent"
                      ].map((right, index) => (
                        <div key={index} className="flex items-center gap-2 bg-teal-50 p-3 rounded-lg">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span className="text-sm text-teal-700">{right}</span>
                        </div>
                      ))}
                    </div>
                    <p className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
                      <strong className="text-teal-900">To exercise your rights:</strong> Contact us via email privacy@fanzone12.com.
              </p>
            </div>
                )
              },
              {
                title: "8. Changes to This Policy",
                icon: <Eye className="h-6 w-6 text-white" />,
                gradient: "from-violet-500 to-purple-500",
                content: (
                  <p>We may update this Privacy Policy periodically. Any changes will be published on this page with a revised update date. We recommend that you regularly review this policy to stay informed about how we protect your information.</p>
                )
              },
              {
                title: "9. Contact",
                icon: <Shield className="h-6 w-6 text-white" />,
                gradient: "from-emerald-500 to-teal-500",
                content: (
                  <div className="space-y-4">
                    <p>If you have any questions about this Privacy Policy or our data protection practices, please contact us:</p>
                    <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-full">
                          <Shield className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-emerald-900 mb-1">Privacy Email</h3>
                          <p className="text-emerald-700">privacy@fanzone12.com</p>
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
                <span className="text-sm text-black font-medium">Last updated: May 21, 2025</span>
            </div>
            </div>
        </div>
        </div>
      </section>
    </div>
  )
}
