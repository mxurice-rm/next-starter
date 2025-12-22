import React, { ReactElement } from 'react'
import { AnyFieldApi } from '@tanstack/react-form'

export type FormFieldState = {
  field: AnyFieldApi
  inputId: string
  isInvalid: boolean
  isArrayField: boolean
} & FormFieldDisplay

export type FormFieldDisplay = {
  label?: string
  description?: string
  placeholder?: string
}

export type FormFieldBaseProps<
  TComponent extends React.ElementType,
  TOmit extends keyof React.ComponentProps<TComponent> = never,
> = {
  fieldDisplay?: FormFieldDisplay
} & Omit<React.ComponentProps<TComponent>, TOmit>

export type FormFieldConfig = {
  orientation?: 'vertical' | 'horizontal' | 'responsive'
  groupFieldContent?: boolean
  controlFirst?: boolean
}

export type InputGroupAddon = {
  content: ReactElement
  align: 'inline-start' | 'inline-end' | 'block-start' | 'block-end'
}
