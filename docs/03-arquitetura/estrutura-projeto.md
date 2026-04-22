# 🏗️ Estrutura do Projeto

> Documento que descreve a organização de pastas e arquivos do Provus Finance, explicando a responsabilidade de cada camada e o fluxo de uma requisição pela aplicação.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Estrutura Completa](#-estrutura-completa)
- [Pasta `src/` — Código da Aplicação](#-pasta-src--código-da-aplicação)
- [Pasta `database/` — Banco de Dados](#-pasta-database--banco-de-dados)
- [Pasta `tests/` — Testes Automatizados](#-pasta-tests--testes-automatizados)
- [Pasta `postman/` — Coleções Postman](#-pasta-postman--coleções-postman)
- [Pasta `performance/` — Testes k6](#-pasta-performance--testes-k6)
- [Pasta `docs/` — Documentação](#-pasta-docs--documentação)
- [Arquivos na Raiz](#-arquivos-na-raiz)
- [Fluxo de uma Requisição](#-fluxo-de-uma-requisição)
- [Convenções de Nomenclatura](#-convenções-de-nomenclatura)

---

## 🎯 Visão Geral

O projeto adota uma **arquitetura em camadas** (Layered Architecture), onde cada pasta tem uma responsabilidade clara e única. Esta organização facilita:

- **Manutenção** — cada alteração fica isolada em uma camada
- **Testes** — cada camada pode ser testada de forma focada
- **Escalabilidade** — novas features seguem o mesmo padrão
- **Onboarding** — qualquer dev entende o código rapidamente

### Princípios adotados

1. **Separação de responsabilidades** — cada arquivo faz uma coisa só
2. **Nomenclatura clara** — nomes em português descrevem o domínio
3. **Agrupamento por funcionalidade** — arquivos relacionados ficam juntos
4. **Simplicidade** — sem pastas desnecessárias ou excesso de indireção

---

## 📁 Estrutura Completa

```
provus-finance/
├── api/                          # ← código-fonte da API (criado na Etapa 2)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── swagger.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── usuario.routes.js
│   │   │   ├── conta.routes.js
│   │   │   ├── transacao.routes.js
│   │   │   └── categoria.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── usuario.controller.js
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── usuario.service.js
│   │   │   └── ...
│   │   ├── repositories/
│   │   │   ├── usuario.repository.js
│   │   │   ├── conta.repository.js
│   │   │   └── ...
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── utils/
│   │   │   ├── hash.js
│   │   │   └── jwt.js
│   │   └── app.js
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 001_create_usuarios.sql
│   │   │   ├── 002_create_contas.sql
│   │   │   └── ...
│   │   ├── seeds/
│   │   │   └── categorias_padrao.sql
│   │   ├── schema.sql
│   │   └── provus.db              # banco SQLite (ignorado no git)
│   ├── tests/
│   │   ├── api/
│   │   │   ├── auth.test.js
│   │   │   ├── usuarios.test.js
│   │   │   └── ...
│   │   ├── fixtures/
│   │   │   └── usuarios.js
│   │   └── helpers/
│   │       └── setup.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── postman/                      # coleções de testes manuais
│   └── Provus-Finance.postman_collection.json
│
├── performance/                  # testes de carga com k6
│   └── scripts/
│       └── login-load-test.js
│
├── docs/                         # ← documentação (estamos aqui)
│   ├── 01-visao/
│   ├── 02-regras-negocio/
│   ├── 03-arquitetura/
│   ├── 04-epicos/
│   ├── 05-user-stories/
│   └── 06-testes/
│
├── .github/                      # configurações do GitHub
│   └── workflows/
│       └── ci.yml                # pipeline de testes
│
├── LICENSE
└── README.md
```

---

## 📦 Pasta `src/` — Código da Aplicação

O coração do código-fonte. Cada subpasta representa uma camada da arquitetura.

### `src/config/`

Configurações centralizadas da aplicação.

| Arquivo | Responsabilidade |
|---|---|
| `database.js` | Conexão com SQLite, ativação de foreign keys |
| `swagger.js` | Configuração da documentação OpenAPI |

### `src/routes/`

Define os **endpoints HTTP** e os vincula aos controllers. Nenhuma lógica de negócio aqui.

**Responsabilidade:**
- Mapear URLs para controllers
- Aplicar middlewares (autenticação, validação)
- Agrupar endpoints por recurso

**Padrão de nome:** `<recurso>.routes.js`

### `src/controllers/`

Recebe a requisição HTTP, delega ao service e formata a resposta.

**Responsabilidade:**
- Extrair dados do `req` (body, params, query)
- Chamar o service apropriado
- Montar a resposta (`res.status().json()`)
- Capturar erros e passar ao middleware de erros

**NÃO faz:** regras de negócio, queries SQL, validações complexas.

**Padrão de nome:** `<recurso>.controller.js`

### `src/services/`

Concentra **as regras de negócio** da aplicação. É a camada mais importante.

**Responsabilidade:**
- Validar regras de negócio (ex: "e-mail não pode repetir")
- Orquestrar chamadas a repositories
- Aplicar transformações nos dados
- Lançar erros específicos do domínio

**NÃO faz:** acessar `req`/`res`, executar SQL diretamente.

**Padrão de nome:** `<recurso>.service.js`

### `src/repositories/`

Única camada que **fala com o banco de dados**. Todo SQL fica aqui.

**Responsabilidade:**
- Executar queries SQL via `better-sqlite3`
- Usar **prepared statements** obrigatoriamente
- Retornar objetos JavaScript para os services
- Mapear colunas para propriedades (se necessário)

**NÃO faz:** regras de negócio, validações, lógica de aplicação.

**Padrão de nome:** `<recurso>.repository.js`

### `src/middlewares/`

Funções que interceptam requisições antes de chegarem aos controllers.

| Arquivo | Responsabilidade |
|---|---|
| `auth.middleware.js` | Valida o token JWT e injeta o usuário no `req` |
| `error.middleware.js` | Captura erros e retorna resposta padronizada |

### `src/utils/`

Funções auxiliares genéricas, reutilizáveis em várias partes do código.

| Arquivo | Responsabilidade |
|---|---|
| `hash.js` | Hash e comparação de senhas com bcrypt |
| `jwt.js` | Geração e validação de tokens JWT |

### `src/app.js`

Monta o **aplicativo Express**:
- Registra middlewares globais (cors, helmet, express.json)
- Monta as rotas
- Aplica middleware de erros
- **Exporta** o app (não inicia o servidor)

> ℹ️ A separação `app.js` / `server.js` é essencial para testes — o Supertest precisa importar o `app` sem abrir uma porta.

---

## 🗄️ Pasta `database/` — Banco de Dados

Contém tudo relacionado ao schema e dados do SQLite.

### `database/schema.sql`

Schema completo atual do banco, consolidado em um único arquivo. Serve como referência visual rápida.

### `database/migrations/`

Scripts SQL **versionados e numerados** que criam/alteram estruturas.

**Padrão de nome:** `NNN_descrição.sql` (ex: `001_create_usuarios.sql`)

**Regras:**
- Nunca alterar uma migration já aplicada
- Cada mudança = nova migration incremental
- Executadas em ordem sequencial

### `database/seeds/`

Scripts SQL com **dados iniciais** (categorias padrão, contas de exemplo, etc.).

### `database/provus.db`

Arquivo físico do banco SQLite em desenvolvimento.
**Não é versionado no Git** (está no `.gitignore`).

---

## 🧪 Pasta `tests/` — Testes Automatizados

Segue a estratégia de testes do projeto: **100% Testes de API**.

### `tests/api/`

Todos os testes automatizados ficam aqui. Cada arquivo agrupa testes por recurso.

**Padrão de nome:** `<recurso>.test.js`

**Exemplo:**
```
tests/api/
├── auth.test.js          # login, autenticação
├── usuarios.test.js      # CRUD de usuários
├── contas.test.js        # CRUD de contas
└── transacoes.test.js    # CRUD de transações
```

### `tests/fixtures/`

Dados de exemplo reutilizáveis nos testes (usuários fake, transações mock, etc.).

### `tests/helpers/`

Funções auxiliares para os testes (setup de banco, criação de tokens, limpeza de dados).

| Arquivo | Responsabilidade |
|---|---|
| `setup.js` | Prepara banco em memória antes dos testes, reseta entre testes |

---

## 📮 Pasta `postman/` — Coleções Postman

Coleções Postman **versionadas junto com o código**. Quem clonar o repositório pode importar direto no Postman e testar a API manualmente.

| Arquivo | Responsabilidade |
|---|---|
| `Provus-Finance.postman_collection.json` | Coleção completa com todos os endpoints |

> 💡 A coleção pode ser atualizada conforme novos endpoints são criados.

---

## ⚡ Pasta `performance/` — Testes k6

Scripts de teste de carga e performance usando k6.

```
performance/
└── scripts/
    ├── login-load-test.js
    ├── listagem-transacoes.js
    └── criacao-transacao.js
```

**Tipos de teste:**
- Smoke test — verifica funcionamento básico
- Load test — carga esperada em produção
- Stress test — descobre limite da aplicação

---

## 📚 Pasta `docs/` — Documentação

Toda a documentação do projeto em Markdown, organizada por tema:

| Pasta | Conteúdo |
|---|---|
| `01-visao/` | Visão do produto, personas, problema resolvido |
| `02-regras-negocio/` | Regras funcionais e não funcionais |
| `03-arquitetura/` | Stack, estrutura, modelo de dados, contratos |
| `04-epicos/` | Agrupamentos de funcionalidades |
| `05-user-stories/` | Histórias de usuário por fase |
| `06-testes/` | Estratégia, casos de teste, rastreabilidade |

---

## 📄 Arquivos na Raiz

### `README.md`
Ponto de entrada do repositório. Visão geral, índice, instruções.

### `LICENSE`
Licença MIT do projeto.

### `.gitignore`
Arquivos e pastas **ignorados pelo Git** (serão listados em detalhe no documento de implementação).

Principais ignorados:
- `node_modules/`
- `.env`
- `*.db`, `*.sqlite`
- Logs e arquivos temporários
- Diretórios de IDEs (`.vscode/`, `.idea/`)

### `api/.env.example`
Template das variáveis de ambiente. O usuário copia para `.env` e preenche com seus valores reais.

### `api/package.json`
Manifesto do projeto Node.js com dependências e scripts.

**Scripts principais que usaremos:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "mocha tests/api/**/*.test.js",
    "db:migrate": "node database/run-migrations.js",
    "db:seed": "node database/run-seeds.js"
  }
}
```

### `api/server.js`
Ponto de entrada da aplicação. Importa o `app.js` e chama `listen()` na porta definida.

### `.github/workflows/ci.yml`
Pipeline do GitHub Actions que executa os testes a cada Pull Request.

---

## 🔄 Fluxo de uma Requisição

Exemplo: o cliente faz `POST /api/usuarios` para criar um novo usuário.

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. REQUISIÇÃO                                                    │
│    POST /api/usuarios                                            │
│    Body: { email: "a@b.com", senha: "Senha123!" }                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. app.js                                                        │
│    • Aplica middlewares globais (cors, helmet, json)             │
│    • Encaminha para o router apropriado                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. routes/usuario.routes.js                                      │
│    • Mapeia POST /usuarios → UsuarioController.criar             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. controllers/usuario.controller.js                             │
│    • Extrai { email, senha } do req.body                         │
│    • Chama UsuarioService.criar(email, senha)                    │
│    • Retorna res.status(201).json(usuarioCriado)                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. services/usuario.service.js                                   │
│    • Verifica se e-mail já existe (chama repository)             │
│    • Se existe → lança erro "E-mail já cadastrado"               │
│    • Hash da senha via utils/hash.js                             │
│    • Chama UsuarioRepository.inserir(...)                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. repositories/usuario.repository.js                            │
│    • Executa INSERT via prepared statement                       │
│    • Retorna o usuário criado com ID                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. SQLite (database/provus.db)                                   │
│    • Grava o registro na tabela `usuarios`                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                     (retorno sobe a pilha)
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. RESPOSTA                                                      │
│    HTTP 201 Created                                              │
│    Body: { id: 1, email: "a@b.com", criadoEm: "..." }            │
└─────────────────────────────────────────────────────────────────┘
```

### Por que essa separação importa para testes?

Cada camada pode ser testada separadamente, mas como adotamos **Testes de API**, testamos o fluxo completo via HTTP — desde o passo 1 até o 8. Isso garante que toda a cadeia funciona de ponta a ponta.

---

## 📝 Convenções de Nomenclatura

### Arquivos
- **kebab-case** para múltiplas palavras: `auth.middleware.js`
- **Sufixo da camada**: `.routes`, `.controller`, `.service`, `.repository`, `.middleware`
- **Exceção**: arquivos utilitários curtos — `hash.js`, `jwt.js`

### Variáveis e funções
- **camelCase**: `usuarioAtual`, `buscarPorEmail()`
- **Nomes descritivos em português** — mais claro para o domínio
- **Verbo no início de funções**: `criar`, `atualizar`, `buscar`, `remover`

### Constantes
- **UPPER_SNAKE_CASE**: `TOKEN_EXPIRATION`, `MAX_LOGIN_ATTEMPTS`

### Banco de dados
- **snake_case** para tabelas: `usuarios`, `contas_bancarias`
- **snake_case** para colunas: `criado_em`, `email_verificado`
- **Plural** nos nomes de tabelas: `usuarios` (não `usuario`)

### Endpoints
- **kebab-case** e **plural**: `/api/usuarios`, `/api/contas-bancarias`
- **Prefixo** `/api` em todas as rotas
- **Versionamento** considerado para o futuro: `/api/v1/...`

### Branches Git
- **Prefixo + descrição**: `docs/estrutura-projeto`, `feat/cadastro-usuario`

---

## 🎯 Benefícios dessa Estrutura

- ✅ **Rastreabilidade** — fácil localizar onde uma lógica está
- ✅ **Testabilidade** — cada camada isolada favorece testes focados
- ✅ **Padronização** — novos arquivos seguem o mesmo molde
- ✅ **Escalabilidade** — adicionar novo recurso = replicar o padrão
- ✅ **Reconhecível** — qualquer dev Node.js entende rapidamente
- ✅ **Profissional** — estrutura usada em empresas reais

---

## 🔗 Documentos Relacionados

- 📄 [Stack Tecnológica](./stack-tecnologica.md)
- 📄 [Modelo de Dados](./modelo-dados.md) *(próximo documento)*
- 📄 [Contratos da API](./api-contratos.md) *(em breve)*

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
