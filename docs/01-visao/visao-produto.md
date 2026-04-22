# 🎯 Visão do Produto

> Documento que define a identidade do Provus Finance — o problema que resolve, para quem é, o valor que entrega e os limites do seu escopo.

---

## 📋 Sumário

- [Declaração de Visão](#-declaração-de-visão)
- [Contexto e Problema](#-contexto-e-problema)
- [Proposta de Valor](#-proposta-de-valor)
- [Público-Alvo](#-público-alvo)
- [Objetivos do Produto](#-objetivos-do-produto)
- [Escopo do Projeto](#-escopo-do-projeto)
- [Princípios Norteadores](#-princípios-norteadores)
- [Métricas de Sucesso](#-métricas-de-sucesso)
- [Concorrência e Diferenciais](#-concorrência-e-diferenciais)
- [Premissas e Restrições](#-premissas-e-restrições)

---

## 🌟 Declaração de Visão

> **"Oferecer a qualquer pessoa uma forma simples, clara e confiável de entender e controlar sua vida financeira pessoal, sem complexidade desnecessária e sem depender de recursos bancários específicos."**

---

## 🧩 Contexto e Problema

### O cenário atual

A educação financeira ainda é um desafio amplo. Muitas pessoas:

- Não sabem exatamente quanto ganham e quanto gastam
- Perdem o controle ao acumular contas, cartões e carteiras digitais
- Evitam aplicativos financeiros por considerá-los complicados ou invasivos
- Não confiam em soluções que exigem conectar contas bancárias reais
- Buscam alternativas simples para registrar e analisar seus gastos

### Os problemas que o Provus Finance ataca

| Problema | Impacto no usuário |
|---|---|
| **Falta de visibilidade** sobre receitas e despesas | Dificuldade em planejar e economizar |
| **Dispersão** entre várias contas e cartões | Perda de controle do patrimônio real |
| **Complexidade** dos apps financeiros existentes | Abandono após poucos usos |
| **Desconfiança** de integrações bancárias automáticas | Preocupação com segurança de dados |
| **Ausência de categorização** adequada | Dificuldade em identificar onde o dinheiro está indo |

---

## 💎 Proposta de Valor

### O que o Provus Finance entrega

Uma **plataforma de controle financeiro pessoal** que permite ao usuário:

1. **Registrar receitas e despesas** de forma rápida e manual
2. **Organizar o dinheiro** em múltiplas contas (bancos, carteiras, dinheiro físico)
3. **Categorizar transações** com categorias padrão ou personalizadas
4. **Visualizar o patrimônio consolidado** em um só lugar
5. **Planejar orçamentos** mensais por categoria *(fase futura)*
6. **Acompanhar a evolução financeira** ao longo do tempo *(fase futura)*

### O que faz a diferença

- 🔒 **Sem integração bancária** — toda entrada é manual e controlada pelo usuário
- 🎯 **Simplicidade intencional** — cadastro em menos de 2 minutos
- 📊 **Transparência de dados** — usuário vê exatamente como seus dados são armazenados
- 🌍 **Acessível** — interface pensada para iniciantes e experientes
- 🔐 **Privacidade** — sem compartilhamento com terceiros

---

## 👥 Público-Alvo

### Perfil principal

Pessoas que desejam **organizar suas finanças pessoais** de forma autônoma, independentemente do nível de conhecimento financeiro.

### Características comuns

| Atributo | Detalhe |
|---|---|
| **Faixa etária** | 18 a 60 anos |
| **Escolaridade** | Ensino médio ou superior |
| **Relação com tecnologia** | Usuário ativo de aplicativos no dia a dia |
| **Necessidade financeira** | Deseja clareza sobre gastos e receitas |
| **Barreira comum** | Já tentou planilhas ou apps, mas abandonou por complexidade |

### Segmentos específicos

- **Iniciantes em controle financeiro** — nunca usaram uma ferramenta formal
- **Usuários de planilhas** — buscam algo mais prático que Excel/Google Sheets
- **Desiludidos com apps atuais** — acharam os disponíveis muito complexos ou intrusivos
- **Casais e famílias** — querem registrar finanças em conjunto *(fase futura)*

> 📄 As personas detalhadas estão em [`personas.md`](./personas.md).

---

## 🎯 Objetivos do Produto

### Objetivos de negócio

1. **Educação financeira** — ajudar usuários a compreender seus hábitos de consumo
2. **Autonomia** — dar poder de decisão sem depender de terceiros
3. **Hábito** — criar um uso recorrente e natural, não obrigatório

### Objetivos funcionais (Fase 1 — MVP)

- ✅ Permitir cadastro e autenticação de usuário
- ✅ Permitir gestão de contas financeiras
- ✅ Permitir registro de transações (receitas e despesas)
- ✅ Permitir categorização das transações
- ✅ Calcular saldo por conta e total consolidado

### Objetivos técnicos

- ✅ API REST documentada e testada
- ✅ Cobertura completa por testes de API
- ✅ Arquitetura clara e manutenível
- ✅ Segurança básica implementada (JWT, hash de senhas)

---

## 🧭 Escopo do Projeto

### ✅ Dentro do escopo

#### Fase 1 — Fundação
- Cadastro, login e autenticação via JWT
- Gestão de contas (corrente, poupança, digital, carteira, dinheiro)
- Categorias padrão do sistema + categorias personalizadas
- Registro, edição e exclusão de transações
- Cálculo de saldo por conta

#### Fases futuras (roadmap)
- Fase 2 — Gestão de cartões de crédito e faturas
- Fase 3 — Orçamentos mensais por categoria
- Fase 4 — Relatórios e exportações (CSV, PDF)
- Fase 5 — Diferenciais (rastreador emocional, memória de preços, simulador)
- Fase 6 — Perfil administrativo
- Fase 7 — Frontend web

### ❌ Fora do escopo

- **Integração com bancos** (Open Finance, scraping de extratos)
- **Reconhecimento automático** de transações via e-mail ou SMS
- **Transações em múltiplas moedas** — apenas BRL
- **Investimentos complexos** (ações, fundos, criptomoedas)
- **Assessoria financeira personalizada ou baseada em IA**
- **Compartilhamento de contas entre múltiplos usuários** (exceto o que está previsto para fase 5)
- **App mobile nativo** (Android/iOS)
- **Pagamento de boletos ou transferências bancárias reais**

---

## 🧱 Princípios Norteadores

### 1. Simplicidade acima de tudo
Toda decisão de produto deve priorizar a facilidade de uso. Se duas soluções resolvem o mesmo problema, escolhemos a mais simples.

### 2. Privacidade por design
Nenhuma integração com serviços de terceiros que possa expor dados do usuário. O controle é totalmente do usuário.

### 3. Consistência no domínio
Nomenclatura, fluxos e regras seguem o vocabulário financeiro comum do Brasil — "conta corrente", "receita", "despesa", "categoria".

### 4. Confiabilidade antes de funcionalidades
Um app com poucas features que funcionam bem é superior a um app com muitas features instáveis. **Estabilidade é feature.**

### 5. Testabilidade em primeiro lugar
Cada funcionalidade é projetada para ser testável. Um requisito que não pode ser testado precisa ser reescrito.

---

## 📊 Métricas de Sucesso

### Métricas do produto (após deploy — fase futura)

- **Taxa de cadastro concluído** — % de usuários que finalizam o cadastro
- **Retenção em 7 e 30 dias** — usuários que voltam após o primeiro uso
- **Transações registradas por usuário ativo** — indicador de engajamento
- **Tempo médio para registrar uma transação** — foco em fluidez

### Métricas do projeto (portfólio)

- **Cobertura de casos de teste** — % de regras de negócio cobertas por testes
- **Passagem dos testes no CI** — 100% verde em cada PR
- **Clareza da documentação** — cada US rastreável até uma regra e um teste
- **Qualidade dos commits** — histórico Git limpo e seguindo Conventional Commits
- **Tempo de setup do projeto** — clonar → rodar em menos de 2 minutos

---

## 🏆 Concorrência e Diferenciais

### Referências do mercado

| Ferramenta | Foco | Limitação percebida |
|---|---|---|
| **Organizze** | Controle financeiro completo | Interface complexa para iniciantes |
| **Mobills** | Foco em dashboards | Muitos recursos pagos |
| **GuiaBolso** | Integração bancária | Dependência de Open Finance |
| **Planilhas Excel/Sheets** | Flexibilidade | Exige conhecimento, sem visualização |

### Diferenciais do Provus Finance

- 🧩 **Foco em simplicidade real**, não aparente
- 🔒 **100% manual por opção** — o usuário decide o que registrar
- 📖 **Totalmente transparente** — usuário consegue ver como os dados são tratados
- 🎯 **Público amplo** — da pessoa iniciante ao usuário experiente

---

## ⚠️ Premissas e Restrições

### Premissas

- O usuário tem acesso a um navegador moderno (Chrome, Firefox, Safari, Edge)
- O usuário registra suas transações manualmente
- O usuário utiliza a moeda **BRL (Real brasileiro)**
- O idioma da aplicação é **português do Brasil**
- Há conexão com internet apenas quando necessário (ambiente web)

### Restrições técnicas

- Banco de dados **SQLite** — adequado para usos individuais, não para escala corporativa
- API em **Node.js + Express** — sem necessidade de microserviços nesta fase
- Autenticação via **JWT** — sem sessão no servidor
- **Sem infraestrutura cloud** nesta fase — execução local

### Restrições de projeto

- Este é um **projeto de portfólio** focado em **testes de software**
- Não há compromisso com SLA ou disponibilidade de produção
- Recursos de pagamento e monetização **não fazem parte** do escopo
- Integrações com serviços externos **não fazem parte** do escopo

---

## 🔗 Documentos Relacionados

- 📄 [Personas](./personas.md) — detalhamento dos perfis de usuário
- 📄 [Regras de Negócio](../02-regras-negocio/) — regras funcionais e não funcionais
- 📄 [Arquitetura](../03-arquitetura/) — stack, estrutura e modelo de dados
- 📄 [Épicos](../04-epicos/) — agrupamento de funcionalidades

---

<div align="center">

**← Voltar ao [README principal](../../README.md)**

</div>
