import transacaoRepository from '../repositories/transacao.repository.js';
import contaRepository from '../repositories/conta.repository.js';
import categoriaRepository from '../repositories/categoria.repository.js';
import { AppError } from '../middlewares/error.middleware.js';

// ============================================================
// CONSTANTES
// ============================================================

const TIPOS_VALIDOS = ['receita', 'despesa'];
const VALOR_MINIMO = 0.01;
const VALOR_MAXIMO = 999999999.99;
const DESCRICAO_MAX = 100;

// ============================================================
// VALIDAÇÕES
// ============================================================

function validarTipo(tipo) {
  if (!tipo || typeof tipo !== 'string') {
    return { campo: 'tipo', problema: 'Tipo é obrigatório.' };
  }
  if (!TIPOS_VALIDOS.includes(tipo)) {
    return { campo: 'tipo', problema: `Tipo inválido. Valores aceitos: ${TIPOS_VALIDOS.join(', ')}.` };
  }
  return null;
}

function validarValor(valor) {
  if (valor === undefined || valor === null) {
    return { campo: 'valor', problema: 'Valor é obrigatório.' };
  }
  if (typeof valor !== 'number' || isNaN(valor)) {
    return { campo: 'valor', problema: 'Valor deve ser um número.' };
  }
  if (valor < VALOR_MINIMO) {
    return { campo: 'valor', problema: `Valor mínimo é R$ ${VALOR_MINIMO.toFixed(2)}.` };
  }
  if (valor > VALOR_MAXIMO) {
    return { campo: 'valor', problema: `Valor máximo é R$ ${VALOR_MAXIMO.toFixed(2)}.` };
  }
  // Máximo 2 casas decimais (RT-015)
  const partes = valor.toString().split('.');
  if (partes[1] && partes[1].length > 2) {
    return { campo: 'valor', problema: 'Valor aceita no máximo 2 casas decimais.' };
  }
  return null;
}

function validarDescricao(descricao) {
  if (!descricao || typeof descricao !== 'string') {
    return { campo: 'descricao', problema: 'Descrição é obrigatória.' };
  }
  const desc = descricao.trim();
  if (desc.length === 0) {
    return { campo: 'descricao', problema: 'Descrição é obrigatória.' };
  }
  if (desc.length > DESCRICAO_MAX) {
    return { campo: 'descricao', problema: `Descrição deve ter no máximo ${DESCRICAO_MAX} caracteres.` };
  }
  return null;
}

function validarData(dataTransacao) {
  if (!dataTransacao || typeof dataTransacao !== 'string') {
    return { campo: 'dataTransacao', problema: 'Data da transação é obrigatória.' };
  }
  const data = new Date(dataTransacao);
  if (isNaN(data.getTime())) {
    return { campo: 'dataTransacao', problema: 'Data inválida. Use formato ISO 8601 (ex: 2026-04-30).' };
  }
  return null;
}

/**
 * Valida conta: existe, pertence ao usuário, está ativa.
 */
function validarConta(contaId, usuarioId) {
  if (!contaId) {
    return { erro: new AppError('CAMPO_OBRIGATORIO', 'Campo contaId é obrigatório.', 400, [{ campo: 'contaId', problema: 'contaId é obrigatório.' }]) };
  }
  const conta = contaRepository.buscarPorIdEUsuario(contaId, usuarioId);
  if (!conta) {
    return { erro: new AppError('CONTA_NAO_ENCONTRADA', 'Conta não encontrada.', 404) };
  }
  if (!conta.ativo) {
    return { erro: new AppError('CONTA_INATIVA', 'Não é possível registrar transações em conta inativa.', 422) };
  }
  return { conta };
}

/**
 * Valida categoria: existe, acessível, compatível com tipo.
 */
function validarCategoria(categoriaId, usuarioId, tipoTransacao) {
  if (!categoriaId) {
    return { erro: new AppError('CAMPO_OBRIGATORIO', 'Campo categoriaId é obrigatório.', 400, [{ campo: 'categoriaId', problema: 'categoriaId é obrigatório.' }]) };
  }
  const categoria = categoriaRepository.buscarPorIdAcessivel(categoriaId, usuarioId);
  if (!categoria) {
    return { erro: new AppError('CATEGORIA_NAO_ENCONTRADA', 'Categoria não encontrada.', 404) };
  }
  // Compatibilidade de tipo (RK-005)
  if (categoria.tipo !== 'ambos' && categoria.tipo !== tipoTransacao) {
    return { erro: new AppError('CATEGORIA_INCOMPATIVEL', `Categoria do tipo "${categoria.tipo}" não é compatível com transação do tipo "${tipoTransacao}".`, 422) };
  }
  return { categoria };
}

function formatarResposta(transacao) {
  return {
    id: transacao.id,
    tipo: transacao.tipo,
    valor: transacao.valor,
    descricao: transacao.descricao,
    dataTransacao: transacao.data_transacao,
    contaId: transacao.conta_id,
    categoriaId: transacao.categoria_id,
    criadoEm: transacao.criado_em,
    atualizadoEm: transacao.atualizado_em,
  };
}

// ============================================================
// OPERAÇÕES
// ============================================================

/**
 * Registra nova transação (US-020).
 */
export function criar(usuarioId, dados) {
  const { tipo, valor, descricao, dataTransacao, contaId, categoriaId } = dados;

  // Validações de campos simples
  const erros = [];
  const erroTipo = validarTipo(tipo);
  if (erroTipo) erros.push(erroTipo);
  const erroValor = validarValor(valor);
  if (erroValor) erros.push(erroValor);
  const erroDesc = validarDescricao(descricao);
  if (erroDesc) erros.push(erroDesc);
  const erroData = validarData(dataTransacao);
  if (erroData) erros.push(erroData);

  if (!contaId) erros.push({ campo: 'contaId', problema: 'contaId é obrigatório.' });
  if (!categoriaId) erros.push({ campo: 'categoriaId', problema: 'categoriaId é obrigatório.' });

  if (erros.length > 0) {
    const todosSaoObrigatorios = erros.every((e) => e.problema.toLowerCase().includes('obrigatóri'));
    const codigo = todosSaoObrigatorios ? 'CAMPO_OBRIGATORIO' : 'VALIDACAO';
    const mensagem = todosSaoObrigatorios
      ? 'Um ou mais campos obrigatórios não foram informados.'
      : 'Existem campos inválidos na requisição.';
    throw new AppError(codigo, mensagem, 400, erros);
  }

  // Validações de relacionamento
  const resultadoConta = validarConta(contaId, usuarioId);
  if (resultadoConta.erro) throw resultadoConta.erro;

  const resultadoCategoria = validarCategoria(categoriaId, usuarioId, tipo);
  if (resultadoCategoria.erro) throw resultadoCategoria.erro;

  const descNorm = descricao.trim().replace(/\s+/g, ' ');
  const dataNorm = new Date(dataTransacao).toISOString().split('T')[0];

  const transacao = transacaoRepository.inserir({
    tipo,
    valor,
    descricao: descNorm,
    dataTransacao: dataNorm,
    contaId,
    categoriaId,
  });

  return formatarResposta(transacao);
}

/**
 * Lista transações com filtros (US-021 e US-025).
 */
export function listar(usuarioId, filtros = {}) {
  const filtrosProcessados = {};

  if (filtros.tipo && TIPOS_VALIDOS.includes(filtros.tipo)) {
    filtrosProcessados.tipo = filtros.tipo;
  }
  if (filtros.contaId) filtrosProcessados.contaId = Number(filtros.contaId);
  if (filtros.categoriaId) filtrosProcessados.categoriaId = Number(filtros.categoriaId);
  if (filtros.dataInicio) filtrosProcessados.dataInicio = filtros.dataInicio;
  if (filtros.dataFim) filtrosProcessados.dataFim = filtros.dataFim;
  if (filtros.q) filtrosProcessados.q = filtros.q;
  if (filtros.ordem) filtrosProcessados.ordem = filtros.ordem;

  const transacoes = transacaoRepository.listarPorUsuario(usuarioId, filtrosProcessados);
  return transacoes.map(formatarResposta);
}

/**
 * Consulta transação específica (US-022).
 */
export function consultar(transacaoId, usuarioId) {
  const transacao = transacaoRepository.buscarPorIdEUsuario(transacaoId, usuarioId);
  if (!transacao) {
    throw new AppError('TRANSACAO_NAO_ENCONTRADA', 'Transação não encontrada.', 404);
  }
  return formatarResposta(transacao);
}

/**
 * Atualiza transação (US-023).
 */
export function atualizar(transacaoId, usuarioId, body = {}) {
  const transacao = transacaoRepository.buscarPorIdEUsuario(transacaoId, usuarioId);
  if (!transacao) {
    throw new AppError('TRANSACAO_NAO_ENCONTRADA', 'Transação não encontrada.', 404);
  }

  const temValor = Object.prototype.hasOwnProperty.call(body, 'valor');
  const temDescricao = Object.prototype.hasOwnProperty.call(body, 'descricao');
  const temData = Object.prototype.hasOwnProperty.call(body, 'dataTransacao');
  const temCategoria = Object.prototype.hasOwnProperty.call(body, 'categoriaId');

  if (!temValor && !temDescricao && !temData && !temCategoria) {
    throw new AppError('CORPO_VAZIO', 'Informe ao menos um campo para atualizar (valor, descricao, dataTransacao, categoriaId).', 400);
  }

  const erros = [];
  const dadosAtualizar = {};

  if (temValor) {
    const erroValor = validarValor(body.valor);
    if (erroValor) erros.push(erroValor);
    else dadosAtualizar.valor = body.valor;
  }

  if (temDescricao) {
    const erroDesc = validarDescricao(body.descricao);
    if (erroDesc) erros.push(erroDesc);
    else dadosAtualizar.descricao = body.descricao.trim().replace(/\s+/g, ' ');
  }

  if (temData) {
    const erroData = validarData(body.dataTransacao);
    if (erroData) erros.push(erroData);
    else dadosAtualizar.dataTransacao = new Date(body.dataTransacao).toISOString().split('T')[0];
  }

  if (temCategoria) {
    const resultadoCategoria = validarCategoria(body.categoriaId, usuarioId, transacao.tipo);
    if (resultadoCategoria.erro) throw resultadoCategoria.erro;
    dadosAtualizar.categoriaId = body.categoriaId;
  }

  if (erros.length > 0) {
    throw new AppError('VALIDACAO', 'Existem campos inválidos na requisição.', 400, erros);
  }

  const atualizada = transacaoRepository.atualizar(transacaoId, dadosAtualizar);
  return formatarResposta(atualizada);
}

/**
 * Exclui transação (US-024).
 */
export function excluir(transacaoId, usuarioId) {
  const transacao = transacaoRepository.buscarPorIdEUsuario(transacaoId, usuarioId);
  if (!transacao) {
    throw new AppError('TRANSACAO_NAO_ENCONTRADA', 'Transação não encontrada.', 404);
  }
  transacaoRepository.excluir(transacaoId);
}

export default {
  criar,
  listar,
  consultar,
  atualizar,
  excluir,
};
