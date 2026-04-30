import db from '../config/database.js';

/**
 * Insere uma nova categoria personalizada no banco.
 *
 * @param {Object} dados
 * @param {number} dados.usuarioId
 * @param {string} dados.nome
 * @param {string} dados.tipo
 * @param {string|null} dados.icone
 * @returns {Object} Categoria criada
 */
export function inserir({ usuarioId, nome, tipo, icone }) {
  const stmt = db.prepare(`
    INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id)
    VALUES (?, ?, ?, 0, ?)
  `);

  const resultado = stmt.run(nome, tipo, icone, usuarioId);
  return buscarPorId(resultado.lastInsertRowid);
}

/**
 * Busca uma categoria pelo ID.
 *
 * @param {number} id
 * @returns {Object|undefined}
 */
export function buscarPorId(id) {
  const stmt = db.prepare(`
    SELECT id, nome, tipo, icone, padrao, usuario_id, criado_em, atualizado_em
    FROM categorias
    WHERE id = ?
  `);

  return stmt.get(id);
}

/**
 * Busca uma categoria pelo ID garantindo que é acessível ao usuário.
 * Retorna se: é padrão OU pertence ao usuário.
 *
 * @param {number} id
 * @param {number} usuarioId
 * @returns {Object|undefined}
 */
export function buscarPorIdAcessivel(id, usuarioId) {
  const stmt = db.prepare(`
    SELECT id, nome, tipo, icone, padrao, usuario_id, criado_em, atualizado_em
    FROM categorias
    WHERE id = ? AND (padrao = 1 OR usuario_id = ?)
  `);

  return stmt.get(id, usuarioId);
}

/**
 * Lista categorias acessíveis ao usuário (padrão + personalizadas).
 *
 * @param {number} usuarioId
 * @param {Object} filtros
 * @param {string|undefined} filtros.tipo
 * @param {string|undefined} filtros.origem - 'padrao' ou 'personalizada'
 * @returns {Array}
 */
export function listarAcessiveis(usuarioId, filtros = {}) {
  const condicoes = ['(padrao = 1 OR usuario_id = ?)'];
  const params = [usuarioId];

  if (filtros.tipo) {
    // Ao filtrar por 'receita' ou 'despesa', inclui também categorias 'ambos'
    condicoes.push("(tipo = ? OR tipo = 'ambos')");
    params.push(filtros.tipo);
  }

  if (filtros.origem === 'padrao') {
    condicoes.push('padrao = 1');
  } else if (filtros.origem === 'personalizada') {
    condicoes.push('padrao = 0');
  }

  const sql = `
    SELECT id, nome, tipo, icone, padrao, usuario_id, criado_em, atualizado_em
    FROM categorias
    WHERE ${condicoes.join(' AND ')}
    ORDER BY padrao DESC, nome ASC
  `;

  return db.prepare(sql).all(...params);
}

/**
 * Atualiza nome e/ou ícone de uma categoria.
 *
 * @param {number} id
 * @param {Object} dados
 * @param {string|undefined} dados.nome
 * @param {string|null|undefined} dados.icone
 * @returns {Object} Categoria atualizada
 */
export function atualizar(id, dados) {
  const campos = [];
  const params = [];

  if (dados.nome !== undefined) {
    campos.push('nome = ?');
    params.push(dados.nome);
  }

  if (dados.icone !== undefined) {
    campos.push('icone = ?');
    params.push(dados.icone);
  }

  campos.push("atualizado_em = datetime('now')");
  params.push(id);

  const sql = `UPDATE categorias SET ${campos.join(', ')} WHERE id = ?`;
  db.prepare(sql).run(...params);

  return buscarPorId(id);
}

/**
 * Exclui uma categoria permanentemente (hard delete).
 *
 * @param {number} id
 * @returns {boolean} true se excluiu
 */
export function excluir(id) {
  const stmt = db.prepare('DELETE FROM categorias WHERE id = ?');
  const resultado = stmt.run(id);
  return resultado.changes > 0;
}

/**
 * Conta quantas transações estão vinculadas a uma categoria.
 * Retorna 0 se a tabela transacoes não existe ainda.
 *
 * @param {number} categoriaId
 * @returns {number}
 */
export function contarTransacoes(categoriaId) {
  const tabelaExiste = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='transacoes'
  `).get();

  if (!tabelaExiste) return 0;

  const resultado = db.prepare(`
    SELECT COUNT(*) as total FROM transacoes WHERE categoria_id = ?
  `).get(categoriaId);

  return resultado.total;
}

export default {
  inserir,
  buscarPorId,
  buscarPorIdAcessivel,
  listarAcessiveis,
  atualizar,
  excluir,
  contarTransacoes,
};
