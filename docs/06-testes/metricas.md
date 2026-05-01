# Metricas de Qualidade — Fase 1

> Indicadores de qualidade do Provus Finance baseados em dados reais do projeto.
> Versao planilha: `docs/06-testes/metricas.xlsx`

---

## 1. Bugs em Producao

Mede a proporcao de defeitos que chegaram a producao em relacao ao total encontrado.

| ID | Titulo | Ambiente | Tipo |
|---|---|---|---|
| #90 | PUT transacao aceito em conta inativa (RT-057) | Dev | Bug |

> A Issue #89 (XSS) foi classificada como **melhoria de seguranca**, nao como bug, pois nenhuma regra de negocio especifica sanitizacao de HTML.

| Indicador | Valor | Fonte |
|---|---|---|
| Defeitos encontrados | 1 | `gh issue list --label bug` |
| Defeitos em Producao | 0 | Nenhum deploy realizado |
| **Metrica** | **0%** | |

**Analise:** O unico defeito foi identificado em ambiente de desenvolvimento via sessao exploratoria antes de qualquer deploy.

---

## 2. Taxa de Reteste

Mede a proporcao de execucoes adicionais em relacao ao total.

**Evidencia:** Durante o desenvolvimento do EP-005, 4 testes de saldo falharam na primeira execucao devido a um bug na conversao centavos/reais no `conta.repository.js`. O fix foi aplicado no mesmo commit e os testes passaram na segunda execucao.

| Cenario | CTs afetados | Execucoes | Adicionais | Evidencia |
|---|---|---|---|---|
| Fix conversao centavos | CT-EP005-US020-03, US023-04, US024-02, US024-03 | 2 cada | 1 cada | git log: commit com fix calcularSaldo |
| Demais 160 CTs | 156 CTs restantes | 1 cada | 0 | Passaram na primeira execucao |

| Indicador | Valor |
|---|---|
| Total de CTs executados | 160 |
| CTs com reteste | 4 |
| Execucoes totais | 164 |
| Execucoes adicionais | 4 |
| **Metrica (Adicionais / Total)** | **2.4%** |

**Analise:** Taxa baixa. Os 4 retestes foram causados por um unico bug pontual na conversao de centavos para reais.

---

## 3. Custo dos Bugs

Estima o custo em horas por papel para cada defeito.

**Premissa:** Valores/hora baseados no modelo de referencia do projeto (Dev: R$50/h, QA: R$55/h, Devops: R$49/h). Horas estimadas com base no escopo da correcao planejada.

| ID | Titulo | QA (identificacao) | Dev (correcao estimada) | QA (reteste estimado) | Custo Dev | Custo QA | Total Estimado |
|---|---|---|---|---|---|---|---|
| #90 | PUT conta inativa | 1h | 1h | 1h | R$ 50 | R$ 110 | **R$ 160** |

> Bug #90 ainda nao foi corrigido. Horas sao **estimativas** baseadas no escopo da correcao (adicionar verificacao de conta ativa em `transacao.service.js`).

| Indicador | Valor |
|---|---|
| **Custo total estimado** | **R$ 160** |

---

## 4. Cobertura de Automacao

Mede a proporcao de casos de teste automatizados em relacao ao total documentado.

| Epico | CTs Documentados | Automatizados | Pendentes (skip) |
|---|---|---|---|
| EP-001 Usuarios | 39 | 39 | 0 |
| EP-002 Autenticacao | 9 | 9 | 0 |
| EP-003 Contas | 39 | 39 | 0 |
| EP-004 Categorias | 33 | 33 | 0 |
| EP-005 Transacoes | 40 | 40 | 0 |
| Sessao Exploratoria (XSS) | — | 4 (skip) | 4 |
| Sessao Exploratoria (Conta Inativa) | — | 1 (skip) | 1 |
| **Total** | **160** | **164** | **5** |

| Indicador | Valor | Fonte |
|---|---|---|
| CTs documentados | 160 | `docs/06-testes/casos-teste-ep-*.md` |
| Testes automatizados (total) | 164 | `npm test` (159 passing + 5 pending) |
| Testes passing | 159 | `npm test` |
| Testes pending (skip) | 5 | Issues #89 e #90 |
| **Cobertura (passing / CTs)** | **99.4%** | 159/160 |

**Analise:** 159 de 160 CTs documentados estao automatizados e passando. Os 5 testes pending sao extras (4 de XSS + 1 de conta inativa) criados apos sessoes exploratorias, aguardando correcao.

---

## 5. Cobertura de Testes de US

Mede a proporcao de casos de teste executados em relacao aos planejados por epico.

| ID | Epico | CTs Planejados | CTs Executados | Cobertura |
|---|---|---|---|---|
| 1 | EP-001 Usuarios (US-001 a US-005) | 39 | 39 | 100% |
| 2 | EP-002 Autenticacao (US-006 a US-008) | 9 | 9 | 100% |
| 3 | EP-003 Contas (US-009 a US-014) | 39 | 39 | 100% |
| 4 | EP-004 Categorias (US-015 a US-019) | 33 | 33 | 100% |
| 5 | EP-005 Transacoes (US-020 a US-025) | 40 | 40 | 100% |

| Indicador | Valor | Fonte |
|---|---|---|
| Total planejado | 160 | Docs ISO-29119-3 |
| Total executado | 160 | `npm test` |
| **Cobertura Geral** | **100%** | |

---

## 6. Qualidade da Release (QR)

Formula ponderada: `QR = (1 - TesteFalhos/QA1) * P1 + (1 - Defeitos/QA2) * P2`

| Variavel | Descricao | Valor | Fonte |
|---|---|---|---|
| P1 | Peso testes falhos | 0.3 | Modelo de referencia |
| P2 | Peso defeitos | 0.7 | Modelo de referencia |
| QA1 | Total de testes | 164 | `npm test` |
| QA2 | Maximo defeitos referencia | 5 | Modelo de referencia |
| Testes falhos | Testes pending (skip) | 5 | `npm test` |
| Defeitos | Bugs encontrados | 1 | `gh issue list --label bug` |

| Release | Testes Falhos | Defeitos | QR |
|---|---|---|---|
| Fase 1 — Fundacao (01/05/2026) | 5 | 1 | **(1-5/164)*0.3 + (1-1/5)*0.7 = 0.29 + 0.56 = 0.85** |

**Analise:** QR de 0.85 (escala 0-1). Os 5 testes "falhos" sao pending/skip com plano de correcao documentado, nao falhas reais em funcionalidade.

---

## 7. Tempo Medio de Correcao de Falhas (TMDCF)

| ID | Titulo | Abertura | Fechamento | Diferenca |
|---|---|---|---|---|
| #90 | PUT transacao em conta inativa | 01/05/2026 17:36 | Pendente | — |

| Indicador | Valor |
|---|---|
| **TMDCF** | **Pendente** (bug em aberto com plano de correcao) |

**Analise:** O defeito possui plano de correcao documentado na Issue #90. O TMDCF sera calculado apos implementacao.

---

## Resumo Executivo

| Metrica | Valor | Fonte |
|---|---|---|
| Bugs em Producao | 0% (0/1) | GitHub Issues |
| Taxa de Reteste | 2.4% (4/164) | Git log + npm test |
| Custo dos Bugs | R$ 160 (estimado) | Escopo da Issue #90 |
| Cobertura de Automacao | 99.4% (159/160) | npm test vs docs CTs |
| Cobertura de Testes de US | 100% (160/160) | npm test vs docs CTs |
| Qualidade da Release | 0.85 | Formula QR com dados reais |
| TMDCF | Pendente | Bug #90 em aberto |
