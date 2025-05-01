import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Payment } from '../utils/types'

interface PaymentsStore {
  payments: Payment[]
  setPayments: (payments: Payment[]) => void
  selectedPaymentIndex: number | null
  setSelectedPaymentIndex: (index: number | null) => void
  isOpenModal: boolean
  setIsOpenModal: (isOpen: boolean) => void
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}

export const usePaymentsStore = create<PaymentsStore>()(
  persist(
    (set) => ({
      payments: [],
      setPayments: (payments) => set({ payments }),
      selectedPaymentIndex: null,
      setSelectedPaymentIndex: (index) => set({ selectedPaymentIndex: index }),
      isOpenModal: false,
      setIsOpenModal: (isOpen) => set({ isOpenModal: isOpen }),
      isEditing: false,
      setIsEditing: (isEditing) => set({ isEditing }),
    }),
    {
      name: 'payments-store',
      partialize: (state) => ({ payments: state.payments }),
    }
  )
)
