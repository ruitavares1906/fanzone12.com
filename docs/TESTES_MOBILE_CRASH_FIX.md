# 📱 Testes Obrigatórios - Correção de Crash Mobile

## 🎯 Objetivo
Verificar se as correções implementadas resolveram os crashes intermitentes em dispositivos móveis.

## ✅ Alterações Implementadas

### Scripts Removidos:
- ❌ Facebook Pixel (completamente removido)
- ❌ Trustpilot Widget (substituído por imagem estática)
- ❌ Vercel Speed Insights (removido do código e dependências)

### Scripts Mantidos:
- ✅ Google Tag Manager (com sistema de consentimento)
- ✅ Todos os scripts internos do Next.js (preservados)

### Melhorias Implementadas:
- ✅ Sistema de consentimento para tracking
- ✅ Carregamento condicional de scripts
- ✅ Proteções contra duplicação
- ✅ Captura de erros para diagnóstico
- ✅ Trustpilot como imagem estática + link

## 📱 Cenários de Teste

### 1. iPhone Safari (WebKit)
**Teste em modo incógnito:**
- [ ] Aceder a https://www.fanzone12.pt/
- [ ] Verificar se a página abre sem erro "não foi possível aceder ao site"
- [ ] Testar navegação: Home → Catálogo → Produto
- [ ] Testar carrinho: Adicionar produto → Ver carrinho
- [ ] Testar autenticação: Login → Dashboard
- [ ] Verificar se o banner de consentimento aparece
- [ ] Testar aceitar/recusar cookies
- [ ] Verificar se Google Tag Manager carrega apenas com consentimento

**Teste após limpar cache:**
- [ ] Limpar cache do Safari
- [ ] Aceder novamente ao site
- [ ] Verificar se não há crashes

### 2. iPhone Chrome (WebKit)
**Teste em modo incógnito:**
- [ ] Aceder a https://www.fanzone12.pt/
- [ ] Verificar se a página abre sem erro "não foi possível aceder ao site"
- [ ] Testar navegação: Home → Catálogo → Produto
- [ ] Testar carrinho: Adicionar produto → Ver carrinho
- [ ] Testar autenticação: Login → Dashboard
- [ ] Verificar se o banner de consentimento aparece
- [ ] Testar aceitar/recusar cookies
- [ ] Verificar se Google Tag Manager carrega apenas com consentimento

**Teste após limpar cache:**
- [ ] Limpar cache do Chrome
- [ ] Aceder novamente ao site
- [ ] Verificar se não há crashes

### 3. Android Chrome
**Teste em modo incógnito:**
- [ ] Aceder a https://www.fanzone12.pt/
- [ ] Verificar se a página abre sem erro "não foi possível aceder ao site"
- [ ] Testar navegação: Home → Catálogo → Produto
- [ ] Testar carrinho: Adicionar produto → Ver carrinho
- [ ] Testar autenticação: Login → Dashboard
- [ ] Verificar se o banner de consentimento aparece
- [ ] Testar aceitar/recusar cookies
- [ ] Verificar se Google Tag Manager carrega apenas com consentimento

**Teste após limpar cache:**
- [ ] Limpar cache do Chrome
- [ ] Aceder novamente ao site
- [ ] Verificar se não há crashes

## 🔍 Verificações Específicas

### Trustpilot
- [ ] Verificar se aparece apenas a imagem estática (sem widget)
- [ ] Testar se o link funciona corretamente
- [ ] Confirmar que não há scripts do Trustpilot a carregar

### Google Tag Manager
- [ ] Verificar se só carrega após aceitar cookies
- [ ] Confirmar que não há duplicação de scripts
- [ ] Testar se funciona corretamente após consentimento

### Performance
- [ ] Verificar se a página carrega mais rapidamente
- [ ] Confirmar que não há bloqueios de carregamento
- [ ] Testar em conexões lentas (3G)

## 📊 Logs de Teste

### Console Logs a Verificar:
```
✅ "Error capture initialized for development"
✅ "🔍 Error capture initialized for development"
❌ Nenhum erro de ChunkLoadError
❌ Nenhum erro de script externo
```

### Network Tab:
- ❌ Não deve haver requests para:
  - `connect.facebook.net`
  - `widget.trustpilot.com`
  - `_vercel/speed-insights`
- ✅ Deve haver requests para:
  - `googletagmanager.com` (apenas após consentimento)

## 🚨 Critérios de Sucesso

### ✅ Sucesso:
- Página abre sempre sem erro "não foi possível aceder ao site"
- Navegação funciona normalmente
- Carrinho e checkout funcionam
- Autenticação funciona
- Trustpilot mostra apenas imagem estática
- Google Tag Manager carrega apenas com consentimento
- Performance melhorada

### ❌ Falha:
- Ainda há crashes intermitentes
- Erro "Um problema ocorreu repetidamente"
- Scripts externos ainda a carregar
- Funcionalidades quebradas

## 📝 Documentação de Teste

**Data do Teste:** ___________
**Dispositivo:** ___________
**Navegador:** ___________
**Versão:** ___________
**Conexão:** ___________

**Resultados:**
- [ ] ✅ Sucesso total
- [ ] ⚠️ Sucesso com observações
- [ ] ❌ Falha

**Observações:**
_________________________________
_________________________________
_________________________________

## 🔄 Plano de Rollback

Se os testes falharem:
1. Reverter para a branch anterior
2. Fazer redeploy do commit anterior
3. Documentar problemas encontrados
4. Revisar alterações antes de nova tentativa

**Comando de rollback:**
```bash
git checkout main
git pull origin main
# Fazer redeploy
```
