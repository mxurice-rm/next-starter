import { createFormHookContexts } from '@tanstack/react-form'
import React, { createContext } from 'react'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const FieldControlContext = createContext<{
  registerControl: (element: React.ReactElement) => void
  isInvalid: boolean
  id: string
} | null>(null)
