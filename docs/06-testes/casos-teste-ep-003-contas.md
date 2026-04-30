# Casos de Teste — EP-003: Gestao de Contas

> Baseado na ISO-29119-3. Casos de teste do Epico 3 com rastreabilidade completa.

---

## 1. Objetivo

Validar criacao, listagem, consulta, atualizacao, desativacao e saldo de contas financeiras.

---

## 2. Referencias

- docs/05-user-stories/ep-003-contas.md
- docs/02-regras-negocio/regras-conta.md (RC-*)
- docs/02-regras-negocio/regras-gerais.md (RG-*)

---

## 3. Convencoes

- ID: CT-EP003-USXXX-YY
- Formato: ISO-29119-3 (tabela com passos, acao, resultado)

---

## 4. Casos de teste

### US-009 — Criar nova conta (`POST /api/contas`)

#### CT-EP003-US009-01 — Criar conta corrente com dados validos (nome, tipo, saldoInicial)

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US009-01 |
| **Titulo** | Validar que uma conta corrente e criada com sucesso ao enviar nome, tipo e saldoInicial validos |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-009, RC-001, RC-002 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/contas` com header `Authorization: Bearer <token>` e body `{ "nome": "Nubank", "tipo": "corrente", "saldoInicial": 1000 }` | HTTP `201 Created` |
| 2 | Verificar body da resposta | Body contem `id`, `nome`, `tipo`, `saldoInicial`, `ativo=true`, `criadoEm`, `atualizadoEm` |

| **Pos-Condicoes** | - Conta persistida no banco com `ativo=true` e dados informados |

---

#### CT-EP003-US009-02 — Criar conta com saldoInicial igual a zero

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US009-02 |
| **Titulo** | Validar que saldoInicial=0 e aceito na criacao de conta |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-009, RC-003 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/contas` com body `{ "nome": "Conta Zero", "tipo": "corrente", "saldoInicial": 0 }` | HTTP `201 Created` |
| 2 | Verificar campo `saldoInicial` na resposta | `saldoInicial = 0` |

| **Pos-Condicoes** | - Conta criada no banco com `saldoInicial=0` |

---

#### CT-EP003-US009-03 — Criar conta sem informar saldoInicial (padrao 0)

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US009-03 |
| **Titulo** | Validar que a omissao do campo saldoInicial resulta em valor padrao 0 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-009, RC-003 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/contas` com body `{ "nome": "Conta Sem Saldo", "tipo": "corrente" }` (sem campo `saldoInicial`) | HTTP `201 Created` |
| 2 | Verificar campo `saldoInicial` na resposta | `saldoInicial = 0` |

| **Pos-Condicoes** | - Conta criada no banco com `saldoInicial=0` |

---

#### CT-EP003-US009-04 — Criar conta com cada um dos 5 tipos validos

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US009-04 |
| **Titulo** | Validar que os 5 tipos de conta validos (corrente, poupanca, carteira_digital, dinheiro, investimento) sao aceitos na criacao |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-009, RC-002 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/contas` com `tipo: "corrente"` | HTTP `201 Created` com `tipo = "corrente"` |
| 2 | Enviar `POST /api/contas` com `tipo: "poupanca"` | HTTP `201 Created` com `tipo = "poupanca"` |
| 3 | Enviar `POST /api/contas` com `tipo: "carteira_digital"` | HTTP `201 Created` com `tipo = "carteira_digital"` |
| 4 | Enviar `POST /api/contas` com `tipo: "dinheiro"` | HTTP `201 Created` com `tipo = "dinheiro"` |
| 5 | Enviar `POST /api/contas` com `tipo: "investimento"` | HTTP `201 Created` com `tipo = "investimento"` |

| **Pos-Condicoes** | - 5 contas criadas no banco, cada uma com o tipo correspondente |

---

#### CT-EP003-US009-05 — Rejeitar criacao de conta sem campo nome

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US009-05 |
| **Titulo** | Validar que a ausencia do campo nome retorna erro 400 com detalhes do campo |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-009, RC-006 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/contas` com body `{ "tipo": "corrente" }` (sem campo `nome`) | HTTP `400 Bad Request` |
| 2 | Verificar corpo do erro | Erro contem detalhes indicando obrigatoriedade do campo `nome` |

| **Pos-Condicoes** | - Nenhuma conta criada no banco |

---

#### CT-EP003-US009-06 — Rejeitar criacao de conta com tipo invalido

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US009-06 |
| **Titulo** | Validar que um tipo fora da lista de valores aceitos retorna erro 400 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-009, RC-002 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/contas` com body `{ "nome": "Conta X", "tipo": "invalido" }` | HTTP `400 Bad Request` |
| 2 | Verificar corpo do erro | Erro indica tipos aceitos |

| **Pos-Condicoes** | - Nenhuma conta criada no banco |

---

#### CT-EP003-US009-07 — Rejeitar criacao de conta com saldoInicial negativo

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US009-07 |
| **Titulo** | Validar que saldoInicial negativo retorna erro 400 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-009, RC-003 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/contas` com body `{ "nome": "Conta", "tipo": "corrente", "saldoInicial": -100 }` | HTTP `400 Bad Request` |
| 2 | Verificar corpo do erro | Erro de validacao para campo `saldoInicial` |

| **Pos-Condicoes** | - Nenhuma conta criada no banco |

---

#### CT-EP003-US009-08 — Rejeitar criacao de conta sem campo tipo

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US009-08 |
| **Titulo** | Validar que a ausencia do campo tipo retorna erro 400 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-009, RC-002 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/contas` com body `{ "nome": "Conta Sem Tipo" }` (sem campo `tipo`) | HTTP `400 Bad Request` |
| 2 | Verificar corpo do erro | Erro indica obrigatoriedade do campo `tipo` |

| **Pos-Condicoes** | - Nenhuma conta criada no banco |

---

#### CT-EP003-US009-09 — Rejeitar criacao de conta sem token de autenticacao

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US009-09 |
| **Titulo** | Validar que requisicao sem token JWT retorna 401 com codigo TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-009, RG-009 |
| **Pre-Condicoes** | - Nenhuma (requisicao sem autenticacao) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/contas` sem header `Authorization` | HTTP `401 Unauthorized` |
| 2 | Verificar corpo do erro | `erro.codigo = "TOKEN_AUSENTE"` |

| **Pos-Condicoes** | - Nenhuma conta criada no banco |

---

### US-010 — Listar contas do usuario (`GET /api/contas`)

#### CT-EP003-US010-01 — Listar contas ativas do usuario autenticado

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US010-01 |
| **Titulo** | Validar que a listagem retorna array com as contas ativas do usuario |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-010, RC-010 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Usuario possui 2 ou mais contas ativas |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas` com header `Authorization: Bearer <token>` | HTTP `200 OK` |
| 2 | Verificar body da resposta | Array contendo as contas ativas do usuario |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US010-02 — Nao listar contas inativas por padrao

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US010-02 |
| **Titulo** | Validar que contas inativas nao aparecem na listagem padrao |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-010, RC-011 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Usuario possui 1 conta ativa e 1 conta inativa |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas` sem query parameters | HTTP `200 OK` |
| 2 | Verificar body da resposta | Array contem apenas a conta ativa; conta inativa ausente |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US010-03 — Listar contas inativas com filtro ativo=false

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US010-03 |
| **Titulo** | Validar que o filtro ?ativo=false retorna apenas contas inativas |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-010, RC-012 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Usuario possui ao menos 1 conta inativa |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas?ativo=false` | HTTP `200 OK` |
| 2 | Verificar body da resposta | Array contem apenas contas com `ativo=false` |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US010-04 — Filtrar contas por tipo corrente

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US010-04 |
| **Titulo** | Validar que o filtro ?tipo=corrente retorna apenas contas do tipo corrente |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-010, RC-013 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Usuario possui contas de tipos variados |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas?tipo=corrente` | HTTP `200 OK` |
| 2 | Verificar body da resposta | Array contem apenas contas com `tipo = "corrente"` |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US010-05 — Retornar array vazio quando nao ha contas

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US010-05 |
| **Titulo** | Validar que a listagem retorna array vazio quando o usuario nao possui contas |
| **Prioridade** | Media |
| **Rastreabilidade** | US-010 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Usuario nao possui nenhuma conta cadastrada |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas` | HTTP `200 OK` |
| 2 | Verificar body da resposta | Array vazio `[]` |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US010-06 — Garantir isolamento de contas entre usuarios

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US010-06 |
| **Titulo** | Validar que cada usuario visualiza apenas suas proprias contas |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-010, RG-012 |
| **Pre-Condicoes** | - Dois usuarios autenticados (A e B), cada um com contas cadastradas |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas` com token do usuario A | HTTP `200 OK` com apenas contas do usuario A |
| 2 | Enviar `GET /api/contas` com token do usuario B | HTTP `200 OK` com apenas contas do usuario B |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US010-07 — Rejeitar listagem de contas sem token de autenticacao

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US010-07 |
| **Titulo** | Validar que requisicao sem token JWT retorna 401 com codigo TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-010, RG-009 |
| **Pre-Condicoes** | - Nenhuma (requisicao sem autenticacao) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas` sem header `Authorization` | HTTP `401 Unauthorized` |
| 2 | Verificar corpo do erro | `erro.codigo = "TOKEN_AUSENTE"` |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

### US-011 — Consultar conta especifica (`GET /api/contas/:id`)

#### CT-EP003-US011-01 — Consultar conta existente com saldoCalculado

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US011-01 |
| **Titulo** | Validar que a consulta de conta retorna os dados completos incluindo saldoCalculado |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-011, RC-020 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Conta existente com `saldoInicial=1500` |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas/:id` com ID de conta existente | HTTP `200 OK` |
| 2 | Verificar body da resposta | Body contem dados da conta com campo `saldoCalculado` presente |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US011-02 — Consultar conta com ID inexistente

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US011-02 |
| **Titulo** | Validar que consulta com ID inexistente retorna 404 CONTA_NAO_ENCONTRADA |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-011, RC-022 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas/99999` (ID inexistente) | HTTP `404 Not Found` |
| 2 | Verificar corpo do erro | `erro.codigo = "CONTA_NAO_ENCONTRADA"` |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US011-03 — Rejeitar consulta de conta pertencente a outro usuario

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US011-03 |
| **Titulo** | Validar que consulta de conta de outro usuario retorna 404 sem expor dados alheios |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-011, RC-022, RG-012 |
| **Pre-Condicoes** | - Usuario A autenticado com token JWT valido<br>- Conta pertencente ao usuario B |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas/:id` com ID de conta do usuario B usando token do usuario A | HTTP `404 Not Found` |
| 2 | Verificar corpo da resposta | Nenhum dado da conta alheia e exposto |

| **Pos-Condicoes** | - Dados da conta do usuario B permanecem inalterados e nao expostos |

---

#### CT-EP003-US011-04 — Rejeitar consulta de conta sem token de autenticacao

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US011-04 |
| **Titulo** | Validar que requisicao sem token JWT retorna 401 com codigo TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-011, RG-009 |
| **Pre-Condicoes** | - Nenhuma (requisicao sem autenticacao) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas/:id` sem header `Authorization` | HTTP `401 Unauthorized` |
| 2 | Verificar corpo do erro | `erro.codigo = "TOKEN_AUSENTE"` |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

### US-012 — Atualizar dados da conta (`PUT /api/contas/:id`)

#### CT-EP003-US012-01 — Atualizar nome da conta com sucesso

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US012-01 |
| **Titulo** | Validar que o nome da conta e atualizado com sucesso ao enviar novo valor |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-012, RC-030 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Conta existente e ativa |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/contas/:id` com body `{ "nome": "Novo Nome" }` | HTTP `200 OK` |
| 2 | Verificar body da resposta | Campo `nome` reflete o novo valor `"Novo Nome"` |

| **Pos-Condicoes** | - Nome da conta alterado no banco para `"Novo Nome"` |

---

#### CT-EP003-US012-02 — Verificar campo atualizadoEm presente na resposta

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US012-02 |
| **Titulo** | Validar que o campo atualizadoEm esta presente na resposta apos atualizacao |
| **Prioridade** | Media |
| **Rastreabilidade** | US-012, RC-034 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Conta existente e ativa |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/contas/:id` com body `{ "nome": "Nome Atualizado" }` | HTTP `200 OK` |
| 2 | Verificar body da resposta | Campo `atualizadoEm` presente e com valor atualizado |

| **Pos-Condicoes** | - Campo `atualizadoEm` reflete a data/hora da atualizacao |

---

#### CT-EP003-US012-03 — Garantir que tipo e saldoInicial sao ignorados no body

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US012-03 |
| **Titulo** | Validar que os campos tipo e saldoInicial enviados no body sao ignorados e preservam valores originais |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-012, RC-031, RC-032 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Conta existente com `tipo="corrente"` e `saldoInicial=1000` |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/contas/:id` com body `{ "nome": "Nome OK", "tipo": "poupanca", "saldoInicial": 9999 }` | HTTP `200 OK` |
| 2 | Verificar campos `tipo` e `saldoInicial` na resposta | `tipo = "corrente"` e `saldoInicial = 1000` (valores originais preservados) |

| **Pos-Condicoes** | - Campos `tipo` e `saldoInicial` inalterados no banco |

---

#### CT-EP003-US012-04 — Rejeitar atualizacao com nome vazio

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US012-04 |
| **Titulo** | Validar que nome vazio retorna erro 400 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-012, RC-033 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Conta existente e ativa |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/contas/:id` com body `{ "nome": "" }` | HTTP `400 Bad Request` |
| 2 | Verificar corpo do erro | Erro de validacao para campo `nome` |

| **Pos-Condicoes** | - Nome da conta inalterado no banco |

---

#### CT-EP003-US012-05 — Rejeitar atualizacao com body sem campo nome

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US012-05 |
| **Titulo** | Validar que body vazio sem campo nome retorna erro 400 CORPO_VAZIO |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-012 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Conta existente e ativa |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/contas/:id` com body `{}` | HTTP `400 Bad Request` |
| 2 | Verificar corpo do erro | `erro.codigo = "CORPO_VAZIO"` |

| **Pos-Condicoes** | - Conta inalterada no banco |

---

#### CT-EP003-US012-06 — Rejeitar atualizacao de conta com ID inexistente

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US012-06 |
| **Titulo** | Validar que atualizacao com ID inexistente retorna 404 CONTA_NAO_ENCONTRADA |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-012 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/contas/99999` com body `{ "nome": "Qualquer" }` | HTTP `404 Not Found` |
| 2 | Verificar corpo do erro | `erro.codigo = "CONTA_NAO_ENCONTRADA"` |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US012-07 — Rejeitar atualizacao de conta pertencente a outro usuario

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US012-07 |
| **Titulo** | Validar que atualizacao de conta de outro usuario retorna 404 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-012, RG-012 |
| **Pre-Condicoes** | - Usuario A autenticado com token JWT valido<br>- Conta pertencente ao usuario B |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/contas/:id` com ID de conta do usuario B usando token do usuario A | HTTP `404 Not Found` |

| **Pos-Condicoes** | - Conta do usuario B permanece inalterada |

---

### US-013 — Desativar conta (`DELETE /api/contas/:id`)

#### CT-EP003-US013-01 — Desativar conta ativa com sucesso

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US013-01 |
| **Titulo** | Validar que a desativacao de conta ativa retorna 204 e define ativo=false |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-013, RC-040 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Conta existente e ativa |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `DELETE /api/contas/:id` | HTTP `204 No Content` |
| 2 | Consultar conta diretamente no banco | Campo `ativo=false`; transacoes vinculadas permanecem intactas |

| **Pos-Condicoes** | - Conta com `ativo=false` no banco<br>- Transacoes vinculadas a conta preservadas |

---

#### CT-EP003-US013-02 — Conta desativada nao aparece na listagem padrao

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US013-02 |
| **Titulo** | Validar que conta desativada nao aparece na listagem padrao sem filtro |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-013, RC-042 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Conta recentemente desativada |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Desativar conta via `DELETE /api/contas/:id` | HTTP `204 No Content` |
| 2 | Enviar `GET /api/contas` sem filtros | HTTP `200 OK`; conta desativada ausente da listagem |

| **Pos-Condicoes** | - Conta permanece inativa no banco |

---

#### CT-EP003-US013-03 — Conta desativada aparece com filtro ativo=false

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US013-03 |
| **Titulo** | Validar que conta desativada aparece na listagem com filtro ?ativo=false |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-013, RC-042 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Conta desativada existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas?ativo=false` | HTTP `200 OK` |
| 2 | Verificar body da resposta | Conta desativada presente no array de resultados |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US013-04 — Rejeitar desativacao de conta ja inativa

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US013-04 |
| **Titulo** | Validar que desativar conta ja inativa retorna 400 CONTA_JA_INATIVA |
| **Prioridade** | Media |
| **Rastreabilidade** | US-013 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Conta ja desativada (`ativo=false`) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `DELETE /api/contas/:id` para conta ja inativa | HTTP `400 Bad Request` |
| 2 | Verificar corpo do erro | `erro.codigo = "CONTA_JA_INATIVA"` |

| **Pos-Condicoes** | - Conta permanece inativa sem alteracoes adicionais |

---

#### CT-EP003-US013-05 — Rejeitar desativacao de conta com ID inexistente

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US013-05 |
| **Titulo** | Validar que desativacao com ID inexistente retorna 404 CONTA_NAO_ENCONTRADA |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-013 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `DELETE /api/contas/99999` | HTTP `404 Not Found` |
| 2 | Verificar corpo do erro | `erro.codigo = "CONTA_NAO_ENCONTRADA"` |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US013-06 — Rejeitar desativacao de conta pertencente a outro usuario

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US013-06 |
| **Titulo** | Validar que desativacao de conta de outro usuario retorna 404 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-013, RG-012 |
| **Pre-Condicoes** | - Usuario A autenticado com token JWT valido<br>- Conta pertencente ao usuario B |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `DELETE /api/contas/:id` com ID de conta do usuario B usando token do usuario A | HTTP `404 Not Found` |

| **Pos-Condicoes** | - Conta do usuario B permanece inalterada |

---

#### CT-EP003-US013-07 — Rejeitar desativacao de conta sem token de autenticacao

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US013-07 |
| **Titulo** | Validar que requisicao sem token JWT retorna 401 com codigo TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-013, RG-009 |
| **Pre-Condicoes** | - Nenhuma (requisicao sem autenticacao) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `DELETE /api/contas/:id` sem header `Authorization` | HTTP `401 Unauthorized` |
| 2 | Verificar corpo do erro | `erro.codigo = "TOKEN_AUSENTE"` |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

### US-014 — Consultar saldo calculado (`GET /api/contas/:id/saldo`)

#### CT-EP003-US014-01 — Consultar saldo de conta sem transacoes retorna saldoInicial

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US014-01 |
| **Titulo** | Validar que conta sem transacoes retorna saldoCalculado igual ao saldoInicial |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-014, RC-052 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Conta existente com `saldoInicial=2500` e sem transacoes |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas/:id/saldo` | HTTP `200 OK` |
| 2 | Verificar campo `saldoCalculado` na resposta | `saldoCalculado = 2500` (igual ao saldoInicial) |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US014-02 — Consultar saldo de conta com saldoInicial igual a zero

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US014-02 |
| **Titulo** | Validar que conta com saldoInicial=0 e sem transacoes retorna saldoCalculado=0 |
| **Prioridade** | Media |
| **Rastreabilidade** | US-014, RC-052 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido<br>- Conta existente com `saldoInicial=0` e sem transacoes |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas/:id/saldo` | HTTP `200 OK` |
| 2 | Verificar campo `saldoCalculado` na resposta | `saldoCalculado = 0` |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US014-03 — Rejeitar consulta de saldo com ID inexistente

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US014-03 |
| **Titulo** | Validar que consulta de saldo com ID inexistente retorna 404 CONTA_NAO_ENCONTRADA |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-014 |
| **Pre-Condicoes** | - Usuario autenticado com token JWT valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas/99999/saldo` | HTTP `404 Not Found` |
| 2 | Verificar corpo do erro | `erro.codigo = "CONTA_NAO_ENCONTRADA"` |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

#### CT-EP003-US014-04 — Rejeitar consulta de saldo de conta pertencente a outro usuario

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US014-04 |
| **Titulo** | Validar que consulta de saldo de conta de outro usuario retorna 404 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-014, RG-012 |
| **Pre-Condicoes** | - Usuario A autenticado com token JWT valido<br>- Conta pertencente ao usuario B |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas/:id/saldo` com ID de conta do usuario B usando token do usuario A | HTTP `404 Not Found` |

| **Pos-Condicoes** | - Dados da conta do usuario B nao expostos |

---

#### CT-EP003-US014-05 — Rejeitar consulta de saldo sem token de autenticacao

| Campo | Valor |
|---|---|
| **ID** | CT-EP003-US014-05 |
| **Titulo** | Validar que requisicao sem token JWT retorna 401 com codigo TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-014, RG-009 |
| **Pre-Condicoes** | - Nenhuma (requisicao sem autenticacao) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/contas/:id/saldo` sem header `Authorization` | HTTP `401 Unauthorized` |
| 2 | Verificar corpo do erro | `erro.codigo = "TOKEN_AUSENTE"` |

| **Pos-Condicoes** | - Nenhuma alteracao nos dados |

---

## 5. Resumo de cobertura

| User Story | Endpoint | Casos de Teste | IDs |
|---|---|:---:|---|
| US-009 | `POST /api/contas` | 9 | CT-EP003-US009-01 a 09 |
| US-010 | `GET /api/contas` | 7 | CT-EP003-US010-01 a 07 |
| US-011 | `GET /api/contas/:id` | 4 | CT-EP003-US011-01 a 04 |
| US-012 | `PUT /api/contas/:id` | 7 | CT-EP003-US012-01 a 07 |
| US-013 | `DELETE /api/contas/:id` | 7 | CT-EP003-US013-01 a 07 |
| US-014 | `GET /api/contas/:id/saldo` | 5 | CT-EP003-US014-01 a 05 |
| **Total** | | **39** | |
