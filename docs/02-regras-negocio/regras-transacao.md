# 💰 Regras de Negócio — Transações

> Documento que descreve as regras de negócio do domínio de **transações** — as movimentações financeiras (receitas e despesas) registradas pelo usuário. Este é o domínio central do Provus Finance.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Conceito de Transação](#-conceito-de-transação)
- [Criação de Transação](#-criação-de-transação)
- [Validação de Tipo](#-validação-de-tipo)
- [Validação de Valor](#-validação-de-valor)
- [Validação de Descrição](#-validação-de-descrição)
- [Validação de Data](#-validação-de-data)
- [Vínculo com Conta](#-vínculo-com-conta)
- [Vínculo com Categoria](#-vínculo-com-categoria)
- [Listagem de Transações](#-listagem-de-transações)
- [Filtros de Transações](#-filtros-de-transações)
- [Consulta de Transação](#-consulta-de-transação)
- [Atualização de Transação](#-atualização-de-transação)
- [Exclusão de Transação](#-exclusão-de-transação)
- [Impacto no Saldo](#-impacto-no-saldo)
- [Restrições e Integridade](#-restrições-e-integridade)
- [Resumo das Regras](#-resumo-das-regras)

---

## 🎯 Visão Geral

Uma **transação** é o registro de uma movimentação financeira. Pode ser:
- Uma **receita** (entrada de dinheiro)
- Uma **despesa** (saída de dinheiro)

Toda transação é obrigatoriamente associada a:
- Uma **conta** (onde o dinheiro entra ou sai)
- Uma **categoria** (o que representa a movimentação)

### Operações disponíveis

| Operação | Endpoint | Autenticação |
|---|---|:---:|
| Listar transações | `GET /api/transacoes` | ✅ |
| Criar transação | `POST /api/transacoes` | ✅ |
| Consultar transação | `GET /api/transacoes/:id` | ✅ |
| Atualizar transação | `PUT /api/transacoes/:id` | ✅ |
| Excluir transação | `DELETE /api/transacoes/:id` | ✅ |

---

## 💡 Conceito de Transação

### `RT-001` — Tipos fundamentais
Toda transação é de **um** entre dois tipos:

| Tipo | Significado | Efeito no saldo |
|---|---|:---:|
| `receita` | Dinheiro que entra na conta | ➕ Adiciona ao saldo |
| `despesa` | Dinheiro que sai da conta | ➖ Subtrai do saldo |

### `RT-002` — Valor sempre positivo
Independentemente do tipo, o **valor informado é sempre positivo**. O sinal é inferido automaticamente pelo campo `tipo`.

**Correto:**
```json
{ "tipo": "despesa", "valor": 85.50 }
```

**Incorreto:**
```json
{ "tipo": "despesa", "valor": -85.50 }
```

Valores negativos ou zero retornam **422 Unprocessable Entity** com código `VALOR_INVALIDO`.

### `RT-003` — Transferências entre contas não são suportadas nesta fase
A Fase 1 não inclui **transferências** (mover dinheiro de uma conta para outra). Essa funcionalidade está prevista para fases futuras.

---

## ➕ Criação de Transação

### `RT-004` — Campos obrigatórios na criação
A criação exige:
- `tipo` — `receita` ou `despesa`
- `valor` — valor em reais (maior que zero)
- `descricao` — descrição livre
- `dataTransacao` — data da transação (ISO 8601)
- `contaId` — ID da conta
- `categoriaId` — ID da categoria

Todos são obrigatórios. A ausência de qualquer um retorna **400 Bad Request** com código `CAMPO_OBRIGATORIO`.

### `RT-005` — Criação exige autenticação
A rota `POST /api/transacoes` é protegida. Requisições sem token válido retornam **401 Unauthorized**.

### `RT-006` — Vínculo automático via conta
A transação pertence ao usuário dono da **conta** informada. O sistema valida que a conta pertence ao usuário autenticado.

### `RT-007` — Criação bem-sucedida retorna 201
A resposta é **201 Created** com o objeto completo da transação:
```json
{
  "id": 42,
  "tipo": "despesa",
  "valor": 85.50,
  "descricao": "Almoço com colegas",
  "dataTransacao": "2026-04-22T12:30:00.000Z",
  "contaId": 1,
  "categoriaId": 3,
  "criadoEm": "2026-04-22T15:00:00.000Z",
  "atualizadoEm": "2026-04-22T15:00:00.000Z"
}
```

### `RT-008` — Múltiplos erros de validação retornados juntos
Se vários campos forem inválidos, a API retorna todos os erros em uma única resposta (conforme `RG-019`).

---

## 🔀 Validação de Tipo

### `RT-009` — Valores permitidos no campo `tipo`
O campo aceita exatamente:
- `receita`
- `despesa`

### `RT-010` — Tipo inválido retorna 400
Valores fora da lista retornam **400 Bad Request** com código `FORMATO_INVALIDO`.

### `RT-011` — Tipo é case-sensitive
`"Receita"` ou `"DESPESA"` são rejeitados. Apenas minúsculas são aceitas.

### `RT-012` — Tipo é imutável após criação
Campos tipo e contaId enviados no body do PUT são ignorados silenciosamente, preservando os valores originais.

> 💡 **Justificativa:** Alterar o tipo inverte o efeito da transação no saldo. Se o usuário errou, deve excluir e criar uma nova.

---

## 💵 Validação de Valor

### `RT-013` — Valor mínimo
O valor mínimo de uma transação é **R$ 0,01** (1 centavo). Valores menores retornam **422 Unprocessable Entity** com código `VALOR_INVALIDO`.

### `RT-014` — Valor máximo
O valor máximo é **R$ 999.999.999,99**, conforme `RG-033`. Valores acima retornam **422 Unprocessable Entity**.

### `RT-015` — Valor aceita no máximo 2 casas decimais
Valores com mais de 2 casas decimais (ex: `10.123`) são rejeitados com **400 Bad Request** (conforme `RG-031`).

### `RT-016` — Valor é convertido para centavos internamente
Internamente, o sistema converte o valor para centavos antes de persistir (conforme `RG-030`). `10.99` vira `1099`.

### `RT-017` — Valor deve ser numérico
Strings, booleanos ou outros tipos retornam **400 Bad Request** com código `VALIDACAO`.

---

## 📝 Validação de Descrição

### `RT-018` — Comprimento da descrição
A descrição deve ter entre **1 e 100 caracteres** após o trim automático.

### `RT-019` — Descrição vazia é rejeitada
Strings vazias ou compostas apenas por espaços são tratadas como ausentes (conforme `RG-017`) e retornam **400 Bad Request** com código `CAMPO_OBRIGATORIO`.

### `RT-020` — Descrição aceita caracteres especiais
Acentos, números e pontuação comum são aceitos:
- `"Mercado Dia (mensal)"`
- `"Pagamento de internet - junho/2026"`
- `"Almoço com clientes 🍽️"`

### `RT-021` — Descrição tem espaços normalizados
Múltiplos espaços internos são reduzidos a um único espaço (conforme `RG-016`).

---

## 📅 Validação de Data

### `RT-022` — Data em formato date YYYY-MM-DD
Formato date YYYY-MM-DD. Datas são armazenadas sem componente de hora.
```
2026-04-22
```

Formatos como `"22/04/2026"` são rejeitados com **400 Bad Request**.

### `RT-023` — Datas futuras são permitidas
O usuário pode registrar transações com data futura (ex: agendamentos, salários previstos). Não há restrição de data máxima (conforme `RG-027`).

### `RT-024` — Datas passadas são permitidas
O usuário pode lançar retroativamente transações de qualquer data anterior. Não há limite inferior.

### `RT-025` — Datas impossíveis retornam 400
Datas como `2026-02-30` ou `2026-13-01` são rejeitadas com **400 Bad Request** (conforme `RG-028`).

### `RT-026` — Data é armazenada como string
Armazenada como string YYYY-MM-DD no SQLite.

---

## 🏦 Vínculo com Conta

### `RT-027` — Conta deve pertencer ao usuário autenticado
O `contaId` informado deve ser de uma conta do usuário autenticado. Se não for, a API retorna **404 Not Found** com código `CONTA_NAO_ENCONTRADA`.

> 💡 **Justificativa:** Retornar 404 (em vez de 403) evita revelar que a conta existe em outro usuário.

### `RT-028` — Conta deve existir
Se o `contaId` não existir na base, retorna **404 Not Found** com código `CONTA_NAO_ENCONTRADA`.

### `RT-029` — Conta deve estar ativa
Se a conta estiver com `ativa = false`, a transação é rejeitada com **422 Unprocessable Entity** e código `CONTA_INATIVA`.

### `RT-030` — Conta não pode ser alterada após criação
O campo `contaId` enviado no body do PUT é ignorado silenciosamente, preservando o valor original.

> 💡 **Justificativa:** Mover transação entre contas muda o saldo de ambas, criando cenários complexos. Se o usuário errou, deve excluir e recriar.

---

## 🏷️ Vínculo com Categoria

### `RT-031` — Categoria deve existir
Se o `categoriaId` não existir na base, retorna **404 Not Found** com código `RECURSO_NAO_ENCONTRADO`.

### `RT-032` — Categoria deve ser acessível ao usuário
O usuário pode usar:
- **Qualquer categoria padrão** (`padrao = true`)
- **Suas próprias categorias personalizadas** (`padrao = false` e `usuario_id` = usuário autenticado)

Tentar usar categoria personalizada de outro usuário retorna **404 Not Found**.

### `RT-033` — Categoria deve ser compatível com o tipo da transação
O tipo da categoria deve ser compatível com o tipo da transação (conforme `RK-005`):

| Transação | Categoria `receita` | Categoria `despesa` | Categoria `ambos` |
|:---:|:---:|:---:|:---:|
| `receita` | ✅ | ❌ | ✅ |
| `despesa` | ❌ | ✅ | ✅ |

Categoria incompatível retorna **422 Unprocessable Entity** com código `CATEGORIA_INCOMPATIVEL`.

### `RT-034` — Categoria pode ser alterada na edição
Diferente da conta, a **categoria é mutável**. O usuário pode reclassificar transações.

### `RT-035` — Nova categoria na edição deve seguir todas as validações
Ao alterar a categoria, ela precisa atender a todas as regras (existe, acessível, compatível com o tipo).

---

## 📋 Listagem de Transações

### `RT-036` — Listagem retorna apenas transações do usuário autenticado
`GET /api/transacoes` retorna exclusivamente transações vinculadas a **contas do usuário autenticado**.

### `RT-037` — Ordem padrão da listagem
A listagem é ordenada por:
1. `dataTransacao` **descendente** (mais recentes primeiro)
2. `id` **descendente** (desempate)

### `RT-038` — Paginação (Fase 2)
Paginação não implementada na Fase 1. A listagem retorna todos os resultados. Planejado para Fase 2.

### `RT-039` — Valores em reais na resposta
Todos os valores são expressos em reais (conforme `RG-029`), já convertidos a partir de centavos.

### `RT-040` — Resposta inclui IDs de conta e categoria
Resposta inclui contaId e categoriaId (IDs). Dados enriquecidos de conta e categoria planejados para Fase 2.
```json
{
  "id": 42,
  "tipo": "despesa",
  "valor": 85.50,
  "descricao": "Almoço",
  "dataTransacao": "2026-04-22",
  "contaId": 1,
  "categoriaId": 3,
  "criadoEm": "2026-04-22T15:00:00.000Z",
  "atualizadoEm": "2026-04-22T15:00:00.000Z"
}
```

---

## 🔍 Filtros de Transações

### `RT-041` — Filtro por tipo
```
GET /api/transacoes?tipo=despesa
```

Aceita: `receita` ou `despesa`.

### `RT-042` — Filtro por conta
```
GET /api/transacoes?contaId=5
```

Se a conta não pertencer ao usuário, a listagem retorna **array vazio** (não erro).

### `RT-043` — Filtro por categoria
```
GET /api/transacoes?categoriaId=12
```

### `RT-044` — Filtro por intervalo de datas
```
GET /api/transacoes?dataInicio=2026-04-01&dataFim=2026-04-30
```

Os parâmetros `dataInicio` e `dataFim`:
- Aceitam formato `YYYY-MM-DD`
- Incluem o início e o fim do intervalo (inclusivos)
- Funcionam independentemente — pode usar só `dataInicio`, só `dataFim`, ou ambos

### `RT-045` — Filtro por descrição (busca parcial)
```
GET /api/transacoes?busca=mercado
```

A busca é:
- **Case-insensitive** (`"MERCADO"` encontra `"mercado"`)
- **Parcial** (`"merc"` encontra `"mercado", "comercial"`)
- Aplicada apenas no campo `descricao`

### `RT-046` — Combinação de filtros
Múltiplos filtros podem ser combinados. São aplicados com AND lógico:
```
GET /api/transacoes?tipo=despesa&contaId=1&dataInicio=2026-04-01&categoriaId=3
```

### `RT-047` — Filtros inválidos são ignorados
Valores inválidos em filtros (ex: `tipo=abc`) são **ignorados silenciosamente** (conforme `RG-050`), não causam erro.

### `RT-048` — Ordenação
Ordenação fixa por dataTransacao. Parâmetro ordem aceita asc/desc (padrão desc). Ordenação por outros campos planejada para Fase 2.

Exemplo:
```
GET /api/transacoes?ordem=asc
```

---

## 🔎 Consulta de Transação

### `RT-049` — Consulta por ID
`GET /api/transacoes/:id` retorna os dados completos de uma transação específica.

### `RT-050` — Usuário só consulta suas próprias transações
Se a transação pertencer a outro usuário (via conta), retorna **404 Not Found** com código `TRANSACAO_NAO_ENCONTRADA`.

### `RT-051` — Transação inexistente retorna 404
Se o ID não existir, retorna **404 Not Found**.

### `RT-052` — Resposta inclui IDs relacionados
Resposta inclui contaId e categoriaId (IDs). Dados enriquecidos de conta e categoria planejados para Fase 2.

---

## ✏️ Atualização de Transação

### `RT-053` — Campos atualizáveis
Via `PUT /api/transacoes/:id`, o usuário pode atualizar:
- `valor`
- `descricao`
- `dataTransacao`
- `categoriaId`

### `RT-054` — Campos não atualizáveis
- `tipo` (imutável, conforme `RT-012`)
- `contaId` (imutável, conforme `RT-030`)
- `id`, `criadoEm`, `atualizadoEm`

Campos tipo e contaId enviados no body do PUT são ignorados silenciosamente.

### `RT-055` — Atualização parcial permitida
O usuário não precisa reenviar todos os campos. Apenas os que deseja alterar.

### `RT-056` — Validações de criação aplicam-se na atualização
Os novos valores passam pelas mesmas validações da criação (valor, descrição, data, categoria compatível).

### `RT-057` — Atualização em transação de conta inativa é bloqueada
Se a transação pertencer a uma conta com `ativa = false`, a atualização retorna **422 Unprocessable Entity** com código `CONTA_INATIVA`.

> 💡 **Justificativa:** Preservar a integridade do histórico de contas desativadas.

### `RT-058` — Atualização bem-sucedida retorna 200
A resposta é **200 OK** com o objeto atualizado.

### `RT-059` — Saldo é recalculado implicitamente
Como o saldo é calculado em tempo real, qualquer atualização de valor reflete imediatamente na próxima consulta de saldo da conta.

---

## 🗑️ Exclusão de Transação

### `RT-060` — Exclusão é hard delete
`DELETE /api/transacoes/:id` remove **permanentemente** o registro do banco. Não há soft delete para transações.

> 💡 **Justificativa:** Diferente de contas (que mantêm histórico), transações já erradas ou duplicadas devem sair do cálculo de saldo. Soft delete complicaria a fórmula do saldo sem ganho real.

### `RT-061` — Exclusão exige autenticação
A rota requer token válido. Sem isso, retorna **401 Unauthorized**.

### `RT-062` — Usuário só exclui suas próprias transações
Transação de outro usuário retorna **404 Not Found**.

### `RT-063` — Exclusão de transação em conta inativa é permitida
Mesmo que a conta esteja inativa, o usuário pode excluir transações dela (por exemplo, limpando histórico antes de ativar o recurso de reativação).

### `RT-064` — Exclusão bem-sucedida retorna 204
A resposta é **204 No Content** (conforme `RG-044`).

### `RT-065` — Exclusão ajusta o saldo automaticamente
Como o saldo é calculado em tempo real, uma transação excluída **deixa de contar** imediatamente no saldo da conta.

---

## 📊 Impacto no Saldo

### `RT-066` — Saldo da conta é afetado por toda transação ativa
Toda transação com `conta_id` correspondente afeta o saldo daquela conta:

```
saldoAtual = saldoInicial + somaReceitas − somaDespesas
```

### `RT-067` — Data da transação não afeta o saldo atual
Transações passadas, atuais ou futuras **todas contam** no saldo atual (conforme `RC-050`).

### `RT-068` — Exclusão de transação recalcula saldo automaticamente
Não há cache de saldo a ser invalidado. Toda consulta de saldo é computada em tempo real.

### `RT-069` — Valor em centavos evita erros de arredondamento
Como valores são armazenados em centavos (INTEGER), o saldo é sempre **exato**, sem problemas de ponto flutuante.

---

## 🔒 Restrições e Integridade

### `RT-070` — Integridade referencial via foreign keys
As tabelas de transação possuem:
- `FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE`
- `FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT`

### `RT-071` — Exclusão de conta propaga para transações
Quando uma conta é excluída (hard delete, via exclusão do usuário), todas as transações da conta são removidas em cascata.

### `RT-072` — Exclusão de categoria é bloqueada se houver transações
Conforme `RK-046`, uma categoria com transações vinculadas não pode ser excluída. O banco reforça isso via `ON DELETE RESTRICT`.

### `RT-073` — Soft delete de conta não exclui transações
Como o soft delete apenas define `ativa = false`, as transações da conta **continuam existindo e contabilizando** no saldo histórico.

### `RT-074` — Isolamento entre usuários via conta
Um usuário nunca enxerga transações de outro, pois toda transação é filtrada pelo dono da `conta_id` vinculada.

### `RT-075` — Índices em colunas de consulta frequente
A tabela `transacoes` possui índices em:
- `conta_id` (listagens por conta)
- `categoria_id` (filtros e agrupamentos)
- `data_transacao` (ordenações)

---

## 📊 Resumo das Regras

Total de **75 regras** de transação, organizadas em 16 grupos:

| Grupo | Regras | IDs |
|---|:---:|---|
| Conceito de transação | 3 | RT-001 a RT-003 |
| Criação | 5 | RT-004 a RT-008 |
| Validação de tipo | 4 | RT-009 a RT-012 |
| Validação de valor | 5 | RT-013 a RT-017 |
| Validação de descrição | 4 | RT-018 a RT-021 |
| Validação de data | 5 | RT-022 a RT-026 |
| Vínculo com conta | 4 | RT-027 a RT-030 |
| Vínculo com categoria | 5 | RT-031 a RT-035 |
| Listagem | 5 | RT-036 a RT-040 |
| Filtros | 8 | RT-041 a RT-048 |
| Consulta | 4 | RT-049 a RT-052 |
| Atualização | 7 | RT-053 a RT-059 |
| Exclusão | 6 | RT-060 a RT-065 |
| Impacto no saldo | 4 | RT-066 a RT-069 |
| Restrições e integridade | 6 | RT-070 a RT-075 |
| **Total** | **75** | — |

### Códigos de erro usados neste domínio

| Código | HTTP | Situação |
|---|:---:|---|
| `CONTA_NAO_ENCONTRADA` | 404 | Conta inexistente ou de outro usuário |
| `TRANSACAO_NAO_ENCONTRADA` | 404 | Transação não encontrada ou de outro usuário |
| `CONTA_INATIVA` | 422 | Tentativa de operação em conta desativada |
| `CATEGORIA_INCOMPATIVEL` | 422 | Tipo da categoria não suporta o tipo da transação |
| `VALOR_INVALIDO` | 422 | Valor zero, negativo ou acima do limite |
| `FORMATO_INVALIDO` | 400 | Tipo, data ou categoria inválidos |
| `CAMPO_OBRIGATORIO` | 400 | Campo obrigatório ausente |
| `VALIDACAO` | 400 | Múltiplos campos inválidos |
| `TOKEN_AUSENTE` | 401 | Token não enviado |
| `TOKEN_INVALIDO` | 401 | Token inválido |
| `TOKEN_EXPIRADO` | 401 | Token expirado |

---

## 🔗 Documentos Relacionados

- 📄 [Regras Gerais](./regras-gerais.md)
- 📄 [Regras de Usuário](./regras-usuario.md)
- 📄 [Regras de Conta](./regras-conta.md)
- 📄 [Regras de Categoria](./regras-categoria.md)
- 📄 [Modelo de Dados](../03-arquitetura/modelo-dados.md)
- 📄 [Contratos da API](../03-arquitetura/api-contratos.md)

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
