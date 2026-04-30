# Plano de Testes — Fase 1 (Fundacao)

> Plano tatico de execucao dos testes da Fase 1 do Provus Finance, alinhado ao contexto agil, a estrategia de testes e ao roadmap atual do projeto.

---

## 1. Objetivo

Definir o que sera testado na Fase 1, em qual ordem, com quais criterios de aceite e quais evidencias minimas serao exigidas para concluir cada entrega com qualidade.

---

## 2. Escopo do plano

### Inclui (Fase 1)

| Epico | Descricao | US | Endpoints |
|---|---|---|---|
| EP-001 | Gestao de Usuarios | US-001 a US-005 | 5 |
| EP-002 | Autenticacao | US-006 a US-008 | 1 |
| EP-003 | Gestao de Contas | US-009 a US-014 | 6 |
| EP-004 | Gestao de Categorias | US-015 a US-019 | 5 |
| EP-005 | Gestao de Transacoes | US-020 a US-025 | 5 |
| **Total** | **5 epicos** | **25 US** | **22 endpoints** |

### Nao inclui

- Funcionalidades das fases futuras (2 a 7)
- Testes de frontend e E2E de interface
- Integracoes externas fora do escopo atual do produto

---

## 3. Referencias (fonte da verdade)

| Documento | Caminho |
|---|---|
| Estrategia de Testes | `docs/06-testes/estrategia-testes.md` |
| Regras de negocio | `docs/02-regras-negocio/` |
| Contratos da API | `docs/03-arquitetura/api-contratos.md` |
| Epicos | `docs/04-epicos/epicos.md` |
| User Stories | `docs/05-user-stories/` |
| Casos de Teste | `docs/06-testes/casos-teste-ep-*.md` |

> Este plano descreve execucao e cobertura. Regras detalhadas permanecem nos documentos originais.

---

## 4. Abordagem de execucao

### 4.1 Fluxo por User Story (US)

Para cada US da Fase 1:

1. Mapear criterios de aceitacao + regras relacionadas
2. Documentar casos de teste no formato ISO-29119-3 (`docs/06-testes/`)
3. Implementar testes automatizados de API (Mocha + Chai + Supertest)
4. Criar requests na colecao Postman (`postman/`)
5. Executar regressao direcionada do dominio impactado
6. Gerar relatorio Mochawesome (`npm run test:report`)
7. Registrar evidencia e atualizar rastreabilidade

### 4.2 Tipos de teste aplicados

| Tipo | Ferramenta | Comando | Status |
|---|---|---|---|
| Automatizado API | Mocha + Chai + Supertest | `npm test` | Implementado |
| Relatorio grafico | Mochawesome | `npm run test:report` | Implementado |
| Exploratorio manual | Postman | Colecao v2.1.0 | Implementado |
| Performance basica | k6 | `k6 run` | Planejado (Fase 2) |

---

## 5. Cobertura por epico — Rastreabilidade completa

### EP-001 — Gestao de Usuarios

| US | Endpoint | CTs Documentados | Testes Automatizados | Postman | Regras Cobertas |
|---|---|---|---|---|---|
| US-001 | `POST /api/usuarios` | 14 | 14 | 14 | RU-001 a RU-020, RG-001,RG-004,RG-014,RG-019,RG-020 |
| US-002 | `GET /api/usuarios/me` | 5 | 5 | 5 | RU-028 a RU-030, RG-004,RG-008 a RG-012 |
| US-003 | `PUT /api/usuarios/me` | 6 | 6 | 6 | RU-031 a RU-036, RG-020,RG-046 |
| US-004 | `PUT /api/usuarios/me/senha` | 7 | 7 | 7 | RU-037 a RU-042, RG-001,RG-004 |
| US-005 | `DELETE /api/usuarios/me` | 7 | 7 | — | RU-043 a RU-049, RG-038 |
| **Subtotal** | **5 endpoints** | **39** | **39** | **32** | |

Documentos: `casos-teste-ep-001-usuarios.md` / `ep-001-usuarios.md`

### EP-002 — Autenticacao

| US | Endpoint | CTs Documentados | Testes Automatizados | Postman | Regras Cobertas |
|---|---|---|---|---|---|
| US-006 | `POST /api/auth/login` | 9 | 9 | 9 | RU-021 a RU-027, RG-001,RG-007,RG-013,RG-014,RG-020 |
| US-007 | Middleware `authMiddleware` | — | (coberto nos testes de US-002 a US-006) | — | RG-008 a RG-013 |
| US-008 | Middleware erros de token | — | (coberto nos testes de US-002 a US-006) | — | RG-009 a RG-011,RG-041,RG-042 |
| **Subtotal** | **1 endpoint + middleware** | **9** | **9** | **9** | |

Documentos: `casos-teste-ep-002-autenticacao.md` / `ep-002-autenticacao.md`

### EP-003 — Gestao de Contas

| US | Endpoint | CTs Documentados | Testes Automatizados | Postman | Regras Cobertas |
|---|---|---|---|---|---|
| US-009 | `POST /api/contas` | 9 | 9 | 6 | RC-001 a RC-006, RG-012 |
| US-010 | `GET /api/contas` | 7 | 7 | 4 | RC-010 a RC-013, RG-012 |
| US-011 | `GET /api/contas/:id` | 4 | 4 | 3 | RC-020 a RC-022, RG-012 |
| US-012 | `PUT /api/contas/:id` | 7 | 7 | 4 | RC-030 a RC-034, RG-012 |
| US-013 | `DELETE /api/contas/:id` | 7 | 7 | 3 | RC-040 a RC-043, RG-052,RG-012 |
| US-014 | `GET /api/contas/:id/saldo` | 5 | 5 | 2 | RC-050 a RC-053, RG-012 |
| **Subtotal** | **6 endpoints** | **39** | **39** | **22** | |

Documentos: `casos-teste-ep-003-contas.md` / `ep-003-contas.md`

### EP-004 — Gestao de Categorias

| US | Endpoint | CTs Documentados | Testes Automatizados | Postman | Regras Cobertas |
|---|---|---|---|---|---|
| US-015 | `GET /api/categorias` | 7 | 7 | 4 | RK-002,RK-003,RK-027 a RK-031 |
| US-016 | `POST /api/categorias` | 8 | 8 | 4 | RK-004,RK-008,RK-010 a RK-014,RK-017,RK-020,RK-023 |
| US-017 | `GET /api/categorias/:id` | 5 | 5 | 3 | RK-033 a RK-036 |
| US-018 | `PUT /api/categorias/:id` | 8 | 8 | 4 | RK-037 a RK-042,RK-049 |
| US-019 | `DELETE /api/categorias/:id` | 5 | 5 | 3 | RK-044 a RK-047 |
| **Subtotal** | **5 endpoints** | **33** | **33** | **18** | |

Documentos: `casos-teste-ep-004-categorias.md` / `ep-004-categorias.md`

### EP-005 — Gestao de Transacoes

| US | Endpoint | CTs Documentados | Testes Automatizados | Postman | Regras Cobertas |
|---|---|---|---|---|---|
| US-020 | `POST /api/transacoes` | 11 | 11 | 6 | RT-001,RT-004 a RT-009,RT-013,RT-019,RT-025,RT-028,RT-029,RT-066,RK-005 |
| US-021 | `GET /api/transacoes` | 6 | 6 | 4 | RT-036 a RT-044,RT-074 |
| US-022 | `GET /api/transacoes/:id` | 4 | 4 | 2 | RT-049 a RT-051 |
| US-023 | `PUT /api/transacoes/:id` | 8 | 8 | 4 | RT-033,RT-034,RT-053,RT-054,RT-059 |
| US-024 | `DELETE /api/transacoes/:id` | 6 | 6 | 2 | RT-060,RT-062,RT-064,RT-065,RT-068 |
| US-025 | `GET /api/transacoes?q=` | 5 | 5 | 3 | RT-045,RT-046,RT-074 |
| **Subtotal** | **5 endpoints** | **40** | **40** | **21** | |

Documentos: `casos-teste-ep-005-transacoes.md` / `ep-005-transacoes.md`

---

## 6. Resumo de cobertura — Fase 1

| Metrica | Valor |
|---|---|
| **Epicos cobertos** | 5 / 5 (100%) |
| **User Stories cobertas** | 25 / 25 (100%) |
| **Endpoints cobertos** | 22 / 22 (100%) |
| **Casos de teste documentados (ISO-29119-3)** | 160 |
| **Testes automatizados (Mocha)** | 164 |
| **Requests Postman** | 102 |
| **Regras de negocio rastreadas** | RU (49) + RC (54) + RK (56) + RT (75) + RG (52) |

---

## 7. Priorizacao por risco (ordem de execucao)

| Prioridade | Area | Justificativa |
|---|---|---|
| 1 | Autenticacao e autorizacao | Falha aqui expoe todos os dados |
| 2 | Consistencia de saldo e regras financeiras | Core do produto — erros de calculo sao criticos |
| 3 | Integridade referencial (vinculos e exclusoes) | Cascata, soft delete, bloqueios |
| 4 | Validacoes de entrada e codigos de erro | Contrato da API com o cliente |
| 5 | Regressao de endpoints ja estabilizados | Prevenir quebras em funcionalidades entregues |

---

## 8. Criterios de entrada e saida por ciclo

### Entrada para teste

- US refinada com criterios claros
- endpoint e contrato disponiveis
- regras relacionadas identificadas
- caso de teste documentado em formato ISO-29119-3

### Saida para aceite

- cenarios planejados executados
- sem defeitos criticos/altos em aberto
- regressao aplicavel executada com sucesso
- relatorio Mochawesome gerado e verde
- rastreabilidade CT → US → Regra atualizada

---

## 9. Evidencias obrigatorias por US

| Evidencia | Ferramenta | Localizacao |
|---|---|---|
| Resultado da suite automatizada | Mochawesome | `api/reports/mochawesome/provus-finance.html` |
| Testes implementados | Mocha | `api/tests/api/<dominio>/*.test.js` |
| Requests exploratorios | Postman | `postman/Provus-Finance.postman_collection.json` |
| Casos de teste documentados | Markdown ISO-29119-3 | `docs/06-testes/casos-teste-ep-*.md` |
| Pull Request com mudancas | GitHub | PR com label `tipo:testes` |
| Status CI | GitHub Actions | Badge no README |

---

## 10. Criterio de conclusao da Fase 1

A Fase 1 e considerada concluida em qualidade quando:

- [x] Todas as 25 US cobertas com testes automatizados
- [x] 160 casos de teste documentados no formato ISO-29119-3
- [x] 164 testes automatizados passando (Mocha + Chai + Supertest)
- [x] 102 requests na colecao Postman
- [x] Pipeline estavel (verde) na branch principal
- [x] Rastreabilidade CT → US → Regra atualizada para todos os epicos
- [x] Relatorio Mochawesome configurado e funcional
- [ ] Sem pendencias criticas/altas sem plano formal de tratamento

**Status: Fase 1 concluida em 30/04/2026.**

---

## 11. Metricas de acompanhamento — Fase 1

| Metrica | Valor |
|---|---|
| % de US com automacao | 100% (25/25) |
| % de CTs automatizados | 100% (164 testes / 160 CTs) |
| Taxa de sucesso da suite | 100% (164 passing, 0 failing) |
| Tempo medio da suite | ~14s |
| Defeitos criticos em aberto | 0 |

---

## 12. Governanca e atualizacao do plano

Este plano deve ser atualizado:

- a cada fechamento de US relevante
- quando houver mudanca de prioridade de risco
- quando houver alteracao de contrato/API que impacte cobertura
- ao final de cada fase para registrar licoes aprendidas

---

## 13. Proximos passos (Fase 2)

- Implementar testes de performance com k6 em rotas criticas
- Configurar GitHub Actions para execucao automatica da suite
- Expandir cobertura para funcionalidades da Fase 2 (cartoes de credito, transferencias)
- Adicionar metricas de cobertura de codigo (nyc/istanbul)
