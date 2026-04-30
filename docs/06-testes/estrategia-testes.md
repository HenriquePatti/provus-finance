# Estrategia de Testes

> Estrategia de qualidade do Provus Finance no contexto agil, com foco em testes de API, rastreabilidade e feedback continuo.

---

## 1. Objetivo

Garantir que cada incremento da API seja entregue com seguranca, previsibilidade e aderencia as regras de negocio, priorizando validacao via fluxo HTTP real.

---

## 2. Escopo da Estrategia

### Inclui

- Testes de API automatizados (camada principal)
- Testes manuais exploratorios com Postman (camada complementar)
- Testes de performance com k6 em rotas criticas (camada complementar)
- Relatorio grafico com Mochawesome
- Execucao continua no pipeline de CI

### Nao inclui (fase atual)

- Testes de frontend
- Testes E2E de interface
- Testes mobile
- Integracoes externas fora do escopo do produto

---

## 3. Diretrizes de Qualidade (contexto agil)

1. **Incremental e orientado a risco**: cada US inclui os testes minimos para reduzir risco de regressao.
2. **Sem duplicacao de documentacao**: regras detalhadas permanecem nos documentos de regras de negocio.
3. **Rastreabilidade obrigatoria**: cada cenario de teste referencia CT, US e regra(s).
4. **Feedback rapido**: suite essencial deve ser curta o suficiente para uso frequente no ciclo de desenvolvimento.
5. **Evolucao continua**: cobertura cresce por epico, respeitando a priorizacao do roadmap.
6. **Padrao ISO-29119-3**: casos de teste documentados no formato tabular com ID, titulo, prioridade, rastreabilidade, pre-condicoes, passos (acao + resultado esperado) e pos-condicoes.

---

## 4. Referencias oficiais do projeto (fonte da verdade)

- Regras de negocio: `docs/02-regras-negocio/`
- Contratos da API: `docs/03-arquitetura/api-contratos.md`
- Epicos e US: `docs/04-epicos/` e `docs/05-user-stories/`
- Stack e arquitetura: `docs/03-arquitetura/`
- Casos de teste: `docs/06-testes/casos-teste-ep-*.md`

> Este documento define **como testar**, nao reescreve o que ja esta definido nesses artefatos.

---

## 5. Abordagem de Teste

### 5.1 Camada principal — API automatizada

| Item | Valor |
|---|---|
| **Framework** | Mocha |
| **Assertions** | Chai |
| **HTTP Client** | Supertest |
| **Relatorio** | Mochawesome (HTML + JSON) |
| **Configuracao** | `api/.mocharc.yml` |
| **Comando** | `npm test` (terminal) / `npm run test:report` (HTML) |
| **Relatorio HTML** | `api/reports/mochawesome/provus-finance.html` |

Cobertura minima por endpoint:

- cenario de sucesso
- validacoes obrigatorias e formatos invalidos
- autenticacao/autorizacao
- erros de regra de negocio
- contrato de resposta (status + estrutura JSON)

### 5.2 Camada complementar — Exploratorios manuais

| Item | Valor |
|---|---|
| **Ferramenta** | Postman |
| **Colecao** | `postman/Provus-Finance.postman_collection.json` |
| **Formato** | Postman Collection v2.1.0 |

Uso:

- validacoes rapidas de fluxo ponta a ponta
- investigacao de cenarios nao cobertos inicialmente na automacao
- apoio em refinamento de novos criterios de aceitacao

### 5.3 Camada complementar — Performance

| Item | Valor |
|---|---|
| **Ferramenta** | k6 |
| **Diretorio** | `performance/` |
| **Status** | Planejado para Fase 2 |

Uso:

- smoke de performance em endpoints criticos
- baseline inicial de tempo de resposta
- monitoramento de degradacao em rotas de maior uso

---

## 6. Rastreabilidade

### 6.1 Padrao de IDs

| Artefato | Formato | Exemplo |
|---|---|---|
| Caso de teste | `CT-EPXXX-USXXX-YY` | `CT-EP001-US001-01` |
| User Story | `US-XXX` | `US-001` |
| Regra de usuario | `RU-XXX` | `RU-003` |
| Regra de conta | `RC-XXX` | `RC-001` |
| Regra de categoria | `RK-XXX` | `RK-027` |
| Regra de transacao | `RT-XXX` | `RT-004` |
| Regra geral | `RG-XXX` | `RG-012` |

### 6.2 Naming de testes automatizados

Padrao obrigatorio nos arquivos `*.test.js`:

```
[CT-EP001-US001-02][US-001][RU-003] deve retornar 409 para e-mail ja cadastrado
```

Estrutura: `[CT ID][US ID][Regras] descricao do comportamento esperado`

### 6.3 Cadeia de rastreabilidade

```
Regra de Negocio (RU/RC/RK/RT/RG)
  └── User Story (US-XXX)
        └── Caso de Teste (CT-EPXXX-USXXX-YY)  ← ISO-29119-3
              └── Teste Automatizado (*.test.js)  ← Mocha
              └── Request Postman (colecao)        ← Exploratório
```

---

## 7. Formato dos Casos de Teste (ISO-29119-3)

Todos os casos de teste documentados em `docs/06-testes/casos-teste-ep-*.md` seguem o formato ISO-29119-3:

| Campo | Descricao |
|---|---|
| **ID** | Identificador unico (`CT-EPXXX-USXXX-YY`) |
| **Titulo** | Descricao longa da validacao |
| **Prioridade** | Alta / Media / Baixa |
| **Rastreabilidade** | US + regras cobertas |
| **Pre-Condicoes** | Estado necessario antes da execucao |
| **Passos** | Tabela com Passo, Acao e Resultado Esperado |
| **Pos-Condicoes** | Estado esperado apos a execucao |

---

## 8. Criterios de qualidade por entrega (US)

Para considerar uma US apta para merge:

- criterios de aceitacao implementados em teste automatizado
- cenarios criticos de erro cobertos
- regressao do dominio impactado executada e verde
- contrato da rota coerente com Swagger (`/api-docs`)
- sem exposicao de dados sensiveis em respostas
- rastreabilidade CT → US → Regra atualizada

---

## 9. Criterios de entrada e saida de teste

### Entrada

- US refinada com criterios claros
- regras associadas identificadas
- endpoint e contrato disponiveis

### Saida

- cenarios planejados executados
- defeitos criticos/altos resolvidos
- relatorio Mochawesome gerado (`npm run test:report`)
- rastreabilidade atualizada nos docs de CT

---

## 10. Metricas de acompanhamento

| Metrica | Como medir |
|---|---|
| % de US com automacao | US com testes / total de US |
| % de regras cobertas | Regras referenciadas em CTs / total de regras |
| Taxa de sucesso da suite | Passes / total de testes (Mochawesome JSON) |
| Tempo medio da suite | Duration no relatorio Mochawesome |
| Defeitos por severidade | Issues com label `bug` por épico |

---

## 11. Documentos de casos de teste

| Documento | Épico | CTs |
|---|---|---|
| `casos-teste-ep-001-usuarios.md` | EP-001 — Gestao de Usuarios | 39 |
| `casos-teste-ep-002-autenticacao.md` | EP-002 — Autenticacao | 9 |
| `casos-teste-ep-003-contas.md` | EP-003 — Gestao de Contas | 39 |
| `casos-teste-ep-004-categorias.md` | EP-004 — Gestao de Categorias | 33 |
| `casos-teste-ep-005-transacoes.md` | EP-005 — Gestao de Transacoes | 40 |
| **Total** | **5 epicos** | **160** |

---

## 12. Governanca e revisao

A estrategia deve ser revisada:

- ao final de cada fase principal
- quando houver mudanca relevante de escopo
- quando houver recorrencia de falhas em producao/homologacao
- quando novas ferramentas forem adicionadas ao pipeline
