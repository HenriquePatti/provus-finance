# ✅ Casos de Teste — EP-004: Gestão de Categorias

> Casos de teste do Épico 4, elaborados com base nas User Stories de categorias e nas regras de negócio vigentes, mantendo rastreabilidade completa.

---

## 1. Objetivo

Definir os cenários de teste do EP-004 para validar listagem, criação, consulta, atualização e exclusão de categorias (padrão e personalizadas).

---

## 2. Referências

- `docs/05-user-stories/ep-004-categorias.md`
- `docs/02-regras-negocio/regras-gerais.md`
- `docs/03-arquitetura/api-contratos.md`
- `docs/06-testes/estrategia-testes.md`
- `docs/06-testes/plano-testes-fase-1.md`

---

## 3. Convenções

- **ID do caso:** `CT-EP004-USXXX-YY`
- **Tipo:** API (automatizável) + execução manual complementar
- **Rastreabilidade obrigatória:** `US` + `RK/RG`
- **Formato esperado de erro:** `{"erro":{"codigo":"...","mensagem":"..."}}`

---

## 4. Casos de teste

### US-015 — Listar categorias (`GET /api/categorias`)

#### CT-EP004-US015-01 — Listagem retorna categorias padrão e personalizadas
- **Rastreabilidade:** US-015, RK-027, RK-028
- **Prioridade:** Alta
- **Pré-condições:** token JWT válido; usuário com categorias personalizadas criadas
- **Passos:**
  1. Enviar `GET /api/categorias` com token válido.
- **Resultado esperado:**
  - HTTP `200`
  - Body contém categorias padrão e personalizadas do usuário
  - Sem categorias personalizadas de outros usuários

#### CT-EP004-US015-02 — Filtro por tipo (despesa)
- **Rastreabilidade:** US-015, RK-029
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/categorias?tipo=despesa`.
- **Resultado esperado:**
  - HTTP `200`
  - Todas as categorias retornadas com tipo "despesa" ou "ambos"

#### CT-EP004-US015-03 — Filtro por origem (padrao=true)
- **Rastreabilidade:** US-015, RK-030
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/categorias?padrao=true`.
- **Resultado esperado:**
  - HTTP `200`
  - Todas as categorias retornadas com padrao = true

#### CT-EP004-US015-04 — Usuário sem categorias personalizadas vê apenas padrão
- **Rastreabilidade:** US-015, RK-027
- **Prioridade:** Média
- **Pré-condições:** usuário sem categorias personalizadas
- **Passos:**
  1. Enviar `GET /api/categorias` com token válido.
- **Resultado esperado:**
  - HTTP `200`
  - Apenas as 13 categorias padrão retornadas

#### CT-EP004-US015-05 — Cada categoria contém campos esperados
- **Rastreabilidade:** US-015, RK-031
- **Prioridade:** Média
- **Passos:**
  1. Enviar `GET /api/categorias` com token válido.
  2. Inspecionar cada item do array.
- **Resultado esperado:**
  - Cada categoria contém id, nome, tipo, icone, padrao e criadoEm

#### CT-EP004-US015-06 — Listagem sem token
- **Rastreabilidade:** US-015, RK-032, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/categorias` sem header Authorization.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

#### CT-EP004-US015-07 — Filtro por tipo (receita)
- **Rastreabilidade:** US-015, RK-029
- **Prioridade:** Média
- **Passos:**
  1. Enviar `GET /api/categorias?tipo=receita`.
- **Resultado esperado:**
  - HTTP `200`
  - Todas as categorias retornadas com tipo "receita" ou "ambos"

---

### US-016 — Criar categoria personalizada (`POST /api/categorias`)

#### CT-EP004-US016-01 — Criação com dados válidos
- **Rastreabilidade:** US-016, RK-010, RK-013, RK-014
- **Prioridade:** Alta
- **Pré-condições:** token JWT válido
- **Passos:**
  1. Enviar `POST /api/categorias` com `nome`, `tipo` válidos.
- **Resultado esperado:**
  - HTTP `201`
  - Body com `id`, `nome`, `tipo`, `icone`, `padrao`, `criadoEm`
  - `padrao = false`

#### CT-EP004-US016-02 — Criação com ícone opcional
- **Rastreabilidade:** US-016, RK-012
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `POST /api/categorias` com `nome`, `tipo` e `icone`.
- **Resultado esperado:**
  - HTTP `201`
  - `icone` presente no retorno

#### CT-EP004-US016-03 — Criação sem ícone
- **Rastreabilidade:** US-016, RK-012
- **Prioridade:** Média
- **Passos:**
  1. Enviar `POST /api/categorias` sem campo `icone`.
- **Resultado esperado:**
  - HTTP `201`
  - `icone` null ou ausente

#### CT-EP004-US016-04 — Tipo inválido
- **Rastreabilidade:** US-016, RK-011
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição com `tipo` diferente de receita, despesa ou ambos.
- **Resultado esperado:**
  - HTTP `400`
  - erro de validação no campo tipo

#### CT-EP004-US016-05 — Nome ausente
- **Rastreabilidade:** US-016, RK-010, RG-014
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição sem campo `nome`.
- **Resultado esperado:**
  - HTTP `400`
  - erro de obrigatoriedade para `nome`

#### CT-EP004-US016-06 — Campo padrao ignorado (forçado false)
- **Rastreabilidade:** US-016, RK-013
- **Prioridade:** Média
- **Passos:**
  1. Enviar requisição com `padrao: true` no corpo.
- **Resultado esperado:**
  - HTTP `201`
  - `padrao = false` independentemente do valor enviado

#### CT-EP004-US016-07 — Criação sem token
- **Rastreabilidade:** US-016, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `POST /api/categorias` sem header Authorization.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

#### CT-EP004-US016-08 — Aceitar todos os 3 tipos válidos
- **Rastreabilidade:** US-016, RK-011
- **Prioridade:** Alta
- **Passos:**
  1. Criar categoria para cada tipo: receita, despesa, ambos.
- **Resultado esperado:**
  - HTTP `201` para cada tipo

---

### US-017 — Consultar categoria (`GET /api/categorias/:id`)

#### CT-EP004-US017-01 — Consulta de categoria padrão
- **Rastreabilidade:** US-017, RK-033
- **Prioridade:** Alta
- **Pré-condições:** token JWT válido
- **Passos:**
  1. Enviar `GET /api/categorias/:id` com ID de categoria padrão.
- **Resultado esperado:**
  - HTTP `200`
  - Body com `id`, `nome`, `tipo`, `icone`, `padrao`, `criadoEm`
  - `padrao = true`

#### CT-EP004-US017-02 — Consulta de categoria personalizada pelo criador
- **Rastreabilidade:** US-017, RK-034
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/categorias/:id` com ID de categoria personalizada própria.
- **Resultado esperado:**
  - HTTP `200`
  - `padrao = false`

#### CT-EP004-US017-03 — Categoria personalizada de outro usuário retorna 404
- **Rastreabilidade:** US-017, RK-034, RG-012
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/categorias/:id` com ID de categoria personalizada de outro usuário.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = CATEGORIA_NAO_ENCONTRADA`

#### CT-EP004-US017-04 — Categoria inexistente retorna 404
- **Rastreabilidade:** US-017, RK-035
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/categorias/:id` com ID inexistente.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = CATEGORIA_NAO_ENCONTRADA`

#### CT-EP004-US017-05 — Consulta sem token
- **Rastreabilidade:** US-017, RK-036, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `GET /api/categorias/:id` sem header Authorization.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

---

### US-018 — Atualizar categoria personalizada (`PUT /api/categorias/:id`)

#### CT-EP004-US018-01 — Atualização completa de nome e ícone
- **Rastreabilidade:** US-018, RK-037, RK-043
- **Prioridade:** Alta
- **Pré-condições:** token válido; categoria personalizada própria
- **Passos:**
  1. Enviar `PUT /api/categorias/:id` com novo `nome` e novo `icone`.
- **Resultado esperado:**
  - HTTP `200`
  - dados atualizados retornados

#### CT-EP004-US018-02 — Atualização parcial apenas do nome
- **Rastreabilidade:** US-018, RK-038
- **Prioridade:** Alta
- **Passos:**
  1. Enviar atualização apenas com `nome`.
- **Resultado esperado:**
  - HTTP `200`
  - apenas o nome alterado

#### CT-EP004-US018-03 — Tipo é imutável
- **Rastreabilidade:** US-018, RK-039
- **Prioridade:** Alta
- **Passos:**
  1. Enviar atualização tentando alterar o campo `tipo`.
- **Resultado esperado:**
  - campo tipo permanece inalterado
  - ou HTTP `400` indicando que tipo não pode ser alterado

#### CT-EP004-US018-04 — Tentativa de atualizar categoria padrão retorna 403
- **Rastreabilidade:** US-018, RK-040
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `PUT /api/categorias/:id` com ID de categoria padrão.
- **Resultado esperado:**
  - HTTP `403`
  - `erro.codigo = ACESSO_NEGADO`

#### CT-EP004-US018-05 — Categoria personalizada de outro usuário retorna 404
- **Rastreabilidade:** US-018, RK-041, RG-012
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `PUT /api/categorias/:id` com ID de categoria personalizada de outro usuário.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = CATEGORIA_NAO_ENCONTRADA`

#### CT-EP004-US018-06 — Categoria inexistente retorna 404
- **Rastreabilidade:** US-018, RK-041
- **Prioridade:** Média
- **Passos:**
  1. Enviar `PUT /api/categorias/:id` com ID inexistente.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = CATEGORIA_NAO_ENCONTRADA`

#### CT-EP004-US018-07 — Nome inválido na atualização
- **Rastreabilidade:** US-018, RK-037
- **Prioridade:** Média
- **Passos:**
  1. Enviar nome vazio ou inválido.
- **Resultado esperado:**
  - HTTP `400`
  - erro de validação

#### CT-EP004-US018-08 — Atualização sem token
- **Rastreabilidade:** US-018, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `PUT /api/categorias/:id` sem header Authorization.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

---

### US-019 — Excluir categoria personalizada (`DELETE /api/categorias/:id`)

#### CT-EP004-US019-01 — Exclusão de categoria sem transações
- **Rastreabilidade:** US-019, RK-044, RK-048
- **Prioridade:** Alta
- **Pré-condições:** token válido; categoria personalizada própria sem transações
- **Passos:**
  1. Enviar `DELETE /api/categorias/:id` com ID de categoria personalizada sem transações.
- **Resultado esperado:**
  - HTTP `204`
  - sem body de resposta

#### CT-EP004-US019-02 — Exclusão bloqueada por transações vinculadas
- **Rastreabilidade:** US-019, RK-045
- **Prioridade:** Alta
- **Pré-condições:** categoria personalizada com transações associadas
- **Passos:**
  1. Enviar `DELETE /api/categorias/:id` com ID de categoria em uso.
- **Resultado esperado:**
  - HTTP `409`
  - `erro.codigo = CATEGORIA_EM_USO`

#### CT-EP004-US019-03 — Tentativa de excluir categoria padrão retorna 403
- **Rastreabilidade:** US-019, RK-046
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `DELETE /api/categorias/:id` com ID de categoria padrão.
- **Resultado esperado:**
  - HTTP `403`
  - `erro.codigo = ACESSO_NEGADO`

#### CT-EP004-US019-04 — Categoria personalizada de outro usuário retorna 404
- **Rastreabilidade:** US-019, RK-047, RG-012
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `DELETE /api/categorias/:id` com ID de categoria personalizada de outro usuário.
- **Resultado esperado:**
  - HTTP `404`
  - `erro.codigo = CATEGORIA_NAO_ENCONTRADA`

#### CT-EP004-US019-05 — Exclusão sem token
- **Rastreabilidade:** US-019, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `DELETE /api/categorias/:id` sem header Authorization.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

---

## 5. Resumo de cobertura

- **Total de casos:** 33
- **Distribuição por US:**
  - US-015: 7
  - US-016: 8
  - US-017: 5
  - US-018: 8
  - US-019: 5

---

## 6. Próximos passos

1. Classificar quais casos entram primeiro na automação (`tipo:testes`) por risco.
2. Selecionar amostra crítica para execução manual exploratória com evidência.
3. Evoluir para matriz de rastreabilidade de execução (`planejado`, `executado`, `aprovado`, `reprovado`).
