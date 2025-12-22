import FormField from '@/components/form/form-field'
import React from 'react'
import { MaybeInputGroup } from '@/components/form/internal/maybe-input-group'
import { InputGroupTextarea } from '@/components/ui/input-group'
import { InputGroupAddon } from '@/lib/form/types'
import { Textarea } from '@/components/ui/textarea'
import { createFormField } from '@/lib/form/create-form-field'

type TextareaFieldProps = {
  addons?: InputGroupAddon[]
}

const TextareaField = createFormField<
  typeof Textarea,
  string,
  TextareaFieldProps,
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
                  <InputGroupTextarea {...inputProps} />
                ) : (
                  <Textarea {...inputProps} />
                )}
              </FieldControl>
            )
          }}
        </MaybeInputGroup>
      )}
    </FormField>
  )
})

export default TextareaField
