import { NextRequest, NextResponse } from 'next/server'
import { getProdutos } from '@/lib/products'

// Função para escapar caracteres especiais em XML
function escapeXml(text: string | undefined | null): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Função para formatar preço no formato exigido pelo Google Merchant Center
function formatPrice(price: number): string {
  return `${price.toFixed(2)} EUR`
}

// Função para obter URL completa da imagem
function getFullImageUrl(imagePath: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fanzone12.pt'
  return `${baseUrl}${imagePath}`
}

// Função para obter URL do produto
function getProductUrl(productId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fanzone12.pt'
  return `${baseUrl}/produto/${productId}`
}

// Função para determinar disponibilidade
function getAvailability(product: any): string {
  // Sempre mostrar como disponível
  return 'in stock'
}


// Função para determinar condição do produto
function getCondition(product: any): string {
  // Assumindo que todos os produtos são novos
  return 'new'
}

// Função para gerar MPN único baseado no produto
function generateMPN(product: any): string {
  const prefix = product.marca ? product.marca.toUpperCase().slice(0, 3) : 'CAM'
  const clube = product.clube ? product.clube.toUpperCase().slice(0, 3) : 'GEN'
  const temporada = product.temporada ? product.temporada.replace('/', '') : '2425'
  const cor = product.cor ? product.cor.toUpperCase().slice(0, 2) : 'XX'
  const productId = product.id || '000'
  
  return `${prefix}-${clube}-${temporada}-${cor}-${productId.toString().padStart(3, '0')}`
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

export async function GET(request: NextRequest) {
  try {
    console.log('Iniciando geração do feed...')
    
    // Buscar todos os produtos (excluindo ténis que não são do Benfica)
    const todosProdutos = await getProdutos({})
    console.log(`Encontrados ${todosProdutos.length} produtos`)
    
    // Filtrar apenas camisolas e ténis do Benfica
    const produtos = todosProdutos.filter(produto => {
      // Manter produtos do Benfica (incluindo ténis)
      if (produto.clube === "benfica") {
        return true
      }
      // Excluir produtos com subcategoria "sneakers" ou categoria "airforce"
      return produto.subcategoria !== "sneakers" && produto.categoria !== "airforce"
    })
    
    console.log(`Filtrados ${produtos.length} produtos para o feed`)

    // Gerar XML do feed
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>fanzone12.pt - Feed de Produtos</title>
    <link>${process.env.NEXT_PUBLIC_SITE_URL || 'https://fanzone12.pt'}</link>
    <description>Feed de produtos para Google Merchant Center</description>
    ${produtos.map(produto => {
      // Verificar se o produto tem dados mínimos necessários
      if (!produto.id || !produto.nome) {
        console.log('Produto inválido ignorado:', produto)
        return ''
      }
      
      return `
    <item>
      <g:id>${escapeXml(produto.id)}</g:id>
      <g:title>${escapeXml(produto.nome)}</g:title>
      <g:description>${escapeXml(produto.descricao || 'Produto sem descrição')}</g:description>
      <g:link>${escapeXml(getProductUrl(produto.id))}</g:link>
      <g:image_link>${escapeXml(getFullImageUrl(produto.imagem || '/placeholder.svg'))}</g:image_link>
      <g:price>${formatPrice(produto.preco || 0)}</g:price>
      <g:availability>${getAvailability(produto)}</g:availability>
      <g:condition>${getCondition(produto)}</g:condition>
      <g:brand>${escapeXml(produto.marca || 'fanzone12.pt')}</g:brand>
      ${produto.categoria ? `<g:product_type>${escapeXml(produto.categoria)}</g:product_type>` : ''}
      ${produto.clube ? `<g:custom_label_0>${escapeXml(produto.clube)}</g:custom_label_0>` : ''}
      ${produto.liga ? `<g:custom_label_1>${escapeXml(produto.liga)}</g:custom_label_1>` : ''}
      ${produto.temporada ? `<g:custom_label_2>${escapeXml(produto.temporada)}</g:custom_label_2>` : ''}
      ${produto.cor ? `<g:color>${escapeXml(produto.cor)}</g:color>` : ''}
      ${produto.material ? `<g:material>${escapeXml(produto.material)}</g:material>` : ''}
      <g:size>Vários</g:size>
      <g:gender>unisex</g:gender>
      <g:age_group>adult</g:age_group>
      <g:mpn>${escapeXml(generateMPN(produto))}</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
      <g:target_country>PT</g:target_country>
      <g:target_country>LU</g:target_country>
      <g:target_country>FR</g:target_country>
      <g:target_country>ES</g:target_country>
      <g:target_country>DE</g:target_country>
      <g:target_country>CH</g:target_country>
    </item>`
    }).filter(item => item !== '').join('')}
  </channel>
</rss>`

    // Retornar resposta com content-type XML
    return new NextResponse(xmlContent, {
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
    console.error('Erro ao gerar feed XML:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Erro - Feed de Produtos</title>
    <description>Erro ao gerar feed de produtos: ${errorMessage}</description>
    <item>
      <title>Erro de Conectividade</title>
      <description>Erro: ${errorMessage}</description>
      <link>https://fanzone12.pt</link>
    </item>
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