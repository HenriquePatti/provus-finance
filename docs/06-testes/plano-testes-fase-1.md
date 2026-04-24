# 📘 Plano de Testes — Fase 1 (Fundação)

> Plano tático de execução dos testes da Fase 1 do Provus Finance, alinhado ao contexto ágil, à estratégia de testes e ao roadmap atual do projeto.

---

## 1. Objetivo

Definir o que será testado na Fase 1, em qual ordem, com quais critérios de aceite e quais evidências mínimas serão exigidas para concluir cada entrega com qualidade.

---

## 2. Escopo do plano

### Inclui (Fase 1)
- EP-001 — Gestão de Usuários
- EP-002 — Autenticação
- EP-003 — Gestão de Contas
- EP-004 — Gestão de Categorias
- EP-005 — Gestão de Transações

### Não inclui
- Funcionalidades das fases futuras (2 a 7)
- Testes de frontend e E2E de interface
- Integrações externas fora do escopo atual do produto

---

## 3. Referências (fonte da verdade)

- Estratégia: `docs/06-testes/estrategia-testes.md`
- Regras de negócio: `docs/02-regras-negocio/`
- Contratos da API: `docs/03-arquitetura/api-contratos.md`
- Épicos: `docs/04-epicos/epicos.md`
- User Stories: `docs/05-user-stories/`

> Este plano descreve execução e cobertura. Regras detalhadas permanecem nos documentos originais.

---

## 4. Abordagem de execução

### 4.1 Fluxo por User Story (US)
Para cada US da Fase 1:

1. mapear critérios de aceitação + regras relacionadas
2. definir cenários mínimos (sucesso, validação, segurança e borda)
3. implementar testes automatizados de API
4. executar regressão direcionada do domínio impactado
5. registrar evidência e atualizar rastreabilidade

### 4.2 Tipos de teste aplicados
- **Automatizado API (principal):** Mocha + Chai + Supertest
- **Exploratório manual (complementar):** Postman
- **Performance básica (complementar):** k6 em rotas críticas

---

## 5. Planejamento de cobertura por épico

### EP-001 — Gestão de Usuários
Cobertura mínima:
- cadastro válido/inválido
- e-mail duplicado
- consulta de perfil autenticado
- atualização de perfil
- alteração de senha
- exclusão de conta e efeitos em cascata

### EP-002 — Autenticação
Cobertura mínima:
- login válido
- credenciais inválidas
- token ausente/inválido/expirado
- acesso permitido/bloqueado em rotas protegidas

### EP-003 — Gestão de Contas
Cobertura mínima:
- criação/listagem/consulta/atualização
- soft delete
- validação de campos imutáveis
- saldo calculado por endpoint dedicado

### EP-004 — Gestão de Categorias
Cobertura mínima:
- listagem (padrão + personalizadas)
- criação personalizada
- proteção de categorias padrão
- exclusão com bloqueio por uso em transações

### EP-005 — Gestão de Transações
Cobertura mínima:
- CRUD de transações
- validações de tipo/valor/data/descrição
- compatibilidade categoria x tipo
- filtros principais
- impacto de criação/edição/exclusão no saldo

---

## 6. Priorização por risco (ordem de execução)

1. autenticação e autorização
2. consistência de saldo e regras financeiras
3. integridade referencial (vínculos e exclusões)
4. validações de entrada e códigos de erro
5. regressão de endpoints já estabilizados

---

## 7. Critérios de entrada e saída por ciclo

### Entrada para teste
- US refinada com critérios claros
- endpoint e contrato disponíveis
- regras relacionadas identificadas

### Saída para aceite
- cenários planejados executados
- sem defeitos críticos/altos em aberto
- regressão aplicável executada com sucesso
- evidências mínimas registradas
- rastreabilidade atualizada

---

## 8. Evidências mínimas obrigatórias

Para cada US concluída:
- resultado de execução da suíte automatizada
- referência de testes implementados (arquivo/cenário)
- referência de PR com mudanças
- status de CI
- vínculo US ↔ regra(s) ↔ teste(s)

---

## 9. Critério de conclusão da Fase 1 (qualidade)

A Fase 1 é considerada concluída em qualidade quando:
- US planejadas da fase estiverem cobertas conforme critérios mínimos
- pipeline CI estiver estável (verde) na branch principal
- rastreabilidade estiver atualizada para as entregas realizadas
- não houver pendências críticas/altas sem plano formal de tratamento

---

## 10. Métricas de acompanhamento da fase

- % de US da Fase 1 com testes automatizados
- % de regras cobertas por pelo menos um teste
- taxa de sucesso da suíte no CI
- tempo médio de execução da suíte principal
- quantidade de defeitos por severidade por épico

---

## 11. Governança e atualização do plano

Este plano deve ser atualizado:
- a cada fechamento de US relevante
- quando houver mudança de prioridade de risco
- quando houver alteração de contrato/API que impacte cobertura
- ao final da Fase 1 para registrar lições aprendidas
