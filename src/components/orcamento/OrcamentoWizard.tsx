import React, { useState } from 'react'
import { OrcamentoSidebar } from './OrcamentoSidebar'
import { Etapa1 } from './Etapa1'
import { Etapa2 } from './Etapa2'
import { Etapa3 } from './Etapa3'
import { OrcamentoState } from './types'
import './orcamento.css'

const INITIAL_STATE: OrcamentoState = {
  material: null,
  mainBreakerAmperage: null,
  aluminiumMeters: null,
  policarbonatoMeters: null,
  unitBreakers: [],
  dpsClass: null,
  bdiPercent: 0,
}

interface Props {
  onSubmit?: (state: OrcamentoState) => Promise<void>
}

export function OrcamentoWizard({ onSubmit }: Props) {
  const [step, setStep] = useState(1)
  const [state, setState] = useState<OrcamentoState>(INITIAL_STATE)
  const [isLoading, setIsLoading] = useState(false)

  const update = (updates: Partial<OrcamentoState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  const handleSubmit = async () => {
    if (!onSubmit) return
    setIsLoading(true)
    try {
      await onSubmit(state)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="qm-page">
      <OrcamentoSidebar currentStep={step} state={state} />
      <main className="qm-main">
        <div className="qm-top-bar" />
        {step === 1 && (
          <Etapa1
            state={state}
            onChange={update}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Etapa2
            state={state}
            onChange={update}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Etapa3
            state={state}
            onChange={update}
            onSubmit={handleSubmit}
            onBack={() => setStep(2)}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  )
}
