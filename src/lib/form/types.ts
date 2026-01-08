import { ReactElement } from 'react'
import { AnyFieldApi } from '@tanstack/react-form'

export type FieldState = {
  field: AnyFieldApi
  inputId: string
  isInvalid: boolean
  isArrayField: boolean
  texts: FieldTexts
}

export type FieldTexts = {
  label?: string
  link?: { text: string; to?: string }
  description?: string
  placeholder?: string
}

export type FieldLayout = {
  orientation?: 'vertical' | 'horizontal' | 'responsive'
  wrapContent?: boolean
  controlFirst?: boolean
}

export type FieldAddon = {
  content: ReactElement
  position: 'inline-start' | 'inline-end' | 'block-start' | 'block-end'
}
