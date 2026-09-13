import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { SummaryCard } from './components/finance/SummaryCard'
import { TransactionForm, type TransactionKind } from './components/finance/TransactionForm'
import { TransactionList } from './components/finance/TransactionList'
import { getSummary } from './domain/finance/calculations'
import type { Bill, FinanceData, MonthKey, Page, Purchase, Revenue } from './domain/finance/types'
import { MONTHS } from './domain/finance/types'
import { getMonthData, loadFinanceData, loadSelectedMonth, saveFinanceData } from './services/storage/financeStorage'
import './App.css'

const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

function App() {
  const [data, setData] = useState<FinanceData>(loadFinanceData)
  const [month, setMonth] = useState<MonthKey>(loadSelectedMonth)
  const [page, setPage] = useState<Page>('inicio')
  const [darkMode, setDarkMode] = useState(false)
  const currentData = getMonthData(data, month)
  const summary = getSummary(currentData)

  const updateData = (nextData: FinanceData) => {
    setData(nextData)
    saveFinanceData(nextData, month)
  }

  const addTransaction = (kind: TransactionKind, transaction: Revenue | Bill | Purchase) => {
    const nextData: FinanceData = {
      meses: {
        ...data.meses,
        [month]: { ...currentData, [kind]: [...currentData[kind], transaction] },
      },
    }
    updateData(nextData)
  }

  const deleteTransaction = (kind: TransactionKind, index: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este lançamento?')) return
    const nextData: FinanceData = {
      meses: {
        ...data.meses,
        [month]: { ...currentData, [kind]: currentData[kind].filter((_, itemIndex) => itemIndex !== index) },
      },
    }
    updateData(nextData)
  }

  const editTransaction = (kind: TransactionKind, index: number) => {
    const item = currentData[kind][index]
    let nextItem: Revenue | Bill | Purchase

    if (kind === 'receitas') {
      const revenue = item as Revenue
      const desc = window.prompt('Descrição:', revenue.desc)
      const value = desc === null ? null : window.prompt('Valor:', String(revenue.valor))
      const person = value === null ? null : window.prompt('Quem recebeu?', revenue.quem)
      if (desc === null || value === null || person === null || !desc.trim() || !value || Number(value) <= 0) return
      nextItem = { desc: desc.trim(), valor: Number(value), quem: person.trim() as Revenue['quem'] }
    } else if (kind === 'contas') {
      const bill = item as Bill
      const name = window.prompt('Nome da conta:', bill.nome)
      const value = name === null ? null : window.prompt('Valor:', String(bill.valor))
      const dueDate = value === null ? null : window.prompt('Vencimento (AAAA-MM-DD):', bill.venc)
      const person = dueDate === null ? null : window.prompt('Responsável:', bill.resp)
      const status = person === null ? null : window.prompt('Status (paga ou pendente):', bill.status)
      if (name === null || value === null || dueDate === null || person === null || status === null || !name.trim() || !value || Number(value) <= 0) return
      nextItem = { nome: name.trim(), valor: Number(value), venc: dueDate.trim(), resp: person.trim() as Bill['resp'], status: status.trim().toLowerCase() === 'paga' ? 'paga' : 'pendente' }
    } else {
      const purchase = item as Purchase
      const product = window.prompt('Produto:', purchase.produto)
      const value = product === null ? null : window.prompt('Valor:', String(purchase.valor))
      const person = value === null ? null : window.prompt('Quem comprou?', purchase.quem)
      const date = person === null ? null : window.prompt('Data (AAAA-MM-DD):', purchase.data)
      if (product === null || value === null || person === null || date === null || !product.trim() || !value || Number(value) <= 0) return
      nextItem = { produto: product.trim(), valor: Number(value), quem: person.trim() as Purchase['quem'], data: date.trim() }
    }

    const nextData: FinanceData = {
      meses: {
        ...data.meses,
        [month]: { ...currentData, [kind]: currentData[kind].map((entry, itemIndex) => itemIndex === index ? nextItem : entry) },
      },
    }
    updateData(nextData)
  }

  const changeMonth = (nextMonth: MonthKey) => {
    setMonth(nextMonth)
    saveFinanceData(data, nextMonth)
  }

  const pageTitle: Record<Page, string> = {
    inicio: 'Resumo do mês',
    receitas: 'Receitas',
    contas: 'Contas',
    compras: 'Compras',
    relatorios: 'Relatórios',
  }

  const renderTransactions = (kind: TransactionKind, title: string) => (
    <section className="panel">
      <div className="panel-heading"><div><span className="eyebrow">Lançamentos</span><h2>{title}</h2></div></div>
      <TransactionForm kind={kind} onSubmit={(transaction) => addTransaction(kind, transaction)} />
      <TransactionList kind={kind} items={currentData[kind]} onDelete={(index) => deleteTransaction(kind, index)} onEdit={(index) => editTransaction(kind, index)} />
    </section>
  )

  const renderContent = () => {
    if (page === 'inicio') return <Dashboard data={currentData} summary={summary} />
    if (page === 'relatorios') return <Reports summary={summary} />
    return renderTransactions(page, pageTitle[page])
  }

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <Sidebar currentPage={page} onNavigate={setPage} />
      <main className="main-content">
        <header className="topbar">
          <div><span className="eyebrow">Controle doméstico</span><h1>{pageTitle[page]}</h1></div>
          <div className="header-actions">
            <label className="sr-only" htmlFor="month">Mês selecionado</label>
            <select id="month" onChange={(event) => changeMonth(event.target.value as MonthKey)} value={month}>
              {Object.entries(MONTHS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
            <button aria-pressed={darkMode} className="button theme-toggle" onClick={() => setDarkMode((current) => !current)} type="button">
              {darkMode ? 'Modo claro' : 'Modo escuro'}
            </button>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  )
}

function Dashboard({ data, summary }: { data: ReturnType<typeof getMonthData>; summary: ReturnType<typeof getSummary> }) {
  return <>
    <section className="summary-grid">
      <SummaryCard label="Recebemos" tone="positive" value={money(summary.recebimentos)} />
      <SummaryCard label="Gastamos" tone="negative" value={money(summary.gastos)} />
      <SummaryCard label="Disponível" tone="neutral" value={money(summary.saldo)} />
    </section>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-heading"><div><span className="eyebrow">Visão rápida</span><h2>Contas recentes</h2></div></div><TransactionList kind="contas" items={data.contas.slice(-5)} onDelete={() => undefined} /></section>
      <section className="panel"><div className="panel-heading"><div><span className="eyebrow">Visão rápida</span><h2>Compras recentes</h2></div></div><TransactionList kind="compras" items={data.compras.slice(-5)} onDelete={() => undefined} /></section>
    </div>
  </>
}

function Reports({ summary }: { summary: ReturnType<typeof getSummary> }) {
  return <section className="panel report-panel">
    <div className="panel-heading"><div><span className="eyebrow">Análise</span><h2>Resumo financeiro</h2></div></div>
    <div className="report-row"><span>Total recebido</span><strong>{money(summary.recebimentos)}</strong></div>
    <div className="report-row"><span>Total de contas</span><strong>{money(summary.contas)}</strong></div>
    <div className="report-row"><span>Total de compras</span><strong>{money(summary.compras)}</strong></div>
    <div className="report-row emphasis"><span>Saldo disponível</span><strong>{money(summary.saldo)}</strong></div>
  </section>
}

export default App
