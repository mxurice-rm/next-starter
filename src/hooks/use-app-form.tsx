'use client'

import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from '@/context/form-context'

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
})
