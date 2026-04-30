import db from '../../src/config/database.js';

/**
 * Limpa todas as tabelas de dados do banco de teste.
 * Preserva a tabela _migrations (schema).
 *
 * PROTEÇÃO: só executa se NODE_ENV === 'test'.
 * Isso evita qualquer risco acidental de apagar dados de desenvolvimento/produção.
 */
export function limparBanco() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error(
      'limparBanco() só pode ser chamado com NODE_ENV=test. ' +
      'Operação bloqueada para proteger dados de desenvolvimento.'
    );
  }

  // Ordem importa quando houver FKs (filho antes, pai depois)
  db.exec('DELETE FROM categorias WHERE padrao = 0;');
  db.exec('DELETE FROM contas;');
  db.exec('DELETE FROM usuarios;');

  // Reseta auto-increment para IDs começarem do 1
  db.exec("DELETE FROM sqlite_sequence WHERE name='categorias';");
  db.exec("DELETE FROM sqlite_sequence WHERE name='contas';");
  db.exec("DELETE FROM sqlite_sequence WHERE name='usuarios';");
}

/**
 * Fecha a conexão com o banco.
 * Normalmente chamado no after() final dos testes.
 */
export function fecharConexao() {
  db.close();
}

export default {
  limparBanco,
  fecharConexao,
};