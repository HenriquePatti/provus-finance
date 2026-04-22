<div align="center">

# 💰 Provus Finance

### Aplicação de Gestão Financeira Pessoal

*Projeto de portfólio focado em testes de software, demonstrando o ciclo completo de desenvolvimento com qualidade — da documentação de requisitos à automação de testes de API.*

![Status](https://img.shields.io/badge/status-em%20planejamento-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-20%2B-green)

</div>

---

## 📖 Sobre o Projeto

**Provus Finance** é uma aplicação web de gestão financeira pessoal que permite ao usuário controlar receitas, despesas, contas bancárias, categorias e orçamentos mensais.

O projeto foi concebido como **portfólio de testes de software**, seguindo as melhores práticas do mercado:

- 📋 Documentação completa (visão, regras de negócio, user stories)
- 🏗️ Arquitetura em camadas (controller → service → repository)
- 🧪 Foco em testes de API com rastreabilidade total
- 📊 Rastreabilidade entre regras de negócio, user stories e casos de teste
- 🔄 CI/CD automatizado via GitHub Actions

---

## 🎯 Objetivos

### Objetivo principal
Demonstrar domínio técnico em **Quality Assurance (QA)** através de um projeto real, com:
- Elaboração e rastreabilidade de casos de teste
- Automação de testes de API com Mocha, Chai e Supertest
- Documentação profissional de APIs via Swagger/OpenAPI
- Testes manuais e exploratórios com Postman
- Testes de performance com k6
- Pipeline de integração contínua

### Objetivos secundários
- Aplicar **SQL puro** sem abstrações de ORM
- Implementar **autenticação segura** com JWT e boas práticas

---

## 🗂️ Índice da Documentação

A documentação é organizada em pastas numeradas, seguindo a ordem lógica de leitura:

### 📘 [01 — Visão do Produto](./docs/01-visao/)
Descrição do produto, problema que resolve, público-alvo e personas.

### 📗 [02 — Regras de Negócio](./docs/02-regras-negocio/)
Regras funcionais e não-funcionais que governam o comportamento da aplicação.

### 📙 [03 — Arquitetura](./docs/03-arquitetura/)
Stack tecnológica, estrutura do projeto, modelo de dados e contratos da API.

### 📕 [04 — Épicos](./docs/04-epicos/)
Grandes blocos de funcionalidade agrupados por contexto de negócio.

### 📓 [05 — User Stories](./docs/05-user-stories/)
Histórias de usuário detalhadas, organizadas por fase de entrega.

### 📔 [06 — Testes](./docs/06-testes/)
Estratégia de testes, casos de teste e matriz de rastreabilidade.

---

## 🗓️ Fluxo de Desenvolvimento

O projeto segue um fluxo profissional, com fases bem definidas:

```
  ETAPA 1 — PLANEJAMENTO
  ├── Visão do produto
  ├── Regras de negócio
  ├── Arquitetura
  ├── Épicos
  └── User Stories

  ETAPA 2 — DESENVOLVIMENTO DA API
  └── Implementação conforme User Stories

  ETAPA 3 — PLANO DE TESTES
  ├── Estratégia de testes
  ├── Casos de teste derivados das User Stories
  └── Matriz de rastreabilidade

  ETAPA 4 — AUTOMAÇÃO DE TESTES
  ├── Testes de API (Supertest + Mocha + Chai)
  ├── Coleções Postman
  └── Performance com k6
```

---

## 🚧 Roadmap por Fases

| Fase | Conteúdo | Status |
|:---:|---|:---:|
| **1** | Fundação: cadastro, autenticação, contas, transações e categorias | 🔜 Planejamento |
| **2** | Gestão de cartão de crédito e faturas | ⏳ Futuro |
| **3** | Orçamento mensal e metas | ⏳ Futuro |
| **4** | Relatórios e exportações | ⏳ Futuro |
| **5** | Diferenciais (rastreador emocional, memória de preços, simulador) | ⏳ Futuro |
| **6** | Perfil administrativo (admin) | ⏳ Futuro |
| **7** | Frontend web | ⏳ Futuro |

---

## 🛠️ Stack Tecnológica

### Backend
- **Node.js 20+** com **Express**
- **JavaScript puro** (ES Modules)
- **SQLite** via `better-sqlite3` — arquivo em desenvolvimento, memória em testes
- **JWT** (`jsonwebtoken`) para autenticação
- **Bcrypt** para hash de senhas
- **Swagger** (`swagger-jsdoc` + `swagger-ui-express`) para documentação

### Testes
- **Mocha** — test runner
- **Chai** — assertions
- **Supertest** — testes de API
- **Postman** — testes manuais e documentação viva
- **k6** — testes de performance

### Frontend *(fase futura)*
- Stack a definir

### Infraestrutura
- **GitHub Actions** — CI/CD
- **Git / GitHub Projects** — controle de versão e gestão de tarefas

> 📄 Stack completa documentada em [03-arquitetura/stack-tecnologica.md](./docs/03-arquitetura/stack-tecnologica.md)

---

## 🚀 Como Executar *(em breve)*

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/provus-finance.git
cd provus-finance/api

# Instalar dependências
npm install

# Rodar migrations do banco
npm run db:migrate

# Popular dados iniciais
npm run db:seed

# Iniciar a API
npm start
```

A API estará disponível em `http://localhost:3000`.
Documentação Swagger em `http://localhost:3000/api-docs`.

---

## 🧪 Estratégia de Testes

O projeto adota uma estratégia **focada e profissional**: apenas **Testes de API**.

```
        ┌──────────────────────┐
        │    TESTES DE API     │  ← Supertest + Mocha + Chai
        │  (fluxo HTTP total)  │
        └──────────────────────┘
```

### Por que apenas Testes de API?

- ✅ Cobrem regras de negócio via fluxo HTTP real
- ✅ Testam autenticação, autorização, validações e respostas
- ✅ Exercitam banco real (SQLite) em ambiente controlado
- ✅ Código mais simples, sem mocks complexos
- ✅ Foco claro e alinhado ao objetivo de portfólio

### Complementos
- **Postman** — testes manuais, exploratórios e documentação viva da API
- **k6** — testes de performance em rotas críticas

> 📄 Estratégia detalhada em [06-testes/estrategia-testes.md](./docs/06-testes/estrategia-testes.md)

---

## 📊 Gestão do Projeto

- **Metodologia**: Kanban
- **Board**: [GitHub Projects](../../projects)
- **Issues**: cada User Story vira uma issue
- **Commits**: padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
- **Definition of Done**:
  - ✅ Código implementado conforme User Story
  - ✅ Casos de teste de API implementados e passando
  - ✅ Documentação da API atualizada no Swagger
  - ✅ Pull Request revisado e aprovado

---

## 🤝 Contribuição

Este é um projeto de portfólio, mas sugestões e feedbacks são bem-vindos via [Issues](../../issues).

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](./LICENSE) para mais informações.

---

<div align="center">

**Desenvolvido com foco em qualidade e boas práticas de engenharia de software.**

</div>
