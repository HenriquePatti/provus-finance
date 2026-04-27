import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Escolhe o banco conforme o ambiente:
// - NODE_ENV=test  → banco separado (provus-test.db)
// - demais ambientes → banco definido em DB_PATH (ou provus.db)
const isTest = process.env.NODE_ENV === 'test';

const dbPath = isTest
  ? path.resolve(__dirname, '../../database/provus-test.db')
  : (process.env.DB_PATH
      ? path.resolve(__dirname, '../../', process.env.DB_PATH)
      : path.resolve(__dirname, '../../database/provus.db'));

const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null,
});

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

export default db;