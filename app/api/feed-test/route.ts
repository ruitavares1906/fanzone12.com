import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>fanzone12.pt - Teste de Conectividade</title>
    <link>https://fanzone12.pt</link>
    <description>Teste de conectividade do feed</description>
    <item>
      <g:id>test-001</g:id>
      <g:title>Teste de Conectividade</g:title>
      <g:description>Este é um produto de teste para verificar a conectividade</g:description>
      <g:link>https://fanzone12.pt</g:link>
      <g:image_link>https://fanzone12.pt/favicon.ico</g:image_link>
      <g:price>1.00 EUR</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>fanzone12.pt</g:brand>
      <g:mpn>TEST-001</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
      <g:target_country>PT</g:target_country>
    </item>
  </channel>
</rss>`

    return new NextResponse(testXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Erro no teste de feed:', error)
    return new NextResponse('Internal server error', { status: 500 })
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
