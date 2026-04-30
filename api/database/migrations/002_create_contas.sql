-- Migration: 002_create_contas
-- Cria a tabela de contas financeiras (EP-003)

CREATE TABLE IF NOT EXISTS contas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id   INTEGER NOT NULL,
  nome         TEXT    NOT NULL,
  tipo         TEXT    NOT NULL,
  saldo_inicial REAL   NOT NULL DEFAULT 0,
  ativo        INTEGER NOT NULL DEFAULT 1,
  criado_em    TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT   NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CHECK (tipo IN ('corrente', 'poupanca', 'carteira_digital', 'dinheiro', 'investimento')),
  CHECK (saldo_inicial >= 0),
  CHECK (ativo IN (0, 1))
);

-- Índice para busca rápida das contas de um usuário
CREATE INDEX IF NOT EXISTS idx_contas_usuario_id ON contas(usuario_id);
