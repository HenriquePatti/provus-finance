import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do arquivo do banco (resolvido a partir do .env)
const dbPath = process.env.DB_PATH
  ? path.resolve(__dirname, '../../', process.env.DB_PATH)
  : path.resolve(__dirname, '../../database/provus.db');

/**
 * Cria e retorna uma instância de conexão com o SQLite.
 * Ativa foreign keys por padrão.
 */
const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null,
});

// Ativa foreign keys (SQLite não ativa por padrão)
db.pragma('foreign_keys = ON');

// Modo WAL para melhor performance e concorrência
db.pragma('journal_mode = WAL');

export default db;