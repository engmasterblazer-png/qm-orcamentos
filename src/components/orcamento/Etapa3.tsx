import React from 'react'
import { OrcamentoState, DpsClass } from './types'

interface Props {
  state: OrcamentoState
  onChange: (updates: Partial<OrcamentoState>) => void
  onSubmit: () => void
  onBack: () => void
  isLoading?: boolean
}

const DPS_OPTIONS: { value: DpsClass; label: string; desc: string; detail: string }[] = [
  {
    value: 'classe_i_ii',
    label: 'DPS Classe I/II',
    desc: 'Proteção combinada',
    detail: 'Indicado para instalações expostas a descargas atmosféricas diretas ou indiretas. Proteção completa contra surtos de alta energia.',
  },
  {
    value: 'classe_ii',
    label: 'DPS Classe II',
    desc: 'Proteção padrão',
    detail: 'Indicado para proteção de equipamentos contra surtos de comutação. Instalação em quadros de distribuição.',
  },
]

export function Etapa3({ state, onChange, onSubmit, onBack, isLoading }: Props) {
  const canSubmit = state.dpsClass !== null

  return (
    <div className="qm-wizard-card">
      <div className="qm-wizard-header">
        <div className="qm-step-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Etapa 3 de 3
        </div>
        <h2>Classe do DPS</h2>
        <p>Selecione a classe do Dispositivo de Proteção contra Surtos</p>
      </div>

      <div className="qm-progress-bar">
        <div className="qm-progress-fill" style={{ width: '100%' }} />
      </div>

      <div className="qm-dps-options">
        {DPS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`qm-dps-opt ${state.dpsClass === opt.value ? 'selected' : ''}`}
            onClick={() => onChange({ dpsClass: opt.value })}
          >
            <div className="qm-dps-opt-header">
              <div className="qm-dps-radio">
                {state.dpsClass === opt.value && <div className="qm-dps-radio-dot" />}
              </div>
              <div>
                <div className="qm-dps-label">{opt.label}</div>
                <div className="qm-dps-desc">{opt.desc}</div>
              </div>
            </div>
            <p className="qm-dps-detail">{opt.detail}</p>
          </button>
        ))}
      </div>

      <div className="qm-field">
        <label className="qm-field-label" htmlFor="bdi-input">Fator / BDI (%)</label>
        <div className="qm-select-wrap">
          <input
            id="bdi-input"
            type="number"
            min="0"
            step="0.1"
            value={state.bdiPercent}
            onChange={(event) => onChange({ bdiPercent: Number(event.target.value) || 0 })}
          />
        </div>
        <p className="qm-field-hint">Digite um percentual para acrescentar ao valor do quadro orçado.</p>
      </div>

      <div className="qm-resumo-final">
        <p className="qm-resumo-final-title">Resumo do orçamento</p>
        <div className="qm-resumo-final-grid">
          <div className="qm-resumo-final-item">
            <span className="qm-resumo-final-label">Material</span>
            <span className="qm-resumo-final-val">
              {state.material === 'policarbonato' ? 'Policarbonato' : 'Alumínio'}
            </span>
          </div>
          <div className="qm-resumo-final-item">
            <span className="qm-resumo-final-label">DJ Geral</span>
            <span className="qm-resumo-final-val">{state.mainBreakerAmperage} A</span>
          </div>
          <div className="qm-resumo-final-item">
            <span className="qm-resumo-final-label">Unidades</span>
            <span className="qm-resumo-final-val">
              {state.unitBreakers.reduce((s, b) => s + b.quantity, 0)} medidores
            </span>
          </div>
          <div className="qm-resumo-final-item">
            <span className="qm-resumo-final-label">DPS</span>
            <span className="qm-resumo-final-val">
              {state.dpsClass === 'classe_i_ii' ? 'Classe I/II' : state.dpsClass === 'classe_ii' ? 'Classe II' : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="qm-nav-btns">
        <button type="button" className="qm-btn-back" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Voltar
        </button>
        <button
          type="button"
          className="qm-btn-primary"
          disabled={!canSubmit || isLoading}
          onClick={onSubmit}
        >
          {isLoading ? 'Calculando...' : 'Gerar orçamento'}
          {!isLoading && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
          )}
        </button>
      </div>
    </div>
  )
}
