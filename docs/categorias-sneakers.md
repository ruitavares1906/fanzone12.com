# 📋 Guia de Categorias de Sneakers

## 🎯 Sistema de Organização

Este documento serve como guia para categorizar produtos de sneakers no sistema.

---

## 🔥 Nike (6 categorias)

| Categoria | URL | Filtro Marca | Filtro Nome |
|-----------|-----|--------------|-------------|
| Air Force 1 Low | `/catalogo/air-force-1-low` | "nike" | "air force 1 low" |
| Air Jordan 1 Low | `/catalogo/air-jordan-1-low` | "nike" | "air jordan 1 low" |
| Air Force 1 High | `/catalogo/air-force-1-high` | "nike" | "air force 1 high" |
| Air Force 1 Fontanka | `/catalogo/air-force-1-fontanka` | "nike" | "air force 1 fontanka" |
| Air Force Shadow | `/catalogo/air-force-shadow` | "nike" | "air force shadow" |
| Dunk SB | `/catalogo/dunk-sb` | "nike" | "dunk sb" |

---

## 🟢 Adidas (5 categorias)

| Categoria | URL | Filtro Marca | Filtro Nome |
|-----------|-----|--------------|-------------|
| Originals Samba | `/catalogo/samba` | "adidas" | "samba" |
| Originals Gazelle | `/catalogo/gazelle` | "adidas" | "gazelle" |
| Superstar | `/catalogo/superstar` | "adidas" | "superstar" |
| Handball SPZL | `/catalogo/handball-spzl` | "adidas" | "handball spzl" |
| Campus | `/catalogo/campus` | "adidas" | "campus" |

---

## ⚫ New Balance (16 categorias)

| Categoria | URL | Filtro Marca | Filtro Nome |
|-----------|-----|--------------|-------------|
| 990 | `/catalogo/nb-990` | "new balance" | "990" |
| 991 | `/catalogo/nb-991` | "new balance" | "991" |
| 992 | `/catalogo/nb-992` | "new balance" | "992" |
| 993 | `/catalogo/nb-993` | "new balance" | "993" |
| 997 | `/catalogo/nb-997` | "new balance" | "997" |
| 998 | `/catalogo/nb-998` | "new balance" | "998" |
| 999 | `/catalogo/nb-999` | "new balance" | "999" |
| 2002R | `/catalogo/nb-2002r` | "new balance" | "2002r" |
| 327 | `/catalogo/nb-327` | "new balance" | "327" |
| 530 | `/catalogo/nb-530` | "new balance" | "530" |
| 550 | `/catalogo/nb-550` | "new balance" | "550" |
| 574 | `/catalogo/nb-574` | "new balance" | "574" |
| 610 | `/catalogo/nb-610` | "new balance" | "610" |
| 1906R | `/catalogo/nb-1906r` | "new balance" | "1906r" |
| 9060 | `/catalogo/nb-9060` | "new balance" | "9060" |
| 410 | `/catalogo/nb-410` | "new balance" | "410" |
| 1000 | `/catalogo/nb-1000` | "new balance" | "1000" |

---

## 📝 Como Adicionar Produtos

### 1. Campos Obrigatórios:
- **marca**: "nike", "adidas", ou "new balance"
- **subcategoria**: "sneakers"
- **nome**: deve conter o modelo específico

### 2. Exemplos Práticos:

#### ✅ Nike Air Force 1 Low
```json
{
  "marca": "nike",
  "subcategoria": "sneakers", 
  "nome": "nike air force 1 low branco"
}
```
→ Aparece em: `/catalogo/air-force-1-low`

#### ✅ Adidas Samba
```json
{
  "marca": "adidas",
  "subcategoria": "sneakers",
  "nome": "adidas samba verde"
}
```
→ Aparece em: `/catalogo/samba`

#### ✅ New Balance 990
```json
{
  "marca": "new balance",
  "subcategoria": "sneakers",
  "nome": "new balance 990 cinza"
}
```
→ Aparece em: `/catalogo/nb-990`

---

## 🔗 Páginas de Referência

- **Guia Visual**: `/categorias` - Página com interface visual de todas as categorias
- **Nike**: `/sneakers/nike` - Página da marca com cards de categorias
- **Adidas**: `/sneakers/adidas` - Página da marca com cards de categorias  
- **New Balance**: `/sneakers/new-balance` - Página da marca (sem categorias)

---

## ⚠️ Notas Importantes

1. **Case Sensitive**: Os filtros são case-insensitive, mas é melhor usar minúsculas
2. **Espaços**: Use espaços normais, não hífens no nome do produto
3. **Consistência**: Mantenha sempre o mesmo formato para a marca
4. **Teste**: Sempre teste se o produto aparece na categoria correta

---

**Total de Categorias**: 27 (6 Nike + 5 Adidas + 16 New Balance)
