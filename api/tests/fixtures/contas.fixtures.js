/**
 * ============================================================
 * FIXTURES DE TESTE — CONTAS
 * ============================================================
 *
 * Factories e helpers para testes do EP-003 (Gestão de Contas).
 *
 * Reaproveita `criarUsuarioParaLogin` das fixtures de auth para
 * criar um usuário autenticado e obter token JWT.
 * ============================================================
 */

import { randomInt } from 'crypto';
import contaRepository from '../../src/repositories/conta.repository.js';
import { criarUsuarioParaLogin } from './auth.fixtures.js';

// ------------------------------------------------------------
// CONSTANTES
// ------------------------------------------------------------

const TIPOS_VALIDOS = ['corrente', 'poupanca', 'carteira_digital', 'dinheiro', 'investimento'];

const NOMES_CONTAS = [
  'Nubank', 'Itaú', 'Bradesco', 'Inter', 'C6 Bank',
  'PicPay', 'Mercado Pago', 'Carteira Física', 'Poupança',
  'Investimentos XP', 'Conta Salário', 'Conta Secundária',
];

// ------------------------------------------------------------
// FACTORIES VÁLIDAS
// ------------------------------------------------------------

/**
 * Gera dados válidos para criação de conta.
 *
 * @param {Object} overrides
 * @returns {{ nome: string, tipo: string, saldoInicial: number }}
 */
export function gerarContaValida(overrides = {}) {
  return {
    nome: NOMES_CONTAS[randomInt(0, NOMES_CONTAS.length)] + ' ' + randomInt(100, 999),
    tipo: TIPOS_VALIDOS[randomInt(0, TIPOS_VALIDOS.length)],
    saldoInicial: randomInt(0, 10000),
    ...overrides,
  };
}

// ------------------------------------------------------------
// HELPERS DE BANCO
// ------------------------------------------------------------

/**
 * Cria um usuário autenticado e retorna token + dados.
 * Wrapper para reutilização nos testes de contas.
 *
 * @param {import('supertest').SuperTest} requestAgent - supertest(app)
 * @param {Object} overrides - sobrescreve dados do usuário
 * @returns {Promise<{ token: string, usuario: Object, credenciais: Object }>}
 */
export async function criarUsuarioAutenticado(requestAgent, overrides = {}) {
  const { usuario, credenciais } = await criarUsuarioParaLogin(overrides);

  const login = await requestAgent
    .post('/api/auth/login')
    .send(credenciais);

  return {
    token: login.body.token,
    usuario,
    credenciais,
  };
}

/**
 * Cria uma conta diretamente no banco (sem passar pela API).
 * Usado para seedar dados nos testes.
 *
 * @param {number} usuarioId
 * @param {Object} overrides
 * @returns {Object} Conta criada (dados brutos do banco)
 */
export function criarContaNoBanco(usuarioId, overrides = {}) {
  const dados = gerarContaValida(overrides);
  return contaRepository.inserir({
    usuarioId,
    nome: dados.nome,
    tipo: dados.tipo,
    saldoInicial: dados.saldoInicial,
  });
}

// ------------------------------------------------------------
// EXPORT DEFAULT
// ------------------------------------------------------------

export default {
  gerarContaValida,
  criarUsuarioAutenticado,
  criarContaNoBanco,
  TIPOS_VALIDOS,
};
