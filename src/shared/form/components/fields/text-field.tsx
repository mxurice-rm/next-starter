import FormField from '@/shared/form/components/form-field'
import React from 'react'
import { Input } from '@/components/ui/input'
import { MaybeInputGroup } from '@/shared/form/components/helpers/maybe-input-group'
import { InputGroupInput } from '@/components/ui/input-group'
import { FieldAddon } from '@/shared/form/lib/types'
import { createFormField } from '@/shared/form/lib'

interface TextFieldProps {
  addons?: FieldAddon[]
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
    value: formField.field.state.value,
    onChange,
    onBlur: formField.field.handleBlur,
    name: formField.field.name,
    placeholder: formField.texts.placeholder,
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
