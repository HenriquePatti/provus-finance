/**
 * ============================================================
 * FIXTURES DE TESTE — USUÁRIOS
 * ============================================================
 *
 * ⚠️  IMPORTANTE — LEIA ANTES DE USAR
 *
 * Este arquivo contém FACTORY FUNCTIONS que geram dados fictícios
 * aleatórios para testes automatizados. NÃO há credenciais hardcoded.
 *
 * Cada chamada produz dados aleatórios mas válidos, garantindo:
 * - Isolamento entre testes (cada um tem dados únicos)
 * - Inexistência de senhas reais em qualquer ambiente
 * - Conformidade com regras de validação do domínio
 *
 * Implementação: usa apenas `crypto` nativo do Node.js, sem dependências
 * externas. Domínios reservados (.local, RFC 6762) garantem que nenhum
 * e-mail aleatório possa atingir um destinatário real.
 *
 * Convenção:
 * - `gerar*Valido*`    → produz dados que devem ser aceitos
 * - `gerar*Invalido*`  → produz dados que devem ser rejeitados
 *
 * Override:
 * Todas as factories aceitam um objeto opcional para forçar valores
 * específicos quando o teste precisar:
 *
 *   const u = gerarUsuarioValido({ email: 'forcado@test.local' });
 *
 * ============================================================
 */

import { randomBytes, randomInt } from 'crypto';

// ------------------------------------------------------------
// HELPERS PRIMITIVOS (geradores básicos)
// ------------------------------------------------------------

/**
 * Gera string aleatória de letras minúsculas com o tamanho informado.
 */
function letrasMinusculas(tamanho) {
  const alfabeto = 'abcdefghijklmnopqrstuvwxyz';
  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    resultado += alfabeto[randomInt(0, alfabeto.length)];
  }
  return resultado;
}

/**
 * Gera string aleatória de letras maiúsculas com o tamanho informado.
 */
function letrasMaiusculas(tamanho) {
  const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    resultado += alfabeto[randomInt(0, alfabeto.length)];
  }
  return resultado;
}

/**
 * Gera string aleatória de dígitos com o tamanho informado.
 */
function digitos(tamanho) {
  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    resultado += randomInt(0, 10).toString();
  }
  return resultado;
}

/**
 * Gera string aleatória de letras misturadas (maiúsculas + minúsculas).
 */
function letrasMistas(tamanho) {
  const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    resultado += alfabeto[randomInt(0, alfabeto.length)];
  }
  return resultado;
}

// ------------------------------------------------------------
// HELPERS DE DOMÍNIO
// ------------------------------------------------------------

// Lista pequena de primeiros nomes brasileiros para gerar nomes verossímeis
const PRIMEIROS_NOMES = [
  'Ana', 'Bruno', 'Carla', 'Diego', 'Eduarda', 'Felipe', 'Gabriela',
  'Henrique', 'Isabela', 'João', 'Karen', 'Lucas', 'Marina', 'Nicolas',
  'Olivia', 'Pedro', 'Renata', 'Sofia', 'Thiago', 'Vitória',
];

const SOBRENOMES = [
  'Silva', 'Souza', 'Oliveira', 'Pereira', 'Costa', 'Martins',
  'Rodrigues', 'Almeida', 'Carvalho', 'Lima', 'Ferreira', 'Andrade',
  'Ribeiro', 'Barbosa', 'Cardoso',
];

/**
 * Gera um nome completo brasileiro fictício.
 */
function nomeCompleto() {
  const primeiro = PRIMEIROS_NOMES[randomInt(0, PRIMEIROS_NOMES.length)];
  const sobrenome = SOBRENOMES[randomInt(0, SOBRENOMES.length)];
  return `${primeiro} ${sobrenome}`;
}

/**
 * Gera uma senha válida conforme as regras do domínio:
 * - 8 a 64 caracteres
 * - Pelo menos 1 maiúscula, 1 minúscula e 1 número
 *
 * Estratégia: garante presença obrigatória + complementa com aleatório.
 */
function gerarSenhaValida() {
  // 1 maiúscula + 5 minúsculas + 3 números = 9 chars (dentro do range)
  return letrasMaiusculas(1) + letrasMinusculas(5) + digitos(3);
}

/**
 * Gera um e-mail no domínio reservado .local.
 * RFC 6762: domínios .local nunca chegam à internet pública.
 */
function gerarEmailFicticio() {
  const usuario = letrasMinusculas(6) + '.' + letrasMinusculas(4);
  const sufixo = letrasMinusculas(3) + digitos(2);
  return `${usuario}.${sufixo}@provus-test.local`;
}

// ------------------------------------------------------------
// FACTORIES VÁLIDAS (devem ser aceitas pela API)
// ------------------------------------------------------------

/**
 * Gera um usuário com dados válidos para cadastro.
 *
 * @param {Object} overrides - Campos para sobrescrever
 * @returns {Object} { nome, email, senha }
 *
 * Exemplo:
 *   const u = gerarUsuarioValido();
 *   const uForcado = gerarUsuarioValido({ email: 'fixo@test.local' });
 */
export function gerarUsuarioValido(overrides = {}) {
  return {
    nome: nomeCompleto(),
    email: gerarEmailFicticio(),
    senha: gerarSenhaValida(),
    ...overrides,
  };
}

/**
 * Gera um usuário válido cujo nome contém espaços excessivos.
 * Usado para testar normalização (RU-020, RG-016).
 */
export function gerarUsuarioComEspacos(overrides = {}) {
  const primeiro = PRIMEIROS_NOMES[randomInt(0, PRIMEIROS_NOMES.length)];
  const sobrenome = SOBRENOMES[randomInt(0, SOBRENOMES.length)];
  // injeta espaços extras no início, no meio e no fim
  const nomeComEspacos = `  ${primeiro}     ${sobrenome}  `;

  return {
    nome: nomeComEspacos,
    email: `  ${gerarEmailFicticio()}  `,
    senha: gerarSenhaValida(),
    ...overrides,
  };
}

/**
 * Gera um usuário com e-mail em caixa mista.
 * Usado para testar normalização (RU-010, RG-020).
 */
export function gerarUsuarioEmailCaixaMista(overrides = {}) {
  const email = gerarEmailFicticio();
  // alterna maiúsculas e minúsculas
  const emailMisto = email
    .split('')
    .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c))
    .join('');

  return {
    nome: nomeCompleto(),
    email: emailMisto,
    senha: gerarSenhaValida(),
    ...overrides,
  };
}

// ------------------------------------------------------------
// FACTORIES PARA DADOS INVÁLIDOS (devem ser rejeitados)
// ------------------------------------------------------------

// --- Nome ---

export function gerarNomeApenasNumeros() {
  return digitos(5); // ex: "84291"
}

export function gerarNomeMuitoCurto() {
  return letrasMinusculas(1); // 1 caractere
}

export function gerarNomeMuitoLongo() {
  return letrasMinusculas(101); // > 100 chars
}

// --- E-mail ---

export function gerarEmailFormatoInvalido() {
  // String aleatória sem @ nem domínio
  return letrasMinusculas(8) + digitos(3);
}

export function gerarEmailMuitoLongo() {
  // > 254 caracteres
  return letrasMinusculas(250) + '@provus-test.local';
}

// --- Senha ---

export function gerarSenhaMuitoCurta() {
  // 3 caracteres
  return letrasMaiusculas(1) + letrasMinusculas(1) + digitos(1);
}

export function gerarSenhaSemMaiuscula() {
  return letrasMinusculas(5) + digitos(3);
}

export function gerarSenhaSemMinuscula() {
  return letrasMaiusculas(5) + digitos(3);
}

export function gerarSenhaSemNumero() {
  return letrasMaiusculas(4) + letrasMinusculas(4);
}

export function gerarSenhaMuitoLonga() {
  // > 64 caracteres
  return gerarSenhaValida().repeat(10); // ~90 chars
}

// ------------------------------------------------------------
// EXPORT DEFAULT (para importação agrupada)
// ------------------------------------------------------------

export default {
  gerarUsuarioValido,
  gerarUsuarioComEspacos,
  gerarUsuarioEmailCaixaMista,
  gerarNomeApenasNumeros,
  gerarNomeMuitoCurto,
  gerarNomeMuitoLongo,
  gerarEmailFormatoInvalido,
  gerarEmailMuitoLongo,
  gerarSenhaMuitoCurta,
  gerarSenhaSemMaiuscula,
  gerarSenhaSemMinuscula,
  gerarSenhaSemNumero,
  gerarSenhaMuitoLonga,
};