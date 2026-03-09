'use client'

import { useId } from 'react'

import { useFieldContext } from '@/shared/form/context/form-context'
import {
  isFieldRequired,
  resolveFieldSchema,
} from '@/shared/form/lib/schema-utils'
import { FieldState, FieldTexts } from '@/shared/form/lib/types'

export const useFormField = <T = unknown,>(
  props?: { id?: string },
  options?: {
    isIteratedField?: boolean
    singleField?: boolean
    texts?: FieldTexts
  },
): FieldState => {
  const field = useFieldContext<T>()
  const reactId = useId()

  const { id } = props ?? {}
  const {
    isIteratedField = false,
    singleField = false,
    texts = {},
  } = options ?? {}

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const isArrayField = singleField
    ? false
    : Boolean(Array.isArray(field.state.value)) || isIteratedField

  const inputId = id
    ? id
    : isArrayField
      ? `${field.name}-${reactId}`
      : field.name

  const requiredIndicator =
    texts.required !== undefined
      ? texts.required
        ? 'required'
        : 'optional'
      : isFieldRequired(resolveFieldSchema(field))

  return {
    field,
    inputId,
    isInvalid,
    isArrayField,
    texts,
    requiredIndicator,
  }
}
