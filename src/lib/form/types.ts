import { ReactElement } from 'react'

type FieldType = 'text' | 'textarea'

export type Orientation = 'vertical' | 'horizontal' | 'responsive'

export type FieldConfig = {
  orientation?: 'vertical' | 'horizontal' | 'responsive'
  groupedDescription?: boolean
  inputFirst?: boolean
}

export type InputGroupAddon = {
  content: ReactElement
  align: 'inline-start' | 'inline-end' | 'block-start' | 'block-end'
}
