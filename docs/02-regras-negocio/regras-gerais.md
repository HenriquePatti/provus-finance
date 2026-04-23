# 📜 Regras Gerais de Negócio

> Documento que descreve as regras **transversais** que governam o comportamento de toda a aplicação Provus Finance. Essas regras se aplicam a múltiplos domínios (usuário, conta, categoria, transação) e estabelecem padrões uniformes.

---

## 📋 Sumário

- [Sobre as Regras](#-sobre-as-regras)
- [Convenções de Nomenclatura das Regras](#-convenções-de-nomenclatura-das-regras)
- [Regras de Segurança](#-regras-de-segurança)
- [Regras de Autenticação e Autorização](#-regras-de-autenticação-e-autorização)
- [Regras de Validação de Entrada](#-regras-de-validação-de-entrada)
- [Regras de Formatação](#-regras-de-formatação)
- [Regras de Datas e Tempo](#-regras-de-datas-e-tempo)
- [Regras de Valores Monetários](#-regras-de-valores-monetários)
- [Regras de Persistência](#-regras-de-persistência)
- [Regras de Resposta da API](#-regras-de-resposta-da-api)
- [Regras de Auditoria](#-regras-de-auditoria)
- [Regras de Performance](#-regras-de-performance)
- [Regras de Acessibilidade aos Dados](#-regras-de-acessibilidade-aos-dados)

---

## 📘 Sobre as Regras

Este documento define **regras que se aplicam a todo o sistema**, independentemente do domínio específico. Regras específicas de cada entidade (usuário, conta, etc.) estão em documentos dedicados.

Cada regra tem:
- **Identificador único** (`RG-XXX`) para rastreabilidade
- **Descrição clara** do comportamento esperado
- **Justificativa** quando necessário
- **Categoria** para agrupamento

---

## 🏷️ Convenções de Nomenclatura das Regras

Todas as regras seguem um padrão de identificação que permite rastreabilidade.

### Formato dos IDs

```
RG-XXX    → Regra Geral
RU-XXX    → Regra de Usuário
RC-XXX    → Regra de Conta
RK-XXX    → Regra de Categoria
RT-XXX    → Regra de Transação
```

### Exemplo de uso em testes

```javascript
describe('POST /api/usuarios', () => {
  it('[RG-007] deve retornar 400 quando o body não for JSON válido', () => {
    // teste aqui
  });
});
```

Isso cria uma **rastreabilidade direta** entre a regra e o teste que a valida.

---

## 🔒 Regras de Segurança

### `RG-001` — Senhas nunca são armazenadas em texto puro
Toda senha é armazenada exclusivamente como **hash bcrypt** com custo mínimo de 10 rounds. O texto original **jamais** é persistido, logado ou retornado pela API.

### `RG-002` — Prepared statements obrigatórios
Toda consulta ao banco de dados **deve usar prepared statements** com parâmetros. É **proibida** a concatenação de strings SQL com dados da requisição.

### `RG-003` — Dados sensíveis nunca aparecem em logs
Senhas, tokens JWT, hashes e outras informações sensíveis **não podem ser registrados** em arquivos de log, console ou sistemas de monitoramento.

### `RG-004` — Respostas da API nunca expõem dados sensíveis
Campos como `senha_hash`, chaves internas de sistema ou dados de outros usuários **não podem** aparecer em nenhuma resposta da API.

### `RG-005` — Headers de segurança HTTP
Todas as respostas devem incluir os headers de segurança fornecidos pelo middleware **helmet**, incluindo proteção contra clickjacking, MIME sniffing e outras vulnerabilidades comuns.

### `RG-006` — Chaves secretas via variáveis de ambiente
`JWT_SECRET` e outras chaves secretas **nunca** devem estar hard-coded no código. Devem vir exclusivamente de variáveis de ambiente (`.env`).

---

## 🔑 Regras de Autenticação e Autorização

### `RG-007` — Body de requisições POST/PUT/PATCH deve ser JSON válido
Se o body enviado não for JSON válido, a API retorna **400 Bad Request** com código `FORMATO_INVALIDO`.

### `RG-008` — Todas as rotas protegidas exigem token JWT válido
Rotas protegidas só processam requisições com header `Authorization: Bearer <token>` contendo um JWT válido e não expirado.

### `RG-009` — Token ausente retorna 401
Quando uma rota protegida é acessada sem header `Authorization`, a API retorna **401 Unauthorized** com código `TOKEN_AUSENTE`.

### `RG-010` — Token inválido retorna 401
Tokens com assinatura inválida, estrutura malformada ou emitidos por outra chave retornam **401 Unauthorized** com código `TOKEN_INVALIDO`.

### `RG-011` — Token expirado retorna 401
Tokens cuja data de expiração (`exp`) já passou retornam **401 Unauthorized** com código `TOKEN_EXPIRADO`.

### `RG-012` — Um usuário só acessa seus próprios dados
Nenhum usuário autenticado pode consultar, alterar ou excluir recursos (contas, categorias, transações) que não sejam seus. Violações retornam **403 Forbidden** com código `ACESSO_NEGADO`.

### `RG-013` — Duração padrão do token JWT
O token JWT tem validade de **24 horas** a partir da emissão, configurável via variável `JWT_EXPIRES_IN`.

---

## ✅ Regras de Validação de Entrada

### `RG-014` — Campos obrigatórios são validados antes de qualquer processamento
Se um campo obrigatório estiver ausente na requisição, a API retorna **400 Bad Request** com código `CAMPO_OBRIGATORIO` antes de qualquer chamada ao banco ou regra de negócio.

### `RG-015` — Tipos de dados incompatíveis retornam 400
Se um campo for enviado com tipo incorreto (ex: string onde se espera número), a API retorna **400 Bad Request** com código `FORMATO_INVALIDO`.

### `RG-016` — Strings são automaticamente "trimadas"
Espaços em branco no início e fim de campos de texto (nome, descrição, e-mail) são **removidos automaticamente** antes de validação e persistência.

### `RG-017` — Strings vazias são tratadas como campo ausente
Se um campo obrigatório vier como string vazia (`""`) ou apenas espaços, é considerado ausente para fins de validação.

### `RG-018` — Tamanho máximo padrão de texto
Campos de texto livre (descrição, nome) têm limite máximo de **100 caracteres**, salvo quando especificado diferente em cada domínio.

### `RG-019` — Múltiplos erros são retornados juntos
Quando uma requisição tem múltiplos campos inválidos, a API retorna **todos os erros** em uma única resposta no array `detalhes`, em vez de retornar apenas o primeiro.

---

## 🎨 Regras de Formatação

### `RG-020` — E-mails são normalizados para minúsculas
Todo e-mail recebido pela API é convertido para minúsculas antes de validação e persistência. `Email@Provus.COM` é armazenado como `email@provus.com`.

### `RG-021` — Formato de e-mail é validado
E-mails devem seguir o formato padrão (`usuario@dominio.tld`). E-mails malformados retornam **400 Bad Request**.

### `RG-022` — Nomenclatura camelCase nos payloads JSON
Todos os campos em requisições e respostas da API seguem a convenção **camelCase** (`criadoEm`, `nomeCompleto`). O mapeamento para snake_case do banco é feito na camada de repository.

### `RG-023` — Caracteres especiais são preservados
Nomes, descrições e outros campos de texto suportam acentos, cedilha e caracteres especiais comuns do português (`ç`, `ã`, `é`, etc.).

---

## 📅 Regras de Datas e Tempo

### `RG-024` — Formato ISO 8601 universal
Todas as datas da API usam o formato **ISO 8601 com timezone UTC**: `2026-04-22T15:30:00.000Z`.

### `RG-025` — Datas no banco são armazenadas em UTC
Independentemente do fuso horário do usuário, todas as datas são persistidas em UTC. A conversão para fuso local é responsabilidade do cliente (frontend).

### `RG-026` — Timestamps automáticos
Colunas `criado_em` e `atualizado_em` são preenchidas **automaticamente** pelo banco no momento da inserção e atualização. A API não aceita esses campos na requisição.

### `RG-027` — Datas futuras são permitidas em transações
Datas de transação podem ser futuras (ex: agendamento de um lançamento planejado). Não há restrição de data máxima.

### `RG-028` — Datas inválidas retornam 400
Se uma data enviada não estiver em formato ISO 8601 válido ou representar uma data impossível (ex: `2026-02-30`), a API retorna **400 Bad Request**.

---

## 💰 Regras de Valores Monetários

### `RG-029` — Valores na API são expressos em reais (decimal)
Os endpoints recebem e retornam valores em **reais com duas casas decimais** (ex: `1234.56`). A API não trabalha com centavos na interface externa.

### `RG-030` — Valores são convertidos para centavos antes da persistência
Internamente, todo valor monetário é armazenado como **INTEGER em centavos** (ex: `123456`). A conversão é feita na camada de service.

### `RG-031` — Valores monetários não aceitam mais que 2 casas decimais
Valores com mais de duas casas decimais (`10.123`) são rejeitados com **400 Bad Request**.

### `RG-032` — Valores negativos são rejeitados em transações
Transações aceitam apenas valores **maiores que zero**. O sinal (débito ou crédito) é inferido pelo campo `tipo`. Valores zero ou negativos retornam **422 Unprocessable Entity** com código `VALOR_INVALIDO`.

### `RG-033` — Valor máximo de uma transação
Transações individuais são limitadas ao valor máximo de **R$ 999.999.999,99** (9.999.999.999 centavos), equivalente ao limite do `INTEGER` do SQLite com margem segura.

### `RG-034` — Moeda única: BRL
Toda a aplicação trabalha exclusivamente em **BRL (Real brasileiro)**. Não há suporte a múltiplas moedas nesta versão.

---

## 💾 Regras de Persistência

### `RG-035` — IDs são auto-incrementais
Todos os IDs de registros são gerados pelo banco via `AUTOINCREMENT`. A API não aceita IDs na criação de recursos.

### `RG-036` — Integridade referencial obrigatória
Foreign keys devem estar ativas em todas as conexões (`PRAGMA foreign_keys = ON`). Tentativas de inserir registros com referências inválidas são rejeitadas pelo banco.

### `RG-037` — Estratégia de exclusão diferenciada
A exclusão segue regras específicas por tipo de dado:

| Tipo de dado | Estratégia |
|---|---|
| Dados pessoais (usuário) | Exclusão em cascata (CASCADE) |
| Histórico (transações) | Exclusão em cascata com a conta |
| Categorias com histórico | Bloqueio (RESTRICT) |
| Contas com histórico | Soft delete (campo `ativa = 0`) |

### `RG-038` — Transações de banco em operações compostas
Operações que envolvem múltiplas tabelas (ex: excluir usuário) são executadas dentro de uma **transação de banco**, garantindo atomicidade.

---

## 📤 Regras de Resposta da API

### `RG-039` — Respostas JSON com Content-Type correto
Toda resposta da API possui o header:
```
Content-Type: application/json; charset=utf-8
```

### `RG-040` — Códigos HTTP semânticos
A API retorna códigos HTTP conforme definido no documento de contratos, sem uso de códigos ambíguos (ex: nunca retorna 200 para erros).

### `RG-041` — Estrutura padronizada de erro
Todo erro segue a estrutura:
```json
{
  "erro": {
    "codigo": "IDENTIFICADOR",
    "mensagem": "Mensagem clara em português."
  }
}
```

### `RG-042` — Mensagens de erro em português
Todas as mensagens de erro retornadas pela API são escritas em **português brasileiro**, de forma clara e sem jargões técnicos.

### `RG-043` — Idempotência em operações de leitura
Múltiplas chamadas `GET` ao mesmo recurso **sempre retornam o mesmo resultado** (desde que não haja alteração no banco no intervalo).

### `RG-044` — Resposta de DELETE sem body
Exclusões bem-sucedidas retornam **204 No Content** sem body na resposta.

---

## 📊 Regras de Auditoria

### `RG-045` — Toda entidade tem timestamps
Todas as tabelas possuem `criado_em` e `atualizado_em`, permitindo rastrear quando registros foram criados e modificados.

### `RG-046` — Atualização automática do `atualizado_em`
Sempre que um registro é modificado, o campo `atualizado_em` é atualizado para o timestamp atual. A API não aceita valores customizados para esse campo.

---

## ⚡ Regras de Performance

### `RG-047` — Paginação obrigatória em listagens
Toda rota que retorna múltiplos registros **deve** aplicar paginação, com padrão de **20 itens por página** e **limite máximo de 100**.

### `RG-048` — Índices em colunas de consulta frequente
Colunas usadas em filtros, ordenações ou joins frequentes (ex: `usuario_id`, `conta_id`, `data_transacao`) **devem** possuir índices.

### `RG-049` — Timeout de requisição
Requisições que excedam **30 segundos** são encerradas com **500 Internal Server Error**.

---

## 🧭 Regras de Acessibilidade aos Dados

### `RG-050` — Filtros por query parameters
Listagens aceitam filtros via query parameters conforme contrato da API. Filtros inválidos são **ignorados silenciosamente** (não causam erro), desde que parâmetros obrigatórios estejam presentes.

### `RG-051` — Ordenação padrão descendente por data
Listagens que envolvem dados com `data_transacao` ou `criado_em` são ordenadas por padrão de forma **decrescente** (mais recente primeiro), exceto se o cliente especificar o contrário.

### `RG-052` — Registros inativos são ocultos por padrão
Contas com `ativa = 0` não aparecem em listagens por padrão. Para incluí-las, o cliente deve passar o parâmetro `incluirInativas=true`.

---

## 🔗 Documentos Relacionados

- 📄 [Visão do Produto](../01-visao/visao-produto.md)
- 📄 [Contratos da API](../03-arquitetura/api-contratos.md)
- 📄 [Modelo de Dados](../03-arquitetura/modelo-dados.md)
- 📄 [Regras de Usuário](./regras-usuario.md) *(próximo documento)*
- 📄 [Regras de Conta](./regras-conta.md) *(em breve)*
- 📄 [Regras de Categoria](./regras-categoria.md) *(em breve)*
- 📄 [Regras de Transação](./regras-transacao.md) *(em breve)*

---

## 📌 Resumo

Total de **52 regras gerais** organizadas em 11 categorias, cobrindo:

| Categoria | Regras |
|---|:---:|
| Segurança | 6 |
| Autenticação e autorização | 7 |
| Validação de entrada | 6 |
| Formatação | 4 |
| Datas e tempo | 5 |
| Valores monetários | 6 |
| Persistência | 4 |
| Resposta da API | 6 |
| Auditoria | 2 |
| Performance | 3 |
| Acessibilidade aos dados | 3 |
| **Total** | **52** |

Cada regra é **testável** e gerará pelo menos um caso de teste na matriz de rastreabilidade.

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
