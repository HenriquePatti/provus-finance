-- Migration: 001_create_usuarios
-- Cria a tabela de usuários conforme documentado em modelo-dados.md

CREATE TABLE IF NOT EXISTS usuarios (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  nome            TEXT    NOT NULL,
  email           TEXT    NOT NULL UNIQUE,
  senha_hash      TEXT    NOT NULL,
  criado_em       TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Índice para busca rápida por e-mail (login)
CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);