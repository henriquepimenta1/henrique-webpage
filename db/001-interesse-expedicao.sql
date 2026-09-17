-- Lista de interesse das expedições.
--
-- Uma linha por inscrição, não por pessoa: a mesma pessoa pode se inscrever
-- em Lençóis e Rondônia, e isso são dois interesses distintos. Por isso a
-- unicidade é (email, expedicao) e não só email.

CREATE TABLE IF NOT EXISTS interesse_expedicao (
  id          BIGSERIAL PRIMARY KEY,
  nome        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  telefone    TEXT        NOT NULL,
  expedicao   TEXT        NOT NULL,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reinscrição não deve gerar duplicata nem erro na cara do visitante: a rota
-- usa ON CONFLICT para atualizar os dados e manter uma linha só.
CREATE UNIQUE INDEX IF NOT EXISTS interesse_expedicao_email_expedicao
  ON interesse_expedicao (lower(email), expedicao);

-- O /admin lista do mais recente para o mais antigo.
CREATE INDEX IF NOT EXISTS interesse_expedicao_criado_em
  ON interesse_expedicao (criado_em DESC);
