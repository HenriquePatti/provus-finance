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

/**
 * PUT /api/usuarios/me — atualiza nome e/ou e-mail (US-003).
 */
export function atualizarPerfil(req, res, next) {
  try {
    const atualizado = usuarioService.atualizarPerfil(req.usuario.id, req.body || {});
    res.status(200).json(atualizado);
  } catch (erro) {
    next(erro);
  }
}

/**
 * PUT /api/usuarios/me/senha — alteração de senha (US-004).
 */
export async function alterarSenha(req, res, next) {
  try {
    const resultado = await usuarioService.alterarSenha(req.usuario.id, req.body || {});
    res.status(200).json(resultado);
  } catch (erro) {
    next(erro);
  }
}

export default {
  criar,
  obterPerfil,
  atualizarPerfil,
  alterarSenha,
};