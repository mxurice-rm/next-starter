import { AnyFieldApi } from '@tanstack/react-form'
import { ReactElement } from 'react'

export interface FieldState {
  field: AnyFieldApi
  inputId: string
  isInvalid: boolean
  isArrayField: boolean
  texts: FieldTexts
  requiredIndicator: 'required' | 'optional' | null
}

export type SelectOption = { value: string; label: string }

export interface FieldTexts {
  label?: string
  link?: { text: string; to?: string }
  description?: string
  placeholder?: string
  required?: boolean
}

export interface FieldLayout {
  orientation?: 'vertical' | 'horizontal' | 'responsive'
  wrapContent?: boolean
  controlFirst?: boolean
}

export interface FieldAddon {
  content: ReactElement
  position: 'inline-start' | 'inline-end' | 'block-start' | 'block-end'
}
