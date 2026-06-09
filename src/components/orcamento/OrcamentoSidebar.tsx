import React from 'react'
import { OrcamentoState } from './types'

interface Step {
  number: number
  label: string
  desc: string
}

const STEPS: Step[] = [
  { number: 1, label: 'Disjuntor Geral', desc: 'Material e amperagem do DJ geral (50A–450A)' },
  { number: 2, label: 'Disjuntores das Unidades', desc: 'Mono, Bi e Trifásico com quantidade' },
  { number: 3, label: 'Classe do DPS', desc: 'DPS Classe I/II ou Classe II' },
]

interface Props {
  currentStep: number
  state: OrcamentoState
}

export function OrcamentoSidebar({ currentStep, state }: Props) {
  const meters = state.material === 'policarbonato' ? state.policarbonatoMeters : state.aluminiumMeters
  const step1Desc = state.mainBreakerAmperage
    ? `DJ Geral ${state.mainBreakerAmperage}A · ${state.material === 'policarbonato' ? 'Policarbonato' : 'Alumínio'}${meters ? ` · ${meters} medidor${meters > 1 ? 'es' : ''}` : ''}`
    : 'Material e amperagem do DJ geral (50A–450A)'

  const totalUnidades = state.unitBreakers.reduce((s, b) => s + b.quantity, 0)
  const step2Desc = totalUnidades > 0
    ? `${totalUnidades} unidade${totalUnidades > 1 ? 's' : ''} configurada${totalUnidades > 1 ? 's' : ''}`
    : 'Mono, Bi e Trifásico com quantidade'

  const descs = [step1Desc, step2Desc, 'DPS Classe I/II ou Classe II']

  return (
    <aside className="qm-sidebar">
      <div className="qm-logo-box">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="7" fill="#2A5AAE" />
          <rect x="4" y="4" width="20" height="20" rx="3" fill="none" stroke="#F26522" strokeWidth="1.5" />
          <rect x="7" y="8" width="5" height="7" rx="1" fill="white" opacity="0.9" />
          <rect x="13" y="8" width="5" height="7" rx="1" fill="white" opacity="0.9" />
          <rect x="7" y="17" width="11" height="2" rx="1" fill="#F26522" />
        </svg>
        <span className="qm-logo-text">QM<span>Orçamentos</span></span>
      </div>

      <p className="qm-sidebar-title">Quadros de Medição</p>

      <div className="qm-steps">
        {STEPS.map((step) => {
          const isDone = currentStep > step.number
          const isActive = currentStep === step.number
          return (
            <div key={step.number} className={`qm-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
              <div className={`qm-step-num ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                {isDone ? '✓' : step.number}
              </div>
              <div className="qm-step-info">
                <div className={`qm-step-label ${isDone ? 'done' : ''}`}>{step.label}</div>
                <div className="qm-step-desc">{descs[step.number - 1]}</div>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
