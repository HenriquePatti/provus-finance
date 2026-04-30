import categoriaService from '../services/categoria.service.js';

/**
 * GET /api/categorias — lista categorias acessíveis (US-015).
 */
export function listar(req, res, next) {
  try {
    const categorias = categoriaService.listar(req.usuario.id, req.query || {});
    res.status(200).json(categorias);
  } catch (erro) {
    next(erro);
  }
}

/**
 * POST /api/categorias — cria categoria personalizada (US-016).
 */
export function criar(req, res, next) {
  try {
    const categoria = categoriaService.criar(req.usuario.id, req.body || {});
    res.status(201).json(categoria);
  } catch (erro) {
    next(erro);
  }
}

/**
 * GET /api/categorias/:id — consulta categoria específica (US-017).
 */
export function consultar(req, res, next) {
  try {
    const categoria = categoriaService.consultar(Number(req.params.id), req.usuario.id);
    res.status(200).json(categoria);
  } catch (erro) {
    next(erro);
  }
}

/**
 * PUT /api/categorias/:id — atualiza categoria personalizada (US-018).
 */
export function atualizar(req, res, next) {
  try {
    const categoria = categoriaService.atualizar(
      Number(req.params.id),
      req.usuario.id,
      req.body || {}
    );
    res.status(200).json(categoria);
  } catch (erro) {
    next(erro);
  }
}

/**
 * DELETE /api/categorias/:id — exclui categoria personalizada (US-019).
 */
export function excluir(req, res, next) {
  try {
    categoriaService.excluir(Number(req.params.id), req.usuario.id);
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

export default {
  listar,
  criar,
  consultar,
  atualizar,
  excluir,
};
