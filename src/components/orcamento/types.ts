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
  if (amperage <= 63) return '9,52 × 3,17 mm → 73 A'
  if (amperage <= 70) return '12,70 × 3,17 mm → 97 A'
  if (amperage <= 125) return '12,70 × 4,76 mm → 140 A'
  if (amperage <= 150) return '15,87 × 4,76 mm → 175 A'
  if (amperage <= 225) return '22,22 × 4,76 mm → 246 A'
  if (amperage <= 300) return '31,75 × 4,76 mm → 350 A'
  if (amperage <= 350) return '31,75 × 6,35 mm → 450 A'
  return '31,75 × 7,94 mm → 550 A'
}
