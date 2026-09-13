import { useState, type FormEvent } from 'react'
import type { Bill, Person, Purchase, Revenue } from '../../domain/finance/types'

export type TransactionKind = 'receitas' | 'contas' | 'compras'
type Transaction = Revenue | Bill | Purchase

type TransactionFormProps = {
  kind: TransactionKind
  onSubmit: (transaction: Transaction) => void
}

const people: Person[] = ['Você', 'Sua mulher']

export function TransactionForm({ kind, onSubmit }: TransactionFormProps) {
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [person, setPerson] = useState<Person>('Você')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<Bill['status']>('pendente')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!description.trim() || !value || Number(value) <= 0) return

    if (kind === 'receitas') {
      onSubmit({ desc: description.trim(), valor: Number(value), quem: person })
    } else if (kind === 'contas') {
      onSubmit({ nome: description.trim(), valor: Number(value), venc: date, resp: person, status })
    } else {
      onSubmit({ produto: description.trim(), valor: Number(value), quem: person, data: date })
    }

    setDescription('')
    setValue('')
    setDate('')
  }

  const descriptionLabel = kind === 'receitas' ? 'Descrição' : kind === 'contas' ? 'Nome da conta' : 'Produto'
  const dateLabel = kind === 'contas' ? 'Vencimento' : 'Data da compra'

  return (
    <form className="transaction-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor={`${kind}-description`}>{descriptionLabel}</label>
        <input id={`${kind}-description`} onChange={(event) => setDescription(event.target.value)} placeholder={descriptionLabel} value={description} />
      </div>
      <div className="field">
        <label htmlFor={`${kind}-value`}>Valor</label>
        <input id={`${kind}-value`} min="0.01" onChange={(event) => setValue(event.target.value)} placeholder="R$ 0,00" step="0.01" type="number" value={value} />
      </div>
      <div className="field">
        <label htmlFor={`${kind}-person`}>{kind === 'contas' ? 'Responsável' : 'Pessoa'}</label>
        <select id={`${kind}-person`} onChange={(event) => setPerson(event.target.value as Person)} value={person}>
          {people.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      {kind !== 'receitas' && (
        <div className="field">
          <label htmlFor={`${kind}-date`}>{dateLabel}</label>
          <input id={`${kind}-date`} onChange={(event) => setDate(event.target.value)} type="date" value={date} />
        </div>
      )}
      {kind === 'contas' && (
        <div className="field">
          <label htmlFor="contas-status">Status</label>
          <select id="contas-status" onChange={(event) => setStatus(event.target.value as Bill['status'])} value={status}>
            <option value="pendente">Pendente</option>
            <option value="paga">Paga</option>
          </select>
        </div>
      )}
      <button className="button primary" type="submit">Adicionar lançamento</button>
    </form>
  )
}