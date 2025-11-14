# 📱 GUIA DE CAPAS DE TELEMÓVEL - fanzone12.pt

## 🎯 CATEGORIA: CAPAS DE TELEMÓVEL

Este documento explica como adicionar e configurar produtos de capas de telemóvel no sistema.

---

## 📋 ESTRUTURA BÁSICA

### **Categoria Principal**
- **Campo**: `"categoria": "capas"`
- **Subcategoria**: `"capas-telemovel"`

---

## 🏷️ MARCAS SUPORTADAS

O sistema suporta duas marcas de telemóveis:

### **1. Apple (iPhone)**
- **Campo**: `"marcaTelemovel": "Apple"`
- Total de modelos: 36

### **2. Samsung (Galaxy)**
- **Campo**: `"marcaTelemovel": "Samsung"`
- Total de modelos: 26

---

## 📱 MODELOS DISPONÍVEIS

### **APPLE - MODELOS IPHONE**

```json
"modeloTelemovel": "iPhone 17"
"modeloTelemovel": "iPhone 17 Pro"
"modeloTelemovel": "iPhone 17 Pro Max"
"modeloTelemovel": "Apple iPhone Air"
"modeloTelemovel": "iPhone 16"
"modeloTelemovel": "iPhone 16e"
"modeloTelemovel": "iPhone 16 Pro"
"modeloTelemovel": "iPhone 16 Pro Max"
"modeloTelemovel": "iPhone 16 Plus"
"modeloTelemovel": "iPhone 15"
"modeloTelemovel": "iPhone 15 Pro"
"modeloTelemovel": "iPhone 15 Pro Max"
"modeloTelemovel": "iPhone 15 Plus"
"modeloTelemovel": "iPhone 14"
"modeloTelemovel": "iPhone 14 Pro"
"modeloTelemovel": "iPhone 14 Pro Max"
"modeloTelemovel": "iPhone 14 Plus"
"modeloTelemovel": "Iphone 13"
"modeloTelemovel": "IPhone 13 pro"
"modeloTelemovel": "iPhone 13 Pro Max"
"modeloTelemovel": "iPhone 12"
"modeloTelemovel": "iPhone 12 Pro"
"modeloTelemovel": "iPhone 12 Pro Max"
"modeloTelemovel": "iPhone 11"
"modeloTelemovel": "iPhone 11 Pro"
"modeloTelemovel": "iPhone 11 Pro Max"
"modeloTelemovel": "iPhone XR"
"modeloTelemovel": "iPhone XS Max"
"modeloTelemovel": "IPhone X/XS"
"modeloTelemovel": "iPhone 7/8 Plus"
"modeloTelemovel": "iPhone 7/8"
"modeloTelemovel": "iPhone 6/6s"
"modeloTelemovel": "iPhone 6/6s Plus"
```

### **SAMSUNG - MODELOS GALAXY**

```json
"modeloTelemovel": "Galaxy S25"
"modeloTelemovel": "Galaxy S25 Plus"
"modeloTelemovel": "Galaxy S25 Ultra"
"modeloTelemovel": "Galaxy S25 Edge"
"modeloTelemovel": "Galaxy S24 Ultra 5G"
"modeloTelemovel": "Galaxy S24 Ultra"
"modeloTelemovel": "Galaxy S24 FE"
"modeloTelemovel": "Galaxy S24"
"modeloTelemovel": "Galaxy S24+"
"modeloTelemovel": "Galaxy S23+"
"modeloTelemovel": "Galaxy S23 Ultra"
"modeloTelemovel": "Galaxy S23 FE"
"modeloTelemovel": "Galaxy S23"
"modeloTelemovel": "Galaxy S22+"
"modeloTelemovel": "Galaxy S22 Ultra"
"modeloTelemovel": "Galaxy S22 5G"
"modeloTelemovel": "Galaxy S21+ 5G"
"modeloTelemovel": "Galaxy S21 Ultra 5G"
"modeloTelemovel": "Galaxy S21 Ultra"
"modeloTelemovel": "Galaxy S21 FE 5G"
"modeloTelemovel": "Galaxy S21 5G"
"modeloTelemovel": "Galaxy S20+"
"modeloTelemovel": "Galaxy S20 Ultra"
"modeloTelemovel": "Galaxy S20 Plus"
"modeloTelemovel": "Galaxy S20 FE"
"modeloTelemovel": "Galaxy S20"
```

---

## ✨ PERSONALIZAÇÃO

### **Personalização com Nome e Número**

Para ativar a personalização com nome e número numa capa:

```json
"personalizacaoNomeNumero": true
```

Quando `personalizacaoNomeNumero` está definido como `true`:
- O cliente pode adicionar um **nome** personalizado na capa
- O cliente pode adicionar um **número** personalizado na capa
- **GRATUITO**: Personalização sem custo adicional

---

## 📝 EXEMPLO COMPLETO - CAPA COM PERSONALIZAÇÃO

```json
{
  "id": "capa-iphone-16-personalizada",
  "nome": "Capa iPhone 16 Pro Transparente Personalizada",
  "descricao": "Capa de proteção para iPhone 16 Pro com possibilidade de personalização",
  "descricaoLonga": "Capa premium de proteção para iPhone 16 Pro. Material resistente e transparente. Possibilidade de adicionar nome e número personalizados.",
  "preco": 11.99,
  "imagem": "/images/capas/iphone-16-pro-transparente.jpg",
  "categoria": "capas",
  "subcategoria": "capas-telemovel",
  "marcaTelemovel": "Apple",
  "modeloTelemovel": "iPhone 16 Pro",
  "personalizacaoNomeNumero": true,
  "stock": 50,
  "novo": true
}
```

---

## 📝 EXEMPLO COMPLETO - CAPA SEM PERSONALIZAÇÃO

```json
{
  "id": "capa-galaxy-s25-ultra",
  "nome": "Capa Galaxy S25 Ultra Preta",
  "descricao": "Capa de proteção para Samsung Galaxy S25 Ultra",
  "descricaoLonga": "Capa premium de proteção para Galaxy S25 Ultra. Material resistente e elegante em cor preta.",
  "preco": 11.99,
  "imagem": "/images/capas/galaxy-s25-ultra-preta.jpg",
  "categoria": "capas",
  "subcategoria": "capas-telemovel",
  "marcaTelemovel": "Samsung",
  "modeloTelemovel": "Galaxy S25 Ultra",
  "personalizacaoNomeNumero": false,
  "stock": 30,
  "novo": true
}
```

---

## 🔍 FILTRAGEM E NAVEGAÇÃO

### **URLs de Categoria**

- **Todas as capas**: `/catalogo/capas`
- **Capas Apple**: `/catalogo/capas?marca=Apple`
- **Capas Samsung**: `/catalogo/capas?marca=Samsung`

### **Campos de Filtro**

```typescript
// Filtrar por marca
marcaTelemovel: "Apple" | "Samsung"

// Filtrar por modelo específico
modeloTelemovel: string

// Filtrar capas com personalização
personalizacaoNomeNumero: true
```

---

## ✅ CHECKLIST PARA ADICIONAR UMA CAPA

Ao adicionar um novo produto de capa, certifique-se de:

- [ ] `categoria`: "capas"
- [ ] `subcategoria`: "capas-telemovel"
- [ ] `marcaTelemovel`: "Apple" ou "Samsung"
- [ ] `modeloTelemovel`: Um modelo válido da lista acima
- [ ] `personalizacaoNomeNumero`: true (se permite personalização) ou false
- [ ] `nome`: Deve incluir a marca e modelo (ex: "Capa iPhone 16 Pro...")
- [ ] `imagem`: Foto do produto
- [ ] `preco`: 11.99 (preço padrão - personalização é GRATUITA)
- [ ] `stock`: Quantidade disponível

---

## 💰 PREÇOS E PERSONALIZAÇÃO

### **Preço Padrão**
- Todas as capas têm o mesmo preço base
- Preço recomendado: `"preco": 11.99`

### **Personalização GRATUITA**
- Se `personalizacaoNomeNumero: true`
- Cliente pode adicionar nome e/ou número **SEM CUSTO ADICIONAL**
- Preço final: `11.99€` (mesmo com personalização)

---

## 🎨 CAMPOS OPCIONAIS ÚTEIS

```json
{
  "cor": "Transparente",          // Cor da capa
  "material": "Silicone",          // Material
  "caracteristicas": [
    "Anti-queda",
    "Anti-risco",
    "Ultra fina"
  ],
  "tags": ["proteção", "premium", "transparente"],
  "destaque": true,                // Destacar na página principal
  "promocao": true,                // Em promoção
  "precoAntigo": 19.99            // Preço anterior (se em promoção)
}
```

---

## 🚀 CONFIGURAÇÃO AUTOMÁTICA

Quando um produto tem:
- `categoria: "capas"`
- `subcategoria: "capas-telemovel"`

O sistema automaticamente:
1. ✅ Mostra seletor de marca (se aplicável)
2. ✅ Mostra seletor de modelo (se aplicável)
3. ✅ Mostra opções de personalização GRATUITA (se `personalizacaoNomeNumero: true`)
4. ✅ Mantém o mesmo preço (personalização não adiciona custo)
5. ✅ Não mostra seletor de tamanho (capas não têm tamanhos como camisolas)

---

## 📞 SUPORTE

Para dúvidas ou problemas com a configuração de capas, consulte:
- `lib/types.ts` - Definições de tipos
- `docs/guia-categorias-completo.md` - Guia geral de categorias

