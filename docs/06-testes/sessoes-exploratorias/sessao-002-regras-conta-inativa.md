# Relatorio de Sessao

> Inspirado no artigo de James Bach sobre Session-Based Test Management (2001)

| Data e Hora do Inicio | Nome do Testador | Modulo |
|---|---|---|
| 30 de abril de 2026 09:55 PM | Henrique Patti | Contas, Transacoes |

**Test Charter:**
Explorar o comportamento de transacoes vinculadas a contas desativadas (soft delete)
Com a Heuristica de Sabedoria em Testes com foco em Adotar a Abordagem Contraria
Para descobrir se o software lida bem com situacoes onde o usuario tenta acoes em recursos inativos

**Tamanho da Sessao:**
10 minutos

**Notas*:**

- (I) Criei uma conta com saldoInicial de R$ 1.000 e registrei uma transacao de despesa de R$ 50. Saldo calculado ficou R$ 950 — correto.

- (I) Desativei a conta via `DELETE /api/contas/:id` — retornou 204. Confirmei que a conta nao aparece mais na listagem padrao mas aparece com `?ativo=false`.

- (I) Tentei criar uma nova transacao na conta desativada via `POST /api/transacoes`. A API retornou 422 com codigo CONTA_INATIVA — **correto**, a criacao esta protegida.

- (I) Decidi tentar atualizar a transacao que ja existia na conta desativada via `PUT /api/transacoes/:id` com novo valor de R$ 999. A API retornou 200 e aceitou a atualizacao — **nao deveria permitir**.

- (R) Isso cria uma inconsistencia: o usuario desativou a conta (sinalizando que nao quer mais operar com ela), mas ainda consegue alterar valores de transacoes nessa conta. O historico financeiro pode ser manipulado em contas que deveriam estar "congeladas".

- (I) Verifiquei no codigo-fonte (`transacao.service.js`, funcao `atualizar`): a funcao busca a transacao pelo ID e usuario, mas nao verifica se a conta vinculada esta ativa. A funcao `criar` faz essa verificacao, mas a `atualizar` nao.

- (I) A regra RT-057 diz explicitamente: "Atualizacao bloqueada em conta inativa". A implementacao nao cobriu esse cenario.

(*) Podem ser (I)nformacoes ou (R)iscos.

**Defeitos:**

- `PUT /api/transacoes/:id` permite atualizar transacoes vinculadas a contas desativadas (ativo=false). A regra RT-057 exige que a atualizacao seja bloqueada com 422 CONTA_INATIVA quando a conta esta inativa. A criacao (`POST`) esta protegida, mas a atualizacao (`PUT`) nao faz a mesma verificacao.

**Perguntas:**

- A exclusao (`DELETE /api/transacoes/:id`) tambem deveria ser bloqueada em conta inativa? A regra RT-063 diz que exclusao e permitida em conta inativa, entao este comportamento parece intencional.

**Rastreabilidade:**

| Bug | Regras Violadas | Endpoint Afetado | Severidade |
|---|---|---|---|
| PUT transacao em conta inativa aceito | RT-057 | PUT /api/transacoes/:id | Media |
