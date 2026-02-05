import { useId } from 'react'
import { useFieldContext } from '@/shared/form/context/form-context'
import { FieldState, FieldTexts } from '@/shared/form/lib/types'

export const useFormField = <T = unknown,>(
  props?: { id?: string },
  options?: { isIteratedField?: boolean; texts?: FieldTexts },
): FieldState => {
  const field = useFieldContext<T>()
  const reactId = useId()

  const { id } = props ?? {}
  const { isIteratedField = false, texts = {} } = options ?? {}

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
    texts,
  }
}
