# 📄 User Stories — EP-001: Gestão de Usuários

> Documento com as User Stories do **Épico 1 — Gestão de Usuários**, que cobre cadastro, consulta, atualização, alteração de senha e exclusão de contas de usuário.

---

## 📋 Sumário

- [Sobre Este Documento](#-sobre-este-documento)
- [Resumo do Épico](#-resumo-do-épico)
- [US-001 — Cadastrar novo usuário](#us-001--cadastrar-novo-usuário)
- [US-002 — Consultar próprio perfil](#us-002--consultar-próprio-perfil)
- [US-003 — Atualizar dados do perfil](#us-003--atualizar-dados-do-perfil)
- [US-004 — Alterar senha](#us-004--alterar-senha)
- [US-005 — Excluir própria conta](#us-005--excluir-própria-conta)
- [Resumo de Cobertura](#-resumo-de-cobertura)

---

## 📖 Sobre Este Documento

Este documento lista as **User Stories** do EP-001. Cada US é uma unidade de valor independente, rastreável até regras de negócio e pronta para ser transformada em issue no GitHub.

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
| **Épico** | EP-001 — Gestão de Usuários |
| **Prioridade** | 🔴 Crítica |
| **Sprint** | 1 |
| **User Stories** | 5 |
| **Endpoints envolvidos** | 5 |
| **Regras de negócio cobertas** | RU-001 a RU-049 + regras gerais |

### Lista de User Stories

| ID | Título | Endpoint |
|---|---|---|
| US-001 | Cadastrar novo usuário | `POST /api/usuarios` |
| US-002 | Consultar próprio perfil | `GET /api/usuarios/me` |
| US-003 | Atualizar dados do perfil | `PUT /api/usuarios/me` |
| US-004 | Alterar senha | `PUT /api/usuarios/me/senha` |
| US-005 | Excluir própria conta | `DELETE /api/usuarios/me` |

---

## US-001 — Cadastrar novo usuário

![Épico](https://img.shields.io/badge/épico-EP--001-blue)
![Prioridade](https://img.shields.io/badge/prioridade-crítica-red)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** uma pessoa interessada em usar o Provus Finance,
> **Quero** criar uma conta fornecendo nome, e-mail e senha,
> **Para que** eu possa ter acesso às funcionalidades de controle financeiro.

### 🎯 Contexto

Esta é a **porta de entrada** do sistema. Sem cadastro, nenhuma outra funcionalidade é acessível. O cadastro é público, rápido e exige apenas dados essenciais. Após o cadastro, o usuário precisa fazer login separadamente para obter o token de autenticação.

**Persona principal:** Ana (iniciante, quer simplicidade no cadastro)

### 🔌 Especificação

- **Endpoint:** `POST /api/usuarios`
- **Autenticação:** ❌ Rota pública
- **Corpo da requisição:** `nome`, `email`, `senha`

### ✅ Critérios de Aceitação

#### CA-01 — Cadastro bem-sucedido com dados válidos

```gherkin
Dado que informei nome, e-mail e senha válidos
  E o e-mail informado não existe no sistema
Quando eu envio a requisição de cadastro
Então a resposta deve ter status 201
  E o corpo deve conter id, nome, email, criadoEm e atualizadoEm
  E a resposta não deve conter senha nem hash
  E o usuário deve estar persistido no banco
  E a senha deve estar armazenada como hash bcrypt
```

#### CA-02 — Cadastro com e-mail já existente

```gherkin
Dado que já existe um usuário cadastrado com o e-mail informado
Quando eu envio a requisição de cadastro com esse mesmo e-mail
Então a resposta deve ter status 409
  E o código do erro deve ser "EMAIL_JA_CADASTRADO"
  E a mensagem deve estar em português
```

#### CA-03 — Cadastro com campo obrigatório ausente

```gherkin
Dado que envio uma requisição de cadastro sem um dos campos obrigatórios
Quando eu envio a requisição
Então a resposta deve ter status 400
  E o código do erro deve indicar campo ausente ou validação
  E a resposta deve indicar qual campo está faltando
```

#### CA-04 — Cadastro com e-mail em formato inválido

```gherkin
Dado que informo um e-mail em formato inválido
Quando eu envio a requisição de cadastro
Então a resposta deve ter status 400
  E o código do erro deve ser de validação ou formato inválido
```

#### CA-05 — Cadastro com senha que não atende aos requisitos

```gherkin
Dado que informo uma senha que não atende aos requisitos mínimos
Quando eu envio a requisição de cadastro
Então a resposta deve ter status 400
  E a resposta deve detalhar quais requisitos não foram atendidos
```

#### CA-06 — Normalização do e-mail para minúsculas

```gherkin
Dado que informo o e-mail com letras maiúsculas e minúsculas misturadas
Quando o cadastro é bem-sucedido
Então o e-mail persistido deve estar em minúsculas
```

#### CA-07 — Normalização de espaços no nome

```gherkin
Dado que informo o nome com múltiplos espaços internos e nas extremidades
Quando o cadastro é bem-sucedido
Então o nome persistido deve ter espaços normalizados
  E não deve conter espaços nas extremidades
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RU-001 | Campos obrigatórios no cadastro |
| RU-002 | Cadastro é público |
| RU-003 | E-mail único no sistema |
| RU-004 | Senha persistida como hash bcrypt |
| RU-005 | Resposta não inclui senha |
| RU-006 | Cadastro retorna 201 |
| RU-007 | Cadastro não realiza login automático |
| RU-008 | Formato de e-mail validado |
| RU-009 | E-mail tem comprimento máximo |
| RU-010 | E-mail normalizado para minúsculas |
| RU-011 | E-mail sem espaços |
| RU-012 | Comprimento mínimo da senha |
| RU-013 | Comprimento máximo da senha |
| RU-014 | Complexidade mínima da senha |
| RU-015 | Caracteres especiais opcionais |
| RU-016 | Senha nunca em logs ou respostas |
| RU-017 | Comprimento do nome |
| RU-018 | Nome aceita caracteres acentuados |
| RU-019 | Nome não aceita apenas números |
| RU-020 | Nome com espaços normalizados |
| RG-001 | Senhas nunca em texto puro |
| RG-014 | Campos obrigatórios validados primeiro |
| RG-019 | Múltiplos erros retornados juntos |
| RG-020 | E-mails normalizados para minúsculas |

### 🏷️ Labels para a Issue

- `epic:usuarios`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:critica`

### ✔️ Definition of Done

- [ ] Endpoint `POST /api/usuarios` implementado
- [ ] Validações de e-mail, senha e nome aplicadas
- [ ] Senha persistida como hash bcrypt
- [ ] Todos os critérios de aceitação passando
- [ ] Testes de API escritos e executando com sucesso
- [ ] Documentação Swagger atualizada
- [ ] Coleção Postman atualizada
- [ ] Código revisado via Pull Request
- [ ] Branch mergeada na `main`

### 📌 Observações

- Usuário criado começa **sem contas e sem categorias personalizadas**
- Após cadastro, é necessário fazer login para receber o token JWT (ver US-006)
- O cadastro é **idempotente em aparência** — tentar cadastrar o mesmo e-mail retorna 409 de forma consistente

---

## US-002 — Consultar próprio perfil

![Épico](https://img.shields.io/badge/épico-EP--001-blue)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** consultar os dados do meu perfil,
> **Para que** eu possa verificar ou confirmar as informações associadas à minha conta.

### 🎯 Contexto

Usuários precisam visualizar seus próprios dados cadastrais — especialmente em telas de configuração, verificação de e-mail ou debug. Como a API é usada sem frontend, esse endpoint é o "espelho" da conta atual para uso em testes e futuras integrações.

**Persona principal:** Sofia (quer verificar transparência sobre seus dados)

### 🔌 Especificação

- **Endpoint:** `GET /api/usuarios/me`
- **Autenticação:** ✅ Token JWT obrigatório
- **Corpo da requisição:** Nenhum

### ✅ Critérios de Aceitação

#### CA-01 — Consulta bem-sucedida do próprio perfil

```gherkin
Dado que estou autenticado com token válido
Quando eu consulto o endpoint do meu perfil
Então a resposta deve ter status 200
  E o corpo deve conter id, nome, email, criadoEm e atualizadoEm
  E a resposta não deve conter senha ou hash
  E os dados devem ser do usuário autenticado
```

#### CA-02 — Consulta sem token de autenticação

```gherkin
Dado que envio a requisição sem o header Authorization
Quando eu consulto o endpoint do meu perfil
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

#### CA-03 — Consulta com token inválido

```gherkin
Dado que envio a requisição com um token malformado ou com assinatura inválida
Quando eu consulto o endpoint do meu perfil
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_INVALIDO"
```

#### CA-04 — Consulta com token expirado

```gherkin
Dado que envio a requisição com um token que já expirou
Quando eu consulto o endpoint do meu perfil
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_EXPIRADO"
```

#### CA-05 — Resposta não inclui dados sensíveis

```gherkin
Dado que faço uma consulta bem-sucedida do perfil
Quando analiso o corpo da resposta
Então não deve haver campo "senha" ou "senha_hash"
  E não devem ser expostos dados de outros usuários
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RU-028 | Endpoint retorna apenas o próprio usuário |
| RU-029 | Resposta inclui dados públicos |
| RU-030 | Não existe listagem pública de usuários |
| RG-004 | Respostas da API nunca expõem dados sensíveis |
| RG-008 | Rotas protegidas exigem token JWT válido |
| RG-009 | Token ausente retorna 401 |
| RG-010 | Token inválido retorna 401 |
| RG-011 | Token expirado retorna 401 |
| RG-012 | Usuário só acessa seus próprios dados |

### 🏷️ Labels para a Issue

- `epic:usuarios`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:alta`

### ✔️ Definition of Done

- [ ] Endpoint `GET /api/usuarios/me` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Resposta contém apenas dados públicos
- [ ] Todos os critérios de aceitação passando
- [ ] Testes de API escritos e executando
- [ ] Documentação Swagger atualizada
- [ ] Coleção Postman atualizada
- [ ] Código revisado via Pull Request
- [ ] Branch mergeada na `main`

### 📌 Observações

- Este endpoint só retorna dados do **próprio usuário autenticado**
- Não existe endpoint para consultar dados de outros usuários (previsto para fase admin — Fase 6)

---

## US-003 — Atualizar dados do perfil

![Épico](https://img.shields.io/badge/épico-EP--001-blue)
![Prioridade](https://img.shields.io/badge/prioridade-alta-yellow)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** atualizar meu nome e/ou e-mail,
> **Para que** eu possa manter meus dados cadastrais corretos ao longo do tempo.

### 🎯 Contexto

Dados cadastrais mudam ao longo da vida — mudança de sobrenome, troca de e-mail profissional, preferência por apelido em vez do nome completo. O usuário precisa autonomia para atualizar esses campos sem precisar excluir e recriar a conta.

**Persona principal:** Rafael (usuário experiente que mantém dados atualizados)

### 🔌 Especificação

- **Endpoint:** `PUT /api/usuarios/me`
- **Autenticação:** ✅ Token JWT obrigatório
- **Corpo da requisição:** `nome` e/ou `email` (atualização parcial)

### ✅ Critérios de Aceitação

#### CA-01 — Atualização bem-sucedida de nome e e-mail

```gherkin
Dado que estou autenticado
  E informo um novo nome e um novo e-mail não cadastrado
Quando envio a atualização do perfil
Então a resposta deve ter status 200
  E o corpo deve conter os novos dados atualizados
  E o campo atualizadoEm deve estar com timestamp recente
  E os dados devem estar persistidos no banco
```

#### CA-02 — Atualização parcial apenas do nome

```gherkin
Dado que estou autenticado
  E informo apenas o novo nome
Quando envio a atualização
Então a resposta deve ter status 200
  E apenas o nome deve ser alterado
  E o e-mail deve permanecer inalterado
```

#### CA-03 — Atualização para e-mail já existente

```gherkin
Dado que tento alterar meu e-mail para um que já existe em outro usuário
Quando envio a atualização
Então a resposta deve ter status 409
  E o código do erro deve ser "EMAIL_JA_CADASTRADO"
```

#### CA-04 — Atualização do próprio e-mail para o mesmo valor

```gherkin
Dado que envio como novo e-mail o mesmo e-mail que já possuo
Quando envio a atualização
Então a resposta deve ter status 200
  E não deve retornar erro de conflito
```

#### CA-05 — Atualização com nome inválido

```gherkin
Dado que informo um nome em formato inválido
Quando envio a atualização
Então a resposta deve ter status 400
  E a resposta deve indicar o erro de validação
```

#### CA-06 — Tentativa de alterar campo não permitido

```gherkin
Dado que envio na requisição um campo que não pode ser atualizado
Quando envio a atualização
Então o campo inválido deve ser ignorado silenciosamente
  Ou a resposta deve retornar status 400 com mensagem de campo não permitido
```

#### CA-07 — Sem autenticação

```gherkin
Dado que envio a requisição sem token
Quando tento atualizar o perfil
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_AUSENTE"
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RU-031 | Campos atualizáveis (nome e email) |
| RU-032 | Atualização parcial é permitida |
| RU-033 | Novo e-mail não pode estar em uso |
| RU-034 | Alterar e-mail para o próprio é permitido |
| RU-035 | Timestamp atualizadoEm é atualizado |
| RU-036 | Atualização retorna usuário atualizado |
| RU-008 a RU-011 | Validações de e-mail aplicam-se |
| RU-017 a RU-020 | Validações de nome aplicam-se |
| RG-046 | Atualização automática do atualizadoEm |
| RG-020 | Normalização de e-mail para minúsculas |

### 🏷️ Labels para a Issue

- `epic:usuarios`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:alta`

### ✔️ Definition of Done

- [ ] Endpoint `PUT /api/usuarios/me` implementado
- [ ] Atualização parcial funcionando
- [ ] Validações de e-mail e nome aplicadas
- [ ] Verificação de e-mail duplicado funcionando
- [ ] Campo `atualizadoEm` sendo atualizado
- [ ] Todos os critérios de aceitação passando
- [ ] Testes de API escritos e executando
- [ ] Documentação Swagger atualizada
- [ ] Coleção Postman atualizada
- [ ] Código revisado via Pull Request
- [ ] Branch mergeada na `main`

### 📌 Observações

- A atualização **não altera a senha** — esse é o escopo da US-004
- A atualização **não altera o ID** nem `criadoEm`
- O `atualizadoEm` é atualizado automaticamente pelo banco

---

## US-004 — Alterar senha

![Épico](https://img.shields.io/badge/épico-EP--001-blue)
![Prioridade](https://img.shields.io/badge/prioridade-crítica-red)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** alterar minha senha informando a senha atual e a nova,
> **Para que** eu possa manter minha conta segura caso desconfie de comprometimento ou simplesmente queira atualizar minha credencial.

### 🎯 Contexto

A alteração de senha é uma operação **sensível e distinta** da atualização de perfil. Exige **confirmação da senha atual** para prevenir ataques (ex: sessão deixada aberta, ataque CSRF). Sem reset de senha por e-mail nesta fase, esta é a única forma do usuário mudar sua credencial.

**Persona principal:** Sofia (preocupada com segurança)

### 🔌 Especificação

- **Endpoint:** `PUT /api/usuarios/me/senha`
- **Autenticação:** ✅ Token JWT obrigatório
- **Corpo da requisição:** `senhaAtual` e `senhaNova`

### ✅ Critérios de Aceitação

#### CA-01 — Alteração bem-sucedida com senha atual correta

```gherkin
Dado que estou autenticado
  E informo a senha atual correta
  E a nova senha atende aos requisitos
Quando envio a requisição de alteração
Então a resposta deve ter status 200
  E a resposta deve conter mensagem de sucesso
  E a senha no banco deve estar como o novo hash bcrypt
  E a nova senha deve funcionar em um novo login
```

#### CA-02 — Alteração com senha atual incorreta

```gherkin
Dado que informo uma senha atual diferente da real
Quando envio a requisição de alteração
Então a resposta deve ter status 401
  E o código do erro deve ser "CREDENCIAIS_INVALIDAS"
  E a senha original deve permanecer inalterada
```

#### CA-03 — Nova senha igual à senha atual

```gherkin
Dado que informo a senha atual correta
  E a nova senha é idêntica à atual
Quando envio a requisição
Então a resposta deve ter status 400
  E o código do erro deve ser "SENHA_IGUAL_ATUAL"
```

#### CA-04 — Nova senha não atende aos requisitos mínimos

```gherkin
Dado que informo a senha atual correta
  E a nova senha tem menos de 8 caracteres ou falta complexidade
Quando envio a requisição
Então a resposta deve ter status 400
  E a resposta deve detalhar os requisitos não atendidos
```

#### CA-05 — Campo obrigatório ausente

```gherkin
Dado que envio a requisição sem senhaAtual ou senhaNova
Quando envio a requisição
Então a resposta deve ter status 400
  E a resposta deve indicar qual campo está faltando
```

#### CA-06 — Token atual permanece válido após alteração

```gherkin
Dado que alterei minha senha com sucesso
Quando tento usar o token atual em outra requisição
Então o token deve continuar válido
  E devo conseguir acessar rotas protegidas
```

#### CA-07 — Resposta não expõe dados sensíveis

```gherkin
Dado que faço uma alteração de senha bem-sucedida
Quando analiso o corpo da resposta
Então não deve haver a senha antiga, nova senha ou hash
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RU-037 | Alteração exige senha atual |
| RU-038 | Senha atual é validada antes da alteração |
| RU-039 | Nova senha segue validações do cadastro |
| RU-040 | Nova senha não pode ser igual à atual |
| RU-041 | Alteração não invalida token atual |
| RU-042 | Resposta não inclui senha |
| RU-012 a RU-016 | Validações de senha aplicam-se |
| RG-001 | Senhas nunca em texto puro |
| RG-004 | Respostas nunca expõem dados sensíveis |

### 🏷️ Labels para a Issue

- `epic:usuarios`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:critica`

### ✔️ Definition of Done

- [ ] Endpoint `PUT /api/usuarios/me/senha` implementado
- [ ] Verificação da senha atual via bcrypt.compare
- [ ] Validações da nova senha aplicadas
- [ ] Rejeição de senha nova igual à atual
- [ ] Nova senha persistida como hash bcrypt
- [ ] Todos os critérios de aceitação passando
- [ ] Testes de API escritos e executando
- [ ] Documentação Swagger atualizada
- [ ] Coleção Postman atualizada
- [ ] Código revisado via Pull Request
- [ ] Branch mergeada na `main`

### 📌 Observações

- Esta US é **separada** da atualização de perfil por uma questão de segurança — alteração de senha merece um endpoint dedicado com validação extra
- Não há reset de senha por e-mail nesta versão — se o usuário esquecer a senha, precisa criar nova conta
- O token atual **permanece válido** após alteração (decisão consciente para simplificar a arquitetura stateless)

---

## US-005 — Excluir própria conta

![Épico](https://img.shields.io/badge/épico-EP--001-blue)
![Prioridade](https://img.shields.io/badge/prioridade-media-green)
![Fase](https://img.shields.io/badge/fase-1-purple)

### 📖 Narrativa

> **Como** usuário autenticado no Provus Finance,
> **Quero** excluir permanentemente minha conta e todos os dados associados,
> **Para que** eu tenha controle total sobre minha privacidade e possa remover minha presença do sistema.

### 🎯 Contexto

Direito de exclusão é um **pilar da privacidade moderna** (LGPD, GDPR). O usuário deve ter autonomia para deletar sua própria conta sem intervenção de terceiros. A exclusão é **hard delete** (permanente) e propaga em cascata para contas e transações.

**Persona principal:** Sofia (valoriza privacidade e controle dos próprios dados)

### 🔌 Especificação

- **Endpoint:** `DELETE /api/usuarios/me`
- **Autenticação:** ✅ Token JWT obrigatório
- **Corpo da requisição:** `senha` (para confirmação)

### ✅ Critérios de Aceitação

#### CA-01 — Exclusão bem-sucedida com senha correta

```gherkin
Dado que estou autenticado
  E informo a senha correta no corpo da requisição
Quando envio a requisição de exclusão
Então a resposta deve ter status 204
  E a resposta não deve conter corpo
  E o usuário deve ser removido do banco
  E todas as suas contas devem ser removidas
  E todas as suas categorias personalizadas devem ser removidas
  E todas as suas transações devem ser removidas
```

#### CA-02 — Exclusão com senha incorreta

```gherkin
Dado que informo uma senha incorreta na confirmação
Quando envio a requisição de exclusão
Então a resposta deve ter status 401
  E o código do erro deve ser "CREDENCIAIS_INVALIDAS"
  E o usuário não deve ser excluído
  E nenhum dado associado deve ser afetado
```

#### CA-03 — Exclusão sem senha de confirmação

```gherkin
Dado que envio a requisição sem o campo senha
Quando envio a requisição
Então a resposta deve ter status 400
  E o código do erro deve indicar campo obrigatório ausente
```

#### CA-04 — Token inválido após exclusão

```gherkin
Dado que excluí minha conta com sucesso
Quando tento usar o token que tinha antes em qualquer rota protegida
Então a resposta deve ter status 401
  E o código do erro deve ser "TOKEN_INVALIDO" ou similar
```

#### CA-05 — E-mail fica disponível para novo cadastro

```gherkin
Dado que um usuário com e-mail "teste@provus.com" foi excluído
Quando uma nova pessoa tenta cadastrar-se com o mesmo e-mail
Então o cadastro deve ser bem-sucedido
  E deve criar um novo usuário independente
```

#### CA-06 — Exclusão é atômica

```gherkin
Dado que ocorre uma falha durante a exclusão
Quando o sistema tenta completar a operação
Então nenhum dado deve ser parcialmente excluído
  E o estado do banco deve continuar consistente
```

#### CA-07 — Categorias padrão do sistema não são afetadas

```gherkin
Dado que excluo minha conta
Quando verifico o banco após a exclusão
Então as categorias padrão do sistema devem permanecer intactas
  E os dados de outros usuários devem permanecer intactos
```

### 📚 Regras de Negócio Cobertas

| ID | Descrição |
|---|---|
| RU-043 | Exclusão é definitiva (hard delete) |
| RU-044 | Exclusão exige confirmação por senha |
| RU-045 | Exclusão propaga para contas e transações |
| RU-046 | Operação é atômica |
| RU-047 | Exclusão retorna 204 |
| RU-048 | Token invalidado implicitamente |
| RU-049 | E-mail fica disponível para novo cadastro |
| RC-052 | Exclusão do usuário remove contas |
| RC-053 | Foreign key com CASCADE |
| RK-053 | Exclusão remove categorias personalizadas |
| RT-071 | Exclusão propaga para transações |
| RG-038 | Transações de banco em operações compostas |

### 🏷️ Labels para a Issue

- `epic:usuarios`
- `tipo:api`
- `tipo:testes`
- `fase-1`
- `prioridade:media`

### ✔️ Definition of Done

- [ ] Endpoint `DELETE /api/usuarios/me` implementado
- [ ] Confirmação por senha obrigatória
- [ ] Exclusão em cascata funcionando (contas + categorias + transações)
- [ ] Operação executada dentro de transação de banco
- [ ] Resposta 204 sem corpo
- [ ] Todos os critérios de aceitação passando
- [ ] Testes de API escritos e executando
- [ ] Documentação Swagger atualizada
- [ ] Coleção Postman atualizada
- [ ] Código revisado via Pull Request
- [ ] Branch mergeada na `main`

### 📌 Observações

- **Exclusão é permanente** — não há recuperação de dados após a operação
- Categorias **padrão do sistema** nunca são afetadas pela exclusão de um usuário
- Após a exclusão, o token atual se torna implicitamente inválido pois o usuário não existe mais no banco
- Esta é uma operação **arriscada** por natureza — em produção, seria recomendável adicionar etapa de confirmação adicional (ex: e-mail de confirmação), mas não está no escopo desta fase

---

## 📊 Resumo de Cobertura

### Estatísticas

| Métrica | Valor |
|---|---|
| **Total de User Stories** | 5 |
| **Total de Critérios de Aceitação** | 33 |
| **Regras de negócio cobertas** | 49 regras de usuário + 15 regras gerais + 3 de outras entidades |
| **Endpoints implementados** | 5 |

### Distribuição de Critérios de Aceitação

```
US-001 (Cadastrar):      ████████  7 CAs
US-002 (Consultar):      ██████    5 CAs
US-003 (Atualizar):      ████████  7 CAs
US-004 (Alterar senha):  ████████  7 CAs
US-005 (Excluir):        ████████  7 CAs
```

### Cobertura por prioridade

| Prioridade | User Stories |
|---|---|
| 🔴 **Crítica** | US-001, US-004 |
| 🟡 **Alta** | US-002, US-003 |
| 🟢 **Média** | US-005 |

### Rastreabilidade futura

Cada US vai gerar:
- **1 issue** no GitHub Projects
- **1 branch** (ex: `feat/us-001-cadastrar-usuario`)
- **1 Pull Request**
- **Múltiplos casos de teste** na pasta `06-testes/`
- **Testes automatizados** com identificadores rastreáveis

---

## 🔗 Documentos Relacionados

- 📦 [Épicos da Fase 1](../04-epicos/epicos.md)
- 📄 [Regras de Usuário](../02-regras-negocio/regras-usuario.md)
- 📄 [Regras Gerais](../02-regras-negocio/regras-gerais.md)
- 📄 [Contratos da API](../03-arquitetura/api-contratos.md)
- 📄 [Personas](../01-visao/personas.md)

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>