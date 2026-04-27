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

/**
 * Atualiza nome e e-mail do usuário (perfil).
 *
 * @param {number} id
 * @param {Object} dados
 * @param {string} dados.nome
 * @param {string} dados.email
 */
export function atualizarDados(id, { nome, email }) {
  const stmt = db.prepare(`
    UPDATE usuarios
    SET nome = ?, email = ?, atualizado_em = datetime('now')
    WHERE id = ?
  `);

  stmt.run(nome, email, id);
  return buscarPorId(id);
}

/**
 * Atualiza apenas o hash da senha (US-004).
 *
 * @param {number} id
 * @param {string} senhaHash
 */
export function atualizarSenhaHash(id, senhaHash) {
  const stmt = db.prepare(`
    UPDATE usuarios
    SET senha_hash = ?, atualizado_em = datetime('now')
    WHERE id = ?
  `);

  stmt.run(senhaHash, id);
  return buscarPorId(id);
}

export default {
  inserir,
  buscarPorId,
  buscarPorEmail,
  emailExiste,
  atualizarDados,
  atualizarSenhaHash,
};