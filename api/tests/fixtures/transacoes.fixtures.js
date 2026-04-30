/**
 * ============================================================
 * FIXTURES DE TESTE — TRANSAÇÕES
 * ============================================================
 */

import { randomInt } from 'crypto';
import transacaoRepository from '../../src/repositories/transacao.repository.js';
import contaRepository from '../../src/repositories/conta.repository.js';
import categoriaRepository from '../../src/repositories/categoria.repository.js';
import { criarUsuarioParaLogin } from './auth.fixtures.js';

// ------------------------------------------------------------
// FACTORIES VÁLIDAS
// ------------------------------------------------------------

/**
 * Gera dados válidos para criação de transação.
 * Requer contaId e categoriaId válidos.
 */
export function gerarTransacaoValida(contaId, categoriaId, overrides = {}) {
  return {
    tipo: 'despesa',
    valor: randomInt(1, 1000) + randomInt(0, 99) / 100,
    descricao: `Transação teste ${randomInt(100, 999)}`,
    dataTransacao: '2026-04-30',
    contaId,
    categoriaId,
    ...overrides,
  };
}

// ------------------------------------------------------------
// HELPERS DE BANCO
// ------------------------------------------------------------

/**
 * Cria um usuário autenticado com conta e categoria prontos para transações.
 * Retorna token, usuario, conta, categoriaDespesa, categoriaReceita.
 */
export async function criarAmbienteTransacao(requestAgent, overrides = {}) {
  const { usuario, credenciais } = await criarUsuarioParaLogin(overrides);

  const login = await requestAgent
    .post('/api/auth/login')
    .send(credenciais);

  const conta = contaRepository.inserir({
    usuarioId: usuario.id,
    nome: 'Conta Teste',
    tipo: 'corrente',
    saldoInicial: 5000,
  });

  // Busca categorias padrão para usar nos testes
  const categorias = categoriaRepository.listarAcessiveis(usuario.id, {});
  const categoriaDespesa = categorias.find((c) => c.padrao === 1 && c.tipo === 'despesa');
  const categoriaReceita = categorias.find((c) => c.padrao === 1 && c.tipo === 'receita');

  return {
    token: login.body.token,
    usuario,
    conta,
    categoriaDespesa,
    categoriaReceita,
  };
}

/**
 * Cria uma transação diretamente no banco.
 */
export function criarTransacaoNoBanco(contaId, categoriaId, overrides = {}) {
  const dados = {
    tipo: 'despesa',
    valor: 100,
    descricao: `Transação seed ${randomInt(100, 999)}`,
    dataTransacao: '2026-04-15',
    contaId,
    categoriaId,
    ...overrides,
  };

  return transacaoRepository.inserir(dados);
}

export default {
  gerarTransacaoValida,
  criarAmbienteTransacao,
  criarTransacaoNoBanco,
};
