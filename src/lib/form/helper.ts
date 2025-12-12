import { AnyFieldApi } from '@tanstack/react-form'

export const getBaseInputProps = (field: AnyFieldApi, id?: string) => {
  return {
    onBlur: field.handleBlur,
  }
}
