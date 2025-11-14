import { NextResponse } from 'next/server'
import { getProdutos } from '@/lib/products'

// Função para escapar caracteres especiais em XML
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Função para gerar MPN único baseado no produto
function generateMPN(product: any): string {
  const prefix = product.marca ? product.marca.toUpperCase().slice(0, 3) : 'SNK'
  const categoria = product.categoria ? product.categoria.toUpperCase().slice(0, 3) : 'GEN'
  const cor = product.cor ? product.cor.toUpperCase().slice(0, 2) : 'XX'
  
  return `${prefix}-${categoria}-${cor}-${product.id.padStart(3, '0')}`
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

export async function GET() {
  try {
    // Obter todos os produtos ténis (exceto Benfica)
    const allProducts = await getProdutos({ categoria: "sneakers" })
    const tenisProducts = allProducts.filter(product => product.clube !== "benfica")

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fanzone12.pt'

    // Gerar XML do feed
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Ténis - fanzone12.pt</title>
    <link>${baseUrl}</link>
    <description>Feed de ténis e sneakers da fanzone12.pt</description>
    
    ${tenisProducts.map(produto => {
      // Determinar preço (apenas preço normal, sem preço promocional)
      const price = produto.preco
      
      // Determinar disponibilidade
      const availability = produto.stock && produto.stock > 0 ? 'in stock' : 'out of stock'
      
      // Determinar condição
      const condition = produto.novo ? 'new' : 'used'
      
      // Determinar marca
      const brand = produto.marca || 'fanzone12.pt'
      
      // Determinar categoria do Google
      const googleCategory = 'Apparel &amp; Accessories &gt; Shoes &gt; Athletic Shoes'
      
      // Determinar gênero (sempre unissex para ténis)
      const gender = 'unisex'
      
      // Determinar faixa etária
      const ageGroup = produto.categoria === "crianca" ? 'kids' : 'adult'
      
      return `
    <item>
      <g:id>${escapeXml(produto.id)}</g:id>
      <g:title>${escapeXml(produto.nome)}</g:title>
      <g:description>${escapeXml(produto.descricao)}</g:description>
      <g:link>${baseUrl}/produto/${produto.id}</g:link>
      <g:image_link>${baseUrl}${produto.imagem}</g:image_link>
      <g:price>${price.toFixed(2)} EUR</g:price>
      <g:availability>${availability}</g:availability>
      <g:condition>${condition}</g:condition>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:mpn>${escapeXml(generateMPN(produto))}</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type>${escapeXml(produto.categoria)} &gt; ${escapeXml(produto.subcategoria || '')}</g:product_type>
      <g:color>${escapeXml(produto.cor || '')}</g:color>
      <g:material>${escapeXml(produto.material || '')}</g:material>
      <g:size>Vários</g:size>
      <g:gender>${gender}</g:gender>
      <g:age_group>${ageGroup}</g:age_group>
      <g:target_country>PT</g:target_country>
      <g:target_country>LU</g:target_country>
      <g:target_country>FR</g:target_country>
      <g:target_country>ES</g:target_country>
      <g:target_country>DE</g:target_country>
      <g:target_country>CH</g:target_country>
      <g:shipping_weight>
        <g:value>0.5</g:value>
        <g:unit>kg</g:unit>
      </g:shipping_weight>
      <g:shipping>
        <g:country>PT</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>LU</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>FR</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>ES</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>DE</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>CH</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
    </item>`
    }).join('')}
    
  </channel>
</rss>`

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Erro ao gerar feed de ténis:', error)
    return new NextResponse('Erro interno do servidor', { status: 500 })
  }
} 