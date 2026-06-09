import React from 'react'
import { OrcamentoState, MaterialType, MAIN_BREAKER_AMPERAGES, ALUMINUM_METERS, getBarramentoInfo } from './types'

interface Props {
  state: OrcamentoState
  onChange: (updates: Partial<OrcamentoState>) => void
  onNext: () => void
}

export function Etapa1({ state, onChange, onNext }: Props) {
  const canAdvance = state.material !== null && state.mainBreakerAmperage !== null && ((state.material === 'policarbonato' && state.policarbonatoMeters !== null) || (state.material === 'aluminio' && state.aluminiumMeters !== null))

  return (
    <div className="qm-wizard-card">
      <div className="qm-wizard-header">
        <div className="qm-step-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          Etapa 1 de 3
        </div>
        <h2>Material e Disjuntor Geral</h2>
        <p>Escolha o material da caixa e a amperagem do disjuntor geral</p>
      </div>

      <div className="qm-progress-bar">
        <div className="qm-progress-fill" style={{ width: '33%' }} />
      </div>

      <label className="qm-field-label">Material da caixa</label>
      <div className="qm-material-toggle">
        {(['policarbonato', 'aluminio'] as MaterialType[]).map((mat) => (
          <button
            key={mat}
            type="button"
            className={`qm-mat-opt ${state.material === mat ? 'selected' : ''}`}
            onClick={() => onChange({ material: mat })}
          >
            {mat === 'policarbonato' ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20h20M4 20V8l8-6 8 6v12" /><rect x="9" y="14" width="6" height="6" /></svg>
            )}
            <div className="qm-mat-name">{mat === 'policarbonato' ? 'Policarbonato' : 'Alumínio'}</div>
            <div className="qm-mat-desc">{mat === 'policarbonato' ? 'Leve e durável' : 'Resistente e profissional'}</div>
          </button>
        ))}
      </div>

      <div className="qm-field">
        <label className="qm-field-label">Disjuntor Geral</label>
        <div className="qm-select-wrap">
          <select
            value={state.mainBreakerAmperage ?? ''}
            onChange={(e) => onChange({ mainBreakerAmperage: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">Selecione a corrente...</option>
            {MAIN_BREAKER_AMPERAGES.map((amp) => (
              <option key={amp} value={amp}>{amp} A</option>
            ))}
          </select>
          <svg className="qm-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
        </div>
      </div>

      {state.material === 'aluminio' && (
        <div className="qm-field">
          <label className="qm-field-label">Quantidade de medições</label>
          <div className="qm-select-wrap">
            <select
              value={state.aluminiumMeters ?? ''}
              onChange={(e) => onChange({ aluminiumMeters: e.target.value ? Number(e.target.value) : null })}
            >
              <option value="">Selecione a quantidade...</option>
              {ALUMINUM_METERS.map((meter) => (
                <option key={meter} value={meter}>{meter} medidores</option>
              ))}
            </select>
            <svg className="qm-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
          </div>
        </div>
      )}

      {state.material === 'policarbonato' && (
        <div className="qm-field">
          <label className="qm-field-label">Quantidade de medições</label>
          <div className="qm-select-wrap">
            <input
              type="number"
              min="1"
              value={state.policarbonatoMeters ?? ''}
              onChange={(e) => onChange({ policarbonatoMeters: e.target.value ? Number(e.target.value) : null })}
              placeholder="Digite a quantidade..."
            />
          </div>
        </div>
      )}

      {state.mainBreakerAmperage && (
        <div className="qm-info-box">
          <strong>Barramento:</strong> {getBarramentoInfo(state.mainBreakerAmperage)}
        </div>
      )}

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
  )
}
