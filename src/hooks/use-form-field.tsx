import { useId } from 'react'
import { useFieldContext } from '@/context/form-context'
import { FieldLabels, FieldState } from '@/lib/form/types'

interface UseFormFieldProps {
  id?: string
}

interface UseFormFieldOptions {
  isIteratedField?: boolean
  labels?: FieldLabels
}

export const useFormField = <T = unknown,>(
  props?: UseFormFieldProps,
  options?: UseFormFieldOptions,
): FieldState => {
  const field = useFieldContext<T>()
  const reactId = useId()

  const { id } = props ?? {}
  const { isIteratedField = false, labels = {} } = options ?? {}

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const isArrayField =
    Boolean(Array.isArray(field.state.value)) || isIteratedField

  const inputId = id
    ? id
    : isArrayField
      ? `${field.name}-${reactId}`
      : field.name

  return {
    field,
    inputId,
    isInvalid,
    isArrayField,
    labels,
  }
}
