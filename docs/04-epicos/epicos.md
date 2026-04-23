# 📦 Épicos — Fase 1

> Documento que apresenta os **épicos** da Fase 1 do Provus Finance — os grandes blocos de funcionalidades que, em conjunto, entregam o MVP (Minimum Viable Product) da aplicação.

---

## 📋 Sumário

- [O que é um Épico](#-o-que-é-um-épico)
- [Estrutura de Rastreabilidade](#-estrutura-de-rastreabilidade)
- [Visão Geral dos Épicos](#-visão-geral-dos-épicos)
- [Épico 1 — Gestão de Usuários](#-épico-1--gestão-de-usuários)
- [Épico 2 — Autenticação](#-épico-2--autenticação)
- [Épico 3 — Gestão de Contas](#-épico-3--gestão-de-contas)
- [Épico 4 — Gestão de Categorias](#-épico-4--gestão-de-categorias)
- [Épico 5 — Gestão de Transações](#-épico-5--gestão-de-transações)
- [Ordem de Implementação](#-ordem-de-implementação)
- [Resumo](#-resumo)

---

## 💡 O que é um Épico

Um **épico** é um agrupamento de funcionalidades relacionadas que, em conjunto, entregam valor significativo ao usuário. Ele é:

- **Maior que uma User Story** — não cabe em um sprint único
- **Menor que o produto todo** — tem escopo bem definido
- **Entregável em partes** — pode ser fatiado em múltiplas US

### Hierarquia

```
Produto (Provus Finance)
  └── Fase (Fase 1 — Fundação)
        └── Épico (ex: Gestão de Usuários)
              └── User Story (ex: Cadastrar novo usuário)
                    └── Caso de Teste (ex: Cadastro com e-mail válido)
```

### Para que serve um épico?

- **Organizar** o backlog em blocos gerenciáveis
- **Priorizar** entregas conforme o valor de negócio
- **Rastrear** progresso em alto nível no GitHub Projects
- **Comunicar** com stakeholders sem entrar em detalhes técnicos

---

## 🔗 Estrutura de Rastreabilidade

Cada épico do projeto terá:

- **ID único** (`EP-001` a `EP-005` na Fase 1)
- **User Stories relacionadas** (com seus IDs)
- **Regras de negócio cobertas** (referências aos IDs `RG-`, `RU-`, `RC-`, `RK-`, `RT-`)
- **Label única** no GitHub para agrupar issues

### Sistema de labels no GitHub

| Label | Cor sugerida | Uso |
|---|---|---|
| `epic:usuarios` | 🟦 Azul | Issues do Épico 1 |
| `epic:autenticacao` | 🟪 Roxo | Issues do Épico 2 |
| `epic:contas` | 🟩 Verde | Issues do Épico 3 |
| `epic:categorias` | 🟨 Amarelo | Issues do Épico 4 |
| `epic:transacoes` | 🟧 Laranja | Issues do Épico 5 |
| `fase-1` | ⬜ Cinza | Todas as issues da Fase 1 |
| `documentacao` | 📘 | Issues de docs |
| `api` | 🔧 | Implementação da API |
| `testes` | 🧪 | Testes automatizados |

---

## 🗺️ Visão Geral dos Épicos

A Fase 1 é composta por **5 épicos** que cobrem todo o núcleo funcional do MVP:

| ID | Épico | Valor Entregue | Prioridade |
|:---:|---|---|:---:|
| **EP-001** | Gestão de Usuários | Permitir que pessoas tenham uma conta na aplicação | 🔴 Crítica |
| **EP-002** | Autenticação | Permitir entrada segura no sistema | 🔴 Crítica |
| **EP-003** | Gestão de Contas | Permitir organizar dinheiro em contas | 🟡 Alta |
| **EP-004** | Gestão de Categorias | Permitir classificar transações | 🟡 Alta |
| **EP-005** | Gestão de Transações | Permitir registrar movimentações financeiras | 🔴 Crítica |

### Dependências entre épicos

```
┌─────────────────────┐
│  EP-001: Usuários   │ ◀── Base de tudo
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ EP-002: Autenticação│ ◀── Precisa de usuário
└──────────┬──────────┘
           │
      ┌────┴────┐
      ▼         ▼
┌──────────┐ ┌──────────┐
│EP-003:   │ │EP-004:   │
│ Contas   │ │Categorias│
└─────┬────┘ └────┬─────┘
      │           │
      └─────┬─────┘
            ▼
┌─────────────────────┐
│ EP-005: Transações  │ ◀── Precisa de conta + categoria
└─────────────────────┘
```

---

## 👤 Épico 1 — Gestão de Usuários

![Status](https://img.shields.io/badge/ID-EP--001-blue)
![Prioridade](https://img.shields.io/badge/prioridade-cr%C3%ADtica-red)

### 🎯 Objetivo

Permitir que pessoas criem, consultem, atualizem e excluam contas no Provus Finance.

### 💎 Valor Entregue

Sem usuários, não há produto. Este é o **primeiro passo** para qualquer interação com o sistema — a porta de entrada.

### 🎭 Personas Impactadas

- **Ana** — precisa se cadastrar para começar a controlar gastos
- **Rafael** — precisa se cadastrar para migrar da planilha
- **Sofia** — precisa verificar que o cadastro não exige dados sensíveis

### 📋 Escopo

Este épico cobre:
- ✅ Cadastro de novo usuário
- ✅ Consulta do próprio perfil
- ✅ Atualização de dados do perfil (nome e e-mail)
- ✅ Alteração de senha
- ✅ Exclusão da própria conta (com confirmação)

### ❌ Fora do Escopo

- Reset de senha via e-mail
- Confirmação de e-mail
- Perfil administrativo (fase 6)
- Recuperação de conta excluída

### 📄 User Stories Relacionadas

| ID | Título |
|---|---|
| US-001 | Cadastrar novo usuário |
| US-002 | Consultar próprio perfil |
| US-003 | Atualizar dados do perfil |
| US-004 | Alterar senha |
| US-005 | Excluir própria conta |

> 📄 Detalhamento completo em [`fase-1-fundacao.md`](../05-user-stories/fase-1-fundacao.md).

### 🔗 Regras de Negócio Cobertas

- **RU-001 a RU-049** — Todas as regras de usuário
- **RG-001 a RG-006** — Regras de segurança
- **RG-014 a RG-019** — Regras de validação

### ✅ Critérios de Aceitação do Épico

O épico é considerado **concluído** quando:

- [ ] Todas as user stories estão implementadas
- [ ] Todos os endpoints retornam os códigos HTTP corretos
- [ ] Senhas são armazenadas como hash bcrypt (nunca em texto)
- [ ] Validações de e-mail, senha e nome funcionam corretamente
- [ ] Exclusão de usuário propaga em cascata para contas e categorias
- [ ] Todos os testes de API do domínio passam
- [ ] Documentação Swagger dos endpoints está completa

---

## 🔐 Épico 2 — Autenticação

![Status](https://img.shields.io/badge/ID-EP--002-purple)
![Prioridade](https://img.shields.io/badge/prioridade-cr%C3%ADtica-red)

### 🎯 Objetivo

Permitir que usuários façam login no sistema e obtenham um token de autenticação JWT, garantindo acesso seguro às rotas protegidas.

### 💎 Valor Entregue

Usuário consegue entrar no sistema e acessar seus dados de forma segura. Protege os dados pessoais de acessos não autorizados.

### 🎭 Personas Impactadas

- **Todas** — todas as personas precisam se autenticar antes de usar o sistema
- **Sofia** — em especial, pois valoriza segurança e não quer que seus dados sejam acessados por terceiros

### 📋 Escopo

- ✅ Endpoint de login (`POST /api/auth/login`)
- ✅ Geração de token JWT com payload correto
- ✅ Middleware de validação de token em rotas protegidas
- ✅ Tratamento de token ausente, inválido e expirado
- ✅ Mensagens genéricas em login falho (anti-enumeração)

### ❌ Fora do Escopo

- Refresh token
- Logout com invalidação de token (blacklist)
- Autenticação via OAuth (Google, Facebook)
- Autenticação de dois fatores (2FA)

### 📄 User Stories Relacionadas

| ID | Título |
|---|---|
| US-006 | Autenticar usuário (login) |
| US-007 | Proteger rotas com JWT |
| US-008 | Tratar token ausente ou inválido |

### 🔗 Regras de Negócio Cobertas

- **RU-021 a RU-027** — Regras de autenticação (login)
- **RG-007 a RG-013** — Regras de autenticação e autorização
- **RG-001, RG-002** — Regras de segurança (hash, prepared statements)

### ✅ Critérios de Aceitação do Épico

- [ ] Login retorna token JWT válido com `sub` e `email`
- [ ] Token tem duração configurável (padrão 24h)
- [ ] Credenciais inválidas retornam mensagem genérica (não revela se e-mail existe)
- [ ] Rotas protegidas rejeitam requisições sem token
- [ ] Token expirado, inválido ou malformado retornam 401 com código específico
- [ ] Usuário autenticado só acessa seus próprios recursos
- [ ] Todos os testes de API cobrindo fluxos de autenticação passam

---

## 🏦 Épico 3 — Gestão de Contas

![Status](https://img.shields.io/badge/ID-EP--003-green)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)

### 🎯 Objetivo

Permitir que usuários organizem seu dinheiro em diferentes **contas** (correntes, poupanças, carteiras digitais, dinheiro físico) e acompanhem saldos individuais e consolidados.

### 💎 Valor Entregue

O usuário consegue **mapear sua vida financeira real** no sistema. Um mesmo usuário pode ter contas em bancos diferentes, carteira física e dinheiro separado — tudo organizado e com saldo calculado automaticamente.

### 🎭 Personas Impactadas

- **Rafael** — precisa de múltiplas contas para controlar granularmente (Itaú + Nubank + Investimentos)
- **Ana** — começa com Nubank + Carteira, aos poucos vai mapeando
- **Sofia** — cria contas conforme necessidade, aprecia a clareza dos tipos disponíveis

### 📋 Escopo

- ✅ Criar conta com nome, tipo e saldo inicial
- ✅ Listar contas do usuário (com filtros)
- ✅ Consultar uma conta específica com seu saldo calculado
- ✅ Atualizar nome da conta
- ✅ Desativar conta (soft delete)
- ✅ Endpoint dedicado para consulta de saldo

### ❌ Fora do Escopo

- Transferências entre contas (previsto para fase futura)
- Reativação de contas inativas (previsto para fase futura)
- Cartões de crédito (Fase 2)
- Importação de extratos bancários (fora do escopo permanente)

### 📄 User Stories Relacionadas

| ID | Título |
|---|---|
| US-009 | Criar nova conta |
| US-010 | Listar minhas contas |
| US-011 | Consultar conta específica |
| US-012 | Atualizar dados da conta |
| US-013 | Desativar conta (soft delete) |
| US-014 | Consultar saldo calculado de uma conta |

### 🔗 Regras de Negócio Cobertas

- **RC-001 a RC-054** — Todas as regras de conta
- **RG-047** — Paginação
- **RG-052** — Registros inativos

### ✅ Critérios de Aceitação do Épico

- [ ] Usuário consegue criar contas de todos os 5 tipos
- [ ] Saldo é calculado corretamente em tempo real
- [ ] Tipo e saldo inicial são imutáveis após criação
- [ ] Exclusão é soft delete (não remove do banco)
- [ ] Contas inativas aparecem apenas com filtro explícito
- [ ] Listagem retorna apenas contas do usuário autenticado
- [ ] Todos os testes de API do domínio passam

---

## 🏷️ Épico 4 — Gestão de Categorias

![Status](https://img.shields.io/badge/ID-EP--004-yellow)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)

### 🎯 Objetivo

Permitir que usuários classifiquem suas transações em **categorias**, utilizando tanto as categorias padrão fornecidas pelo sistema quanto categorias personalizadas.

### 💎 Valor Entregue

Sem categorização, transações são apenas listas de números. Com categorias, o usuário **enxerga padrões**: quanto gasta com alimentação, transporte, lazer. É a base para insights financeiros.

### 🎭 Personas Impactadas

- **Ana** — usa categorias padrão do sistema, sem complicação
- **Rafael** — cria categorias detalhadas (ex: "Jogos e Hobbies" separado de "Lazer")
- **Sofia** — aprecia poder ver exatamente onde cada real foi categorizado

### 📋 Escopo

- ✅ Disponibilizar categorias padrão (seed inicial)
- ✅ Criar categoria personalizada
- ✅ Listar categorias acessíveis (padrão + próprias)
- ✅ Consultar categoria específica
- ✅ Atualizar categoria personalizada (nome e ícone)
- ✅ Excluir categoria personalizada (com regras de bloqueio)

### ❌ Fora do Escopo

- Modificar categorias padrão (fica para fase 6 - admin)
- Subcategorias (não previsto)
- Cores personalizadas (apenas emoji como ícone)
- Categorização automática via IA (fora do escopo permanente)

### 📄 User Stories Relacionadas

| ID | Título |
|---|---|
| US-015 | Listar categorias disponíveis |
| US-016 | Criar categoria personalizada |
| US-017 | Consultar categoria específica |
| US-018 | Atualizar categoria personalizada |
| US-019 | Excluir categoria personalizada |

### 🔗 Regras de Negócio Cobertas

- **RK-001 a RK-056** — Todas as regras de categoria
- **RG-047** — Paginação

### ✅ Critérios de Aceitação do Épico

- [ ] Categorias padrão estão disponíveis para todos os usuários
- [ ] Usuário consegue criar, listar, atualizar e excluir categorias pessoais
- [ ] Categorias padrão não podem ser modificadas ou excluídas
- [ ] Compatibilidade entre tipo da categoria e tipo da transação é validada
- [ ] Exclusão de categoria com transações é bloqueada
- [ ] Todos os testes de API do domínio passam

---

## 💰 Épico 5 — Gestão de Transações

![Status](https://img.shields.io/badge/ID-EP--005-orange)
![Prioridade](https://img.shields.io/badge/prioridade-cr%C3%ADtica-red)

### 🎯 Objetivo

Permitir que usuários registrem, consultem, atualizem, filtrem e excluam suas **movimentações financeiras** (receitas e despesas), vinculando-as a contas e categorias.

### 💎 Valor Entregue

Esta é a **funcionalidade central** do Provus Finance. Sem transações, o sistema não cumpre seu propósito. É a partir do histórico de transações que:
- O saldo das contas é calculado
- Os padrões de gasto emergem
- Os relatórios são gerados (fase futura)

### 🎭 Personas Impactadas

- **Ana** — registra gastos rapidamente no celular, quer fluidez
- **Rafael** — lança muitas transações em um mesmo dia, aprecia filtros robustos
- **Sofia** — registra transações com calma, revisa histórico ocasionalmente

### 📋 Escopo

- ✅ Criar nova transação (receita ou despesa)
- ✅ Listar transações do usuário com filtros múltiplos
- ✅ Consultar transação específica
- ✅ Atualizar campos editáveis (valor, descrição, data, categoria)
- ✅ Excluir transação
- ✅ Cálculo de saldo atualizado automaticamente

### ❌ Fora do Escopo

- Transferências entre contas (fase futura)
- Transações recorrentes (fase futura)
- Transações parceladas (fase futura)
- Importação em lote via CSV ou OFX (fora do escopo permanente)
- Cartão de crédito (Fase 2)

### 📄 User Stories Relacionadas

| ID | Título |
|---|---|
| US-020 | Registrar nova transação |
| US-021 | Listar transações com filtros |
| US-022 | Consultar transação específica |
| US-023 | Atualizar transação |
| US-024 | Excluir transação |
| US-025 | Buscar transações por descrição |

### 🔗 Regras de Negócio Cobertas

- **RT-001 a RT-075** — Todas as regras de transação
- **RG-029 a RG-034** — Regras de valores monetários
- **RG-024 a RG-028** — Regras de datas
- **RG-050, RG-051** — Regras de filtros e ordenação

### ✅ Critérios de Aceitação do Épico

- [ ] Usuário consegue registrar receitas e despesas
- [ ] Valor aceita 2 casas decimais e é armazenado em centavos internamente
- [ ] Validações de valor, descrição, data, conta e categoria funcionam
- [ ] Tipo e conta são imutáveis após criação
- [ ] Categoria é alterável
- [ ] Filtros (tipo, conta, categoria, data, busca textual) funcionam combinados
- [ ] Exclusão ajusta o saldo automaticamente
- [ ] Exclusão é hard delete
- [ ] Todos os testes de API do domínio passam

---

## 🎯 Ordem de Implementação

A ordem segue as dependências técnicas dos épicos:

### Sprint 1 — Fundação
1. **EP-001: Gestão de Usuários** (cadastro, perfil, exclusão)
2. **EP-002: Autenticação** (login, JWT, middleware)

> Sem usuários e autenticação, nada mais funciona.

### Sprint 2 — Estruturas de Apoio
3. **EP-003: Gestão de Contas** (criar, listar, atualizar, desativar)
4. **EP-004: Gestão de Categorias** (padrão + personalizadas)

> Contas e categorias são pré-requisitos para transações.

### Sprint 3 — Coração do Sistema
5. **EP-005: Gestão de Transações** (CRUD completo + filtros)

> Entrega o valor principal do produto.

### Observação sobre ordem
Épicos 3 e 4 podem ser trabalhados em **paralelo** no Sprint 2, pois não dependem um do outro diretamente.

---

## 📊 Resumo

### Números da Fase 1

| Métrica | Valor |
|---|:---:|
| **Épicos** | 5 |
| **User Stories estimadas** | 25 |
| **Regras de negócio cobertas** | 286 |
| **Endpoints HTTP** | ~23 |
| **Sprints sugeridos** | 3 |

### Distribuição de user stories por épico

```
EP-001 (Usuários)     ███████         5 US
EP-002 (Autenticação) ████            3 US
EP-003 (Contas)       ███████████     6 US
EP-004 (Categorias)   █████████       5 US
EP-005 (Transações)   ███████████     6 US
```

### Épicos por prioridade

| Prioridade | Épicos |
|---|---|
| 🔴 **Crítica** | EP-001, EP-002, EP-005 |
| 🟡 **Alta** | EP-003, EP-004 |

### Valor acumulado por sprint

- **Sprint 1:** Base de usuários autenticados
- **Sprint 2:** Estruturas prontas para transacionar
- **Sprint 3:** Produto funcional entregando valor real

---

## 🔗 Documentos Relacionados

- 📄 [Visão do Produto](../01-visao/visao-produto.md)
- 📄 [Personas](../01-visao/personas.md)
- 📄 [Regras de Negócio](../02-regras-negocio/)
- 📄 [User Stories — Fase 1](../05-user-stories/fase-1-fundacao.md) *(próximo documento)*

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
