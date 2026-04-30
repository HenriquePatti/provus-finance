# Casos de Teste — EP-005: Gestao de Transacoes
> Baseado na ISO-29119-3. Casos de teste do Epico 5 com rastreabilidade completa.

---

## 1. Objetivo

Definir os cenarios de teste do EP-005 para validar registro, listagem, consulta, atualizacao, exclusao e busca de transacoes financeiras.

---

## 2. Referencias

- `docs/05-user-stories/ep-005-transacoes.md`
- `docs/02-regras-negocio/regras-transacao.md`
- `docs/02-regras-negocio/regras-gerais.md`
- `docs/03-arquitetura/api-contratos.md`
- `docs/06-testes/estrategia-testes.md`
- `docs/06-testes/plano-testes-fase-1.md`

---

## 3. Convencoes

- **ID do caso:** `CT-EP005-USXXX-YY`
- **Tipo:** API (automatizavel) + execucao manual complementar
- **Rastreabilidade obrigatoria:** `US` + `RT/RG`
- **Formato esperado de erro:** `{"erro":{"codigo":"...","mensagem":"..."}}`

---

## 4. Casos de Teste

### US-020 — Registrar transacao (POST /api/transacoes)

#### CT-EP005-US020-01 — Criar despesa valida

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US020-01 |
| **Titulo** | Validar que uma despesa valida e registrada com sucesso |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-020, RT-004, RT-007 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Conta ativa existente\n- Categoria do tipo despesa existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/transacoes com body {tipo: "despesa", valor, descricao, data, contaId, categoriaId} | Status 201 |
| 2 | Verificar campos da resposta | tipo=despesa, demais campos correspondem ao enviado |

| **Pos-Condicoes** | - Transacao persistida no banco de dados\n- Saldo da conta ajustado (decrementado) |

---

#### CT-EP005-US020-02 — Criar receita valida

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US020-02 |
| **Titulo** | Validar que uma receita valida e registrada com sucesso |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-020, RT-001 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Conta ativa existente\n- Categoria do tipo receita existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/transacoes com body {tipo: "receita", valor, descricao, data, contaId, categoriaId} | Status 201 |
| 2 | Verificar campo tipo na resposta | tipo=receita |

| **Pos-Condicoes** | - Transacao persistida no banco\n- Saldo da conta aumentado |

---

#### CT-EP005-US020-03 — Impacto no saldo apos despesa

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US020-03 |
| **Titulo** | Validar que o saldo da conta e ajustado corretamente apos registrar despesa |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-020, RT-066 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Conta com saldoInicial=5000 |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/transacoes com despesa valor=200 na conta | Status 201 |
| 2 | Consultar saldo da conta via GET /api/contas/:id | Saldo = 4800 (5000 - 200) |

| **Pos-Condicoes** | - Saldo da conta atualizado para 4800 |

---

#### CT-EP005-US020-04 — Valor menor ou igual a zero

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US020-04 |
| **Titulo** | Validar que transacao com valor menor ou igual a zero retorna 400 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-020, RT-013 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/transacoes com valor=0 | Status 400 com mensagem de validacao |
| 2 | Enviar POST /api/transacoes com valor=-100 | Status 400 com mensagem de validacao |

| **Pos-Condicoes** | - Nenhuma transacao criada no banco |

---

#### CT-EP005-US020-05 — Tipo invalido

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US020-05 |
| **Titulo** | Validar que transacao com tipo invalido retorna 400 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-020, RT-009 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/transacoes com tipo="invalido" | Status 400 com mensagem de validacao |

| **Pos-Condicoes** | - Nenhuma transacao criada no banco |

---

#### CT-EP005-US020-06 — Descricao vazia

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US020-06 |
| **Titulo** | Validar que transacao com descricao vazia retorna 400 |
| **Prioridade** | Media |
| **Rastreabilidade** | US-020, RT-019 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/transacoes com descricao="" | Status 400 com mensagem de validacao |

| **Pos-Condicoes** | - Nenhuma transacao criada no banco |

---

#### CT-EP005-US020-07 — Data invalida

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US020-07 |
| **Titulo** | Validar que transacao com data invalida retorna 400 |
| **Prioridade** | Media |
| **Rastreabilidade** | US-020, RT-025 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/transacoes com data="data-invalida" | Status 400 com mensagem de validacao |

| **Pos-Condicoes** | - Nenhuma transacao criada no banco |

---

#### CT-EP005-US020-08 — Conta inexistente

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US020-08 |
| **Titulo** | Validar que transacao com conta inexistente retorna 404 CONTA_NAO_ENCONTRADA |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-020, RT-028 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/transacoes com contaId=99999 | Status 404 com codigo CONTA_NAO_ENCONTRADA |

| **Pos-Condicoes** | - Nenhuma transacao criada no banco |

---

#### CT-EP005-US020-09 — Categoria incompativel com tipo da transacao

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US020-09 |
| **Titulo** | Validar que transacao despesa com categoria tipo receita retorna 422 CATEGORIA_INCOMPATIVEL |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-020, RK-005 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categoria do tipo receita existente\n- Conta ativa existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/transacoes com tipo=despesa e categoriaId de categoria tipo=receita | Status 422 com codigo CATEGORIA_INCOMPATIVEL |

| **Pos-Condicoes** | - Nenhuma transacao criada no banco |

---

#### CT-EP005-US020-10 — Conta inativa

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US020-10 |
| **Titulo** | Validar que transacao em conta inativa retorna 422 CONTA_INATIVA |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-020, RT-029 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Conta inativa existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/transacoes com contaId de conta inativa | Status 422 com codigo CONTA_INATIVA |

| **Pos-Condicoes** | - Nenhuma transacao criada no banco |

---

#### CT-EP005-US020-11 — Criar transacao sem token

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US020-11 |
| **Titulo** | Validar que criar transacao sem token retorna 401 TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-020, RG-009 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/transacoes sem header Authorization | Status 401 com codigo TOKEN_AUSENTE |

| **Pos-Condicoes** | - Nenhuma transacao criada no banco |

---

### US-021 — Listar transacoes (GET /api/transacoes)

#### CT-EP005-US021-01 — Listar transacoes do usuario

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US021-01 |
| **Titulo** | Validar que o endpoint retorna as transacoes do usuario autenticado |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-021, RT-036 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- 2 ou mais transacoes cadastradas |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/transacoes com token valido | Status 200 |
| 2 | Verificar corpo da resposta | Array com as transacoes do usuario |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US021-02 — Filtrar por tipo despesa

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US021-02 |
| **Titulo** | Validar que o filtro ?tipo=despesa retorna apenas transacoes de despesa |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-021, RT-041 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Transacoes de receita e despesa cadastradas |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/transacoes?tipo=despesa com token valido | Status 200 |
| 2 | Verificar tipos retornados | Todas as transacoes possuem tipo=despesa |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US021-03 — Filtrar por periodo

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US021-03 |
| **Titulo** | Validar que o filtro por periodo retorna transacoes dentro do intervalo informado |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-021, RT-044 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Transacoes com datas variadas cadastradas |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/transacoes?dataInicio=2026-01-01&dataFim=2026-01-31 com token valido | Status 200 |
| 2 | Verificar datas das transacoes retornadas | Todas dentro do periodo 2026-01-01 a 2026-01-31 |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US021-04 — Lista vazia

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US021-04 |
| **Titulo** | Validar que usuario sem transacoes recebe array vazio |
| **Prioridade** | Media |
| **Rastreabilidade** | US-021 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Nenhuma transacao cadastrada para o usuario |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/transacoes com token valido | Status 200 com body [] |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US021-05 — Isolamento entre usuarios

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US021-05 |
| **Titulo** | Validar que um usuario nao visualiza transacoes de outro usuario |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-021, RT-074 |
| **Pre-Condicoes** | - Dois usuarios cadastrados (user1 e user2)\n- user2 possui transacoes cadastradas |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Autenticar como user1 | Token valido de user1 |
| 2 | Enviar GET /api/transacoes com token de user1 | Status 200 |
| 3 | Verificar transacoes retornadas | Nenhuma transacao de user2 aparece na lista |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US021-06 — Listar transacoes sem token

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US021-06 |
| **Titulo** | Validar que listar transacoes sem token retorna 401 TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-021, RG-009 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/transacoes sem header Authorization | Status 401 com codigo TOKEN_AUSENTE |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

### US-022 — Consultar transacao por ID (GET /api/transacoes/:id)

#### CT-EP005-US022-01 — Consultar transacao existente

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US022-01 |
| **Titulo** | Validar que e possivel consultar uma transacao existente pelo ID com todos os campos |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-022, RT-049 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Transacao propria existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/transacoes/:id com token valido | Status 200 |
| 2 | Verificar campos da resposta | Todos os campos presentes (id, tipo, valor, descricao, data, contaId, categoriaId) |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US022-02 — Consultar transacao com ID inexistente

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US022-02 |
| **Titulo** | Validar que consultar transacao com ID inexistente retorna 404 TRANSACAO_NAO_ENCONTRADA |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-022, RT-051 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/transacoes/99999 com token valido | Status 404 com codigo TRANSACAO_NAO_ENCONTRADA |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US022-03 — Consultar transacao de outro usuario

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US022-03 |
| **Titulo** | Validar que consultar transacao de outro usuario retorna 404 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-022, RT-050 |
| **Pre-Condicoes** | - Dois usuarios cadastrados\n- user2 possui transacao cadastrada |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Autenticar como user1 | Token valido de user1 |
| 2 | Enviar GET /api/transacoes/:id da transacao de user2 | Status 404 |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US022-04 — Consultar transacao sem token

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US022-04 |
| **Titulo** | Validar que consultar transacao sem token retorna 401 TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-022, RG-009 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/transacoes/:id sem header Authorization | Status 401 com codigo TOKEN_AUSENTE |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

### US-023 — Atualizar transacao (PUT /api/transacoes/:id)

#### CT-EP005-US023-01 — Atualizar valor e descricao

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US023-01 |
| **Titulo** | Validar que e possivel atualizar valor e descricao de uma transacao |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-023, RT-053 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Transacao propria existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/transacoes/:id com body {valor: 150, descricao: "Atualizado"} | Status 200 |
| 2 | Verificar campos na resposta | valor=150, descricao="Atualizado" |

| **Pos-Condicoes** | - Campos da transacao alterados no banco de dados |

---

#### CT-EP005-US023-02 — Alterar categoriaId

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US023-02 |
| **Titulo** | Validar que e possivel alterar a categoria de uma transacao |
| **Prioridade** | Media |
| **Rastreabilidade** | US-023, RT-034 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Transacao propria existente\n- Categoria compativel com o tipo da transacao |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/transacoes/:id com body {categoriaId: novaCategoria} | Status 200 |
| 2 | Verificar categoriaId na resposta | categoriaId atualizado para o novo valor |

| **Pos-Condicoes** | - categoriaId da transacao alterado no banco |

---

#### CT-EP005-US023-03 — Tipo e contaId sao imutaveis

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US023-03 |
| **Titulo** | Validar que tipo e contaId sao preservados mesmo se enviados no body |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-023, RT-054 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Transacao propria existente (tipo=despesa, contaId=X) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/transacoes/:id com body {tipo: "receita", contaId: 99999, descricao: "Teste"} | Status 200 |
| 2 | Verificar tipo e contaId na resposta | tipo=despesa (original preservado), contaId=X (original preservado) |

| **Pos-Condicoes** | - tipo e contaId permanecem inalterados no banco |

---

#### CT-EP005-US023-04 — Saldo reflete valor atualizado

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US023-04 |
| **Titulo** | Validar que o saldo da conta e recalculado apos atualizacao do valor da transacao |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-023, RT-059 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Conta com saldoInicial=5000\n- Despesa de valor=200 ja registrada (saldo atual=4800) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/transacoes/:id com body {valor: 500} | Status 200 |
| 2 | Consultar saldo da conta via GET /api/contas/:id | Saldo = 4500 (5000 - 500) |

| **Pos-Condicoes** | - Saldo da conta atualizado para 4500 |

---

#### CT-EP005-US023-05 — Atualizar transacao com body vazio

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US023-05 |
| **Titulo** | Validar que enviar body vazio retorna 400 CORPO_VAZIO |
| **Prioridade** | Media |
| **Rastreabilidade** | US-023 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Transacao propria existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/transacoes/:id com body vazio {} | Status 400 com codigo CORPO_VAZIO |

| **Pos-Condicoes** | - Transacao permanece inalterada no banco |

---

#### CT-EP005-US023-06 — Categoria incompativel na atualizacao

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US023-06 |
| **Titulo** | Validar que atualizar com categoria incompativel retorna 422 CATEGORIA_INCOMPATIVEL |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-023, RT-033 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Transacao tipo=despesa existente\n- Categoria tipo=receita existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/transacoes/:id com body {categoriaId: categoriaReceita} | Status 422 com codigo CATEGORIA_INCOMPATIVEL |

| **Pos-Condicoes** | - Transacao permanece inalterada no banco |

---

#### CT-EP005-US023-07 — Atualizar transacao com ID inexistente

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US023-07 |
| **Titulo** | Validar que atualizar transacao com ID inexistente retorna 404 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-023 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/transacoes/99999 com body {descricao: "Teste"} | Status 404 |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US023-08 — Atualizar transacao de outro usuario

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US023-08 |
| **Titulo** | Validar que atualizar transacao de outro usuario retorna 404 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-023 |
| **Pre-Condicoes** | - Dois usuarios cadastrados\n- user2 possui transacao cadastrada |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Autenticar como user1 | Token valido de user1 |
| 2 | Enviar PUT /api/transacoes/:id da transacao de user2 com body {descricao: "Hack"} | Status 404 |

| **Pos-Condicoes** | - Transacao de user2 permanece inalterada no banco |

---

### US-024 — Excluir transacao (DELETE /api/transacoes/:id)

#### CT-EP005-US024-01 — Excluir transacao

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US024-01 |
| **Titulo** | Validar que e possivel excluir uma transacao propria |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-024, RT-060, RT-064 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Transacao propria existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar DELETE /api/transacoes/:id com token valido | Status 204 |
| 2 | Enviar GET /api/transacoes/:id para verificar exclusao | Status 404 |

| **Pos-Condicoes** | - Transacao removida do banco de dados (hard delete) |

---

#### CT-EP005-US024-02 — Saldo recalculado apos excluir despesa

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US024-02 |
| **Titulo** | Validar que o saldo e recalculado apos excluir uma despesa |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-024, RT-065, RT-068 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Conta com saldoInicial=5000\n- Despesa de 200 registrada (saldo atual=4800) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar DELETE /api/transacoes/:id da despesa | Status 204 |
| 2 | Consultar saldo da conta via GET /api/contas/:id | Saldo = 5000 (4800 + 200 devolvido) |

| **Pos-Condicoes** | - Saldo da conta restaurado para 5000 |

---

#### CT-EP005-US024-03 — Saldo recalculado apos excluir receita

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US024-03 |
| **Titulo** | Validar que o saldo e recalculado apos excluir uma receita |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-024, RT-065 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Conta com saldoInicial=5000\n- Receita de 500 registrada (saldo atual=5500) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar DELETE /api/transacoes/:id da receita | Status 204 |
| 2 | Consultar saldo da conta via GET /api/contas/:id | Saldo = 5000 (5500 - 500 removido) |

| **Pos-Condicoes** | - Saldo da conta restaurado para 5000 |

---

#### CT-EP005-US024-04 — Excluir transacao com ID inexistente

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US024-04 |
| **Titulo** | Validar que excluir transacao com ID inexistente retorna 404 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-024 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar DELETE /api/transacoes/99999 com token valido | Status 404 |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US024-05 — Excluir transacao de outro usuario

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US024-05 |
| **Titulo** | Validar que excluir transacao de outro usuario retorna 404 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-024, RT-062 |
| **Pre-Condicoes** | - Dois usuarios cadastrados\n- user2 possui transacao cadastrada |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Autenticar como user1 | Token valido de user1 |
| 2 | Enviar DELETE /api/transacoes/:id da transacao de user2 | Status 404 |

| **Pos-Condicoes** | - Transacao de user2 permanece inalterada no banco |

---

#### CT-EP005-US024-06 — Excluir transacao sem token

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US024-06 |
| **Titulo** | Validar que excluir transacao sem token retorna 401 TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-024, RG-009 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar DELETE /api/transacoes/:id sem header Authorization | Status 401 com codigo TOKEN_AUSENTE |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

### US-025 — Buscar transacoes (GET /api/transacoes?q=)

#### CT-EP005-US025-01 — Buscar por termo

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US025-01 |
| **Titulo** | Validar que a busca por termo retorna transacoes correspondentes |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-025, RT-045 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Transacao com descricao contendo "supermercado" cadastrada |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/transacoes?q=supermercado com token valido | Status 200 |
| 2 | Verificar resultados | Array contendo transacoes cuja descricao contem "supermercado" |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US025-02 — Busca case-insensitive

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US025-02 |
| **Titulo** | Validar que a busca e case-insensitive |
| **Prioridade** | Media |
| **Rastreabilidade** | US-025, RT-045 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Transacao com descricao "Netflix" cadastrada |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/transacoes?q=netflix com token valido | Status 200 com resultado |
| 2 | Enviar GET /api/transacoes?q=NETFLIX com token valido | Status 200 com mesmo resultado |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US025-03 — Combinar busca com filtro tipo

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US025-03 |
| **Titulo** | Validar que combinar ?q= com ?tipo= aplica AND logico |
| **Prioridade** | Media |
| **Rastreabilidade** | US-025, RT-046 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Transacoes de receita e despesa com descricoes variadas |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/transacoes?q=supermercado&tipo=despesa com token valido | Status 200 |
| 2 | Verificar resultados | Apenas transacoes tipo=despesa contendo "supermercado" na descricao |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US025-04 — Busca sem resultados

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US025-04 |
| **Titulo** | Validar que busca sem resultados retorna array vazio |
| **Prioridade** | Baixa |
| **Rastreabilidade** | US-025 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/transacoes?q=termoInexistente com token valido | Status 200 com body [] |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP005-US025-05 — Isolamento de busca entre usuarios

| Campo | Valor |
|---|---|
| **ID** | CT-EP005-US025-05 |
| **Titulo** | Validar que a busca retorna apenas transacoes do proprio usuario |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-025, RT-074 |
| **Pre-Condicoes** | - Dois usuarios cadastrados\n- user2 possui transacao com descricao "Netflix" |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Autenticar como user1 | Token valido de user1 |
| 2 | Enviar GET /api/transacoes?q=Netflix com token de user1 | Status 200 |
| 3 | Verificar resultados | Nenhuma transacao de user2 aparece nos resultados |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

## 5. Resumo

| User Story | Quantidade de CTs |
|---|---|
| US-020 — POST /api/transacoes | 11 |
| US-021 — GET /api/transacoes | 6 |
| US-022 — GET /api/transacoes/:id | 4 |
| US-023 — PUT /api/transacoes/:id | 8 |
| US-024 — DELETE /api/transacoes/:id | 6 |
| US-025 — GET /api/transacoes?q= | 5 |
| **Total** | **40** |
