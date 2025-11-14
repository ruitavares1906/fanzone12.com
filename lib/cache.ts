// Cache simples para dados de produtos
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (!cached) return null
  
  const isExpired = Date.now() - cached.timestamp > CACHE_TTL
  if (isExpired) {
    cache.delete(key)
    return null
  }
  
  return cached.data
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

export function clearCache(): void {
  cache.clear()
}

// Cache keys
export const CACHE_KEYS = {
  PRODUCTS: 'products',
  DESTAQUES: 'destaques',
  PRODUTO_BY_ID: (id: string) => `produto_${id}`,
  PRODUTOS_FILTERED: (filters: string) => `produtos_filtered_${filters}`
} as const
