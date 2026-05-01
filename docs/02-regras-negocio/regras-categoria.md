# 🏷️ Regras de Negócio — Categorias

> Documento que descreve as regras de negócio do domínio de **categorias**, que permitem organizar as transações do usuário por tipo de gasto ou receita (alimentação, transporte, salário, etc.).

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Tipos de Categoria](#-tipos-de-categoria)
- [Categorias Padrão do Sistema](#-categorias-padrão-do-sistema)
- [Criação de Categoria Personalizada](#-criação-de-categoria-personalizada)
- [Validação de Nome](#-validação-de-nome)
- [Validação de Tipo](#-validação-de-tipo)
- [Validação de Ícone](#-validação-de-ícone)
- [Listagem de Categorias](#-listagem-de-categorias)
- [Consulta de Categoria](#-consulta-de-categoria)
- [Atualização de Categoria](#-atualização-de-categoria)
- [Exclusão de Categoria](#-exclusão-de-categoria)
- [Proteção das Categorias Padrão](#-proteção-das-categorias-padrão)
- [Restrições e Integridade](#-restrições-e-integridade)
- [Resumo das Regras](#-resumo-das-regras)

---

## 🎯 Visão Geral

Uma **categoria** agrupa transações por finalidade. Categorias são essenciais para:
- Entender para onde o dinheiro está indo
- Gerar relatórios e gráficos
- Aplicar orçamentos (fase futura)

### Operações disponíveis

| Operação | Endpoint | Autenticação |
|---|---|:---:|
| Listar categorias | `GET /api/categorias` | ✅ |
| Criar categoria | `POST /api/categorias` | ✅ |
| Consultar categoria | `GET /api/categorias/:id` | ✅ |
| Atualizar categoria | `PUT /api/categorias/:id` | ✅ |
| Excluir categoria | `DELETE /api/categorias/:id` | ✅ |

---

## 🧩 Tipos de Categoria

O sistema opera com **duas naturezas** de categoria, que convivem lado a lado.

### `RK-001` — Existem dois tipos de origem
As categorias podem ser:

| Origem | `padrao` | `usuario_id` | Quem pode modificar? |
|---|:---:|:---:|---|
| **Categoria padrão do sistema** | `true` | `NULL` | Ninguém (fase atual) |
| **Categoria personalizada do usuário** | `false` | ID do usuário | Apenas o próprio usuário |

### `RK-002` — Categorias padrão são compartilhadas
Todas as categorias com `padrao = true` são **visíveis para todos os usuários** do sistema. Não pertencem a ninguém individualmente.

### `RK-003` — Categorias personalizadas são privadas
Categorias com `padrao = false` são visíveis apenas para o **usuário que as criou**. Usuários não têm acesso às categorias personalizadas de outros.

### `RK-004` — Cada categoria tem um tipo semântico
Além da origem, toda categoria tem um **tipo semântico** que define onde pode ser usada:

| Valor | Uso |
|---|---|
| `receita` | Apenas em transações do tipo `receita` |
| `despesa` | Apenas em transações do tipo `despesa` |
| `ambos` | Em receitas **e** despesas |

### `RK-005` — Tipo determina compatibilidade com transação
Ao criar uma transação, o tipo da transação deve ser compatível com o tipo da categoria:

| Transação | Categoria `receita` | Categoria `despesa` | Categoria `ambos` |
|:---:|:---:|:---:|:---:|
| `receita` | ✅ | ❌ | ✅ |
| `despesa` | ❌ | ✅ | ✅ |

Categorias incompatíveis retornam **422 Unprocessable Entity** com código `CATEGORIA_INCOMPATIVEL` (ver regras de transação).

---

## 🗂️ Categorias Padrão do Sistema

### `RK-006` — Categorias padrão são criadas via seed
Na primeira execução do banco, as categorias padrão são populadas automaticamente via script de seed (conforme modelo de dados).

### `RK-007` — Lista inicial de categorias padrão
O sistema vem com as seguintes categorias padrão:

#### Despesa

| Nome | Ícone | Tipo |
|---|:---:|---|
| Alimentação | 🍔 | despesa |
| Transporte | 🚗 | despesa |
| Moradia | 🏠 | despesa |
| Saúde | 🏥 | despesa |
| Lazer | 🎮 | despesa |
| Educação | 📚 | despesa |
| Compras | 🛍️ | despesa |
| Serviços | 🔧 | despesa |
| Outros | 📦 | despesa |

#### Receita

| Nome | Ícone | Tipo |
|---|:---:|---|
| Salário | 💼 | receita |
| Freelance | 💻 | receita |
| Investimentos | 📈 | receita |
| Outros | 💰 | receita |

### `RK-008` — Usuários não podem criar categorias padrão
A API **não aceita** o campo `padrao` no body de requisições de criação. Toda categoria criada via API tem `padrao = false` automaticamente.

### `RK-009` — Categorias padrão não podem ser duplicadas na criação
Um usuário pode criar uma categoria personalizada com o mesmo **nome** de uma categoria padrão (ex: "Alimentação"). O sistema trata como categorias distintas — a padrão continua disponível para todos e a personalizada fica visível apenas para o criador.

> 💡 **Justificativa:** Evita conflitos na seed e permite ao usuário criar variações próprias.

---

## ➕ Criação de Categoria Personalizada

### `RK-010` — Campos obrigatórios na criação
A criação exige:
- `nome` — nome da categoria
- `tipo` — `receita`, `despesa` ou `ambos`

Campos opcionais:
- `icone` — emoji representativo (ex: `🎲`)

Campos **ignorados** se enviados:
- `padrao` (sempre definido como `false`)
- `usuarioId` (preenchido automaticamente via token)

### `RK-011` — Vínculo automático com o usuário autenticado
A categoria criada é **automaticamente vinculada** ao usuário autenticado (via `sub` do JWT). Não é possível criar categoria para outro usuário.

### `RK-012` — Criação bem-sucedida retorna 201
A resposta é **201 Created** com o objeto completo:
```json
{
  "id": 15,
  "nome": "Jogos e Hobbies",
  "tipo": "despesa",
  "icone": "🎲",
  "padrao": false,
  "criadoEm": "2026-04-22T10:30:00.000Z",
  "atualizadoEm": "2026-04-22T10:30:00.000Z"
}
```

### `RK-013` — Usuário pode criar múltiplas categorias
Não há limite na quantidade de categorias personalizadas por usuário.

### `RK-014` — Nomes duplicados entre categorias personalizadas do mesmo usuário
Dois usuários podem ter categorias personalizadas com o mesmo nome (ex: ambos podem ter "Pets"). Dentro do **mesmo usuário**, o sistema permite duplicatas — não há constraint de unicidade.

> 💡 **Justificativa:** Consistência com `RC-006` (contas com mesmo nome permitidas).

---

## 📛 Validação de Nome

### `RK-015` — Comprimento do nome
O nome deve ter entre **2 e 50 caracteres** após o trim automático.

### `RK-016` — Nome aceita caracteres especiais
Acentos, cedilhas e caracteres comuns do português são aceitos.

### `RK-017` — Nome não pode ser apenas números
Nomes como `"123"` são rejeitados com **400 Bad Request**.

### `RK-018` — Nome tem espaços normalizados
Múltiplos espaços internos são reduzidos a um único espaço (conforme `RG-016`).

---

## 🧠 Validação de Tipo

### `RK-019` — Valores aceitos no campo `tipo`
O campo `tipo` aceita exatamente:
- `receita`
- `despesa`
- `ambos`

### `RK-020` — Tipo inválido retorna 400
Valores fora da lista retornam **400 Bad Request** com código `VALIDACAO`.

### `RK-021` — Tipo é case-sensitive
`"Despesa"` ou `"DESPESA"` são rejeitados. Apenas minúsculas são aceitas.

### `RK-022` — Tipo é imutável após criação
O campo tipo enviado no body do PUT é ignorado silenciosamente, preservando o valor original.

> 💡 **Justificativa:** Alterar o tipo pode invalidar transações existentes que usavam a categoria. Se o usuário precisar, deve criar uma nova categoria.

---

## 🎨 Validação de Ícone

### `RK-023` — Ícone é opcional
O campo `icone` é opcional. Quando não informado, a categoria é criada sem ícone (valor `null`).

### `RK-024` — Ícone aceita emojis Unicode
O campo aceita um ou dois caracteres emoji Unicode válidos. Ex: `🍔`, `🚗`, `💼`.

### `RK-025` — Comprimento máximo do ícone
O campo `icone` aceita no máximo **4 caracteres** (alguns emojis compostos podem ocupar mais de 1 caractere UTF-16).

### `RK-026` — Ícone malformado é rejeitado
Se o valor enviado não for um emoji ou um caractere válido, retorna **400 Bad Request**.

---

## 📋 Listagem de Categorias

### `RK-027` — Listagem retorna categorias acessíveis ao usuário
`GET /api/categorias` retorna:
- **Todas as categorias padrão** do sistema
- **Apenas as categorias personalizadas** do usuário autenticado

Categorias personalizadas de **outros usuários não aparecem**.

### `RK-028` — Ordem padrão da listagem
A listagem é ordenada por:
1. `padrao` **descendente** (padrão primeiro)
2. `nome` **ascendente** (alfabética)

### `RK-029` — Filtro por tipo
É possível filtrar categorias por tipo via query parameter:
```
GET /api/categorias?tipo=despesa
```

Ao filtrar por `despesa`, também retorna categorias `ambos` (pois servem para despesas).

### `RK-030` — Filtro por origem
É possível filtrar apenas categorias padrão ou apenas personalizadas:
```
GET /api/categorias?origem=padrao
GET /api/categorias?origem=personalizada
```

### `RK-031` — Filtro por tipo inválido é ignorado
Se `tipo` receber valor inválido, o filtro é ignorado silenciosamente (conforme `RG-050`).

### `RK-032` — Paginação aplicada
A listagem segue paginação padrão (20 itens por página, máximo 100).

---

## 🔎 Consulta de Categoria

### `RK-033` — Consulta por ID
`GET /api/categorias/:id` retorna os dados completos de uma categoria específica.

### `RK-034` — Consulta de categoria padrão é sempre permitida
Qualquer usuário autenticado pode consultar qualquer categoria padrão.

### `RK-035` — Consulta de categoria personalizada de outro usuário retorna 404
Se o ID pertencer a uma categoria personalizada de outro usuário, retorna **404 Not Found** com código `CATEGORIA_NAO_ENCONTRADA` (não revela a existência).

### `RK-036` — Categoria inexistente retorna 404
Se o ID não existir na base, retorna **404 Not Found**.

---

## ✏️ Atualização de Categoria

### `RK-037` — Apenas categorias personalizadas do usuário podem ser atualizadas
Tentativas de atualizar categorias padrão retornam **403 Forbidden** com código `ACESSO_NEGADO`.

Tentativas de atualizar categorias personalizadas de outro usuário retornam **404 Not Found** com código `CATEGORIA_NAO_ENCONTRADA`.

### `RK-038` — Campos atualizáveis
Via `PUT /api/categorias/:id`, o usuário pode atualizar:
- `nome`
- `icone`

Campos **não atualizáveis**:
- `tipo` (imutável, conforme `RK-022`)
- `padrao`
- `id`, `usuarioId`, `criadoEm`, `atualizadoEm`

### `RK-039` — Campos imutáveis no PUT são ignorados
Campos tipo e padrao enviados no body são ignorados silenciosamente.

### `RK-040` — Atualização parcial permitida
O usuário pode enviar apenas um dos campos (`nome` OU `icone`).

### `RK-041` — Atualização mantém validações de criação
Os novos valores passam pelas mesmas validações da criação.

### `RK-042` — Remover ícone
Para remover o ícone de uma categoria, o usuário envia `icone: null` explicitamente.

### `RK-043` — Atualização bem-sucedida retorna 200
A resposta é **200 OK** com o objeto atualizado.

---

## 🗑️ Exclusão de Categoria

### `RK-044` — Apenas categorias personalizadas podem ser excluídas
Tentar excluir uma categoria padrão retorna **403 Forbidden** com código `ACESSO_NEGADO`.

Tentar excluir categoria personalizada de outro usuário retorna **404 Not Found**.

### `RK-045` — Exclusão é hard delete
A categoria é **permanentemente removida** do banco. Não há soft delete para categorias personalizadas.

### `RK-046` — Categoria com transações não pode ser excluída
Se a categoria possui **uma ou mais transações vinculadas**, a exclusão é bloqueada com **409 Conflict** e código `CATEGORIA_EM_USO`.

A resposta inclui o número de transações que impedem a exclusão:
```json
{
  "erro": {
    "codigo": "CATEGORIA_EM_USO",
    "mensagem": "Esta categoria possui 3 transações vinculadas e não pode ser excluída."
  }
}
```

> 💡 **Justificativa:** Excluir categoria com transações deixaria transações órfãs e quebraria relatórios. O usuário deve primeiro reclassificar ou excluir as transações.

### `RK-047` — Categoria sem transações é excluída sem alertas
Se não houver transações vinculadas, a exclusão prossegue diretamente e retorna **204 No Content**.

### `RK-048` — Exclusão bem-sucedida retorna 204
A resposta é **204 No Content** (conforme `RG-044`).

---

## 🛡️ Proteção das Categorias Padrão

### `RK-049` — Categorias padrão são somente leitura via API
Nenhum usuário comum pode:
- ❌ Atualizar categorias padrão
- ❌ Excluir categorias padrão
- ❌ Alterar o status `padrao` de qualquer categoria

Todas as tentativas retornam **403 Forbidden** com código `ACESSO_NEGADO`.

### `RK-050` — Categorias padrão só podem ser modificadas via seed
A manutenção das categorias padrão é feita **exclusivamente** via scripts SQL (seed), executados manualmente ou na inicialização do sistema.

### `RK-051` — Futuras categorias padrão serão adicionadas por migrations
Novas categorias padrão, quando forem adicionadas, virão via **novas migrations** do banco, e estarão disponíveis para todos os usuários existentes.

### `RK-052` — Rotas administrativas (fase futura)
Na **fase 6** (painel administrativo), serão criadas rotas específicas para gerenciar categorias padrão, acessíveis apenas por usuários com perfil `admin`.

---

## 🔒 Restrições e Integridade

### `RK-053` — Exclusão do usuário remove suas categorias personalizadas
Quando um usuário é excluído, todas as suas categorias personalizadas (`padrao = false` e `usuario_id = X`) são removidas em cascata.

**Categorias padrão não são afetadas.**

### `RK-054` — Referência íntegra via foreign key
O campo `usuario_id` em `categorias` possui constraint `FOREIGN KEY ... ON DELETE CASCADE`. O banco garante isso automaticamente.

### `RK-055` — Transações mantêm referência íntegra
O campo `categoria_id` em `transacoes` possui constraint `FOREIGN KEY ... ON DELETE RESTRICT`. O banco bloqueia a exclusão de categoria com transações (complementando `RK-046`).

### `RK-056` — Índice em `usuario_id` e `padrao`
Para performance em listagens frequentes, existe índice em `categorias(usuario_id)` (conforme modelo de dados).

---

## 📊 Resumo das Regras

Total de **56 regras** de categoria, organizadas em 13 grupos:

| Grupo | Regras | IDs |
|---|:---:|---|
| Tipos de categoria | 5 | RK-001 a RK-005 |
| Categorias padrão | 4 | RK-006 a RK-009 |
| Criação | 5 | RK-010 a RK-014 |
| Validação de nome | 4 | RK-015 a RK-018 |
| Validação de tipo | 4 | RK-019 a RK-022 |
| Validação de ícone | 4 | RK-023 a RK-026 |
| Listagem | 6 | RK-027 a RK-032 |
| Consulta | 4 | RK-033 a RK-036 |
| Atualização | 7 | RK-037 a RK-043 |
| Exclusão | 5 | RK-044 a RK-048 |
| Proteção das padrão | 4 | RK-049 a RK-052 |
| Restrições e integridade | 4 | RK-053 a RK-056 |
| **Total** | **56** | — |

### Códigos de erro usados neste domínio

| Código | HTTP | Situação |
|---|:---:|---|
| `CATEGORIA_NAO_ENCONTRADA` | 404 | Categoria inexistente ou de outro usuário |
| `ACESSO_NEGADO` | 403 | Tentativa de alterar/excluir categoria padrão |
| `CATEGORIA_EM_USO` | 409 | Exclusão bloqueada por transações vinculadas |
| `FORMATO_INVALIDO` | 400 | Ícone inválido ou nome inválido |
| `CAMPO_OBRIGATORIO` | 400 | `nome` ou `tipo` ausentes |
| `VALIDACAO` | 400 | Múltiplos campos inválidos |
| `TOKEN_AUSENTE` | 401 | Token não enviado |
| `TOKEN_INVALIDO` | 401 | Token inválido |
| `TOKEN_EXPIRADO` | 401 | Token expirado |

---

## 🔗 Documentos Relacionados

- 📄 [Regras Gerais](./regras-gerais.md)
- 📄 [Regras de Usuário](./regras-usuario.md)
- 📄 [Regras de Conta](./regras-conta.md)
- 📄 [Regras de Transação](./regras-transacao.md) *(próximo documento)*
- 📄 [Modelo de Dados](../03-arquitetura/modelo-dados.md)
- 📄 [Contratos da API](../03-arquitetura/api-contratos.md)

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
