import { ReactElement } from 'react'
import { AnyFieldApi } from '@tanstack/react-form'

export interface FieldState {
  field: AnyFieldApi
  inputId: string
  isInvalid: boolean
  isArrayField: boolean
  texts: FieldTexts
}

export interface FieldTexts {
  label?: string
  link?: { text: string; to?: string }
  description?: string
  placeholder?: string
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
