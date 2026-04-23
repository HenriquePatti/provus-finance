import { validarToken, TokenInvalidoError, TokenExpiradoError } from '../utils/jwt.js';
import { AppError } from './error.middleware.js';

/**
 * Middleware de autenticação via JWT.
 *
 * Extrai o token do header "Authorization: Bearer <token>",
 * valida e injeta os dados do usuário em req.usuario.
 *
 * Erros possíveis:
 * - 401 TOKEN_AUSENTE: header não enviado
 * - 401 TOKEN_INVALIDO: token malformado ou assinatura inválida
 * - 401 TOKEN_EXPIRADO: token expirado
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(
      new AppError(
        'TOKEN_AUSENTE',
        'Token de autenticação não foi enviado.',
        401
      )
    );
  }

  // Esperado: "Bearer <token>"
  const partes = authHeader.split(' ');

  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return next(
      new AppError(
        'TOKEN_INVALIDO',
        'Formato do header Authorization é inválido. Use: Bearer <token>',
        401
      )
    );
  }

  const token = partes[1];

  try {
    const payload = validarToken(token);

    // Injeta os dados do usuário no request
    req.usuario = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch (erro) {
    if (erro instanceof TokenExpiradoError) {
      return next(new AppError('TOKEN_EXPIRADO', 'Token expirado.', 401));
    }

    if (erro instanceof TokenInvalidoError) {
      return next(new AppError('TOKEN_INVALIDO', 'Token inválido.', 401));
    }

    return next(erro);
  }
}