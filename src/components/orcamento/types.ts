export type MaterialType = 'policarbonato' | 'aluminio'
export type DpsClass = 'classe_i_ii' | 'classe_ii'
export type Phase = 'mono' | 'bi' | 'tri'

export interface UnitBreaker {
  phase: Phase
  amperage: number
  quantity: number
}

export interface OrcamentoState {
  material: MaterialType | null
  mainBreakerAmperage: number | null
  aluminiumMeters: number | null
  policarbonatoMeters: number | null
  unitBreakers: UnitBreaker[]
  dpsClass: DpsClass | null
  bdiPercent: number
}

export const MAIN_BREAKER_AMPERAGES = [50, 63, 70, 80, 90, 100, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450]

export const ALUMINUM_METERS = [2, 3, 4, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33]

export const UNIT_BREAKERS: Record<Phase, number[]> = {
  mono: [40, 50, 63],
  bi: [50, 63],
  tri: [40, 50, 63, 70, 80, 90, 100, 125],
}

export const PHASE_LABELS: Record<Phase, string> = {
  mono: 'Monofásico',
  bi: 'Bifásico',
  tri: 'Trifásico',
}

export const PHASE_POLES: Record<Phase, string> = {
  mono: '1 polo',
  bi: '2 polos',
  tri: '3 polos',
}

export function getBarramentoInfo(amperage: number): string {
  if (amperage <= 70) return 'CMR1 (até 70A)'
  if (amperage <= 200) return 'CMR2 (até 200A)'
  if (amperage <= 450) return 'CMQ (até 450A)'
  return 'Caixa Especial — Configuração acima de 250A'
}
