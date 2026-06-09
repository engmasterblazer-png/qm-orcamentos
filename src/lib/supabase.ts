import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// =============================================
// TIPOS PARA AS QUERIES
// =============================================

export interface MainBreaker {
  id: number
  amperage: number
  label: string
  active: boolean
}

export interface UnitBreaker {
  id: number
  phase: 'mono' | 'bi' | 'tri'
  amperage: number
  label: string
  active: boolean
}

export interface Material {
  id: string
  category_id: number
  name: string
  unit: string
  unit_price: number
  applies_to: 'policarbonato' | 'aluminio' | 'ambos'
  active: boolean
}

export interface Budget {
  id: string
  client_name?: string
  client_document?: string
  client_phone?: string
  client_email?: string
  box_type: 'policarbonato' | 'aluminio'
  main_breaker_id: number
  main_breaker?: MainBreaker
  dps_class?: 'classe_i_ii' | 'classe_ii'
  subtotal_materials?: number
  subtotal_labor?: number
  cost_total?: number
  sale_price_no_invoice?: number
  sale_price_with_invoice?: number
  discount?: number
  surcharge?: number
  notes?: string
  status: 'draft' | 'sent' | 'approved' | 'rejected'
  created_by?: string
  created_at: string
  updated_at: string
}

export interface BudgetUnit {
  id: string
  budget_id: string
  unit_breaker_id: number
  quantity: number
}

export interface BudgetItem {
  id: string
  budget_id: string
  material_id: number
  quantity: number
  unit_price: number
  total_price: number
}

export interface BudgetItemWithMaterial extends BudgetItem {
  material_name: string
  unit: string
  category_name?: string
}

// =============================================
// HELPERS PARA QUERIES
// =============================================

/**
 * Obtém todos os disjuntores gerais ativos
 */
export async function getMainBreakers(): Promise<MainBreaker[]> {
  const { data, error } = await supabase
    .from('main_breakers')
    .select('*')
    .eq('active', true)
    .order('amperage')

  if (error) throw error
  return data || []
}

/**
 * Obtém todos os materiais ativos com suas categorias
 */
export async function getMaterials(): Promise<(Material & { category_name: string })[]> {
  const { data, error } = await supabase
    .from('materials')
    .select(`
      *,
      material_categories(name)
    `)
    .eq('active', true)
    .order('category_id')
    .order('name')

  if (error) throw error
  return (data || []).map(item => ({
    ...item,
    category_name: item.material_categories?.name ?? 'Sem categoria'
  }))
}

/**
 * Atualiza o preço unitário de um material
 */
export async function updateMaterialPrice(materialId: string, unitPrice: number): Promise<void> {
  const { error } = await supabase
    .from('materials')
    .update({ unit_price: unitPrice })
    .eq('id', materialId)

  if (error) throw error
}
export async function getUnitBreakers(): Promise<UnitBreaker[]> {
  const { data, error } = await supabase
    .from('unit_breakers')
    .select('*')
    .eq('active', true)
    .order('phase')
    .order('amperage')

  if (error) throw error
  return data || []
}

/**
 * Obtém disjuntores de unidade por fase
 */
export async function getUnitBreakersByPhase(
  phase: 'mono' | 'bi' | 'tri'
): Promise<UnitBreaker[]> {
  const { data, error } = await supabase
    .from('unit_breakers')
    .select('*')
    .eq('phase', phase)
    .eq('active', true)
    .order('amperage')

  if (error) throw error
  return data || []
}

/**
 * Obtém ID do disjuntor geral pela amperagem
 */
export async function getMainBreakerId(amperage: number): Promise<number> {
  const { data, error } = await supabase
    .from('main_breakers')
    .select('id')
    .eq('amperage', amperage)
    .single()

  if (error) throw error
  return data.id
}

/**
 * Obtém ID do disjuntor de unidade pela fase e amperagem
 */
export async function getUnitBreakerId(
  phase: 'mono' | 'bi' | 'tri',
  amperage: number
): Promise<number> {
  const { data, error } = await supabase
    .from('unit_breakers')
    .select('id')
    .eq('phase', phase)
    .eq('amperage', amperage)
    .single()

  if (error) throw error
  return data.id
}

/**
 * Cria um novo orçamento
 */
export async function createBudget(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>): Promise<Budget> {
  const { data, error } = await supabase
    .from('budgets')
    .insert([budget])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Obtém um orçamento pelo ID com dados do disjuntor geral
 */
export async function getBudget(budgetId: string): Promise<Budget> {
  const { data, error } = await supabase
    .from('budgets')
    .select(`
      *,
      main_breakers(*)
    `)
    .eq('id', budgetId)
    .single()

  if (error) throw error
  
  // Normaliza os dados do main_breaker
  const budget = data as any
  if (budget.main_breakers && !Array.isArray(budget.main_breakers)) {
    budget.main_breaker = budget.main_breakers
  } else if (Array.isArray(budget.main_breakers) && budget.main_breakers.length > 0) {
    budget.main_breaker = budget.main_breakers[0]
  }
  delete budget.main_breakers
  
  return budget as Budget
}

/**
 * Atualiza um orçamento
 */
export async function updateBudget(
  budgetId: string,
  updates: Partial<Omit<Budget, 'id' | 'created_at' | 'updated_at'>>
): Promise<Budget> {
  const { data, error } = await supabase
    .from('budgets')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', budgetId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Insere unidades (disjuntores de unidade) em um orçamento
 */
export async function addBudgetUnits(units: Omit<BudgetUnit, 'id'>[]): Promise<BudgetUnit[]> {
  const { data, error } = await supabase
    .from('budget_units')
    .insert(units)
    .select()

  if (error) throw error
  return data || []
}

/**
 * Obtém as unidades de um orçamento
 */
export async function getBudgetUnits(budgetId: string): Promise<BudgetUnit[]> {
  const { data, error } = await supabase
    .from('budget_units')
    .select('*')
    .eq('budget_id', budgetId)

  if (error) throw error
  return data || []
}

/**
 * Obtém o total de unidades de um orçamento
 */
export async function getTotalBudgetUnits(budgetId: string): Promise<number> {
  const units = await getBudgetUnits(budgetId)
  return units.reduce((total, unit) => total + unit.quantity, 0)
}

/**
 * Obtém os itens calculados de um orçamento
 */
export async function getBudgetItems(budgetId: string): Promise<BudgetItem[]> {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .eq('budget_id', budgetId)

  if (error) throw error
  return data || []
}

export async function getBudgetItemsWithMaterials(budgetId: string): Promise<BudgetItemWithMaterial[]> {
  const [items, materials] = await Promise.all([
    getBudgetItems(budgetId),
    getMaterials(),
  ])

  const materialMap = new Map(materials.map((material) => [String(material.id), material]))

  return items.map((item) => {
    const material = materialMap.get(String(item.material_id))
    return {
      ...item,
      material_name: material?.name ?? 'Material desconhecido',
      unit: material?.unit ?? 'un',
      category_name: material?.category_name,
    }
  })
}

/**
 * Chama a função de cálculo do orçamento
 */
export async function calculateBudget(budgetId: string): Promise<any> {
  const { data, error } = await supabase.rpc('calculate_budget', {
    p_budget_id: budgetId,
  })

  if (error) throw error
  return data
}

/**
 * Deleta um orçamento
 */
export async function deleteBudget(budgetId: string): Promise<void> {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', budgetId)

  if (error) throw error
}
