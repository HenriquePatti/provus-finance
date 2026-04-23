import db from '../src/config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.resolve(__dirname, 'migrations');

/**
 * Cria a tabela de controle _migrations se não existir
 */
function criarTabelaControle() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      arquivo     TEXT    NOT NULL UNIQUE,
      executada_em TEXT   NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

/**
 * Retorna a lista de migrations já executadas
 */
function obterMigrationsExecutadas() {
  const rows = db.prepare('SELECT arquivo FROM _migrations ORDER BY id').all();
  return rows.map((row) => row.arquivo);
}

/**
 * Retorna a lista de arquivos de migration disponíveis, em ordem
 */
function obterMigrationsDisponiveis() {
  if (!fs.existsSync(migrationsDir)) {
    return [];
  }

  return fs
    .readdirSync(migrationsDir)
    .filter((arquivo) => arquivo.endsWith('.sql'))
    .sort();
}

/**
 * Executa uma migration específica dentro de uma transação
 */
function executarMigration(arquivo) {
  const caminho = path.join(migrationsDir, arquivo);
  const sql = fs.readFileSync(caminho, 'utf-8');

  const transacao = db.transaction(() => {
    db.exec(sql);
    db.prepare('INSERT INTO _migrations (arquivo) VALUES (?)').run(arquivo);
  });

  transacao();
}

/**
 * Executa todas as migrations pendentes
 */
function executarMigrations() {
  console.log('');
  console.log('🔄 Iniciando execução de migrations...');
  console.log('');

  criarTabelaControle();

  const executadas = obterMigrationsExecutadas();
  const disponiveis = obterMigrationsDisponiveis();
  const pendentes = disponiveis.filter((m) => !executadas.includes(m));

  if (pendentes.length === 0) {
    console.log('✅ Banco já está atualizado. Nenhuma migration pendente.');
    console.log('');
    return;
  }

  console.log(`📦 ${pendentes.length} migration(s) pendente(s) encontrada(s):`);
  pendentes.forEach((m) => console.log(`   • ${m}`));
  console.log('');

  pendentes.forEach((arquivo) => {
    try {
      console.log(`⏳ Executando: ${arquivo}`);
      executarMigration(arquivo);
      console.log(`✅ Sucesso: ${arquivo}`);
    } catch (erro) {
      console.error(`❌ Erro ao executar ${arquivo}:`);
      console.error(erro.message);
      process.exit(1);
    }
  });

  console.log('');
  console.log(`🎉 ${pendentes.length} migration(s) aplicada(s) com sucesso!`);
  console.log('');
}

// Execução
executarMigrations();