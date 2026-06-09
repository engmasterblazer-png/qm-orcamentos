import { useState } from 'react'
import { OrcamentoWizard, OrcamentoState } from '../components/orcamento'
import {
  createBudget,
  addBudgetUnits,
  calculateBudget,
  getMainBreakerId,
  getUnitBreakerId,
  getBudget,
  getBudgetItemsWithMaterials,
  getTotalBudgetUnits,
  Budget,
  BudgetItemWithMaterial,
} from '../lib/supabase'

export default function NovoOrcamentoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<{ budget: Budget; items: BudgetItemWithMaterial[]; totalUnits: number } | null>(null)
  const [bdiFactor, setBdiFactor] = useState(0)
  const [showItems, setShowItems] = useState(false)

  const handleSubmit = async (state: OrcamentoState) => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Obtém o ID do disjuntor geral
      const mainBreakerId = await getMainBreakerId(state.mainBreakerAmperage!)

      // 2. Cria o orçamento no Supabase
      const budget = await createBudget({
        box_type: state.material!,
        main_breaker_id: mainBreakerId,
        dps_class: state.dpsClass || undefined,
        status: 'draft',
      })

      // 3. Insere as unidades (disjuntores de unidade)
      if (state.unitBreakers.length > 0) {
        const unitRows = await Promise.all(
          state.unitBreakers.map(async (b) => ({
            budget_id: budget.id,
            unit_breaker_id: await getUnitBreakerId(b.phase, b.amperage),
            quantity: b.quantity,
          }))
        )
        await addBudgetUnits(unitRows)
      }

      // 4. Calcula os itens e totais do orçamento
      await calculateBudget(budget.id)

      // 5. Busca os valores calculados e os itens
      const refreshedBudget = await getBudget(budget.id)
      const items = await getBudgetItemsWithMaterials(budget.id)
      const totalUnits = await getTotalBudgetUnits(budget.id)

      setReport({ budget: refreshedBudget, items, totalUnits })
      setBdiFactor(state.bdiPercent)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar orçamento'
      setError(message)
      console.error('Erro ao criar orçamento:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const reportMarkup = report
    ? (() => {
        const subtotalMaterials = report.budget.subtotal_materials ?? 0
        const subtotalLabor = report.budget.subtotal_labor ?? 0
        const baseCost = report.budget.cost_total ?? subtotalMaterials + subtotalLabor
        const bdiValue = baseCost * (bdiFactor / 100)
        const totalWithBdi = baseCost + bdiValue

        return (
          <div className="qm-report-card">
            <div className="qm-report-header">
              <div>
                <p className="qm-report-title">Relatório do orçamento</p>
                <p className="qm-report-subtitle">Valores de material, mão de obra e BDI aplicados.</p>
              </div>
              <div className="qm-report-meta">
                <span>ID do orçamento: {report.budget.id}</span>
              </div>
            </div>

            <div className="qm-report-grid">
              <div className="qm-report-item">
                <span className="qm-report-label">Disjuntor Geral</span>
                <span className="qm-report-value">{report.budget.main_breaker?.amperage}A</span>
              </div>
              <div className="qm-report-item">
                <span className="qm-report-label">Quantitativo (Unidades)</span>
                <span className="qm-report-value">{report.totalUnits}</span>
              </div>
              <div className="qm-report-item">
                <span className="qm-report-label">Materiais</span>
                <span className="qm-report-value">R$ {subtotalMaterials.toFixed(2)}</span>
              </div>
              <div className="qm-report-item">
                <span className="qm-report-label">Mão de obra</span>
                <span className="qm-report-value">R$ {subtotalLabor.toFixed(2)}</span>
              </div>
              <div className="qm-report-item">
                <span className="qm-report-label">Custo total</span>
                <span className="qm-report-value">R$ {baseCost.toFixed(2)}</span>
              </div>
              <div className="qm-report-item">
                <label className="qm-report-label" htmlFor="bdi-factor">Fator / BDI (%)</label>
                <input
                  id="bdi-factor"
                  type="number"
                  min="0"
                  step="0.1"
                  value={bdiFactor}
                  className="qm-report-input"
                  onChange={(event) => setBdiFactor(Number(event.target.value) || 0)}
                />
              </div>
              <div className="qm-report-item qm-report-total">
                <span className="qm-report-label">Total com BDI</span>
                <span className="qm-report-value">R$ {totalWithBdi.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              className="qm-btn-secondary"
              onClick={() => setShowItems((prev) => !prev)}
            >
              {showItems ? 'Ocultar materiais incluídos' : 'Ver materiais incluídos'}
            </button>

            {showItems && (
              <div className="qm-report-table-wrap">
                <table className="qm-report-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qtd.</th>
                      <th>Un.</th>
                      <th>Preço un.</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.material_name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unit}</td>
                        <td>R$ {item.unit_price.toFixed(2)}</td>
                        <td>R$ {item.total_price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })()
    : null

  return (
    <>
      {error && (
        <div style={{ padding: '16px', background: '#fee', color: '#c00', marginBottom: '16px' }}>
          Erro: {error}
        </div>
      )}
      <OrcamentoWizard onSubmit={handleSubmit} />
      {reportMarkup}
    </>
  )
}
