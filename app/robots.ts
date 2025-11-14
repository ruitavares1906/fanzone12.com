import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fanzone12.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth-debug/',
          '/debug/',
          '/teste/',
          '/teste-*/',
          '/corrigir-*/',
          '/diagnostico-*/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

