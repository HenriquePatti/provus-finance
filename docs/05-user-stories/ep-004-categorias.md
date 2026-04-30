# 📄 User Stories — EP-004: Gestão de Categorias

> Documento com as User Stories do **Épico 4 — Gestão de Categorias**, que cobre listagem, criação, consulta, atualização e exclusão de categorias de transações (padrão e personalizadas).

---

## 📋 Sumário

- [Sobre Este Documento](#-sobre-este-documento)
- [Resumo do Épico](#-resumo-do-épico)
- [US-015 — Listar categorias](#us-015--listar-categorias)
- [US-016 — Criar categoria personalizada](#us-016--criar-categoria-personalizada)
- [US-017 — Consultar categoria](#us-017--consultar-categoria)
- [US-018 — Atualizar categoria personalizada](#us-018--atualizar-categoria-personalizada)
- [US-019 — Excluir categoria personalizada](#us-019--excluir-categoria-personalizada)
- [Resumo de Cobertura](#-resumo-de-cobertura)

---

## 📖 Sobre Este Documento

Este documento lista as **User Stories** do EP-004. Cada US é uma unidade de valor independente, rastreável até regras de negócio e pronta para ser transformada em issue no GitHub.

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
| **Épico** | EP-004 — Gestão de Categorias |
| **Prioridade** | 🟡 Alta |
| **Sprint** | 2 |
| **User Stories** | 5 |
| **Endpoints envolvidos** | 5 |
| **Regras de negócio cobertas** | RK-001 a RK-056 |

### Lista de User Stories

| ID | Título | Endpoint |
|---|---|---|
| US-015 | Listar categorias | `GET /api/categorias` |
| US-016 | Criar categoria personalizada | `POST /api/categorias` |
| US-017 | Consultar categoria | `GET /api/categorias/:id` |
| US-018 | Atualizar categoria personalizada | `PUT /api/categorias/:id` |
| US-019 | Excluir categoria personalizada | `DELETE /api/categorias/:id` |

### Categorias padrão (seed)

O sistema é inicializado com **13 categorias padrão** (`padrao = true`), criadas via seed e disponíveis para todos os usuários (conforme RK-007):

- **9 categorias de despesa:** Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Vestuário, Serviços e Outros (despesa)
- **4 categorias de receita:** Salário, Freelance, Investimentos e Outros (receita)

---

## US-015 — Listar categorias

![Épico](https://img.shields.io/badge/épico-EP--004-green)
![Prioridade](https://img.shields.io/badge/prioridade-crítica-red)
![Fase](https://img.shields.io/badge/fase-2-purple)

### 📖 Narrativa

> **Como** usuária autenticada no Provus Finance,
> **Quero** listar todas as categorias disponíveis (padrão e minhas personalizadas),
> **Para que** eu possa escolher a categoria correta ao registrar uma transação.

### 🎯 Contexto

A listagem de categorias é a **base para classificação de transações**. Sem ela, o usuário não consegue associar receitas e despesas a categorias. O endpoint combina categorias padrão do sistema com as personalizadas do usuário autenticado, e permite filtrar por tipo (receita/despesa) e origem (padrao/personalizada).

**Persona principal:** Ana (iniciante, precisa visualizar as opções disponíveis)

### 🔌 Especificação

- **Endpoint:** `GET /api/categorias`
- **Autenticação:** ✅ Token JWT obrigatório
- **Query params:** `tipo` (receita, despesa, ambos), `padrao` (true, false)

### ✅ Critérios de Aceitação

#### CA-01 — Listagem retorna categorias padrão e personalizadas

```gherkin
Dado que estou autenticado
  E existem categorias padrão no sistema
  E eu tenho categorias personalizadas criadas
Quando consulto GET /api/categorias sem filtros
Então a resposta deve ter status 200
  E o corpo deve conter as categorias padrão do sistema
  E o corpo deve conter as minhas categorias personalizadas
  E não deve conter categorias personalizadas de outros usuários
```

#### CA-02 — Filtro por tipo funciona corretamente

```gherkin
Dado que estou autenticado
Quando consulto GET /api/categorias?tipo=despesa
Então a resposta deve ter status 200
  E todas as categorias retornadas devem ter tipo "despesa" ou "ambos"
  E categorias exclusivamente de receita não devem aparecer
```

#### CA-03 — Filtro por origem funciona corretamente

```gherkin
Dado que estou autenticado
Quando consulto GET /api/categorias?padrao=true
Então a resposta deve ter status 200
  E todas as categorias retornadas devem ter padrao = true
  E nenhuma categoria personalizada deve aparecer
```

#### CA-04 — Usuário sem categorias personalizadas vê apenas padrão

```gherkin
Dado que estou autenticado
  E não criei nenhuma categoria personalizada
Quando consulto GET /api/categorias
Então a resposta deve ter status 200
  E o corpo deve conter apenas as 13 categorias padrão
```

#### CA-05 — Sem autenticação

```gherkin
Dado que envio a requisição sem token
Quando consulto GET /api/categorias
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

#### CA-06 — Cada categoria contém campos esperados

```gherkin
Dado que estou autenticado
Quando consulto GET /api/categorias
Então cada categoria deve conter id, nome, tipo, icone, padrao e criadoEm
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RK-027 | Listagem retorna categorias padrão + personalizadas do usuário |
| RK-028 | Categorias personalizadas de outros usuários não aparecem |
| RK-029 | Filtro por tipo é opcional |
| RK-030 | Filtro por origem (padrao) é opcional |
| RK-031 | Listagem retorna campos públicos da categoria |
| RK-032 | Listagem exige autenticação |
| RG-008 | Rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |

### 🏷️ Labels para a Issue

- `epic:categorias`
- `tipo:api`
- `tipo:testes`
- `fase-2`
- `prioridade:critica`

### ✔️ Definition of Done

- [x] Endpoint `GET /api/categorias` implementado
- [x] Listagem combina categorias padrão + personalizadas do usuário
- [x] Filtros por tipo e origem funcionando
- [x] Todos os critérios de aceitação passando
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- Categorias padrão são visíveis por **todos** os usuários autenticados
- Categorias personalizadas são visíveis **apenas pelo criador**
- O filtro `tipo=ambos` retorna categorias que servem tanto para receita quanto despesa

---

## US-016 — Criar categoria personalizada

![Épico](https://img.shields.io/badge/épico-EP--004-green)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)
![Fase](https://img.shields.io/badge/fase-2-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** criar uma categoria personalizada informando nome, tipo e opcionalmente um ícone,
> **Para que** eu possa classificar minhas transações de forma mais adequada à minha realidade financeira.

### 🎯 Contexto

As 13 categorias padrão cobrem os cenários mais comuns, mas usuários avançados precisam de **flexibilidade** para criar categorias que reflitam seus hábitos específicos. A categoria personalizada pertence exclusivamente ao criador e é automaticamente marcada como `padrao = false`.

**Persona principal:** Rafael (usuário experiente que quer granularidade na classificação)

### 🔌 Especificação

- **Endpoint:** `POST /api/categorias`
- **Autenticação:** ✅ Token JWT obrigatório
- **Corpo da requisição:** `nome`, `tipo` (receita, despesa, ambos), `icone` (opcional)

### ✅ Critérios de Aceitação

#### CA-01 — Criação bem-sucedida com dados válidos

```gherkin
Dado que estou autenticado
  E informo nome válido e tipo válido
Quando envio a requisição de criação
Então a resposta deve ter status 201
  E o corpo deve conter id, nome, tipo, icone, padrao e criadoEm
  E o campo padrao deve ser false
  E a categoria deve pertencer ao usuário autenticado
```

#### CA-02 — Criação com ícone opcional

```gherkin
Dado que estou autenticado
  E informo nome e tipo válidos sem enviar ícone
Quando envio a requisição de criação
Então a resposta deve ter status 201
  E o campo icone deve ser null ou ausente
```

#### CA-03 — Tipo deve ser receita, despesa ou ambos

```gherkin
Dado que informo um tipo diferente de receita, despesa ou ambos
Quando envio a requisição de criação
Então a resposta deve ter status 400
  E a resposta deve indicar erro de validação no campo tipo
```

#### CA-04 — Nome obrigatório

```gherkin
Dado que envio a requisição sem o campo nome
Quando envio a requisição de criação
Então a resposta deve ter status 400
  E a resposta deve indicar campo obrigatório ausente
```

#### CA-05 — Campo padrao é definido automaticamente como false

```gherkin
Dado que envio a requisição com padrao = true no corpo
Quando a categoria é criada
Então o campo padrao deve ser false independentemente do valor enviado
```

#### CA-06 — Sem autenticação

```gherkin
Dado que envio a requisição sem token
Quando envio a requisição de criação
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RK-010 | Campos obrigatórios: nome e tipo |
| RK-011 | Tipos permitidos: receita, despesa, ambos |
| RK-012 | Ícone é opcional |
| RK-013 | Campo padrao sempre false para categorias criadas pelo usuário |
| RK-014 | Categoria personalizada vinculada ao usuário autenticado |
| RG-008 | Rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |
| RG-014 | Campos obrigatórios validados primeiro |

### 🏷️ Labels para a Issue

- `epic:categorias`
- `tipo:api`
- `tipo:testes`
- `fase-2`
- `prioridade:alta`

### ✔️ Definition of Done

- [x] Endpoint `POST /api/categorias` implementado
- [x] Validações de nome e tipo funcionando
- [x] Campo padrao definido automaticamente como false
- [x] Categoria vinculada ao usuário autenticado (req.usuarioId)
- [x] Todos os critérios de aceitação passando
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- Usuário **não pode criar categorias padrão** — apenas o seed do sistema faz isso
- Não há validação de nome duplicado entre categorias personalizadas (o mesmo usuário pode ter duas categorias com o mesmo nome)
- O campo `icone` é uma string livre, sem validação de formato nesta fase

---

## US-017 — Consultar categoria

![Épico](https://img.shields.io/badge/épico-EP--004-green)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)
![Fase](https://img.shields.io/badge/fase-2-purple)

### 📖 Narrativa

> **Como** usuária autenticada no Provus Finance,
> **Quero** consultar os detalhes de uma categoria específica por ID,
> **Para que** eu possa verificar suas informações antes de usá-la em uma transação.

### 🎯 Contexto

A consulta individual permite verificar os detalhes de uma categoria antes de associá-la a uma transação. Categorias padrão são acessíveis por qualquer usuário autenticado, enquanto categorias personalizadas só podem ser consultadas pelo seu criador.

**Persona principal:** Sofia (quer transparência sobre as categorias disponíveis)

### 🔌 Especificação

- **Endpoint:** `GET /api/categorias/:id`
- **Autenticação:** ✅ Token JWT obrigatório
- **Path param:** `id` — ID da categoria

### ✅ Critérios de Aceitação

#### CA-01 — Consulta de categoria padrão por qualquer usuário

```gherkin
Dado que estou autenticado
  E informo o ID de uma categoria padrão
Quando consulto GET /api/categorias/:id
Então a resposta deve ter status 200
  E o corpo deve conter id, nome, tipo, icone, padrao e criadoEm
  E o campo padrao deve ser true
```

#### CA-02 — Consulta de categoria personalizada pelo criador

```gherkin
Dado que estou autenticado
  E informo o ID de uma categoria personalizada que eu criei
Quando consulto GET /api/categorias/:id
Então a resposta deve ter status 200
  E o corpo deve conter os dados da categoria
  E o campo padrao deve ser false
```

#### CA-03 — Categoria personalizada de outro usuário retorna 404

```gherkin
Dado que estou autenticado
  E informo o ID de uma categoria personalizada de outro usuário
Quando consulto GET /api/categorias/:id
Então a resposta deve ter status 404
  E o código do erro deve ser "CATEGORIA_NAO_ENCONTRADA"
  E nenhuma informação da categoria alheia deve ser exposta
```

#### CA-04 — Categoria inexistente retorna 404

```gherkin
Dado que informo um ID que não existe no sistema
Quando consulto GET /api/categorias/:id
Então a resposta deve ter status 404
  E o código do erro deve ser "CATEGORIA_NAO_ENCONTRADA"
```

#### CA-05 — Sem autenticação

```gherkin
Dado que envio a requisição sem token
Quando consulto GET /api/categorias/:id
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RK-033 | Categoria padrão acessível por qualquer usuário autenticado |
| RK-034 | Categoria personalizada acessível apenas pelo criador |
| RK-035 | Categoria inexistente retorna 404 |
| RK-036 | Consulta exige autenticação |
| RG-008 | Rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |
| RG-012 | Usuário só acessa seus próprios recursos |

### 🏷️ Labels para a Issue

- `epic:categorias`
- `tipo:api`
- `tipo:testes`
- `fase-2`
- `prioridade:alta`

### ✔️ Definition of Done

- [x] Endpoint `GET /api/categorias/:id` implementado
- [x] Categorias padrão acessíveis por todos os usuários autenticados
- [x] Categorias personalizadas acessíveis apenas pelo criador
- [x] 404 para categoria inexistente ou de outro usuário
- [x] Todos os critérios de aceitação passando
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- Categorias padrão são **compartilhadas** — todos os usuários autenticados podem consultá-las
- Categorias personalizadas de outros usuários retornam 404 (não 403) para **não revelar a existência** do recurso

---

## US-018 — Atualizar categoria personalizada

![Épico](https://img.shields.io/badge/épico-EP--004-green)
![Prioridade](https://img.shields.io/badge/prioridade-media-green)
![Fase](https://img.shields.io/badge/fase-2-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** atualizar o nome e/ou ícone de uma categoria personalizada que eu criei,
> **Para que** eu possa corrigir ou melhorar a classificação sem perder o histórico de transações associadas.

### 🎯 Contexto

Com o tempo, o usuário pode querer renomear ou trocar o ícone de uma categoria personalizada. O **tipo é imutável** para preservar a consistência das transações já classificadas. Categorias padrão do sistema **não podem ser alteradas** por nenhum usuário.

**Persona principal:** Rafael (mantém suas categorias organizadas e atualizadas)

### 🔌 Especificação

- **Endpoint:** `PUT /api/categorias/:id`
- **Autenticação:** ✅ Token JWT obrigatório
- **Path param:** `id` — ID da categoria
- **Corpo da requisição:** `nome` e/ou `icone` (atualização parcial)

### ✅ Critérios de Aceitação

#### CA-01 — Atualização bem-sucedida de nome e ícone

```gherkin
Dado que estou autenticado
  E informo o ID de uma categoria personalizada que eu criei
  E informo novo nome e novo ícone
Quando envio a requisição de atualização
Então a resposta deve ter status 200
  E o corpo deve conter os dados atualizados
  E o campo atualizadoEm deve estar com timestamp recente
```

#### CA-02 — Atualização parcial apenas do nome

```gherkin
Dado que estou autenticado
  E informo apenas o novo nome
Quando envio a atualização
Então a resposta deve ter status 200
  E apenas o nome deve ser alterado
  E o ícone deve permanecer inalterado
```

#### CA-03 — Tipo é imutável

```gherkin
Dado que estou autenticado
  E tento alterar o campo tipo de uma categoria personalizada
Quando envio a atualização
Então o campo tipo deve permanecer inalterado
  Ou a resposta deve retornar status 400 indicando que o tipo não pode ser alterado
```

#### CA-04 — Tentativa de atualizar categoria padrão retorna 403

```gherkin
Dado que estou autenticado
  E informo o ID de uma categoria padrão do sistema
Quando envio a requisição de atualização
Então a resposta deve ter status 403
  E o código do erro deve ser "ACESSO_NEGADO"
```

#### CA-05 — Categoria personalizada de outro usuário retorna 404

```gherkin
Dado que estou autenticado
  E informo o ID de uma categoria personalizada de outro usuário
Quando envio a requisição de atualização
Então a resposta deve ter status 404
  E o código do erro deve ser "CATEGORIA_NAO_ENCONTRADA"
```

#### CA-06 — Categoria inexistente retorna 404

```gherkin
Dado que informo um ID que não existe no sistema
Quando envio a requisição de atualização
Então a resposta deve ter status 404
  E o código do erro deve ser "CATEGORIA_NAO_ENCONTRADA"
```

#### CA-07 — Nome inválido na atualização

```gherkin
Dado que informo um nome em formato inválido ou vazio
Quando envio a atualização
Então a resposta deve ter status 400
  E a resposta deve indicar o erro de validação
```

#### CA-08 — Sem autenticação

```gherkin
Dado que envio a requisição sem token
Quando envio a requisição de atualização
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RK-037 | Campos atualizáveis: nome e ícone |
| RK-038 | Atualização parcial é permitida |
| RK-039 | Tipo é imutável após criação |
| RK-040 | Categorias padrão não podem ser alteradas (403 ACESSO_NEGADO) |
| RK-041 | Categoria personalizada só atualizada pelo criador |
| RK-042 | Timestamp atualizadoEm é atualizado automaticamente |
| RK-043 | Atualização retorna categoria atualizada |
| RG-008 | Rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |
| RG-012 | Usuário só acessa seus próprios recursos |

### 🏷️ Labels para a Issue

- `epic:categorias`
- `tipo:api`
- `tipo:testes`
- `fase-2`
- `prioridade:media`

### ✔️ Definition of Done

- [x] Endpoint `PUT /api/categorias/:id` implementado
- [x] Atualização parcial de nome e ícone funcionando
- [x] Tipo imutável após criação
- [x] 403 ao tentar atualizar categoria padrão
- [x] 404 para categoria inexistente ou de outro usuário
- [x] Todos os critérios de aceitação passando
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- O **tipo não pode ser alterado** para preservar a consistência de transações já classificadas
- Categorias padrão retornam **403** (e não 404) pois o recurso existe mas a operação não é permitida
- Categorias personalizadas de outros usuários retornam **404** para não revelar existência

---

## US-019 — Excluir categoria personalizada

![Épico](https://img.shields.io/badge/épico-EP--004-green)
![Prioridade](https://img.shields.io/badge/prioridade-media-green)
![Fase](https://img.shields.io/badge/fase-2-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** excluir uma categoria personalizada que não utilizo mais,
> **Para que** eu mantenha minha lista de categorias limpa e relevante.

### 🎯 Contexto

Categorias personalizadas que não são mais úteis podem ser removidas pelo criador. A exclusão é **hard delete** (permanente). Porém, se a categoria estiver associada a transações existentes, a exclusão é **bloqueada** para preservar a integridade dos dados. Categorias padrão do sistema **nunca podem ser excluídas**.

**Persona principal:** Rafael (mantém suas categorias organizadas)

### 🔌 Especificação

- **Endpoint:** `DELETE /api/categorias/:id`
- **Autenticação:** ✅ Token JWT obrigatório
- **Path param:** `id` — ID da categoria

### ✅ Critérios de Aceitação

#### CA-01 — Exclusão bem-sucedida de categoria sem transações

```gherkin
Dado que estou autenticado
  E informo o ID de uma categoria personalizada que eu criei
  E a categoria não está associada a nenhuma transação
Quando envio a requisição de exclusão
Então a resposta deve ter status 204
  E a resposta não deve conter corpo
  E a categoria deve ser removida do banco
```

#### CA-02 — Exclusão bloqueada por transações vinculadas

```gherkin
Dado que estou autenticado
  E a categoria personalizada está associada a transações existentes
Quando envio a requisição de exclusão
Então a resposta deve ter status 409
  E o código do erro deve ser "CATEGORIA_EM_USO"
  E a categoria deve permanecer intacta
```

#### CA-03 — Tentativa de excluir categoria padrão retorna 403

```gherkin
Dado que estou autenticado
  E informo o ID de uma categoria padrão do sistema
Quando envio a requisição de exclusão
Então a resposta deve ter status 403
  E o código do erro deve ser "ACESSO_NEGADO"
```

#### CA-04 — Categoria personalizada de outro usuário retorna 404

```gherkin
Dado que estou autenticado
  E informo o ID de uma categoria personalizada de outro usuário
Quando envio a requisição de exclusão
Então a resposta deve ter status 404
  E o código do erro deve ser "CATEGORIA_NAO_ENCONTRADA"
```

#### CA-05 — Categoria inexistente retorna 404

```gherkin
Dado que informo um ID que não existe no sistema
Quando envio a requisição de exclusão
Então a resposta deve ter status 404
  E o código do erro deve ser "CATEGORIA_NAO_ENCONTRADA"
```

#### CA-06 — Sem autenticação

```gherkin
Dado que envio a requisição sem token
Quando envio a requisição de exclusão
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RK-044 | Exclusão é hard delete (permanente) |
| RK-045 | Exclusão bloqueada se categoria tem transações (409 CATEGORIA_EM_USO) |
| RK-046 | Categorias padrão não podem ser excluídas (403 ACESSO_NEGADO) |
| RK-047 | Categoria personalizada só excluída pelo criador |
| RK-048 | Exclusão retorna 204 sem corpo |
| RG-008 | Rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |
| RG-012 | Usuário só acessa seus próprios recursos |

### 🏷️ Labels para a Issue

- `epic:categorias`
- `tipo:api`
- `tipo:testes`
- `fase-2`
- `prioridade:media`

### ✔️ Definition of Done

- [x] Endpoint `DELETE /api/categorias/:id` implementado
- [x] Hard delete para categorias personalizadas sem transações
- [x] Bloqueio com 409 quando categoria tem transações vinculadas
- [x] 403 ao tentar excluir categoria padrão
- [x] 404 para categoria inexistente ou de outro usuário
- [x] Todos os critérios de aceitação passando
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- Diferente da exclusão de conta (US-005), aqui **não há cascata** — a exclusão é bloqueada se existem transações
- Categorias padrão retornam **403** (e não 404) pois o recurso existe mas a operação não é permitida
- Para remover uma categoria em uso, o usuário precisa primeiro reclassificar ou excluir as transações associadas

---

## 📊 Resumo de Cobertura

### Estatísticas

| Métrica | Valor |
|---|---|
| **Total de User Stories** | 5 |
| **Total de Critérios de Aceitação** | 29 |
| **Regras de negócio cobertas** | RK-010 a RK-048 + regras gerais |
| **Endpoints implementados** | 5 |

### Distribuição de Critérios de Aceitação

```
US-015 (Listar):      ███████   6 CAs
US-016 (Criar):       ███████   6 CAs
US-017 (Consultar):   ██████    5 CAs
US-018 (Atualizar):   █████████ 8 CAs
US-019 (Excluir):     ███████   6 CAs
```

### Cobertura por prioridade

| Prioridade | User Stories |
|---|---|
| 🔴 **Crítica** | US-015 |
| 🟡 **Alta** | US-016, US-017 |
| 🟢 **Média** | US-018, US-019 |

### Rastreabilidade futura

Cada US vai gerar:
- **1 issue** no GitHub Projects
- **1 branch** (ex: `feat/us-015-listar-categorias`)
- **1 Pull Request**
- **Múltiplos casos de teste** na pasta `06-testes/`
- **Testes automatizados** com identificadores rastreáveis

---

## 🔗 Documentos Relacionados

- 📦 [Épicos da Fase 1](../04-epicos/epicos.md)
- 📄 [Regras de Negócio](../02-regras-negocio/)
- 📄 [Contratos da API](../03-arquitetura/api-contratos.md)
- 📄 [Personas](../01-visao/personas.md)
- 📄 [User Stories — EP-001](ep-001-usuarios.md)
- 📄 [User Stories — EP-002](ep-002-autenticacao.md)
- 📄 [User Stories — EP-003](ep-003-contas.md)

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
