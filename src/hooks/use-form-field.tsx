import { useId } from 'react'
import { useFieldContext } from '@/context/form-context'
import { FormFieldDisplay, FormFieldState } from '@/lib/form/types'

interface UseFormFieldProps {
  id?: string
}

interface UseFormFieldOptions {
  isIteratedField?: boolean
  fieldDisplay?: FormFieldDisplay
}

export const useFormField = <T = unknown,>(
  props?: UseFormFieldProps,
  options?: UseFormFieldOptions,
): FormFieldState => {
  const field = useFieldContext<T>()
  const reactId = useId()

  const { id } = props ?? {}
  const { isIteratedField = false } = options ?? {}

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
    ...options?.fieldDisplay,
  }
}
