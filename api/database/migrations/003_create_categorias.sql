-- Migration: 003_create_categorias
-- Cria a tabela de categorias (EP-004)

CREATE TABLE IF NOT EXISTS categorias (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nome          TEXT    NOT NULL,
  tipo          TEXT    NOT NULL,
  icone         TEXT,
  padrao        INTEGER NOT NULL DEFAULT 0,
  usuario_id    INTEGER,
  criado_em     TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT    NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CHECK (tipo IN ('receita', 'despesa', 'ambos')),
  CHECK (padrao IN (0, 1))
);

-- Índice para busca rápida das categorias de um usuário
CREATE INDEX IF NOT EXISTS idx_categorias_usuario_id ON categorias(usuario_id);

-- Seed: categorias padrão do sistema (RK-006, RK-007)

-- Despesas
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Alimentação', 'despesa', '🍔', 1, NULL);
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Transporte', 'despesa', '🚗', 1, NULL);
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Moradia', 'despesa', '🏠', 1, NULL);
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Saúde', 'despesa', '🏥', 1, NULL);
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Lazer', 'despesa', '🎮', 1, NULL);
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Educação', 'despesa', '📚', 1, NULL);
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Compras', 'despesa', '🛍️', 1, NULL);
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Serviços', 'despesa', '🔧', 1, NULL);
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Outros', 'despesa', '📦', 1, NULL);

-- Receitas
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Salário', 'receita', '💼', 1, NULL);
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Freelance', 'receita', '💻', 1, NULL);
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Investimentos', 'receita', '📈', 1, NULL);
INSERT INTO categorias (nome, tipo, icone, padrao, usuario_id) VALUES ('Outros', 'receita', '💰', 1, NULL);
