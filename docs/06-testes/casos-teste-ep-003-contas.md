# ✅ Casos de Teste — EP-003: Gestão de Contas

> Casos de teste do Épico 3, elaborados com base nas User Stories de contas e nas regras de negócio vigentes, mantendo rastreabilidade completa.

---

## 1. Objetivo

Definir os cenários de teste do EP-003 para validar criação, listagem, consulta, atualização, desativação e consulta de saldo de contas financeiras.

---

## 2. Referências

- `docs/05-user-stories/ep-003-contas.md`
- `docs/02-regras-negocio/regras-gerais.md`
- `docs/03-arquitetura/api-contratos.md`
- `docs/06-testes/estrategia-testes.md`
- `docs/06-testes/plano-testes-fase-1.md`

---

## 3. Convenções

- **ID do caso:** `CT-EP003-USXXX-YY`
- **Tipo:** API (automatizável) + execução manual complementar
- **Rastreabilidade obrigatória:** `US` + `RC/RG`
- **Formato esperado de erro:** `{"erro":{"codigo":"...","mensagem":"..."}}`

---

## 4. Casos de teste

### US-009 — Criar nova conta (`POST /api/contas`)

#### CT-EP003-US009-01 — Criação com dados válidos
- **Rastreabilidade:** US-009, RC-001, RC-002
- **Prioridade:** Alta
- **Pré-condições:** token JWT válido
- **Passos:**
  1. Enviar `POST /api/contas` com `nome`, `tipo`, `saldoInicial` válidos.
- **Resultado esperado:**
  - HTTP `201`
  - Body com `id`, `nome`, `tipo`, `saldoInicial`, `ativo`, `criadoEm`, `atualizadoEm`

#### CT-EP003-US009-02 — Criação com saldoInicial = 0
- **Rastreabilidade:** US-009, RC-003
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição com `saldoInicial: 0`.
- **Resultado esperado:**
  - HTTP `201`
  - `saldoInicial = 0`

#### CT-EP003-US009-03 — Criação sem saldoInicial (padrão 0)
- **Rastreabilidade:** US-009, RC-003
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição sem campo `saldoInicial`.
- **Resultado esperado:**
  - HTTP `201`
  - `saldoInicial = 0`

#### CT-EP003-US009-04 — Aceitar todos os 5 tipos válidos
- **Rastreabilidade:** US-009, RC-002
- **Prioridade:** Alta
- **Passos:**
  1. Criar conta para cada tipo: corrente, poupanca, carteira_digital, dinheiro, investimento.
- **Resultado esperado:**
  - HTTP `201` para cada tipo

#### CT-EP003-US009-05 — Nome ausente
- **Rastreabilidade:** US-009, RC-006
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição sem campo `nome`.
- **Resultado esperado:**
  - HTTP `400`
  - erro de obrigatoriedade para `nome`

#### CT-EP003-US009-06 — Tipo inválido
- **Rastreabilidade:** US-009, RC-002
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `tipo: "invalido"`.
- **Resultado esperado:**
  - HTTP `400`
  - erro indicando tipos aceitos

#### CT-EP003-US009-07 — Saldo inicial negativo
- **Rastreabilidade:** US-009, RC-003
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `saldoInicial: -100`.
- **Resultado esperado:**
  - HTTP `400`
  - erro de validação para `saldoInicial`

#### CT-EP003-US009-08 — Tipo ausente
- **Rastreabilidade:** US-009, RC-002
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição sem campo `tipo`.
- **Resultado esperado:**
  - HTTP `400`

#### CT-EP003-US009-09 — Requisição sem token
- **Rastreabilidade:** US-009, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição sem header `Authorization`.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

---

### US-010 — Listar contas do usuário (`GET /api/contas`)

#### CT-EP003-US010-01 — Listar contas ativas
- **Rastreabilidade:** US-010, RC-010
- **Prioridade:** Alta
- **Pré-condições:** token válido; contas cadastradas
- **Passos:**
  1. Chamar `GET /api/contas`.
- **Resultado esperado:**
  - HTTP `200`
  - apenas contas ativas do usuário

#### CT-EP003-US010-02 — Não listar contas inativas por padrão
- **Rastreabilidade:** US-010, RC-011
- **Prioridade:** Alta
- **Pré-condições:** conta desativada existente
- **Passos:**
  1. Chamar `GET /api/contas` sem filtro.
- **Resultado esperado:**
  - conta inativa ausente da resposta

#### CT-EP003-US010-03 — Listar contas inativas com ?ativo=false
- **Rastreabilidade:** US-010, RC-012
- **Prioridade:** Alta
- **Passos:**
  1. Chamar `GET /api/contas?ativo=false`.
- **Resultado esperado:**
  - apenas contas com ativo = false

#### CT-EP003-US010-04 — Filtrar por tipo
- **Rastreabilidade:** US-010, RC-013
- **Prioridade:** Alta
- **Passos:**
  1. Chamar `GET /api/contas?tipo=corrente`.
- **Resultado esperado:**
  - apenas contas do tipo corrente

#### CT-EP003-US010-05 — Lista vazia
- **Rastreabilidade:** US-010
- **Prioridade:** Média
- **Passos:**
  1. Chamar `GET /api/contas` sem contas cadastradas.
- **Resultado esperado:**
  - HTTP `200`
  - array vazio

#### CT-EP003-US010-06 — Isolamento entre usuários
- **Rastreabilidade:** US-010, RG-012
- **Prioridade:** Alta
- **Passos:**
  1. Criar contas com dois usuários diferentes.
  2. Listar contas do usuário A.
- **Resultado esperado:**
  - apenas contas do usuário A

#### CT-EP003-US010-07 — Requisição sem token
- **Rastreabilidade:** US-010, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Chamar endpoint sem token.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

---

### US-011 — Consultar conta específica (`GET /api/contas/:id`)

#### CT-EP003-US011-01 — Consulta com saldoCalculado
- **Rastreabilidade:** US-011, RC-020
- **Prioridade:** Alta
- **Pré-condições:** token válido; conta existente
- **Passos:**
  1. Chamar `GET /api/contas/:id`.
- **Resultado esperado:**
  - HTTP `200`
  - body com `saldoCalculado`

#### CT-EP003-US011-02 — ID inexistente
- **Rastreabilidade:** US-011, RC-022
- **Prioridade:** Alta
- **Passos:**
  1. Chamar `GET /api/contas/99999`.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = CONTA_NAO_ENCONTRADA`

#### CT-EP003-US011-03 — Conta de outro usuário
- **Rastreabilidade:** US-011, RC-022, RG-012
- **Prioridade:** Alta
- **Passos:**
  1. Consultar conta pertencente a outro usuário.
- **Resultado esperado:**
  - HTTP `404`

#### CT-EP003-US011-04 — Requisição sem token
- **Rastreabilidade:** US-011, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Chamar endpoint sem token.
- **Resultado esperado:**
  - HTTP `401`

---

### US-012 — Atualizar dados da conta (`PUT /api/contas/:id`)

#### CT-EP003-US012-01 — Atualização do nome
- **Rastreabilidade:** US-012, RC-030
- **Prioridade:** Alta
- **Pré-condições:** token válido; conta existente
- **Passos:**
  1. Enviar `PUT /api/contas/:id` com novo `nome`.
- **Resultado esperado:**
  - HTTP `200`
  - nome atualizado

#### CT-EP003-US012-02 — Campo atualizadoEm presente
- **Rastreabilidade:** US-012, RC-034
- **Prioridade:** Média
- **Passos:**
  1. Atualizar nome da conta.
- **Resultado esperado:**
  - campo `atualizadoEm` presente na resposta

#### CT-EP003-US012-03 — Tipo e saldoInicial ignorados
- **Rastreabilidade:** US-012, RC-031, RC-032
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `tipo` e `saldoInicial` junto com `nome`.
- **Resultado esperado:**
  - `tipo` e `saldoInicial` originais preservados

#### CT-EP003-US012-04 — Nome vazio rejeitado
- **Rastreabilidade:** US-012, RC-033
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `nome: ""`.
- **Resultado esperado:**
  - HTTP `400`

#### CT-EP003-US012-05 — Body sem campo nome
- **Rastreabilidade:** US-012
- **Prioridade:** Alta
- **Passos:**
  1. Enviar body vazio `{}`.
- **Resultado esperado:**
  - HTTP `400`
  - `erro.codigo = CORPO_VAZIO`

#### CT-EP003-US012-06 — ID inexistente
- **Rastreabilidade:** US-012
- **Prioridade:** Alta
- **Passos:**
  1. Enviar PUT para conta inexistente.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = CONTA_NAO_ENCONTRADA`

#### CT-EP003-US012-07 — Conta de outro usuário
- **Rastreabilidade:** US-012, RG-012
- **Prioridade:** Alta
- **Passos:**
  1. Atualizar conta pertencente a outro usuário.
- **Resultado esperado:**
  - HTTP `404`

---

### US-013 — Desativar conta (`DELETE /api/contas/:id`)

#### CT-EP003-US013-01 — Desativação bem-sucedida
- **Rastreabilidade:** US-013, RC-040
- **Prioridade:** Alta
- **Pré-condições:** token válido; conta ativa
- **Passos:**
  1. Enviar `DELETE /api/contas/:id`.
- **Resultado esperado:**
  - HTTP `204`
  - sem body

#### CT-EP003-US013-02 — Conta desativada oculta na listagem
- **Rastreabilidade:** US-013, RC-042
- **Prioridade:** Alta
- **Passos:**
  1. Desativar conta.
  2. Listar contas sem filtro.
- **Resultado esperado:**
  - conta desativada ausente

#### CT-EP003-US013-03 — Conta desativada visível com filtro
- **Rastreabilidade:** US-013, RC-042
- **Prioridade:** Alta
- **Passos:**
  1. Desativar conta.
  2. Listar com `?ativo=false`.
- **Resultado esperado:**
  - conta desativada presente

#### CT-EP003-US013-04 — Desativar conta já inativa
- **Rastreabilidade:** US-013
- **Prioridade:** Média
- **Passos:**
  1. Desativar conta duas vezes.
- **Resultado esperado:**
  - HTTP `400`
  - `erro.codigo = CONTA_JA_INATIVA`

#### CT-EP003-US013-05 — ID inexistente
- **Rastreabilidade:** US-013
- **Prioridade:** Alta
- **Passos:**
  1. Enviar DELETE para conta inexistente.
- **Resultado esperado:**
  - HTTP `404`

#### CT-EP003-US013-06 — Conta de outro usuário
- **Rastreabilidade:** US-013, RG-012
- **Prioridade:** Alta
- **Passos:**
  1. Desativar conta de outro usuário.
- **Resultado esperado:**
  - HTTP `404`

#### CT-EP003-US013-07 — Requisição sem token
- **Rastreabilidade:** US-013, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Chamar endpoint sem token.
- **Resultado esperado:**
  - HTTP `401`

---

### US-014 — Consultar saldo calculado (`GET /api/contas/:id/saldo`)

#### CT-EP003-US014-01 — Conta sem transações retorna saldoInicial
- **Rastreabilidade:** US-014, RC-052
- **Prioridade:** Alta
- **Pré-condições:** token válido; conta com saldoInicial definido
- **Passos:**
  1. Chamar `GET /api/contas/:id/saldo`.
- **Resultado esperado:**
  - HTTP `200`
  - `saldoCalculado` = saldoInicial

#### CT-EP003-US014-02 — Conta com saldoInicial = 0
- **Rastreabilidade:** US-014, RC-052
- **Prioridade:** Média
- **Passos:**
  1. Criar conta com saldoInicial = 0.
  2. Consultar saldo.
- **Resultado esperado:**
  - `saldoCalculado = 0`

#### CT-EP003-US014-03 — ID inexistente
- **Rastreabilidade:** US-014
- **Prioridade:** Alta
- **Passos:**
  1. Chamar `GET /api/contas/99999/saldo`.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = CONTA_NAO_ENCONTRADA`

#### CT-EP003-US014-04 — Conta de outro usuário
- **Rastreabilidade:** US-014, RG-012
- **Prioridade:** Alta
- **Passos:**
  1. Consultar saldo de conta de outro usuário.
- **Resultado esperado:**
  - HTTP `404`

#### CT-EP003-US014-05 — Requisição sem token
- **Rastreabilidade:** US-014, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Chamar endpoint sem token.
- **Resultado esperado:**
  - HTTP `401`

---

## 5. Resumo de cobertura

- **Total de casos:** 39
- **Distribuição por US:**
  - US-009: 9
  - US-010: 7
  - US-011: 4
  - US-012: 7
  - US-013: 7
  - US-014: 5

---

## 6. Próximos passos

1. Todos os 39 casos estão automatizados em `tests/api/contas/`.
2. Quando EP-005 (Transações) for implementado, adicionar casos para validar `saldoCalculado` com transações reais.
3. Evoluir para matriz de rastreabilidade de execução.
