/**
 * ============================================================
 * FIXTURES DE TESTE — CATEGORIAS
 * ============================================================
 *
 * Factories e helpers para testes do EP-004 (Gestão de Categorias).
 * ============================================================
 */

import { randomInt } from 'crypto';
import categoriaRepository from '../../src/repositories/categoria.repository.js';
import { criarUsuarioParaLogin } from './auth.fixtures.js';

// ------------------------------------------------------------
// CONSTANTES
// ------------------------------------------------------------

const TIPOS_VALIDOS = ['receita', 'despesa', 'ambos'];

const NOMES_CATEGORIAS = [
  'Academia', 'Pets', 'Jogos', 'Assinaturas', 'Presentes',
  'Viagens', 'Vestuário', 'Streaming', 'Doações', 'Seguros',
];

// ------------------------------------------------------------
// FACTORIES VÁLIDAS
// ------------------------------------------------------------

/**
 * Gera dados válidos para criação de categoria.
 */
export function gerarCategoriaValida(overrides = {}) {
  return {
    nome: NOMES_CATEGORIAS[randomInt(0, NOMES_CATEGORIAS.length)] + ' ' + randomInt(100, 999),
    tipo: TIPOS_VALIDOS[randomInt(0, TIPOS_VALIDOS.length)],
    icone: '🎯',
    ...overrides,
  };
}

// ------------------------------------------------------------
// HELPERS DE BANCO
// ------------------------------------------------------------

/**
 * Cria um usuário autenticado e retorna token + dados.
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
 * Cria uma categoria personalizada diretamente no banco.
 */
export function criarCategoriaNoBanco(usuarioId, overrides = {}) {
  const dados = gerarCategoriaValida(overrides);
  return categoriaRepository.inserir({
    usuarioId,
    nome: dados.nome,
    tipo: dados.tipo,
    icone: dados.icone,
  });
}

/**
 * Retorna o ID de uma categoria padrão existente no banco.
 * Útil para testes que precisam de uma categoria padrão.
 */
export function buscarCategoriaPadrao(tipo = 'despesa') {
  const categorias = categoriaRepository.listarAcessiveis(0, { tipo });
  return categorias.find((c) => c.padrao === 1);
}

// ------------------------------------------------------------
// EXPORT DEFAULT
// ------------------------------------------------------------

export default {
  gerarCategoriaValida,
  criarUsuarioAutenticado,
  criarCategoriaNoBanco,
  buscarCategoriaPadrao,
  TIPOS_VALIDOS,
};
