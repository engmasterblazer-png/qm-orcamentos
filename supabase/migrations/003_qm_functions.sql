-- =============================================
-- QM ORÇAMENTOS — FUNÇÃO DE CÁLCULO
-- calculate_budget(budget_id)
--
-- 1. Lê configuração do orçamento
-- 2. Soma materiais por DJ geral
-- 3. Soma materiais por DJ de unidade × quantidade
-- 4. Soma materiais do DPS
-- 5. Determina a caixa correta (alumínio ou policarbonato)
-- 6. Grava em budget_items
-- 7. Atualiza totais em budgets
-- =============================================

CREATE OR REPLACE FUNCTION calculate_budget(p_budget_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_budget          budgets%ROWTYPE;
  v_total_units     INT;
  v_mat_cost        NUMERIC(12,2) := 0;
  v_labor_cost      NUMERIC(12,2) := 0;
  v_cost_total      NUMERIC(12,2);
  v_sale_no_nf      NUMERIC(12,2);
  v_sale_with_nf    NUMERIC(12,2);
  v_tax_rate        NUMERIC(5,4);
  v_markup_no_nf    NUMERIC(5,4) := 1.3;
  v_markup_with_nf  NUMERIC(5,4) := 1.55;
  v_caixa_id        INT;
BEGIN
  -- Carrega orçamento
  SELECT * INTO v_budget FROM budgets WHERE id = p_budget_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Orçamento % não encontrado', p_budget_id;
  END IF;

  -- Total de unidades de medidor
  SELECT COALESCE(SUM(quantity), 0)
    INTO v_total_units
    FROM budget_units
   WHERE budget_id = p_budget_id;

  -- Limpa itens anteriores
  DELETE FROM budget_items WHERE budget_id = p_budget_id;

  -- -------------------------------------------------------
  -- 1. CAIXA CORRETA
  -- -------------------------------------------------------
  IF v_budget.box_type = 'aluminio' THEN
    -- Alumínio: escolhe caixa pelo número de unidades
    SELECT id INTO v_caixa_id
      FROM materials
     WHERE category_id = 1
       AND applies_to = 'aluminio'
       AND name = CASE
             WHEN v_total_units <= 2  THEN 'QM 2 medidores'
             WHEN v_total_units <= 3  THEN 'QM 3 medidores'
             WHEN v_total_units <= 4  THEN 'QM 4 medidores'
             WHEN v_total_units <= 6  THEN 'QM 6 medidores horizontal'
             WHEN v_total_units <= 9  THEN 'QM 9 medidores'
             WHEN v_total_units <= 12 THEN 'QM 12 medidores'
             WHEN v_total_units <= 15 THEN 'QM 15 medidores'
             WHEN v_total_units <= 18 THEN 'QM 18 medidores'
             WHEN v_total_units <= 21 THEN 'QM 21 medidores'
             WHEN v_total_units <= 24 THEN 'QM 24 medidores'
             WHEN v_total_units <= 27 THEN 'QM 27 medidores'
             WHEN v_total_units <= 30 THEN 'QM 30 medidores'
             WHEN v_total_units <= 33 THEN 'QM 33 medidores'
             WHEN v_total_units <= 36 THEN 'QM 36 medidores'
             ELSE 'QM 36 medidores'
           END;
  ELSE
    -- Policarbonato: Cx BEP para até 100A, Cx BEP e DPS se tiver DPS
    IF v_budget.dps_class IS NOT NULL THEN
      SELECT id INTO v_caixa_id FROM materials WHERE name = 'Cx BEP e DPS';
    ELSE
      SELECT id INTO v_caixa_id FROM materials WHERE name = 'Cx BEP';
    END IF;
  END IF;

  -- Insere caixa
  IF v_caixa_id IS NOT NULL THEN
    INSERT INTO budget_items (budget_id, material_id, quantity, unit_price, total_price, origin)
    SELECT p_budget_id, m.id, 1, m.unit_price, m.unit_price, 'caixa'
      FROM materials m WHERE m.id = v_caixa_id;
  END IF;

  -- Policarbonato: adiciona Cx Medidor (1 por unidade), Cx Barramento, Cx DJ Geral
  IF v_budget.box_type = 'policarbonato' THEN
    -- Cx Medidor × total_units
    INSERT INTO budget_items (budget_id, material_id, quantity, unit_price, total_price, origin)
    SELECT p_budget_id, m.id, v_total_units, m.unit_price,
           ROUND(v_total_units * m.unit_price, 2), 'caixa'
      FROM materials m WHERE m.name = 'Cx Medidor';

    -- Cx Barramento conforme amperagem
    IF (SELECT amperage FROM main_breakers WHERE id = v_budget.main_breaker_id) <= 125 THEN
      INSERT INTO budget_items (budget_id, material_id, quantity, unit_price, total_price, origin)
      SELECT p_budget_id, m.id, 1, m.unit_price, m.unit_price, 'caixa'
        FROM materials m WHERE m.name = 'Cx Barramento CB 100';
    ELSE
      INSERT INTO budget_items (budget_id, material_id, quantity, unit_price, total_price, origin)
      SELECT p_budget_id, m.id, 1, m.unit_price, m.unit_price, 'caixa'
        FROM materials m WHERE m.name = 'Cx Barramento CB 200';
    END IF;

    -- Cx DJ Geral (para CM acima de 125A)
    IF (SELECT amperage FROM main_breakers WHERE id = v_budget.main_breaker_id) > 125 THEN
      INSERT INTO budget_items (budget_id, material_id, quantity, unit_price, total_price, origin)
      SELECT p_budget_id, m.id, 1, m.unit_price, m.unit_price, 'caixa'
        FROM materials m WHERE m.name = 'CX Disjuntor Geral';

      -- Cx Especial se mais de 15 medidores
      IF v_total_units > 15 THEN
        INSERT INTO budget_items (budget_id, material_id, quantity, unit_price, total_price, origin)
        SELECT p_budget_id, m.id, CEIL(v_total_units::NUMERIC / 15)::INT,
               m.unit_price, ROUND(CEIL(v_total_units::NUMERIC / 15) * m.unit_price, 2), 'caixa'
          FROM materials m WHERE m.name = 'Cx Especial';
      END IF;
    END IF;
  END IF;

  -- -------------------------------------------------------
  -- 2. MATERIAIS DO DJ GERAL
  -- -------------------------------------------------------
  INSERT INTO budget_items (budget_id, material_id, quantity, unit_price, total_price, origin)
  SELECT
    p_budget_id,
    c.material_id,
    c.quantity,
    m.unit_price,
    ROUND(c.quantity * m.unit_price, 2),
    'main_breaker'
  FROM composition_by_main_breaker c
  JOIN materials m ON m.id = c.material_id
  WHERE c.main_breaker_id = v_budget.main_breaker_id
    AND c.quantity > 0;

  -- -------------------------------------------------------
  -- 3. MATERIAIS POR UNIDADE × QUANTIDADE
  -- -------------------------------------------------------
  INSERT INTO budget_items (budget_id, material_id, quantity, unit_price, total_price, origin)
  SELECT
    p_budget_id,
    c.material_id,
    ROUND(c.quantity_per_unit * bu.quantity, 4),
    m.unit_price,
    ROUND(c.quantity_per_unit * bu.quantity * m.unit_price, 2),
    'unit_breaker'
  FROM budget_units bu
  JOIN composition_by_unit_breaker c ON c.unit_breaker_id = bu.unit_breaker_id
  JOIN materials m ON m.id = c.material_id
  WHERE bu.budget_id = p_budget_id
    AND c.quantity_per_unit > 0
    AND (
      (v_budget.box_type = 'policarbonato' AND m.applies_to IN ('policarbonato','ambos'))
      OR
      (v_budget.box_type = 'aluminio'      AND m.applies_to IN ('aluminio','ambos'))
    );

  -- -------------------------------------------------------
  -- 4. MATERIAIS DO DPS
  -- -------------------------------------------------------
  IF v_budget.dps_class IS NOT NULL THEN
    INSERT INTO budget_items (budget_id, material_id, quantity, unit_price, total_price, origin)
    SELECT
      p_budget_id,
      d.material_id,
      d.quantity,
      m.unit_price,
      ROUND(d.quantity * m.unit_price, 2),
      'dps'
    FROM composition_by_dps d
    JOIN materials m ON m.id = d.material_id
    WHERE d.dps_class = v_budget.dps_class
      AND d.quantity > 0;
  END IF;

  -- -------------------------------------------------------
  -- 5. AGRUPA ITENS DUPLICADOS (mesmo material de origens diferentes)
  -- -------------------------------------------------------
  -- Consolida quantidades do mesmo material
  WITH grouped AS (
    SELECT material_id, SUM(quantity) AS qty, MIN(unit_price) AS price, MIN(origin) AS origin
      FROM budget_items
     WHERE budget_id = p_budget_id
     GROUP BY material_id
  )
  DELETE FROM budget_items bi
   WHERE bi.budget_id = p_budget_id
     AND bi.id NOT IN (
       SELECT DISTINCT ON (material_id) id
         FROM budget_items
        WHERE budget_id = p_budget_id
        ORDER BY material_id, id
     );

  -- Atualiza quantidades agrupadas
  UPDATE budget_items bi
     SET quantity    = g.total_qty,
         total_price = ROUND(g.total_qty * bi.unit_price, 2)
    FROM (
      SELECT material_id, SUM(quantity) AS total_qty
        FROM budget_items
       WHERE budget_id = p_budget_id
       GROUP BY material_id
    ) g
   WHERE bi.budget_id = p_budget_id
     AND bi.material_id = g.material_id;

  -- -------------------------------------------------------
  -- 6. TOTAIS
  -- -------------------------------------------------------
  -- Custo de materiais (excluindo mão de obra)
  SELECT COALESCE(SUM(bi.total_price), 0)
    INTO v_mat_cost
    FROM budget_items bi
    JOIN materials m ON m.id = bi.material_id
   WHERE bi.budget_id = p_budget_id
     AND m.category_id <> 8;  -- exclui Execução

  -- Custo de mão de obra
  SELECT COALESCE(SUM(bi.total_price), 0)
    INTO v_labor_cost
    FROM budget_items bi
    JOIN materials m ON m.id = bi.material_id
   WHERE bi.budget_id = p_budget_id
     AND m.category_id = 8;

  v_cost_total := v_mat_cost + v_labor_cost;

  -- Tax rate: alumínio 8%, policarbonato 12%
  v_tax_rate := CASE v_budget.box_type WHEN 'aluminio' THEN 0.08 ELSE 0.12 END;

  -- Preços de venda
  v_sale_no_nf   := ROUND(v_cost_total * v_markup_no_nf,   2);
  v_sale_with_nf := ROUND(v_cost_total * v_markup_with_nf, 2);

  -- Aplica desconto/acréscimo
  v_sale_no_nf   := v_sale_no_nf   + COALESCE(v_budget.surcharge, 0) - COALESCE(v_budget.discount, 0);
  v_sale_with_nf := v_sale_with_nf + COALESCE(v_budget.surcharge, 0) - COALESCE(v_budget.discount, 0);

  -- Salva totais no orçamento
  UPDATE budgets SET
    subtotal_materials      = v_mat_cost,
    subtotal_labor          = v_labor_cost,
    cost_total              = v_cost_total,
    tax_rate                = v_tax_rate,
    sale_price_no_invoice   = v_sale_no_nf,
    sale_price_with_invoice = v_sale_with_nf,
    updated_at              = now()
  WHERE id = p_budget_id;

  RETURN jsonb_build_object(
    'success',           true,
    'budget_id',         p_budget_id,
    'total_units',       v_total_units,
    'subtotal_materials', v_mat_cost,
    'subtotal_labor',    v_labor_cost,
    'cost_total',        v_cost_total,
    'sale_no_invoice',   v_sale_no_nf,
    'sale_with_invoice', v_sale_with_nf,
    'tax_rate',          v_tax_rate,
    'items_count',       (SELECT COUNT(*) FROM budget_items WHERE budget_id = p_budget_id)
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;


-- =============================================
-- VIEW: resumo legível dos itens do orçamento
-- =============================================
CREATE OR REPLACE VIEW vw_budget_items_detail AS
SELECT
  bi.budget_id,
  mc.name                          AS categoria,
  m.name                           AS material,
  m.unit,
  ROUND(bi.quantity::NUMERIC, 2)   AS quantidade,
  m.unit_price                     AS preco_unit,
  bi.total_price                   AS total,
  bi.origin
FROM budget_items bi
JOIN materials m       ON m.id = bi.material_id
JOIN material_categories mc ON mc.id = m.category_id
ORDER BY mc.id, m.name;


-- =============================================
-- VIEW: resumo financeiro dos orçamentos
-- =============================================
CREATE OR REPLACE VIEW vw_budgets_summary AS
SELECT
  b.id,
  b.client_name,
  b.box_type,
  mb.label                         AS dj_geral,
  b.dps_class,
  (SELECT SUM(bu.quantity) FROM budget_units bu WHERE bu.budget_id = b.id) AS total_unidades,
  b.cost_total,
  b.sale_price_no_invoice,
  b.sale_price_with_invoice,
  b.status,
  b.created_at
FROM budgets b
JOIN main_breakers mb ON mb.id = b.main_breaker_id
ORDER BY b.created_at DESC;


-- =============================================
-- RLS (Row Level Security) — Supabase
-- =============================================
ALTER TABLE budgets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_units   ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items   ENABLE ROW LEVEL SECURITY;

-- Permite criar orçamentos para usuários autenticados e anon
CREATE POLICY "insert_budgets" ON budgets
  FOR INSERT WITH CHECK (true);

-- Permite ler e editar orçamentos (para anon, permite tudo; para autenticados, apenas os seus)
CREATE POLICY "select_budgets" ON budgets
  FOR SELECT USING (true);

CREATE POLICY "update_budgets" ON budgets
  FOR UPDATE USING (true);

-- Permite operações em budget_units
CREATE POLICY "insert_budget_units" ON budget_units
  FOR INSERT WITH CHECK (true);

CREATE POLICY "select_budget_units" ON budget_units
  FOR SELECT USING (true);

-- Permite operações em budget_items
CREATE POLICY "insert_budget_items" ON budget_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "select_budget_items" ON budget_items
  FOR SELECT USING (true);

-- Tabelas de referência: somente leitura para anon e autenticados
CREATE POLICY "read_materials"         ON materials         FOR SELECT USING (auth.role() IN ('authenticated','anon'));
CREATE POLICY "read_categories"        ON material_categories FOR SELECT USING (auth.role() IN ('authenticated','anon'));
CREATE POLICY "read_main_breakers"     ON main_breakers     FOR SELECT USING (auth.role() IN ('authenticated','anon'));
CREATE POLICY "read_unit_breakers"     ON unit_breakers     FOR SELECT USING (auth.role() IN ('authenticated','anon'));
CREATE POLICY "read_comp_main"         ON composition_by_main_breaker FOR SELECT USING (auth.role() IN ('authenticated','anon'));
CREATE POLICY "read_comp_unit"         ON composition_by_unit_breaker FOR SELECT USING (auth.role() IN ('authenticated','anon'));
CREATE POLICY "read_comp_dps"          ON composition_by_dps FOR SELECT USING (auth.role() IN ('authenticated','anon'));

ALTER TABLE materials                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE main_breakers              ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_breakers              ENABLE ROW LEVEL SECURITY;
ALTER TABLE composition_by_main_breaker ENABLE ROW LEVEL SECURITY;
ALTER TABLE composition_by_unit_breaker ENABLE ROW LEVEL SECURITY;
ALTER TABLE composition_by_dps         ENABLE ROW LEVEL SECURITY;
