import FormField from '@/shared/form/components/form-field'
import React from 'react'
import { MaybeInputGroup } from '@/shared/form/components/helpers/maybe-input-group'
import { InputGroupTextarea } from '@/components/ui/input-group'
import { FieldAddon } from '@/shared/form/lib/types'
import { Textarea } from '@/components/ui/textarea'
import { createFormField } from '@/shared/form/lib'

interface TextareaFieldProps {
  addons?: FieldAddon[]
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
