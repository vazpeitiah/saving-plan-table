import { Option, Payment, paymentSchema } from '../utils/types'

export const upperFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getMonthsNames = (): Option<number>[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    label: upperFirst(
      new Intl.DateTimeFormat('es-MX', {
        month: 'long',
      }).format(new Date(2000, i, 1))
    ),
    value: i,
  }))
}

export const getMonthsNamesFromIndex = (startIndex: number) => {
  const months = getMonthsNames()
  return months.slice(startIndex).concat(months.slice(0, startIndex))
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
}

export const isBeforeToday = (month: number, startedMonth: number) => {
  const isFromNextYear = startedMonth !== 0 && month < startedMonth
  const currentYear = new Date().getFullYear()
  const date = new Date(
    isFromNextYear ? currentYear + 1 : currentYear,
    month,
    1
  )
  return date < new Date()
}

export const formatMonthLabel = (
  month: Option<number>,
  startedMonth: number
) => {
  const currentMonth = new Date().getMonth()
  const isFromNextYear =
    month.value < startedMonth && month.value > currentMonth
  const isFromPreviousYear =
    month.value > startedMonth && month.value < currentMonth
  const currentYear = new Date().getFullYear()
  if (isFromPreviousYear) {
    return month.label + ' ' + (currentYear - 1)
  }
  return !isFromNextYear ? month.label : month.label + ' ' + (currentYear + 1)
}

export const downloadJsonToFile = <T>(data: T) => {
  try {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `data-${new Date().toISOString()}.json`
    link.click()

    URL.revokeObjectURL(url)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error downloading JSON file:', error)
  }
}

export const importPaymentsFromFile = async (
  file: File
): Promise<Payment[]> => {
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    return paymentSchema.array().parse(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error al importar pagos:', error)
    return []
  }
}
