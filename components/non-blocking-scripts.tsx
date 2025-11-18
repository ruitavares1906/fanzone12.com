"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    __allow_tracking?: boolean;
    fbq?: (...args: any[]) => void;
  }
}

export function NonBlockingScripts() {
  useEffect(() => {
    // Delay loading of heavy scripts to improve TBT (Total Blocking Time)
    // We use a timeout to allow the main thread to settle after hydration
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && !window.fbq) {
        // Verificar se o script já existe para evitar duplicação
        if (!document.querySelector('script[src="https://connect.facebook.net/en_US/fbevents.js"]')) {
          try {
            // Inicializar a função fbq
            (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
              if (f.fbq) return;
              n = f.fbq = function(...args: any[]) {
                n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
              };
              if (!f._fbq) f._fbq = n;
              n.push = n;
              n.loaded = !0;
              n.version = '2.0';
              n.queue = [];
              t = b.createElement(e);
              t.async = !0;
              t.src = v;
              t.onerror = () => {
                console.debug('Meta Pixel blocked by client');
              };
              s = b.getElementsByTagName(e)[0];
              if (s && s.parentNode) {
                s.parentNode.insertBefore(t, s);
              }
            })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

            // Inicializar o pixel e rastrear PageView
            const fbqFn = (window as any).fbq;
            if (fbqFn) {
              fbqFn('init', '953002006834808');
              fbqFn('track', 'PageView');
            }

            // Adicionar noscript fallback
            const noscript = document.createElement('noscript');
            const img = document.createElement('img');
            img.height = 1;
            img.width = 1;
            img.style.display = 'none';
            img.src = 'https://www.facebook.com/tr?id=953002006834808&ev=PageView&noscript=1';
            noscript.appendChild(img);
            document.body.appendChild(noscript);
          } catch (error) {
            console.debug('Meta Pixel failed to load');
          }
        }
      }
    }, 4000) // 4 seconds delay

    return () => clearTimeout(timer)
  }, [])

  return null
}
