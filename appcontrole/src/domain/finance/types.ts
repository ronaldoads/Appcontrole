export type MonthKey = '2026-08' | '2026-09'

export type Page = 'inicio' | 'receitas' | 'contas' | 'compras' | 'relatorios'

export type Person = 'Você' | 'Sua mulher'

export type Revenue = {
  desc: string
  valor: number
  quem: Person
}

export type Bill = {
  nome: string
  valor: number
  venc: string
  resp: Person
  status: 'paga' | 'pendente'
}

export type Purchase = {
  produto: string
  valor: number
  quem: Person
  data: string
}

export type MonthlyData = {
  receitas: Revenue[]
  contas: Bill[]
  compras: Purchase[]
}

export type FinanceData = {
  meses: Record<MonthKey, MonthlyData>
}

export const MONTHS: Record<MonthKey, string> = {
  '2026-08': 'Agosto 2026',
  '2026-09': 'Setembro 2026',
}

export const emptyMonth = (): MonthlyData => ({
  receitas: [],
  contas: [],
  compras: [],
})