import { NextResponse } from "next/server";
import { getProdutos } from "@/lib/products";

export const runtime = "edge";

// Cache em memória que vive enquanto a instância Edge estiver "quente"
let cache: Record<string, any> | null = null;

function gerarCacheKey(url: URL) {
  // Ordena os parâmetros para gerar chave estável independentemente da ordem na URL
  const params = Array.from(url.searchParams.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return params;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cacheKey = gerarCacheKey(url);

  // Se existir resposta em cache devolve imediatamente
  if (cache && cache[cacheKey]) {
    return new NextResponse(JSON.stringify(cache[cacheKey]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Entregamos instantaneamente de memória, mas mantemos cache CDN
        "Cache-Control": "s-maxage=86400, stale-while-revalidate",
      },
    });
  }

  // Extrai parâmetros de pesquisa
  const params = {
    categoria: url.searchParams.get("categoria") ?? undefined,
    clube: url.searchParams.get("clube") ?? undefined,
    cor: url.searchParams.get("cor") ?? undefined,
    liga: url.searchParams.get("liga") ?? undefined,
    ordenar: url.searchParams.get("ordenar") ?? undefined,
    precoMin: url.searchParams.get("precoMin") ?? undefined,
    precoMax: url.searchParams.get("precoMax") ?? undefined,
    temporada: url.searchParams.get("temporada") ?? undefined,
    pesquisa: url.searchParams.get("pesquisa") ?? undefined,
    versao: url.searchParams.get("versao") ?? undefined,
  } as const;

  // Obtém lista filtrada usando utilidade existente
  const produtos = await getProdutos(params as any);

  // Inicializa cache se necessário e armazena resultado
  if (!cache) cache = {};
  cache[cacheKey] = produtos;

  return new NextResponse(JSON.stringify(produtos), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // 24 h em CDN; stale-while-revalidate devolve imediatamente enquanto refresca
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
} 