# E-commerce website

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ruis-projects-cdb178f5/v0-e-commerce-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/d40p7X3eYFb)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/ruis-projects-cdb178f5/v0-e-commerce-website](https://vercel.com/ruis-projects-cdb178f5/v0-e-commerce-website)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/d40p7X3eYFb](https://v0.dev/chat/projects/d40p7X3eYFb)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Otimizações de Performance Implementadas

### Otimização de Imagens (LCP - Largest Contentful Paint)

Para melhorar significativamente o desempenho e especificamente o LCP, foram implementadas as seguintes otimizações:

#### 1. **Preloading de Imagens Críticas**
- Adicionado preload da imagem do herói (`hero-cr7.webp`) no `<head>` da aplicação
- Preload da primeira imagem de produto (`sccccc.webp`) para carregamento antecipado

#### 2. **Priorização de Imagens Above the Fold**
- **Imagem do herói**: `priority={true}` com `sizes="100vw"` e `quality={85}`
- **Primeira imagem de produto**: `priority={true}` com `sizes="(max-width: 768px) 100vw, 50vw"`

#### 3. **Lazy Loading para Imagens Below the Fold**
- Todas as imagens não críticas agora usam `loading="lazy"`
- Imagens de produtos no grid: `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"`
- Thumbnails de produtos: `sizes="(max-width: 1024px) 50vw, 20vw"`

#### 4. **Otimização de Quality**
- Imagens críticas: `quality={85-90}` para máxima qualidade
- Imagens de produtos: `quality={80}` para balanceamento
- Thumbnails e ícones: `quality={75-85}`

#### 5. **Sizes Apropriados por Contexto**
- **Hero**: `sizes="100vw"` (largura total da viewport)
- **Produtos principais**: `sizes="(max-width: 768px) 100vw, 50vw"`
- **Grid de produtos**: `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"`
- **Logos pequenos**: `sizes="80px"` ou `sizes="24px"`

#### 6. **Imagens Otimizadas por Página**

**Página Principal (`app/page.tsx`)**:
- Herói com priority e preload
- Imagens de produtos com lazy loading
- Logos de clubes otimizados

**Página de Produto (`ProdutoPageClient.tsx`)**:
- Imagem principal com priority
- Galeria de thumbnails com lazy loading
- Tabelas de medidas com lazy loading
- Logos de avaliações otimizados

**ProductCard (`components/product-card.tsx`)**:
- Todas as imagens com lazy loading e sizes responsivos

### Resultados Esperados

Estas otimizações devem reduzir significativamente o tempo de LCP de ~35s para valores muito menores:

- **Preload**: Reduz TTFB e início de carregamento da imagem crítica
- **Priority**: Garante que navegador prioriza imagens above the fold
- **Lazy Loading**: Reduz o número de requests iniciais
- **Sizes Apropriados**: Carrega resolução adequada para cada dispositivo
- **Quality Otimizado**: Reduz tamanho dos arquivos mantendo qualidade visual

### Monitoramento

Para verificar melhorias:
1. Use Google PageSpeed Insights
2. Verifique métricas no Chrome DevTools > Lighthouse
3. Monitore Core Web Vitals especialmente o LCP
