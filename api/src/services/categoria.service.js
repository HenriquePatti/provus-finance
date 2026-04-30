import categoriaRepository from '../repositories/categoria.repository.js';
import { AppError } from '../middlewares/error.middleware.js';

// ============================================================
// CONSTANTES
// ============================================================

const TIPOS_VALIDOS = ['receita', 'despesa', 'ambos'];

// ============================================================
// VALIDAÇÕES
// ============================================================

/**
 * Valida o nome da categoria (RK-015 a RK-018).
 */
function validarNome(nome) {
  if (!nome || typeof nome !== 'string') {
    return { campo: 'nome', problema: 'Nome é obrigatório.' };
  }

  const nomeTrim = nome.trim().replace(/\s+/g, ' ');

  if (nomeTrim.length === 0) {
    return { campo: 'nome', problema: 'Nome é obrigatório.' };
  }

  if (nomeTrim.length < 2) {
    return { campo: 'nome', problema: 'Nome deve ter no mínimo 2 caracteres.' };
  }

  if (nomeTrim.length > 50) {
    return { campo: 'nome', problema: 'Nome deve ter no máximo 50 caracteres.' };
  }

  if (/^\d+$/.test(nomeTrim)) {
    return { campo: 'nome', problema: 'Nome não pode conter apenas números.' };
  }

  return null;
}

/**
 * Valida o tipo da categoria (RK-019 a RK-021).
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
 * Valida o ícone da categoria (RK-023 a RK-026).
 */
function validarIcone(icone) {
  if (icone === undefined || icone === null) {
    return null; // Opcional
  }

  if (typeof icone !== 'string') {
    return { campo: 'icone', problema: 'Ícone deve ser uma string.' };
  }

  if (icone.length > 4) {
    return { campo: 'icone', problema: 'Ícone deve ter no máximo 4 caracteres.' };
  }

  return null;
}

/**
 * Formata resposta da categoria.
 */
function formatarResposta(categoria) {
  return {
    id: categoria.id,
    nome: categoria.nome,
    tipo: categoria.tipo,
    icone: categoria.icone,
    padrao: categoria.padrao === 1,
    usuarioId: categoria.usuario_id,
    criadoEm: categoria.criado_em,
    atualizadoEm: categoria.atualizado_em,
  };
}

// ============================================================
// OPERAÇÕES
// ============================================================

/**
 * Lista categorias acessíveis ao usuário (US-015).
 *
 * @param {number} usuarioId
 * @param {Object} filtros - { tipo?, origem? }
 * @returns {Array}
 */
export function listar(usuarioId, filtros = {}) {
  const filtrosProcessados = {};

  if (filtros.tipo && TIPOS_VALIDOS.includes(filtros.tipo)) {
    filtrosProcessados.tipo = filtros.tipo;
  }

  if (filtros.origem === 'padrao' || filtros.origem === 'personalizada') {
    filtrosProcessados.origem = filtros.origem;
  }

  const categorias = categoriaRepository.listarAcessiveis(usuarioId, filtrosProcessados);
  return categorias.map(formatarResposta);
}

/**
 * Cria categoria personalizada (US-016).
 *
 * @param {number} usuarioId
 * @param {Object} dados - { nome, tipo, icone? }
 * @returns {Object} Categoria criada
 */
export function criar(usuarioId, dados) {
  const { nome, tipo, icone } = dados;

  const erros = [];

  const erroNome = validarNome(nome);
  if (erroNome) erros.push(erroNome);

  const erroTipo = validarTipo(tipo);
  if (erroTipo) erros.push(erroTipo);

  const erroIcone = validarIcone(icone);
  if (erroIcone) erros.push(erroIcone);

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

  const nomeTrim = nome.trim().replace(/\s+/g, ' ');
  const iconeFinal = icone !== undefined && icone !== null ? icone : null;

  const categoria = categoriaRepository.inserir({
    usuarioId,
    nome: nomeTrim,
    tipo,
    icone: iconeFinal,
  });

  return formatarResposta(categoria);
}

/**
 * Consulta categoria específica (US-017).
 *
 * @param {number} categoriaId
 * @param {number} usuarioId
 * @returns {Object}
 */
export function consultar(categoriaId, usuarioId) {
  const categoria = categoriaRepository.buscarPorIdAcessivel(categoriaId, usuarioId);

  if (!categoria) {
    throw new AppError('CATEGORIA_NAO_ENCONTRADA', 'Categoria não encontrada.', 404);
  }

  return formatarResposta(categoria);
}

/**
 * Atualiza categoria personalizada (US-018).
 *
 * @param {number} categoriaId
 * @param {number} usuarioId
 * @param {Object} body - { nome?, icone? }
 * @returns {Object}
 */
export function atualizar(categoriaId, usuarioId, body = {}) {
  const categoria = categoriaRepository.buscarPorIdAcessivel(categoriaId, usuarioId);

  if (!categoria) {
    throw new AppError('CATEGORIA_NAO_ENCONTRADA', 'Categoria não encontrada.', 404);
  }

  // RK-049: categorias padrão não podem ser atualizadas
  if (categoria.padrao === 1) {
    throw new AppError(
      'ACESSO_NEGADO',
      'Categorias padrão do sistema não podem ser modificadas.',
      403
    );
  }

  const temNome = Object.prototype.hasOwnProperty.call(body, 'nome');
  const temIcone = Object.prototype.hasOwnProperty.call(body, 'icone');

  if (!temNome && !temIcone) {
    throw new AppError(
      'CORPO_VAZIO',
      'Informe ao menos um campo (nome ou icone) para atualizar.',
      400
    );
  }

  const dadosAtualizar = {};
  const erros = [];

  if (temNome) {
    const erroNome = validarNome(body.nome);
    if (erroNome) erros.push(erroNome);
    else dadosAtualizar.nome = body.nome.trim().replace(/\s+/g, ' ');
  }

  if (temIcone) {
    const erroIcone = validarIcone(body.icone);
    if (erroIcone) erros.push(erroIcone);
    else dadosAtualizar.icone = body.icone;
  }

  if (erros.length > 0) {
    throw new AppError('VALIDACAO', 'Existem campos inválidos na requisição.', 400, erros);
  }

  const atualizada = categoriaRepository.atualizar(categoriaId, dadosAtualizar);
  return formatarResposta(atualizada);
}

/**
 * Exclui categoria personalizada (US-019).
 *
 * @param {number} categoriaId
 * @param {number} usuarioId
 */
export function excluir(categoriaId, usuarioId) {
  const categoria = categoriaRepository.buscarPorIdAcessivel(categoriaId, usuarioId);

  if (!categoria) {
    throw new AppError('CATEGORIA_NAO_ENCONTRADA', 'Categoria não encontrada.', 404);
  }

  // RK-044: categorias padrão não podem ser excluídas
  if (categoria.padrao === 1) {
    throw new AppError(
      'ACESSO_NEGADO',
      'Categorias padrão do sistema não podem ser excluídas.',
      403
    );
  }

  // RK-046: categoria com transações não pode ser excluída
  const totalTransacoes = categoriaRepository.contarTransacoes(categoriaId);
  if (totalTransacoes > 0) {
    throw new AppError(
      'CATEGORIA_EM_USO',
      `Esta categoria possui ${totalTransacoes} transação(ões) vinculada(s) e não pode ser excluída.`,
      409
    );
  }

  categoriaRepository.excluir(categoriaId);
}

export default {
  listar,
  criar,
  consultar,
  atualizar,
  excluir,
};
