# 🌐 Contratos da API

> Documento que define os padrões, convenções e contratos da API REST do Provus Finance — estrutura de requisições, respostas, códigos HTTP, autenticação e tratamento de erros.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Convenções Gerais](#-convenções-gerais)
- [Estrutura de Respostas](#-estrutura-de-respostas)
- [Códigos HTTP Utilizados](#-códigos-http-utilizados)
- [Tratamento de Erros](#-tratamento-de-erros)
- [Autenticação](#-autenticação)
- [Paginação](#-paginação)
- [Filtros e Ordenação](#-filtros-e-ordenação)
- [Endpoints da Fase 1](#-endpoints-da-fase-1)
- [Headers Padrão](#-headers-padrão)
- [Formato de Datas e Valores](#-formato-de-datas-e-valores)
- [Versionamento](#-versionamento)
- [Documentação Swagger](#-documentação-swagger)

---

## 🎯 Visão Geral

A API do Provus Finance segue o estilo **REST** com dados em formato **JSON**.

### Princípios adotados

1. **Previsibilidade** — todas as rotas seguem o mesmo padrão
2. **Códigos HTTP semânticos** — status codes refletem o resultado real
3. **Respostas consistentes** — mesma estrutura em sucesso e erro
4. **Mensagens em português** — alinhado ao público-alvo
5. **Sem ambiguidade** — um erro tem um código e uma mensagem clara

### URL base

```
http://localhost:3000/api
```

Todos os endpoints começam com o prefixo `/api`.

---

## 📐 Convenções Gerais

### URLs

- **Letras minúsculas** e **kebab-case**
- **Recursos no plural**
- **Sem verbos na URL** (a ação é indicada pelo método HTTP)

**Exemplos:**

| ✅ Correto | ❌ Incorreto |
|---|---|
| `GET /api/usuarios` | `GET /api/Usuarios` |
| `GET /api/usuarios/5` | `GET /api/getUsuario/5` |
| `GET /api/contas/1/transacoes` | `GET /api/contas/1/getTransacoes` |

### Métodos HTTP

| Método | Uso |
|---|---|
| `GET` | Consulta (não altera estado) |
| `POST` | Criação de recurso |
| `PUT` | Atualização completa |
| `PATCH` | Atualização parcial |
| `DELETE` | Remoção |

### Nomenclatura nas requisições e respostas

- **camelCase** nos campos JSON (padrão JavaScript)
- **Nomes descritivos em português** alinhados ao domínio

**Exemplo de objeto JSON:**
```json
{
  "id": 1,
  "nomeCompleto": "Maria Silva",
  "email": "maria@provus.com",
  "criadoEm": "2026-04-22T10:30:00.000Z"
}
```

---

## 📤 Estrutura de Respostas

### Resposta de sucesso — Objeto único

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@provus.com"
}
```

Em criação, atualização ou consulta unitária, retorna **o próprio recurso**.

### Resposta de sucesso — Listagem

```json
{
  "dados": [
    { "id": 1, "nome": "Nubank" },
    { "id": 2, "nome": "Itaú" }
  ],
  "paginacao": {
    "pagina": 1,
    "porPagina": 20,
    "total": 2,
    "totalPaginas": 1
  }
}
```

### Resposta de erro

```json
{
  "erro": {
    "codigo": "EMAIL_JA_CADASTRADO",
    "mensagem": "Já existe um usuário com esse e-mail."
  }
}
```

### Resposta de erro com detalhes de validação

```json
{
  "erro": {
    "codigo": "VALIDACAO",
    "mensagem": "Existem campos inválidos na requisição.",
    "detalhes": [
      { "campo": "email", "problema": "Formato de e-mail inválido." },
      { "campo": "senha", "problema": "Deve ter no mínimo 8 caracteres." }
    ]
  }
}
```

---

## 🚦 Códigos HTTP Utilizados

### Sucesso (2xx)

| Código | Nome | Quando usar |
|:---:|---|---|
| `200` | OK | Consulta bem-sucedida ou atualização |
| `201` | Created | Recurso criado com sucesso |
| `204` | No Content | Exclusão bem-sucedida (sem body na resposta) |

### Erro do cliente (4xx)

| Código | Nome | Quando usar |
|:---:|---|---|
| `400` | Bad Request | Requisição mal formada ou dados inválidos |
| `401` | Unauthorized | Token ausente, inválido ou expirado |
| `403` | Forbidden | Autenticado, mas sem permissão para o recurso |
| `404` | Not Found | Recurso não encontrado |
| `409` | Conflict | Conflito com estado atual (ex: e-mail duplicado) |
| `422` | Unprocessable Entity | Regra de negócio violada |

### Erro do servidor (5xx)

| Código | Nome | Quando usar |
|:---:|---|---|
| `500` | Internal Server Error | Erro inesperado no servidor |

### Decisão entre 400, 409 e 422

| Situação | Código |
|---|:---:|
| Campo com formato inválido (ex: e-mail sem `@`) | `400` |
| Campo obrigatório ausente | `400` |
| Tentativa de criar recurso duplicado (ex: e-mail já existe) | `409` |
| Regra de negócio violada (ex: transação com valor zero) | `422` |

---

## ❌ Tratamento de Erros

### Estrutura padrão

Todo erro retorna a mesma estrutura:

```json
{
  "erro": {
    "codigo": "IDENTIFICADOR_EM_MAIUSCULAS",
    "mensagem": "Descrição amigável do erro."
  }
}
```

### Catálogo de códigos de erro

Cada erro tem um **código único** que permite tratamento programático no cliente.

#### Erros de autenticação

| Código | HTTP | Descrição |
|---|:---:|---|
| `TOKEN_AUSENTE` | 401 | Header Authorization não foi enviado |
| `TOKEN_INVALIDO` | 401 | Token JWT é inválido ou mal formado |
| `TOKEN_EXPIRADO` | 401 | Token JWT expirou |
| `CREDENCIAIS_INVALIDAS` | 401 | E-mail ou senha incorretos |

#### Erros de validação

| Código | HTTP | Descrição |
|---|:---:|---|
| `VALIDACAO` | 400 | Um ou mais campos são inválidos (ver `detalhes`) |
| `CAMPO_OBRIGATORIO` | 400 | Campo obrigatório não foi enviado |
| `FORMATO_INVALIDO` | 400 | Formato do valor é inválido |

#### Erros de recurso

| Código | HTTP | Descrição |
|---|:---:|---|
| `RECURSO_NAO_ENCONTRADO` | 404 | O recurso solicitado não existe |
| `USUARIO_NAO_ENCONTRADO` | 404 | Usuário específico não encontrado |
| `CONTA_NAO_ENCONTRADA` | 404 | Conta específica não encontrada |

#### Erros de conflito

| Código | HTTP | Descrição |
|---|:---:|---|
| `EMAIL_JA_CADASTRADO` | 409 | E-mail já está em uso por outro usuário |
| `CATEGORIA_EM_USO` | 409 | Categoria não pode ser excluída pois possui transações |

#### Erros de regra de negócio

| Código | HTTP | Descrição |
|---|:---:|---|
| `VALOR_INVALIDO` | 422 | Valor da transação é inválido (zero, negativo ou muito alto) |
| `CATEGORIA_INCOMPATIVEL` | 422 | Categoria não suporta o tipo de transação informado |
| `CONTA_INATIVA` | 422 | Conta está inativa e não aceita novas transações |

#### Erros de autorização

| Código | HTTP | Descrição |
|---|:---:|---|
| `ACESSO_NEGADO` | 403 | Usuário não tem permissão sobre o recurso |

#### Erros de servidor

| Código | HTTP | Descrição |
|---|:---:|---|
| `ERRO_INTERNO` | 500 | Erro inesperado no servidor |

> ℹ️ Esta lista pode ser expandida conforme novas regras forem criadas, sempre mantendo padronização.

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)** com autenticação via **Bearer Token**.

### Fluxo de autenticação

```
1. Cliente envia credenciais    →  POST /api/auth/login
2. Servidor valida e retorna    ←  { token: "eyJhbGc..." }
3. Cliente envia token no header  →  Authorization: Bearer eyJhbGc...
4. Servidor valida e processa     ←  (resposta do endpoint)
```

### Header de autenticação

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Estrutura do token (payload)

```json
{
  "sub": 1,
  "email": "maria@provus.com",
  "iat": 1714000000,
  "exp": 1714086400
}
```

| Campo | Descrição |
|---|---|
| `sub` | ID do usuário (subject) |
| `email` | E-mail do usuário |
| `iat` | Issued at (timestamp de emissão) |
| `exp` | Expiration (timestamp de expiração) |

### Duração do token

- **Padrão:** 24 horas
- Configurável via `JWT_EXPIRES_IN` no `.env`

### Rotas públicas (sem autenticação)

- `POST /api/usuarios` — cadastro
- `POST /api/auth/login` — login
- `GET /api-docs` — documentação Swagger
- `GET /api/health` — health check

### Rotas autenticadas

**Todas as demais** requerem token válido. Caso contrário:

```json
HTTP 401 Unauthorized

{
  "erro": {
    "codigo": "TOKEN_AUSENTE",
    "mensagem": "Token de autenticação não foi enviado."
  }
}
```

---

## 📄 Paginação

Todas as listagens suportam paginação via **query parameters**.

### Parâmetros aceitos

| Parâmetro | Tipo | Padrão | Descrição |
|---|---|:---:|---|
| `pagina` | número | `1` | Número da página |
| `porPagina` | número | `20` | Itens por página (máx: 100) |

### Exemplo de requisição

```
GET /api/transacoes?pagina=2&porPagina=10
```

### Estrutura da resposta

```json
{
  "dados": [ ... ],
  "paginacao": {
    "pagina": 2,
    "porPagina": 10,
    "total": 47,
    "totalPaginas": 5
  }
}
```

---

## 🔍 Filtros e Ordenação

### Filtros

Aplicados via **query parameters** específicos de cada recurso.

**Exemplo:**
```
GET /api/transacoes?tipo=despesa&contaId=3&de=2026-04-01&ate=2026-04-30
```

### Ordenação

Via parâmetros `ordenarPor` e `ordem`.

| Parâmetro | Valores |
|---|---|
| `ordenarPor` | nome da coluna (ex: `dataTransacao`) |
| `ordem` | `asc` ou `desc` (padrão: `desc`) |

**Exemplo:**
```
GET /api/transacoes?ordenarPor=dataTransacao&ordem=desc
```

---

## 🚀 Endpoints da Fase 1

Lista dos endpoints planejados para a primeira fase. As regras específicas (validações, respostas, exceções) serão detalhadas nas **User Stories**.

### 🔐 Autenticação

| Método | Rota | Descrição | Auth |
|:---:|---|---|:---:|
| `POST` | `/api/auth/login` | Autentica usuário e retorna JWT | ❌ |

### 👤 Usuários

| Método | Rota | Descrição | Auth |
|:---:|---|---|:---:|
| `POST` | `/api/usuarios` | Cadastra um novo usuário | ❌ |
| `GET` | `/api/usuarios/me` | Retorna dados do usuário autenticado | ✅ |
| `PUT` | `/api/usuarios/me` | Atualiza dados do usuário autenticado | ✅ |
| `PUT` | `/api/usuarios/me/senha` | Altera a senha do usuário autenticado | ✅ |
| `DELETE` | `/api/usuarios/me` | Remove o usuário autenticado | ✅ |

### 🏦 Contas

| Método | Rota | Descrição | Auth |
|:---:|---|---|:---:|
| `GET` | `/api/contas` | Lista contas do usuário | ✅ |
| `POST` | `/api/contas` | Cria uma nova conta | ✅ |
| `GET` | `/api/contas/:id` | Busca conta por ID | ✅ |
| `PUT` | `/api/contas/:id` | Atualiza uma conta | ✅ |
| `DELETE` | `/api/contas/:id` | Remove (soft delete) uma conta | ✅ |
| `GET` | `/api/contas/:id/saldo` | Retorna o saldo atual calculado | ✅ |

### 🏷️ Categorias

| Método | Rota | Descrição | Auth |
|:---:|---|---|:---:|
| `GET` | `/api/categorias` | Lista categorias (padrão + personalizadas) | ✅ |
| `POST` | `/api/categorias` | Cria uma categoria personalizada | ✅ |
| `GET` | `/api/categorias/:id` | Busca categoria por ID | ✅ |
| `PUT` | `/api/categorias/:id` | Atualiza uma categoria personalizada | ✅ |
| `DELETE` | `/api/categorias/:id` | Remove categoria personalizada (se sem transações) | ✅ |

### 💰 Transações

| Método | Rota | Descrição | Auth |
|:---:|---|---|:---:|
| `GET` | `/api/transacoes` | Lista transações (com filtros) | ✅ |
| `POST` | `/api/transacoes` | Cria uma nova transação | ✅ |
| `GET` | `/api/transacoes/:id` | Busca transação por ID | ✅ |
| `PUT` | `/api/transacoes/:id` | Atualiza uma transação | ✅ |
| `DELETE` | `/api/transacoes/:id` | Remove uma transação | ✅ |

### 🩺 Sistema

| Método | Rota | Descrição | Auth |
|:---:|---|---|:---:|
| `GET` | `/api/health` | Verifica se a API está online | ❌ |

---

## 📑 Headers Padrão

### Requisições

| Header | Valor | Obrigatório? |
|---|---|:---:|
| `Content-Type` | `application/json` | ✅ (em POST/PUT/PATCH) |
| `Authorization` | `Bearer <token>` | ✅ (rotas autenticadas) |

### Respostas

Todas as respostas incluem:
```http
Content-Type: application/json; charset=utf-8
```

---

## 📅 Formato de Datas e Valores

### Datas

Todas as datas seguem o padrão **ISO 8601 em UTC**:

```
2026-04-22T15:30:00.000Z
```

Aplicável tanto em **entrada** (body, query) quanto em **saída** (resposta).

### Valores monetários

Valores são sempre retornados em **reais (decimal)** na API — a conversão de centavos é feita internamente.

**Exemplo de resposta:**
```json
{
  "valor": 1234.56
}
```

**Observação:** o armazenamento interno é em centavos (`123456`), mas a API expõe em reais para facilitar integração.

---

## 📦 Versionamento

### Estratégia atual

A API **não usa versionamento** no momento. O prefixo continua sendo `/api`.

### Evolução futura

Caso sejam necessárias alterações que quebrem compatibilidade, adotaremos versionamento via URL:

```
/api/v1/usuarios
/api/v2/usuarios
```

A versão antiga permanecerá funcionando por um período de depreciação.

---

## 📘 Documentação Swagger

A API é totalmente documentada via **Swagger (OpenAPI 3.0)**.

### Acesso

```
http://localhost:3000/api-docs
```

### O que está disponível no Swagger

- Todos os endpoints com descrição
- Schemas de request e response
- Códigos HTTP esperados
- Exemplos de payload
- Interface interativa para testar endpoints
- Autenticação integrada (botão "Authorize")

### Geração automática

Os comentários JSDoc no código geram automaticamente a especificação OpenAPI. A documentação está **sempre sincronizada** com o código.

---

## 🔗 Documentos Relacionados

- 📄 [Stack Tecnológica](./stack-tecnologica.md)
- 📄 [Estrutura do Projeto](./estrutura-projeto.md)
- 📄 [Modelo de Dados](./modelo-dados.md)
- 📄 Regras de Negócio *(em breve)*
- 📄 User Stories *(em breve)*

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
