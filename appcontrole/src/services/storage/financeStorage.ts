import type {
  Bill,
  FinanceData,
  MonthKey,
  MonthlyData,
  Purchase,
  Revenue,
} from '../../domain/finance/types'
import { emptyMonth } from '../../domain/finance/types'

const DATA_KEY = 'minhas_financas_v1'
const MONTH_KEY = 'minhas_financas_mes'
const MONTHS: MonthKey[] = ['2026-08', '2026-09']

type LegacyData = {
  receitas?: Revenue[]
  contas?: Bill[]
  compras?: Purchase[]
}

const isMonthKey = (value: string | null): value is MonthKey =>
  value !== null && MONTHS.includes(value as MonthKey)

const ensureMonths = (data: Partial<FinanceData>): FinanceData => ({
  meses: {
    '2026-08': data.meses?.['2026-08'] ?? emptyMonth(),
    '2026-09': data.meses?.['2026-09'] ?? emptyMonth(),
  },
})

const readStoredData = (): FinanceData => {
  try {
    const stored = JSON.parse(localStorage.getItem(DATA_KEY) ?? 'null') as
      | (FinanceData & LegacyData)
      | null

    if (stored?.meses) return ensureMonths(stored)

    return {
      meses: {
        '2026-08': emptyMonth(),
        '2026-09': {
          receitas: Array.isArray(stored?.receitas) ? stored.receitas : [],
          contas: Array.isArray(stored?.contas) ? stored.contas : [],
          compras: Array.isArray(stored?.compras) ? stored.compras : [],
        },
      },
    }
  } catch {
    return {
      meses: {
        '2026-08': emptyMonth(),
        '2026-09': emptyMonth(),
      },
    }
  }
}

export const loadFinanceData = (): FinanceData => {
  const data = readStoredData()
  localStorage.setItem(DATA_KEY, JSON.stringify(data))
  return data
}

export const loadSelectedMonth = (): MonthKey => {
  const storedMonth = localStorage.getItem(MONTH_KEY)
  return isMonthKey(storedMonth) ? storedMonth : '2026-09'
}

export const saveFinanceData = (data: FinanceData, month: MonthKey): void => {
  localStorage.setItem(DATA_KEY, JSON.stringify(data))
  localStorage.setItem(MONTH_KEY, month)
}

export const getMonthData = (data: FinanceData, month: MonthKey): MonthlyData =>
  data.meses[month]