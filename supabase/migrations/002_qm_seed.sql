-- =============================================
-- QM ORÇAMENTOS — SEED COMPLETO
-- Dados extraídos diretamente da planilha Composição_QM.xlsx
-- =============================================

-- =============================================
-- CATEGORIAS
-- =============================================
INSERT INTO material_categories (id, name) VALUES
  (1,  'Caixas'),
  (2,  'Disjuntores'),
  (3,  'Cabos'),
  (4,  'Termocontrátil'),
  (5,  'Olhal'),
  (6,  'Conjunto Box'),
  (7,  'Outros'),
  (8,  'Execução'),
  (9,  'DPS'),
  (10, 'Itens Extras')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DISJUNTORES GERAIS
-- =============================================
INSERT INTO main_breakers (id, amperage, label) VALUES
  (1,  50,  '50 A'),
  (2,  63,  '63 A'),
  (3,  70,  '70 A'),
  (4,  80,  '80 A'),
  (5,  90,  '90 A'),
  (6,  100, '100 A'),
  (7,  125, '125 A'),
  (8,  150, '150 A'),
  (9,  175, '175 A'),
  (10, 200, '200 A'),
  (11, 225, '225 A'),
  (12, 250, '250 A'),
  (13, 300, '300 A'),
  (14, 350, '350 A'),
  (15, 400, '400 A'),
  (16, 450, '450 A')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DISJUNTORES DE UNIDADE
-- =============================================
INSERT INTO unit_breakers (id, phase, amperage, label) VALUES
  (1,  'mono', 40,  '40 A'),
  (2,  'mono', 50,  '50 A'),
  (3,  'mono', 63,  '63 A'),
  (4,  'bi',   50,  '50 A'),
  (5,  'bi',   63,  '63 A'),
  (6,  'tri',  40,  '40 A'),
  (7,  'tri',  50,  '50 A'),
  (8,  'tri',  63,  '63 A'),
  (9,  'tri',  70,  '70 A'),
  (10, 'tri',  80,  '80 A'),
  (11, 'tri',  90,  '90 A'),
  (12, 'tri',  100, '100 A'),
  (13, 'tri',  125, '125 A')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- MATERIAIS
-- Formato: (id, category_id, name, unit, unit_price, applies_to)
-- =============================================

-- Caixas Alumínio
INSERT INTO materials (id, category_id, name, unit, unit_price, applies_to) VALUES
  (1,  1, 'QM 2 medidores',          'un', 1017.0900, 'aluminio'),
  (2,  1, 'QM 3 medidores',          'un',  184.8200, 'aluminio'),
  (3,  1, 'QM 4 medidores',          'un', 1352.5700, 'aluminio'),
  (4,  1, 'QM 6 medidores horizontal','un', 1688.0700, 'aluminio'),
  (5,  1, 'QM 6 medidores vertical',  'un', 1688.0700, 'aluminio'),
  (6,  1, 'QM 9 medidores',           'un', 2621.0500, 'aluminio'),
  (7,  1, 'QM 12 medidores',          'un', 3208.1100, 'aluminio'),
  (8,  1, 'QM 15 medidores',          'un', 3705.6800, 'aluminio'),
  (9,  1, 'QM 18 medidores',          'un', 4204.5100, 'aluminio'),
  (10, 1, 'QM 21 medidores',          'un', 4924.7000, 'aluminio'),
  (11, 1, 'QM 24 medidores',          'un', 5421.3900, 'aluminio'),
  (12, 1, 'QM 27 medidores',          'un', 5918.1100, 'aluminio'),
  (13, 1, 'QM 30 medidores',          'un', 6414.8100, 'aluminio'),
  (14, 1, 'QM 33 medidores',          'un', 6911.5000, 'aluminio'),
  (15, 1, 'QM 36 medidores',          'un', 8834.0000, 'aluminio'),

-- Caixas Policarbonato
  (16, 1, 'Cx BEP',               'un',  183.7850, 'policarbonato'),
  (17, 1, 'Cx BEP e DPS',         'un',  183.7850, 'policarbonato'),
  (18, 1, 'Cx Barramento CB 100', 'un',  262.2550, 'policarbonato'),
  (19, 1, 'Cx Barramento CB 200', 'un',  277.7425, 'policarbonato'),
  (20, 1, 'Cx Medidor',           'un',   70.0000, 'policarbonato'),
  (21, 1, 'CX Disjuntor Geral',   'un',  143.5175, 'policarbonato'),
  (22, 1, 'Cx Especial',          'un',  750.0000, 'policarbonato'),
  (134, 1, 'Barramento 9,52 × 3,17 mm → 73 A',   'un',    0.0000, 'policarbonato'),
  (135, 1, 'Barramento 12,70 × 3,17 mm → 97 A',  'un',    0.0000, 'policarbonato'),
  (136, 1, 'Barramento 12,70 × 4,76 mm → 140 A', 'un',    0.0000, 'policarbonato'),
  (137, 1, 'Barramento 15,87 × 4,76 mm → 175 A', 'un',    0.0000, 'policarbonato'),
  (138, 1, 'Barramento 22,22 × 4,76 mm → 246 A', 'un',    0.0000, 'policarbonato'),
  (139, 1, 'Barramento 31,75 × 4,76 mm → 350 A', 'un',    0.0000, 'policarbonato'),
  (140, 1, 'Barramento 31,75 × 6,35 mm → 450 A', 'un',    0.0000, 'policarbonato'),
  (141, 1, 'Barramento 31,75 × 7,94 mm → 550 A', 'un',    0.0000, 'policarbonato'),

-- Disjuntores Monofásicos
  (23, 2, 'DJ Mono 40A',  'un',   6.1300, 'ambos'),
  (24, 2, 'DJ Mono 50A',  'un',   6.7500, 'ambos'),
  (25, 2, 'DJ Mono 63A',  'un',   7.4230, 'ambos'),

-- Disjuntores Bifásicos
  (26, 2, 'DJ Bi 40A',  'un',  21.6301, 'ambos'),
  (27, 2, 'DJ Bi 50A',  'un',  21.6301, 'ambos'),
  (28, 2, 'DJ Bi 63A',  'un',  21.6301, 'ambos'),

-- Disjuntores Trifásicos
  (29, 2, 'DJ Tri 50A', 'un',  43.3600, 'ambos'),
  (30, 2, 'DJ Tri 63A', 'un',  43.3600, 'ambos'),
  (31, 2, 'DJ Tri 70A', 'un',  91.2200, 'ambos'),

-- Disjuntores Gerais CM (usados como material na caixa)
  (32, 2, 'DJ CM 80A',  'un', 150.8147, 'ambos'),
  (33, 2, 'DJ CM 90A',  'un', 150.8147, 'ambos'),
  (34, 2, 'DJ CM 100A', 'un', 198.0900, 'ambos'),
  (35, 2, 'DJ CM 125A', 'un', 160.3100, 'ambos'),
  (36, 2, 'DJ CM 150A', 'un', 250.4500, 'ambos'),
  (37, 2, 'DJ CM 175A', 'un', 250.4500, 'ambos'),
  (38, 2, 'DJ CM 200A', 'un', 250.4500, 'ambos'),
  (39, 2, 'DJ CM 225A', 'un', 250.4500, 'ambos'),
  (40, 2, 'DJ CM 250A', 'un', 250.4500, 'ambos'),

-- Cabos 10mm
  (41, 3, 'Cabo 10mm VM', 'm', 9.3759, 'ambos'),
  (42, 3, 'Cabo 10mm VD', 'm', 9.3759, 'ambos'),
  (43, 3, 'Cabo 10mm AZ', 'm', 9.3759, 'ambos'),
  (44, 3, 'Cabo 10mm PT', 'm', 9.3759, 'ambos'),
  (45, 3, 'Cabo 10mm BR', 'm', 9.3759, 'ambos'),

-- Cabos 16mm
  (46, 3, 'Cabo 16mm VM', 'm', 14.4131, 'ambos'),
  (47, 3, 'Cabo 16mm VD', 'm', 14.4131, 'ambos'),
  (48, 3, 'Cabo 16mm AZ', 'm', 14.4131, 'ambos'),
  (49, 3, 'Cabo 16mm PT', 'm', 14.4131, 'ambos'),
  (50, 3, 'Cabo 16mm BR', 'm', 14.4131, 'ambos'),

-- Cabos 25mm
  (51, 3, 'Cabo 25mm VM', 'm', 20.6902, 'ambos'),
  (52, 3, 'Cabo 25mm VD', 'm', 20.6902, 'ambos'),
  (53, 3, 'Cabo 25mm PT', 'm', 20.6902, 'ambos'),
  (54, 3, 'Cabo 25mm BR', 'm', 20.6902, 'ambos'),

-- Cabos 35mm
  (55, 3, 'Cabo 35mm VM', 'm', 26.4878, 'ambos'),
  (56, 3, 'Cabo 35mm VD', 'm', 26.4878, 'ambos'),
  (57, 3, 'Cabo 35mm AZ', 'm', 26.4878, 'ambos'),
  (58, 3, 'Cabo 35mm PT', 'm', 26.4878, 'ambos'),
  (59, 3, 'Cabo 35mm BR', 'm', 26.4878, 'ambos'),

-- Cabos 50mm
  (60, 3, 'Cabo 50mm VM', 'm', 36.4634, 'ambos'),
  (61, 3, 'Cabo 50mm VD', 'm', 36.4634, 'ambos'),
  (62, 3, 'Cabo 50mm PT', 'm', 36.4634, 'ambos'),
  (63, 3, 'Cabo 50mm BR', 'm', 36.4634, 'ambos'),

-- Cabos 70mm
  (64, 3, 'Cabo 70mm VM', 'm', 51.9591, 'ambos'),
  (65, 3, 'Cabo 70mm VD', 'm', 51.9591, 'ambos'),
  (66, 3, 'Cabo 70mm PT', 'm', 51.9591, 'ambos'),
  (67, 3, 'Cabo 70mm BR', 'm', 51.9591, 'ambos'),

-- Cabos 95mm
  (68, 3, 'Cabo 95mm VM', 'm', 73.2710, 'ambos'),
  (69, 3, 'Cabo 95mm VD', 'm', 73.2710, 'ambos'),
  (70, 3, 'Cabo 95mm PT', 'm', 73.2710, 'ambos'),
  (71, 3, 'Cabo 95mm BR', 'm', 73.2710, 'ambos'),

-- Termocontrátil 10mm
  (72, 4, 'Termocontrátil 10mm VM', 'm',  2.0414, 'ambos'),
  (73, 4, 'Termocontrátil 10mm VD', 'm',  2.0414, 'ambos'),
  (74, 4, 'Termocontrátil 10mm AZ', 'm',  2.0414, 'ambos'),
  (75, 4, 'Termocontrátil 10mm PT', 'm',  2.0414, 'ambos'),
  (76, 4, 'Termocontrátil 10mm BR', 'm',  2.0414, 'ambos'),

-- Termocontrátil 16mm
  (77, 4, 'Termocontrátil 16mm VM', 'm',  2.7694, 'ambos'),
  (78, 4, 'Termocontrátil 16mm VD', 'm',  2.7694, 'ambos'),
  (79, 4, 'Termocontrátil 16mm AZ', 'm',  2.7694, 'ambos'),
  (80, 4, 'Termocontrátil 16mm PT', 'm',  2.7694, 'ambos'),
  (81, 4, 'Termocontrátil 16mm BR', 'm',  2.7694, 'ambos'),

-- Termocontrátil 25mm
  (82, 4, 'Termocontrátil 25mm VM', 'm',  6.2588, 'ambos'),
  (83, 4, 'Termocontrátil 25mm VD', 'm',  6.2588, 'ambos'),
  (84, 4, 'Termocontrátil 25mm PT', 'm',  6.2588, 'ambos'),
  (85, 4, 'Termocontrátil 25mm BR', 'm',  6.2588, 'ambos'),

-- Termocontrátil 35mm
  (86, 4, 'Termocontrátil 35mm VM', 'm', 10.2692, 'ambos'),
  (87, 4, 'Termocontrátil 35mm VD', 'm', 10.2692, 'ambos'),
  (88, 4, 'Termocontrátil 35mm PT', 'm', 10.2692, 'ambos'),
  (89, 4, 'Termocontrátil 35mm BR', 'm', 10.2692, 'ambos'),

-- Termocontrátil 50mm
  (90, 4, 'Termocontrátil 50mm VM', 'm', 19.4000, 'ambos'),
  (91, 4, 'Termocontrátil 50mm VD', 'm', 19.4000, 'ambos'),
  (92, 4, 'Termocontrátil 50mm PT', 'm', 19.4000, 'ambos'),
  (93, 4, 'Termocontrátil 50mm BR', 'm', 19.4000, 'ambos'),

-- Termocontrátil 70mm
  (94, 4, 'Termocontrátil 70mm VM', 'm', 29.1500, 'ambos'),
  (95, 4, 'Termocontrátil 70mm VD', 'm', 29.1500, 'ambos'),
  (96, 4, 'Termocontrátil 70mm PT', 'm', 29.1500, 'ambos'),
  (97, 4, 'Termocontrátil 70mm BR', 'm', 29.1500, 'ambos'),

-- Termocontrátil 95mm
  (98,  4, 'Termocontrátil 95mm VM', 'm', 30.4000, 'ambos'),
  (99,  4, 'Termocontrátil 95mm VD', 'm', 30.4000, 'ambos'),
  (100, 4, 'Termocontrátil 95mm PT', 'm', 30.4000, 'ambos'),
  (101, 4, 'Termocontrátil 95mm BR', 'm', 30.4000, 'ambos'),

-- Olhal
  (102, 5, 'Olhal 10mm', 'un', 0.9670, 'ambos'),
  (103, 5, 'Olhal 16mm', 'un', 1.7624, 'ambos'),
  (104, 5, 'Olhal 25mm', 'un', 1.8546, 'ambos'),
  (105, 5, 'Olhal 35mm', 'un', 1.8546, 'ambos'),
  (106, 5, 'Olhal 50mm', 'un', 3.1086, 'ambos'),
  (107, 5, 'Olhal 70mm', 'un', 4.4516, 'ambos'),
  (108, 5, 'Olhal 95mm', 'un', 5.5532, 'ambos'),

-- Conjunto Box
  (109, 6, 'Conj. Box 1.1/4''', 'un',  5.5000, 'ambos'),
  (110, 6, 'Conj. Box 1.1/2''', 'un', 12.0000, 'ambos'),
  (111, 6, 'Conj. Box 2''',     'un',  8.5000, 'ambos'),
  (112, 6, 'Conj. Box 2.1/2''', 'un', 11.0000, 'ambos'),
  (113, 6, 'Conj. Box 3''',     'un', 13.5000, 'ambos'),

-- Outros
  (114, 7, 'Plaqueta',            'un',  2.8900, 'ambos'),
  (115, 7, 'Abraçadeira 3,5x200', 'un',  0.0711, 'ambos'),
  (116, 7, 'Porca inox 1/4',      'un',  0.2340, 'ambos'),
  (117, 7, 'Arruela inox 1/4',    'un',  0.3200, 'ambos'),
  (118, 7, 'Parafuso inox 1/4',   'un',  0.5250, 'ambos'),
  (119, 7, 'Rebite',              'un',  0.0423, 'ambos'),
  (120, 7, 'Conector Genérico',   'un',  4.2800, 'ambos'),
  (121, 7, 'Barramento tipo Pente','un', 15.0000, 'ambos'),

-- Execução (mão de obra)
  (122, 8, 'Mão de Obra Policarbonato', 'un', 75.0000, 'policarbonato'),
  (123, 8, 'Mão de Obra Alumínio',      'un', 60.0000, 'aluminio'),

-- DPS
  (124, 9, 'Cabo DPS 6mm verde',    'm', 27.9700, 'ambos'),
  (125, 9, 'Cabo DPS 16mm verde',   'm',  6.0000, 'ambos'),
  (126, 9, 'Disjuntor DPS 25A 10kA','un', 72.2900, 'ambos'),
  (127, 9, 'Disjuntor DPS 63A 10kA','un', 14.4100, 'ambos'),
  (128, 9, 'DPS Classe I/II',        'un', 25.7600, 'ambos'),
  (129, 9, 'DPS Classe II',          'un', 22.7100, 'ambos'),

-- Itens Extras (barramento)
  (130, 10, 'Barramento 100A',          'un', 182.5000, 'ambos'),
  (131, 10, 'Parafuso inox 1/4 (extra)','un',   0.5250, 'ambos'),
  (132, 10, 'Porca inox 1/4 (extra)',   'un',   0.2340, 'ambos'),
  (133, 10, 'Arruela inox 1/4 (extra)', 'un',   0.3200, 'ambos')
ON CONFLICT (id) DO NOTHING;


-- =============================================
-- COMPOSIÇÃO POR DJ GERAL
-- Cada linha = (main_breaker_id, material_id, quantity)
-- Baseado na planilha: coluna do DJ → linha do material
--
-- Legenda de IDs de DJ geral:
--   1=50A 2=63A 3=70A 4=80A 5=90A 6=100A
--   7=125A 8=150A 9=175A 10=200A 11=225A 12=250A
-- =============================================
INSERT INTO composition_by_main_breaker (main_breaker_id, material_id, quantity) VALUES

-- DJ Geral 50A — DJ Mono 63A (3 unidades de segurança interna)
  (1, 25, 0),   -- DJ Mono 63A (0 neste exemplo, presente na composição)

-- DJ Geral 63A
  (2, 25, 0),   -- DJ Mono 63A
  (2, 29, 0),   -- DJ Tri 50A

-- DJ Geral 70A
  (3, 25, 0),   -- DJ Mono 63A
  (3, 30, 0),   -- DJ Tri 63A

-- DJ Geral 80A
  (4, 25, 0),   -- DJ Mono 63A
  (4, 31, 0),   -- DJ Tri 70A
  (4, 32, 1),   -- DJ CM 80A
  (4, 51, 0),   -- Cabo 25mm VM
  (4, 52, 0),   -- Cabo 25mm VD
  (4, 53, 0),   -- Cabo 25mm PT
  (4, 54, 0),   -- Cabo 25mm BR

-- DJ Geral 90A
  (5, 25, 0),   -- DJ Mono 63A
  (5, 33, 1),   -- DJ CM 90A
  (5, 51, 0),   -- Cabo 25mm VM
  (5, 52, 0),   -- Cabo 25mm VD
  (5, 53, 0),   -- Cabo 25mm PT
  (5, 54, 0),   -- Cabo 25mm BR

-- DJ Geral 100A
  (6, 25, 0),   -- DJ Mono 63A
  (6, 34, 1),   -- DJ CM 100A
  (6, 51, 0),   -- Cabo 25mm VM
  (6, 52, 0),   -- Cabo 25mm VD
  (6, 53, 0),   -- Cabo 25mm PT
  (6, 54, 0),   -- Cabo 25mm BR

-- DJ Geral 125A — configuração mais completa da planilha (coluna com valores reais)
  (7, 25,  3),  -- DJ Mono 63A (3 un — neutros/fases extras)
  (7, 35,  1),  -- DJ CM 125A
  (7, 46,  1),  -- Cabo 16mm VM
  (7, 47,  2),  -- Cabo 16mm VD
  (7, 48,  1),  -- Cabo 16mm AZ (via coluna Tri63 que cruza aqui)
  (7, 49,  1),  -- Cabo 16mm PT
  (7, 50,  1),  -- Cabo 16mm BR
  (7, 55,  1),  -- Cabo 35mm VM
  (7, 56,  1),  -- Cabo 35mm VD
  (7, 57,  1),  -- Cabo 35mm AZ
  (7, 58,  1),  -- Cabo 35mm PT
  (7, 59,  1),  -- Cabo 35mm BR
  (7, 77,  0.1),-- Termocontrátil 16mm VM
  (7, 78,  0.1),-- Termocontrátil 16mm VD
  (7, 80,  0.1),-- Termocontrátil 16mm PT
  (7, 81,  0.1),-- Termocontrátil 16mm BR
  (7, 86,  0.1),-- Termocontrátil 35mm VM
  (7, 87,  0.1),-- Termocontrátil 35mm VD
  (7, 88,  0.1),-- Termocontrátil 35mm PT
  (7, 89,  0.1),-- Termocontrátil 35mm BR
  (7, 103, 10), -- Olhal 16mm
  (7, 105, 4),  -- Olhal 35mm
  (7, 110, 1),  -- Conj Box 1.1/2"
  (7, 114, 4),  -- Plaqueta
  (7, 115, 40), -- Abraçadeira 3,5x200
  (7, 116, 24), -- Porca inox 1/4
  (7, 117, 24), -- Arruela inox 1/4
  (7, 118, 24), -- Parafuso inox 1/4
  (7, 119, 8),  -- Rebite
  (7, 120, 1),  -- Conector Genérico
  (7, 121, 1),  -- Barramento tipo Pente

-- DJ Geral 150A
  (8, 36, 1),   -- DJ CM 150A
  (8, 46, 0),   -- Cabo 16mm VM
  (8, 60, 0),   -- Cabo 50mm VM
  (8, 61, 0),   -- Cabo 50mm VD
  (8, 62, 0),   -- Cabo 50mm PT
  (8, 63, 0),   -- Cabo 50mm BR

-- DJ Geral 175A
  (9, 37, 1),   -- DJ CM 175A
  (9, 46, 0),   -- Cabo 16mm VM
  (9, 64, 0),   -- Cabo 70mm VM
  (9, 65, 0),   -- Cabo 70mm VD
  (9, 66, 0),   -- Cabo 70mm PT
  (9, 67, 0),   -- Cabo 70mm BR

-- DJ Geral 200A
  (10, 38, 1),  -- DJ CM 200A
  (10, 46, 0),  -- Cabo 16mm VM
  (10, 64, 0),  -- Cabo 70mm VM
  (10, 65, 0),  -- Cabo 70mm VD
  (10, 66, 0),  -- Cabo 70mm PT
  (10, 67, 0),  -- Cabo 70mm BR

-- DJ Geral 225A
  (11, 39, 1),  -- DJ CM 225A
  (11, 46, 0),  -- Cabo 16mm VM
  (11, 68, 0),  -- Cabo 95mm VM
  (11, 69, 0),  -- Cabo 95mm VD
  (11, 70, 0),  -- Cabo 95mm PT
  (11, 71, 0),  -- Cabo 95mm BR

-- DJ Geral 250A
  (12, 40, 1),  -- DJ CM 250A
  (12, 46, 0),  -- Cabo 16mm VM
  (12, 68, 0),  -- Cabo 95mm VM
  (12, 69, 0),  -- Cabo 95mm VD
  (12, 70, 0),  -- Cabo 95mm PT
  (12, 71, 0)
ON CONFLICT (main_breaker_id, material_id) DO NOTHING;


-- =============================================
-- COMPOSIÇÃO POR DJ DE UNIDADE
-- quantity_per_unit = quantidade POR UNIDADE daquele tipo
--
-- Legenda IDs unit_breakers:
--   1=mono40 2=mono50 3=mono63
--   4=bi50   5=bi63
--   7=tri50  8=tri63  9=tri70
-- =============================================
INSERT INTO composition_by_unit_breaker (unit_breaker_id, material_id, quantity_per_unit) VALUES

-- MONO 40A
  (1, 23,  1),    -- DJ Mono 40A
  (1, 44,  2.1),  -- Cabo 10mm PT
  (1, 43,  2.1),  -- Cabo 10mm AZ
  (1, 75,  0.1),  -- Termocontrátil 10mm PT
  (1, 74,  0.1),  -- Termocontrátil 10mm AZ
  (1, 103, 2),    -- Olhal 16mm
  (1, 110, 1),    -- Conj Box 1.1/2"
  (1, 114, 2),    -- Plaqueta
  (1, 115, 20),   -- Abraçadeira
  (1, 116, 12),   -- Porca inox 1/4
  (1, 117, 12),   -- Arruela inox 1/4
  (1, 118, 12),   -- Parafuso inox 1/4
  (1, 119, 4),    -- Rebite
  (1, 122, 1),    -- MO Policarbonato
  (1, 123, 1),    -- MO Alumínio

-- MONO 50A
  (2, 24,  1),    -- DJ Mono 50A
  (2, 44,  2.1),  -- Cabo 10mm PT
  (2, 43,  2.1),  -- Cabo 10mm AZ
  (2, 75,  0.1),  -- Termocontrátil 10mm PT
  (2, 74,  0.1),  -- Termocontrátil 10mm AZ
  (2, 103, 2),    -- Olhal 16mm
  (2, 110, 1),    -- Conj Box 1.1/2"
  (2, 114, 2),    -- Plaqueta
  (2, 115, 20),   -- Abraçadeira
  (2, 116, 12),   -- Porca inox 1/4
  (2, 117, 12),   -- Arruela inox 1/4
  (2, 118, 12),   -- Parafuso inox 1/4
  (2, 119, 4),    -- Rebite
  (2, 122, 1),    -- MO Policarbonato
  (2, 123, 1),    -- MO Alumínio

-- MONO 63A
  (3, 25,  1),    -- DJ Mono 63A
  (3, 44,  2.1),  -- Cabo 10mm PT
  (3, 43,  2.1),  -- Cabo 10mm AZ
  (3, 75,  0.1),  -- Termocontrátil 10mm PT
  (3, 74,  0.1),  -- Termocontrátil 10mm AZ
  (3, 103, 2),    -- Olhal 16mm
  (3, 110, 1),    -- Conj Box 1.1/2"
  (3, 114, 2),    -- Plaqueta
  (3, 115, 20),   -- Abraçadeira
  (3, 116, 12),   -- Porca inox 1/4
  (3, 117, 12),   -- Arruela inox 1/4
  (3, 118, 12),   -- Parafuso inox 1/4
  (3, 119, 4),    -- Rebite
  (3, 122, 1),    -- MO Policarbonato
  (3, 123, 1),    -- MO Alumínio

-- BI 50A
  (4, 27,  1),    -- DJ Bi 50A
  (4, 44,  2.1),  -- Cabo 10mm PT
  (4, 45,  2.1),  -- Cabo 10mm BR
  (4, 43,  2.1),  -- Cabo 10mm AZ
  (4, 75,  0.1),  -- Termocontrátil 10mm PT
  (4, 76,  0.1),  -- Termocontrátil 10mm BR
  (4, 74,  0.1),  -- Termocontrátil 10mm AZ
  (4, 103, 3),    -- Olhal 16mm
  (4, 110, 1),    -- Conj Box 1.1/2"
  (4, 114, 2),    -- Plaqueta
  (4, 115, 20),   -- Abraçadeira
  (4, 116, 12),   -- Porca inox 1/4
  (4, 117, 12),   -- Arruela inox 1/4
  (4, 118, 12),   -- Parafuso inox 1/4
  (4, 119, 4),    -- Rebite
  (4, 122, 1),    -- MO Policarbonato
  (4, 123, 1),    -- MO Alumínio

-- BI 63A
  (5, 28,  1),    -- DJ Bi 63A
  (5, 44,  2.1),  -- Cabo 10mm PT
  (5, 45,  2.1),  -- Cabo 10mm BR
  (5, 43,  2.1),  -- Cabo 10mm AZ
  (5, 75,  0.1),  -- Termocontrátil 10mm PT
  (5, 76,  0.1),  -- Termocontrátil 10mm BR
  (5, 74,  0.1),  -- Termocontrátil 10mm AZ
  (5, 103, 3),    -- Olhal 16mm
  (5, 110, 1),    -- Conj Box 1.1/2"
  (5, 114, 2),    -- Plaqueta
  (5, 115, 20),   -- Abraçadeira
  (5, 116, 12),   -- Porca inox 1/4
  (5, 117, 12),   -- Arruela inox 1/4
  (5, 118, 12),   -- Parafuso inox 1/4
  (5, 119, 4),    -- Rebite
  (5, 122, 1),    -- MO Policarbonato
  (5, 123, 1),    -- MO Alumínio

-- TRI 50A
  (7, 29,  1),    -- DJ Tri 50A
  (7, 44,  2.1),  -- Cabo 10mm PT
  (7, 45,  2.1),  -- Cabo 10mm BR
  (7, 41,  2.1),  -- Cabo 10mm VM
  (7, 43,  2.1),  -- Cabo 10mm AZ
  (7, 75,  0.1),  -- Termocontrátil 10mm PT
  (7, 76,  0.1),  -- Termocontrátil 10mm BR
  (7, 72,  0.1),  -- Termocontrátil 10mm VM
  (7, 74,  0.1),  -- Termocontrátil 10mm AZ
  (7, 103, 4),    -- Olhal 16mm
  (7, 110, 1),    -- Conj Box 1.1/2"
  (7, 114, 2),    -- Plaqueta
  (7, 115, 20),   -- Abraçadeira
  (7, 116, 12),   -- Porca inox 1/4
  (7, 117, 12),   -- Arruela inox 1/4
  (7, 118, 12),   -- Parafuso inox 1/4
  (7, 119, 4),    -- Rebite
  (7, 122, 1),    -- MO Policarbonato
  (7, 123, 1),    -- MO Alumínio

-- TRI 63A
  (8, 30,  1),    -- DJ Tri 63A
  (8, 41,  2.1),  -- Cabo 10mm VM
  (8, 44,  2.1),  -- Cabo 10mm PT
  (8, 45,  2.1),  -- Cabo 10mm BR
  (8, 43,  2.1),  -- Cabo 10mm AZ
  (8, 72,  0.1),  -- Termocontrátil 10mm VM
  (8, 75,  0.1),  -- Termocontrátil 10mm PT
  (8, 76,  0.1),  -- Termocontrátil 10mm BR
  (8, 74,  0.1),  -- Termocontrátil 10mm AZ
  (8, 103, 4),    -- Olhal 16mm
  (8, 110, 1),    -- Conj Box 1.1/2"
  (8, 114, 2),    -- Plaqueta
  (8, 115, 20),   -- Abraçadeira
  (8, 116, 12),   -- Porca inox 1/4
  (8, 117, 12),   -- Arruela inox 1/4
  (8, 118, 12),   -- Parafuso inox 1/4
  (8, 119, 4),    -- Rebite
  (8, 122, 1),    -- MO Policarbonato
  (8, 123, 1),    -- MO Alumínio

-- TRI 70A
  (9, 31,  1),    -- DJ Tri 70A
  (9, 49,  2.1),  -- Cabo 16mm PT
  (9, 50,  2.1),  -- Cabo 16mm BR
  (9, 46,  2.1),  -- Cabo 16mm VM
  (9, 48,  2.1),  -- Cabo 16mm AZ
  (9, 80,  0.1),  -- Termocontrátil 16mm PT
  (9, 81,  0.1),  -- Termocontrátil 16mm BR
  (9, 77,  0.1),  -- Termocontrátil 16mm VM
  (9, 79,  0.1),  -- Termocontrátil 16mm AZ
  (9, 103, 4),    -- Olhal 16mm
  (9, 110, 1),    -- Conj Box 1.1/2"
  (9, 114, 2),    -- Plaqueta
  (9, 115, 20),   -- Abraçadeira
  (9, 116, 12),   -- Porca
  (9, 117, 12),   -- Arruela
  (9, 118, 12),   -- Parafuso
  (9, 119, 4),    -- Rebite
  (9, 122, 1),    -- MO Poli
  (9, 123, 1)
ON CONFLICT (unit_breaker_id, material_id) DO NOTHING;


-- =============================================
-- COMPOSIÇÃO DO DPS
-- =============================================
INSERT INTO composition_by_dps (dps_class, material_id, quantity) VALUES
  -- DPS Classe I/II
  ('classe_i_ii', 125, 0.5),  -- Cabo DPS 16mm verde
  ('classe_i_ii', 127, 3),    -- Disjuntor DPS 63A 10kA
  ('classe_i_ii', 128, 3),    -- DPS Classe I/II
  ('classe_i_ii', 121, 1),    -- Barramento tipo Pente

  -- DPS Classe II
  ('classe_ii', 124, 0.5),    -- Cabo DPS 6mm verde
  ('classe_ii', 126, 3),      -- Disjuntor DPS 25A 10kA
  ('classe_ii', 129, 3),      -- DPS Classe II
  ('classe_ii', 121, 1)
ON CONFLICT (dps_class, material_id) DO NOTHING;


-- =============================================
-- MARGENS E CONFIGURAÇÕES DE VENDA
-- (tabela de referência — pode criar se quiser centralizar)
-- Alumínio:  imposto 8%,  markup s/ NF 1.30, c/ NF 1.55
-- Policarb.: imposto 12%, markup s/ NF 1.30, c/ NF 1.55
-- Margem alvo: ~23%
-- =============================================
