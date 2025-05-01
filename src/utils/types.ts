import { z } from 'zod'

export const paymentSchema = z.object({
  id: z.string(),
  description: z.string().nonempty(),
  amount: z.coerce.number().positive(),
  paymentMonth: z.coerce.number().int().min(0).max(11),
  paymentHistory: z.boolean().array().min(0).max(12),
})

export type Payment = z.infer<typeof paymentSchema>

export type Option<T> = {
  label: string
  value: T
}
