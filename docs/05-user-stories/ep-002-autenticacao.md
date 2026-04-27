# 📄 User Stories — EP-002: Autenticação

> Documento com as User Stories do **Épico 2 — Autenticação**, que cobre login via JWT, proteção de rotas autenticadas e tratamento dos cenários de token ausente, inválido ou expirado.

---

## 📋 Sumário

- [Sobre Este Documento](#-sobre-este-documento)
- [Resumo do Épico](#-resumo-do-épico)
- [US-006 — Autenticar usuário (login)](#us-006--autenticar-usuário-login)
- [US-007 — Proteger rotas com JWT](#us-007--proteger-rotas-com-jwt)
- [US-008 — Tratar token ausente ou inválido](#us-008--tratar-token-ausente-ou-inválido)
- [Resumo de Cobertura](#-resumo-de-cobertura)

---

## 📖 Sobre Este Documento

Este documento lista as **User Stories** do EP-002. Cada US é uma unidade de valor independente, rastreável até regras de negócio e pronta para ser transformada em issue no GitHub.

### Estrutura de cada US

- **Narrativa** — padrão "Como… Quero… Para que…"
- **Contexto** — explicação da relevância e persona envolvida
- **Especificação** — endpoint ou componente e autenticação
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
| **Épico** | EP-002 — Autenticação |
| **Prioridade** | 🔴 Crítica |
| **Sprint** | 1 |
| **User Stories** | 3 |
| **Endpoints novos** | 1 (`POST /api/auth/login`) |
| **Componentes novos** | Middleware `authMiddleware` |
| **Regras de negócio cobertas** | RU-021 a RU-027 + RG-001, RG-002, RG-007 a RG-013, RG-041 |

### Lista de User Stories

| ID | Título | Endpoint / Componente |
|---|---|---|
| US-006 | Autenticar usuário (login) | `POST /api/auth/login` |
| US-007 | Proteger rotas com JWT | Middleware `authMiddleware` |
| US-008 | Tratar token ausente ou inválido | Middleware `authMiddleware` (cenários de erro) |

> ℹ️ US-007 e US-008 não introduzem endpoints próprios — entregam o **middleware de autenticação** que será aplicado em todas as rotas protegidas dos demais épicos (EP-001 US-002 a US-005, EP-003, EP-004, EP-005). A validação prática do middleware exige pelo menos uma rota protegida real ou uma rota auxiliar dedicada a testes.

---

## US-006 — Autenticar usuário (login)

![Épico](https://img.shields.io/badge/épico-EP--002-purple)
![Prioridade](https://img.shields.io/badge/prioridade-crítica-red)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** um usuário já cadastrado no Provus Finance,
> **Quero** fazer login informando meu e-mail e senha,
> **Para que** eu receba um token de autenticação que me permita acessar as rotas protegidas do sistema.

### 🎯 Contexto

Após o cadastro (US-001), o usuário precisa **provar quem é** para acessar suas próprias contas, categorias e transações. O login é a porta de entrada autenticada do sistema — sem ele, nenhuma funcionalidade financeira é acessível. A operação retorna um token JWT que o cliente deverá enviar no header `Authorization` em todas as requisições subsequentes.

**Persona principal:** Ana (quer entrar rapidamente para começar a registrar gastos)

### 🔌 Especificação

- **Endpoint:** `POST /api/auth/login`
- **Autenticação:** ❌ Rota pública
- **Corpo da requisição:** `email` e `senha`

### ✅ Critérios de Aceitação

#### CA-01 — Login bem-sucedido com credenciais válidas

```gherkin
Dado que existe um usuário cadastrado com e-mail e senha conhecidos
Quando eu envio uma requisição de login com as credenciais corretas
Então a resposta deve ter status 200
  E o corpo deve conter os campos token e usuario
  E o objeto usuario deve conter id, nome e email
  E a resposta não deve conter senha nem hash
```

#### CA-02 — Login com e-mail não cadastrado

```gherkin
Dado que envio um e-mail que não existe no sistema
Quando eu envio a requisição de login
Então a resposta deve ter status 401
  E o código do erro deve ser "CREDENCIAIS_INVALIDAS"
  E a mensagem deve ser genérica (não revelar se o e-mail existe)
```

#### CA-03 — Login com senha incorreta

```gherkin
Dado que envio um e-mail cadastrado mas com a senha errada
Quando eu envio a requisição de login
Então a resposta deve ter status 401
  E o código do erro deve ser "CREDENCIAIS_INVALIDAS"
  E a mensagem deve ser idêntica à do cenário de e-mail inexistente
```

#### CA-04 — Campo e-mail ausente

```gherkin
Dado que envio uma requisição de login sem o campo email
Quando eu envio a requisição
Então a resposta deve ter status 400
  E o código do erro deve indicar campo obrigatório ou validação
  E a resposta deve indicar qual campo está faltando
```

#### CA-05 — Campo senha ausente

```gherkin
Dado que envio uma requisição de login sem o campo senha
Quando eu envio a requisição
Então a resposta deve ter status 400
  E o código do erro deve indicar campo obrigatório ou validação
  E a resposta deve indicar qual campo está faltando
```

#### CA-06 — Body sem JSON válido

```gherkin
Dado que envio um corpo de requisição que não é JSON válido
Quando eu envio a requisição de login
Então a resposta deve ter status 400
  E o código do erro deve ser "FORMATO_INVALIDO"
```

#### CA-07 — Token gerado tem payload correto

```gherkin
Dado que faço login com sucesso
Quando decodifico o token retornado
Então o payload deve conter os campos sub, email, iat e exp
  E o sub deve ser o id numérico do usuário autenticado
  E o email deve ser o e-mail do usuário (em minúsculas)
  E exp - iat deve corresponder à duração configurada (padrão 24h)
```

#### CA-08 — E-mail é case-insensitive no login

```gherkin
Dado que existe um usuário cadastrado com e-mail "ana@provus.com"
Quando eu envio a requisição de login com e-mail "ANA@PROVUS.COM"
Então a resposta deve ter status 200
  E o login deve ser bem-sucedido
  E o e-mail no payload do token deve estar em minúsculas
```

#### CA-09 — Múltiplas sessões simultâneas

```gherkin
Dado que faço login duas vezes seguidas com as mesmas credenciais
Quando comparo os tokens retornados
Então ambos devem ser válidos
  E ambos devem permitir acesso a rotas protegidas
  E o login mais recente não deve invalidar tokens anteriores
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RU-021 | Login exige e-mail e senha |
| RU-022 | Credenciais inválidas retornam mensagem genérica |
| RU-023 | Login bem-sucedido retorna token JWT |
| RU-024 | Login não retorna dados sensíveis |
| RU-025 | Payload do token contém id e e-mail |
| RU-026 | Login comprovado por comparação de hash bcrypt |
| RU-027 | Múltiplas sessões são permitidas |
| RU-010 | E-mail normalizado para minúsculas |
| RG-001 | Senhas nunca em texto puro |
| RG-002 | Prepared statements obrigatórios |
| RG-007 | Body de requisições deve ser JSON válido |
| RG-013 | Duração padrão do token JWT (24h) |
| RG-014 | Campos obrigatórios validados antes do processamento |
| RG-041 | Estrutura padronizada de erro |

### 🏷️ Labels para a Issue

- `epic:autenticacao`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:critica`

### ✔️ Definition of Done

- [ ] Endpoint `POST /api/auth/login` implementado
- [ ] Validação dos campos `email` e `senha`
- [ ] Comparação de senha via `bcrypt.compare`
- [ ] Geração de token JWT com payload `{ sub, email, iat, exp }`
- [ ] Mensagem genérica em credenciais inválidas (anti-enumeração)
- [ ] Normalização de e-mail para minúsculas antes da consulta
- [ ] Todos os critérios de aceitação passando
- [ ] Testes de API escritos e executando com sucesso
- [ ] Documentação Swagger atualizada
- [ ] Coleção Postman atualizada
- [ ] Código revisado via Pull Request
- [ ] Branch mergeada na `main`

### 📌 Observações

- **Anti-enumeração:** as respostas para "e-mail não existe" e "senha incorreta" são **idênticas** (mesmo código, mesma mensagem, mesmo status). Isso impede que um atacante descubra quais e-mails estão cadastrados.
- O token retornado **não é armazenado no servidor** — a arquitetura é stateless. O cliente é responsável por guardá-lo (geralmente em memória ou storage seguro).
- Não há **refresh token** nesta versão. Quando o token expirar (24h), o usuário precisa fazer login novamente.
- A duração de 24h é configurável via variável de ambiente `JWT_EXPIRES_IN`.

---

## US-007 — Proteger rotas com JWT

![Épico](https://img.shields.io/badge/épico-EP--002-purple)
![Prioridade](https://img.shields.io/badge/prioridade-crítica-red)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** sistema do Provus Finance,
> **Quero** validar o token JWT em todas as rotas protegidas e identificar quem é o usuário autenticado,
> **Para que** apenas usuários legítimos acessem seus próprios dados, com identidade confirmada criptograficamente.

### 🎯 Contexto

Sem um middleware de autenticação reutilizável, cada endpoint precisaria validar token manualmente — o que geraria duplicação, brechas de segurança e inconsistências. Esta US entrega o **componente transversal** que protege qualquer rota do projeto: extrai o token do header, valida assinatura e expiração, e injeta a identidade do usuário (`req.usuario`) para uso pelos handlers downstream.

**Persona principal:** Sofia (espera que rotas protegidas realmente estejam protegidas)

### 🔌 Especificação

- **Componente:** `authMiddleware` em `api/src/middlewares/auth.middleware.js`
- **Aplicação:** todas as rotas listadas como autenticadas em `docs/03-arquitetura/api-contratos.md`
- **Header esperado:** `Authorization: Bearer <token>`
- **Resultado em sucesso:** `req.usuario = { id, email }` populado a partir do payload do token

### ✅ Critérios de Aceitação

#### CA-01 — Token válido permite acesso à rota protegida

```gherkin
Dado que possuo um token JWT válido obtido via login
Quando envio uma requisição a uma rota protegida com header Authorization: Bearer <token>
Então a requisição deve ser processada normalmente pelo handler da rota
  E não deve haver erro de autenticação
```

#### CA-02 — req.usuario é populado a partir do payload

```gherkin
Dado que envio uma requisição a uma rota protegida com token válido
Quando o handler da rota é executado
Então o objeto req.usuario deve estar definido
  E req.usuario.id deve ser igual ao campo sub do token
  E req.usuario.email deve ser igual ao campo email do token
```

#### CA-03 — Tokens diferentes identificam usuários diferentes

```gherkin
Dado que dois usuários distintos possuem tokens JWT válidos
Quando ambos enviam requisições à mesma rota protegida
Então cada requisição deve identificar o usuário correto em req.usuario
  E o id e e-mail em req.usuario devem corresponder ao dono daquele token
```

#### CA-04 — Middleware é reutilizável em múltiplas rotas

```gherkin
Dado que o middleware authMiddleware está aplicado em duas rotas distintas
Quando faço requisições autenticadas a ambas as rotas
Então as duas devem popular req.usuario a partir do mesmo mecanismo
  E ambas devem aceitar o mesmo token sem alterações
```

#### CA-05 — Header Authorization é obrigatório

```gherkin
Dado que envio uma requisição a uma rota protegida sem header Authorization
Quando o middleware é executado
Então a requisição deve ser interrompida antes do handler da rota
  E a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RU-025 | Payload do token contém id e e-mail |
| RG-008 | Todas as rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |
| RG-012 | Um usuário só acessa seus próprios dados |
| RG-013 | Duração padrão do token JWT |

### 🏷️ Labels para a Issue

- `epic:autenticacao`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:critica`

### ✔️ Definition of Done

- [ ] Middleware `authMiddleware` implementado em `api/src/middlewares/auth.middleware.js`
- [ ] Extração do token a partir do header `Authorization: Bearer <token>`
- [ ] Validação de assinatura e expiração do token via `jsonwebtoken`
- [ ] Injeção de `req.usuario = { id, email }` em rotas autenticadas
- [ ] Aplicado a pelo menos uma rota protegida real ou auxiliar de teste
- [ ] Todos os critérios de aceitação passando
- [ ] Testes de API escritos cobrindo o caminho feliz
- [ ] Documentação Swagger reflete o esquema de autenticação Bearer
- [ ] Código revisado via Pull Request
- [ ] Branch mergeada na `main`

### 📌 Observações

- A validação prática desta US **depende de uma rota protegida real**. As opções são: (a) testar contra `GET /api/usuarios/me` quando US-002 estiver pronta, (b) criar uma rota auxiliar exclusiva para testes do middleware, ou (c) testar diretamente a função do middleware com mocks de `req`/`res`/`next`. A escolha será documentada no PR de implementação.
- A regra `RG-012` (um usuário só acessa seus próprios dados) é **parcialmente** coberta aqui — o middleware identifica corretamente o usuário, mas a aplicação efetiva de filtros por `req.usuario.id` é responsabilidade de cada endpoint dos demais épicos.
- Esta US **não trata** dos cenários de erro do token — esses estão na US-008.

---

## US-008 — Tratar token ausente ou inválido

![Épico](https://img.shields.io/badge/épico-EP--002-purple)
![Prioridade](https://img.shields.io/badge/prioridade-crítica-red)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** cliente da API do Provus Finance,
> **Quero** receber respostas HTTP claras e específicas quando meu token estiver ausente, malformado ou expirado,
> **Para que** eu consiga diagnosticar o problema e oferecer ao usuário a ação correta (ex: renovar login).

### 🎯 Contexto

Tokens podem falhar por motivos distintos: o cliente esqueceu de enviar, enviou em formato errado, enviou um token forjado, ou o token simplesmente expirou. Cada cenário exige uma resposta com **código de erro específico**, permitindo que o cliente reaja apropriadamente — por exemplo, redirecionando para login em caso de token expirado, ou logando alerta de segurança em caso de assinatura inválida.

**Persona principal:** Sofia (espera que mensagens de erro sejam claras e específicas para diagnóstico)

### 🔌 Especificação

- **Componente:** `authMiddleware` em `api/src/middlewares/auth.middleware.js` (cenários de erro)
- **Aplicação:** mesmas rotas autenticadas da US-007
- **Códigos de erro tratados:** `TOKEN_AUSENTE`, `TOKEN_INVALIDO`, `TOKEN_EXPIRADO`
- **Status HTTP:** sempre **401 Unauthorized**

### ✅ Critérios de Aceitação

#### CA-01 — Header Authorization ausente

```gherkin
Dado que envio uma requisição a uma rota protegida sem o header Authorization
Quando o middleware é executado
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
  E a mensagem deve estar em português
```

#### CA-02 — Header sem prefixo "Bearer"

```gherkin
Dado que envio o header Authorization sem o prefixo "Bearer" (ex: apenas o token)
Quando o middleware é executado
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_INVALIDO"
  E a mensagem deve indicar o formato esperado (Bearer <token>)
```

#### CA-03 — Token malformado

```gherkin
Dado que envio um token que não tem estrutura JWT válida (ex: "abc.def")
Quando o middleware é executado
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_INVALIDO"
```

#### CA-04 — Token assinado com chave diferente

```gherkin
Dado que envio um token JWT estruturalmente válido mas assinado com chave secreta diferente
Quando o middleware tenta validar a assinatura
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_INVALIDO"
```

#### CA-05 — Token expirado

```gherkin
Dado que envio um token cuja data de expiração (exp) já passou
Quando o middleware é executado
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_EXPIRADO"
```

#### CA-06 — Estrutura do erro segue o padrão da API

```gherkin
Dado que qualquer um dos cenários acima ocorre
Quando observo o corpo da resposta
Então o JSON deve seguir a estrutura { erro: { codigo, mensagem } }
  E o campo codigo deve ser uma das constantes documentadas
  E o campo mensagem deve estar em português
```

#### CA-07 — Erro é retornado antes do handler da rota

```gherkin
Dado que qualquer cenário de erro de autenticação ocorre
Quando o middleware identifica o problema
Então o handler da rota não deve ser executado
  E nenhum efeito colateral (consulta a banco, gravação) deve ocorrer
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RG-009 | Token ausente retorna 401 |
| RG-010 | Token inválido retorna 401 |
| RG-011 | Token expirado retorna 401 |
| RG-041 | Estrutura padronizada de erro |
| RG-042 | Mensagens de erro em português |

### 🏷️ Labels para a Issue

- `epic:autenticacao`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:critica`

### ✔️ Definition of Done

- [ ] Cenário de header ausente retorna 401 `TOKEN_AUSENTE`
- [ ] Cenário de header sem prefixo `Bearer` retorna 401 `TOKEN_INVALIDO`
- [ ] Token malformado retorna 401 `TOKEN_INVALIDO`
- [ ] Token com assinatura inválida retorna 401 `TOKEN_INVALIDO`
- [ ] Token expirado retorna 401 `TOKEN_EXPIRADO`
- [ ] Resposta de erro segue a estrutura `{ erro: { codigo, mensagem } }`
- [ ] Mensagens em português
- [ ] Todos os critérios de aceitação passando
- [ ] Testes de API escritos cobrindo os 5 cenários de erro
- [ ] Documentação Swagger lista os 3 códigos de erro de autenticação
- [ ] Código revisado via Pull Request
- [ ] Branch mergeada na `main`

### 📌 Observações

- A diferença entre `TOKEN_INVALIDO` e `TOKEN_EXPIRADO` é importante: clientes podem reagir distintamente — um token expirado sugere renovação automática via login, enquanto um token inválido pode indicar tentativa de adulteração ou bug no cliente.
- Esta US **complementa** a US-007 (caminho feliz). Juntas, elas cobrem o ciclo completo de validação de token.
- Tokens de usuários **excluídos** após emissão do token continuam tecnicamente válidos até expirar, mas falharão nos endpoints que tentam buscar o usuário no banco (resultando em 401 ou 404 conforme a regra `RU-048`). Esse cenário é tratado na US-005 (exclusão de conta) e não é responsabilidade direta deste middleware.

---

## 📊 Resumo de Cobertura

### Estatísticas

| Métrica | Valor |
|---|---|
| **Total de User Stories** | 3 |
| **Total de Critérios de Aceitação** | 21 |
| **Regras de negócio cobertas** | 7 regras de usuário (RU-021 a RU-027) + 10 regras gerais (RG-001, RG-002, RG-007 a RG-013, RG-041) + 2 complementares (RU-010, RG-042) |
| **Endpoints implementados** | 1 (`POST /api/auth/login`) |
| **Componentes implementados** | 1 (middleware `authMiddleware`) |

### Distribuição de Critérios de Aceitação

```
US-006 (Login):              █████████  9 CAs
US-007 (Proteger rotas):     █████      5 CAs
US-008 (Tratar token):       ███████    7 CAs
```

### Cobertura por prioridade

| Prioridade | User Stories |
|---|---|
| 🔴 **Crítica** | US-006, US-007, US-008 |

### Rastreabilidade futura

Cada US vai gerar:
- **1 issue** no GitHub Projects
- **1 branch** (ex: `feat/us-006-login`, `feat/us-007-middleware-jwt`)
- **1 Pull Request**
- **Múltiplos casos de teste** na pasta `06-testes/`
- **Testes automatizados** com identificadores rastreáveis

> ℹ️ US-007 e US-008 podem ser entregues em **um único PR** (mesmo middleware, mesmo arquivo). A separação em duas USs visa **clareza de critérios de aceitação** — caminho feliz vs. cenários de erro — não fragmentação artificial do código.

---

## 🔗 Documentos Relacionados

- 📦 [Épicos da Fase 1](../04-epicos/epicos.md)
- 📄 [User Stories — EP-001](./ep-001-usuarios.md)
- 📄 [Regras de Usuário](../02-regras-negocio/regras-usuario.md)
- 📄 [Regras Gerais](../02-regras-negocio/regras-gerais.md)
- 📄 [Contratos da API](../03-arquitetura/api-contratos.md)
- 📄 [Personas](../01-visao/personas.md)

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
