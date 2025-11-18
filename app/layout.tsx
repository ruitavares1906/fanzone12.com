import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
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
import { CriticalCSS } from "@/components/critical-css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "fanzone12.com | Official Football Jerseys & Sneakers Store",
  description:
    "Shop official football jerseys from your favorite clubs and national teams. Fast delivery across Europe and customization available.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Viewport fixa para impedir pinch/double-tap zoom em mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="google-site-verification" content="KzMuQGckLkT9XryAtlmHnCGpEKNvr5GBJaoho1W9wuo" />

        <CriticalCSS />
        
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
