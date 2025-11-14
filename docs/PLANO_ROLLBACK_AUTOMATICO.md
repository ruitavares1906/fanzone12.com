# 🔄 Plano de Rollback Automático - Correção Mobile Crash

## 🎯 Objetivo
Procedimento automático para reverter alterações em caso de falha grave nos primeiros 10 minutos após deploy.

## ⚠️ Critérios para Rollback Automático

### Falhas Críticas (Rollback Imediato):
- ❌ Health check falha (status 5xx)
- ❌ Erro 500 em mais de 50% das requests
- ❌ Site completamente inacessível
- ❌ Erro de build em produção
- ❌ Crash do servidor

### Falhas Moderadas (Monitorar 5 minutos):
- ⚠️ Performance degradada > 30%
- ⚠️ Erros 4xx em > 20% das requests
- ⚠️ Timeout em requests críticas

## 🚀 Procedimento de Rollback

### 1. Rollback Imediato (0-2 minutos)
```bash
# 1. Reverter para commit anterior
git checkout main
git pull origin main

# 2. Forçar redeploy
git push origin main --force

# 3. Verificar status
curl -I https://www.fanzone12.pt/
```

### 2. Rollback com Verificação (2-5 minutos)
```bash
# 1. Verificar logs de erro
# 2. Identificar problema específico
# 3. Reverter apenas alterações problemáticas
# 4. Deploy seletivo
```

### 3. Rollback Completo (5-10 minutos)
```bash
# 1. Reverter para branch anterior
git checkout cleanup/scripts-fanzone12

# 2. Fazer merge para main
git checkout main
git merge cleanup/scripts-fanzone12

# 3. Deploy
git push origin main
```

## 📊 Monitorização Automática

### Health Checks:
```bash
# Verificar se o site responde
curl -f https://www.fanzone12.pt/ || echo "SITE DOWN"

# Verificar API endpoints
curl -f https://www.fanzone12.pt/api/health || echo "API DOWN"

# Verificar tempo de resposta
curl -w "@curl-format.txt" -o /dev/null -s https://www.fanzone12.pt/
```

### Scripts de Monitorização:
```bash
#!/bin/bash
# monitor-health.sh

SITE_URL="https://www.fanzone12.pt/"
MAX_RESPONSE_TIME=5000  # 5 segundos
ERROR_THRESHOLD=5       # 5% de erro

# Verificar resposta
RESPONSE_TIME=$(curl -w "%{time_total}" -o /dev/null -s "$SITE_URL")
HTTP_CODE=$(curl -w "%{http_code}" -o /dev/null -s "$SITE_URL")

if [ "$HTTP_CODE" != "200" ]; then
    echo "ALERT: Site returned $HTTP_CODE"
    # Trigger rollback
    ./rollback.sh
elif [ $(echo "$RESPONSE_TIME > $MAX_RESPONSE_TIME" | bc) -eq 1 ]; then
    echo "ALERT: Response time $RESPONSE_TIME exceeds threshold"
    # Monitor for 2 more minutes
fi
```

## 🔍 Verificações Pós-Rollback

### 1. Verificar Funcionalidade:
- [ ] Site acessível
- Homepage carrega corretamente
- Navegação funciona
- Carrinho funciona
- Login funciona

### 2. Verificar Performance:
- [ ] Tempo de resposta < 3 segundos
- [ ] Sem erros 5xx
- [ ] Scripts carregam corretamente

### 3. Verificar Mobile:
- [ ] iPhone Safari funciona
- [ ] iPhone Chrome funciona
- [ ] Android Chrome funciona

## 📝 Logs de Rollback

### Template de Log:
```
ROLLBACK LOG
============
Data: ___________
Hora: ___________
Motivo: ___________
Commit Anterior: ___________
Commit Problemático: ___________
Tempo de Rollback: ___________
Status Pós-Rollback: ___________
Observações: ___________
```

## 🚨 Alertas Automáticos

### Configuração de Alertas:
```yaml
# alertas.yml
alerts:
  - name: "Site Down"
    condition: "http_status != 200"
    action: "rollback_immediate"
    
  - name: "High Error Rate"
    condition: "error_rate > 20%"
    action: "rollback_after_5min"
    
  - name: "Performance Degraded"
    condition: "response_time > 5s"
    action: "monitor_and_alert"
```

## 📞 Contatos de Emergência

### Em Caso de Rollback:
1. **Notificar equipa** via Slack/Teams
2. **Documentar problema** no GitHub Issues
3. **Agendar revisão** para identificar causa
4. **Planejar correção** para próxima iteração

## ✅ Checklist de Rollback

### Antes do Deploy:
- [ ] Backup completo feito
- [ ] Branch de rollback preparada
- [ ] Scripts de monitorização ativos
- [ ] Equipa notificada

### Durante o Deploy:
- [ ] Monitorizar health checks
- [ ] Verificar logs de erro
- [ ] Testar funcionalidades críticas
- [ ] Verificar performance

### Após Rollback:
- [ ] Confirmar site funcional
- [ ] Verificar todos os endpoints
- [ ] Testar em dispositivos móveis
- [ ] Documentar lições aprendidas

## 🔧 Comandos de Emergência

### Rollback Rápido:
```bash
# Reverter para commit anterior
git reset --hard HEAD~1
git push origin main --force

# Verificar status
curl -I https://www.fanzone12.pt/
```

### Rollback para Branch Específica:
```bash
# Voltar para branch de backup
git checkout cleanup/scripts-fanzone12
git checkout main
git reset --hard cleanup/scripts-fanzone12
git push origin main --force
```

---

**⚠️ IMPORTANTE:** Este plano deve ser executado apenas em caso de falha grave. Para problemas menores, usar rollback seletivo.
