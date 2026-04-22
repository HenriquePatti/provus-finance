# 🗄️ Modelo de Dados

> Documento que descreve o modelo de dados do Provus Finance — tabelas, colunas, tipos, relacionamentos, constraints e decisões de modelagem.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Diagrama Entidade-Relacionamento](#-diagrama-entidade-relacionamento)
- [Convenções Adotadas](#-convenções-adotadas)
- [Tabela: `usuarios`](#-tabela-usuarios)
- [Tabela: `contas`](#-tabela-contas)
- [Tabela: `categorias`](#-tabela-categorias)
- [Tabela: `transacoes`](#-tabela-transacoes)
- [Relacionamentos](#-relacionamentos)
- [Índices](#-índices)
- [Constraints e Validações no Banco](#-constraints-e-validações-no-banco)
- [Seeds — Dados Iniciais](#-seeds--dados-iniciais)
- [Considerações sobre SQLite](#-considerações-sobre-sqlite)
- [Evolução Futura](#-evolução-futura)

---

## 🎯 Visão Geral

O modelo de dados da **Fase 1** é composto por **4 tabelas principais**:

| Tabela | Propósito |
|---|---|
| `usuarios` | Armazena os usuários cadastrados na aplicação |
| `contas` | Representa contas bancárias, carteiras ou dinheiro físico |
| `categorias` | Agrupa as transações por finalidade (alimentação, transporte, etc.) |
| `transacoes` | Movimentações financeiras (receitas e despesas) |

### Princípios de modelagem

1. **Normalização moderada** — evita redundância, mas não no extremo
2. **Integridade referencial** — foreign keys ativas em todas as relações
3. **Soft delete onde faz sentido** — preservar histórico de dados importantes
4. **Timestamps padrão** — `criado_em` e `atualizado_em` em todas as tabelas
5. **Nomenclatura em português** — alinhada ao domínio do negócio

---

## 🗂️ Diagrama Entidade-Relacionamento

```
┌─────────────────────────────┐
│         usuarios            │
├─────────────────────────────┤
│ id              PK          │
│ nome                        │
│ email           UNIQUE      │
│ senha_hash                  │
│ criado_em                   │
│ atualizado_em               │
└─────────────────────────────┘
          │ 1
          │
          │ N
          ▼
┌─────────────────────────────┐
│          contas             │
├─────────────────────────────┤
│ id              PK          │
│ usuario_id      FK          │
│ nome                        │
│ tipo                        │
│ saldo_inicial               │
│ ativa                       │
│ criado_em                   │
│ atualizado_em               │
└─────────────────────────────┘
          │ 1
          │
          │ N
          ▼
┌─────────────────────────────┐      ┌─────────────────────────────┐
│        transacoes           │  N   │       categorias            │
├─────────────────────────────┤──────├─────────────────────────────┤
│ id              PK          │  1   │ id              PK          │
│ conta_id        FK          │      │ usuario_id      FK (null)   │
│ categoria_id    FK          │      │ nome                        │
│ tipo                        │      │ tipo                        │
│ valor                       │      │ icone                       │
│ descricao                   │      │ padrao                      │
│ data_transacao              │      │ criado_em                   │
│ criado_em                   │      │ atualizado_em               │
│ atualizado_em               │      └─────────────────────────────┘
└─────────────────────────────┘
                                        │ 1
                                        │
                                        │ N (categoria_id)
                                        │
                               (recebe N transações)
```

### Legenda

- **PK** — Primary Key (chave primária)
- **FK** — Foreign Key (chave estrangeira)
- **UNIQUE** — valor não pode se repetir
- **1, N** — cardinalidade (um-para-muitos)

---

## 📐 Convenções Adotadas

### Colunas padrão em todas as tabelas

| Coluna | Tipo | Propósito |
|---|---|---|
| `id` | `INTEGER PRIMARY KEY AUTOINCREMENT` | Identificador único |
| `criado_em` | `TEXT` | Data/hora de criação (ISO 8601) |
| `atualizado_em` | `TEXT` | Data/hora da última atualização |

### Formato de datas

Todas as datas são armazenadas como **TEXT** no formato **ISO 8601**:
```
2026-04-22T15:30:00.000Z
```

**Por que TEXT em vez de um tipo específico?**
SQLite não possui tipo nativo de data/hora. O formato ISO 8601 permite:
- Ordenação alfabética correta (que coincide com ordenação cronológica)
- Conversão direta para `Date` do JavaScript
- Leitura humana

### Booleanos

SQLite não tem tipo BOOLEAN. Usamos **INTEGER** com os valores:
- `0` = falso
- `1` = verdadeiro

### Valores monetários

Valores em dinheiro são armazenados como **INTEGER** representando **centavos**.

**Exemplo:** `R$ 1.234,56` é gravado como `123456`.

**Por que centavos em vez de decimais?**
- Evita problemas de precisão de ponto flutuante (REAL)
- SQLite não possui tipo `DECIMAL` nativo
- Padrão recomendado pela indústria para finanças
- Cálculos sempre exatos

A conversão (reais ↔ centavos) é responsabilidade da camada de **service**, nunca do banco.

---

## 👤 Tabela: `usuarios`

Armazena os usuários cadastrados no sistema.

### Estrutura

```sql
CREATE TABLE usuarios (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  nome            TEXT    NOT NULL,
  email           TEXT    NOT NULL UNIQUE,
  senha_hash      TEXT    NOT NULL,
  criado_em       TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em   TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

### Colunas

| Coluna | Tipo | Nulo? | Descrição |
|---|---|:---:|---|
| `id` | INTEGER | ❌ | Identificador único (PK) |
| `nome` | TEXT | ❌ | Nome completo do usuário |
| `email` | TEXT | ❌ | E-mail único para login |
| `senha_hash` | TEXT | ❌ | Hash da senha gerado com bcrypt |
| `criado_em` | TEXT | ❌ | Data/hora de criação |
| `atualizado_em` | TEXT | ❌ | Data/hora da última alteração |

### Regras importantes

- **Senha nunca é armazenada em texto puro** — apenas o hash bcrypt
- **E-mail é único** — garantido por UNIQUE constraint
- **E-mail deve ser salvo em minúsculas** — normalização na camada de service

---

## 🏦 Tabela: `contas`

Representa contas financeiras do usuário — bancos, carteiras, dinheiro físico, etc.

### Estrutura

```sql
CREATE TABLE contas (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id      INTEGER NOT NULL,
  nome            TEXT    NOT NULL,
  tipo            TEXT    NOT NULL
                  CHECK (tipo IN ('corrente', 'poupanca', 'digital', 'carteira', 'dinheiro')),
  saldo_inicial   INTEGER NOT NULL DEFAULT 0,
  ativa           INTEGER NOT NULL DEFAULT 1
                  CHECK (ativa IN (0, 1)),
  criado_em       TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em   TEXT    NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

### Colunas

| Coluna | Tipo | Nulo? | Descrição |
|---|---|:---:|---|
| `id` | INTEGER | ❌ | Identificador único (PK) |
| `usuario_id` | INTEGER | ❌ | FK → `usuarios.id` |
| `nome` | TEXT | ❌ | Nome dado pelo usuário (ex: "Itaú") |
| `tipo` | TEXT | ❌ | Tipo da conta (enum via CHECK) |
| `saldo_inicial` | INTEGER | ❌ | Saldo de abertura em centavos |
| `ativa` | INTEGER | ❌ | 1 = ativa, 0 = inativa (soft delete) |

### Valores permitidos em `tipo`

- `corrente` — Conta corrente bancária
- `poupanca` — Conta poupança
- `digital` — Banco digital (Nubank, PicPay, etc.)
- `carteira` — Carteira virtual
- `dinheiro` — Dinheiro físico

### Observações

- **Saldo atual não é armazenado** — é calculado dinamicamente a partir do `saldo_inicial` + transações vinculadas
- **Soft delete via `ativa = 0`** — preserva histórico de transações passadas
- **Ao excluir usuário**, suas contas são excluídas em cascata (`ON DELETE CASCADE`)

---

## 🏷️ Tabela: `categorias`

Categoriza as transações por finalidade. Comporta tanto **categorias padrão do sistema** quanto **categorias personalizadas** do usuário.

### Estrutura

```sql
CREATE TABLE categorias (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id      INTEGER,
  nome            TEXT    NOT NULL,
  tipo            TEXT    NOT NULL
                  CHECK (tipo IN ('receita', 'despesa', 'ambos')),
  icone           TEXT,
  padrao          INTEGER NOT NULL DEFAULT 0
                  CHECK (padrao IN (0, 1)),
  criado_em       TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em   TEXT    NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

### Colunas

| Coluna | Tipo | Nulo? | Descrição |
|---|---|:---:|---|
| `id` | INTEGER | ❌ | Identificador único (PK) |
| `usuario_id` | INTEGER | ✅ | FK → `usuarios.id` (nulo = categoria padrão) |
| `nome` | TEXT | ❌ | Nome da categoria |
| `tipo` | TEXT | ❌ | Tipo (enum via CHECK) |
| `icone` | TEXT | ✅ | Emoji representativo |
| `padrao` | INTEGER | ❌ | 1 = categoria do sistema, 0 = criada pelo usuário |

### Valores permitidos em `tipo`

- `receita` — Categoria usável apenas em receitas
- `despesa` — Categoria usável apenas em despesas
- `ambos` — Categoria polivalente

### Por que `usuario_id` pode ser NULO?

Para comportar dois tipos de categoria:

| Tipo | `usuario_id` | `padrao` |
|---|:---:|:---:|
| Categoria do sistema (ex: "Alimentação") | `NULL` | `1` |
| Categoria do usuário (ex: "Aulas de piano") | `123` | `0` |

Isso permite que:
- Categorias padrão sejam **compartilhadas** por todos
- Categorias personalizadas sejam **privadas** de cada usuário

---

## 💰 Tabela: `transacoes`

Registra todas as movimentações financeiras — receitas e despesas.

### Estrutura

```sql
CREATE TABLE transacoes (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  conta_id         INTEGER NOT NULL,
  categoria_id     INTEGER NOT NULL,
  tipo             TEXT    NOT NULL
                   CHECK (tipo IN ('receita', 'despesa')),
  valor            INTEGER NOT NULL
                   CHECK (valor > 0),
  descricao        TEXT    NOT NULL,
  data_transacao   TEXT    NOT NULL,
  criado_em        TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em    TEXT    NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (conta_id)     REFERENCES contas(id)     ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
);
```

### Colunas

| Coluna | Tipo | Nulo? | Descrição |
|---|---|:---:|---|
| `id` | INTEGER | ❌ | Identificador único (PK) |
| `conta_id` | INTEGER | ❌ | FK → `contas.id` |
| `categoria_id` | INTEGER | ❌ | FK → `categorias.id` |
| `tipo` | TEXT | ❌ | `receita` ou `despesa` |
| `valor` | INTEGER | ❌ | Valor em centavos (sempre positivo) |
| `descricao` | TEXT | ❌ | Descrição livre (ex: "Mercado") |
| `data_transacao` | TEXT | ❌ | Data efetiva da transação (ISO 8601) |

### Regras importantes

- **Valor sempre positivo** — o sinal é inferido pelo `tipo`
- **Data da transação ≠ data de criação** — usuário pode lançar retroativamente
- **Ao excluir conta**, suas transações são excluídas em cascata
- **Ao tentar excluir categoria com transações**, a operação é bloqueada (`ON DELETE RESTRICT`)

---

## 🔗 Relacionamentos

### Visão geral

```
usuarios 1 ──┬── N contas
             │
             └── N categorias (quando padrao=0)

contas 1 ──── N transacoes

categorias 1 ──── N transacoes
```

### Cardinalidades

| De | Para | Cardinalidade | Descrição |
|---|---|---|---|
| `usuarios` | `contas` | 1:N | Um usuário tem várias contas |
| `usuarios` | `categorias` | 1:N | Um usuário pode ter várias categorias personalizadas |
| `contas` | `transacoes` | 1:N | Uma conta recebe várias transações |
| `categorias` | `transacoes` | 1:N | Uma categoria agrupa várias transações |

### Comportamento ao excluir (ON DELETE)

| Exclusão | Efeito | Motivo |
|---|---|---|
| `usuarios` | `CASCADE` (exclui contas e categorias) | Dados privados do usuário |
| `contas` | `CASCADE` (exclui transações) | Histórico vinculado à conta |
| `categorias` | `RESTRICT` (bloqueia se tiver transações) | Preservar integridade histórica |

---

## 🚀 Índices

Índices aceleram consultas frequentes. Serão criados:

```sql
-- Login rápido por e-mail
CREATE UNIQUE INDEX idx_usuarios_email ON usuarios(email);

-- Listagem de contas por usuário
CREATE INDEX idx_contas_usuario_id ON contas(usuario_id);

-- Transações por conta (listagem principal)
CREATE INDEX idx_transacoes_conta_id ON transacoes(conta_id);

-- Transações por categoria (agrupamentos)
CREATE INDEX idx_transacoes_categoria_id ON transacoes(categoria_id);

-- Ordenação por data (mais comum nas consultas)
CREATE INDEX idx_transacoes_data ON transacoes(data_transacao);

-- Categorias por usuário (listagem de personalizadas)
CREATE INDEX idx_categorias_usuario_id ON categorias(usuario_id);
```

### Quando criar mais índices?

Novos índices podem ser adicionados conforme:
- Queries lentas identificadas em testes de performance (k6)
- Colunas frequentemente usadas em `WHERE` ou `ORDER BY`

---

## 🛡️ Constraints e Validações no Banco

O banco garante **integridade mínima** através de constraints. Validações de negócio mais complexas ficam na camada **service**.

### Constraints no banco

- ✅ `PRIMARY KEY` em todas as tabelas
- ✅ `UNIQUE` em `usuarios.email`
- ✅ `NOT NULL` em campos obrigatórios
- ✅ `CHECK` para valores de enums (`tipo` das contas, categorias, transações)
- ✅ `CHECK (valor > 0)` em transações
- ✅ `FOREIGN KEY` com `ON DELETE` adequado

### Ativação de Foreign Keys no SQLite

**Importante:** SQLite **não ativa foreign keys por padrão**. Toda conexão deve executar:

```sql
PRAGMA foreign_keys = ON;
```

Isso será feito automaticamente em `src/config/database.js`.

---

## 🌱 Seeds — Dados Iniciais

Ao inicializar o banco, serão inseridas **categorias padrão** disponíveis para todos os usuários.

### Categorias de despesa (padrão do sistema)

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

### Categorias de receita (padrão do sistema)

| Nome | Ícone | Tipo |
|---|:---:|---|
| Salário | 💼 | receita |
| Freelance | 💻 | receita |
| Investimentos | 📈 | receita |
| Outros | 💰 | receita |

Todas com `usuario_id = NULL` e `padrao = 1`.

---

## 📌 Considerações sobre SQLite

Algumas particularidades do SQLite que impactam o modelo:

### Tipagem flexível (type affinity)

SQLite permite inserir qualquer tipo em qualquer coluna. A "tipagem" é apenas uma **afinidade**. Por isso:
- Usamos CHECK constraints para simular ENUMs
- Validações de tipo são reforçadas na camada service

### Sem `BOOLEAN` nativo

Usamos `INTEGER` com valores 0/1 + CHECK constraint.

### Sem `DATETIME` nativo

Usamos `TEXT` com formato ISO 8601 + função `datetime('now')` para defaults.

### Uma escrita por vez

SQLite não suporta múltiplas escritas simultâneas. Isso **não é problema** para o escopo do projeto (portfólio, uso individual). Leituras são ilimitadas e paralelas.

### Transactions

SQLite suporta transações nativamente. Operações que envolvem múltiplas tabelas (ex: criar conta + transação inicial) devem usar transação explícita.

---

## 🔮 Evolução Futura

Algumas tabelas já previstas para fases posteriores:

### Fase 2 — Cartões de Crédito
- `cartoes_credito` — limite, fechamento, vencimento
- `faturas` — agrupamento mensal de gastos no cartão

### Fase 3 — Orçamento
- `orcamentos` — limite por categoria em determinado período

### Fase 6 — Admin
- Adição de coluna `perfil` em `usuarios` (`user` / `admin`)
- Tabela `logs_auditoria` para rastreamento de ações administrativas

### Fase 5 — Diferenciais
- `rastreamento_emocional` — estado emocional vinculado à transação
- `historico_precos` — para a funcionalidade de memória de preços

---

## 🔗 Documentos Relacionados

- 📄 [Stack Tecnológica](./stack-tecnologica.md)
- 📄 [Estrutura do Projeto](./estrutura-projeto.md)
- 📄 [Contratos da API](./api-contratos.md) *(próximo documento)*

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
