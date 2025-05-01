import { useEffect, useMemo, useRef } from 'react'
import { Payment } from './utils/types'
import PaymentForm from './components/payment-form/payment-form'
import Navbar from './components/navbar/navbar'
import PaymentsTable from './components/payments-table/payments-table'
import PaymentStats from './components/payment-stats/payment-start'
import { usePaymentsStore } from './stores/payments-store'
import PaymentControls from './components/payment-controls/payment-controls'

function App() {
  const modalRef = useRef<HTMLDialogElement>(null)

  const {
    payments,
    setPayments,
    isEditing,
    setIsEditing,
    selectedPaymentIndex,
    setSelectedPaymentIndex,
  } = usePaymentsStore()

  const selectedPayment: Payment | null = useMemo(() => {
    if (selectedPaymentIndex === null) return null
    return payments[selectedPaymentIndex]
  }, [selectedPaymentIndex, payments])

  const stats = useMemo(() => {
    const amount = Number(selectedPayment?.amount ?? 0)
    const monthlyPayment = Math.round(amount / 12)
    const monthsPaid =
      selectedPayment?.paymentHistory.filter((history) => history).length ?? 0
    const amountPaid = monthlyPayment * monthsPaid
    const amountLeft = amount - amountPaid

    return {
      amount,
      monthlyPayment,
      monthsPaid,
      amountPaid,
      amountLeft,
    }
  }, [selectedPayment])

  useEffect(() => {
    if (payments.length === 0) return
    setSelectedPaymentIndex(0)
  }, [])

  useEffect(() => {
    if (!modalRef.current) return
    const handleClose = () => {
      setIsEditing(false)
    }
    modalRef.current.addEventListener('close', handleClose)
  }, [modalRef])

  const openAddModal = () => {
    modalRef?.current?.showModal()
  }

  const openEditModal = () => {
    if (!selectedPayment) return
    setIsEditing(true)
    modalRef?.current?.showModal()
  }

  const handleAddPayment = (data: Payment) => {
    setPayments([...payments, data])
    setSelectedPaymentIndex(payments.length)
    modalRef?.current?.close()
  }

  const handleEditPayment = (id: Payment['id'], data: Payment) => {
    setPayments(payments.map((payment) => (payment.id === id ? data : payment)))
    modalRef?.current?.close()
  }

  const handleUpdatePaymentHistory = (
    data: Payment,
    updatedIndex: number,
    checked: boolean
  ) => {
    const updatedHistory = data.paymentHistory.map((history, index) => {
      if (index === updatedIndex) {
        return checked
      }
      return history
    })
    handleEditPayment(data.id, {
      ...data,
      paymentHistory: updatedHistory,
    })
  }

  return (
    <>
      <dialog className="modal" ref={modalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {isEditing
              ? 'Actualizar pago acumulado'
              : 'Agregar nuevo pago acumulado'}
          </h3>
          <PaymentForm
            isEditing={isEditing}
            onCancel={() => modalRef?.current?.close()}
            values={isEditing && selectedPayment ? selectedPayment : undefined}
            onSubmit={(data) => {
              if (isEditing) {
                handleEditPayment(data.id, data)
                return
              }
              handleAddPayment(data)
            }}
          />
        </div>
      </dialog>
      <Navbar />
      <div className="mx-auto max-w-4xl p-6 flex flex-col gap-6">
        <PaymentControls
          onAddPayment={openAddModal}
          onEditPayment={openEditModal}
        />
        <PaymentStats
          stats={[
            {
              label: 'Saldo Mensual',
              value: stats.monthlyPayment,
            },
            {
              label: 'Saldo Pagado',
              value: stats.amountPaid,
            },
            {
              label: 'Saldo Restante',
              value: stats.amountLeft,
            },
            {
              label: 'Saldo Total',
              value: stats.amount,
            },
          ]}
        />
        <PaymentsTable
          payment={selectedPayment}
          onUpdatePaymentHistory={handleUpdatePaymentHistory}
        />
      </div>
    </>
  )
}

export default App
