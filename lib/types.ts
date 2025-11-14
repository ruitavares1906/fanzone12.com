export interface Product {
  id: string
  nome: string
  descricao: string
  descricaoLonga?: string
  preco: number
  precoAntigo?: number
  aviso?: string
  imagem: string
  imagensAdicionais?: string[]
  categoria: string
  subcategoria?: string
  clube?: string
  liga?: string
  temporada?: string
  cor?: string
  material?: string
  marca?: string
  avaliacao?: number
  numAvaliacoes?: number
  destaque?: boolean
  tamanhosCrianca?: string[]
  tamanhos?: string[]
  cores?: string[]
  caracteristicas?: string[]
  tags?: string[]
  stock?: number
  promocao?: boolean
  novo?: boolean
  edicao_especial?: boolean
  preVenda?: boolean
  // Campos para capas de telemóvel
  marcaTelemovel?: "Apple" | "Samsung"
  modeloTelemovel?: string
  personalizacaoNomeNumero?: boolean // true = permite personalizar com nome e número
  padrao?: string[] // Números/textos padrão para personalização
  marcas?: boolean // true = este produto deve aparecer no filtro de marcas
  tematicas?: boolean // true = este produto deve aparecer no filtro de temáticas
}

export type CartItem = Product & {
  quantidade: number
  tamanho: string
  tamanhoSelecionado: string
  personalizacao?: Personalizacao
}

export interface Personalizacao {
  nome?: string
  numero?: number
  patches?: string[]
  fonte?: "liga-betclic" | "clube" | "champions-liga-europa"
  cor?: string
  padrao?: string
  ativar: boolean
}

export const tamanhosCrianca = ["02-03", "03-04", "04-05", "05-06", "06-07", "08-09", "10-11", "12-13"] as const

export const tamanhosBebe = ["0 a 6 meses", "6 a 12 meses"] as const

// Modelos de iPhone para capas
export const modelosApple = [
  "iPhone 17",
  "iPhone 17 Pro",
  "iPhone 17 Pro Max",
  "Apple iPhone Air",
  "iPhone 16",
  "iPhone 16e",
  "iPhone 16 Pro",
  "iPhone 16 Pro Max",
  "iPhone 16 Plus",
  "iPhone 15",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  "iPhone 15 Plus",
  "iPhone 14",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 14 Plus",
  "Iphone 13",
  "IPhone 13 pro",
  "iPhone 13 Pro Max",
  "iPhone 12",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone XR",
  "iPhone XS Max",
  "IPhone X/XS",
  "iPhone 7/8 Plus",
  "iPhone 7/8",
  "iPhone 6/6s",
  "iPhone 6/6s Plus",
] as const

// Modelos Samsung Galaxy para capas
export const modelosSamsung = [
  "Galaxy S25",
  "Galaxy S25 Plus",
  "Galaxy S25 Ultra",
  "Galaxy S25 Edge",
  "Galaxy S24 Ultra 5G",
  "Galaxy S24 Ultra",
  "Galaxy S24 FE",
  "Galaxy S24",
  "Galaxy S24+",
  "Galaxy S23+",
  "Galaxy S23 Ultra",
  "Galaxy S23 FE",
  "Galaxy S23",
  "Galaxy S22+",
  "Galaxy S22 Ultra",
  "Galaxy S22 5G",
  "Galaxy S21+ 5G",
  "Galaxy S21 Ultra 5G",
  "Galaxy S21 Ultra",
  "Galaxy S21 FE 5G",
  "Galaxy S21 5G",
  "Galaxy S20+",
  "Galaxy S20 Ultra",
  "Galaxy S20 Plus",
  "Galaxy S20 FE",
  "Galaxy S20",
] as const

export type ModeloApple = typeof modelosApple[number]
export type ModeloSamsung = typeof modelosSamsung[number]
