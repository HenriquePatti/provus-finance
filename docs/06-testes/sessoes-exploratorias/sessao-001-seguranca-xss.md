# Relatorio de Sessao

> Inspirado no artigo de James Bach sobre Session-Based Test Management (2001)

| Data e Hora do Inicio | Nome do Testador | Modulo |
|---|---|---|
| 30 de abril de 2026 09:40 PM | Henrique Patti | Usuarios, Contas, Categorias, Transacoes |

**Test Charter:**
Explorar os campos de texto livre da API (nome, descricao, icone)
Com a Heuristica de Sabedoria em Testes com foco em Injecao de Dados Maliciosos
Para descobrir se o software sanitiza entradas contra XSS (Cross-Site Scripting) e SQL Injection

**Tamanho da Sessao:**
15 minutos

**Notas*:**

- (I) Comecei testando SQL Injection no endpoint de login (`POST /api/auth/login`) enviando `" OR 1=1 --` no campo email. A API retornou 401 CREDENCIAIS_INVALIDAS normalmente — protegida por prepared statements do better-sqlite3.

- (I) Testei SQL Injection no nome da conta (`POST /api/contas`) enviando `'; DROP TABLE usuarios; --`. A API criou a conta com esse texto como nome literal, sem executar o SQL. Prepared statements funcionando corretamente.

- (I) Decidi testar XSS nos mesmos campos de texto. Enviei `<script>alert(1)</script>` como nome no `POST /api/usuarios`. A API aceitou e armazenou o HTML como nome do usuario — **sem sanitizacao**.

- (R) Se um frontend consumir essa API e renderizar o campo `nome` diretamente no DOM com `innerHTML`, o script sera executado no navegador da vitima. Isso pode ser usado para roubar cookies, tokens JWT e sessoes.

- (I) Testei o mesmo payload no campo `descricao` de `POST /api/transacoes` enviando `<img src=x onerror=alert(1)>`. Tambem aceito e armazenado sem sanitizacao.

- (I) Repeti o teste nos campos `nome` de `POST /api/contas` e `POST /api/categorias`. Mesmo comportamento — HTML aceito em todos os campos de texto livre.

- (R) O problema e sistematico: nenhum campo de texto da API possui sanitizacao contra HTML/JavaScript. A validacao atual cobre tamanho minimo/maximo e formato, mas nao conteudo malicioso.

(*) Podem ser (I)nformacoes ou (R)iscos.

**Defeitos:**

- Todos os campos de texto livre da API aceitam tags HTML e JavaScript sem sanitizacao (XSS armazenado). Campos afetados: `nome` em usuarios, contas e categorias; `descricao` em transacoes. Viola OWASP Top 10 — A7 (Cross-Site Scripting) e RG-004 (seguranca dos dados).

**Perguntas:**

- Deveria a API sanitizar as entradas (remover tags HTML) ou apenas rejeitar com 400 quando detectar conteudo HTML/JavaScript?
- O campo `icone` de categorias, que aceita emojis, tambem deveria ter sanitizacao contra HTML?

**Rastreabilidade:**

| Bug | Regras Violadas | Endpoints Afetados | Severidade |
|---|---|---|---|
| XSS em campos de texto | RG-004, OWASP A7 | POST/PUT /api/usuarios, /api/contas, /api/categorias, /api/transacoes | Alta |
