<div align="center">

# Provus Finance

### API REST de Gestao Financeira Pessoal

*Projeto de portfolio focado em testes de software, demonstrando o ciclo completo de desenvolvimento com qualidade — da documentacao de requisitos a automacao de testes de API.*

![CI](https://github.com/HenriquePatti/provus-finance/actions/workflows/tests.yml/badge.svg)
![Status](https://img.shields.io/badge/fase%201-conclu%C3%ADda-brightgreen)
![Testes](https://img.shields.io/badge/testes-159%20passing%20%2B%205%20pending-brightgreen)
![Endpoints](https://img.shields.io/badge/endpoints-22-blue)
![Node](https://img.shields.io/badge/node-20%2B-green)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

---

## Sobre o Projeto

**Provus Finance** e uma API REST de gestao financeira pessoal que permite controlar receitas, despesas, contas bancarias e categorias.

O projeto foi concebido como **portfolio de testes de software**, seguindo as melhores praticas:

- Documentacao completa (visao, regras de negocio, user stories)
- Arquitetura em camadas (controller > service > repository)
- 159 testes automatizados passando + 5 pendentes (bugs conhecidos)
- 160 casos de teste documentados no formato ISO-29119-3
- Documentacao interativa via Swagger/OpenAPI
- Colecao Postman com 109 requests

---

## Inicio Rapido

**Pre-requisitos:** Node.js 20+

```bash
# Clonar e instalar
git clone https://github.com/HenriquePatti/provus-finance.git
cd provus-finance/api
npm install

# Configurar ambiente
# Mac/Linux:
cp .env.example .env
# Windows (cmd):
# copy .env.example .env

# Criar banco e aplicar migrations (inclui 13 categorias padrao)
npm run db:migrate

# Iniciar a API
npm start
```

| Recurso | URL |
|---|---|
| API | `http://localhost:3000` |
| Swagger | `http://localhost:3000/api-docs` |

### Comandos disponiveis

```bash
npm start          # Inicia a API
npm run dev        # Inicia com hot-reload
npm test           # Roda testes (159 passing + 5 pending)
npm run test:report # Gera relatorio HTML (Mochawesome)
npm run db:migrate  # Aplica migrations
npm run db:reset    # Reseta banco e recria
```

---

## Endpoints da API

### Usuarios (EP-001)

| Metodo | Rota | Descricao | Auth |
|---|---|---|:---:|
| POST | `/api/usuarios` | Cadastrar usuario | - |
| GET | `/api/usuarios/me` | Consultar perfil | JWT |
| PUT | `/api/usuarios/me` | Atualizar nome/email | JWT |
| PUT | `/api/usuarios/me/senha` | Alterar senha | JWT |
| DELETE | `/api/usuarios/me` | Excluir conta | JWT |

### Autenticacao (EP-002)

| Metodo | Rota | Descricao | Auth |
|---|---|---|:---:|
| POST | `/api/auth/login` | Login (retorna JWT) | - |

### Contas (EP-003)

| Metodo | Rota | Descricao | Auth |
|---|---|---|:---:|
| POST | `/api/contas` | Criar conta | JWT |
| GET | `/api/contas` | Listar contas | JWT |
| GET | `/api/contas/:id` | Consultar conta + saldo | JWT |
| PUT | `/api/contas/:id` | Atualizar nome | JWT |
| DELETE | `/api/contas/:id` | Desativar (soft delete) | JWT |
| GET | `/api/contas/:id/saldo` | Consultar saldo calculado | JWT |

### Categorias (EP-004)

| Metodo | Rota | Descricao | Auth |
|---|---|---|:---:|
| GET | `/api/categorias` | Listar (padrao + personalizadas) | JWT |
| POST | `/api/categorias` | Criar personalizada | JWT |
| GET | `/api/categorias/:id` | Consultar categoria | JWT |
| PUT | `/api/categorias/:id` | Atualizar nome/icone | JWT |
| DELETE | `/api/categorias/:id` | Excluir personalizada | JWT |

### Transacoes (EP-005)

| Metodo | Rota | Descricao | Auth |
|---|---|---|:---:|
| POST | `/api/transacoes` | Registrar receita/despesa | JWT |
| GET | `/api/transacoes` | Listar com filtros e busca | JWT |
| GET | `/api/transacoes/:id` | Consultar transacao | JWT |
| PUT | `/api/transacoes/:id` | Atualizar valor/descricao/data/categoria | JWT |
| DELETE | `/api/transacoes/:id` | Excluir (hard delete) | JWT |

---

## Testes e Qualidade

### Numeros

| Metrica | Valor |
|---|---|
| Testes automatizados | 159 passing + 5 pending (Mocha + Chai + Supertest) |
| Casos de teste documentados | 160 (ISO-29119-3) |
| Requests Postman | 109 |
| Endpoints cobertos | 22/22 (100%) |
| User Stories cobertas | 25/25 (100%) |

### Executar testes

```bash
# Suite completa (159 passing + 5 pending)
npm test

# Relatorio HTML interativo com graficos
npm run test:report
open reports/mochawesome/provus-finance.html
```

### Ferramentas

| Ferramenta | Uso |
|---|---|
| **Mocha + Chai + Supertest** | Testes automatizados de API |
| **Mochawesome** | Relatorio HTML com graficos |
| **Postman** | Testes manuais e exploratorios |
| **Swagger** | Documentacao interativa da API |

### Rastreabilidade

Cada teste possui rastreabilidade completa:

```
Regra de Negocio (RU/RC/RK/RT/RG)
  > User Story (US-XXX)
    > Caso de Teste (CT-EPXXX-USXXX-YY)  — ISO-29119-3
      > Teste Automatizado (*.test.js)    — Mocha
      > Request Postman                   — Exploratorio
```

Naming dos testes:
```
[CT-EP001-US001-02][US-001][RU-003] deve retornar 409 para e-mail ja cadastrado
```

---

## Stack Tecnologica

### Backend

| Tecnologia | Uso |
|---|---|
| Node.js 20+ | Runtime |
| Express | Framework HTTP |
| SQLite (better-sqlite3) | Banco de dados |
| JWT (jsonwebtoken) | Autenticacao |
| Bcrypt | Hash de senhas |
| Swagger (swagger-jsdoc) | Documentacao da API |

### Testes

| Tecnologia | Uso |
|---|---|
| Mocha | Test runner |
| Chai | Assertions |
| Supertest | Cliente HTTP para testes |
| Mochawesome | Relatorio HTML |
| Postman | Testes manuais |

---

## Estrutura do Projeto

```
provus-finance/
  api/
    database/
      migrations/          # 4 migrations (usuarios, contas, categorias, transacoes)
    src/
      config/              # Database, Swagger
      controllers/         # 4 controllers
      middlewares/          # Auth JWT, tratamento de erros
      repositories/        # 4 repositories (SQL puro)
      routes/              # 5 routers com Swagger inline
      services/            # 4 services (regras de negocio)
      utils/               # Hash, JWT helpers
    tests/
      api/
        auth/              # 9 testes (login)
        usuarios/          # 41 testes + 4 pending (CRUD + senha + exclusao + XSS)
        contas/            # 39 testes (CRUD + soft delete + saldo)
        categorias/        # 33 testes (CRUD + protecao padrao)
        transacoes/        # 40 testes + 1 pending (CRUD + filtros + saldo)
      fixtures/            # Factories de dados de teste
      helpers/             # Database e JWT helpers
  docs/
    01-visao/              # Visao do produto, personas
    02-regras-negocio/     # 286 regras (RU, RC, RK, RT, RG)
    03-arquitetura/        # Stack, modelo de dados, contratos
    04-epicos/             # 5 epicos da Fase 1
    05-user-stories/       # 25 user stories detalhadas
    06-testes/             # Estrategia, plano e 160 casos de teste
  postman/                 # Colecao com 109 requests
```

---

## Documentacao

| Pasta | Conteudo |
|---|---|
| [01 — Visao](./docs/01-visao/) | Produto, problema, personas |
| [02 — Regras de Negocio](./docs/02-regras-negocio/) | 286 regras funcionais e nao-funcionais |
| [03 — Arquitetura](./docs/03-arquitetura/) | Stack, modelo de dados, contratos da API |
| [04 — Epicos](./docs/04-epicos/) | 5 epicos com dependencias e prioridades |
| [05 — User Stories](./docs/05-user-stories/) | 25 US com criterios de aceitacao em Gherkin |
| [06 — Testes](./docs/06-testes/) | Estrategia, plano, 160 CTs (ISO-29119-3), metricas, sessoes exploratorias |

Documentacao completa tambem disponivel na [Wiki do projeto](https://github.com/HenriquePatti/provus-finance/wiki) (31 paginas com navegacao).

---

## CI/CD

Pipeline automatizado via GitHub Actions com 2 jobs:

| Job | Proposito | Status Esperado |
|---|---|---|
| **Suite de Testes** | 159 passing + 5 pending (Node 20 e 22) | Verde |
| **Bugs Conhecidos** | Testes dos bugs #89 e #90 sem skip | Vermelho (esperado) |

Relatorios Mochawesome disponiveis como artefatos em cada execucao.

Ver execucoes: [GitHub Actions](../../actions)

---

## Metricas de Qualidade

| Indicador | Valor |
|---|---|
| Bugs em Producao | 0% |
| Taxa de Reteste | 2.4% |
| Cobertura de Automacao | 99.4% (159/160 CTs) |
| Cobertura de Testes de US | 100% (160/160) |
| Qualidade da Release (QR) | 0.85 |

Detalhes completos em [`docs/06-testes/metricas.md`](./docs/06-testes/metricas.md).

---

## Bugs Conhecidos

| Issue | Descricao | Tipo | Severidade | Status |
|---|---|---|---|---|
| [#89](../../issues/89) | Campos de texto aceitam HTML/JS sem sanitizacao | Melhoria | Media | Planejada (pre-Fase 7) |
| [#90](../../issues/90) | PUT transacao aceito em conta inativa (RT-057) | Bug | Media | Correcao planejada |

Detalhes completos com reproducao e plano de correcao nas issues. Testes automatizados criados (pending) em `api/tests/api/usuarios/xss.test.js` e `api/tests/api/transacoes/conta-inativa.test.js`.

Descobertos via sessoes exploratorias documentadas em `docs/06-testes/sessoes-exploratorias/`.

---

## Roadmap

| Fase | Conteudo | Status |
|:---:|---|:---:|
| **1** | Fundacao: usuarios, autenticacao, contas, categorias, transacoes | Concluida |
| **2** | Gestao de cartao de credito e faturas | Futuro |
| **3** | Orcamento mensal e metas | Futuro |
| **4** | Relatorios e exportacoes | Futuro |
| **5** | Diferenciais (rastreador emocional, simulador) | Futuro |
| **6** | Perfil administrativo (admin) | Futuro |
| **7** | Frontend web | Futuro |

---

## Gestao do Projeto

- **Metodologia**: Kanban
- **Board**: [GitHub Projects](../../projects)
- **Issues**: cada User Story vira uma issue com labels e rastreabilidade
- **Commits**: padrao [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
- **Pull Requests**: labels por epico e tipo (`tipo:api`, `tipo:testes`, `epic:*`)

---

## Licenca

Distribuido sob a licenca MIT. Veja [LICENSE](./LICENSE) para mais informacoes.

---

<div align="center">

**Desenvolvido por [Henrique Patti](https://github.com/HenriquePatti)**

*Foco em qualidade, rastreabilidade e boas praticas de engenharia de software.*

</div>
