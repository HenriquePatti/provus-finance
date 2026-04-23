import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

/**
 * Gera um hash bcrypt da senha informada.
 *
 * @param {string} senha - A senha em texto puro
 * @returns {Promise<string>} O hash bcrypt
 */
export async function gerarHash(senha) {
  return bcrypt.hash(senha, ROUNDS);
}

/**
 * Compara uma senha em texto puro com um hash bcrypt.
 *
 * @param {string} senha - A senha em texto puro
 * @param {string} hash - O hash armazenado
 * @returns {Promise<boolean>} true se a senha confere
 */
export async function compararHash(senha, hash) {
  return bcrypt.compare(senha, hash);
}