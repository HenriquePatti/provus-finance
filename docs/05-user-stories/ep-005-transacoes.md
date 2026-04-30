# 📄 User Stories — EP-005: Gestão de Transações

> Documento com as User Stories do **Épico 5 — Gestão de Transações**, que cobre registro, listagem, consulta, atualização, exclusão e busca de transações financeiras (receitas e despesas).

---

## 📋 Sumário

- [Sobre Este Documento](#-sobre-este-documento)
- [Resumo do Épico](#-resumo-do-épico)
- [US-020 — Registrar transação](#us-020--registrar-transação)
- [US-021 — Listar transações com filtros](#us-021--listar-transações-com-filtros)
- [US-022 — Consultar transação específica](#us-022--consultar-transação-específica)
- [US-023 — Atualizar transação](#us-023--atualizar-transação)
- [US-024 — Excluir transação](#us-024--excluir-transação)
- [US-025 — Buscar transações por descrição](#us-025--buscar-transações-por-descrição)
- [Resumo de Cobertura](#-resumo-de-cobertura)

---

## 📖 Sobre Este Documento

Este documento lista as **User Stories** do EP-005. Cada US é uma unidade de valor independente, rastreável até regras de negócio e pronta para ser transformada em issue no GitHub.

### Estrutura de cada US

- **Narrativa** — padrão "Como… Quero… Para que…"
- **Contexto** — explicação da relevância e persona envolvida
- **Especificação** — endpoint e autenticação
- **Critérios de Aceitação** — em Gherkin (Dado/Quando/Então)
- **Regras de Negócio Cobertas** — lista rastreável
- **Labels** — tags para a issue no GitHub
- **Definition of Done** — checklist de conclusão

### Sistema de IDs

- `US-XXX` — User Story (identificador único sequencial)
- `CA-XX` — Critério de Aceitação (interno a cada US)

---

## 📦 Resumo do Épico

| Informação | Valor |
|---|---|
| **Épico** | EP-005 — Gestão de Transações |
| **Prioridade** | 🔴 Crítica |
| **Sprint** | 3 |
| **User Stories** | 6 |
| **Endpoints envolvidos** | 6 |
| **Regras de negócio cobertas** | RT-001 a RT-075 |

### Lista de User Stories

| ID | Título | Endpoint |
|---|---|---|
| US-020 | Registrar transação | `POST /api/transacoes` |
| US-021 | Listar transações com filtros | `GET /api/transacoes` |
| US-022 | Consultar transação específica | `GET /api/transacoes/:id` |
| US-023 | Atualizar transação | `PUT /api/transacoes/:id` |
| US-024 | Excluir transação | `DELETE /api/transacoes/:id` |
| US-025 | Buscar transações por descrição | `GET /api/transacoes?q=` |

---

## US-020 — Registrar transação

![Épico](https://img.shields.io/badge/épico-EP--005-orange)
![Prioridade](https://img.shields.io/badge/prioridade-crítica-red)
![Fase](https://img.shields.io/badge/fase-3-purple)

### 📖 Narrativa

> **Como** usuária autenticada no Provus Finance,
> **Quero** registrar uma transação informando tipo (receita/despesa), valor, descrição, data, conta e categoria,
> **Para que** eu possa controlar minhas movimentações financeiras e manter meu saldo atualizado.

### 🎯 Contexto

O registro de transações é a **funcionalidade central** do Provus Finance. Cada transação é obrigatoriamente vinculada a uma conta (onde o dinheiro entra ou sai) e a uma categoria (classificação). O valor é armazenado internamente em centavos para evitar erros de arredondamento. O tipo e a conta são **imutáveis** após a criação.

**Persona principal:** Ana (iniciante, precisa registrar receitas e despesas do dia a dia)

### 🔌 Especificação

- **Endpoint:** `POST /api/transacoes`
- **Autenticação:** ✅ Token JWT obrigatório
- **Corpo da requisição:** `tipo` (receita, despesa), `valor` (em centavos, > 0), `descricao` (1-100 chars), `dataTransacao` (ISO 8601), `contaId`, `categoriaId`

### ✅ Critérios de Aceitação

#### CA-01 — Criação bem-sucedida com dados válidos

```gherkin
Dado que estou autenticado
  E informo tipo, valor, descricao, dataTransacao, contaId e categoriaId válidos
Quando envio POST /api/transacoes
Então a resposta deve ter status 201
  E o corpo deve conter id, tipo, valor, descricao, dataTransacao, contaId, categoriaId, criadoEm e atualizadoEm
  E a transação deve pertencer ao usuário autenticado via conta
```

#### CA-02 — Conta deve existir e pertencer ao usuário

```gherkin
Dado que estou autenticado
  E informo um contaId de conta inexistente ou de outro usuário
Quando envio POST /api/transacoes
Então a resposta deve ter status 404
  E o código do erro deve ser "CONTA_NAO_ENCONTRADA"
```

#### CA-03 — Conta deve estar ativa

```gherkin
Dado que estou autenticado
  E informo um contaId de conta com ativa = false
Quando envio POST /api/transacoes
Então a resposta deve ter status 422
  E o código do erro deve ser "CONTA_INATIVA"
```

#### CA-04 — Categoria deve ser compatível com o tipo da transação

```gherkin
Dado que estou autenticado
  E informo tipo = "receita" e uma categoriaId exclusivamente de despesa
Quando envio POST /api/transacoes
Então a resposta deve ter status 422
  E o código do erro deve ser "CATEGORIA_INCOMPATIVEL"
```

#### CA-05 — Campo obrigatório ausente

```gherkin
Dado que estou autenticado
  E omito um ou mais campos obrigatórios
Quando envio POST /api/transacoes
Então a resposta deve ter status 400
  E o código do erro deve ser "CAMPO_OBRIGATORIO"
```

#### CA-06 — Tipo inválido retorna 400

```gherkin
Dado que estou autenticado
  E informo tipo diferente de "receita" ou "despesa"
Quando envio POST /api/transacoes
Então a resposta deve ter status 400
  E o código do erro deve ser "FORMATO_INVALIDO"
```

#### CA-07 — Valor zero ou negativo retorna 422

```gherkin
Dado que estou autenticado
  E informo valor <= 0
Quando envio POST /api/transacoes
Então a resposta deve ter status 422
  E o código do erro deve ser "VALOR_INVALIDO"
```

#### CA-08 — Data em formato inválido retorna 400

```gherkin
Dado que estou autenticado
  E informo dataTransacao em formato diferente de ISO 8601
Quando envio POST /api/transacoes
Então a resposta deve ter status 400
  E o código do erro deve ser "FORMATO_INVALIDO"
```

#### CA-09 — Descrição vazia ou somente espaços retorna 400

```gherkin
Dado que estou autenticado
  E informo descricao vazia ou composta apenas por espaços
Quando envio POST /api/transacoes
Então a resposta deve ter status 400
  E o código do erro deve ser "CAMPO_OBRIGATORIO"
```

#### CA-10 — Sem autenticação

```gherkin
Dado que envio a requisição sem token
Quando envio POST /api/transacoes
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RT-001 | Tipos fundamentais: receita e despesa |
| RT-002 | Valor sempre positivo |
| RT-004 | Campos obrigatórios na criação |
| RT-005 | Criação exige autenticação |
| RT-006 | Vínculo automático via conta |
| RT-007 | Criação bem-sucedida retorna 201 |
| RT-008 | Múltiplos erros de validação retornados juntos |
| RT-009 | Valores permitidos no campo tipo |
| RT-010 | Tipo inválido retorna 400 |
| RT-011 | Tipo é case-sensitive |
| RT-012 | Tipo é imutável após criação |
| RT-013 | Valor mínimo de R$ 0,01 |
| RT-016 | Valor convertido para centavos internamente |
| RT-018 | Comprimento da descrição (1-100 chars) |
| RT-019 | Descrição vazia é rejeitada |
| RT-022 | Data em formato ISO 8601 |
| RT-025 | Datas impossíveis retornam 400 |
| RT-027 | Conta deve pertencer ao usuário autenticado |
| RT-028 | Conta deve existir |
| RT-029 | Conta deve estar ativa |
| RT-030 | Conta não pode ser alterada após criação |
| RT-031 | Categoria deve existir |
| RT-032 | Categoria deve ser acessível ao usuário |
| RT-033 | Categoria deve ser compatível com o tipo da transação |
| RG-008 | Rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |
| RG-014 | Campos obrigatórios validados primeiro |

### 🏷️ Labels para a Issue

- `epic:transacoes`
- `tipo:api`
- `tipo:testes`
- `fase-3`
- `prioridade:critica`

### ✔️ Definition of Done

- [x] Endpoint `POST /api/transacoes` implementado
- [x] Validações de tipo, valor, descrição, data, conta e categoria funcionando
- [x] Valor armazenado em centavos internamente
- [x] Conta validada (existência, pertencimento, ativa)
- [x] Categoria validada (existência, acessibilidade, compatibilidade com tipo)
- [x] Todos os critérios de aceitação passando
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- O tipo e o contaId são **imutáveis** após a criação — se o usuário errou, deve excluir e recriar
- O valor é informado em reais na API mas armazenado em centavos no banco para evitar erros de ponto flutuante
- Categorias do tipo `ambos` são compatíveis tanto com receita quanto com despesa

---

## US-021 — Listar transações com filtros

![Épico](https://img.shields.io/badge/épico-EP--005-orange)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)
![Fase](https://img.shields.io/badge/fase-3-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** listar minhas transações com filtros por tipo, conta, categoria, intervalo de datas e ordenação,
> **Para que** eu possa analisar meus gastos e receitas de forma organizada e granular.

### 🎯 Contexto

A listagem de transações permite ao usuário **visualizar e filtrar** suas movimentações financeiras. O endpoint suporta múltiplos filtros combináveis (AND lógico) e ordenação customizável. Por padrão, as transações são ordenadas por data descendente (mais recentes primeiro).

**Persona principal:** Rafael (usuário experiente que quer análise detalhada de suas finanças)

### 🔌 Especificação

- **Endpoint:** `GET /api/transacoes`
- **Autenticação:** ✅ Token JWT obrigatório
- **Query params:** `tipo` (receita, despesa), `contaId`, `categoriaId`, `de` (dataInicio), `ate` (dataFim), `ordenarPor` (dataTransacao, valor, criadoEm), `ordem` (asc, desc)

### ✅ Critérios de Aceitação

#### CA-01 — Listagem retorna apenas transações do usuário autenticado

```gherkin
Dado que estou autenticado
  E existem transações de múltiplos usuários no sistema
Quando consulto GET /api/transacoes sem filtros
Então a resposta deve ter status 200
  E o corpo deve conter apenas transações vinculadas às minhas contas
  E não deve conter transações de outros usuários
```

#### CA-02 — Ordem padrão por data descendente

```gherkin
Dado que estou autenticado
Quando consulto GET /api/transacoes sem parâmetros de ordenação
Então a resposta deve ter status 200
  E as transações devem estar ordenadas por dataTransacao descendente
```

#### CA-03 — Filtro por tipo funciona corretamente

```gherkin
Dado que estou autenticado
Quando consulto GET /api/transacoes?tipo=despesa
Então a resposta deve ter status 200
  E todas as transações retornadas devem ter tipo "despesa"
```

#### CA-04 — Filtro por intervalo de datas

```gherkin
Dado que estou autenticado
Quando consulto GET /api/transacoes?de=2026-04-01&ate=2026-04-30
Então a resposta deve ter status 200
  E todas as transações retornadas devem estar dentro do intervalo informado
```

#### CA-05 — Combinação de múltiplos filtros

```gherkin
Dado que estou autenticado
Quando consulto GET /api/transacoes?tipo=despesa&contaId=1&categoriaId=3
Então a resposta deve ter status 200
  E todas as transações retornadas devem atender a todos os filtros simultaneamente
```

#### CA-06 — Sem autenticação

```gherkin
Dado que envio a requisição sem token
Quando consulto GET /api/transacoes
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RT-036 | Listagem retorna apenas transações do usuário autenticado |
| RT-037 | Ordem padrão: dataTransacao descendente |
| RT-038 | Paginação obrigatória |
| RT-039 | Valores em reais na resposta |
| RT-040 | Resposta inclui dados de conta e categoria |
| RT-041 | Filtro por tipo |
| RT-042 | Filtro por conta |
| RT-043 | Filtro por categoria |
| RT-044 | Filtro por intervalo de datas |
| RT-046 | Combinação de filtros |
| RT-047 | Filtros inválidos são ignorados |
| RT-048 | Ordenação customizável |
| RG-008 | Rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |

### 🏷️ Labels para a Issue

- `epic:transacoes`
- `tipo:api`
- `tipo:testes`
- `fase-3`
- `prioridade:alta`

### ✔️ Definition of Done

- [x] Endpoint `GET /api/transacoes` implementado
- [x] Filtros por tipo, conta, categoria e intervalo de datas funcionando
- [x] Ordenação customizável (asc/desc) funcionando
- [x] Ordem padrão por dataTransacao descendente
- [x] Paginação implementada
- [x] Todos os critérios de aceitação passando
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- Filtros inválidos são **ignorados silenciosamente** (não causam erro)
- Múltiplos filtros são combinados com **AND lógico**
- A paginação segue o padrão do sistema: 20 por página, máximo 100

---

## US-022 — Consultar transação específica

![Épico](https://img.shields.io/badge/épico-EP--005-orange)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)
![Fase](https://img.shields.io/badge/fase-3-purple)

### 📖 Narrativa

> **Como** usuária autenticada no Provus Finance,
> **Quero** consultar os detalhes de uma transação específica por ID,
> **Para que** eu possa verificar todas as informações de uma movimentação antes de editá-la ou excluí-la.

### 🎯 Contexto

A consulta individual retorna os dados completos de uma transação, incluindo objetos resumidos da conta e categoria vinculadas. O endpoint protege a privacidade retornando 404 tanto para transações inexistentes quanto para transações de outros usuários.

**Persona principal:** Sofia (quer transparência e detalhamento das movimentações)

### 🔌 Especificação

- **Endpoint:** `GET /api/transacoes/:id`
- **Autenticação:** ✅ Token JWT obrigatório
- **Path param:** `id` — ID da transação

### ✅ Critérios de Aceitação

#### CA-01 — Consulta bem-sucedida

```gherkin
Dado que estou autenticado
  E informo o ID de uma transação vinculada a uma das minhas contas
Quando consulto GET /api/transacoes/:id
Então a resposta deve ter status 200
  E o corpo deve conter id, tipo, valor, descricao, dataTransacao, conta, categoria, criadoEm e atualizadoEm
```

#### CA-02 — Transação de outro usuário retorna 404

```gherkin
Dado que estou autenticado
  E informo o ID de uma transação vinculada a conta de outro usuário
Quando consulto GET /api/transacoes/:id
Então a resposta deve ter status 404
  E o código do erro deve ser "RECURSO_NAO_ENCONTRADO"
  E nenhuma informação da transação alheia deve ser exposta
```

#### CA-03 — Transação inexistente retorna 404

```gherkin
Dado que informo um ID que não existe no sistema
Quando consulto GET /api/transacoes/:id
Então a resposta deve ter status 404
  E o código do erro deve ser "RECURSO_NAO_ENCONTRADO"
```

#### CA-04 — Sem autenticação

```gherkin
Dado que envio a requisição sem token
Quando consulto GET /api/transacoes/:id
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RT-049 | Consulta por ID |
| RT-050 | Usuário só consulta suas próprias transações |
| RT-051 | Transação inexistente retorna 404 |
| RT-052 | Resposta inclui dados relacionados |
| RT-074 | Isolamento entre usuários via conta |
| RG-008 | Rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |
| RG-012 | Usuário só acessa seus próprios recursos |

### 🏷️ Labels para a Issue

- `epic:transacoes`
- `tipo:api`
- `tipo:testes`
- `fase-3`
- `prioridade:alta`

### ✔️ Definition of Done

- [x] Endpoint `GET /api/transacoes/:id` implementado
- [x] Resposta inclui dados resumidos de conta e categoria
- [x] 404 para transação inexistente ou de outro usuário
- [x] Todos os critérios de aceitação passando
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- Transações de outros usuários retornam 404 (não 403) para **não revelar a existência** do recurso
- A resposta inclui objetos resumidos de conta e categoria, não apenas os IDs

---

## US-023 — Atualizar transação

![Épico](https://img.shields.io/badge/épico-EP--005-orange)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)
![Fase](https://img.shields.io/badge/fase-3-purple)

### 📖 Narrativa

> **Como** usuária autenticada no Provus Finance,
> **Quero** atualizar valor, descrição, data ou categoria de uma transação existente,
> **Para que** eu possa corrigir informações sem precisar excluir e recriar a movimentação.

### 🎯 Contexto

A atualização permite corrigir ou ajustar transações já registradas. Os campos `tipo` e `contaId` são **imutáveis** para preservar a integridade do saldo. A atualização do valor recalcula automaticamente o saldo da conta. A atualização é bloqueada se a conta estiver inativa.

**Persona principal:** Ana (precisa corrigir valores ou reclassificar transações)

### 🔌 Especificação

- **Endpoint:** `PUT /api/transacoes/:id`
- **Autenticação:** ✅ Token JWT obrigatório
- **Path param:** `id` — ID da transação
- **Corpo da requisição:** `valor`, `descricao`, `dataTransacao`, `categoriaId` (atualização parcial)

### ✅ Critérios de Aceitação

#### CA-01 — Atualização bem-sucedida de valor e descrição

```gherkin
Dado que estou autenticado
  E informo o ID de uma transação vinculada a uma das minhas contas ativas
  E informo novo valor e nova descrição
Quando envio PUT /api/transacoes/:id
Então a resposta deve ter status 200
  E o corpo deve conter os dados atualizados
  E o campo atualizadoEm deve estar com timestamp recente
```

#### CA-02 — Atualização parcial apenas da categoria

```gherkin
Dado que estou autenticado
  E informo apenas o novo categoriaId
Quando envio a atualização
Então a resposta deve ter status 200
  E apenas a categoria deve ser alterada
  E os demais campos devem permanecer inalterados
```

#### CA-03 — Tipo é imutável

```gherkin
Dado que estou autenticado
  E tento alterar o campo tipo de uma transação
Quando envio a atualização
Então a resposta deve ter status 400
  E o código do erro deve ser "CAMPO_IMUTAVEL"
```

#### CA-04 — ContaId é imutável

```gherkin
Dado que estou autenticado
  E tento alterar o campo contaId de uma transação
Quando envio a atualização
Então a resposta deve ter status 400
  E o código do erro deve ser "CAMPO_IMUTAVEL"
```

#### CA-05 — Nova categoria deve ser compatível com o tipo

```gherkin
Dado que estou autenticado
  E a transação é do tipo "receita"
  E informo uma categoriaId exclusivamente de despesa
Quando envio a atualização
Então a resposta deve ter status 422
  E o código do erro deve ser "CATEGORIA_INCOMPATIVEL"
```

#### CA-06 — Atualização em conta inativa é bloqueada

```gherkin
Dado que estou autenticado
  E a transação pertence a uma conta com ativa = false
Quando envio a atualização
Então a resposta deve ter status 422
  E o código do erro deve ser "CONTA_INATIVA"
```

#### CA-07 — Transação de outro usuário retorna 404

```gherkin
Dado que estou autenticado
  E informo o ID de uma transação de outro usuário
Quando envio a atualização
Então a resposta deve ter status 404
  E o código do erro deve ser "RECURSO_NAO_ENCONTRADO"
```

#### CA-08 — Sem autenticação

```gherkin
Dado que envio a requisição sem token
Quando envio PUT /api/transacoes/:id
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RT-012 | Tipo é imutável após criação |
| RT-030 | Conta não pode ser alterada após criação |
| RT-034 | Categoria pode ser alterada na edição |
| RT-035 | Nova categoria na edição deve seguir todas as validações |
| RT-053 | Campos atualizáveis: valor, descricao, dataTransacao, categoriaId |
| RT-054 | Campos não atualizáveis: tipo, contaId |
| RT-055 | Atualização parcial permitida |
| RT-056 | Validações de criação aplicam-se na atualização |
| RT-057 | Atualização em transação de conta inativa é bloqueada |
| RT-058 | Atualização bem-sucedida retorna 200 |
| RT-059 | Saldo é recalculado implicitamente |
| RG-008 | Rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |
| RG-012 | Usuário só acessa seus próprios recursos |

### 🏷️ Labels para a Issue

- `epic:transacoes`
- `tipo:api`
- `tipo:testes`
- `fase-3`
- `prioridade:alta`

### ✔️ Definition of Done

- [x] Endpoint `PUT /api/transacoes/:id` implementado
- [x] Atualização parcial de valor, descrição, data e categoria funcionando
- [x] Tipo e contaId imutáveis com retorno 400 CAMPO_IMUTAVEL
- [x] Validação de categoria compatível na atualização
- [x] Bloqueio de atualização em conta inativa
- [x] Saldo recalculado automaticamente após atualização de valor
- [x] Todos os critérios de aceitação passando
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- O **tipo e o contaId não podem ser alterados** — se o usuário errou, deve excluir e recriar
- O saldo da conta é calculado em tempo real, então qualquer atualização de valor reflete imediatamente
- Contas inativas bloqueiam atualização para preservar integridade do histórico

---

## US-024 — Excluir transação

![Épico](https://img.shields.io/badge/épico-EP--005-orange)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)
![Fase](https://img.shields.io/badge/fase-3-purple)

### 📖 Narrativa

> **Como** usuária autenticada no Provus Finance,
> **Quero** excluir uma transação registrada incorretamente ou duplicada,
> **Para que** meu saldo e histórico reflitam apenas movimentações reais.

### 🎯 Contexto

A exclusão de transações é **hard delete** (permanente) — o registro é removido definitivamente do banco. O saldo da conta é recalculado automaticamente após a exclusão. Diferente da atualização, a exclusão é permitida mesmo em contas inativas, permitindo ao usuário limpar o histórico.

**Persona principal:** Ana (precisa remover transações erradas ou duplicadas)

### 🔌 Especificação

- **Endpoint:** `DELETE /api/transacoes/:id`
- **Autenticação:** ✅ Token JWT obrigatório
- **Path param:** `id` — ID da transação

### ✅ Critérios de Aceitação

#### CA-01 — Exclusão bem-sucedida

```gherkin
Dado que estou autenticado
  E informo o ID de uma transação vinculada a uma das minhas contas
Quando envio DELETE /api/transacoes/:id
Então a resposta deve ter status 204
  E a resposta não deve conter corpo
  E a transação deve ser removida permanentemente do banco
```

#### CA-02 — Saldo da conta é recalculado após exclusão

```gherkin
Dado que estou autenticado
  E a conta tem saldo calculado considerando a transação
Quando excluo a transação
Então o saldo da conta deve ser recalculado sem a transação excluída
```

#### CA-03 — Exclusão em conta inativa é permitida

```gherkin
Dado que estou autenticado
  E a transação pertence a uma conta com ativa = false
Quando envio DELETE /api/transacoes/:id
Então a resposta deve ter status 204
  E a transação deve ser removida normalmente
```

#### CA-04 — Transação de outro usuário retorna 404

```gherkin
Dado que estou autenticado
  E informo o ID de uma transação de outro usuário
Quando envio DELETE /api/transacoes/:id
Então a resposta deve ter status 404
  E o código do erro deve ser "RECURSO_NAO_ENCONTRADO"
```

#### CA-05 — Transação inexistente retorna 404

```gherkin
Dado que informo um ID que não existe no sistema
Quando envio DELETE /api/transacoes/:id
Então a resposta deve ter status 404
  E o código do erro deve ser "RECURSO_NAO_ENCONTRADO"
```

#### CA-06 — Sem autenticação

```gherkin
Dado que envio a requisição sem token
Quando envio DELETE /api/transacoes/:id
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RT-060 | Exclusão é hard delete |
| RT-061 | Exclusão exige autenticação |
| RT-062 | Usuário só exclui suas próprias transações |
| RT-063 | Exclusão de transação em conta inativa é permitida |
| RT-064 | Exclusão bem-sucedida retorna 204 |
| RT-065 | Exclusão ajusta o saldo automaticamente |
| RT-068 | Exclusão de transação recalcula saldo automaticamente |
| RG-008 | Rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |
| RG-012 | Usuário só acessa seus próprios recursos |

### 🏷️ Labels para a Issue

- `epic:transacoes`
- `tipo:api`
- `tipo:testes`
- `fase-3`
- `prioridade:alta`

### ✔️ Definition of Done

- [x] Endpoint `DELETE /api/transacoes/:id` implementado
- [x] Hard delete permanente da transação
- [x] Saldo da conta recalculado automaticamente após exclusão
- [x] Exclusão permitida mesmo em contas inativas
- [x] 404 para transação inexistente ou de outro usuário
- [x] Todos os critérios de aceitação passando
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- A exclusão é **permanente** — não há soft delete para transações
- Diferente da atualização, a exclusão **é permitida em contas inativas** (para limpeza de histórico)
- O saldo é recalculado em tempo real, então a exclusão reflete imediatamente

---

## US-025 — Buscar transações por descrição

![Épico](https://img.shields.io/badge/épico-EP--005-orange)
![Prioridade](https://img.shields.io/badge/prioridade-media-green)
![Fase](https://img.shields.io/badge/fase-3-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** buscar transações por texto na descrição usando o parâmetro `?q=`,
> **Para que** eu possa encontrar rapidamente transações específicas sem precisar navegar por toda a listagem.

### 🎯 Contexto

A busca por descrição complementa os filtros da listagem (US-021), permitindo localizar transações por **substring case-insensitive**. O parâmetro `?q=` pode ser combinado com todos os outros filtros (tipo, conta, categoria, data) para refinar ainda mais os resultados.

**Persona principal:** Rafael (precisa localizar transações específicas de forma ágil)

### 🔌 Especificação

- **Endpoint:** `GET /api/transacoes?q=`
- **Autenticação:** ✅ Token JWT obrigatório
- **Query param:** `q` — texto para busca parcial na descrição (case-insensitive)

### ✅ Critérios de Aceitação

#### CA-01 — Busca por substring encontra transações correspondentes

```gherkin
Dado que estou autenticado
  E existem transações com "Mercado" na descrição
Quando consulto GET /api/transacoes?q=mercado
Então a resposta deve ter status 200
  E todas as transações retornadas devem conter "mercado" na descrição (case-insensitive)
```

#### CA-02 — Busca é case-insensitive

```gherkin
Dado que estou autenticado
  E existe uma transação com descrição "Almoço com clientes"
Quando consulto GET /api/transacoes?q=ALMOÇO
Então a resposta deve ter status 200
  E a transação com "Almoço com clientes" deve ser retornada
```

#### CA-03 — Busca combinada com outros filtros

```gherkin
Dado que estou autenticado
Quando consulto GET /api/transacoes?q=mercado&tipo=despesa&contaId=1
Então a resposta deve ter status 200
  E todas as transações retornadas devem atender a todos os critérios simultaneamente
```

#### CA-04 — Busca sem resultados retorna array vazio

```gherkin
Dado que estou autenticado
Quando consulto GET /api/transacoes?q=xyzabcdefghijk
Então a resposta deve ter status 200
  E o corpo deve conter um array vazio
```

#### CA-05 — Sem autenticação

```gherkin
Dado que envio a requisição sem token
Quando consulto GET /api/transacoes?q=mercado
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RT-036 | Listagem retorna apenas transações do usuário autenticado |
| RT-045 | Filtro por descrição (busca parcial, case-insensitive) |
| RT-046 | Combinação de filtros |
| RT-047 | Filtros inválidos são ignorados |
| RG-008 | Rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |

### 🏷️ Labels para a Issue

- `epic:transacoes`
- `tipo:api`
- `tipo:testes`
- `fase-3`
- `prioridade:media`

### ✔️ Definition of Done

- [x] Parâmetro `?q=` implementado no endpoint `GET /api/transacoes`
- [x] Busca por substring case-insensitive no campo descrição
- [x] Combinação com demais filtros (tipo, conta, categoria, data) funcionando
- [x] Todos os critérios de aceitação passando
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- A busca é **parcial** — `"merc"` encontra `"mercado"`, `"comercial"`, etc.
- A busca é aplicada **apenas no campo descrição**
- O parâmetro `?q=` é **combinável** com todos os outros filtros da listagem

---

## 📊 Resumo de Cobertura

### Estatísticas

| Métrica | Valor |
|---|---|
| **Total de User Stories** | 6 |
| **Total de Critérios de Aceitação** | 38 |
| **Regras de negócio cobertas** | RT-001 a RT-075 + regras gerais |
| **Endpoints implementados** | 6 |

### Distribuição de Critérios de Aceitação

```
US-020 (Registrar):   ███████████ 10 CAs
US-021 (Listar):      ███████     6 CAs
US-022 (Consultar):   █████       4 CAs
US-023 (Atualizar):   █████████   8 CAs
US-024 (Excluir):     ███████     6 CAs
US-025 (Buscar):      ██████      5 CAs
```

### Cobertura por prioridade

| Prioridade | User Stories |
|---|---|
| 🔴 **Crítica** | US-020 |
| 🟡 **Alta** | US-021, US-022, US-023, US-024 |
| 🟢 **Média** | US-025 |

### Rastreabilidade futura

Cada US vai gerar:
- **1 issue** no GitHub Projects
- **1 branch** (ex: `feat/us-020-registrar-transacao`)
- **1 Pull Request**
- **Múltiplos casos de teste** na pasta `06-testes/`
- **Testes automatizados** com identificadores rastreáveis

---

## 🔗 Documentos Relacionados

- 📦 [Épicos da Fase 1](../04-epicos/epicos.md)
- 📄 [Regras de Negócio — Transações](../02-regras-negocio/regras-transacao.md)
- 📄 [Regras de Negócio — Gerais](../02-regras-negocio/regras-gerais.md)
- 📄 [Contratos da API](../03-arquitetura/api-contratos.md)
- 📄 [Personas](../01-visao/personas.md)
- 📄 [User Stories — EP-001](ep-001-usuarios.md)
- 📄 [User Stories — EP-002](ep-002-autenticacao.md)
- 📄 [User Stories — EP-003](ep-003-contas.md)
- 📄 [User Stories — EP-004](ep-004-categorias.md)

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
