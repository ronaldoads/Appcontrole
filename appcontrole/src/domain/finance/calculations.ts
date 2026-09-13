import type { MonthlyData } from './types'

export const total = (items: { valor: number }[]): number =>
  items.reduce((sum, item) => sum + (Number(item.valor) || 0), 0)

export const getSummary = (data: MonthlyData) => {
  const recebimentos = total(data.receitas)
  const contasPagas = total(data.contas.filter((bill) => bill.status === 'paga'))
  const contas = total(data.contas)
  const compras = total(data.compras)

  return {
    recebimentos,
    gastos: contasPagas + compras,
    saldo: recebimentos - contasPagas - compras,
    contas,
    contasPagas,
    compras,
  }
}