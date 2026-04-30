import db from '../config/database.js';

/**
 * Converte valor em reais (float) para centavos (integer).
 */
function reaisParaCentavos(valor) {
  return Math.round(valor * 100);
}

/**
 * Converte valor em centavos (integer) para reais (float).
 */
function centavosParaReais(centavos) {
  return centavos / 100;
}

/**
 * Formata uma transação do banco para resposta da API.
 */
function formatarTransacao(row) {
  if (!row) return undefined;
  return {
    ...row,
    valor: centavosParaReais(row.valor),
  };
}

/**
 * Insere uma nova transação.
 *
 * @param {Object} dados
 * @param {string} dados.tipo
 * @param {number} dados.valor - em reais
 * @param {string} dados.descricao
 * @param {string} dados.dataTransacao
 * @param {number} dados.contaId
 * @param {number} dados.categoriaId
 * @returns {Object} Transação criada
 */
export function inserir({ tipo, valor, descricao, dataTransacao, contaId, categoriaId }) {
  const stmt = db.prepare(`
    INSERT INTO transacoes (tipo, valor, descricao, data_transacao, conta_id, categoria_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const valorCentavos = reaisParaCentavos(valor);
  const resultado = stmt.run(tipo, valorCentavos, descricao, dataTransacao, contaId, categoriaId);
  return buscarPorId(resultado.lastInsertRowid);
}

/**
 * Busca uma transação pelo ID.
 */
export function buscarPorId(id) {
  const row = db.prepare(`
    SELECT id, tipo, valor, descricao, data_transacao, conta_id, categoria_id, criado_em, atualizado_em
    FROM transacoes
    WHERE id = ?
  `).get(id);

  return formatarTransacao(row);
}

/**
 * Busca transação pelo ID garantindo que pertence ao usuário (via conta).
 */
export function buscarPorIdEUsuario(id, usuarioId) {
  const row = db.prepare(`
    SELECT t.id, t.tipo, t.valor, t.descricao, t.data_transacao, t.conta_id, t.categoria_id, t.criado_em, t.atualizado_em
    FROM transacoes t
    INNER JOIN contas c ON c.id = t.conta_id
    WHERE t.id = ? AND c.usuario_id = ?
  `).get(id, usuarioId);

  return formatarTransacao(row);
}

/**
 * Lista transações do usuário com filtros.
 */
export function listarPorUsuario(usuarioId, filtros = {}) {
  const condicoes = ['c.usuario_id = ?'];
  const params = [usuarioId];

  if (filtros.tipo) {
    condicoes.push('t.tipo = ?');
    params.push(filtros.tipo);
  }

  if (filtros.contaId) {
    condicoes.push('t.conta_id = ?');
    params.push(filtros.contaId);
  }

  if (filtros.categoriaId) {
    condicoes.push('t.categoria_id = ?');
    params.push(filtros.categoriaId);
  }

  if (filtros.dataInicio) {
    condicoes.push('t.data_transacao >= ?');
    params.push(filtros.dataInicio);
  }

  if (filtros.dataFim) {
    condicoes.push('t.data_transacao <= ?');
    params.push(filtros.dataFim);
  }

  if (filtros.q) {
    condicoes.push('LOWER(t.descricao) LIKE ?');
    params.push(`%${filtros.q.toLowerCase()}%`);
  }

  const ordem = filtros.ordem === 'asc' ? 'ASC' : 'DESC';

  const sql = `
    SELECT t.id, t.tipo, t.valor, t.descricao, t.data_transacao, t.conta_id, t.categoria_id, t.criado_em, t.atualizado_em
    FROM transacoes t
    INNER JOIN contas c ON c.id = t.conta_id
    WHERE ${condicoes.join(' AND ')}
    ORDER BY t.data_transacao ${ordem}, t.id ${ordem}
  `;

  const rows = db.prepare(sql).all(...params);
  return rows.map(formatarTransacao);
}

/**
 * Atualiza campos editáveis de uma transação.
 */
export function atualizar(id, dados) {
  const campos = [];
  const params = [];

  if (dados.valor !== undefined) {
    campos.push('valor = ?');
    params.push(reaisParaCentavos(dados.valor));
  }

  if (dados.descricao !== undefined) {
    campos.push('descricao = ?');
    params.push(dados.descricao);
  }

  if (dados.dataTransacao !== undefined) {
    campos.push('data_transacao = ?');
    params.push(dados.dataTransacao);
  }

  if (dados.categoriaId !== undefined) {
    campos.push('categoria_id = ?');
    params.push(dados.categoriaId);
  }

  campos.push("atualizado_em = datetime('now')");
  params.push(id);

  const sql = `UPDATE transacoes SET ${campos.join(', ')} WHERE id = ?`;
  db.prepare(sql).run(...params);

  return buscarPorId(id);
}

/**
 * Exclui uma transação permanentemente (hard delete).
 */
export function excluir(id) {
  const stmt = db.prepare('DELETE FROM transacoes WHERE id = ?');
  const resultado = stmt.run(id);
  return resultado.changes > 0;
}

export default {
  inserir,
  buscarPorId,
  buscarPorIdEUsuario,
  listarPorUsuario,
  atualizar,
  excluir,
  reaisParaCentavos,
  centavosParaReais,
};
