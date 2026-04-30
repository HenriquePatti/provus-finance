# 📄 User Stories — EP-003: Gestão de Contas

> Documento com as User Stories do **Épico 3 — Gestão de Contas**, que cobre criação, listagem, consulta, atualização, desativação e consulta de saldo de contas financeiras.

---

## 📋 Sumário

- [Sobre Este Documento](#-sobre-este-documento)
- [Resumo do Épico](#-resumo-do-épico)
- [US-009 — Criar nova conta](#us-009--criar-nova-conta)
- [US-010 — Listar contas do usuário](#us-010--listar-contas-do-usuário)
- [US-011 — Consultar conta específica](#us-011--consultar-conta-específica)
- [US-012 — Atualizar dados da conta](#us-012--atualizar-dados-da-conta)
- [US-013 — Desativar conta (soft delete)](#us-013--desativar-conta-soft-delete)
- [US-014 — Consultar saldo calculado](#us-014--consultar-saldo-calculado)
- [Resumo de Cobertura](#-resumo-de-cobertura)

---

## 📖 Sobre Este Documento

Este documento lista as **User Stories** do EP-003. Cada US é uma unidade de valor independente, rastreável até regras de negócio e pronta para ser transformada em issue no GitHub.

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
| **Épico** | EP-003 — Gestão de Contas |
| **Prioridade** | 🟡 Alta |
| **Sprint** | 2 |
| **User Stories** | 6 |
| **Endpoints envolvidos** | 6 |
| **Regras de negócio cobertas** | RC-001 a RC-054 + regras gerais |

### Lista de User Stories

| ID | Título | Endpoint |
|---|---|---|
| US-009 | Criar nova conta | `POST /api/contas` |
| US-010 | Listar contas do usuário | `GET /api/contas` |
| US-011 | Consultar conta específica | `GET /api/contas/:id` |
| US-012 | Atualizar dados da conta | `PUT /api/contas/:id` |
| US-013 | Desativar conta (soft delete) | `DELETE /api/contas/:id` |
| US-014 | Consultar saldo calculado | `GET /api/contas/:id/saldo` |

---

## US-009 — Criar nova conta

![Épico](https://img.shields.io/badge/épico-EP--003-green)
![Prioridade](https://img.shields.io/badge/prioridade-crítica-red)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** criar uma nova conta financeira informando nome, tipo e saldo inicial,
> **Para que** eu possa organizar meu dinheiro por instituição ou finalidade.

### 🎯 Contexto

Contas são a base da gestão financeira no Provus Finance. Antes de registrar qualquer transação, o usuário precisa ter ao menos uma conta cadastrada. Tipos disponíveis representam a realidade financeira da maioria dos usuários: corrente, poupança, carteira digital, dinheiro físico e investimentos.

**Persona principal:** Rafael (múltiplas contas em diferentes bancos)

### 🔌 Especificação

- **Endpoint:** `POST /api/contas`
- **Autenticação:** ✅ Token JWT obrigatório
- **Corpo da requisição:** `nome`, `tipo`, `saldoInicial` (opcional, padrão 0)

### ✅ Critérios de Aceitação

#### CA-01 — Criação bem-sucedida com dados válidos

```gherkin
Dado que estou autenticado
  E informo nome válido, tipo válido e saldo inicial >= 0
Quando envio a requisição de criação
Então a resposta deve ter status 201
  E o corpo deve conter id, nome, tipo, saldoInicial, ativo e criadoEm
  E a conta deve pertencer ao usuário autenticado
```

#### CA-02 — Tipo inválido rejeitado

```gherkin
Dado que informo um tipo que não existe na lista permitida
Quando envio a requisição
Então a resposta deve ter status 400
  E o erro deve indicar quais tipos são aceitos
```

#### CA-03 — Saldo inicial negativo rejeitado

```gherkin
Dado que informo saldo inicial com valor negativo
Quando envio a requisição
Então a resposta deve ter status 400
  E o erro deve indicar que saldo inicial deve ser >= 0
```

#### CA-04 — Nome obrigatório

```gherkin
Dado que envio a requisição sem o campo nome
Quando o servidor processa a requisição
Então a resposta deve ter status 400
  E o erro deve indicar que nome é obrigatório
```

#### CA-05 — Saldo inicial padrão quando não informado

```gherkin
Dado que envio a requisição sem o campo saldoInicial
Quando a conta é criada com sucesso
Então saldoInicial deve ser 0
```

#### CA-06 — Todos os 5 tipos válidos aceitos

```gherkin
Dado que informo um dos tipos: corrente, poupanca, carteira_digital, dinheiro, investimento
Quando envio a requisição
Então a conta deve ser criada com o tipo informado
```

#### CA-07 — Isolamento entre usuários

```gherkin
Dado que o usuário A criou uma conta
Quando o usuário B lista suas contas
Então a conta do usuário A não deve aparecer para o usuário B
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RC-001 | Conta pertence a um usuário |
| RC-002 | Tipos aceitos: corrente, poupanca, carteira_digital, dinheiro, investimento |
| RC-003 | Saldo inicial deve ser >= 0 |
| RC-004 | Tipo é imutável após criação |
| RC-005 | Saldo inicial é imutável após criação |
| RC-006 | Nome é obrigatório |
| RG-012 | Usuário só acessa seus próprios recursos |

### 🏷️ Labels para a Issue

- `epic:contas`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:critica`

### ✔️ Definition of Done

- [x] Endpoint `POST /api/contas` implementado
- [x] Validações de nome, tipo e saldoInicial funcionando
- [x] Tipo e saldoInicial não alteráveis após criação
- [x] Conta vinculada ao usuário autenticado (req.usuarioId)
- [x] Todos os critérios de aceitação passando
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- Esta é a US de maior prioridade do EP-003 — as demais (US-010 a US-014) dependem de contas existentes
- Saldo calculado em tempo real (US-014) é distinto do saldo inicial — o saldo inicial é apenas o ponto de partida

---

## US-010 — Listar contas do usuário

![Épico](https://img.shields.io/badge/épico-EP--003-green)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** ver a lista das minhas contas financeiras,
> **Para que** eu tenha uma visão consolidada de onde estão distribuídos meus recursos.

### 🎯 Contexto

A listagem de contas é o ponto de entrada da gestão financeira — o usuário precisa saber quais contas existem antes de registrar transações ou consultar saldos. Contas inativas (desativadas via US-013) devem ser ocultadas por padrão, mas acessíveis com filtro explícito.

**Persona principal:** Ana (quer ver rapidamente suas contas ao abrir o app)

### 🔌 Especificação

- **Endpoint:** `GET /api/contas`
- **Autenticação:** ✅ Token JWT obrigatório
- **Query params:** `tipo` (filtro por tipo), `ativo` (true/false, padrão true)

### ✅ Critérios de Aceitação

#### CA-01 — Listagem das contas ativas do usuário

```gherkin
Dado que estou autenticado e tenho contas cadastradas
Quando consulto GET /api/contas
Então a resposta deve ter status 200
  E deve retornar apenas as contas com ativo = true
  E todas as contas devem pertencer ao usuário autenticado
```

#### CA-02 — Filtro por tipo

```gherkin
Dado que tenho contas de diferentes tipos
Quando consulto GET /api/contas?tipo=corrente
Então apenas contas do tipo "corrente" devem ser retornadas
```

#### CA-03 — Incluir contas inativas com filtro explícito

```gherkin
Dado que tenho contas ativas e inativas
Quando consulto GET /api/contas?ativo=false
Então apenas contas com ativo = false devem ser retornadas
```

#### CA-04 — Usuário sem contas retorna lista vazia

```gherkin
Dado que o usuário autenticado não possui nenhuma conta cadastrada
Quando consulto GET /api/contas
Então a resposta deve ter status 200
  E o corpo deve conter uma lista vazia
```

#### CA-05 — Isolamento entre usuários

```gherkin
Dado que o usuário A e o usuário B possuem contas
Quando o usuário A consulta suas contas
Então apenas as contas do usuário A devem ser retornadas
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RC-010 | Listagem retorna apenas contas do usuário autenticado |
| RC-011 | Contas inativas não aparecem na listagem padrão |
| RC-012 | Filtro ?ativo=false expõe contas desativadas |
| RC-013 | Filtro por tipo é opcional |
| RG-012 | Usuário só acessa seus próprios recursos |

### 🏷️ Labels para a Issue

- `epic:contas`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:alta`

### ✔️ Definition of Done

- [x] Endpoint `GET /api/contas` implementado
- [x] Filtragem padrão retorna apenas contas ativas
- [x] Filtro por tipo funcional
- [x] Filtro ?ativo=false funcional
- [x] Lista vazia retorna 200 com array vazio
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

---

## US-011 — Consultar conta específica

![Épico](https://img.shields.io/badge/épico-EP--003-green)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** consultar os detalhes de uma conta específica, incluindo seu saldo calculado atual,
> **Para que** eu possa verificar informações e acompanhar o saldo real daquela conta.

### 🎯 Contexto

Enquanto a listagem (US-010) oferece uma visão geral, esta US permite inspecionar uma conta individualmente. O ponto diferencial é que o **saldo calculado** já está presente neste endpoint — resultado de saldo inicial + receitas - despesas registradas naquela conta.

**Persona principal:** Rafael (quer checar o saldo de uma conta específica antes de registrar uma transação)

### 🔌 Especificação

- **Endpoint:** `GET /api/contas/:id`
- **Autenticação:** ✅ Token JWT obrigatório
- **Path param:** `id` — ID da conta

### ✅ Critérios de Aceitação

#### CA-01 — Consulta bem-sucedida de conta própria

```gherkin
Dado que estou autenticado e possuo uma conta com o ID informado
Quando consulto GET /api/contas/:id
Então a resposta deve ter status 200
  E o corpo deve conter id, nome, tipo, saldoInicial, saldoCalculado, ativo, criadoEm e atualizadoEm
```

#### CA-02 — Conta não encontrada

```gherkin
Dado que informo um ID que não existe
Quando consulto GET /api/contas/:id
Então a resposta deve ter status 404
  E o código do erro deve ser "CONTA_NAO_ENCONTRADA"
```

#### CA-03 — Acesso negado a conta de outro usuário

```gherkin
Dado que informo o ID de uma conta que pertence a outro usuário
Quando consulto GET /api/contas/:id
Então a resposta deve ter status 404
  E o código do erro deve ser "CONTA_NAO_ENCONTRADA"
  E nenhuma informação sobre a conta alheia deve ser exposta
```

#### CA-04 — Saldo calculado reflete transações

```gherkin
Dado que a conta tem saldo inicial de R$ 1.000
  E foram registradas receitas de R$ 500 e despesas de R$ 200
Quando consulto GET /api/contas/:id
Então saldoCalculado deve ser R$ 1.300
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RC-020 | Consulta retorna dados completos da conta incluindo saldo calculado |
| RC-021 | Saldo calculado = saldoInicial + sum(receitas) - sum(despesas) |
| RC-022 | Conta de outro usuário retorna 404 (não 403) — não revela existência |
| RG-012 | Usuário só acessa seus próprios recursos |

### 🏷️ Labels para a Issue

- `epic:contas`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:alta`

### ✔️ Definition of Done

- [x] Endpoint `GET /api/contas/:id` implementado
- [x] Saldo calculado computado em tempo real
- [x] 404 para conta inexistente ou de outro usuário
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

---

## US-012 — Atualizar dados da conta

![Épico](https://img.shields.io/badge/épico-EP--003-green)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** atualizar o nome da minha conta,
> **Para que** eu possa corrigir ou renomear uma conta sem precisar recriá-la.

### 🎯 Contexto

Após criar uma conta, o usuário pode querer renomeá-la (ex: "Nubank" → "Nubank Pessoal"). Apenas o **nome** é editável — tipo e saldo inicial são imutáveis por design, pois alteram a integridade do histórico financeiro.

**Persona principal:** Ana (criou uma conta com nome genérico e quer detalhar)

### 🔌 Especificação

- **Endpoint:** `PUT /api/contas/:id`
- **Autenticação:** ✅ Token JWT obrigatório
- **Corpo da requisição:** `nome`
- **Campos imutáveis:** `tipo`, `saldoInicial`

### ✅ Critérios de Aceitação

#### CA-01 — Atualização bem-sucedida do nome

```gherkin
Dado que estou autenticado e possuo a conta com o ID informado
  E informo um nome válido no corpo da requisição
Quando envio PUT /api/contas/:id
Então a resposta deve ter status 200
  E o corpo deve conter os dados atualizados da conta
  E atualizadoEm deve ser atualizado
```

#### CA-02 — Tentativa de alterar tipo ou saldo inicial ignorada

```gherkin
Dado que envio um body com campos tipo ou saldoInicial
Quando envio PUT /api/contas/:id
Então tipo e saldoInicial originais devem ser preservados
  E apenas o nome deve ser atualizado
```

#### CA-03 — Nome vazio rejeitado

```gherkin
Dado que envio o campo nome como string vazia
Quando envio PUT /api/contas/:id
Então a resposta deve ter status 400
  E o erro deve indicar que nome não pode ser vazio
```

#### CA-04 — Conta de outro usuário não é acessível

```gherkin
Dado que informo o ID de uma conta de outro usuário
Quando envio PUT /api/contas/:id
Então a resposta deve ter status 404
  E a conta do outro usuário não deve ser alterada
```

#### CA-05 — Conta inexistente retorna 404

```gherkin
Dado que informo um ID que não existe
Quando envio PUT /api/contas/:id
Então a resposta deve ter status 404
  E o código do erro deve ser "CONTA_NAO_ENCONTRADA"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RC-030 | Apenas nome é editável após criação |
| RC-031 | Tipo é imutável |
| RC-032 | Saldo inicial é imutável |
| RC-033 | Nome não pode ser vazio |
| RC-034 | atualizadoEm é atualizado no PUT |
| RG-012 | Usuário só acessa seus próprios recursos |

### 🏷️ Labels para a Issue

- `epic:contas`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:alta`

### ✔️ Definition of Done

- [x] Endpoint `PUT /api/contas/:id` implementado
- [x] Apenas nome é atualizado (tipo e saldoInicial ignorados)
- [x] Validação de nome vazio
- [x] 404 para conta inexistente ou de outro usuário
- [x] atualizadoEm atualizado corretamente
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

---

## US-013 — Desativar conta (soft delete)

![Épico](https://img.shields.io/badge/épico-EP--003-green)
![Prioridade](https://img.shields.io/badge/prioridade-media-green)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** desativar uma conta que não utilizo mais,
> **Para que** ela não apareça na minha listagem principal sem que eu perca o histórico de transações associadas.

### 🎯 Contexto

Contas desativadas mantêm todo seu histórico de transações intacto — é um **soft delete** (campo `ativo = false`). Isso respeita a integridade do histórico financeiro: uma transação registrada meses atrás não desaparece porque a conta foi desativada. Reativação está fora do escopo desta fase.

**Persona principal:** Rafael (tinha uma conta de investimentos que encerrou mas não quer perder o histórico)

### 🔌 Especificação

- **Endpoint:** `DELETE /api/contas/:id`
- **Autenticação:** ✅ Token JWT obrigatório
- **Comportamento:** Soft delete — seta `ativo = false`, não remove o registro do banco

### ✅ Critérios de Aceitação

#### CA-01 — Desativação bem-sucedida

```gherkin
Dado que estou autenticado e possuo a conta com o ID informado
Quando envio DELETE /api/contas/:id
Então a resposta deve ter status 204
  E a resposta não deve conter corpo
  E o campo ativo da conta deve ser false no banco
  E as transações associadas devem permanecer intactas
```

#### CA-02 — Conta desativada não aparece na listagem padrão

```gherkin
Dado que desativei uma conta
Quando consulto GET /api/contas
Então a conta desativada não deve aparecer na lista
```

#### CA-03 — Conta desativada acessível com filtro explícito

```gherkin
Dado que desativei uma conta
Quando consulto GET /api/contas?ativo=false
Então a conta desativada deve aparecer na lista
```

#### CA-04 — Conta já inativa retorna erro

```gherkin
Dado que a conta já está desativada
Quando tento desativá-la novamente
Então a resposta deve ter status 400
  E o código do erro deve ser "CONTA_JA_INATIVA"
```

#### CA-05 — Conta inexistente retorna 404

```gherkin
Dado que informo um ID que não existe
Quando envio DELETE /api/contas/:id
Então a resposta deve ter status 404
  E o código do erro deve ser "CONTA_NAO_ENCONTRADA"
```

#### CA-06 — Conta de outro usuário não é acessível

```gherkin
Dado que informo o ID de uma conta de outro usuário
Quando envio DELETE /api/contas/:id
Então a resposta deve ter status 404
  E a conta do outro usuário não deve ser afetada
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RC-040 | Desativação é soft delete (ativo = false) |
| RC-041 | Transações da conta não são excluídas |
| RC-042 | Conta inativa não aparece na listagem padrão |
| RC-043 | Reativação fora do escopo desta fase |
| RG-052 | Registros inativos permanecem no banco |
| RG-012 | Usuário só acessa seus próprios recursos |

### 🏷️ Labels para a Issue

- `epic:contas`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:media`

### ✔️ Definition of Done

- [x] Endpoint `DELETE /api/contas/:id` implementado como soft delete
- [x] Campo `ativo = false` setado no banco (não deleta o registro)
- [x] Conta desativada oculta na listagem padrão
- [x] Conta desativada visível com ?ativo=false
- [x] 404 para conta inexistente ou de outro usuário
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- Diferente de US-005 (excluir conta de usuário que é hard delete), esta operação é soft delete
- Não há endpoint de reativação previsto para esta fase

---

## US-014 — Consultar saldo calculado

![Épico](https://img.shields.io/badge/épico-EP--003-green)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** consultar o saldo atual de uma conta específica calculado a partir das transações reais,
> **Para que** eu saiba exatamente quanto dinheiro tenho disponível naquela conta.

### 🎯 Contexto

Este endpoint dedicado entrega o **saldo calculado em tempo real** de uma conta, sem precisar carregar todos os dados da conta. A fórmula é: `saldo = saldoInicial + sum(receitas) - sum(despesas)`. É um endpoint otimizado para consultas frequentes de saldo, útil para dashboards e widgets.

**Persona principal:** Sofia (verifica o saldo rapidamente antes de tomar decisões financeiras)

### 🔌 Especificação

- **Endpoint:** `GET /api/contas/:id/saldo`
- **Autenticação:** ✅ Token JWT obrigatório
- **Path param:** `id` — ID da conta

### ✅ Critérios de Aceitação

#### CA-01 — Saldo calculado corretamente

```gherkin
Dado que a conta tem saldoInicial = 1000
  E tem receitas totais = 500
  E tem despesas totais = 300
Quando consulto GET /api/contas/:id/saldo
Então a resposta deve ter status 200
  E o campo saldoCalculado deve ser 1200
```

#### CA-02 — Conta sem transações retorna saldo inicial

```gherkin
Dado que a conta não possui transações registradas
Quando consulto GET /api/contas/:id/saldo
Então saldoCalculado deve ser igual ao saldoInicial
```

#### CA-03 — Resposta inclui referência à conta

```gherkin
Dado que consulto o saldo de uma conta válida
Quando analiso o corpo da resposta
Então deve conter contaId, nome e saldoCalculado
```

#### CA-04 — Conta inexistente retorna 404

```gherkin
Dado que informo um ID que não existe
Quando consulto GET /api/contas/:id/saldo
Então a resposta deve ter status 404
  E o código do erro deve ser "CONTA_NAO_ENCONTRADA"
```

#### CA-05 — Conta de outro usuário não acessível

```gherkin
Dado que informo o ID de uma conta de outro usuário
Quando consulto GET /api/contas/:id/saldo
Então a resposta deve ter status 404
  E nenhuma informação da conta alheia deve ser exposta
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RC-050 | Saldo calculado = saldoInicial + sum(receitas) - sum(despesas) |
| RC-051 | Saldo é calculado em tempo real a cada consulta |
| RC-052 | Conta sem transações retorna saldoInicial como saldo |
| RC-053 | Valores armazenados internamente em centavos |
| RG-012 | Usuário só acessa seus próprios recursos |

### 🏷️ Labels para a Issue

- `epic:contas`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:alta`

### ✔️ Definition of Done

- [x] Endpoint `GET /api/contas/:id/saldo` implementado
- [x] Saldo calculado como saldoInicial + receitas - despesas
- [x] Conta sem transações retorna saldo inicial
- [x] 404 para conta inexistente ou de outro usuário
- [x] Testes automatizados escritos e passando
- [x] Documentação Swagger atualizada
- [x] Código revisado via Pull Request
- [x] Branch mergeada na `main`

### 📌 Observações

- O saldo calculado também está disponível no endpoint `GET /api/contas/:id` (US-011), mas este endpoint é dedicado para consultas de saldo isoladas
- Valores monetários armazenados em centavos internamente para evitar erros de ponto flutuante

---

## 📊 Resumo de Cobertura

### Estatísticas

| Métrica | Valor |
|---|---|
| **Total de User Stories** | 6 |
| **Total de Critérios de Aceitação** | 32 |
| **Regras de negócio cobertas** | RC-001 a RC-054 + regras gerais |
| **Endpoints implementados** | 6 |

### Distribuição de Critérios de Aceitação

```
US-009 (Criar):        ████████  7 CAs
US-010 (Listar):       ██████    5 CAs
US-011 (Consultar):    █████     4 CAs
US-012 (Atualizar):    ██████    5 CAs
US-013 (Desativar):    ███████   6 CAs
US-014 (Saldo):        ██████    5 CAs
```

### Cobertura por prioridade

| Prioridade | User Stories |
|---|---|
| 🔴 **Crítica** | US-009 |
| 🟡 **Alta** | US-010, US-011, US-012, US-014 |
| 🟢 **Média** | US-013 |

---

## 🔗 Documentos Relacionados

- 📦 [Épicos da Fase 1](../04-epicos/epicos.md)
- 📄 [Regras de Negócio](../02-regras-negocio/)
- 📄 [Contratos da API](../03-arquitetura/api-contratos.md)
- 📄 [Personas](../01-visao/personas.md)
- 📄 [User Stories — EP-001](ep-001-usuarios.md)
- 📄 [User Stories — EP-002](ep-002-autenticacao.md)

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
