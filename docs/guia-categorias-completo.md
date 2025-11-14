# 📋 GUIA COMPLETO DE CATEGORIAS - fanzone12.pt

## 🎯 CATEGORIAS PRINCIPAIS DO SISTEMA

### **1. SNEAKERS** (Categoria Principal)
- **Campo**: `"categoria": "sneakers"`
- **Subcategoria**: `"subcategoria": "sneakers"`
- **Usar para**: Todos os sneakers (Nike, Adidas, New Balance, etc.)

---

## 🔥 NIKE - CATEGORIAS ESPECÍFICAS

### **Air Force 1 Low**
- **Categoria**: `"categoria": "air-force-1-low"`
- **Nome**: Deve conter `"air force 1 low"`
- **Exemplo**: `"nome": "Nike Air Force 1 Low Branco"`

### **Air Jordan 1 Low**
- **Categoria**: `"categoria": "air-jordan-1-low"`
- **Nome**: Deve conter `"air jordan 1 low"`
- **Exemplo**: `"nome": "Nike Air Jordan 1 Low Vermelho"`

### **Air Force 1 High**
- **Categoria**: `"categoria": "air-force-1-high"`
- **Nome**: Deve conter `"air force 1 high"`
- **Exemplo**: `"nome": "Nike Air Force 1 High Preto"`

### **Air Force 1 Fontanka**
- **Categoria**: `"categoria": "air-force-1-fontanka"`
- **Nome**: Deve conter `"air force 1 fontanka"`
- **Exemplo**: `"nome": "Nike Air Force 1 Fontanka Azul"`

### **Air Force Shadow**
- **Categoria**: `"categoria": "air-force-shadow"`
- **Nome**: Deve conter `"air force shadow"`
- **Exemplo**: `"nome": "Nike Air Force Shadow Cinza"`

### **Dunk SB**
- **Categoria**: `"categoria": "dunk-sb"`
- **Nome**: Deve conter `"dunk sb"`
- **Exemplo**: `"nome": "Nike Dunk SB Low Branco"`

---

## 🟢 ADIDAS - CATEGORIAS ESPECÍFICAS

### **Originals Samba**
- **Categoria**: `"categoria": "samba"`
- **Nome**: Deve conter `"samba"`
- **Exemplo**: `"nome": "Adidas Originals Samba Verde"`

### **Originals Gazelle**
- **Categoria**: `"categoria": "gazelle"`
- **Nome**: Deve conter `"gazelle"`
- **Exemplo**: `"nome": "Adidas Originals Gazelle Azul"`

### **Superstar**
- **Categoria**: `"categoria": "superstar"`
- **Nome**: Deve conter `"superstar"`
- **Exemplo**: `"nome": "Adidas Superstar Branco"`

### **Handball SPZL**
- **Categoria**: `"categoria": "handball-spzl"`
- **Nome**: Deve conter `"handball spzl"`
- **Exemplo**: `"nome": "Adidas Originals Handball SPZL Preto"`

### **Campus**
- **Categoria**: `"categoria": "campus"`
- **Nome**: Deve conter `"campus"`
- **Exemplo**: `"nome": "Adidas Campus Branco"`

---

## ⚫ NEW BALANCE - CATEGORIA ÚNICA

### **Todos os Modelos New Balance**
- **Categoria**: `"categoria": "newbalance"`
- **Nome**: Qualquer modelo New Balance
- **Exemplo**: `"nome": "New Balance 990 Cinza"`
- **Exemplo**: `"nome": "New Balance 550 Azul"`
- **Exemplo**: `"nome": "New Balance 2002R Rosa"`

**Nota**: Todos os produtos New Balance vão para a mesma categoria "newbalance" - não precisas de separar por modelo!

---

## 🏆 OUTRAS CATEGORIAS EXISTENTES

### **Camisolas de Clubes**
- **Categoria**: `"categoria": "clubes"`
- **Subcategoria**: `"subcategoria": "camisolas"`
- **Usar para**: Camisolas de futebol de clubes

### **Camisolas Retro**
- **Categoria**: `"categoria": "retro"`
- **Subcategoria**: `"subcategoria": "camisolas"`
- **Usar para**: Camisolas retro/vintage

### **Camisolas de Criança**
- **Categoria**: `"categoria": "crianca"`
- **Subcategoria**: `"subcategoria": "camisolas"`
- **Usar para**: Camisolas para crianças

### **Camisolas Adulto**
- **Categoria**: `"categoria": "adulto"`
- **Subcategoria**: `"subcategoria": "camisolas"`
- **Usar para**: Camisolas para adultos

---

## 📱 CAPAS DE TELEMÓVEL

### **Capas Apple (iPhone)**
- **Categoria**: `"categoria": "capas"`
- **Subcategoria**: `"subcategoria": "capas-telemovel"`
- **Marca Telemóvel**: `"marcaTelemovel": "Apple"`
- **Modelo**: `"modeloTelemovel": "iPhone 16 Pro"` (exemplo)
- **Personalização**: `"personalizacaoNomeNumero": true` (opcional)
- **Usar para**: Capas para iPhone

### **Capas Samsung (Galaxy)**
- **Categoria**: `"categoria": "capas"`
- **Subcategoria**: `"subcategoria": "capas-telemovel"`
- **Marca Telemóvel**: `"marcaTelemovel": "Samsung"`
- **Modelo**: `"modeloTelemovel": "Galaxy S25 Ultra"` (exemplo)
- **Personalização**: `"personalizacaoNomeNumero": true` (opcional)
- **Usar para**: Capas para Samsung Galaxy

**Modelos Disponíveis**:
- **Apple**: 36 modelos (iPhone 6/6s até iPhone 17 Pro Max)
- **Samsung**: 26 modelos (Galaxy S20 até Galaxy S25 Ultra)

**Nota sobre Personalização**:
- Quando `personalizacaoNomeNumero: true`, o cliente pode adicionar nome e/ou número
- Personalização GRATUITA (sem custo adicional)

📖 **Ver guia completo**: `docs/guia-capas-telemovel.md`

---

## 📝 EXEMPLOS PRÁTICOS

### ✅ **Nike Air Force 1 Low Branco**
```json
{
  "marca": "Nike",
  "categoria": "air-force-1-low",
  "subcategoria": "sneakers",
  "nome": "Nike Air Force 1 Low Branco"
}
```

### ✅ **Adidas Samba Verde**
```json
{
  "marca": "Adidas",
  "categoria": "samba",
  "subcategoria": "sneakers",
  "nome": "Adidas Originals Samba Verde"
}
```

### ✅ **New Balance 990 Cinza**
```json
{
  "marca": "New Balance",
  "categoria": "newbalance",
  "subcategoria": "sneakers",
  "nome": "New Balance 990 Cinza"
}
```

### ✅ **Camisola Real Madrid**
```json
{
  "marca": "Real Madrid",
  "categoria": "clubes",
  "subcategoria": "camisolas",
  "nome": "Camisola Real Madrid Casa 2024"
}
```

### ✅ **Capa iPhone 16 Pro com Personalização**
```json
{
  "categoria": "capas",
  "subcategoria": "capas-telemovel",
  "marcaTelemovel": "Apple",
  "modeloTelemovel": "iPhone 16 Pro",
  "personalizacaoNomeNumero": true,
  "nome": "Capa iPhone 16 Pro Transparente Personalizada",
  "preco": 15.99
}
```

### ✅ **Capa Galaxy S25 Ultra sem Personalização**
```json
{
  "categoria": "capas",
  "subcategoria": "capas-telemovel",
  "marcaTelemovel": "Samsung",
  "modeloTelemovel": "Galaxy S25 Ultra",
  "personalizacaoNomeNumero": false,
  "nome": "Capa Galaxy S25 Ultra Preta",
  "preco": 14.99
}
```

---

## ⚠️ REGRAS IMPORTANTES

### **1. Consistência de Marca**
- **Nike**: Sempre `"marca": "Nike"`
- **Adidas**: Sempre `"marca": "Adidas"`
- **New Balance**: Sempre `"marca": "New Balance"`

### **2. Case Sensitive**
- Use sempre a primeira letra maiúscula nas marcas
- Use minúsculas nos nomes dos modelos

### **3. Espaços e Caracteres**
- Use espaços normais, não hífens
- Evite caracteres especiais desnecessários

### **4. Teste Sempre**
- Após adicionar um produto, verifica se aparece na categoria correta
- Usa a página `/categorias` para verificar

---

## 🔗 PÁGINAS DE REFERÊNCIA

- **Guia Visual**: `/categorias`
- **Nike**: `/sneakers/nike`
- **Adidas**: `/sneakers/adidas`
- **New Balance**: `/sneakers/new-balance`

---

**📊 TOTAL DE CATEGORIAS**: 14 (6 Nike + 5 Adidas + 1 New Balance + 2 Capas)
