-- Migration: 004_create_transacoes
-- Cria a tabela de transações financeiras (EP-005)

CREATE TABLE IF NOT EXISTS transacoes (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo            TEXT    NOT NULL,
  valor           INTEGER NOT NULL,
  descricao       TEXT    NOT NULL,
  data_transacao  TEXT    NOT NULL,
  conta_id        INTEGER NOT NULL,
  categoria_id    INTEGER NOT NULL,
  criado_em       TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em   TEXT    NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
  CHECK (tipo IN ('receita', 'despesa')),
  CHECK (valor > 0)
);

-- Índices para consultas frequentes (RT-075)
CREATE INDEX IF NOT EXISTS idx_transacoes_conta_id ON transacoes(conta_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_categoria_id ON transacoes(categoria_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data_transacao);
