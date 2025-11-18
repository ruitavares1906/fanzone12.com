"use client"

export function CriticalCSS() {
  return (
    <style
      dangerouslySetInnerHTML={{
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
          `,
      }}
    />
  )
}

