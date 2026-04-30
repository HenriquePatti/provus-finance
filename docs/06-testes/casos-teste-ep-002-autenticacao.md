# Casos de Teste — EP-002: Autenticacao

> Casos de teste do Epico 2, elaborados com base nas User Stories de autenticacao e nas regras de negocio vigentes, mantendo rastreabilidade completa conforme ISO/IEC/IEEE 29119-3.

---

## 1. Objetivo

Definir os cenarios de teste do EP-002 para validar o fluxo de autenticacao (login) via API.

---

## 2. Referencias

- `docs/05-user-stories/ep-002-autenticacao.md`
- `docs/02-regras-negocio/regras-usuario.md`
- `docs/02-regras-negocio/regras-gerais.md`
- `docs/03-arquitetura/api-contratos.md`
- `docs/06-testes/estrategia-testes.md`
- `docs/06-testes/plano-testes-fase-1.md`

---

## 3. Convencoes

- **ID do caso:** `CT-EP002-USXXX-YY`
- **Tipo:** API (automatizavel) + execucao manual complementar
- **Rastreabilidade obrigatoria:** `US` + `RU/RG`
- **Formato esperado de erro:** `{"erro":{"codigo":"...","mensagem":"..."}}`

---

## 4. Casos de teste

### US-006 — Autenticar usuario (`POST /api/auth/login`)

#### CT-EP002-US006-01 — Login com credenciais validas

| Campo | Valor |
|---|---|
| **ID** | CT-EP002-US006-01 |
| **Titulo** | Validar que o sistema autentica o usuario e retorna token JWT quando credenciais sao validas |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-006, RU-021, RU-023, RU-024, RU-026, RG-001 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema com e-mail e senha conhecidos |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/auth/login` com `email` e `senha` validos | HTTP `200` |
| 2 | Inspecionar body da resposta | Body contem `token` (string JWT) e objeto `usuario` com `id`, `nome`, `email` |

| **Pos-Condicoes** | - Token JWT valido emitido e pronto para uso em rotas protegidas |

---

#### CT-EP002-US006-02 — Login com e-mail nao cadastrado

| Campo | Valor |
|---|---|
| **ID** | CT-EP002-US006-02 |
| **Titulo** | Validar que o sistema rejeita login quando o e-mail informado nao esta cadastrado |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-006, RU-022 |
| **Pre-Condicoes** | - Nenhum usuario cadastrado com o e-mail informado |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/auth/login` com e-mail nao cadastrado e senha qualquer | HTTP `401` com `erro.codigo = CREDENCIAIS_INVALIDAS` |

| **Pos-Condicoes** | - Nenhum token emitido |

---

#### CT-EP002-US006-03 — Login com senha incorreta (resposta identica ao CT-02)

| Campo | Valor |
|---|---|
| **ID** | CT-EP002-US006-03 |
| **Titulo** | Validar que o sistema rejeita login com senha incorreta retornando body identico ao cenario de e-mail inexistente |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-006, RU-022, RU-026 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema com e-mail conhecido |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/auth/login` com e-mail valido e senha incorreta | HTTP `401` com `erro.codigo = CREDENCIAIS_INVALIDAS` |
| 2 | Comparar body da resposta com o body retornado no CT-EP002-US006-02 | Body e identico (mesma estrutura e codigo de erro), impedindo enumeracao de usuarios |

| **Pos-Condicoes** | - Nenhum token emitido |

---

#### CT-EP002-US006-04 — Login sem campo e-mail

| Campo | Valor |
|---|---|
| **ID** | CT-EP002-US006-04 |
| **Titulo** | Validar que o sistema rejeita login quando o campo email esta ausente |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-006, RU-021, RG-014 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/auth/login` sem o campo `email` | HTTP `400` com `erro.codigo = CAMPO_OBRIGATORIO` |

| **Pos-Condicoes** | - Nenhum token emitido |

---

#### CT-EP002-US006-05 — Login sem campo senha

| Campo | Valor |
|---|---|
| **ID** | CT-EP002-US006-05 |
| **Titulo** | Validar que o sistema rejeita login quando o campo senha esta ausente |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-006, RU-021, RG-014 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/auth/login` sem o campo `senha` | HTTP `400` com `erro.codigo = CAMPO_OBRIGATORIO` |

| **Pos-Condicoes** | - Nenhum token emitido |

---

#### CT-EP002-US006-06 — Login com body que nao e JSON valido

| Campo | Valor |
|---|---|
| **ID** | CT-EP002-US006-06 |
| **Titulo** | Validar que o sistema rejeita login quando o body da requisicao nao e um JSON valido |
| **Prioridade** | Media |
| **Rastreabilidade** | US-006, RG-007 |
| **Pre-Condicoes** | - Nenhuma |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/auth/login` com body em formato nao-JSON (ex.: texto puro, XML) | HTTP `400` com `erro.codigo = FORMATO_INVALIDO` |

| **Pos-Condicoes** | - Nenhum token emitido |

---

#### CT-EP002-US006-07 — Payload JWT contem campos obrigatorios com expiracao de ~24h

| Campo | Valor |
|---|---|
| **ID** | CT-EP002-US006-07 |
| **Titulo** | Validar que o payload do token JWT contem sub, email, iat e exp com expiracao de aproximadamente 24 horas |
| **Prioridade** | Alta |
| **Rastreabilidade** | US-006, RU-025, RG-013 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema com credenciais conhecidas |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/auth/login` com credenciais validas | HTTP `200` com token JWT |
| 2 | Decodificar o payload do token JWT (base64) | Payload contem campos `sub` (ID do usuario), `email`, `iat` (timestamp de emissao) e `exp` (timestamp de expiracao) |
| 3 | Calcular diferenca entre `exp` e `iat` | Diferenca e de aproximadamente 24 horas (86400 segundos) |

| **Pos-Condicoes** | - Token JWT valido emitido e pronto para uso em rotas protegidas |

---

#### CT-EP002-US006-08 — Login com e-mail em caixa diferente (case-insensitive)

| Campo | Valor |
|---|---|
| **ID** | CT-EP002-US006-08 |
| **Titulo** | Validar que o sistema autentica o usuario independentemente da caixa (maiuscula/minuscula) do e-mail |
| **Prioridade** | Media |
| **Rastreabilidade** | US-006, RU-010, RG-020 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema com e-mail em minusculas |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/auth/login` com e-mail em caixa mista (ex.: `User@Email.COM`) e senha correta | HTTP `200` com token JWT e dados do usuario |

| **Pos-Condicoes** | - Token JWT valido emitido e pronto para uso em rotas protegidas |

---

#### CT-EP002-US006-09 — Multiplas sessoes geram tokens distintos

| Campo | Valor |
|---|---|
| **ID** | CT-EP002-US006-09 |
| **Titulo** | Validar que logins consecutivos do mesmo usuario geram tokens JWT distintos e todos permanecem validos |
| **Prioridade** | Media |
| **Rastreabilidade** | US-006, RU-027 |
| **Pre-Condicoes** | - Usuario cadastrado no sistema com credenciais conhecidas |

| Passo | Acao | Resultado Esperado |
|---|---|---|
| 1 | Enviar `POST /api/auth/login` com credenciais validas e armazenar o token retornado (token A) | HTTP `200` com token JWT |
| 2 | Enviar `POST /api/auth/login` novamente com as mesmas credenciais e armazenar o token retornado (token B) | HTTP `200` com token JWT |
| 3 | Comparar token A com token B | Tokens sao diferentes (strings distintas) |
| 4 | Enviar `GET /api/usuarios/me` com token A | HTTP `200` — token A continua valido |
| 5 | Enviar `GET /api/usuarios/me` com token B | HTTP `200` — token B tambem e valido |

| **Pos-Condicoes** | - Ambos os tokens permanecem validos e funcionais para rotas protegidas |

---

## 5. Resumo de cobertura

| User Story | Descricao | Quantidade de CTs |
|---|---|---|
| US-006 | Autenticar usuario (login) | 9 |
| **Total** | | **9** |

---

## 6. Proximos passos

1. Classificar quais casos entram primeiro na automacao (`tipo:testes`) por risco.
2. Selecionar amostra critica para execucao manual exploratoria com evidencia.
3. Evoluir para matriz de rastreabilidade de execucao (`planejado`, `executado`, `aprovado`, `reprovado`).
