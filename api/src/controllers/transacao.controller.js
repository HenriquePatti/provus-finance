import transacaoService from '../services/transacao.service.js';

/**
 * POST /api/transacoes — registrar nova transação (US-020).
 */
export function criar(req, res, next) {
  try {
    const transacao = transacaoService.criar(req.usuario.id, req.body || {});
    res.status(201).json(transacao);
  } catch (erro) {
    next(erro);
  }
}

/**
 * GET /api/transacoes — listar transações com filtros (US-021, US-025).
 */
export function listar(req, res, next) {
  try {
    const transacoes = transacaoService.listar(req.usuario.id, req.query || {});
    res.status(200).json(transacoes);
  } catch (erro) {
    next(erro);
  }
}

/**
 * GET /api/transacoes/:id — consultar transação específica (US-022).
 */
export function consultar(req, res, next) {
  try {
    const transacao = transacaoService.consultar(Number(req.params.id), req.usuario.id);
    res.status(200).json(transacao);
  } catch (erro) {
    next(erro);
  }
}

/**
 * PUT /api/transacoes/:id — atualizar transação (US-023).
 */
export function atualizar(req, res, next) {
  try {
    const transacao = transacaoService.atualizar(
      Number(req.params.id),
      req.usuario.id,
      req.body || {}
    );
    res.status(200).json(transacao);
  } catch (erro) {
    next(erro);
  }
}

/**
 * DELETE /api/transacoes/:id — excluir transação (US-024).
 */
export function excluir(req, res, next) {
  try {
    transacaoService.excluir(Number(req.params.id), req.usuario.id);
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

export default {
  criar,
  listar,
  consultar,
  atualizar,
  excluir,
};
