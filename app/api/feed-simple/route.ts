import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Gerando feed simples...')
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fanzone12.pt'
    
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>fanzone12.pt - Feed Simples</title>
    <link>${baseUrl}</link>
    <description>Feed simples de teste para Google Merchant Center</description>
    
    <item>
      <g:id>test-camisola-001</g:id>
      <g:title>Camisola Sporting CP 2024/25 - Casa</g:title>
      <g:description>Camisola oficial do Sporting CP temporada 2024/25, cor verde e branca</g:description>
      <g:link>${baseUrl}/produto/test-camisola-001</g:link>
      <g:image_link>${baseUrl}/images/sporting-home-2425.webp</g:image_link>
      <g:price>29.99 EUR</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>Sporting CP</g:brand>
      <g:product_type>Camisolas</g:product_type>
      <g:custom_label_0>sporting</g:custom_label_0>
      <g:custom_label_1>Liga Betclic</g:custom_label_1>
      <g:custom_label_2>2024/25</g:custom_label_2>
      <g:color>Verde</g:color>
      <g:material>100% Poliéster</g:material>
      <g:mpn>SPT-SPORTING-2425-VE-001</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
      <g:target_country>PT</g:target_country>
      <g:target_country>LU</g:target_country>
      <g:target_country>FR</g:target_country>
      <g:target_country>ES</g:target_country>
      <g:target_country>DE</g:target_country>
      <g:target_country>CH</g:target_country>
    </item>
    
    <item>
      <g:id>test-camisola-002</g:id>
      <g:title>Camisola Benfica 2024/25 - Casa</g:title>
      <g:description>Camisola oficial do Benfica temporada 2024/25, cor vermelha</g:description>
      <g:link>${baseUrl}/produto/test-camisola-002</g:link>
      <g:image_link>${baseUrl}/images/benfica-home-2425.webp</g:image_link>
      <g:price>29.99 EUR</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>Benfica</g:brand>
      <g:product_type>Camisolas</g:product_type>
      <g:custom_label_0>benfica</g:custom_label_0>
      <g:custom_label_1>Liga Betclic</g:custom_label_1>
      <g:custom_label_2>2024/25</g:custom_label_2>
      <g:color>Vermelho</g:color>
      <g:material>100% Poliéster</g:material>
      <g:mpn>BEN-BENFICA-2425-VE-002</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
      <g:target_country>PT</g:target_country>
      <g:target_country>LU</g:target_country>
      <g:target_country>FR</g:target_country>
      <g:target_country>ES</g:target_country>
      <g:target_country>DE</g:target_country>
      <g:target_country>CH</g:target_country>
    </item>
    
    <item>
      <g:id>test-camisola-003</g:id>
      <g:title>Camisola Porto 2024/25 - Casa</g:title>
      <g:description>Camisola oficial do FC Porto temporada 2024/25, cor azul e branca</g:description>
      <g:link>${baseUrl}/produto/test-camisola-003</g:link>
      <g:image_link>${baseUrl}/images/porto-home-2425.webp</g:image_link>
      <g:price>29.99 EUR</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>FC Porto</g:brand>
      <g:product_type>Camisolas</g:product_type>
      <g:custom_label_0>porto</g:custom_label_0>
      <g:custom_label_1>Liga Betclic</g:custom_label_1>
      <g:custom_label_2>2024/25</g:custom_label_2>
      <g:color>Azul</g:color>
      <g:material>100% Poliéster</g:material>
      <g:mpn>POR-PORTO-2425-AZ-003</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
      <g:target_country>PT</g:target_country>
      <g:target_country>LU</g:target_country>
      <g:target_country>FR</g:target_country>
      <g:target_country>ES</g:target_country>
      <g:target_country>DE</g:target_country>
      <g:target_country>CH</g:target_country>
    </item>
  </channel>
</rss>`

    console.log('Feed simples gerado com sucesso')
    
    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Erro no feed simples:', error)
    
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Erro - Feed Simples</title>
    <description>Erro ao gerar feed simples: ${error instanceof Error ? error.message : 'Erro desconhecido'}</description>
  </channel>
</rss>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
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
