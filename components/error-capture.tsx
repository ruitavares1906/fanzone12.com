"use client"

import { useEffect } from "react"

export function ErrorCapture() {
  useEffect(() => {
    // Apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      
      // Capturar erros JavaScript
      window.onerror = function(msg, src, line, col, err) {
        // Filtrar erros genéricos do Safari que não são úteis
        if (msg === 'Script error.' && (!src || src === '')) {
          // Ignorar erro genérico do Safari - não é um erro real
          return false;
        }
        
        console.error('🚨 window.onerror:', { 
          message: msg, 
          source: src, 
          line: line, 
          column: col, 
          error: err,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        });
        
        // Em desenvolvimento, log adicional
        console.log('📊 Error logged for development analysis');
      };

      // Capturar promises rejeitadas
      window.onunhandledrejection = function(e) {
        console.error('🚨 unhandledrejection:', {
          reason: e.reason,
          promise: e.promise,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        });
        
        console.log('📊 Promise rejection logged for development analysis');
      };

      // Capturar erros de recursos (imagens, scripts, etc.)
      window.addEventListener('error', function(e) {
        if (e.target !== window) {
          console.error('🚨 Resource error:', {
            type: e.type,
            target: e.target,
            src: (e.target as any)?.src,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
          });
        }
      }, true);

      // Log de inicialização
      console.log('🔍 Error capture initialized for', process.env.NODE_ENV);
    }
  }, []);

  return null;
}
