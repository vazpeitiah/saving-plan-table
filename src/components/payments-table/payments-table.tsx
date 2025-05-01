import clsx from 'clsx'
import { formatCurrency, getMonthsNamesFromIndex } from '../../utils/helpers'
import { Payment } from '../../utils/types'

interface PaymentsTableProps {
  payment: Payment | null
  onUpdatePaymentHistory: (
    payment: Payment,
    index: number,
    value: boolean
  ) => void
}

function PaymentsTable({
  payment: selectedPayment,
  onUpdatePaymentHistory,
}: PaymentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="text-left">#</th>
            <th className="text-left">Mes</th>
            <th className="text-left">Ahorro mensual</th>
            <th className="text-left">Total acumulado</th>
            <th className="text-left">Pagado</th>
          </tr>
        </thead>
        <tbody>
          {selectedPayment &&
            getMonthsNamesFromIndex(selectedPayment.paymentMonth).map(
              (month, index, arr) => {
                const monthlyPayment = Math.round(selectedPayment.amount / 12)
                const totalAccumulated = monthlyPayment * (index + 1)
                const paymentMonthIndex = arr.findIndex(
                  (m) => m.value === new Date().getMonth()
                )

                return (
                  <tr
                    key={month.label}
                    className={clsx({
                      ['bg-base-200']: index <= paymentMonthIndex,
                    })}
                  >
                    <td>{index + 1}</td>
                    <td>{month.label}</td>
                    <td>{formatCurrency(monthlyPayment)}</td>
                    <td>{formatCurrency(totalAccumulated)}</td>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedPayment.paymentHistory[index] ?? false}
                        onChange={(e) =>
                          onUpdatePaymentHistory(
                            selectedPayment,
                            index,
                            e.target.checked
                          )
                        }
                      />
                    </td>
                  </tr>
                )
              }
            )}
        </tbody>
      </table>
    </div>
  )
}

export default PaymentsTable
