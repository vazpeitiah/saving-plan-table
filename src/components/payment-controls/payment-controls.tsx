import { Download, Pencil, Plus, Trash, Upload } from 'lucide-react'
import { usePaymentsStore } from '../../stores/payments-store'
import { Payment } from '../../utils/types'
import { downloadJsonToFile, importPaymentsFromFile } from '../../utils/helpers'
import { useRef } from 'react'

interface PaymentControlsProps {
  onAddPayment: () => void
  onEditPayment: () => void
}

const PaymentControls = ({
  onAddPayment,
  onEditPayment,
}: PaymentControlsProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    selectedPaymentIndex,
    payments,
    setSelectedPaymentIndex,
    setPayments,
  } = usePaymentsStore()
  const selectedPayment: Payment | null =
    selectedPaymentIndex !== null ? payments[selectedPaymentIndex] : null

  const handleDeletePayment = () => {
    if (!selectedPayment) return
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el pago "${selectedPayment.description}"?`
    )
    if (!confirmDelete) return
    setPayments(
      payments.filter(
        (payment) => payment.description !== selectedPayment.description
      )
    )
    setSelectedPaymentIndex(payments.length > 1 ? 0 : null)
  }

  const handleUploadPayments = () => {
    downloadJsonToFile(payments)
  }

  const handleImportPayments = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    const paymentsFromFile = await importPaymentsFromFile(file)
    setPayments(paymentsFromFile)
  }

  return (
    <div className="flex items-center gap-4 justify-end">
      <input
        type="file"
        accept="application/json"
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
      />
      <div className="flex items-center gap-3">
        <label htmlFor="payment" className="label text-sm">
          Selecciona un pago:
        </label>
        <select
          id="payment"
          className="select select-sm"
          value={selectedPayment?.id ?? ''}
          onChange={(e) => {
            const selectedId = e.target.value
            const selectedIndex = payments.findIndex(
              (payment) => payment.id === selectedId
            )
            setSelectedPaymentIndex(selectedIndex >= 0 ? selectedIndex : null)
          }}
        >
          <option value="" disabled>
            Selecciona un pago
          </option>
          {payments.map((payment) => (
            <option key={payment.id} value={payment.id}>
              {payment.description}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-circle btn-sm" onClick={onAddPayment}>
        <Plus className="size-4" />
      </button>
      <button className="btn btn-circle btn-sm" onClick={onEditPayment}>
        <Pencil className="size-4" />
      </button>
      <button className="btn btn-circle btn-sm" onClick={handleDeletePayment}>
        <Trash className="size-4" />
      </button>
      <button className="btn btn-circle btn-sm" onClick={handleImportPayments}>
        <Upload className="size-4" />
      </button>
      <button className="btn btn-circle btn-sm" onClick={handleUploadPayments}>
        <Download className="size-4" />
      </button>
    </div>
  )
}
export default PaymentControls
