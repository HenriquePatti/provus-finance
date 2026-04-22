# 🛠️ Stack Tecnológica

> Documento que descreve todas as tecnologias, bibliotecas e ferramentas utilizadas no Provus Finance, com suas versões, propósitos e justificativas.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Backend](#-backend)
- [Banco de Dados](#-banco-de-dados)
- [Autenticação e Segurança](#-autenticação-e-segurança)
- [Documentação da API](#-documentação-da-api)
- [Testes](#-testes)
- [Infraestrutura e CI/CD](#-infraestrutura-e-cicd)
- [Ferramentas de Desenvolvimento](#-ferramentas-de-desenvolvimento)
- [Frontend (Fase Futura)](#-frontend-fase-futura)
- [Resumo de Versões](#-resumo-de-versões)

---

## 🎯 Visão Geral

A stack foi escolhida com base em três critérios principais:

1. **Foco em testes** — tecnologias que facilitam a criação e execução de testes de API
2. **Simplicidade** — evitar complexidade desnecessária (sem ORM, sem TypeScript, sem Docker)
3. **Padrão de mercado** — ferramentas amplamente adotadas em projetos profissionais de QA

---

## 🟢 Backend

### Node.js

| Item | Valor |
|---|---|
| **Versão** | 20.x LTS (ou superior) |
| **Propósito** | Runtime JavaScript para servidor |
| **Site oficial** | https://nodejs.org/ |

**Por que Node.js?**
- Runtime JavaScript mais popular no mercado
- Ecossistema npm gigantesco
- Excelente suporte a testes de API
- Startup rápido, ideal para projetos de portfólio

**Como verificar a versão:**
```bash
node --version
# Deve retornar: v20.x.x ou superior
```

---

### Express

| Item | Valor |
|---|---|
| **Versão** | 4.x |
| **Propósito** | Framework web para criar a API REST |
| **Pacote npm** | `express` |
| **Site oficial** | https://expressjs.com/ |

**Por que Express?**
- Framework web mais popular do ecossistema Node
- Minimalista e flexível
- Excelente integração com Supertest para testes de API
- Amplamente documentado e suportado

---

### JavaScript Puro (ES Modules)

| Item | Valor |
|---|---|
| **Versão** | ECMAScript 2022+ |
| **Sintaxe** | `import` / `export` (ES Modules) |

**Por que JavaScript puro em vez de TypeScript?**
- Sem etapa de build/transpilação → desenvolvimento mais rápido
- Menor complexidade de configuração
- Testes mais diretos e legíveis
- Alinhado ao objetivo de portfólio (foco em testes, não em tipagem)

---

## 🗄️ Banco de Dados

### SQLite

| Item | Valor |
|---|---|
| **Versão** | 3.x |
| **Driver** | `better-sqlite3` |
| **Pacote npm** | `better-sqlite3` |
| **Site oficial** | https://www.sqlite.org/ |
| **Repositório do driver** | https://github.com/WiseLibs/better-sqlite3 |

**Por que SQLite com `better-sqlite3`?**
- Sem instalação externa — tudo via npm
- API síncrona e simples (sem callbacks ou promises desnecessárias)
- Performance superior a outros drivers SQLite para Node
- Suporta **prepared statements** (essencial para segurança)
- Permite rodar em **arquivo** (desenvolvimento) ou em **memória** (testes)

**Estratégia de uso:**

| Ambiente | Modo | Arquivo |
|---|---|---|
| Desenvolvimento | Arquivo | `./database/provus.db` |
| Testes | Memória | `:memory:` |

**Limitações conhecidas:**
- Não suporta `ENUM` nativo → usaremos `CHECK constraints`
- Datas armazenadas como `TEXT` em formato ISO 8601
- Apenas uma escrita por vez (milhares de leituras simultâneas)
- `BOOLEAN` representado como `INTEGER` (0 ou 1)
- Foreign keys precisam ser ativadas manualmente (`PRAGMA foreign_keys = ON`)

---

## 🔐 Autenticação e Segurança

### jsonwebtoken (JWT)

| Item | Valor |
|---|---|
| **Pacote npm** | `jsonwebtoken` |
| **Versão** | 9.x |
| **Propósito** | Geração e validação de tokens JWT |
| **Repositório** | https://github.com/auth0/node-jsonwebtoken |

**Por que JWT?**
- Padrão de autenticação stateless (sem sessão no servidor)
- Amplamente usado em APIs REST
- Gera casos de teste ricos (token válido, expirado, malformado, assinatura inválida)

---

### bcrypt

| Item | Valor |
|---|---|
| **Pacote npm** | `bcrypt` |
| **Versão** | 5.x |
| **Propósito** | Hash seguro de senhas |
| **Repositório** | https://github.com/kelektiv/node.bcrypt.js |

**Por que bcrypt?**
- Algoritmo consolidado para hash de senhas
- Inclui *salt* automático (protege contra rainbow tables)
- Custo de hash configurável (adaptável ao hardware futuro)
- Padrão de mercado para Node.js

---

### cors

| Item | Valor |
|---|---|
| **Pacote npm** | `cors` |
| **Versão** | 2.x |
| **Propósito** | Habilitar Cross-Origin Resource Sharing |

**Necessário porque:** quando o frontend for integrado (fase futura), estará em domínio/porta diferente da API.

---

### helmet

| Item | Valor |
|---|---|
| **Pacote npm** | `helmet` |
| **Versão** | 7.x |
| **Propósito** | Headers HTTP de segurança |

**Aplicado automaticamente:**
- `X-Frame-Options`
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `Content-Security-Policy`
- Entre outros

---

### dotenv

| Item | Valor |
|---|---|
| **Pacote npm** | `dotenv` |
| **Versão** | 16.x |
| **Propósito** | Carregar variáveis de ambiente do arquivo `.env` |

**Variáveis que usaremos:**
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=<chave-secreta-gerada>
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=10
DATABASE_PATH=./database/provus.db
```

---

## 📘 Documentação da API

### Swagger (OpenAPI 3.0)

| Pacote | Versão | Propósito |
|---|---|---|
| `swagger-jsdoc` | 6.x | Gera especificação OpenAPI a partir de comentários JSDoc no código |
| `swagger-ui-express` | 5.x | Serve a interface web interativa do Swagger |

**Acesso:** `http://localhost:3000/api-docs`

**Por que Swagger?**
- Padrão OpenAPI adotado pela indústria
- Interface interativa para testar endpoints
- Funciona como documentação viva (sempre sincronizada com o código)
- Excelente vitrine no portfólio

---

## 🧪 Testes

A estratégia adotada é **100% Testes de API** — mais detalhes em [`06-testes/estrategia-testes.md`](../06-testes/estrategia-testes.md).

### Mocha

| Item | Valor |
|---|---|
| **Pacote npm** | `mocha` |
| **Versão** | 10.x |
| **Propósito** | Test runner (executor de testes) |
| **Site oficial** | https://mochajs.org/ |

**Por que Mocha?**
- Test runner mais tradicional e estável do ecossistema Node
- Sintaxe BDD clara (`describe` / `it`)
- Suporte completo a async/await
- Integração nativa com Chai e Supertest

---

### Chai

| Item | Valor |
|---|---|
| **Pacote npm** | `chai` |
| **Versão** | 5.x |
| **Propósito** | Biblioteca de assertions |
| **Site oficial** | https://www.chaijs.com/ |

**Estilos de assertion disponíveis:**
- `expect` — o mais expressivo, será o padrão do projeto
- `should` — estende protótipos (evitar)
- `assert` — estilo Node.js

**Exemplo:**
```javascript
expect(response.status).to.equal(201);
expect(response.body).to.have.property('id');
expect(response.body.email).to.equal('teste@provus.com');
```

---

### Supertest

| Item | Valor |
|---|---|
| **Pacote npm** | `supertest` |
| **Versão** | 7.x |
| **Propósito** | Cliente HTTP para testar APIs Express |
| **Repositório** | https://github.com/ladjs/supertest |

**Por que Supertest?**
- Projetado especificamente para testar apps Express
- API fluente e legível
- Não precisa subir o servidor em porta (testa em memória)
- Integração perfeita com Mocha e Chai

**Exemplo:**
```javascript
const response = await request(app)
  .post('/api/usuarios')
  .send({ email: 'teste@provus.com', senha: 'Senha123!' });
```

---

### Postman

| Item | Valor |
|---|---|
| **Tipo** | Ferramenta desktop/web |
| **Propósito** | Testes manuais e exploratórios |
| **Site oficial** | https://www.postman.com/ |

**Uso no projeto:**
- Coleções versionadas em `/postman/` no repositório
- Documentação interativa da API
- Testes exploratórios durante desenvolvimento
- Apresentação visual dos fluxos no portfólio

> ℹ️ As coleções **não serão executadas via Newman** no CI. O Postman será utilizado exclusivamente para testes manuais. A automação fica por conta do Mocha + Supertest.

---

### k6

| Item | Valor |
|---|---|
| **Tipo** | CLI (instalado separadamente) |
| **Propósito** | Testes de performance e carga |
| **Site oficial** | https://k6.io/ |

**Uso no projeto:**
- Scripts em `/performance/` no repositório
- Benchmarks de rotas críticas (autenticação, listagem de transações)
- Testes de carga e stress
- Geração de relatórios HTML

---

## 🚀 Infraestrutura e CI/CD

### GitHub Actions

| Item | Valor |
|---|---|
| **Tipo** | Serviço nativo do GitHub |
| **Propósito** | Integração contínua e automação de testes |

**Workflows planejados:**
- **CI** — a cada Pull Request:
  - Instalar dependências
  - Rodar testes de API
  - Validar lint
- **Publicação de Docs** — a cada merge na main *(opcional)*

---

### Git / GitHub

| Item | Valor |
|---|---|
| **Propósito** | Controle de versão e hospedagem |
| **Padrão de commits** | [Conventional Commits](https://www.conventionalcommits.org/pt-br) |
| **Padrão de branches** | `docs/`, `feat/`, `fix/`, `test/`, `chore/`, `refactor/` |

**Fluxo adotado:** [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)
1. Criar branch a partir da `main`
2. Commits seguindo Conventional Commits
3. Abrir Pull Request
4. Merge com squash na `main`
5. Deletar branch

**Proteção da `main`:**
- Push direto bloqueado
- Pull Request obrigatório
- Force push bloqueado
- Deleção da `main` bloqueada

---

## 🔧 Ferramentas de Desenvolvimento

### Nodemon

| Item | Valor |
|---|---|
| **Pacote npm** | `nodemon` |
| **Versão** | 3.x |
| **Propósito** | Reinicia o servidor automaticamente ao salvar arquivos |
| **Escopo** | `devDependencies` |

---

### ESLint *(opcional)*

| Item | Valor |
|---|---|
| **Pacote npm** | `eslint` |
| **Versão** | 9.x |
| **Propósito** | Linter — padroniza estilo de código |
| **Escopo** | `devDependencies` |

> Configuração e regras específicas serão definidas no momento da implementação.

---

## 🎨 Frontend (Fase Futura)

O frontend será decidido e documentado **na fase 7**. Candidatos atuais:

- **React + Vite** — leve, rápido, padrão moderno
- **Vue 3** — curva de aprendizado menor

A decisão final considerará:
- Maturidade do ecossistema de testes E2E
- Integração com Cypress
- Facilidade de integração com a API

---

## 📊 Resumo de Versões

### Produção (`dependencies`)

| Pacote | Versão | Finalidade |
|---|---|---|
| `express` | ^4.19.0 | Framework web |
| `better-sqlite3` | ^11.0.0 | Driver SQLite |
| `jsonwebtoken` | ^9.0.2 | Tokens JWT |
| `bcrypt` | ^5.1.1 | Hash de senhas |
| `cors` | ^2.8.5 | CORS |
| `helmet` | ^7.1.0 | Segurança HTTP |
| `dotenv` | ^16.4.0 | Variáveis de ambiente |
| `swagger-jsdoc` | ^6.2.8 | Geração OpenAPI |
| `swagger-ui-express` | ^5.0.0 | Interface Swagger |

### Desenvolvimento (`devDependencies`)

| Pacote | Versão | Finalidade |
|---|---|---|
| `mocha` | ^10.4.0 | Test runner |
| `chai` | ^5.1.0 | Assertions |
| `supertest` | ^7.0.0 | Testes HTTP |
| `nodemon` | ^3.1.0 | Hot reload |

### Ferramentas Externas

| Ferramenta | Instalação |
|---|---|
| Node.js 20+ | https://nodejs.org/ |
| Git | https://git-scm.com/ |
| Postman | https://www.postman.com/downloads/ |
| k6 | https://k6.io/docs/getting-started/installation/ |
| VS Code *(recomendado)* | https://code.visualstudio.com/ |

---

## 🔗 Referências Oficiais

- [Documentação do Node.js](https://nodejs.org/docs/)
- [Documentação do Express](https://expressjs.com/pt-br/)
- [Documentação do better-sqlite3](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
- [Especificação OpenAPI 3.0](https://swagger.io/specification/)
- [Mocha — Getting Started](https://mochajs.org/#getting-started)
- [Chai — Assertions](https://www.chaijs.com/api/bdd/)
- [Supertest — API](https://github.com/ladjs/supertest#api)
- [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)
- [Conventional Commits](https://www.conventionalcommits.org/pt-br)

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
