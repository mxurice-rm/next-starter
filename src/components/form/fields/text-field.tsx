import FormField from '@/components/form/form-field'
import React from 'react'
import { Input } from '@/components/ui/input'
import { MaybeInputGroup } from '@/components/form/internal/maybe-input-group'
import { InputGroupInput } from '@/components/ui/input-group'
import { InputGroupAddon } from '@/lib/form/types'
import { createFormField } from '@/lib/form/create-form-field'

type TextFieldProps = {
  addons?: InputGroupAddon[]
}

const TextField = createFormField<
  typeof Input,
  string,
  TextFieldProps,
  'placeholder'
>(({ formField, props }) => {
  const { addons, ...restProps } = props

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    formField.field.handleChange(e.target.value)
  }

  const inputProps = {
    onChange,
    onBlur: formField.field.handleBlur,
    name: formField.field.name,
    placeholder: formField.placeholder,
    ...restProps,
  }

  return (
    <FormField formField={formField}>
      {(FieldControl) => (
        <MaybeInputGroup addons={addons}>
          {(hasAddons) => {
            return (
              <FieldControl>
                {hasAddons ? (
                  <InputGroupInput {...inputProps} />
                ) : (
                  <Input {...inputProps} />
                )}
              </FieldControl>
            )
          }}
        </MaybeInputGroup>
      )}
    </FormField>
  )
})

export default TextField
