# ✅ Casos de Teste — EP-001: Gestão de Usuários

> Casos de teste do Épico 1, elaborados com base nas User Stories de usuários e nas regras de negócio vigentes, mantendo rastreabilidade completa.

---

## 1. Objetivo

Definir os cenários de teste do EP-001 para validar cadastro, consulta de perfil, atualização de dados, alteração de senha e exclusão de conta.

---

## 2. Referências

- `docs/05-user-stories/ep-001-usuarios.md`
- `docs/02-regras-negocio/regras-usuario.md`
- `docs/02-regras-negocio/regras-gerais.md`
- `docs/03-arquitetura/api-contratos.md`
- `docs/06-testes/estrategia-testes.md`
- `docs/06-testes/plano-testes-fase-1.md`

---

## 3. Convenções

- **ID do caso:** `CT-EP001-USXXX-YY`
- **Tipo:** API (automatizável) + execução manual complementar
- **Rastreabilidade obrigatória:** `US` + `RU/RG`
- **Formato esperado de erro:** `{"erro":{"codigo":"...","mensagem":"..."}}`

---

## 4. Casos de teste

### US-001 — Cadastrar novo usuário (`POST /api/usuarios`)

#### CT-EP001-US001-01 — Cadastro com dados válidos
- **Rastreabilidade:** US-001, RU-001, RU-002, RU-005, RU-006, RG-001, RG-004
- **Prioridade:** Alta
- **Pré-condições:** e-mail ainda não cadastrado
- **Passos:**
  1. Enviar `POST /api/usuarios` com `nome`, `email`, `senha` válidos.
- **Resultado esperado:**
  - HTTP `201`
  - Body com `id`, `nome`, `email`, `criadoEm`, `atualizadoEm`
  - Sem `senha` ou `senha_hash`

#### CT-EP001-US001-02 — Cadastro com e-mail já existente
- **Rastreabilidade:** US-001, RU-003
- **Prioridade:** Alta
- **Pré-condições:** usuário pré-existente com o e-mail informado
- **Passos:**
  1. Repetir cadastro com e-mail já cadastrado.
- **Resultado esperado:**
  - HTTP `409`
  - `erro.codigo = EMAIL_JA_CADASTRADO`

#### CT-EP001-US001-03 — Cadastro sem nome
- **Rastreabilidade:** US-001, RU-001, RG-014, RG-017
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição sem campo `nome`.
- **Resultado esperado:**
  - HTTP `400`
  - erro de obrigatoriedade/validação para `nome`

#### CT-EP001-US001-04 — Cadastro sem e-mail
- **Rastreabilidade:** US-001, RU-001, RG-014, RG-017
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição sem campo `email`.
- **Resultado esperado:**
  - HTTP `400`
  - erro de obrigatoriedade/validação para `email`

#### CT-EP001-US001-05 — Cadastro sem senha
- **Rastreabilidade:** US-001, RU-001, RG-014, RG-017
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição sem campo `senha`.
- **Resultado esperado:**
  - HTTP `400`
  - erro de obrigatoriedade/validação para `senha`

#### CT-EP001-US001-06 — E-mail com formato inválido
- **Rastreabilidade:** US-001, RU-008, RU-011, RG-021
- **Prioridade:** Alta
- **Passos:**
  1. Enviar e-mail em formato inválido.
- **Resultado esperado:**
  - HTTP `400`
  - erro de formato/validação de e-mail

#### CT-EP001-US001-07 — E-mail acima do limite
- **Rastreabilidade:** US-001, RU-009
- **Prioridade:** Média
- **Passos:**
  1. Enviar e-mail com mais de 254 caracteres.
- **Resultado esperado:**
  - HTTP `400`
  - erro de validação de tamanho

#### CT-EP001-US001-08 — Senha abaixo do mínimo
- **Rastreabilidade:** US-001, RU-012
- **Prioridade:** Alta
- **Passos:**
  1. Enviar senha com menos de 8 caracteres.
- **Resultado esperado:**
  - HTTP `400`
  - detalhe de regra de senha não atendida

#### CT-EP001-US001-09 — Senha sem maiúscula
- **Rastreabilidade:** US-001, RU-014
- **Prioridade:** Média
- **Passos:**
  1. Enviar senha sem letra maiúscula.
- **Resultado esperado:**
  - HTTP `400`

#### CT-EP001-US001-10 — Senha sem minúscula
- **Rastreabilidade:** US-001, RU-014
- **Prioridade:** Média
- **Passos:**
  1. Enviar senha sem letra minúscula.
- **Resultado esperado:**
  - HTTP `400`

#### CT-EP001-US001-11 — Senha sem número
- **Rastreabilidade:** US-001, RU-014
- **Prioridade:** Média
- **Passos:**
  1. Enviar senha sem dígito.
- **Resultado esperado:**
  - HTTP `400`

#### CT-EP001-US001-12 — E-mail normalizado para minúsculas
- **Rastreabilidade:** US-001, RU-010, RG-020
- **Prioridade:** Média
- **Passos:**
  1. Cadastrar usuário com e-mail em caixa mista.
- **Resultado esperado:**
  - resposta/persistência com e-mail em minúsculas

#### CT-EP001-US001-13 — Nome com espaços normalizados
- **Rastreabilidade:** US-001, RU-020, RG-016
- **Prioridade:** Média
- **Passos:**
  1. Cadastrar usuário com nome contendo múltiplos espaços.
- **Resultado esperado:**
  - nome retornado sem espaços excedentes

#### CT-EP001-US001-14 — Nome inválido (somente números)
- **Rastreabilidade:** US-001, RU-019
- **Prioridade:** Média
- **Passos:**
  1. Enviar `nome` composto apenas por números.
- **Resultado esperado:**
  - HTTP `400`

---

### US-002 — Consultar próprio perfil (`GET /api/usuarios/me`)

#### CT-EP001-US002-01 — Consulta com token válido
- **Rastreabilidade:** US-002, RU-028, RU-029, RG-008
- **Prioridade:** Alta
- **Pré-condições:** token JWT válido
- **Passos:**
  1. Chamar `GET /api/usuarios/me` com header `Authorization: Bearer <token>`.
- **Resultado esperado:**
  - HTTP `200`
  - retorno dos dados do próprio usuário
  - sem dados sensíveis

#### CT-EP001-US002-02 — Consulta sem token
- **Rastreabilidade:** US-002, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Chamar endpoint sem header `Authorization`.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

#### CT-EP001-US002-03 — Consulta com token inválido
- **Rastreabilidade:** US-002, RG-010
- **Prioridade:** Alta
- **Passos:**
  1. Chamar endpoint com token malformado/inválido.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_INVALIDO`

#### CT-EP001-US002-04 — Consulta com token expirado
- **Rastreabilidade:** US-002, RG-011
- **Prioridade:** Alta
- **Passos:**
  1. Chamar endpoint com token expirado.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_EXPIRADO`

#### CT-EP001-US002-05 — Verificar não exposição de dados sensíveis
- **Rastreabilidade:** US-002, RG-004
- **Prioridade:** Média
- **Passos:**
  1. Realizar consulta de perfil válida.
  2. Inspecionar resposta.
- **Resultado esperado:**
  - ausência de `senha` e `senha_hash`

---

### US-003 — Atualizar dados do perfil (`PUT /api/usuarios/me`)

#### CT-EP001-US003-01 — Atualização completa de nome e e-mail
- **Rastreabilidade:** US-003, RU-031, RU-036
- **Prioridade:** Alta
- **Pré-condições:** token válido; novo e-mail disponível
- **Passos:**
  1. Enviar `PUT /api/usuarios/me` com novo `nome` e novo `email`.
- **Resultado esperado:**
  - HTTP `200`
  - dados atualizados retornados

#### CT-EP001-US003-02 — Atualização parcial apenas de nome
- **Rastreabilidade:** US-003, RU-032
- **Prioridade:** Alta
- **Passos:**
  1. Enviar atualização apenas com `nome`.
- **Resultado esperado:**
  - HTTP `200`
  - apenas o nome alterado

#### CT-EP001-US003-03 — E-mail em uso por outro usuário
- **Rastreabilidade:** US-003, RU-033
- **Prioridade:** Alta
- **Passos:**
  1. Atualizar para e-mail já usado por outro usuário.
- **Resultado esperado:**
  - HTTP `409`
  - `erro.codigo = EMAIL_JA_CADASTRADO`

#### CT-EP001-US003-04 — Atualizar para o próprio e-mail
- **Rastreabilidade:** US-003, RU-034
- **Prioridade:** Média
- **Passos:**
  1. Atualizar mantendo o mesmo e-mail atual.
- **Resultado esperado:**
  - HTTP `200`
  - sem conflito

#### CT-EP001-US003-05 — Nome inválido na atualização
- **Rastreabilidade:** US-003, RU-017, RU-019
- **Prioridade:** Média
- **Passos:**
  1. Enviar nome inválido (ex.: somente números).
- **Resultado esperado:**
  - HTTP `400`

#### CT-EP001-US003-06 — Atualização sem token
- **Rastreabilidade:** US-003, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Chamar endpoint sem token.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`

---

### US-004 — Alterar senha (`PUT /api/usuarios/me/senha`)

#### CT-EP001-US004-01 — Alteração com senha atual correta
- **Rastreabilidade:** US-004, RU-037, RU-038, RU-039, RU-042
- **Prioridade:** Alta
- **Pré-condições:** token válido; senha atual conhecida
- **Passos:**
  1. Enviar `senhaAtual` correta e `senhaNova` válida.
- **Resultado esperado:**
  - HTTP `200`
  - mensagem de sucesso

#### CT-EP001-US004-02 — Senha atual incorreta
- **Rastreabilidade:** US-004, RU-038
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `senhaAtual` incorreta.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = CREDENCIAIS_INVALIDAS`

#### CT-EP001-US004-03 — Nova senha igual à atual
- **Rastreabilidade:** US-004, RU-040
- **Prioridade:** Alta
- **Passos:**
  1. Enviar `senhaNova` igual à `senhaAtual`.
- **Resultado esperado:**
  - HTTP `400`
  - `erro.codigo = SENHA_IGUAL_ATUAL`

#### CT-EP001-US004-04 — Nova senha inválida por regra de complexidade
- **Rastreabilidade:** US-004, RU-039, RU-012, RU-013, RU-014
- **Prioridade:** Alta
- **Passos:**
  1. Enviar senha nova sem atender requisitos.
- **Resultado esperado:**
  - HTTP `400`
  - erro de validação de senha

#### CT-EP001-US004-05 — Campo obrigatório ausente
- **Rastreabilidade:** US-004, RU-037, RG-014
- **Prioridade:** Média
- **Passos:**
  1. Omitir `senhaAtual` ou `senhaNova`.
- **Resultado esperado:**
  - HTTP `400`

#### CT-EP001-US004-06 — Token permanece válido após alteração
- **Rastreabilidade:** US-004, RU-041
- **Prioridade:** Média
- **Passos:**
  1. Alterar senha com sucesso.
  2. Reutilizar token atual em rota protegida.
- **Resultado esperado:**
  - acesso permitido

#### CT-EP001-US004-07 — Não expor senha/hash na resposta
- **Rastreabilidade:** US-004, RG-004
- **Prioridade:** Média
- **Passos:**
  1. Executar alteração válida.
  2. Inspecionar body.
- **Resultado esperado:**
  - sem dados sensíveis na resposta

---

### US-005 — Excluir própria conta (`DELETE /api/usuarios/me`)

#### CT-EP001-US005-01 — Exclusão com senha correta
- **Rastreabilidade:** US-005, RU-043, RU-044, RU-047
- **Prioridade:** Alta
- **Pré-condições:** token válido; senha correta
- **Passos:**
  1. Enviar `DELETE /api/usuarios/me` com senha de confirmação.
- **Resultado esperado:**
  - HTTP `204`
  - sem body de resposta

#### CT-EP001-US005-02 — Exclusão com senha incorreta
- **Rastreabilidade:** US-005, RU-044
- **Prioridade:** Alta
- **Passos:**
  1. Tentar excluir conta com senha incorreta.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = CREDENCIAIS_INVALIDAS`

#### CT-EP001-US005-03 — Exclusão sem senha de confirmação
- **Rastreabilidade:** US-005, RU-044, RG-014
- **Prioridade:** Alta
- **Passos:**
  1. Enviar exclusão sem campo `senha`.
- **Resultado esperado:**
  - HTTP `400`

#### CT-EP001-US005-04 — Token antigo inválido após exclusão
- **Rastreabilidade:** US-005, RU-048
- **Prioridade:** Média
- **Passos:**
  1. Excluir usuário com sucesso.
  2. Reutilizar token antigo.
- **Resultado esperado:**
  - HTTP `401`

#### CT-EP001-US005-05 — Reuso do e-mail após exclusão
- **Rastreabilidade:** US-005, RU-049
- **Prioridade:** Média
- **Passos:**
  1. Excluir conta.
  2. Cadastrar novo usuário com o mesmo e-mail.
- **Resultado esperado:**
  - novo cadastro permitido

#### CT-EP001-US005-06 — Exclusão em cascata dos dados vinculados
- **Rastreabilidade:** US-005, RU-045, RC-052, RK-053, RT-071
- **Prioridade:** Alta
- **Pré-condições:** usuário com dados relacionados
- **Passos:**
  1. Excluir usuário.
  2. Validar ausência de dados vinculados conforme regra.
- **Resultado esperado:**
  - remoção em cascata conforme documentação

#### CT-EP001-US005-07 — Atomicidade da exclusão
- **Rastreabilidade:** US-005, RU-046, RG-038
- **Prioridade:** Média
- **Passos:**
  1. Executar cenário controlado com falha intermediária.
- **Resultado esperado:**
  - nenhuma exclusão parcial
  - consistência preservada

---

## 5. Resumo de cobertura

- **Total de casos:** 39
- **Distribuição por US:**
  - US-001: 14
  - US-002: 5
  - US-003: 6
  - US-004: 7
  - US-005: 7

---

## 6. Próximos passos

1. Classificar quais casos entram primeiro na automação (`tipo:testes`) por risco.
2. Selecionar amostra crítica para execução manual exploratória com evidência.
3. Evoluir para matriz de rastreabilidade de execução (`planejado`, `executado`, `aprovado`, `reprovado`).