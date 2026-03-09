import type React from 'react'

import type { FieldState } from './types'

export const buildTextInputProps = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  formField: FieldState,
  restProps: T,
) => ({
  value: formField.field.state.value as string,
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    formField.field.handleChange(e.target.value)
  },
  onBlur: formField.field.handleBlur,
  name: formField.field.name,
  placeholder: formField.texts.placeholder,
  ...restProps,
})
