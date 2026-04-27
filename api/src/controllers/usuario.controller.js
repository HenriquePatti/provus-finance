import usuarioService from '../services/usuario.service.js';

/**
 * POST /api/usuarios
 * Cria um novo usuário.
 */
export async function criar(req, res, next) {
  try {
    const { nome, email, senha } = req.body || {};

    const usuario = await usuarioService.criar({ nome, email, senha });

    res.status(201).json(usuario);
  } catch (erro) {
    next(erro);
  }
}

/**
 * GET /api/usuarios/me — consulta próprio perfil autenticado (US-002).
 *
 * Espera middleware `authMiddleware` (req.usuario.{ id, email }).
 */
export function obterPerfil(req, res, next) {
  try {
    const dados = usuarioService.obterPerfil(req.usuario.id);
    res.status(200).json(dados);
  } catch (erro) {
    next(erro);
  }
}

export default {
  criar,
  obterPerfil,
};