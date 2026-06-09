import React from 'react'
import { OrcamentoState, Phase, UNIT_BREAKERS, PHASE_LABELS, PHASE_POLES, UnitBreaker } from './types'

interface Props {
  state: OrcamentoState
  onChange: (updates: Partial<OrcamentoState>) => void
  onNext: () => void
  onBack: () => void
}

const PHASE_COLORS: Record<Phase, string> = {
  mono: 'mono',
  bi: 'bi',
  tri: 'tri',
}

export function Etapa2({ state, onChange, onNext, onBack }: Props) {
  const getQty = (phase: Phase, amperage: number): number => {
    return state.unitBreakers.find(b => b.phase === phase && b.amperage === amperage)?.quantity ?? 0
  }

  const getBreakerSpace = (phase: Phase, amperage: number): number => {
    if (state.material === 'policarbonato' && phase === 'tri' && amperage > 70) {
      return 2
    }
    return 1
  }

  const getTotalSpaces = (): number =>
    state.unitBreakers.reduce((sum, b) => sum + b.quantity * getBreakerSpace(b.phase, b.amperage), 0)

  const setQty = (phase: Phase, amperage: number, quantity: number) => {
    const currentQty = getQty(phase, amperage)
    const currentSpace = currentQty * getBreakerSpace(phase, amperage)
    const newSpace = quantity * getBreakerSpace(phase, amperage)
    const currentTotalSpaces = getTotalSpaces()
    const newTotalSpaces = currentTotalSpaces - currentSpace + newSpace
    const maxUnits = state.material === 'aluminio' ? state.aluminiumMeters : null
    if (maxUnits !== null && newTotalSpaces > maxUnits) {
      return
    }
    const filtered = state.unitBreakers.filter(b => !(b.phase === phase && b.amperage === amperage))
    const updated: UnitBreaker[] = quantity > 0
      ? [...filtered, { phase, amperage, quantity }]
      : filtered
    onChange({ unitBreakers: updated })
  }

  const sumPhase = (phase: Phase) =>
    state.unitBreakers.filter(b => b.phase === phase).reduce((s, b) => s + b.quantity, 0)

  const totalUnidades = getTotalSpaces()
  const maxUnits = state.material === 'aluminio' ? state.aluminiumMeters : state.material === 'policarbonato' ? state.policarbonatoMeters : null
  const canAdvance = totalUnidades > 0

  const phases: Phase[] = ['mono', 'bi', 'tri']

  return (
    <div className="qm-wizard-card">
      <div className="qm-wizard-header">
        <div className="qm-step-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-4 0v2M12 12v4" /></svg>
          Etapa 2 de 3
        </div>
        <h2>Disjuntores das unidades</h2>
        <p>Selecione os disjuntores e informe a quantidade de cada tipo</p>
      </div>

      <div className="qm-progress-bar">
        <div className="qm-progress-fill" style={{ width: '66%' }} />
      </div>

      <div className="qm-resumo-bar">
        {phases.map((phase) => (
          <div key={phase} className="qm-resumo-item">
            <div className={`qm-resumo-dot ${PHASE_COLORS[phase]}`} />
            <span className="qm-resumo-label">{PHASE_LABELS[phase].substring(0, 4)}:</span>
            <span className="qm-resumo-val">{sumPhase(phase)}</span>
          </div>
        ))}
        <div className="qm-resumo-item qm-resumo-total">
          <span className="qm-resumo-label">Total:</span>
          <span className="qm-resumo-val">{totalUnidades}</span>
        </div>
      </div>

      {maxUnits !== null && totalUnidades >= maxUnits && (
        <div className="qm-info-box warning">
          Máximo de {maxUnits} unidades atingido para {state.material === 'aluminio' ? 'alumínio' : 'policarbonato'}.
        </div>
      )}

      {phases.map((phase) => (
        <div key={phase} className="qm-phase-block">
          <div className="qm-phase-header">
            <span className={`qm-phase-badge ${phase}`}>{PHASE_LABELS[phase].toUpperCase()}</span>
            <span className="qm-phase-title">{PHASE_POLES[phase]}</span>
            <span className="qm-phase-desc">
              {UNIT_BREAKERS[phase][0]}A – {UNIT_BREAKERS[phase][UNIT_BREAKERS[phase].length - 1]}A
            </span>
          </div>
          <div className="qm-phase-body">
            {UNIT_BREAKERS[phase].map((amp) => {
              const qty = getQty(phase, amp)
              const breakerSpace = getBreakerSpace(phase, amp)
              const availableSpace = maxUnits === null ? Infinity : maxUnits - totalUnidades
              const canAdd = availableSpace >= breakerSpace
              const canStart = availableSpace >= breakerSpace
              return (
                <div
                  key={amp}
                  className={`qm-amp-chip ${qty > 0 ? 'active' : ''}`}
                  onClick={() => { if (qty === 0 && canStart) setQty(phase, amp, 1) }}
                >
                  <span className="qm-amp-label">{amp} A</span>
                  <div className="qm-amp-controls" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="qm-qty-btn"
                      onClick={() => setQty(phase, amp, Math.max(0, qty - 1))}
                    >−</button>
                    <span className="qm-qty-val">{qty}</span>
                    <button
                      type="button"
                      className="qm-qty-btn"
                      disabled={!canAdd}
                      onClick={() => setQty(phase, amp, qty + 1)}
                    >+</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="qm-nav-btns">
        <button type="button" className="qm-btn-back" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Voltar
        </button>
        <button
          type="button"
          className="qm-btn-primary"
          disabled={!canAdvance}
          onClick={onNext}
        >
          Próxima etapa
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  )
}
