# 🏦 Regras de Negócio — Contas

> Documento que descreve as regras de negócio do domínio de **contas** financeiras: contas correntes, poupanças, carteiras digitais, dinheiro físico e investimentos.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Criação de Conta](#-criação-de-conta)
- [Tipos de Conta](#-tipos-de-conta)
- [Validações de Nome](#-validações-de-nome)
- [Saldo Inicial e Saldo Atual](#-saldo-inicial-e-saldo-atual)
- [Listagem de Contas](#-listagem-de-contas)
- [Consulta de Conta](#-consulta-de-conta)
- [Atualização de Conta](#-atualização-de-conta)
- [Exclusão de Conta (Soft Delete)](#-exclusão-de-conta-soft-delete)
- [Reativação de Conta](#-reativação-de-conta)
- [Cálculo de Saldo](#-cálculo-de-saldo)
- [Restrições e Integridade](#-restrições-e-integridade)
- [Resumo das Regras](#-resumo-das-regras)

---

## 🎯 Visão Geral

Uma **conta** representa um local onde o usuário guarda dinheiro — físico ou digital. Cada usuário pode ter **várias contas** (ex: conta do Itaú + conta Nubank + carteira).

### Operações disponíveis

| Operação | Endpoint | Autenticação |
|---|---|:---:|
| Listar contas | `GET /api/contas` | ✅ |
| Criar conta | `POST /api/contas` | ✅ |
| Consultar conta | `GET /api/contas/:id` | ✅ |
| Atualizar conta | `PUT /api/contas/:id` | ✅ |
| Excluir conta (soft delete) | `DELETE /api/contas/:id` | ✅ |
| Consultar saldo | `GET /api/contas/:id/saldo` | ✅ |

---

## ➕ Criação de Conta

### `RC-001` — Campos obrigatórios
A criação de uma conta exige:
- `nome` — nome dado pelo usuário
- `tipo` — tipo da conta (enum)

Campos opcionais:
- `saldoInicial` — saldo inicial em reais (padrão: 0)

### `RC-002` — Criação exige autenticação
A rota `POST /api/contas` é protegida. Requisições sem token válido retornam **401 Unauthorized** (conforme `RG-008`).

### `RC-003` — Conta é vinculada ao usuário autenticado
A conta criada é **automaticamente vinculada** ao usuário autenticado (via `sub` do JWT). O campo `usuarioId` **não é aceito** no body da requisição.

### `RC-004` — Resposta de criação retorna a conta completa
Uma criação bem-sucedida retorna **201 Created** com o objeto da conta, incluindo:
```json
{
  "id": 1,
  "nome": "Nubank",
  "tipo": "digital",
  "saldoInicial": 0,
  "saldoAtual": 0,
  "ativa": true,
  "criadoEm": "2026-04-22T10:30:00.000Z",
  "atualizadoEm": "2026-04-22T10:30:00.000Z"
}
```

### `RC-005` — Usuário pode ter múltiplas contas
Não há limite de quantidade de contas por usuário. Um usuário pode criar quantas contas desejar.

### `RC-006` — Contas podem ter o mesmo nome
Dois nomes idênticos **são permitidos** para o mesmo usuário. Por exemplo, "Carteira Pessoal" e "Carteira Pessoal" podem coexistir sem gerar conflito.

> 💡 **Justificativa:** Evitamos criar complexidade desnecessária. Se o usuário quiser diferenciar, pode nomear de forma distinta.

---

## 🏷️ Tipos de Conta

### `RC-007` — Tipos permitidos
O campo `tipo` aceita **exatamente** um dos seguintes valores:

| Valor | Descrição | Exemplo |
|---|---|---|
| `corrente` | Conta corrente bancária | Itaú, Bradesco, Santander |
| `poupanca` | Conta poupança | Caixa Poupança, BB Poupança |
| `carteira_digital` | Carteira digital / banco digital | Nubank, Inter, Mercado Pago |
| `dinheiro` | Dinheiro físico | Carteira de cédulas, cofre |
| `investimento` | Conta de investimento | Corretora, CDB, Tesouro Direto |

### `RC-008` — Tipo inválido retorna 400
Qualquer valor fora da lista acima retorna **400 Bad Request** com código `VALIDACAO`.

### `RC-009` — Tipo é case-sensitive
O valor deve ser enviado em **minúsculas**. `"Digital"` ou `"DIGITAL"` são rejeitados.

### `RC-010` — Tipo é imutável após criação
O campo `tipo` **não pode ser alterado** após a criação. Campos `tipo` e `saldoInicial` enviados no body do `PUT` são **ignorados silenciosamente**, preservando os valores originais.

> 💡 **Justificativa:** Mudar o tipo de conta retroativamente poderia causar inconsistências em relatórios históricos.

---

## 📛 Validações de Nome

### `RC-011` — Comprimento do nome
O nome da conta deve ter entre **2 e 100 caracteres** após o trim automático.

### `RC-012` — Nome aceita caracteres especiais
Acentos, espaços internos e caracteres comuns são permitidos:
- `"Nubank"`
- `"Itaú Pessoal"`
- `"Caixa - Reserva de Emergência"`

### `RC-013` — Nome não pode ser apenas números
Nomes compostos exclusivamente por dígitos (`"12345"`) retornam **400 Bad Request**.

> ⚠️ **Nota:** Validação presente em usuários e categorias. Em contas, nomes numéricos são aceitos.

### `RC-014` — Nome tem espaços normalizados
Múltiplos espaços internos são reduzidos a um único espaço (conforme `RG-016`).

---

## 💰 Saldo Inicial e Saldo Atual

### `RC-015` — Saldo inicial deve ser maior ou igual a zero
Saldo inicial deve ser maior ou igual a zero (`>= 0`). Valores negativos são rejeitados.
- **Positivo** — saldo em dinheiro
- **Zero** — conta zerada ou nova

### `RC-016` — Saldo inicial sem limite superior na Fase 1
Saldo inicial não possui limite superior definido na Fase 1.

### `RC-017` — Saldo inicial é imutável após criação
Uma vez criada, o `saldoInicial` **não pode ser alterado**. O campo `saldoInicial` enviado no body do `PUT` é **ignorado silenciosamente**, preservando o valor original.

> 💡 **Justificativa:** Alterar o saldo inicial afeta retroativamente todos os cálculos. Se o usuário precisar "corrigir", deve usar uma transação de ajuste.

### `RC-018` — Saldo atual é sempre calculado
O `saldoAtual` **nunca é armazenado no banco**. É sempre calculado em tempo real a partir do `saldoInicial` + transações vinculadas.

### `RC-019` — Fórmula do saldo atual
```
saldoAtual = saldoInicial + soma(receitas) − soma(despesas)
```

Apenas transações com `conta_id` correspondente são consideradas.

---

## 📋 Listagem de Contas

### `RC-020` — Listagem retorna apenas contas do usuário autenticado
`GET /api/contas` retorna exclusivamente as contas do usuário autenticado, nunca contas de outros usuários.

### `RC-021` — Ordem padrão da listagem
A listagem é ordenada por `criadoEm` **crescente (ASC)** (mais antigas primeiro).

### `RC-022` — Contas inativas são ocultas por padrão
Contas com `ativa = false` **não aparecem** na listagem por padrão (conforme `RG-052`).

### `RC-023` — Filtro para listar contas inativas
Para listar contas inativas, o cliente deve enviar:
```
GET /api/contas?ativo=false
```

### `RC-024` — Filtro por tipo
É possível filtrar contas por tipo via query parameter:
```
GET /api/contas?tipo=digital
```

Se o `tipo` for inválido, a API retorna **400 Bad Request** com código `VALIDACAO`.

### `RC-025` — Listagem retorna dados básicos sem saldo calculado
Listagem retorna dados básicos da conta sem saldo calculado. Para saldo, usar `GET /api/contas/:id` ou `GET /api/contas/:id/saldo`.

### `RC-026` — Paginação aplicada
Listagens seguem paginação padrão do sistema (conforme `RG-047`): 20 itens por página, máximo 100.

---

## 🔎 Consulta de Conta

### `RC-027` — Consulta por ID
`GET /api/contas/:id` retorna os dados completos de uma conta específica.

### `RC-028` — Usuário só consulta suas próprias contas
Se o ID pertencer a outro usuário, a API retorna **404 Not Found** com código `CONTA_NAO_ENCONTRADA`.

> 💡 **Justificativa:** Não retornamos 403 para não revelar que a conta existe.

### `RC-029` — Conta inexistente retorna 404
Se o ID não existir na base, retorna **404 Not Found** com código `CONTA_NAO_ENCONTRADA`.

### `RC-030` — Consulta inclui saldo atual
A resposta inclui `saldoAtual` calculado em tempo real.

---

## ✏️ Atualização de Conta

### `RC-031` — Campos atualizáveis
Via `PUT /api/contas/:id`, o usuário pode atualizar apenas:
- `nome`

Campos **não atualizáveis**:
- `tipo` (imutável, conforme `RC-010`)
- `saldoInicial` (imutável, conforme `RC-017`)
- `id`, `usuarioId`, `criadoEm`, `atualizadoEm`

### `RC-032` — Campos imutáveis são ignorados silenciosamente
Se a requisição incluir `tipo` ou `saldoInicial`, esses campos são **ignorados silenciosamente** e os valores originais são preservados.

### `RC-033` — Atualização parcial permitida
O usuário não precisa enviar todos os campos. Apenas `nome` é suficiente.

### `RC-034` — Atualização mantém validações de criação
O novo `nome` passa pelas mesmas validações (`RC-011` a `RC-014`).

### `RC-035` — Contas inativas não podem ser atualizadas
Se a conta estiver inativa (`ativa = false`), a atualização retorna **422 Unprocessable Entity** com código `CONTA_INATIVA`.

> ⚠️ **Nota:** Validação não implementada na Fase 1. Contas inativas podem ter seu nome atualizado via PUT.

### `RC-036` — Atualização bem-sucedida retorna 200
A resposta é **200 OK** com o objeto atualizado.

---

## 🗑️ Exclusão de Conta (Soft Delete)

### `RC-037` — Exclusão é soft delete
`DELETE /api/contas/:id` **não remove** o registro do banco. Apenas define `ativa = false`.

> 💡 **Justificativa:** Preservar histórico de transações vinculadas. Relatórios antigos precisam mostrar a conta corretamente.

### `RC-038` — Exclusão desvincula contas inativas das listagens
Após a exclusão, a conta desaparece das listagens padrão (mas permanece acessível via `?ativo=false`).

### `RC-039` — Transações da conta são preservadas
As transações vinculadas à conta inativa **não são excluídas** e continuam contabilizando no histórico geral do usuário.

### `RC-040` — Não é possível adicionar transações em conta inativa
Tentar criar uma transação em uma conta com `ativa = false` retorna **422 Unprocessable Entity** com código `CONTA_INATIVA` (ver também regras de transação).

### `RC-041` — Exclusão bem-sucedida retorna 204
A resposta é **204 No Content** (conforme `RG-044`).

### `RC-042` — Exclusão de conta inexistente retorna 404
Se o ID não existir ou pertencer a outro usuário, retorna **404 Not Found**.

### `RC-043` — Excluir conta já inativa retorna erro
Tentar desativar conta já inativa retorna **400 Bad Request** com código `CONTA_JA_INATIVA`.

---

## ♻️ Reativação de Conta

### `RC-044` — Reativação via endpoint específico *(fase futura)*
Atualmente **não existe** endpoint para reativar contas inativas. Esta funcionalidade está prevista para **fase futura** (painel administrativo ou configurações de usuário).

### `RC-045` — Dados da conta inativa são preservados
Mesmo inativa, a conta mantém:
- Nome original
- Tipo original
- Saldo inicial
- Todas as transações vinculadas

Isso permite que, quando a reativação for implementada, os dados continuem íntegros.

---

## 🧮 Cálculo de Saldo

### `RC-046` — Endpoint dedicado para consulta de saldo
Existe um endpoint dedicado para consultar apenas o saldo:
```
GET /api/contas/:id/saldo
```

Retorna:
```json
{
  "contaId": 1,
  "nome": "Nubank",
  "saldoCalculado": 1245.75
}
```

### `RC-047` — Armazenamento de valores
Saldo inicial armazenado em reais (`REAL` no SQLite). Transações são armazenadas em centavos.

### `RC-048` — Cálculo em tempo real
O saldo é calculado **no momento da requisição**, sem cache. Garante que sempre reflete o estado atual.

### `RC-049` — Cálculo considera todas as transações da conta
Todas as transações com `conta_id` correspondente entram no cálculo, independentemente da data (passadas, atuais ou futuras).

### `RC-050` — Transações com data futura afetam o saldo
Diferentemente de alguns sistemas bancários, transações **agendadas** (com `data_transacao` futura) **são** contabilizadas no saldo atual.

> 💡 **Justificativa:** O usuário lança transações manualmente. Se ele lançou, é porque confirma que a transação ocorrerá. Simplifica a lógica e é o padrão de apps como Organizze.

---

## 🔒 Restrições e Integridade

### `RC-051` — Isolamento entre usuários
Um usuário **jamais** acessa, consulta ou interage com contas de outro usuário. Todas as operações filtram implicitamente por `usuario_id`.

### `RC-052` — Exclusão do usuário remove suas contas
Quando um usuário é excluído (`DELETE /api/usuarios/me`), todas as suas contas e transações são removidas **em cascata** (conforme `RU-045`).

### `RC-053` — Referência íntegra via foreign key
O campo `usuario_id` em `contas` possui constraint `FOREIGN KEY ... ON DELETE CASCADE`. O banco garante que contas órfãs não existam.

### `RC-054` — Índice em `usuario_id`
Para performance em listagens, existe índice em `contas(usuario_id)` (conforme modelo de dados).

---

## 📊 Resumo das Regras

Total de **54 regras** de conta, organizadas em 12 grupos:

| Grupo | Regras | IDs |
|---|:---:|---|
| Criação de conta | 6 | RC-001 a RC-006 |
| Tipos de conta | 4 | RC-007 a RC-010 |
| Validações de nome | 4 | RC-011 a RC-014 |
| Saldo inicial e atual | 5 | RC-015 a RC-019 |
| Listagem | 7 | RC-020 a RC-026 |
| Consulta | 4 | RC-027 a RC-030 |
| Atualização | 6 | RC-031 a RC-036 |
| Exclusão (soft delete) | 7 | RC-037 a RC-043 |
| Reativação | 2 | RC-044 a RC-045 |
| Cálculo de saldo | 5 | RC-046 a RC-050 |
| Restrições e integridade | 4 | RC-051 a RC-054 |
| **Total** | **54** | — |

### Códigos de erro usados neste domínio

| Código | HTTP | Situação |
|---|:---:|---|
| `CONTA_NAO_ENCONTRADA` | 404 | Conta inexistente ou de outro usuário |
| `CONTA_INATIVA` | 422 | Operação em conta com `ativa = false` |
| `CONTA_JA_INATIVA` | 400 | Tentativa de desativar conta já inativa |
| `CAMPO_OBRIGATORIO` | 400 | `nome` ou `tipo` ausentes |
| `VALIDACAO` | 400 | Múltiplos campos inválidos |
| `TOKEN_AUSENTE` | 401 | Token não enviado |
| `TOKEN_INVALIDO` | 401 | Token inválido |
| `TOKEN_EXPIRADO` | 401 | Token expirado |

---

## 🔗 Documentos Relacionados

- 📄 [Regras Gerais](./regras-gerais.md)
- 📄 [Regras de Usuário](./regras-usuario.md)
- 📄 [Regras de Transação](./regras-transacao.md) *(em breve)*
- 📄 [Contratos da API](../03-arquitetura/api-contratos.md)
- 📄 [Modelo de Dados](../03-arquitetura/modelo-dados.md)

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
