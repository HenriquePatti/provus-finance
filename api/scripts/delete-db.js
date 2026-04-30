/**
 * Remove o banco de dados de desenvolvimento de forma cross-platform.
 * Substitui o uso de `rm -f database/provus.db` que não funciona no Windows.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../database/provus.db');

try {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Banco de dados removido.');
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
  console.log('ℹ️  Banco de dados não encontrado, continuando...');
}
