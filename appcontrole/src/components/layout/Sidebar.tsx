import type { Page } from '../../domain/finance/types'

type SidebarProps = {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const navigation: { page: Page; label: string; icon: string }[] = [
  { page: 'inicio', label: 'Início', icon: '⌂' },
  { page: 'receitas', label: 'Receitas', icon: '＋' },
  { page: 'contas', label: 'Contas', icon: '▣' },
  { page: 'compras', label: 'Compras', icon: '▤' },
  { page: 'relatorios', label: 'Relatórios', icon: '◒' },
]

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">$</span>
        <span>Minhas Finanças</span>
      </div>
      <nav aria-label="Navegação principal" className="nav">
        {navigation.map((item) => (
          <button
            className={currentPage === item.page ? 'nav-item active' : 'nav-item'}
            key={item.page}
            onClick={() => onNavigate(item.page)}
            type="button"
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}