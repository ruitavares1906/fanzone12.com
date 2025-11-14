/**
 * Utilitários para filtros de cor
 */

/**
 * Aplica filtro de cor aos produtos, incluindo lógica especial para variações de cores
 * @param produtos Array de produtos para filtrar
 * @param cor Parâmetro de cor da URL (pode ser string ou undefined)
 * @returns Array de produtos filtrados
 */
export function aplicarFiltroCor<T extends { cor?: string }>(
  produtos: T[],
  cor: string | undefined
): T[] {
  if (!cor) return produtos

  const coresFiltro = cor.split(",")
  
  return produtos.filter(product => {
    const corProduto = product.cor?.toLowerCase()
    return coresFiltro.some(corFiltro => {
      const corFiltroLower = corFiltro.toLowerCase()
      
      // Lógica especial para variações de cores
      switch (corFiltroLower) {
        case "marrom":
          return corProduto?.includes("marrom") || corProduto?.includes("castanho")
        
        case "azul":
          return corProduto?.includes("azul") || corProduto?.includes("ciano") || corProduto?.includes("jeans")
        
        case "verde":
          return corProduto?.includes("verde") || corProduto?.includes("jade") || corProduto?.includes("menta") || 
                 corProduto?.includes("oliva") || corProduto?.includes("musgo") || corProduto?.includes("abacate")
        
        case "rosa":
          return corProduto?.includes("rosa") || corProduto?.includes("framboesa") || corProduto?.includes("pêssego")
        
        case "amarelo":
          return corProduto?.includes("amarelo") || corProduto?.includes("dourado") || corProduto?.includes("ouro")
        
        case "cinza":
          return corProduto?.includes("cinza") || corProduto?.includes("cinzento") || corProduto?.includes("prata")
        
        case "bege":
          return corProduto?.includes("bege") || corProduto?.includes("creme") || corProduto?.includes("marfim") || 
                 corProduto?.includes("trigo") || corProduto?.includes("corda")
        
        case "branco":
          return corProduto?.includes("branco") || corProduto?.includes("off-white") || corProduto?.includes("sail")
        
        case "preto":
          return corProduto?.includes("preto") || corProduto?.includes("preto")
        
        case "vermelho":
          return corProduto?.includes("vermelho") || corProduto?.includes("vinho") || corProduto?.includes("borgonha")
        
        case "roxo":
          return corProduto?.includes("roxo") || corProduto?.includes("lilás") || corProduto?.includes("púrpura")
        
        case "laranja":
          return corProduto?.includes("laranja") || corProduto?.includes("laranja")
        
        default:
          // Para outras cores, usar busca normal
          return corProduto?.includes(corFiltroLower)
      }
    })
  })
}
