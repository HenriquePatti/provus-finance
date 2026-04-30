# Casos de Teste — EP-004: Gestao de Categorias
> Baseado na ISO-29119-3. Casos de teste do Epico 4 com rastreabilidade completa.

---

## 1. Objetivo

Definir os cenarios de teste do EP-004 para validar listagem, criacao, consulta, atualizacao e exclusao de categorias (padrao e personalizadas).

---

## 2. Referencias

- `docs/05-user-stories/ep-004-categorias.md`
- `docs/02-regras-negocio/regras-gerais.md`
- `docs/03-arquitetura/api-contratos.md`
- `docs/06-testes/estrategia-testes.md`
- `docs/06-testes/plano-testes-fase-1.md`

---

## 3. Convencoes

- **ID do caso:** `CT-EP004-USXXX-YY`
- **Tipo:** API (automatizavel) + execucao manual complementar
- **Rastreabilidade obrigatoria:** `US` + `RK/RG`
- **Formato esperado de erro:** `{"erro":{"codigo":"...","mensagem":"..."}}`

---

## 4. Casos de Teste

### US-015 — Listar categorias (GET /api/categorias)

#### CT-EP004-US015-01 — Listar categorias padrao e personalizadas

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US015-01 |
| **Titulo** | Validar que o endpoint retorna categorias padrao e personalizadas do usuario autenticado |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-015, RK-027 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Pelo menos 1 categoria personalizada criada pelo usuario |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/categorias com token valido | Status 200 |
| 2 | Verificar corpo da resposta | Array contendo categorias padrao (padrao=true) e personalizadas (padrao=false) |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP004-US015-02 — Categorias padrao aparecem primeiro ordenadas por nome

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US015-02 |
| **Titulo** | Validar que categorias padrao aparecem antes das personalizadas e ordenadas por nome |
| **Prioridade** | Media |
| **Rastreabilidade** | US-015, RK-028 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categorias padrao e personalizadas existentes |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/categorias com token valido | Status 200 |
| 2 | Verificar o primeiro item do array | Primeiro item possui padrao=true |
| 3 | Verificar ordenacao das categorias padrao | Categorias padrao ordenadas alfabeticamente por nome |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP004-US015-03 — Filtrar categorias por tipo despesa

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US015-03 |
| **Titulo** | Validar que o filtro ?tipo=despesa retorna apenas categorias de tipo despesa e ambos |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-015, RK-029 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categorias dos tres tipos existentes (receita, despesa, ambos) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/categorias?tipo=despesa com token valido | Status 200 |
| 2 | Verificar tipos retornados | Todas as categorias possuem tipo=despesa ou tipo=ambos |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP004-US015-04 — Filtrar categorias por origem padrao

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US015-04 |
| **Titulo** | Validar que o filtro ?origem=padrao retorna apenas categorias padrao |
| **Prioridade** | Media |
| **Rastreabilidade** | US-015, RK-030 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/categorias?origem=padrao com token valido | Status 200 |
| 2 | Verificar campo padrao de cada item | Todas as categorias possuem padrao=true |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP004-US015-05 — Filtrar categorias por origem personalizada

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US015-05 |
| **Titulo** | Validar que o filtro ?origem=personalizada retorna apenas categorias personalizadas |
| **Prioridade** | Media |
| **Rastreabilidade** | US-015, RK-030 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Pelo menos 1 categoria personalizada criada |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/categorias?origem=personalizada com token valido | Status 200 |
| 2 | Verificar campo padrao de cada item | Todas as categorias possuem padrao=false |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP004-US015-06 — Isolamento de categorias personalizadas entre usuarios

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US015-06 |
| **Titulo** | Validar que um usuario nao visualiza categorias personalizadas de outro usuario |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-015, RK-003 |
| **Pre-Condicoes** | - Dois usuarios cadastrados (user1 e user2)\n- user2 possui categoria personalizada criada |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Autenticar como user1 | Token valido de user1 |
| 2 | Enviar GET /api/categorias com token de user1 | Status 200 |
| 3 | Verificar categorias personalizadas retornadas | Nenhuma categoria personalizada de user2 aparece na lista |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP004-US015-07 — Listar categorias sem token

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US015-07 |
| **Titulo** | Validar que a listagem sem token retorna 401 TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-015, RG-009 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/categorias sem header Authorization | Status 401 com codigo TOKEN_AUSENTE |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

### US-016 — Criar categoria (POST /api/categorias)

#### CT-EP004-US016-01 — Criar categoria personalizada valida

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US016-01 |
| **Titulo** | Validar que uma categoria personalizada e criada com nome, tipo e icone validos |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-016, RK-010, RK-012 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/categorias com body {nome, tipo, icone} validos | Status 201 |
| 2 | Verificar campo padrao na resposta | padrao=false |
| 3 | Verificar campos nome, tipo e icone | Valores correspondem ao enviado |

| **Pos-Condicoes** | - Categoria personalizada persistida no banco de dados |

---

#### CT-EP004-US016-02 — Criar categoria sem icone

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US016-02 |
| **Titulo** | Validar que uma categoria pode ser criada sem icone, resultando em icone=null |
| **Prioridade** | Media |
| **Rastreabilidade** | US-016, RK-023 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/categorias com body {nome, tipo} sem campo icone | Status 201 |
| 2 | Verificar campo icone na resposta | icone=null |

| **Pos-Condicoes** | - Categoria criada no banco com icone nulo |

---

#### CT-EP004-US016-03 — Aceitar os tres tipos validos

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US016-03 |
| **Titulo** | Validar que os tipos receita, despesa e ambos sao aceitos na criacao |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-016, RK-004 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/categorias com tipo=receita | Status 201 |
| 2 | Enviar POST /api/categorias com tipo=despesa | Status 201 |
| 3 | Enviar POST /api/categorias com tipo=ambos | Status 201 |

| **Pos-Condicoes** | - Tres categorias criadas no banco |

---

#### CT-EP004-US016-04 — Campo padrao=true no body e ignorado

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US016-04 |
| **Titulo** | Validar que enviar padrao=true no body e ignorado e a categoria e criada como padrao=false |
| **Prioridade** | Media |
| **Rastreabilidade** | US-016, RK-008 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/categorias com body incluindo padrao=true | Status 201 |
| 2 | Verificar campo padrao na resposta | padrao=false |

| **Pos-Condicoes** | - Categoria criada como personalizada (padrao=false) |

---

#### CT-EP004-US016-05 — Criar categoria sem nome

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US016-05 |
| **Titulo** | Validar que criar categoria sem nome retorna erro 400 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-016, RK-010 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/categorias com body sem campo nome | Status 400 com mensagem de validacao |

| **Pos-Condicoes** | - Nenhuma categoria criada no banco |

---

#### CT-EP004-US016-06 — Criar categoria com tipo invalido

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US016-06 |
| **Titulo** | Validar que criar categoria com tipo invalido retorna erro 400 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-016, RK-020 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/categorias com tipo="invalido" | Status 400 com mensagem de validacao |

| **Pos-Condicoes** | - Nenhuma categoria criada no banco |

---

#### CT-EP004-US016-07 — Criar categoria com nome apenas numeros

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US016-07 |
| **Titulo** | Validar que criar categoria com nome contendo apenas numeros retorna erro 400 |
| **Prioridade** | Media |
| **Rastreabilidade** | US-016, RK-017 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/categorias com nome="12345" | Status 400 com mensagem de validacao |

| **Pos-Condicoes** | - Nenhuma categoria criada no banco |

---

#### CT-EP004-US016-08 — Criar categoria sem token

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US016-08 |
| **Titulo** | Validar que criar categoria sem token retorna 401 TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-016, RG-009 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar POST /api/categorias sem header Authorization | Status 401 com codigo TOKEN_AUSENTE |

| **Pos-Condicoes** | - Nenhuma categoria criada no banco |

---

### US-017 — Consultar categoria por ID (GET /api/categorias/:id)

#### CT-EP004-US017-01 — Consultar categoria padrao

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US017-01 |
| **Titulo** | Validar que e possivel consultar uma categoria padrao pelo ID |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-017, RK-034 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categoria padrao com id=1 existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/categorias/1 com token valido | Status 200 |
| 2 | Verificar campo padrao na resposta | padrao=true |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP004-US017-02 — Consultar categoria personalizada propria

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US017-02 |
| **Titulo** | Validar que e possivel consultar uma categoria personalizada propria pelo ID |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-017, RK-033 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categoria personalizada criada pelo proprio usuario |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/categorias/:id da categoria propria com token valido | Status 200 |
| 2 | Verificar dados da categoria | Dados correspondem a categoria criada pelo usuario |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP004-US017-03 — Consultar categoria com ID inexistente

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US017-03 |
| **Titulo** | Validar que consultar categoria com ID inexistente retorna 404 CATEGORIA_NAO_ENCONTRADA |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-017, RK-036 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/categorias/99999 com token valido | Status 404 com codigo CATEGORIA_NAO_ENCONTRADA |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP004-US017-04 — Consultar categoria personalizada de outro usuario

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US017-04 |
| **Titulo** | Validar que consultar categoria personalizada de outro usuario retorna 404 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-017, RK-035 |
| **Pre-Condicoes** | - Dois usuarios cadastrados\n- user2 possui categoria personalizada criada |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Autenticar como user1 | Token valido de user1 |
| 2 | Enviar GET /api/categorias/:id da categoria de user2 | Status 404 |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP004-US017-05 — Consultar categoria sem token

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US017-05 |
| **Titulo** | Validar que consultar categoria sem token retorna 401 TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-017, RG-009 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar GET /api/categorias/:id sem header Authorization | Status 401 com codigo TOKEN_AUSENTE |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

### US-018 — Atualizar categoria (PUT /api/categorias/:id)

#### CT-EP004-US018-01 — Atualizar nome da categoria

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US018-01 |
| **Titulo** | Validar que e possivel atualizar o nome de uma categoria personalizada |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-018, RK-038 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categoria personalizada propria existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/categorias/:id com body {nome: "Novo Nome"} | Status 200 |
| 2 | Verificar campo nome na resposta | nome="Novo Nome" |

| **Pos-Condicoes** | - Nome da categoria alterado no banco de dados |

---

#### CT-EP004-US018-02 — Atualizar icone da categoria

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US018-02 |
| **Titulo** | Validar que e possivel atualizar o icone de uma categoria personalizada |
| **Prioridade** | Media |
| **Rastreabilidade** | US-018, RK-038 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categoria personalizada propria existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/categorias/:id com body {icone: "novo-icone"} | Status 200 |
| 2 | Verificar campo icone na resposta | icone="novo-icone" |

| **Pos-Condicoes** | - Icone da categoria alterado no banco de dados |

---

#### CT-EP004-US018-03 — Remover icone da categoria

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US018-03 |
| **Titulo** | Validar que e possivel remover o icone enviando null |
| **Prioridade** | Baixa |
| **Rastreabilidade** | US-018, RK-042 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categoria personalizada com icone definido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/categorias/:id com body {icone: null} | Status 200 |
| 2 | Verificar campo icone na resposta | icone=null |

| **Pos-Condicoes** | - Icone removido da categoria no banco |

---

#### CT-EP004-US018-04 — Editar categoria padrao retorna 403

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US018-04 |
| **Titulo** | Validar que tentar editar uma categoria padrao retorna 403 ACESSO_NEGADO |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-018, RK-049 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categoria padrao existente (ex: id=1) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/categorias/1 com body {nome: "Tentativa"} | Status 403 com codigo ACESSO_NEGADO |

| **Pos-Condicoes** | - Categoria padrao permanece inalterada no banco |

---

#### CT-EP004-US018-05 — Atualizar categoria com body vazio

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US018-05 |
| **Titulo** | Validar que enviar body vazio retorna 400 CORPO_VAZIO |
| **Prioridade** | Media |
| **Rastreabilidade** | US-018 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categoria personalizada propria existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/categorias/:id com body vazio {} | Status 400 com codigo CORPO_VAZIO |

| **Pos-Condicoes** | - Categoria permanece inalterada no banco |

---

#### CT-EP004-US018-06 — Atualizar categoria com nome vazio

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US018-06 |
| **Titulo** | Validar que enviar nome vazio retorna erro 400 |
| **Prioridade** | Media |
| **Rastreabilidade** | US-018, RK-041 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categoria personalizada propria existente |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/categorias/:id com body {nome: ""} | Status 400 com mensagem de validacao |

| **Pos-Condicoes** | - Categoria permanece inalterada no banco |

---

#### CT-EP004-US018-07 — Atualizar categoria com ID inexistente

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US018-07 |
| **Titulo** | Validar que atualizar categoria com ID inexistente retorna 404 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-018 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar PUT /api/categorias/99999 com body {nome: "Teste"} | Status 404 |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP004-US018-08 — Atualizar categoria personalizada de outro usuario

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US018-08 |
| **Titulo** | Validar que atualizar categoria personalizada de outro usuario retorna 404 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-018, RK-037 |
| **Pre-Condicoes** | - Dois usuarios cadastrados\n- user2 possui categoria personalizada |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Autenticar como user1 | Token valido de user1 |
| 2 | Enviar PUT /api/categorias/:id da categoria de user2 com body {nome: "Hack"} | Status 404 |

| **Pos-Condicoes** | - Categoria de user2 permanece inalterada no banco |

---

### US-019 — Excluir categoria (DELETE /api/categorias/:id)

#### CT-EP004-US019-01 — Excluir categoria personalizada sem transacoes

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US019-01 |
| **Titulo** | Validar que e possivel excluir categoria personalizada sem transacoes vinculadas |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-019, RK-045, RK-047 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categoria personalizada propria sem transacoes vinculadas |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar DELETE /api/categorias/:id com token valido | Status 204 |
| 2 | Enviar GET /api/categorias/:id para verificar exclusao | Status 404 |

| **Pos-Condicoes** | - Categoria removida do banco de dados (hard delete) |

---

#### CT-EP004-US019-02 — Excluir categoria padrao retorna 403

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US019-02 |
| **Titulo** | Validar que tentar excluir uma categoria padrao retorna 403 ACESSO_NEGADO |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-019, RK-044 |
| **Pre-Condicoes** | - Usuario autenticado com token valido\n- Categoria padrao existente (ex: id=1) |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar DELETE /api/categorias/1 com token valido | Status 403 com codigo ACESSO_NEGADO |

| **Pos-Condicoes** | - Categoria padrao permanece inalterada no banco |

---

#### CT-EP004-US019-03 — Excluir categoria com ID inexistente

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US019-03 |
| **Titulo** | Validar que excluir categoria com ID inexistente retorna 404 CATEGORIA_NAO_ENCONTRADA |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-019 |
| **Pre-Condicoes** | - Usuario autenticado com token valido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar DELETE /api/categorias/99999 com token valido | Status 404 com codigo CATEGORIA_NAO_ENCONTRADA |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

#### CT-EP004-US019-04 — Excluir categoria personalizada de outro usuario

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US019-04 |
| **Titulo** | Validar que excluir categoria personalizada de outro usuario retorna 404 |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-019, RK-044 |
| **Pre-Condicoes** | - Dois usuarios cadastrados\n- user2 possui categoria personalizada |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Autenticar como user1 | Token valido de user1 |
| 2 | Enviar DELETE /api/categorias/:id da categoria de user2 | Status 404 |

| **Pos-Condicoes** | - Categoria de user2 permanece inalterada no banco |

---

#### CT-EP004-US019-05 — Excluir categoria sem token

| Campo | Valor |
|---|---|
| **ID** | CT-EP004-US019-05 |
| **Titulo** | Validar que excluir categoria sem token retorna 401 TOKEN_AUSENTE |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-019, RG-009 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar DELETE /api/categorias/:id sem header Authorization | Status 401 com codigo TOKEN_AUSENTE |

| **Pos-Condicoes** | - Nenhuma alteracao no banco de dados |

---

## 5. Resumo

| User Story | Quantidade de CTs |
|---|---|
| US-015 — GET /api/categorias | 7 |
| US-016 — POST /api/categorias | 8 |
| US-017 — GET /api/categorias/:id | 5 |
| US-018 — PUT /api/categorias/:id | 8 |
| US-019 — DELETE /api/categorias/:id | 5 |
| **Total** | **33** |
