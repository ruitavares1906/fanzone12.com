import Link from "next/link"
import { Instagram, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-yellow-200 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Modern About Section */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-modern border border-gray-200">
            <div className="flex items-center mb-6">
              <Image 
                src="/images/506271e6-0123-4529-8c72-bbc5679a47bd.webp" 
                alt="fanzone12.pt" 
                width={120} 
                height={45} 
                className="mr-3 w-20 h-auto sm:w-[120px]" 
                sizes="(max-width: 640px) 80px, 120px"
              />
            </div>
            <p className="text-gray-800 mb-6 leading-relaxed">
              Aqui cada camisola conta a tua história. Personalização única, qualidade garantida e entregas rápidas em toda a Europa.
            </p>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <Link href="https://instagram.com/fanzone12.pt__" className="modern-button p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg">
                  <Instagram className="h-5 w-5 text-white" />
                  <span className="sr-only">fanzone12.pt__</span>
                </Link>
                <Link href="https://www.facebook.com/profile.php?id=61582728350804" className="modern-button p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="https://www.tiktok.com/@fanzone12.pt" className="modern-button p-3 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 transition-all duration-300 shadow-lg">
                  <Image src="/images/tik-tok.webp" alt="TikTok" width={20} height={20} className="h-5 w-5" />
                  <span className="sr-only">TikTok</span>
                </Link>
                <Link href="https://wa.me/351934244455" className="modern-button p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span className="sr-only">WhatsApp</span>
                </Link>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <Link href="https://www.tiktok.com/@fanzone12.pt_" className="flex items-center gap-2 text-gray-800 hover:text-gray-600 transition-colors mb-1">
                  <Image src="/images/tik-tok.webp" alt="TikTok Feedbacks" width={20} height={20} className="h-5 w-5" />
                  <span className="text-sm font-semibold">@fanzone12.pt_</span>
                </Link>
                <p className="text-sm text-gray-700 font-medium ml-7">Feedbacks dos nossos clientes</p>
              </div>
            </div>
          </div>

          {/* Modern Links Section */}
          <div className="glass-effect rounded-2xl p-6 shadow-modern">
            <h3 className="font-bold text-lg mb-6 text-yellow-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Início", href: "/" },
                { name: "Catálogo", href: "/catalogo" },
                { name: "Clubes", href: "/catalogo?categoria=clubes" },
                { name: "Seleções", href: "/catalogo?categoria=selecoes" },
                { name: "Seja Parceiro", href: "/info-parceiros" },
                { name: "Sobre Nós", href: "/sobre" },
                { name: "Contacto", href: "/contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-yellow-200 hover:text-yellow-400 transition-all duration-300 hover:translate-x-2 block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Modern Info Section */}
          <div className="glass-effect rounded-2xl p-6 shadow-modern">
            <h3 className="font-bold text-lg mb-6 text-yellow-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Informações
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Termos e Condições", href: "/termos" },
                { name: "Política de Privacidade", href: "/privacidade" },
                { name: "Envios e Entregas", href: "/envios" },
                { name: "Devoluções e Trocas", href: "/devolucoes" },
                { name: "Perguntas Frequentes", href: "/faq" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-yellow-200 hover:text-yellow-400 transition-all duration-300 hover:translate-x-2 block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
          </div>

          {/* Modern Contact Section */}
          <div className="bg-white rounded-2xl p-6 shadow-modern border border-gray-200">
            <h3 className="font-bold text-lg mb-6 text-gray-800 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contacto
            </h3>
            <div className="mb-6 space-y-3">
              <Link href="/contacto" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Mail className="h-5 w-5 text-gray-600 flex-shrink-0" />
                <span className="text-gray-800 font-medium">Preencher formulário</span>
              </Link>
              <Link href="https://wa.me/351934244455" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span className="text-gray-800 font-medium">WhatsApp</span>
              </Link>
              <Link href="https://www.tiktok.com/@fanzone12.pt" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Image src="/images/tik-tok.webp" alt="TikTok" width={20} height={20} className="h-5 w-5" />
                <span className="text-gray-800 font-medium">@fanzone12.pt</span>
              </Link>
              <Link href="https://www.tiktok.com/@fanzone12.pt_" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Image src="/images/tik-tok.webp" alt="TikTok Feedbacks" width={20} height={20} className="h-5 w-5" />
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium">@fanzone12.pt_</span>
                  <span className="text-xs text-gray-600">Feedbacks dos clientes</span>
                </div>
              </Link>
              <Link href="https://instagram.com/fanzone12.pt__" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Instagram className="h-5 w-5 text-pink-600" />
                <span className="text-gray-800 font-medium">@fanzone12.pt__</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Modern Payment Methods Section */}
        <div className="border-t border-gray-300 mt-10 pt-10">
          <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-modern border border-gray-200">
            <h3 className="font-bold text-lg sm:text-xl mb-6 sm:mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              Métodos de Pagamento Aceites
            </h3>
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              {/* Linha única horizontal em todos os tamanhos */}
              <div className="grid grid-flow-col auto-cols-max overflow-x-auto md:overflow-x-visible justify-center gap-2 md:gap-2">
                 {[
                   { name: "Método", src: "/images/1086741.png", width: 100, height: 60 },
                   { name: "Multibanco", src: "/images/payment-multibanco.png", width: 80, height: 80 },
                  { name: "Klarna", src: "/images/payment-klarna.webp", width: 100, height: 50 },
                  { name: "PayPal", src: "/images/PayPal_Logo2014.png", width: 100, height: 50 },
                  { name: "MB WAY", src: "/images/logo-mbway-1536x960.png", width: 80, height: 40 },
                ].map((payment) => (
                  <div 
                    key={payment.name}
                    className="flex items-center justify-center transition-all duration-300 hover:scale-105 shrink-0"
                  >
                    <Image
                      src={payment.src}
                      alt={payment.name}
                      width={payment.width}
                      height={payment.height}
                      className={`${payment.name === "PayPal" ? "h-10 sm:h-16" : "h-9 sm:h-14"} w-auto object-contain mx-auto`}
                    />
                  </div>
                ))}
              </div>
              
              {/* Segunda linha - Pagamento à Cobrança sozinho e maior */}
              <div className="flex justify-center">
                <div className="flex items-center justify-center transition-all duration-300 hover:scale-105">
                  <Image
                    src="/images/cobranca_logo.jpg"
                    alt="Pagamento à Cobrança"
                    width={140}
                    height={84}
                    className="h-12 sm:h-14 w-auto object-contain mx-auto"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-black/30">
              <p className="text-black text-sm mb-4 md:mb-0 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                &copy; 2025 fanzone12.pt. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-2 text-black text-sm">
                <span>Feito com</span>
                <span className="text-red-400 md:animate-pulse motion-reduce:animate-none text-xs sm:text-base">❤️</span>
                <span>em Portugal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
