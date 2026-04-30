# Casos de Teste — EP-001: Gestao de Usuarios

> Casos de teste do Epico 1, elaborados com base nas User Stories de usuarios e nas regras de negocio vigentes, mantendo rastreabilidade completa conforme ISO/IEC/IEEE 29119-3.

---

## 1. Objetivo

Definir os cenarios de teste do EP-001 para validar cadastro, consulta de perfil, atualizacao de dados, alteracao de senha e exclusao de conta.

---

## 2. Referencias

- `docs/05-user-stories/ep-001-usuarios.md`
- `docs/02-regras-negocio/regras-usuario.md`
- `docs/02-regras-negocio/regras-gerais.md`
- `docs/03-arquitetura/api-contratos.md`
- `docs/06-testes/estrategia-testes.md`
- `docs/06-testes/plano-testes-fase-1.md`

---

## 3. Convencoes

- **ID do caso:** `CT-EP001-USXXX-YY`
- **Tipo:** API (automatizavel) + execucao manual complementar
- **Rastreabilidade obrigatoria:** `US` + `RU/RG`
- **Formato esperado de erro:** `{"erro":{"codigo":"...","mensagem":"..."}}`

---

## 4. Casos de teste

### US-001 — Cadastrar novo usuario (`POST /api/usuarios`)

#### CT-EP001-US001-01 — Cadastro com dados validos

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-01 |
| **Titulo** | Validar que um novo usuario e cadastrado com sucesso ao enviar nome, email e senha validos |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-001, RU-001, RU-002, RU-005, RU-006, RG-001, RG-004 |
| **Pre-Condicoes** | - Email informado ainda nao cadastrado no sistema |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` com `nome`, `email` e `senha` validos | HTTP `201` |
| 2 | Inspecionar body da resposta | Body contem `id`, `nome`, `email`, `criadoEm`, `atualizadoEm` e nao contem `senha` ou `senha_hash` |

| **Pos-Condicoes** | - Usuario persistido no banco de dados com senha armazenada como hash |

---

#### CT-EP001-US001-02 — Cadastro com e-mail ja existente

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-02 |
| **Titulo** | Validar que o sistema rejeita cadastro quando o e-mail ja esta em uso por outro usuario |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-001, RU-003 |
| **Pre-Condicoes** | - Usuario pre-existente cadastrado com o e-mail que sera informado |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` com e-mail ja cadastrado | HTTP `409` com `erro.codigo = EMAIL_JA_CADASTRADO` |

| **Pos-Condicoes** | - Usuario original permanece inalterado no banco de dados |

---

#### CT-EP001-US001-03 — Cadastro sem campo nome

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-03 |
| **Titulo** | Validar que o sistema rejeita cadastro quando o campo nome esta ausente |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-001, RU-001, RG-014, RG-017 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` sem o campo `nome` | HTTP `400` com detalhes de obrigatoriedade/validacao para o campo `nome` |

| **Pos-Condicoes** | - Nenhum usuario criado no banco de dados |

---

#### CT-EP001-US001-04 — Cadastro sem campo email

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-04 |
| **Titulo** | Validar que o sistema rejeita cadastro quando o campo email esta ausente |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-001, RU-001, RG-014, RG-017 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` sem o campo `email` | HTTP `400` com detalhes de obrigatoriedade/validacao para o campo `email` |

| **Pos-Condicoes** | - Nenhum usuario criado no banco de dados |

---

#### CT-EP001-US001-05 — Cadastro sem campo senha

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-05 |
| **Titulo** | Validar que o sistema rejeita cadastro quando o campo senha esta ausente |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-001, RU-001, RG-014, RG-017 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` sem o campo `senha` | HTTP `400` com detalhes de obrigatoriedade/validacao para o campo `senha` |

| **Pos-Condicoes** | - Nenhum usuario criado no banco de dados |

---

#### CT-EP001-US001-06 — E-mail com formato invalido (sem @)

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-06 |
| **Titulo** | Validar que o sistema rejeita cadastro quando o e-mail possui formato invalido |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-001, RU-008, RU-011, RG-021 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` com e-mail em formato invalido (ex.: sem `@`) | HTTP `400` com erro de formato/validacao de e-mail |

| **Pos-Condicoes** | - Nenhum usuario criado no banco de dados |

---

#### CT-EP001-US001-07 — E-mail acima do limite de 254 caracteres

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-07 |
| **Titulo** | Validar que o sistema rejeita cadastro quando o e-mail excede 254 caracteres |
| **Prioridade** | Media |
| **Rastreabilidade** | US-001, RU-009 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` com e-mail contendo mais de 254 caracteres | HTTP `400` com erro de validacao de tamanho |

| **Pos-Condicoes** | - Nenhum usuario criado no banco de dados |

---

#### CT-EP001-US001-08 — Senha com menos de 8 caracteres

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-08 |
| **Titulo** | Validar que o sistema rejeita cadastro quando a senha possui menos de 8 caracteres |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-001, RU-012 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` com senha de menos de 8 caracteres | HTTP `400` com detalhe de regra de senha nao atendida |

| **Pos-Condicoes** | - Nenhum usuario criado no banco de dados |

---

#### CT-EP001-US001-09 — Senha sem letra maiuscula

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-09 |
| **Titulo** | Validar que o sistema rejeita cadastro quando a senha nao contem letra maiuscula |
| **Prioridade** | Media |
| **Rastreabilidade** | US-001, RU-014 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` com senha sem letra maiuscula | HTTP `400` com erro de complexidade de senha |

| **Pos-Condicoes** | - Nenhum usuario criado no banco de dados |

---

#### CT-EP001-US001-10 — Senha sem letra minuscula

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-10 |
| **Titulo** | Validar que o sistema rejeita cadastro quando a senha nao contem letra minuscula |
| **Prioridade** | Media |
| **Rastreabilidade** | US-001, RU-014 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` com senha sem letra minuscula | HTTP `400` com erro de complexidade de senha |

| **Pos-Condicoes** | - Nenhum usuario criado no banco de dados |

---

#### CT-EP001-US001-11 — Senha sem digito numerico

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-11 |
| **Titulo** | Validar que o sistema rejeita cadastro quando a senha nao contem digito numerico |
| **Prioridade** | Media |
| **Rastreabilidade** | US-001, RU-014 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` com senha sem nenhum digito numerico | HTTP `400` com erro de complexidade de senha |

| **Pos-Condicoes** | - Nenhum usuario criado no banco de dados |

---

#### CT-EP001-US001-12 — E-mail normalizado para minusculas

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-12 |
| **Titulo** | Validar que o sistema normaliza o e-mail para letras minusculas ao cadastrar usuario |
| **Prioridade** | Media |
| **Rastreabilidade** | US-001, RU-010, RG-020 |
| **Pre-Condicoes** | - Email informado ainda nao cadastrado no sistema |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` com e-mail em caixa mista (ex.: `User@Email.COM`) | HTTP `201` |
| 2 | Inspecionar campo `email` na resposta | Email retornado inteiramente em letras minusculas |

| **Pos-Condicoes** | - Usuario persistido com email normalizado em minusculas |

---

#### CT-EP001-US001-13 — Nome com espacos normalizados

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-13 |
| **Titulo** | Validar que o sistema remove espacos excedentes do nome ao cadastrar usuario |
| **Prioridade** | Media |
| **Rastreabilidade** | US-001, RU-020, RG-016 |
| **Pre-Condicoes** | - Email informado ainda nao cadastrado no sistema |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` com nome contendo multiplos espacos consecutivos | HTTP `201` |
| 2 | Inspecionar campo `nome` na resposta | Nome retornado sem espacos excedentes (trim + colapsar espacos internos) |

| **Pos-Condicoes** | - Usuario persistido com nome normalizado |

---

#### CT-EP001-US001-14 — Nome composto apenas por numeros

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US001-14 |
| **Titulo** | Validar que o sistema rejeita cadastro quando o nome e composto apenas por numeros |
| **Prioridade** | Media |
| **Rastreabilidade** | US-001, RU-019 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/usuarios` com `nome` contendo apenas digitos (ex.: `12345`) | HTTP `400` com erro de validacao de nome |

| **Pos-Condicoes** | - Nenhum usuario criado no banco de dados |

---

### US-002 — Consultar proprio perfil (`GET /api/usuarios/me`)

#### CT-EP001-US002-01 — Consulta com token valido

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US002-01 |
| **Titulo** | Validar que o sistema retorna os dados do perfil do usuario autenticado com token valido |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-002, RU-028, RU-029, RG-008 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/usuarios/me` com header `Authorization: Bearer <token>` | HTTP `200` |
| 2 | Inspecionar body da resposta | Body contem `id`, `nome`, `email`, `criadoEm`, `atualizadoEm` e nao contem `senha` ou `senha_hash` |

| **Pos-Condicoes** | - Nenhuma alteracao no estado do sistema |

---

#### CT-EP001-US002-02 — Consulta sem token de autenticacao

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US002-02 |
| **Titulo** | Validar que o sistema rejeita consulta de perfil quando o header Authorization esta ausente |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-002, RG-009 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/usuarios/me` sem header `Authorization` | HTTP `401` com `erro.codigo = TOKEN_AUSENTE` |

| **Pos-Condicoes** | - Nenhuma alteracao no estado do sistema |

---

#### CT-EP001-US002-03 — Consulta com token invalido

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US002-03 |
| **Titulo** | Validar que o sistema rejeita consulta de perfil quando o token JWT e malformado ou invalido |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-002, RG-010 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/usuarios/me` com token malformado ou invalido | HTTP `401` com `erro.codigo = TOKEN_INVALIDO` |

| **Pos-Condicoes** | - Nenhuma alteracao no estado do sistema |

---

#### CT-EP001-US002-04 — Consulta com token expirado

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US002-04 |
| **Titulo** | Validar que o sistema rejeita consulta de perfil quando o token JWT esta expirado |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-002, RG-011 |
| **Pre-Condicoes** | - Token JWT com data de expiracao no passado |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/usuarios/me` com token expirado | HTTP `401` com `erro.codigo = TOKEN_EXPIRADO` |

| **Pos-Condicoes** | - Nenhuma alteracao no estado do sistema |

---

#### CT-EP001-US002-05 — Nao exposicao de dados sensiveis no perfil

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US002-05 |
| **Titulo** | Validar que a resposta da consulta de perfil nao expoe senha, hash ou outros dados sensiveis |
| **Prioridade** | Media |
| **Rastreabilidade** | US-002, RG-004 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `GET /api/usuarios/me` com token valido | HTTP `200` |
| 2 | Inspecionar todas as propriedades do body da resposta | Ausencia total de campos `senha`, `senha_hash` ou qualquer dado sensivel |

| **Pos-Condicoes** | - Nenhuma alteracao no estado do sistema |

---

### US-003 — Atualizar dados do perfil (`PUT /api/usuarios/me`)

#### CT-EP001-US003-01 — Atualizacao completa de nome e e-mail

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US003-01 |
| **Titulo** | Validar que o sistema atualiza nome e e-mail do usuario autenticado com dados validos |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-003, RU-031, RU-036 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login\n- Novo e-mail nao utilizado por outro usuario |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me` com novo `nome` e novo `email` | HTTP `200` com dados atualizados retornados no body |

| **Pos-Condicoes** | - Nome e email do usuario alterados no banco de dados\n- Campo `atualizadoEm` reflete a data/hora da operacao |

---

#### CT-EP001-US003-02 — Atualizacao parcial apenas do nome

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US003-02 |
| **Titulo** | Validar que o sistema permite atualizar apenas o nome mantendo o e-mail inalterado |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-003, RU-032 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me` apenas com campo `nome` | HTTP `200` com nome atualizado e email inalterado |

| **Pos-Condicoes** | - Apenas o nome do usuario alterado no banco de dados |

---

#### CT-EP001-US003-03 — E-mail em uso por outro usuario

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US003-03 |
| **Titulo** | Validar que o sistema rejeita atualizacao quando o novo e-mail ja esta em uso por outro usuario |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-003, RU-033 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login\n- Outro usuario cadastrado com o e-mail desejado |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me` com e-mail ja utilizado por outro usuario | HTTP `409` com `erro.codigo = EMAIL_JA_CADASTRADO` |

| **Pos-Condicoes** | - Dados do usuario permanecem inalterados |

---

#### CT-EP001-US003-04 — Atualizar mantendo o proprio e-mail

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US003-04 |
| **Titulo** | Validar que o sistema permite atualizacao enviando o proprio e-mail atual sem gerar conflito |
| **Prioridade** | Media |
| **Rastreabilidade** | US-003, RU-034 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me` com o mesmo e-mail atualmente cadastrado | HTTP `200` sem erro de conflito |

| **Pos-Condicoes** | - Dados do usuario permanecem consistentes |

---

#### CT-EP001-US003-05 — Nome invalido (somente numeros) na atualizacao

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US003-05 |
| **Titulo** | Validar que o sistema rejeita atualizacao quando o nome contem apenas numeros |
| **Prioridade** | Media |
| **Rastreabilidade** | US-003, RU-017, RU-019 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me` com `nome` composto apenas por numeros | HTTP `400` com erro de validacao de nome |

| **Pos-Condicoes** | - Dados do usuario permanecem inalterados |

---

#### CT-EP001-US003-06 — Atualizacao sem token de autenticacao

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US003-06 |
| **Titulo** | Validar que o sistema rejeita atualizacao de perfil quando o token esta ausente |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-003, RG-009 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me` sem header `Authorization` | HTTP `401` com `erro.codigo = TOKEN_AUSENTE` |

| **Pos-Condicoes** | - Nenhuma alteracao no estado do sistema |

---

### US-004 — Alterar senha (`PUT /api/usuarios/me/senha`)

#### CT-EP001-US004-01 — Alteracao de senha com senha atual correta e nova senha valida

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US004-01 |
| **Titulo** | Validar que o sistema altera a senha quando a senha atual esta correta e a nova senha atende os requisitos |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-004, RU-037, RU-038, RU-039, RU-042 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login\n- Senha atual conhecida |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me/senha` com `senhaAtual` correta e `senhaNova` valida | HTTP `200` com mensagem de sucesso |

| **Pos-Condicoes** | - Senha do usuario atualizada no banco de dados (hash diferente)\n- Login com a nova senha funciona corretamente |

---

#### CT-EP001-US004-02 — Alteracao de senha com senha atual incorreta

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US004-02 |
| **Titulo** | Validar que o sistema rejeita alteracao de senha quando a senha atual informada esta incorreta |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-004, RU-038 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me/senha` com `senhaAtual` incorreta | HTTP `401` com `erro.codigo = CREDENCIAIS_INVALIDAS` |

| **Pos-Condicoes** | - Senha do usuario permanece inalterada |

---

#### CT-EP001-US004-03 — Nova senha igual a senha atual

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US004-03 |
| **Titulo** | Validar que o sistema rejeita alteracao quando a nova senha e identica a senha atual |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-004, RU-040 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login\n- Senha atual conhecida |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me/senha` com `senhaNova` igual a `senhaAtual` | HTTP `400` com `erro.codigo = SENHA_IGUAL_ATUAL` |

| **Pos-Condicoes** | - Senha do usuario permanece inalterada |

---

#### CT-EP001-US004-04 — Nova senha invalida por regra de complexidade

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US004-04 |
| **Titulo** | Validar que o sistema rejeita alteracao quando a nova senha nao atende os requisitos de complexidade |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-004, RU-039, RU-012, RU-014 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login\n- Senha atual conhecida |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me/senha` com `senhaAtual` correta e `senhaNova` que nao atende requisitos de complexidade | HTTP `400` com erro de validacao de senha |

| **Pos-Condicoes** | - Senha do usuario permanece inalterada |

---

#### CT-EP001-US004-05 — Campo obrigatorio ausente na alteracao de senha

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US004-05 |
| **Titulo** | Validar que o sistema rejeita alteracao quando campo obrigatorio (senhaAtual ou senhaNova) esta ausente |
| **Prioridade** | Media |
| **Rastreabilidade** | US-004, RU-037, RG-014 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me/senha` omitindo `senhaAtual` ou `senhaNova` | HTTP `400` com erro de campo obrigatorio |

| **Pos-Condicoes** | - Senha do usuario permanece inalterada |

---

#### CT-EP001-US004-06 — Token permanece valido apos alteracao de senha

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US004-06 |
| **Titulo** | Validar que o token JWT atual permanece valido apos a alteracao de senha ser concluida |
| **Prioridade** | Media |
| **Rastreabilidade** | US-004, RU-041 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login\n- Senha atual conhecida |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me/senha` com dados validos | HTTP `200` com mensagem de sucesso |
| 2 | Enviar `GET /api/usuarios/me` com o mesmo token utilizado no passo 1 | HTTP `200` com dados do perfil retornados normalmente |

| **Pos-Condicoes** | - Token JWT continua funcional para rotas protegidas |

---

#### CT-EP001-US004-07 — Nao exposicao de senha ou hash na resposta de alteracao

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US004-07 |
| **Titulo** | Validar que a resposta da alteracao de senha nao expoe senha, hash ou dados sensiveis |
| **Prioridade** | Media |
| **Rastreabilidade** | US-004, RG-004 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login\n- Senha atual conhecida |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `PUT /api/usuarios/me/senha` com dados validos | HTTP `200` |
| 2 | Inspecionar todas as propriedades do body da resposta | Ausencia total de campos `senha`, `senha_hash`, `senhaAtual`, `senhaNova` ou qualquer dado sensivel |

| **Pos-Condicoes** | - Nenhuma exposicao de dados sensiveis |

---

### US-005 — Excluir propria conta (`DELETE /api/usuarios/me`)

#### CT-EP001-US005-01 — Exclusao com senha de confirmacao correta

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US005-01 |
| **Titulo** | Validar que o sistema exclui a conta do usuario quando a senha de confirmacao esta correta |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-005, RU-043, RU-044, RU-047 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login\n- Senha atual conhecida |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `DELETE /api/usuarios/me` com `senha` de confirmacao correta | HTTP `204` sem body de resposta |

| **Pos-Condicoes** | - Usuario removido do banco de dados\n- Dados vinculados removidos conforme regras de cascata |

---

#### CT-EP001-US005-02 — Exclusao com senha de confirmacao incorreta

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US005-02 |
| **Titulo** | Validar que o sistema rejeita exclusao de conta quando a senha de confirmacao esta incorreta |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-005, RU-044 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `DELETE /api/usuarios/me` com senha incorreta | HTTP `401` com `erro.codigo = CREDENCIAIS_INVALIDAS` |

| **Pos-Condicoes** | - Usuario permanece inalterado no banco de dados |

---

#### CT-EP001-US005-03 — Exclusao sem senha de confirmacao

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US005-03 |
| **Titulo** | Validar que o sistema rejeita exclusao de conta quando o campo senha esta ausente |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-005, RU-044, RG-014 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `DELETE /api/usuarios/me` sem o campo `senha` | HTTP `400` com erro de campo obrigatorio |

| **Pos-Condicoes** | - Usuario permanece inalterado no banco de dados |

---

#### CT-EP001-US005-04 — Token invalido apos exclusao da conta

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US005-04 |
| **Titulo** | Validar que o token JWT utilizado para exclusao se torna invalido apos a conta ser removida |
| **Prioridade** | Media |
| **Rastreabilidade** | US-005, RU-048 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login\n- Senha atual conhecida |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `DELETE /api/usuarios/me` com senha correta | HTTP `204` |
| 2 | Enviar `GET /api/usuarios/me` com o token utilizado no passo 1 | HTTP `404` indicando que o usuario nao existe mais |

| **Pos-Condicoes** | - Token nao permite mais acesso a nenhuma rota protegida |

---

#### CT-EP001-US005-05 — E-mail disponivel para recadastro apos exclusao

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US005-05 |
| **Titulo** | Validar que o e-mail fica disponivel para novo cadastro apos a exclusao da conta |
| **Prioridade** | Media |
| **Rastreabilidade** | US-005, RU-049 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login\n- Senha atual conhecida |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `DELETE /api/usuarios/me` com senha correta | HTTP `204` |
| 2 | Enviar `POST /api/usuarios` com o mesmo e-mail do usuario excluido | HTTP `201` com novo usuario cadastrado com sucesso |

| **Pos-Condicoes** | - Novo usuario criado com o e-mail que anteriormente pertencia ao usuario excluido |

---

#### CT-EP001-US005-06 — Usuario removido do banco de dados apos exclusao

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US005-06 |
| **Titulo** | Validar que o registro do usuario e seus dados vinculados sao removidos do banco de dados apos exclusao |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-005, RU-045, RT-071 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema\n- Token JWT valido obtido via login\n- Senha atual conhecida |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `DELETE /api/usuarios/me` com senha correta | HTTP `204` |
| 2 | Consultar banco de dados diretamente para verificar ausencia do registro | Registro do usuario e dados vinculados ausentes no banco de dados |

| **Pos-Condicoes** | - Nenhum registro do usuario remanescente no banco de dados |

---

#### CT-EP001-US005-07 — Atomicidade da operacao de exclusao

| Campo | Valor |
|---|---|
| **ID** | CT-EP001-US005-07 |
| **Titulo** | Validar que a exclusao de conta e atomica (tudo ou nada), sem exclusao parcial em caso de falha |
| **Prioridade** | Media |
| **Rastreabilidade** | US-005, RU-046, RG-038 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema com dados vinculados\n- Token JWT valido obtido via login\n- Cenario controlado para simular falha intermediaria |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Executar cenario de exclusao com falha intermediaria simulada | Operacao falha sem exclusao parcial |
| 2 | Verificar consistencia dos dados no banco de dados | Todos os dados do usuario permanecem intactos (nenhuma exclusao parcial) |

| **Pos-Condicoes** | - Consistencia total do banco de dados preservada |

---

## 5. Resumo de cobertura

| User Story | Descricao | Quantidade de CTs |
|---|---|---|
| US-001 | Cadastrar novo usuario | 14 |
| US-002 | Consultar proprio perfil | 5 |
| US-003 | Atualizar dados do perfil | 6 |
| US-004 | Alterar senha | 7 |
| US-005 | Excluir propria conta | 7 |
| **Total** | | **39** |

---

## 6. Proximos passos

1. Classificar quais casos entram primeiro na automacao (`tipo:testes`) por risco.
2. Selecionar amostra critica para execucao manual exploratoria com evidencia.
3. Evoluir para matriz de rastreabilidade de execucao (`planejado`, `executado`, `aprovado`, `reprovado`).
