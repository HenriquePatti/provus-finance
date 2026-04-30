import contaRepository from '../repositories/conta.repository.js';
import { AppError } from '../middlewares/error.middleware.js';

// ============================================================
// CONSTANTES
// ============================================================

const TIPOS_VALIDOS = ['corrente', 'poupanca', 'carteira_digital', 'dinheiro', 'investimento'];

// ============================================================
// VALIDAÇÕES
// ============================================================

/**
 * Valida o nome da conta.
 */
function validarNome(nome) {
  if (!nome || typeof nome !== 'string') {
    return { campo: 'nome', problema: 'Nome é obrigatório.' };
  }

  const nomeTrim = nome.trim();

  if (nomeTrim.length === 0) {
    return { campo: 'nome', problema: 'Nome é obrigatório.' };
  }

  if (nomeTrim.length < 2) {
    return { campo: 'nome', problema: 'Nome deve ter no mínimo 2 caracteres.' };
  }

  if (nomeTrim.length > 100) {
    return { campo: 'nome', problema: 'Nome deve ter no máximo 100 caracteres.' };
  }

  return null;
}

/**
 * Valida o tipo da conta.
 */
function validarTipo(tipo) {
  if (!tipo || typeof tipo !== 'string') {
    return { campo: 'tipo', problema: 'Tipo é obrigatório.' };
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return {
      campo: 'tipo',
      problema: `Tipo inválido. Valores aceitos: ${TIPOS_VALIDOS.join(', ')}.`,
    };
  }

  return null;
}

/**
 * Valida o saldo inicial.
 */
function validarSaldoInicial(saldoInicial) {
  if (saldoInicial === undefined || saldoInicial === null) {
    return null; // Opcional — padrão 0
  }

  if (typeof saldoInicial !== 'number' || isNaN(saldoInicial)) {
    return { campo: 'saldoInicial', problema: 'Saldo inicial deve ser um número.' };
  }

  if (saldoInicial < 0) {
    return { campo: 'saldoInicial', problema: 'Saldo inicial deve ser maior ou igual a zero.' };
  }

  return null;
}

/**
 * Remove dados internos e formata resposta da conta.
 */
function formatarResposta(conta) {
  return {
    id: conta.id,
    usuarioId: conta.usuario_id,
    nome: conta.nome,
    tipo: conta.tipo,
    saldoInicial: conta.saldo_inicial,
    ativo: conta.ativo === 1,
    criadoEm: conta.criado_em,
    atualizadoEm: conta.atualizado_em,
  };
}

/**
 * Formata resposta com saldo calculado.
 */
function formatarRespostaComSaldo(conta, saldoCalculado) {
  return {
    ...formatarResposta(conta),
    saldoCalculado,
  };
}

// ============================================================
// OPERAÇÕES
// ============================================================

/**
 * Cria uma nova conta (US-009).
 *
 * @param {number} usuarioId
 * @param {Object} dados - { nome, tipo, saldoInicial? }
 * @returns {Object} Conta criada formatada
 */
export function criar(usuarioId, dados) {
  const { nome, tipo, saldoInicial } = dados;

  const erros = [];

  const erroNome = validarNome(nome);
  if (erroNome) erros.push(erroNome);

  const erroTipo = validarTipo(tipo);
  if (erroTipo) erros.push(erroTipo);

  const erroSaldo = validarSaldoInicial(saldoInicial);
  if (erroSaldo) erros.push(erroSaldo);

  if (erros.length > 0) {
    const todosSaoObrigatorios = erros.every((e) =>
      e.problema.toLowerCase().includes('obrigatóri')
    );

    const codigo = todosSaoObrigatorios ? 'CAMPO_OBRIGATORIO' : 'VALIDACAO';
    const mensagem = todosSaoObrigatorios
      ? 'Um ou mais campos obrigatórios não foram informados.'
      : 'Existem campos inválidos na requisição.';

    throw new AppError(codigo, mensagem, 400, erros);
  }

  const nomeTrim = nome.trim();
  const saldoFinal = saldoInicial !== undefined && saldoInicial !== null ? saldoInicial : 0;

  const conta = contaRepository.inserir({
    usuarioId,
    nome: nomeTrim,
    tipo,
    saldoInicial: saldoFinal,
  });

  return formatarResposta(conta);
}

/**
 * Lista contas do usuário com filtros (US-010).
 *
 * @param {number} usuarioId
 * @param {Object} filtros - { tipo?, ativo? }
 * @returns {Array} Lista de contas formatadas
 */
export function listar(usuarioId, filtros = {}) {
  const filtrosProcessados = {};

  if (filtros.tipo) {
    if (!TIPOS_VALIDOS.includes(filtros.tipo)) {
      throw new AppError(
        'VALIDACAO',
        `Tipo inválido. Valores aceitos: ${TIPOS_VALIDOS.join(', ')}.`,
        400
      );
    }
    filtrosProcessados.tipo = filtros.tipo;
  }

  if (filtros.ativo === 'false' || filtros.ativo === false) {
    filtrosProcessados.ativo = false;
  }

  const contas = contaRepository.listarPorUsuario(usuarioId, filtrosProcessados);
  return contas.map(formatarResposta);
}

/**
 * Consulta conta específica com saldo calculado (US-011).
 *
 * @param {number} contaId
 * @param {number} usuarioId
 * @returns {Object} Conta com saldoCalculado
 */
export function consultar(contaId, usuarioId) {
  const conta = contaRepository.buscarPorIdEUsuario(contaId, usuarioId);

  if (!conta) {
    throw new AppError('CONTA_NAO_ENCONTRADA', 'Conta não encontrada.', 404);
  }

  const saldoCalculado = contaRepository.calcularSaldo(contaId);

  return formatarRespostaComSaldo(conta, saldoCalculado);
}

/**
 * Atualiza o nome da conta (US-012).
 *
 * @param {number} contaId
 * @param {number} usuarioId
 * @param {Object} body - { nome }
 * @returns {Object} Conta atualizada
 */
export function atualizar(contaId, usuarioId, body = {}) {
  const temNome = Object.prototype.hasOwnProperty.call(body, 'nome');

  if (!temNome) {
    throw new AppError(
      'CORPO_VAZIO',
      'Informe ao menos o campo nome para atualizar.',
      400
    );
  }

  const conta = contaRepository.buscarPorIdEUsuario(contaId, usuarioId);

  if (!conta) {
    throw new AppError('CONTA_NAO_ENCONTRADA', 'Conta não encontrada.', 404);
  }

  const erroNome = validarNome(body.nome);
  if (erroNome) {
    const codigo = erroNome.problema.toLowerCase().includes('obrigatóri')
      ? 'CAMPO_OBRIGATORIO'
      : 'VALIDACAO';
    throw new AppError(codigo, erroNome.problema, 400, [erroNome]);
  }

  const nomeTrim = body.nome.trim();
  const atualizada = contaRepository.atualizarNome(contaId, nomeTrim);

  return formatarResposta(atualizada);
}

/**
 * Desativa uma conta — soft delete (US-013).
 *
 * @param {number} contaId
 * @param {number} usuarioId
 */
export function desativar(contaId, usuarioId) {
  const conta = contaRepository.buscarPorIdEUsuario(contaId, usuarioId);

  if (!conta) {
    throw new AppError('CONTA_NAO_ENCONTRADA', 'Conta não encontrada.', 404);
  }

  if (!conta.ativo) {
    throw new AppError('CONTA_JA_INATIVA', 'Esta conta já está inativa.', 400);
  }

  contaRepository.desativar(contaId);
}

/**
 * Consulta saldo calculado de uma conta (US-014).
 *
 * @param {number} contaId
 * @param {number} usuarioId
 * @returns {Object} { contaId, nome, saldoCalculado }
 */
export function consultarSaldo(contaId, usuarioId) {
  const conta = contaRepository.buscarPorIdEUsuario(contaId, usuarioId);

  if (!conta) {
    throw new AppError('CONTA_NAO_ENCONTRADA', 'Conta não encontrada.', 404);
  }

  const saldoCalculado = contaRepository.calcularSaldo(contaId);

  return {
    contaId: conta.id,
    nome: conta.nome,
    saldoCalculado,
  };
}

export default {
  criar,
  listar,
  consultar,
  atualizar,
  desativar,
  consultarSaldo,
};
