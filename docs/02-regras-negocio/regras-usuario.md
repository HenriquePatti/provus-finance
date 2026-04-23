# 👤 Regras de Negócio — Usuários

> Documento que descreve as regras de negócio específicas do domínio de **usuários**: cadastro, autenticação, gestão de perfil e exclusão de conta.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Cadastro de Usuário](#-cadastro-de-usuário)
- [Validação de E-mail](#-validação-de-e-mail)
- [Validação de Senha](#-validação-de-senha)
- [Validação de Nome](#-validação-de-nome)
- [Autenticação (Login)](#-autenticação-login)
- [Consulta de Perfil](#-consulta-de-perfil)
- [Atualização de Perfil](#-atualização-de-perfil)
- [Alteração de Senha](#-alteração-de-senha)
- [Exclusão de Usuário](#-exclusão-de-usuário)
- [Resumo das Regras](#-resumo-das-regras)

---

## 🎯 Visão Geral

O domínio de usuário é o **ponto de entrada** da aplicação. Todas as demais funcionalidades dependem de um usuário autenticado.

### Operações disponíveis

| Operação | Endpoint | Autenticação |
|---|---|:---:|
| Cadastrar | `POST /api/usuarios` | ❌ |
| Fazer login | `POST /api/auth/login` | ❌ |
| Consultar próprio perfil | `GET /api/usuarios/me` | ✅ |
| Atualizar perfil | `PUT /api/usuarios/me` | ✅ |
| Alterar senha | `PUT /api/usuarios/me/senha` | ✅ |
| Excluir conta | `DELETE /api/usuarios/me` | ✅ |

---

## 📝 Cadastro de Usuário

### Regras principais

### `RU-001` — Campos obrigatórios no cadastro
O cadastro exige exatamente três campos obrigatórios: **nome**, **email** e **senha**. Qualquer outro campo enviado é ignorado.

### `RU-002` — Cadastro é público
A rota de cadastro não exige autenticação. Qualquer pessoa pode criar uma conta.

### `RU-003` — E-mail único no sistema
Não é permitido existir mais de um usuário com o mesmo e-mail. Tentativas de cadastro com e-mail já existente retornam **409 Conflict** com código `EMAIL_JA_CADASTRADO`.

### `RU-004` — Senha é persistida como hash bcrypt
A senha recebida no cadastro é convertida para hash bcrypt com **10 rounds** antes de ser persistida. O texto original é descartado imediatamente.

### `RU-005` — Resposta do cadastro não inclui senha
A resposta de cadastro retorna apenas dados públicos do usuário: `id`, `nome`, `email`, `criadoEm`. O campo `senha_hash` **nunca** é exposto.

### `RU-006` — Cadastro bem-sucedido retorna 201
Um cadastro válido retorna **201 Created** com o objeto do usuário criado no body.

### `RU-007` — Cadastro não realiza login automático
O cadastro **não retorna token JWT**. O usuário precisa fazer login manualmente após o cadastro para obter um token.

> 💡 **Justificativa:** Separar cadastro e login reduz a complexidade da API, permite confirmação posterior de e-mail (fase futura) e é o padrão recomendado por segurança.

---

## 📧 Validação de E-mail

### `RU-008` — Formato de e-mail é validado
O e-mail deve seguir o formato `local@dominio.tld`. E-mails malformados retornam **400 Bad Request** com código `FORMATO_INVALIDO`.

**Exemplos válidos:**
- `ana.martins@provus.com`
- `rafael+spam@gmail.com`
- `user123@sub.dominio.co`

**Exemplos inválidos:**
- `sem-arroba.com`
- `@sem-local.com`
- `email@`
- `email com espaco@dominio.com`

### `RU-009` — E-mail tem comprimento máximo
O e-mail é limitado a **254 caracteres** (padrão da RFC 5321). E-mails maiores retornam **400 Bad Request**.

### `RU-010` — E-mail é normalizado para minúsculas
Qualquer e-mail é convertido para minúsculas antes da validação e persistência (conforme `RG-020`).

### `RU-011` — E-mail não pode conter espaços
Espaços dentro do e-mail (exceto o trim automático das extremidades) tornam o e-mail inválido.

---

## 🔐 Validação de Senha

### `RU-012` — Comprimento mínimo da senha
A senha deve ter no mínimo **8 caracteres**. Senhas mais curtas retornam **400 Bad Request** com detalhamento do problema.

### `RU-013` — Comprimento máximo da senha
A senha tem limite máximo de **64 caracteres**, evitando ataques de DoS via hash excessivamente longo.

### `RU-014` — Complexidade mínima da senha
A senha deve conter pelo menos:
- **Uma letra maiúscula** (A-Z)
- **Uma letra minúscula** (a-z)
- **Um número** (0-9)

**Exemplos válidos:**
- `Senha123`
- `MinhaChave1`
- `Provus@2026`

**Exemplos inválidos:**
- `senha123` (sem maiúscula)
- `SENHA123` (sem minúscula)
- `SenhaForte` (sem número)
- `Ab1` (curta demais)

### `RU-015` — Caracteres especiais não são obrigatórios
A senha **pode conter** caracteres especiais (`!@#$%&*` etc.), mas **não são obrigatórios**. Isso simplifica o cadastro para o usuário final mantendo segurança mínima.

### `RU-016` — Senha nunca aparece em logs ou respostas
Nenhum log, resposta da API, mensagem de erro ou retorno de consulta contém a senha em qualquer forma (texto puro, hash ou parcial).

---

## 👤 Validação de Nome

### `RU-017` — Comprimento do nome
O nome deve ter entre **2 e 100 caracteres** após remoção de espaços nas extremidades.

### `RU-018` — Nome aceita caracteres acentuados
Nomes com acentos, cedilhas e caracteres comuns do português são aceitos (`José`, `Conceição`, `Araújo`).

### `RU-019` — Nome não aceita apenas números
Nomes compostos exclusivamente por dígitos (`12345`) são rejeitados com **400 Bad Request**.

### `RU-020` — Nome tem espaços normalizados
Múltiplos espaços internos no nome são reduzidos a um único espaço. `"Ana  Martins"` vira `"Ana Martins"`.

---

## 🔑 Autenticação (Login)

### `RU-021` — Login exige e-mail e senha
A rota de login requer os campos **email** e **senha**. Campos ausentes retornam **400 Bad Request**.

### `RU-022` — Credenciais inválidas retornam mensagem genérica
Tanto e-mail inexistente quanto senha incorreta retornam a **mesma resposta**:

```
HTTP 401 Unauthorized
{
  "erro": {
    "codigo": "CREDENCIAIS_INVALIDAS",
    "mensagem": "E-mail ou senha incorretos."
  }
}
```

> 💡 **Justificativa:** Não revelar se o e-mail existe previne enumeração de usuários (técnica usada em ataques).

### `RU-023` — Login bem-sucedido retorna token JWT
Credenciais válidas retornam **200 OK** com o token no body:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Ana Martins",
    "email": "ana@provus.com"
  }
}
```

### `RU-024` — Login não retorna dados sensíveis
A resposta do login **não inclui** `senha_hash`, dados de outros usuários ou informações internas do sistema.

### `RU-025` — Payload do token contém ID e e-mail
O token JWT contém:
- `sub` — ID do usuário
- `email` — e-mail do usuário
- `iat` — timestamp de emissão
- `exp` — timestamp de expiração (24h após `iat`)

### `RU-026` — Login comprovado por comparação de hash
A senha enviada é comparada com o hash armazenado via `bcrypt.compare()`. A senha original **nunca** é recuperada, descriptografada ou logada.

### `RU-027` — Múltiplas sessões são permitidas
Um usuário pode ter vários tokens ativos simultaneamente (ex: logado no celular e no notebook). Não há invalidação de sessões antigas nesta versão.

---

## 👁️ Consulta de Perfil

### `RU-028` — Endpoint retorna apenas o próprio usuário
A rota `GET /api/usuarios/me` retorna os dados do usuário autenticado conforme o token. Não existe endpoint para consultar dados de outros usuários.

### `RU-029` — Resposta inclui dados públicos
A consulta retorna:
```json
{
  "id": 1,
  "nome": "Ana Martins",
  "email": "ana@provus.com",
  "criadoEm": "2026-04-22T10:30:00.000Z",
  "atualizadoEm": "2026-04-22T10:30:00.000Z"
}
```

### `RU-030` — Não existe listagem pública de usuários
Não há endpoint `GET /api/usuarios` que retorne todos os usuários. Esse tipo de consulta só existirá no futuro, em rotas administrativas (fase 6).

---

## ✏️ Atualização de Perfil

### `RU-031` — Campos atualizáveis
Via `PUT /api/usuarios/me`, o usuário pode atualizar apenas:
- `nome`
- `email`

Campos **não atualizáveis** por essa rota: `id`, `senha`, `criadoEm`.

### `RU-032` — Atualização parcial é permitida
O usuário pode enviar apenas um dos campos (`nome` OU `email`) sem precisar reenviar todos.

### `RU-033` — Novo e-mail não pode estar em uso
Se o usuário alterar o e-mail para um que já existe na base (de outro usuário), a API retorna **409 Conflict** com código `EMAIL_JA_CADASTRADO`.

### `RU-034` — Alterar e-mail para o próprio e-mail é permitido
Se o usuário enviar o mesmo e-mail que já possui, a operação é bem-sucedida sem alteração real. **Não** retorna conflito.

### `RU-035` — Timestamp `atualizadoEm` é atualizado
Qualquer alteração bem-sucedida atualiza o campo `atualizadoEm` automaticamente (conforme `RG-046`).

### `RU-036` — Atualização bem-sucedida retorna o usuário atualizado
Retorna **200 OK** com os dados atualizados.

---

## 🔄 Alteração de Senha

### `RU-037` — Alteração exige senha atual
Via `PUT /api/usuarios/me/senha`, o usuário deve enviar:
- `senhaAtual` — senha em uso
- `senhaNova` — nova senha desejada

### `RU-038` — Senha atual é validada antes da alteração
Se `senhaAtual` não bater com o hash armazenado, a API retorna **401 Unauthorized** com código `CREDENCIAIS_INVALIDAS`.

### `RU-039` — Nova senha segue as mesmas regras de validação
A `senhaNova` deve respeitar todas as regras de senha do cadastro (`RU-012` a `RU-015`).

### `RU-040` — Nova senha não pode ser igual à atual
Se `senhaNova` for idêntica à `senhaAtual`, a API retorna **400 Bad Request** com código `SENHA_IGUAL_ATUAL`.

### `RU-041` — Alteração bem-sucedida invalida nada
O JWT atual continua válido após a alteração de senha. O usuário **não precisa** fazer login novamente.

> 💡 **Justificativa:** Invalidar tokens exigiria controle de blacklist no servidor, complicando a arquitetura stateless. Em produção real, isso seria discutido caso a caso.

### `RU-042` — Resposta não inclui senha
A resposta da alteração é **200 OK** com body:
```json
{
  "mensagem": "Senha alterada com sucesso."
}
```

---

## 🗑️ Exclusão de Usuário

### `RU-043` — Exclusão é definitiva (hard delete)
A rota `DELETE /api/usuarios/me` remove **permanentemente** o usuário e todos os seus dados associados. Não há soft delete para usuários.

### `RU-044` — Exclusão exige confirmação por senha
A requisição de exclusão deve incluir no body:
```json
{
  "senha": "senhaAtual"
}
```

Senha incorreta retorna **401 Unauthorized** com código `CREDENCIAIS_INVALIDAS`.

### `RU-045` — Exclusão propaga para contas e transações
A exclusão do usuário propaga em cascata:
- Todas as **contas** do usuário são excluídas
- Todas as **transações** dessas contas são excluídas
- Todas as **categorias personalizadas** do usuário são excluídas
- **Categorias padrão do sistema** não são afetadas

### `RU-046` — Operação é atômica
A exclusão do usuário e seus dados relacionados ocorre dentro de uma **transação de banco**. Se algo falhar, nada é excluído.

### `RU-047` — Exclusão bem-sucedida retorna 204
A resposta é **204 No Content** sem body, conforme `RG-044`.

### `RU-048` — Token é invalidado implicitamente
Após a exclusão, o token continua "tecnicamente" válido até expirar, mas qualquer requisição com ele retorna **401** porque o usuário não existe mais.

### `RU-049` — E-mail fica disponível para novo cadastro
Após a exclusão, o e-mail pode ser usado novamente para criar uma nova conta (que será independente da anterior).

---

## 📊 Resumo das Regras

Total de **49 regras** de usuário, organizadas em 10 grupos:

| Grupo | Regras | IDs |
|---|:---:|---|
| Cadastro | 7 | RU-001 a RU-007 |
| Validação de e-mail | 4 | RU-008 a RU-011 |
| Validação de senha | 5 | RU-012 a RU-016 |
| Validação de nome | 4 | RU-017 a RU-020 |
| Autenticação (login) | 7 | RU-021 a RU-027 |
| Consulta de perfil | 3 | RU-028 a RU-030 |
| Atualização de perfil | 6 | RU-031 a RU-036 |
| Alteração de senha | 6 | RU-037 a RU-042 |
| Exclusão de usuário | 7 | RU-043 a RU-049 |
| **Total** | **49** | — |

### Matriz de códigos de erro usados

| Código | HTTP | Situação |
|---|:---:|---|
| `EMAIL_JA_CADASTRADO` | 409 | E-mail em uso (cadastro ou atualização) |
| `CREDENCIAIS_INVALIDAS` | 401 | Login falho, senha atual incorreta na alteração |
| `FORMATO_INVALIDO` | 400 | E-mail malformado, campos inválidos |
| `CAMPO_OBRIGATORIO` | 400 | Campo obrigatório ausente |
| `VALIDACAO` | 400 | Múltiplos campos inválidos |
| `SENHA_IGUAL_ATUAL` | 400 | Nova senha igual à atual |
| `TOKEN_AUSENTE` | 401 | Rota protegida sem token |
| `TOKEN_INVALIDO` | 401 | Token malformado |
| `TOKEN_EXPIRADO` | 401 | Token expirado |

---

## 🔗 Documentos Relacionados

- 📄 [Regras Gerais](./regras-gerais.md)
- 📄 [Regras de Conta](./regras-conta.md) *(próximo documento)*
- 📄 [Contratos da API](../03-arquitetura/api-contratos.md)
- 📄 [Modelo de Dados](../03-arquitetura/modelo-dados.md)
- 📄 [Personas](../01-visao/personas.md)

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
