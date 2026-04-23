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

export default {
  criar,
};