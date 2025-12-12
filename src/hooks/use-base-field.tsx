import { useFieldContext } from '@/context/form-context'
import React from 'react'

export const useBaseField = <T = unknown,>(id?: string) => {
  const field = useFieldContext<T>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  // Detect if field is used in array mode based on the value type
  // Array fields should not show individual field errors, only group errors. Group errors are handled in form renderer.
  const isArrayField = Array.isArray(field.state.value)

  const reactId = React.useId()
  const inputId = isArrayField ? `${field.name}-${id ?? reactId}` : field.name

  return {
    field,
    inputId,
    isInvalid,
    isArrayField,
  }
}
