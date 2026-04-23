import db from '../config/database.js';

/**
 * Insere um novo usuário no banco.
 *
 * @param {Object} dados - Dados do usuário
 * @param {string} dados.nome
 * @param {string} dados.email
 * @param {string} dados.senhaHash
 * @returns {Object} Usuário criado com id
 */
export function inserir({ nome, email, senhaHash }) {
  const stmt = db.prepare(`
    INSERT INTO usuarios (nome, email, senha_hash)
    VALUES (?, ?, ?)
  `);

  const resultado = stmt.run(nome, email, senhaHash);

  return buscarPorId(resultado.lastInsertRowid);
}

/**
 * Busca um usuário pelo ID.
 *
 * @param {number} id
 * @returns {Object|undefined} Usuário ou undefined
 */
export function buscarPorId(id) {
  const stmt = db.prepare(`
    SELECT id, nome, email, senha_hash, criado_em, atualizado_em
    FROM usuarios
    WHERE id = ?
  `);

  return stmt.get(id);
}

/**
 * Busca um usuário pelo e-mail.
 *
 * @param {string} email
 * @returns {Object|undefined} Usuário ou undefined
 */
export function buscarPorEmail(email) {
  const stmt = db.prepare(`
    SELECT id, nome, email, senha_hash, criado_em, atualizado_em
    FROM usuarios
    WHERE email = ?
  `);

  return stmt.get(email);
}

/**
 * Verifica se um e-mail já está cadastrado.
 *
 * @param {string} email
 * @returns {boolean}
 */
export function emailExiste(email) {
  const stmt = db.prepare(`
    SELECT COUNT(*) as total
    FROM usuarios
    WHERE email = ?
  `);

  const { total } = stmt.get(email);
  return total > 0;
}

export default {
  inserir,
  buscarPorId,
  buscarPorEmail,
  emailExiste,
};