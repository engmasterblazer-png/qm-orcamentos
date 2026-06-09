# QM Orçamentos - Integração Supabase 🚀

## 1. Configurar URL do Supabase

Edite o arquivo `.env.local`:

```env
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sb_publishable_EsdaWKD2_woYxOG7sr5b4g_jh7MBv9Q
```

## 2. Instalar Dependências

```bash
npm install
# ou
yarn install
```

## 3. Executar Migrations SQL

Entre no dashboard do Supabase e execute os scripts SQL na ordem:

1. **`supabase/migrations/001_qm_schema.sql`** - Cria tabelas
2. **`supabase/migrations/002_qm_seed.sql`** - Popula dados iniciais
3. **`supabase/migrations/003_qm_functions.sql`** - Cria função de cálculo

## 4. Usar a API no Código

### Exemplo: Criar um Orçamento

```typescript
import { createBudget, addBudgetUnits, getMainBreakerId } from '@/lib/supabase'

// 1. Obter ID do disjuntor geral
const mainBreakerId = await getMainBreakerId(100) // 100A

// 2. Criar orçamento
const budget = await createBudget({
  box_type: 'aluminio',
  main_breaker_id: mainBreakerId,
  dps_class: 'classe_i_ii',
  status: 'draft',
})

// 3. Adicionar unidades
await addBudgetUnits([
  {
    budget_id: budget.id,
    unit_breaker_id: 7, // tri 50A
    quantity: 3,
  },
])
```

### Exemplo: Buscar Disjuntores

```typescript
import { getMainBreakers, getUnitBreakersByPhase } from '@/lib/supabase'

// Disjuntores gerais
const mainBreakers = await getMainBreakers()

// Disjuntores trifásicos
const triPhaseBreakers = await getUnitBreakersByPhase('tri')
```

### Exemplo: Calcular Orçamento

```typescript
import { calculateBudget } from '@/lib/supabase'

const result = await calculateBudget(budgetId)
console.log(result) // Retorna objeto JSON com cálculos
```

## 5. Estrutura de Tipos

Todos os tipos estão em `src/lib/supabase.ts`:

- `MainBreaker` - Disjuntor geral
- `UnitBreaker` - Disjuntor de unidade
- `Material` - Material do catálogo
- `Budget` - Orçamento
- `BudgetUnit` - Unidade de um orçamento
- `BudgetItem` - Item calculado de um orçamento

## 6. Próximos Passos

- [ ] Criar componentes das etapas (Etapa1, Etapa2, Etapa3)
- [ ] Integrar seleção de materiais
- [ ] Criar página de visualização de orçamento
- [ ] Adicionar autenticação (opcional)
- [ ] Exportar orçamento em PDF

## Referência da API

| Função | Descrição |
|--------|-----------|
| `getMainBreakers()` | Lista todos os disjuntores gerais |
| `getUnitBreakers()` | Lista todos os disjuntores de unidade |
| `getUnitBreakersByPhase(phase)` | Filtra por fase (mono/bi/tri) |
| `getMainBreakerId(amperage)` | Busca ID por amperagem |
| `getUnitBreakerId(phase, amperage)` | Busca ID por fase e amperagem |
| `createBudget(budget)` | Cria novo orçamento |
| `getBudget(id)` | Obtém orçamento |
| `updateBudget(id, updates)` | Atualiza orçamento |
| `addBudgetUnits(units)` | Adiciona unidades |
| `getBudgetUnits(budgetId)` | Lista unidades |
| `getBudgetItems(budgetId)` | Lista itens calculados |
| `calculateBudget(budgetId)` | Calcula totais |
| `deleteBudget(id)` | Deleta orçamento |
