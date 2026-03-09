import React from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField } from '@/shared/form/components/form-field'
import { createFormField } from '@/shared/form/lib'
import type { SelectOption } from '@/shared/form/lib/types'

interface SelectFieldProps {
  options?: SelectOption[]
  children?: React.ReactNode
}

export const SelectField = createFormField<
  typeof SelectTrigger,
  string,
  SelectFieldProps
>(({ formField, props }) => {
  const { options, children, ...restProps } = props
  const { field, texts } = formField

  return (
    <FormField formField={formField}>
      {(FieldControl) => (
        <Select
          name={field.name}
          value={field.state.value}
          onValueChange={(val) => {
            field.handleChange(val)
            field.handleBlur()
          }}
        >
          <FieldControl>
            <SelectTrigger {...restProps}>
              <SelectValue placeholder={texts.placeholder} />
            </SelectTrigger>
          </FieldControl>
          <SelectContent position="popper">
            {children ||
              options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  )
})
