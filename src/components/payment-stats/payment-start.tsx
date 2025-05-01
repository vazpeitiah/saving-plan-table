import { formatCurrency } from '../../utils/helpers'
import { Option } from '../../utils/types'
import { nanoid } from 'nanoid'

interface PaymentStatsProps {
  stats: Option<number>[]
}

const PaymentStats = ({ stats }: PaymentStatsProps) => {
  return (
    <div className="stats">
      {stats.map((stat) => (
        <div className="stat place-items-start" key={nanoid()}>
          <div className="stat-title">{stat.label}</div>
          <div className="stat-value text-2xl">
            {formatCurrency(stat.value)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PaymentStats
