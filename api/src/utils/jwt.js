import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

if (!SECRET) {
  throw new Error('JWT_SECRET não configurado no .env');
}

/**
 * Erro customizado para tokens inválidos
 */
export class TokenInvalidoError extends Error {
  constructor(mensagem = 'Token inválido') {
    super(mensagem);
    this.name = 'TokenInvalidoError';
    this.codigo = 'TOKEN_INVALIDO';
  }
}

/**
 * Erro customizado para tokens expirados
 */
export class TokenExpiradoError extends Error {
  constructor(mensagem = 'Token expirado') {
    super(mensagem);
    this.name = 'TokenExpiradoError';
    this.codigo = 'TOKEN_EXPIRADO';
  }
}

/**
 * Gera um token JWT com o payload informado.
 *
 * @param {Object} payload - Dados a serem codificados no token
 * @returns {string} Token JWT
 */
export function gerarToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Valida e decodifica um token JWT.
 *
 * @param {string} token - Token a ser validado
 * @returns {Object} Payload decodificado
 * @throws {TokenInvalidoError} Se o token for inválido ou malformado
 * @throws {TokenExpiradoError} Se o token estiver expirado
 */
export function validarToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (erro) {
    if (erro.name === 'TokenExpiredError') {
      throw new TokenExpiradoError();
    }
    throw new TokenInvalidoError();
  }
}