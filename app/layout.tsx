import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { ScrollTop } from "@/components/scroll-top"
import { DiscountUrlHandler } from "@/components/discount-url-handler"
import { NonBlockingScripts } from "@/components/non-blocking-scripts"
import { ConsentManager } from "@/components/consent-manager"
import { ErrorCapture } from "@/components/error-capture"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "fanzone12.pt | Loja Online de Camisolas de Futebol",
  description:
    "Compre camisolas de futebol oficiais dos seus clubes e seleções favoritas. Entrega rápida e personalização disponível.",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
}

// viewport export removido para evitar conflitos; a meta tag será injetada manualmente no <head>

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <head>
        {/* Viewport fixa para impedir pinch/double-tap zoom em mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="google-site-verification" content="KzMuQGckLkT9XryAtlmHnCGpEKNvr5GBJaoho1W9wuo" />
        
        {/* Favicon configuration */}
        
        {/* Meta tags específicas para mobile e iOS - Removidas duplicações */}
        
        {/* CSS crítico inline otimizado para LCP */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* CSS crítico inline para LCP - Otimizado */
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; }
            .hero-section { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); min-height: 70vh; }
            .hero-image { width: 100%; height: auto; object-fit: cover; will-change: transform; }
            .navbar { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 50; }
            .btn-primary { background: #f59e0b; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; transition: transform 0.2s ease; }
            .btn-primary:hover { background: #d97706; transform: translateY(-1px); }
            .text-responsive-xl { font-size: clamp(2rem, 5vw, 4rem); font-weight: 800; line-height: 1.1; color: #1f2937; }
            .text-responsive-md { font-size: clamp(1rem, 2.5vw, 1.5rem); line-height: 1.6; color:rgb(243, 243, 243); }
            .modern-card { background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: transform 0.2s ease; will-change: transform; }
            .animate-fade-in { animation: fadeIn 0.6s ease-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            /* Otimizações específicas para LCP */
            img { max-width: 100%; height: auto; }
            .hero-section img { will-change: transform; }
          `
        }} />
        
        {/* Preload da imagem hero principal - LCP Critical */}
        <link 
          rel="preload" 
          href="/images/1751647533_9cc7b4a154af3f78533665e36b695936.webp" 
          as="image" 
          type="image/webp"
          fetchPriority="high"
        />
        
        {/* Preload das imagens LCP da secção Lançamentos Exclusivos */}
        <link 
          rel="preload" 
          href="/images/535951790_1318704906288192_8737859712710652925_n.jpg" 
          as="image" 
          type="image/jpeg"
          fetchPriority="high"
          media="(min-width: 768px)"
        />
        <link 
          rel="preload" 
          href="/images/546365886_1334743178017698_7136686953264947284_n.jpg" 
          as="image" 
          type="image/jpeg"
          fetchPriority="high"
          media="(min-width: 768px)"
        />
        <link 
          rel="preload" 
          href="/images/535951790_1318704906288192_8737859712710652925_n.webp" 
          as="image" 
          type="image/webp"
          fetchPriority="high"
          media="(max-width: 767px)"
        />
        <link 
          rel="preload" 
          href="/images/546365886_1334743178017698_7136686953264947284_n.webp" 
          as="image" 
          type="image/webp"
          fetchPriority="high"
          media="(max-width: 767px)"
        />
        <link 
          rel="preload" 
          href="/images/5b338259fa495d16e8ca7713be1eec58d0201338.webp" 
          as="image" 
          type="image/webp"
          fetchPriority="high"
        />
        
        {/* Preload de fontes críticas - Removido preconnect redundante com next/font */}
        
        {/* Preconnect para domínios externos - Otimizado para LCP */}
        <link rel="preconnect" href="https://tfionqfszlmrzfllwcxm.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        
        {/* Preload de imagens críticas adicionais - Logo (sem prioridade alta) */}
        <link rel="preload" href="/images/dbe5a8e3-94bb-400a-aedf-f737d748eb6f.webp" as="image" type="image/webp" crossOrigin="anonymous" />
        <link rel="preload" href="/images/506271e6-0123-4529-8c72-bbc5679a47bd.webp" as="image" type="image/webp" crossOrigin="anonymous" />
        
        {/* Prefetch de recursos não críticos - Após LCP */}
        <link rel="prefetch" href="/catalogo" />
        <link rel="prefetch" href="/contacto" />

        
        
        {/* Scripts movidos para componente não bloqueante */}
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <DiscountUrlHandler />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <ScrollTop />
            <NonBlockingScripts />
            <ConsentManager />
            <ErrorCapture />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
