-- =============================================
-- QM ORÇAMENTOS — SCHEMA COMPLETO
-- Supabase / PostgreSQL
-- =============================================

-- =============================================
-- EXTENSÕES
-- =============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. CATEGORIAS DE MATERIAIS
-- =============================================
CREATE TABLE IF NOT EXISTS material_categories (
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE
);

-- =============================================
-- 2. CATÁLOGO DE MATERIAIS
-- =============================================
CREATE TABLE IF NOT EXISTS materials (
  id            SERIAL PRIMARY KEY,
  category_id   INT NOT NULL REFERENCES material_categories(id),
  name          TEXT NOT NULL,
  unit          TEXT NOT NULL DEFAULT 'un',
  unit_price    NUMERIC(12,4) NOT NULL,
  applies_to    TEXT NOT NULL DEFAULT 'ambos'
                  CHECK (applies_to IN ('policarbonato','aluminio','ambos')),
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (category_id, name)
);

-- =============================================
-- 3. DISJUNTORES GERAIS (etapa 1 do wizard)
-- =============================================
CREATE TABLE IF NOT EXISTS main_breakers (
  id        SERIAL PRIMARY KEY,
  amperage  INT NOT NULL UNIQUE,
  label     TEXT NOT NULL,
  active    BOOLEAN NOT NULL DEFAULT TRUE
);

-- =============================================
-- 4. DISJUNTORES DE UNIDADE (etapa 2 do wizard)
-- =============================================
CREATE TABLE IF NOT EXISTS unit_breakers (
  id        SERIAL PRIMARY KEY,
  phase     TEXT NOT NULL CHECK (phase IN ('mono','bi','tri')),
  amperage  INT NOT NULL,
  label     TEXT NOT NULL,
  active    BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (phase, amperage)
);

-- =============================================
-- 5. COMPOSIÇÃO POR DJ GERAL
--    Quantidade de cada material por disjuntor geral
--    (itens fixos que dependem só do DJ geral)
-- =============================================
CREATE TABLE IF NOT EXISTS composition_by_main_breaker (
  id              SERIAL PRIMARY KEY,
  main_breaker_id INT NOT NULL REFERENCES main_breakers(id),
  material_id     INT NOT NULL REFERENCES materials(id),
  quantity        NUMERIC(12,4) NOT NULL DEFAULT 0,
  UNIQUE (main_breaker_id, material_id)
);

-- =============================================
-- 6. COMPOSIÇÃO POR DJ DE UNIDADE
--    Quantidade de cada material POR UNIDADE de medidor
--    (multiplicado pela qtd de unidades daquele tipo)
-- =============================================
CREATE TABLE IF NOT EXISTS composition_by_unit_breaker (
  id               SERIAL PRIMARY KEY,
  unit_breaker_id  INT NOT NULL REFERENCES unit_breakers(id),
  material_id      INT NOT NULL REFERENCES materials(id),
  quantity_per_unit NUMERIC(12,4) NOT NULL DEFAULT 0,
  UNIQUE (unit_breaker_id, material_id)
);

-- =============================================
-- 7. COMPOSIÇÃO DO DPS
--    Quantidade de cada material por classe de DPS
-- =============================================
CREATE TABLE IF NOT EXISTS composition_by_dps (
  id          SERIAL PRIMARY KEY,
  dps_class   TEXT NOT NULL CHECK (dps_class IN ('classe_i_ii','classe_ii')),
  material_id INT NOT NULL REFERENCES materials(id),
  quantity    NUMERIC(12,4) NOT NULL DEFAULT 0,
  UNIQUE (dps_class, material_id)
);

-- =============================================
-- 8. ORÇAMENTOS
-- =============================================
CREATE TABLE IF NOT EXISTS budgets (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Cliente
  client_name             TEXT,
  client_document         TEXT,
  client_phone            TEXT,
  client_email            TEXT,
  -- Configuração
  box_type                TEXT NOT NULL CHECK (box_type IN ('policarbonato','aluminio')),
  main_breaker_id         INT  NOT NULL REFERENCES main_breakers(id),
  dps_class               TEXT CHECK (dps_class IN ('classe_i_ii','classe_ii')),
  -- Totais calculados
  subtotal_materials      NUMERIC(12,2),
  subtotal_labor          NUMERIC(12,2),
  cost_total              NUMERIC(12,2),
  margin_percent          NUMERIC(5,4)  DEFAULT 0.23076923,
  markup_no_invoice       NUMERIC(5,4)  DEFAULT 1.3,
  markup_with_invoice     NUMERIC(5,4)  DEFAULT 1.55,
  tax_rate                NUMERIC(5,4),
  sale_price_no_invoice   NUMERIC(12,2),
  sale_price_with_invoice NUMERIC(12,2),
  discount                NUMERIC(12,2) DEFAULT 0,
  surcharge               NUMERIC(12,2) DEFAULT 0,
  notes                   TEXT,
  status                  TEXT NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft','sent','approved','rejected')),
  created_by              UUID REFERENCES auth.users(id),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- 9. UNIDADES DO ORÇAMENTO
--    Quais disjuntores de unidade e quantas unidades de cada
-- =============================================
CREATE TABLE IF NOT EXISTS budget_units (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id        UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  unit_breaker_id  INT  NOT NULL REFERENCES unit_breakers(id),
  quantity         INT  NOT NULL DEFAULT 1 CHECK (quantity > 0),
  UNIQUE (budget_id, unit_breaker_id)
);

-- =============================================
-- 10. ITENS CALCULADOS DO ORÇAMENTO (snapshot)
--     Gerados automaticamente pela função calculate_budget()
-- =============================================
CREATE TABLE IF NOT EXISTS budget_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id    UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  material_id  INT  NOT NULL REFERENCES materials(id),
  quantity     NUMERIC(12,4) NOT NULL,
  unit_price   NUMERIC(12,4) NOT NULL,
  total_price  NUMERIC(12,2) NOT NULL,
  origin       TEXT NOT NULL CHECK (origin IN ('main_breaker','unit_breaker','dps','caixa'))
);

-- =============================================
-- ÍNDICES
-- =============================================
CREATE INDEX idx_comp_main    ON composition_by_main_breaker(main_breaker_id);
CREATE INDEX idx_comp_unit    ON composition_by_unit_breaker(unit_breaker_id);
CREATE INDEX idx_comp_dps     ON composition_by_dps(dps_class);
CREATE INDEX idx_budget_units ON budget_units(budget_id);
CREATE INDEX idx_budget_items ON budget_items(budget_id);
CREATE INDEX idx_budgets_user ON budgets(created_by);

-- =============================================
-- TRIGGER: updated_at automático
-- =============================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
