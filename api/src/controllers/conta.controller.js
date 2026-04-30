import contaService from '../services/conta.service.js';

/**
 * POST /api/contas — cria nova conta (US-009).
 */
export function criar(req, res, next) {
  try {
    const conta = contaService.criar(req.usuario.id, req.body || {});
    res.status(201).json(conta);
  } catch (erro) {
    next(erro);
  }
}

/**
 * GET /api/contas — lista contas do usuário (US-010).
 */
export function listar(req, res, next) {
  try {
    const contas = contaService.listar(req.usuario.id, req.query || {});
    res.status(200).json(contas);
  } catch (erro) {
    next(erro);
  }
}

/**
 * GET /api/contas/:id — consulta conta específica (US-011).
 */
export function consultar(req, res, next) {
  try {
    const conta = contaService.consultar(Number(req.params.id), req.usuario.id);
    res.status(200).json(conta);
  } catch (erro) {
    next(erro);
  }
}

/**
 * PUT /api/contas/:id — atualiza nome da conta (US-012).
 */
export function atualizar(req, res, next) {
  try {
    const conta = contaService.atualizar(
      Number(req.params.id),
      req.usuario.id,
      req.body || {}
    );
    res.status(200).json(conta);
  } catch (erro) {
    next(erro);
  }
}

/**
 * DELETE /api/contas/:id — desativa conta, soft delete (US-013).
 */
export function desativar(req, res, next) {
  try {
    contaService.desativar(Number(req.params.id), req.usuario.id);
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

/**
 * GET /api/contas/:id/saldo — consulta saldo calculado (US-014).
 */
export function consultarSaldo(req, res, next) {
  try {
    const saldo = contaService.consultarSaldo(Number(req.params.id), req.usuario.id);
    res.status(200).json(saldo);
  } catch (erro) {
    next(erro);
  }
}

export default {
  criar,
  listar,
  consultar,
  atualizar,
  desativar,
  consultarSaldo,
};
