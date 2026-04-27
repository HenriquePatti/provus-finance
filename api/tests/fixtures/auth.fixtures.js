/**
 * ============================================================
 * FIXTURES DE TESTE — AUTENTICAÇÃO
 * ============================================================
 *
 * Factories e helpers específicos para testes de login (US-006).
 *
 * Reaproveita `gerarUsuarioValido` das fixtures de usuários para
 * garantir que os dados sigam as mesmas regras de validação do
 * cadastro (RU-001 a RU-020).
 *
 * O helper `criarUsuarioParaLogin` semeia um usuário diretamente
 * no banco (via repositório), sem passar por POST /api/usuarios.
 * Isso desacopla os testes de login da implementação do cadastro
 * e replica fielmente a normalização aplicada pelo serviço real:
 *
 *   - nome:  trim + colapso de espaços múltiplos (RU-020, RG-016)
 *   - email: trim + lowercase            (RU-010, RG-020)
 *   - senha: hash bcrypt (sem trim)      (RG-004)
 * ============================================================
 */

import usuarioRepository from '../../src/repositories/usuario.repository.js';
import { gerarHash } from '../../src/utils/hash.js';
import { gerarUsuarioValido } from './usuarios.fixtures.js';

// ------------------------------------------------------------
// FACTORIES
// ------------------------------------------------------------

/**
 * Gera credenciais de login válidas (apenas { email, senha }).
 *
 * Uso típico: cenários onde o e-mail NÃO está cadastrado
 * (CT-EP002-US006-02) — o e-mail é gerado mas nunca semeado.
 *
 * @param {Object} overrides - Sobrescreve email ou senha
 * @returns {{email: string, senha: string}}
 */
export function gerarCredenciaisValidas(overrides = {}) {
  const { email, senha } = gerarUsuarioValido();
  return { email, senha, ...overrides };
}

// ------------------------------------------------------------
// HELPERS DE BANCO
// ------------------------------------------------------------

/**
 * Cria um usuário no banco e devolve credenciais conhecidas para login.
 *
 * Os dados são normalizados ANTES da persistência seguindo o mesmo
 * algoritmo do `usuario.service.js` (criar). Assim o usuário semeado
 * é indistinguível de um cadastrado via POST /api/usuarios.
 *
 * @param {Object} overrides - Sobrescreve nome, email ou senha gerados
 * @returns {Promise<{
 *   usuario: { id: number, nome: string, email: string, senha_hash: string, ... },
 *   credenciais: { email: string, senha: string }
 * }>}
 *   - `usuario`: linha do banco devolvida pelo repositório
 *   - `credenciais`: payload pronto para enviar em POST /api/auth/login
 */
export async function criarUsuarioParaLogin(overrides = {}) {
  const dadosBrutos = gerarUsuarioValido(overrides);

  const nomeNormalizado = dadosBrutos.nome.trim().replace(/\s+/g, ' ');
  const emailNormalizado = dadosBrutos.email.trim().toLowerCase();
  const senhaHash = await gerarHash(dadosBrutos.senha);

  const usuario = usuarioRepository.inserir({
    nome: nomeNormalizado,
    email: emailNormalizado,
    senhaHash,
  });

  return {
    usuario,
    credenciais: {
      email: emailNormalizado,
      senha: dadosBrutos.senha,
    },
  };
}

// ------------------------------------------------------------
// EXPORT DEFAULT
// ------------------------------------------------------------

export default {
  gerarCredenciaisValidas,
  criarUsuarioParaLogin,
};
