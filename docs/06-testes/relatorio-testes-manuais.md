# Relatorio de Execucao de Testes Manuais

> Registro da execucao dos testes manuais via colecao Postman, cobrindo os endpoints da Fase 1 do Provus Finance.

---

## 1. Informacoes da Execucao

| Campo | Valor |
|---|---|
| **Data** | 01/05/2026 |
| **Testador** | Henrique Patti |
| **Ambiente** | localhost:3000 |
| **Node.js** | v24.13.1 |
| **Banco** | SQLite (provus.db) — limpo via db:reset |
| **Colecao** | postman/Provus-Finance.postman_collection.json |
| **Total de requests** | 109 |

---

## 2. Pre-condicoes

- API iniciada com `npm start`
- Banco recriado com `npm run db:reset` (4 migrations aplicadas)
- 13 categorias padrao populadas via migration 003
- Variaveis Postman configuradas: `baseUrl = http://localhost:3000`

---

## 3. Resultados por Epico

### EP-001 — Gestao de Usuarios

#### US-001 — Cadastrar usuario (POST /api/usuarios) — 14 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Cadastro com dados validos | 201 | 201 | PASSOU |
| 02 | Email ja cadastrado | 409 | 409 | PASSOU |
| 03 | Sem nome | 400 | 400 | PASSOU |
| 04 | Sem email | 400 | 400 | PASSOU |
| 05 | Sem senha | 400 | 400 | PASSOU |
| 06 | Email formato invalido | 400 | 400 | PASSOU |
| 07 | Email acima do limite | 400 | 400 | PASSOU |
| 08 | Senha abaixo do minimo | 400 | 400 | PASSOU |
| 09 | Senha sem maiuscula | 400 | 400 | PASSOU |
| 10 | Senha sem minuscula | 400 | 400 | PASSOU |
| 11 | Senha sem numero | 400 | 400 | PASSOU |
| 12 | Email normalizado lowercase | 201 | 201 | PASSOU |
| 13 | Espacos normalizados nome | 201 | 201 | PASSOU |
| 14 | Nome apenas numeros | 400 | 400 | PASSOU |

**Resultado: 14/14 PASSOU**

#### US-002 — Consultar perfil (GET /api/usuarios/me) — 5 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Token valido | 200 | 200 | PASSOU |
| 02 | Sem token | 401 | 401 | PASSOU |
| 03 | Token invalido | 401 | 401 | PASSOU |
| 04 | Token expirado | 401 | 401 | PASSOU |
| 05 | Sem dados sensiveis | 200 (sem senha) | 200 (sem senha) | PASSOU |

**Resultado: 5/5 PASSOU**

#### US-003 — Atualizar perfil (PUT /api/usuarios/me) — 6 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Atualizar nome e email | 200 | 200 | PASSOU |
| 02 | Atualizar so nome | 200 | 200 | PASSOU |
| 03 | Email de outro usuario | 409 | 409 | PASSOU |
| 04 | Manter proprio email | 200 | 200 | PASSOU |
| 05 | Nome so numeros | 400 | 400 | PASSOU |
| 06 | Sem token | 401 | 401 | PASSOU |

**Resultado: 6/6 PASSOU**

#### US-004 — Alterar senha (PUT /api/usuarios/me/senha) — 7 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Senhas validas | 200 | 200 | PASSOU |
| 02 | Senha atual incorreta | 401 | 401 | PASSOU |
| 03 | Nova igual a atual | 400 | 400 | PASSOU |
| 04 | Nova sem complexidade | 400 | 400 | PASSOU |
| 05 | Campo obrigatorio ausente | 400 | 400 | PASSOU |
| 06 | Token valido apos alteracao | 200 | 200 | PASSOU |
| 07 | Resposta sem senha/hash | 200 (sem senha) | 200 (sem senha) | PASSOU |

**Resultado: 7/7 PASSOU**

#### US-005 — Excluir conta (DELETE /api/usuarios/me) — 7 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Exclusao com senha correta | 204 | 204 | PASSOU |
| 02 | Senha incorreta | 401 | 401 | PASSOU |
| 03 | Sem senha | 400 | 400 | PASSOU |
| 04 | Token invalido apos exclusao | 404 | 404 | PASSOU |
| 05 | Email disponivel para recadastro | 201 | 201 | PASSOU |
| 06 | Usuario removido do banco | 404 | 404 | PASSOU |
| 07 | Sem token | 401 | 401 | PASSOU |

**Resultado: 7/7 PASSOU**

---

### EP-002 — Autenticacao

#### US-006 — Login (POST /api/auth/login) — 9 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Credenciais validas | 200 + token | 200 + token | PASSOU |
| 02 | Email inexistente | 401 | 401 | PASSOU |
| 03 | Senha incorreta (mesma resposta) | 401 | 401 | PASSOU |
| 04 | Sem email | 400 | 400 | PASSOU |
| 05 | Sem senha | 400 | 400 | PASSOU |
| 06 | Body nao JSON | 400 | 400 | PASSOU |
| 07 | Payload JWT (sub, email, iat, exp) | 200 | 200 | PASSOU |
| 08 | Email uppercase normalizado | 200 | 200 | PASSOU |
| 09 | Multiplas sessoes | 200 (tokens distintos) | 200 (tokens distintos) | PASSOU |

**Resultado: 9/9 PASSOU**

---

### EP-003 — Gestao de Contas

#### US-009 — Criar conta (POST /api/contas) — 6 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Conta corrente valida | 201 | 201 | PASSOU |
| 02 | Sem saldoInicial (padrao 0) | 201 | 201 | PASSOU |
| 03 | Sem nome | 400 | 400 | PASSOU |
| 04 | Tipo invalido | 400 | 400 | PASSOU |
| 05 | Saldo negativo | 400 | 400 | PASSOU |
| 06 | Sem token | 401 | 401 | PASSOU |

**Resultado: 6/6 PASSOU**

#### US-010 — Listar contas (GET /api/contas) — 4 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Listar ativas | 200 | 200 | PASSOU |
| 02 | Filtrar por tipo | 200 | 200 | PASSOU |
| 03 | Listar inativas | 200 | 200 | PASSOU |
| 04 | Sem token | 401 | 401 | PASSOU |

**Resultado: 4/4 PASSOU**

#### US-011 — Consultar conta (GET /api/contas/:id) — 3 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Conta existente com saldo | 200 | 200 | PASSOU |
| 02 | ID inexistente | 404 | 404 | PASSOU |
| 03 | Sem token | 401 | 401 | PASSOU |

**Resultado: 3/3 PASSOU**

#### US-012 — Atualizar conta (PUT /api/contas/:id) — 4 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Atualizar nome | 200 | 200 | PASSOU |
| 02 | tipo e saldoInicial ignorados | 200 (preservados) | 200 (preservados) | PASSOU |
| 03 | Nome vazio | 400 | 400 | PASSOU |
| 04 | ID inexistente | 404 | 404 | PASSOU |

**Resultado: 4/4 PASSOU**

#### US-013 — Desativar conta (DELETE /api/contas/:id) — 3 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Desativar conta | 204 | 204 | PASSOU |
| 02 | ID inexistente | 404 | 404 | PASSOU |
| 03 | Sem token | 401 | 401 | PASSOU |

**Resultado: 3/3 PASSOU**

#### US-014 — Consultar saldo (GET /api/contas/:id/saldo) — 2 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Saldo sem transacoes = saldoInicial | 200 (5000) | 200 (5000) | PASSOU |
| 02 | ID inexistente | 404 | 404 | PASSOU |

**Resultado: 2/2 PASSOU**

---

### EP-004 — Gestao de Categorias

#### US-015 — Listar categorias (GET /api/categorias) — 4 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Listar padrao + personalizadas | 200 (>= 13) | 200 (13) | PASSOU |
| 02 | Filtrar tipo=despesa | 200 | 200 | PASSOU |
| 03 | Filtrar origem=padrao | 200 | 200 | PASSOU |
| 04 | Sem token | 401 | 401 | PASSOU |

**Resultado: 4/4 PASSOU**

#### US-016 — Criar categoria (POST /api/categorias) — 4 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Categoria valida (padrao=false) | 201 | 201 | PASSOU |
| 02 | Sem icone (null) | 201 | 201 | PASSOU |
| 03 | Sem nome | 400 | 400 | PASSOU |
| 04 | Tipo invalido | 400 | 400 | PASSOU |

**Resultado: 4/4 PASSOU**

#### US-017 — Consultar categoria (GET /api/categorias/:id) — 3 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Categoria padrao | 200 (padrao=true) | 200 (padrao=true) | PASSOU |
| 02 | Personalizada propria | 200 | 200 | PASSOU |
| 03 | ID inexistente | 404 | 404 | PASSOU |

**Resultado: 3/3 PASSOU**

#### US-018 — Atualizar categoria (PUT /api/categorias/:id) — 4 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Atualizar nome e icone | 200 | 200 | PASSOU |
| 02 | Editar categoria padrao | 403 | 403 | PASSOU |
| 03 | Body vazio | 400 | 400 | PASSOU |
| 04 | Remover icone (null) | 200 (icone=null) | 200 (icone=null) | PASSOU |

**Resultado: 4/4 PASSOU**

#### US-019 — Excluir categoria (DELETE /api/categorias/:id) — 3 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Excluir personalizada | 204 | 204 | PASSOU |
| 02 | Excluir padrao | 403 | 403 | PASSOU |
| 03 | ID inexistente | 404 | 404 | PASSOU |

**Resultado: 3/3 PASSOU**

---

### EP-005 — Gestao de Transacoes

#### US-020 — Registrar transacao (POST /api/transacoes) — 6 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Criar despesa valida | 201 | 201 | PASSOU |
| 02 | Criar receita valida | 201 | 201 | PASSOU |
| 03 | Valor zero | 400 | 400 | PASSOU |
| 04 | Tipo invalido | 400 | 400 | PASSOU |
| 05 | Conta inexistente | 404 | 404 | PASSOU |
| 06 | Categoria incompativel | 422 | 422 | PASSOU |

**Resultado: 6/6 PASSOU**

#### US-021 — Listar transacoes (GET /api/transacoes) — 4 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Listar todas | 200 | 200 | PASSOU |
| 02 | Filtrar tipo=despesa | 200 | 200 | PASSOU |
| 03 | Filtrar por periodo | 200 | 200 | PASSOU |
| 04 | Sem token | 401 | 401 | PASSOU |

**Resultado: 4/4 PASSOU**

#### US-022 — Consultar transacao (GET /api/transacoes/:id) — 2 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Transacao existente | 200 | 200 | PASSOU |
| 02 | ID inexistente | 404 | 404 | PASSOU |

**Resultado: 2/2 PASSOU**

#### US-023 — Atualizar transacao (PUT /api/transacoes/:id) — 4 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Atualizar valor e descricao | 200 | 200 | PASSOU |
| 02 | Alterar categoriaId | 200 | 200 | PASSOU |
| 03 | Body vazio | 400 | 400 | PASSOU |
| 04 | Categoria incompativel | 422 | 422 | PASSOU |

**Resultado: 4/4 PASSOU**

#### US-024 — Excluir transacao (DELETE /api/transacoes/:id) — 2 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Excluir transacao | 204 | 204 | PASSOU |
| 02 | ID inexistente | 404 | 404 | PASSOU |

**Resultado: 2/2 PASSOU**

#### US-025 — Buscar por descricao (GET /api/transacoes?q=) — 3 requests

| # | Cenario | Esperado | Obtido | Status |
|---|---|---|---|---|
| 01 | Buscar "supermercado" | 200 | 200 | PASSOU |
| 02 | Buscar com filtro combinado | 200 | 200 | PASSOU |
| 03 | Buscar sem resultados | 200 ([]) | 200 ([]) | PASSOU |

**Resultado: 3/3 PASSOU**

---

## 4. Verificacoes Adicionais

### Calculo de saldo

| Cenario | Esperado | Obtido | Status |
|---|---|---|---|
| Conta com saldoInicial=5000, sem transacoes | 5000 | 5000 | PASSOU |
| Apos despesa R$200 | 4800 | 4800 | PASSOU |
| Apos receita R$500 | 5300 | 5300 | PASSOU |

### Categorias padrao (seed)

| Verificacao | Esperado | Obtido | Status |
|---|---|---|---|
| Total de categorias padrao | 13 | 13 | PASSOU |
| Categorias de despesa | 9 | 9 | PASSOU |
| Categorias de receita | 4 | 4 | PASSOU |

---

## 5. Resumo

| Metrica | Valor |
|---|---|
| **Total de requests executados** | 109 |
| **Passou** | 109 |
| **Falhou** | 0 |
| **Taxa de sucesso** | 100% |
| **Epicos cobertos** | 5/5 |
| **User Stories cobertas** | 22/25 (US-007, US-008 cobertas indiretamente via middleware) |
| **Bugs encontrados na execucao** | 0 (bugs conhecidos #89 e #90 nao cobertos nesta execucao) |

---

## 6. Observacoes

- US-007 e US-008 (middleware JWT) nao possuem requests dedicados — sao cobertas indiretamente por todos os requests autenticados que testam cenarios de token ausente/invalido/expirado.
- Os bugs conhecidos (#89 XSS e #90 conta inativa) foram identificados em sessoes exploratorias separadas (`docs/06-testes/sessoes-exploratorias/`) e nao fazem parte desta execucao da colecao padrao.
- A execucao segue ordem de dependencia: cadastro → login → operacoes autenticadas.
