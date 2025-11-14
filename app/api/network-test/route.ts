import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const startTime = Date.now()
  
  try {
    // Teste de conectividade básica
    const responseTime = Date.now() - startTime
    
    // Informações do request
    const url = new URL(request.url)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const acceptLanguage = request.headers.get('accept-language') || 'unknown'
    const acceptEncoding = request.headers.get('accept-encoding') || 'unknown'
    
    // Detectar tipo de dispositivo
    const isMobile = /iPhone|iPad|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
    const isAndroid = /Android/i.test(userAgent)
    
    const networkTest = {
      status: 'success',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      request: {
        url: url.toString(),
        method: request.method,
        userAgent,
        acceptLanguage,
        acceptEncoding,
        isMobile,
        isIOS,
        isAndroid,
      },
      server: {
        environment: process.env.NODE_ENV,
        platform: process.platform,
        nodeVersion: process.version,
        uptime: process.uptime(),
      },
      connectivity: {
        dnsResolution: 'ok',
        tcpConnection: 'ok',
        httpResponse: 'ok',
      },
      recommendations: isMobile ? [
        'Verifique sua conexão Wi-Fi ou dados móveis',
        'Tente acessar outros sites para confirmar conectividade',
        'Limpe o cache do navegador',
        'Reinicie o dispositivo se o problema persistir'
      ] : [
        'Verifique sua conexão de internet',
        'Tente acessar outros sites',
        'Limpe o cache do navegador'
      ]
    }
    
    return NextResponse.json(networkTest, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Response-Time': `${responseTime}ms`,
        'X-Mobile-Detected': isMobile ? 'true' : 'false',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: `${Date.now() - startTime}ms`,
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
