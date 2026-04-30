import db from '../config/database.js';

/**
 * Insere uma nova conta no banco.
 *
 * @param {Object} dados
 * @param {number} dados.usuarioId
 * @param {string} dados.nome
 * @param {string} dados.tipo
 * @param {number} dados.saldoInicial
 * @returns {Object} Conta criada
 */
export function inserir({ usuarioId, nome, tipo, saldoInicial }) {
  const stmt = db.prepare(`
    INSERT INTO contas (usuario_id, nome, tipo, saldo_inicial)
    VALUES (?, ?, ?, ?)
  `);

  const resultado = stmt.run(usuarioId, nome, tipo, saldoInicial);
  return buscarPorId(resultado.lastInsertRowid);
}

/**
 * Busca uma conta pelo ID, independente do usuário.
 *
 * @param {number} id
 * @returns {Object|undefined}
 */
export function buscarPorId(id) {
  const stmt = db.prepare(`
    SELECT id, usuario_id, nome, tipo, saldo_inicial, ativo, criado_em, atualizado_em
    FROM contas
    WHERE id = ?
  `);

  return stmt.get(id);
}

/**
 * Busca uma conta pelo ID garantindo que pertence ao usuário.
 *
 * @param {number} id
 * @param {number} usuarioId
 * @returns {Object|undefined}
 */
export function buscarPorIdEUsuario(id, usuarioId) {
  const stmt = db.prepare(`
    SELECT id, usuario_id, nome, tipo, saldo_inicial, ativo, criado_em, atualizado_em
    FROM contas
    WHERE id = ? AND usuario_id = ?
  `);

  return stmt.get(id, usuarioId);
}

/**
 * Lista contas de um usuário com filtros opcionais.
 *
 * @param {number} usuarioId
 * @param {Object} filtros
 * @param {string|undefined} filtros.tipo
 * @param {boolean|undefined} filtros.ativo  — undefined = retorna ativas (ativo=1)
 * @returns {Array}
 */
export function listarPorUsuario(usuarioId, filtros = {}) {
  const condicoes = ['usuario_id = ?'];
  const params = [usuarioId];

  // Filtro de ativo: padrão retorna apenas ativas
  if (filtros.ativo === false) {
    condicoes.push('ativo = 0');
  } else {
    condicoes.push('ativo = 1');
  }

  if (filtros.tipo) {
    condicoes.push('tipo = ?');
    params.push(filtros.tipo);
  }

  const sql = `
    SELECT id, usuario_id, nome, tipo, saldo_inicial, ativo, criado_em, atualizado_em
    FROM contas
    WHERE ${condicoes.join(' AND ')}
    ORDER BY criado_em ASC
  `;

  return db.prepare(sql).all(...params);
}

/**
 * Atualiza o nome da conta.
 *
 * @param {number} id
 * @param {string} nome
 * @returns {Object} Conta atualizada
 */
export function atualizarNome(id, nome) {
  const stmt = db.prepare(`
    UPDATE contas
    SET nome = ?, atualizado_em = datetime('now')
    WHERE id = ?
  `);

  stmt.run(nome, id);
  return buscarPorId(id);
}

/**
 * Realiza soft delete — seta ativo = 0.
 *
 * @param {number} id
 * @returns {boolean} true se desativou
 */
export function desativar(id) {
  const stmt = db.prepare(`
    UPDATE contas
    SET ativo = 0, atualizado_em = datetime('now')
    WHERE id = ?
  `);

  const resultado = stmt.run(id);
  return resultado.changes > 0;
}

/**
 * Calcula o saldo atual da conta.
 * saldo = saldo_inicial + sum(receitas) - sum(despesas)
 *
 * Enquanto a tabela transacoes não existe (EP-003), retorna saldo_inicial.
 * Quando EP-005 for implementado, este método será atualizado para
 * incluir o JOIN com transacoes.
 *
 * @param {number} id
 * @returns {number|undefined} saldo calculado, ou undefined se conta não existe
 */
export function calcularSaldo(id) {
  const conta = buscarPorId(id);
  if (!conta) return undefined;

  // Verifica se a tabela transacoes existe
  const tabelaExiste = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='transacoes'
  `).get();

  if (!tabelaExiste) {
    return conta.saldo_inicial;
  }

  const resultado = db.prepare(`
    SELECT
      c.saldo_inicial,
      COALESCE(SUM(CASE WHEN t.tipo = 'receita' THEN t.valor ELSE 0 END), 0) AS total_receitas,
      COALESCE(SUM(CASE WHEN t.tipo = 'despesa' THEN t.valor ELSE 0 END), 0) AS total_despesas
    FROM contas c
    LEFT JOIN transacoes t ON t.conta_id = c.id
    WHERE c.id = ?
    GROUP BY c.id
  `).get(id);

  if (!resultado) return undefined;

  return resultado.saldo_inicial + resultado.total_receitas - resultado.total_despesas;
}

export default {
  inserir,
  buscarPorId,
  buscarPorIdEUsuario,
  listarPorUsuario,
  atualizarNome,
  desativar,
  calcularSaldo,
};
