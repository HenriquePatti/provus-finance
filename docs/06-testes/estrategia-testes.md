# 🧪 Estratégia de Testes

> Estratégia de qualidade do Provus Finance no contexto ágil, com foco em testes de API, rastreabilidade e feedback contínuo.

---

## 1. Objetivo

Garantir que cada incremento da API seja entregue com segurança, previsibilidade e aderência às regras de negócio, priorizando validação via fluxo HTTP real.

---

## 2. Escopo da Estratégia

### Inclui
- Testes de API automatizados (camada principal)
- Testes manuais exploratórios com Postman (camada complementar)
- Testes de performance com k6 em rotas críticas (camada complementar)
- Execução contínua no pipeline de CI

### Não inclui (fase atual)
- Testes de frontend
- Testes E2E de interface
- Testes mobile
- Integrações externas fora do escopo do produto

---

## 3. Diretrizes de Qualidade (contexto ágil)

1. **Incremental e orientado a risco**: cada US inclui os testes mínimos para reduzir risco de regressão.
2. **Sem duplicação de documentação**: regras detalhadas permanecem nos documentos de regras de negócio.
3. **Rastreabilidade obrigatória**: cada cenário de teste referencia US e regra(s).
4. **Feedback rápido**: suíte essencial deve ser curta o suficiente para uso frequente no ciclo de desenvolvimento.
5. **Evolução contínua**: cobertura cresce por épico, respeitando a priorização do roadmap.

---

## 4. Referências oficiais do projeto (fonte da verdade)

- Regras de negócio: `docs/02-regras-negocio/`
- Contratos da API: `docs/03-arquitetura/api-contratos.md`
- Épicos e US: `docs/04-epicos/` e `docs/05-user-stories/`
- Stack e arquitetura: `docs/03-arquitetura/`

> Este documento define **como testar**, não reescreve o que já está definido nesses artefatos.

---

## 5. Abordagem de Teste

### 5.1 Camada principal — API automatizada
Ferramentas: Mocha + Chai + Supertest.

Cobertura mínima por endpoint:
- cenário de sucesso
- validações obrigatórias e formatos inválidos
- autenticação/autorização
- erros de regra de negócio
- contrato de resposta (status + estrutura JSON)

### 5.2 Camada complementar — Exploratórios manuais
Ferramenta: Postman.

Uso:
- validações rápidas de fluxo ponta a ponta
- investigação de cenários não cobertos inicialmente na automação
- apoio em refinamento de novos critérios de aceitação

### 5.3 Camada complementar — Performance
Ferramenta: k6.

Uso:
- smoke de performance em endpoints críticos
- baseline inicial de tempo de resposta
- monitoramento de degradação em rotas de maior uso

---

## 6. Rastreabilidade

Padrão obrigatório de vínculo:
- `US-XXX` (história)
- `RG/RU/RC/RK/RT-XXX` (regra)
- endpoint validado

Exemplo de naming:
`[US-001][RU-003] deve retornar 409 para e-mail já cadastrado`

---

## 7. Critérios de qualidade por entrega (US)

Para considerar uma US apta para merge:

- critérios de aceitação implementados em teste
- cenários críticos de erro cobertos
- regressão do domínio impactado executada e verde
- contrato da rota coerente com Swagger
- sem exposição de dados sensíveis em respostas

---

## 8. Critérios de entrada e saída de teste

### Entrada
- US refinada com critérios claros
- regras associadas identificadas
- endpoint e contrato disponíveis

### Saída
- cenários planejados executados
- defeitos críticos/altos resolvidos
- evidências mínimas registradas
- rastreabilidade atualizada

---

## 9. Métricas mínimas de acompanhamento

- % de US com automação implementada
- % de regras cobertas por ao menos um teste
- taxa de sucesso da suíte no CI
- tempo médio da suíte essencial
- quantidade de defeitos por severidade (pré e pós-merge)

---

## 10. Governança e revisão

A estratégia deve ser revisada:
- ao final de cada fase principal
- quando houver mudança relevante de escopo
- quando houver recorrência de falhas em produção/homologação