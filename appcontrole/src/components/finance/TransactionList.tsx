import type { Bill, Purchase, Revenue } from '../../domain/finance/types'
import type { TransactionKind } from './TransactionForm'

type TransactionListProps = {
  kind: TransactionKind
  items: Revenue[] | Bill[] | Purchase[]
  onEdit?: (index: number) => void
  onDelete: (index: number) => void
}

const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export function TransactionList({ kind, items, onEdit, onDelete }: TransactionListProps) {
  if (!items.length) return <p className="empty">Nenhum registro ainda.</p>

  return (
    <div className="transaction-list">
      {[...items].reverse().map((item, reverseIndex) => {
        const index = items.length - 1 - reverseIndex
        const detail = kind === 'receitas'
          ? `${(item as Revenue).desc} · ${(item as Revenue).quem}`
          : kind === 'contas'
            ? `${(item as Bill).nome} · ${(item as Bill).resp}`
            : `${(item as Purchase).produto} · ${(item as Purchase).quem}`
        const secondary = kind === 'receitas'
          ? 'Receita'
          : kind === 'contas'
            ? `${(item as Bill).venc || 'Sem vencimento'} · ${(item as Bill).status}`
            : (item as Purchase).data || 'Sem data'

        return (
          <div className="transaction-row" key={`${detail}-${index}`}>
            <div>
              <strong>{detail}</strong>
              <small>{secondary}</small>
            </div>
            <strong>{money(item.valor)}</strong>
            {onEdit && <button className="button ghost" onClick={() => onEdit(index)} type="button">Editar</button>}
            <button className="button ghost" onClick={() => onDelete(index)} type="button">Excluir</button>
          </div>
        )
      })}
    </div>
  )
}