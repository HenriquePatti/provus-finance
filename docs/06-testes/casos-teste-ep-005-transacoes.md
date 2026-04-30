# ✅ Casos de Teste — EP-005: Gestão de Transações

> Casos de teste do Épico 5, elaborados com base nas User Stories de transações e nas regras de negócio vigentes, mantendo rastreabilidade completa.

---

## 1. Objetivo

Definir os cenários de teste do EP-005 para validar registro, listagem, consulta, atualização, exclusão e busca de transações financeiras.

---

## 2. Referências

- `docs/05-user-stories/ep-005-transacoes.md`
- `docs/02-regras-negocio/regras-transacao.md`
- `docs/02-regras-negocio/regras-gerais.md`
- `docs/03-arquitetura/api-contratos.md`
- `docs/06-testes/estrategia-testes.md`
- `docs/06-testes/plano-testes-fase-1.md`

---

## 3. Convenções

- **ID do caso:** `CT-EP005-USXXX-YY`
- **Tipo:** API (automatizável) + execução manual complementar
- **Rastreabilidade obrigatória:** `US` + `RT/RG`
- **Formato esperado de erro:** `{"erro":{"codigo":"...","mensagem":"..."}}`

---

## 4. Casos de teste

### US-020 — Registrar transação (`POST /api/transacoes`)

#### CT-EP005-US020-01 — Criação bem-sucedida com dados válidos
- **Rastreabilidade:** US-020, RT-004, RT-007
- **Prioridade:** Alta
- **Pré-condições:** token JWT válido; conta ativa pertencente ao usuário; categoria compatível com o tipo
- **Passos:**
  1. Enviar `POST /api/transacoes` com tipo, valor, descricao, dataTransacao, contaId e categoriaId válidos.
- **Resultado esperado:**
  - HTTP `201`
  - Body com `id`, `tipo`, `valor`, `descricao`, `dataTransacao`, `contaId`, `categoriaId`, `criadoEm`, `atualizadoEm`

#### CT-EP005-US020-02 — Conta inexistente retorna 404
- **Rastreabilidade:** US-020, RT-028
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `POST /api/transacoes` com `contaId` inexistente.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = CONTA_NAO_ENCONTRADA`

#### CT-EP005-US020-03 — Conta de outro usuário retorna 404
- **Rastreabilidade:** US-020, RT-027
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `POST /api/transacoes` com `contaId` pertencente a outro usuário.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = CONTA_NAO_ENCONTRADA`

#### CT-EP005-US020-04 — Conta inativa retorna 422
- **Rastreabilidade:** US-020, RT-029
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `POST /api/transacoes` com `contaId` de conta com `ativa = false`.
- **Resultado esperado:**
  - HTTP `422`
  - `erro.codigo = CONTA_INATIVA`

#### CT-EP005-US020-05 — Categoria incompatível com tipo retorna 422
- **Rastreabilidade:** US-020, RT-033
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `POST /api/transacoes` com tipo "receita" e categoriaId exclusivamente de despesa.
- **Resultado esperado:**
  - HTTP `422`
  - `erro.codigo = CATEGORIA_INCOMPATIVEL`

#### CT-EP005-US020-06 — Campo obrigatório ausente retorna 400
- **Rastreabilidade:** US-020, RT-004, RG-014
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `POST /api/transacoes` omitindo o campo `valor`.
- **Resultado esperado:**
  - HTTP `400`
  - `erro.codigo = CAMPO_OBRIGATORIO`

#### CT-EP005-US020-07 — Tipo inválido retorna 400
- **Rastreabilidade:** US-020, RT-009, RT-010
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `POST /api/transacoes` com `tipo` diferente de "receita" ou "despesa".
- **Resultado esperado:**
  - HTTP `400`
  - `erro.codigo = FORMATO_INVALIDO`

#### CT-EP005-US020-08 — Valor zero ou negativo retorna 422
- **Rastreabilidade:** US-020, RT-002, RT-013
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `POST /api/transacoes` com `valor` = 0.
  2. Enviar `POST /api/transacoes` com `valor` = -50.
- **Resultado esperado:**
  - HTTP `422`
  - `erro.codigo = VALOR_INVALIDO`

#### CT-EP005-US020-09 — Data em formato inválido retorna 400
- **Rastreabilidade:** US-020, RT-022, RT-025
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `POST /api/transacoes` com `dataTransacao` = "22/04/2026".
- **Resultado esperado:**
  - HTTP `400`
  - `erro.codigo = FORMATO_INVALIDO`

#### CT-EP005-US020-10 — Descrição vazia retorna 400
- **Rastreabilidade:** US-020, RT-019
- **Prioridade:** Média
- **Passos:**
  1. Enviar `POST /api/transacoes` com `descricao` = "   " (apenas espaços).
- **Resultado esperado:**
  - HTTP `400`
  - `erro.codigo = CAMPO_OBRIGATORIO`

#### CT-EP005-US020-11 — Criação sem token
- **Rastreabilidade:** US-020, RT-005, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `POST /api/transacoes` sem header Authorization.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

---

### US-021 — Listar transações com filtros (`GET /api/transacoes`)

#### CT-EP005-US021-01 — Listagem retorna apenas transações do usuário autenticado
- **Rastreabilidade:** US-021, RT-036
- **Prioridade:** Alta
- **Pré-condições:** token JWT válido; transações de múltiplos usuários no sistema
- **Passos:**
  1. Enviar `GET /api/transacoes` com token válido.
- **Resultado esperado:**
  - HTTP `200`
  - Body contém apenas transações vinculadas às contas do usuário autenticado

#### CT-EP005-US021-02 — Ordem padrão por data descendente
- **Rastreabilidade:** US-021, RT-037
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/transacoes` sem parâmetros de ordenação.
- **Resultado esperado:**
  - HTTP `200`
  - Transações ordenadas por `dataTransacao` descendente

#### CT-EP005-US021-03 — Filtro por tipo
- **Rastreabilidade:** US-021, RT-041
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/transacoes?tipo=despesa`.
- **Resultado esperado:**
  - HTTP `200`
  - Todas as transações retornadas com tipo "despesa"

#### CT-EP005-US021-04 — Filtro por intervalo de datas
- **Rastreabilidade:** US-021, RT-044
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/transacoes?de=2026-04-01&ate=2026-04-30`.
- **Resultado esperado:**
  - HTTP `200`
  - Todas as transações dentro do intervalo informado

#### CT-EP005-US021-05 — Combinação de múltiplos filtros
- **Rastreabilidade:** US-021, RT-046
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/transacoes?tipo=despesa&contaId=1&categoriaId=3`.
- **Resultado esperado:**
  - HTTP `200`
  - Transações atendem a todos os filtros simultaneamente

#### CT-EP005-US021-06 — Listagem sem token
- **Rastreabilidade:** US-021, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/transacoes` sem header Authorization.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

---

### US-022 — Consultar transação específica (`GET /api/transacoes/:id`)

#### CT-EP005-US022-01 — Consulta bem-sucedida
- **Rastreabilidade:** US-022, RT-049, RT-052
- **Prioridade:** Alta
- **Pré-condições:** token JWT válido; transação pertencente ao usuário
- **Passos:**
  1. Enviar `GET /api/transacoes/:id` com ID de transação própria.
- **Resultado esperado:**
  - HTTP `200`
  - Body com `id`, `tipo`, `valor`, `descricao`, `dataTransacao`, `conta`, `categoria`, `criadoEm`, `atualizadoEm`

#### CT-EP005-US022-02 — Transação de outro usuário retorna 404
- **Rastreabilidade:** US-022, RT-050, RT-074
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/transacoes/:id` com ID de transação de outro usuário.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = RECURSO_NAO_ENCONTRADO`

#### CT-EP005-US022-03 — Transação inexistente retorna 404
- **Rastreabilidade:** US-022, RT-051
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/transacoes/:id` com ID inexistente.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = RECURSO_NAO_ENCONTRADO`

#### CT-EP005-US022-04 — Consulta sem token
- **Rastreabilidade:** US-022, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/transacoes/:id` sem header Authorization.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

---

### US-023 — Atualizar transação (`PUT /api/transacoes/:id`)

#### CT-EP005-US023-01 — Atualização bem-sucedida de valor e descrição
- **Rastreabilidade:** US-023, RT-053, RT-058
- **Prioridade:** Alta
- **Pré-condições:** token válido; transação própria em conta ativa
- **Passos:**
  1. Enviar `PUT /api/transacoes/:id` com novo `valor` e nova `descricao`.
- **Resultado esperado:**
  - HTTP `200`
  - Dados atualizados retornados
  - `atualizadoEm` com timestamp recente

#### CT-EP005-US023-02 — Atualização parcial apenas da categoria
- **Rastreabilidade:** US-023, RT-034, RT-055
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `PUT /api/transacoes/:id` apenas com `categoriaId`.
- **Resultado esperado:**
  - HTTP `200`
  - Apenas a categoria alterada; demais campos inalterados

#### CT-EP005-US023-03 — Tipo é imutável
- **Rastreabilidade:** US-023, RT-012, RT-054
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `PUT /api/transacoes/:id` tentando alterar o campo `tipo`.
- **Resultado esperado:**
  - HTTP `400`
  - `erro.codigo = CAMPO_IMUTAVEL`

#### CT-EP005-US023-04 — ContaId é imutável
- **Rastreabilidade:** US-023, RT-030, RT-054
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `PUT /api/transacoes/:id` tentando alterar o campo `contaId`.
- **Resultado esperado:**
  - HTTP `400`
  - `erro.codigo = CAMPO_IMUTAVEL`

#### CT-EP005-US023-05 — Nova categoria incompatível com tipo retorna 422
- **Rastreabilidade:** US-023, RT-035
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `PUT /api/transacoes/:id` com `categoriaId` exclusivamente de tipo diferente.
- **Resultado esperado:**
  - HTTP `422`
  - `erro.codigo = CATEGORIA_INCOMPATIVEL`

#### CT-EP005-US023-06 — Atualização em conta inativa retorna 422
- **Rastreabilidade:** US-023, RT-057
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `PUT /api/transacoes/:id` para transação em conta com `ativa = false`.
- **Resultado esperado:**
  - HTTP `422`
  - `erro.codigo = CONTA_INATIVA`

#### CT-EP005-US023-07 — Transação de outro usuário retorna 404
- **Rastreabilidade:** US-023, RG-012
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `PUT /api/transacoes/:id` com ID de transação de outro usuário.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = RECURSO_NAO_ENCONTRADO`

#### CT-EP005-US023-08 — Atualização sem token
- **Rastreabilidade:** US-023, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `PUT /api/transacoes/:id` sem header Authorization.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

---

### US-024 — Excluir transação (`DELETE /api/transacoes/:id`)

#### CT-EP005-US024-01 — Exclusão bem-sucedida
- **Rastreabilidade:** US-024, RT-060, RT-064
- **Prioridade:** Alta
- **Pré-condições:** token válido; transação própria
- **Passos:**
  1. Enviar `DELETE /api/transacoes/:id` com ID de transação própria.
- **Resultado esperado:**
  - HTTP `204`
  - Sem body de resposta
  - Transação removida permanentemente

#### CT-EP005-US024-02 — Saldo recalculado após exclusão
- **Rastreabilidade:** US-024, RT-065, RT-068
- **Prioridade:** Alta
- **Pré-condições:** conta com saldo calculado considerando a transação
- **Passos:**
  1. Consultar saldo da conta antes da exclusão.
  2. Enviar `DELETE /api/transacoes/:id`.
  3. Consultar saldo da conta após a exclusão.
- **Resultado esperado:**
  - Saldo recalculado sem a transação excluída

#### CT-EP005-US024-03 — Exclusão em conta inativa é permitida
- **Rastreabilidade:** US-024, RT-063
- **Prioridade:** Média
- **Pré-condições:** transação em conta com `ativa = false`
- **Passos:**
  1. Enviar `DELETE /api/transacoes/:id` para transação em conta inativa.
- **Resultado esperado:**
  - HTTP `204`
  - Transação removida normalmente

#### CT-EP005-US024-04 — Transação de outro usuário retorna 404
- **Rastreabilidade:** US-024, RT-062, RG-012
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `DELETE /api/transacoes/:id` com ID de transação de outro usuário.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = RECURSO_NAO_ENCONTRADO`

#### CT-EP005-US024-05 — Transação inexistente retorna 404
- **Rastreabilidade:** US-024, RT-062
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `DELETE /api/transacoes/:id` com ID inexistente.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = RECURSO_NAO_ENCONTRADO`

#### CT-EP005-US024-06 — Exclusão sem token
- **Rastreabilidade:** US-024, RT-061, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `DELETE /api/transacoes/:id` sem header Authorization.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

---

### US-025 — Buscar transações por descrição (`GET /api/transacoes?q=`)

#### CT-EP005-US025-01 — Busca por substring encontra transações
- **Rastreabilidade:** US-025, RT-045
- **Prioridade:** Alta
- **Pré-condições:** token JWT válido; transações com "Mercado" na descrição
- **Passos:**
  1. Enviar `GET /api/transacoes?q=mercado`.
- **Resultado esperado:**
  - HTTP `200`
  - Todas as transações retornadas contêm "mercado" na descrição

#### CT-EP005-US025-02 — Busca é case-insensitive
- **Rastreabilidade:** US-025, RT-045
- **Prioridade:** Alta
- **Pré-condições:** transação com descrição "Almoço com clientes"
- **Passos:**
  1. Enviar `GET /api/transacoes?q=ALMOÇO`.
- **Resultado esperado:**
  - HTTP `200`
  - Transação com "Almoço com clientes" retornada

#### CT-EP005-US025-03 — Busca combinada com filtros
- **Rastreabilidade:** US-025, RT-045, RT-046
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/transacoes?q=mercado&tipo=despesa&contaId=1`.
- **Resultado esperado:**
  - HTTP `200`
  - Transações atendem a todos os critérios simultaneamente

#### CT-EP005-US025-04 — Busca sem resultados retorna array vazio
- **Rastreabilidade:** US-025, RT-045
- **Prioridade:** Média
- **Passos:**
  1. Enviar `GET /api/transacoes?q=xyzabcdefghijk`.
- **Resultado esperado:**
  - HTTP `200`
  - Array vazio no body

#### CT-EP005-US025-05 — Busca sem token
- **Rastreabilidade:** US-025, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/transacoes?q=mercado` sem header Authorization.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

---

## 5. Resumo de cobertura

- **Total de casos:** 40
- **Distribuição por US:**
  - US-020: 11
  - US-021: 6
  - US-022: 4
  - US-023: 8
  - US-024: 6
  - US-025: 5

---

## 6. Próximos passos

1. Classificar quais casos entram primeiro na automação (`tipo:testes`) por risco.
2. Selecionar amostra crítica para execução manual exploratória com evidência.
3. Evoluir para matriz de rastreabilidade de execução (`planejado`, `executado`, `aprovado`, `reprovado`).
