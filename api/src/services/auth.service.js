import usuarioRepository from '../repositories/usuario.repository.js';
import { compararHash } from '../utils/hash.js';
import { gerarToken } from '../utils/jwt.js';
import { AppError } from '../middlewares/error.middleware.js';

// ============================================================
// VALIDAÇÕES
// ============================================================

/**
 * Valida apenas a obrigatoriedade do e-mail no login.
 *
 * IMPORTANTE: o login NÃO valida formato/regex de e-mail. A validação
 * de formato acontece no cadastro. No login basta verificar se o
 * campo foi enviado — a comparação com a base já decide o resto.
 */
function validarEmail(email) {
  if (typeof email !== 'string' || email.trim().length === 0) {
    return { campo: 'email', problema: 'E-mail é obrigatório.' };
  }
  return null;
}

/**
 * Valida apenas a obrigatoriedade da senha no login.
 *
 * IMPORTANTE: o login NÃO valida complexidade da senha (maiúscula,
 * número etc.). Essa validação foi feita no cadastro. Aqui basta
 * verificar se o campo foi enviado.
 */
function validarSenha(senha) {
  if (typeof senha !== 'string' || senha.length === 0) {
    return { campo: 'senha', problema: 'Senha é obrigatória.' };
  }
  return null;
}

/**
 * Normaliza os dados de entrada do login.
 *
 * - email: trim + lowercase (RU-010, RG-020)
 * - senha: NÃO sofre trim (espaços podem ser parte da senha)
 */
function normalizarDados({ email, senha }) {
  return {
    email: typeof email === 'string' ? email.trim().toLowerCase() : email,
    senha,
  };
}

/**
 * Formata o objeto de usuário para a resposta da API,
 * removendo qualquer campo sensível (senha_hash, timestamps internos).
 */
function formatarUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}

// ============================================================
// OPERAÇÕES
// ============================================================

/**
 * Autentica um usuário com e-mail e senha e retorna um JWT.
 *
 * Regras críticas:
 * - RU-022 (anti-enumeração): retorna o MESMO erro tanto quando o
 *   e-mail não está cadastrado quanto quando a senha está incorreta.
 *   O cliente não consegue distinguir os dois casos pela resposta.
 * - RU-024: gera JWT assinado com a chave configurada e expiração
 *   de 24h (configurável via JWT_EXPIRES_IN).
 * - RU-025: payload do token contém { sub, email, iat, exp }.
 *
 * @param {Object} dados - { email, senha }
 * @returns {Promise<{ token: string, usuario: { id, nome, email } }>}
 * @throws {AppError} 400 CAMPO_OBRIGATORIO — campos ausentes/vazios
 * @throws {AppError} 401 CREDENCIAIS_INVALIDAS — e-mail não cadastrado OU senha incorreta
 */
export async function autenticar(dados) {
  const { email, senha } = normalizarDados(dados);

  const erros = [];
  const erroEmail = validarEmail(email);
  if (erroEmail) erros.push(erroEmail);

  const erroSenha = validarSenha(senha);
  if (erroSenha) erros.push(erroSenha);

  if (erros.length > 0) {
    throw new AppError(
      'CAMPO_OBRIGATORIO',
      'Um ou mais campos obrigatórios não foram informados.',
      400,
      erros
    );
  }

  const usuario = usuarioRepository.buscarPorEmail(email);

  if (!usuario) {
    throw new AppError(
      'CREDENCIAIS_INVALIDAS',
      'E-mail ou senha incorretos.',
      401
    );
  }

  const senhaConfere = await compararHash(senha, usuario.senha_hash);

  if (!senhaConfere) {
    throw new AppError(
      'CREDENCIAIS_INVALIDAS',
      'E-mail ou senha incorretos.',
      401
    );
  }

  const token = gerarToken({
    sub: usuario.id,
    email: usuario.email,
  });

  return {
    token,
    usuario: formatarUsuario(usuario),
  };
}

export default {
  autenticar,
};
