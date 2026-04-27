# ✅ Casos de Teste — EP-002: Autenticação

> Casos de teste do Épico 2, elaborados com base nas User Stories de autenticação e nas regras de negócio vigentes, mantendo rastreabilidade completa.

---

## 1. Objetivo

Definir os cenários de teste do EP-002 para validar o login com JWT (`POST /api/auth/login`), o middleware de proteção de rotas e o tratamento dos cenários de token ausente, inválido ou expirado.

---

## 2. Referências

- `docs/05-user-stories/ep-002-autenticacao.md`
- `docs/02-regras-negocio/regras-usuario.md`
- `docs/02-regras-negocio/regras-gerais.md`
- `docs/03-arquitetura/api-contratos.md`
- `docs/06-testes/estrategia-testes.md`
- `docs/06-testes/plano-testes-fase-1.md`

---

## 3. Convenções

- **ID do caso:** `CT-EP002-USXXX-YY`
- **Tipo:** API (automatizável) + execução manual complementar
- **Rastreabilidade obrigatória:** `US` + `RU/RG`
- **Formato esperado de erro:** `{"erro":{"codigo":"...","mensagem":"..."}}`
- **Rota auxiliar para US-007/US-008:** quando não houver rota protegida real ainda implementada, os casos podem ser executados contra `GET /api/usuarios/me` (após US-002) ou contra rota auxiliar dedicada de testes do middleware.

---

## 4. Casos de teste

### US-006 — Autenticar usuário (`POST /api/auth/login`)

#### CT-EP002-US006-01 — Login com credenciais válidas
- **Rastreabilidade:** US-006, RU-021, RU-023, RU-024, RU-026, RG-001
- **Prioridade:** Alta
- **Pré-condições:** usuário cadastrado com `email` e `senha` conhecidos
- **Passos:**
  1. Enviar `POST /api/auth/login` com `email` e `senha` corretos.
- **Resultado esperado:**
  - HTTP `200`
  - Body com `token` e `usuario`
  - `usuario` contém `id`, `nome`, `email`
  - sem `senha` ou `senha_hash`

#### CT-EP002-US006-02 — Login com e-mail não cadastrado
- **Rastreabilidade:** US-006, RU-022
- **Prioridade:** Alta
- **Pré-condições:** e-mail informado não existe na base
- **Passos:**
  1. Enviar requisição de login com `email` inexistente.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = CREDENCIAIS_INVALIDAS`
  - mensagem genérica (não revela se o e-mail existe)

#### CT-EP002-US006-03 — Login com senha incorreta
- **Rastreabilidade:** US-006, RU-022, RU-026
- **Prioridade:** Alta
- **Pré-condições:** usuário cadastrado
- **Passos:**
  1. Enviar requisição de login com `email` correto e `senha` errada.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = CREDENCIAIS_INVALIDAS`
  - resposta idêntica à do CT-EP002-US006-02

#### CT-EP002-US006-04 — Login sem campo email
- **Rastreabilidade:** US-006, RU-021, RG-014
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição de login sem o campo `email`.
- **Resultado esperado:**
  - HTTP `400`
  - erro de obrigatoriedade/validação para `email`

#### CT-EP002-US006-05 — Login sem campo senha
- **Rastreabilidade:** US-006, RU-021, RG-014
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição de login sem o campo `senha`.
- **Resultado esperado:**
  - HTTP `400`
  - erro de obrigatoriedade/validação para `senha`

#### CT-EP002-US006-06 — Body sem JSON válido
- **Rastreabilidade:** US-006, RG-007
- **Prioridade:** Média
- **Passos:**
  1. Enviar requisição de login com body em formato inválido (ex.: texto puro).
- **Resultado esperado:**
  - HTTP `400`
  - `erro.codigo = FORMATO_INVALIDO`

#### CT-EP002-US006-07 — Payload do token contém os campos corretos
- **Rastreabilidade:** US-006, RU-025, RG-013
- **Prioridade:** Alta
- **Pré-condições:** usuário cadastrado
- **Passos:**
  1. Realizar login com sucesso.
  2. Decodificar o token retornado.
- **Resultado esperado:**
  - payload contém `sub`, `email`, `iat`, `exp`
  - `sub` igual ao `id` do usuário
  - `email` em minúsculas
  - `exp - iat` corresponde à duração configurada (padrão 24h)

#### CT-EP002-US006-08 — Login case-insensitive no e-mail
- **Rastreabilidade:** US-006, RU-010, RG-020
- **Prioridade:** Média
- **Pré-condições:** usuário cadastrado com e-mail em minúsculas
- **Passos:**
  1. Enviar requisição de login com o mesmo e-mail em caixa alta.
- **Resultado esperado:**
  - HTTP `200`
  - login bem-sucedido
  - `email` no payload do token em minúsculas

#### CT-EP002-US006-09 — Múltiplas sessões simultâneas
- **Rastreabilidade:** US-006, RU-027
- **Prioridade:** Média
- **Pré-condições:** usuário cadastrado
- **Passos:**
  1. Realizar login.
  2. Realizar novo login com as mesmas credenciais.
  3. Usar ambos os tokens em rota protegida.
- **Resultado esperado:**
  - ambos os tokens válidos
  - login mais recente não invalida o anterior

---

### US-007 — Proteger rotas com JWT (middleware `authMiddleware`)

#### CT-EP002-US007-01 — Acesso autorizado com token válido
- **Rastreabilidade:** US-007, RG-008
- **Prioridade:** Alta
- **Pré-condições:** rota protegida disponível; token JWT válido
- **Passos:**
  1. Enviar requisição autenticada com header `Authorization: Bearer <token>`.
- **Resultado esperado:**
  - middleware libera a requisição
  - handler da rota é executado normalmente
  - resposta corresponde ao contrato da rota

#### CT-EP002-US007-02 — req.usuario populado a partir do payload
- **Rastreabilidade:** US-007, RU-025
- **Prioridade:** Alta
- **Pré-condições:** token JWT válido
- **Passos:**
  1. Enviar requisição autenticada a uma rota cujo handler retorne ou utilize `req.usuario`.
- **Resultado esperado:**
  - `req.usuario.id` igual ao campo `sub` do token
  - `req.usuario.email` igual ao campo `email` do token

#### CT-EP002-US007-03 — Tokens diferentes identificam usuários diferentes
- **Rastreabilidade:** US-007, RG-012
- **Prioridade:** Alta
- **Pré-condições:** dois usuários distintos com tokens válidos
- **Passos:**
  1. Cada usuário envia requisição à mesma rota protegida com seu token.
- **Resultado esperado:**
  - cada `req.usuario` corresponde ao dono do respectivo token
  - nenhum vazamento de identidade entre as requisições

#### CT-EP002-US007-04 — Middleware reutilizável em múltiplas rotas
- **Rastreabilidade:** US-007, RG-008
- **Prioridade:** Média
- **Pré-condições:** middleware aplicado em duas rotas distintas
- **Passos:**
  1. Enviar requisições autenticadas com o mesmo token às duas rotas.
- **Resultado esperado:**
  - ambas as rotas processam a requisição normalmente
  - identidade do usuário é resolvida da mesma forma em cada uma

#### CT-EP002-US007-05 — Acesso negado quando o header Authorization está ausente
- **Rastreabilidade:** US-007, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição a uma rota protegida sem o header `Authorization`.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`
  - handler da rota não é executado

---

### US-008 — Tratar token ausente ou inválido (middleware `authMiddleware`)

#### CT-EP002-US008-01 — Header Authorization ausente
- **Rastreabilidade:** US-008, RG-009
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição a uma rota protegida sem o header `Authorization`.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_AUSENTE`
  - mensagem em português

#### CT-EP002-US008-02 — Header Authorization sem prefixo "Bearer"
- **Rastreabilidade:** US-008, RG-010
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição com header `Authorization` contendo apenas o token, sem o prefixo `Bearer`.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_INVALIDO`

#### CT-EP002-US008-03 — Token malformado
- **Rastreabilidade:** US-008, RG-010
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição com header `Authorization: Bearer <string-sem-estrutura-jwt>` (ex.: `abc.def`).
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_INVALIDO`

#### CT-EP002-US008-04 — Token assinado com chave diferente
- **Rastreabilidade:** US-008, RG-010, RG-006
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição com token JWT estruturalmente válido, mas assinado com chave secreta distinta da configurada.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_INVALIDO`

#### CT-EP002-US008-05 — Token expirado
- **Rastreabilidade:** US-008, RG-011, RG-013
- **Prioridade:** Alta
- **Passos:**
  1. Enviar requisição com token cujo `exp` já tenha passado.
- **Resultado esperado:**
  - HTTP `401`
  - `erro.codigo = TOKEN_EXPIRADO`

#### CT-EP002-US008-06 — Estrutura padronizada do erro
- **Rastreabilidade:** US-008, RG-041, RG-042
- **Prioridade:** Média
- **Passos:**
  1. Provocar qualquer cenário de erro do middleware (CT-EP002-US008-01 a 05).
  2. Inspecionar o body da resposta.
- **Resultado esperado:**
  - body segue `{"erro":{"codigo":"...","mensagem":"..."}}`
  - `codigo` corresponde ao cenário (`TOKEN_AUSENTE`, `TOKEN_INVALIDO` ou `TOKEN_EXPIRADO`)
  - `mensagem` em português

#### CT-EP002-US008-07 — Erro retorna antes do handler da rota
- **Rastreabilidade:** US-008, RG-008
- **Prioridade:** Média
- **Pré-condições:** handler da rota com efeito observável (ex.: leitura de banco)
- **Passos:**
  1. Provocar qualquer cenário de erro do middleware.
  2. Verificar se o handler da rota foi acionado (logs, side effects, banco).
- **Resultado esperado:**
  - handler não é executado
  - nenhum efeito colateral observável após o erro

---

## 5. Resumo de cobertura

- **Total de casos:** 21
- **Distribuição por US:**
  - US-006: 9
  - US-007: 5
  - US-008: 7

---

## 6. Próximos passos

1. Classificar quais casos entram primeiro na automação (`tipo:testes`) por risco (login + token expirado/ausente como mínimos).
2. Selecionar amostra crítica para execução manual exploratória com evidência (especialmente CT-EP002-US006-02 vs CT-EP002-US006-03 — verificar resposta idêntica para anti-enumeração).
3. Evoluir para matriz de rastreabilidade de execução (`planejado`, `executado`, `aprovado`, `reprovado`).
