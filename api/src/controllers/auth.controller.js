import authService from '../services/auth.service.js';

/**
 * POST /api/auth/login
 * Autentica um usuário com e-mail e senha e devolve um JWT.
 */
export async function login(req, res, next) {
  try {
    const { email, senha } = req.body || {};

    const resultado = await authService.autenticar({ email, senha });

    res.status(200).json(resultado);
  } catch (erro) {
    next(erro);
  }
}

export default {
  login,
};
