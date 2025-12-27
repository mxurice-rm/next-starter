import FormField from '@/components/form/form-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'
import { createFormField } from '@/lib/form'

type SelectFieldProps = {
  options?: { value: string; label: string }[]
  children?: React.ReactNode
}

const SelectField = createFormField<
  typeof SelectTrigger,
  string,
  SelectFieldProps
>(({ formField, props }) => {
  const { options, children, ...restProps } = props
  const { field, labels } = formField

  return (
    <FormField formField={formField}>
      {(FieldControl) => (
        <Select
          name={field.name}
          value={field.state.value}
          onValueChange={field.handleChange}
        >
          <FieldControl>
            <SelectTrigger {...restProps}>
              <SelectValue placeholder={labels.placeholder} />
            </SelectTrigger>
          </FieldControl>
          <SelectContent>
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

export default SelectField
