type SummaryCardProps = {
  label: string
  value: string
  tone: 'positive' | 'negative' | 'neutral'
}

export function SummaryCard({ label, value, tone }: SummaryCardProps) {
  return (
    <article className={`summary-card ${tone}`}>
      <span className="summary-label">{label}</span>
      <strong className="summary-value">{value}</strong>
    </article>
  )
}