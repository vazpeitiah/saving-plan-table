import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Payment, paymentSchema } from '../../utils/types'
import { getMonthsNames } from '../../utils/helpers'
import { useEffect } from 'react'
import { nanoid } from 'nanoid'

const defaultValues: Payment = {
  id: '',
  description: '',
  amount: 0,
  paymentMonth: 0,
  paymentHistory: [],
}

interface PaymentFormProps {
  onSubmit: (data: Payment) => void
  isEditing: boolean
  onCancel: () => void
  values?: Payment
}

const PaymentForm = ({
  onSubmit,
  isEditing,
  onCancel,
  values,
}: PaymentFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!values) return
    reset(values)
  }, [values, reset])

  const handleOnSubmit: SubmitHandler<Payment> = (data) => {
    if (!isEditing) {
      onSubmit({
        ...data,
        id: nanoid(),
        paymentHistory: new Array(12).fill(false),
      })
      return
    }
    onSubmit(data)
  }

  const handleOnCancel = () => {
    onCancel()
    reset(defaultValues)
  }

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Descripción</legend>
        <input
          type="text"
          placeholder="Descripción"
          className="input input-bordered w-full"
          {...register('description')}
        />
        <span className="label">
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}
        </span>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Monto</legend>
        <input
          type="number"
          placeholder="Monto"
          className="input input-bordered w-full"
          {...register('amount')}
        />
        <span className="label">
          {errors.amount && (
            <span className="text-red-500">{errors.amount.message}</span>
          )}
        </span>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Mes de pago</legend>
        <select className="select w-full" {...register('paymentMonth')}>
          {getMonthsNames().map((month, index) => (
            <option key={month.label} value={index}>
              {month.label}
            </option>
          ))}
        </select>
        <span className="label">
          {errors.paymentMonth && (
            <span className="text-red-500">{errors.paymentMonth.message}</span>
          )}
        </span>
      </fieldset>
      <div className="modal-action">
        <button className="btn" type="button" onClick={handleOnCancel}>
          Cancelar
        </button>
        <button className="btn btn-primary" type="submit">
          {isEditing ? 'Actualizar' : 'Agregar'}
        </button>
      </div>
    </form>
  )
}
export default PaymentForm
