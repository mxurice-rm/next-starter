import React, { useRef, useState } from 'react'
import FormField from '@/shared/form/components/form-field'
import { Input } from '@/components/ui/input'
import { InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { MaybeInputGroup } from '@/shared/form/components/helpers/maybe-input-group'
import { FieldAddon } from '@/shared/form/lib/types'
import { createFormField } from '@/shared/form/lib'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

interface PasswordFieldProps {
  addons?: FieldAddon[]
}

const PasswordField = createFormField<
  typeof Input,
  string,
  PasswordFieldProps,
  'placeholder' | 'type'
>(({ formField, props }) => {
  const { addons = [], ...restProps } = props
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    formField.field.handleChange(e.target.value)
  }

  const toggleVisibility = () => {
    setVisible((prev) => !prev)
    inputRef.current?.focus()
  }

  const allAddons: FieldAddon[] = [
    ...addons,
    {
      content: (
        <InputGroupButton
          onClick={toggleVisibility}
          aria-label={visible ? 'Passwort verbergen' : 'Passwort anzeigen'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
      ),
      position: 'inline-end',
    },
  ]

  const inputProps = {
    ref: inputRef,
    value: formField.field.state.value,
    onChange,
    onBlur: formField.field.handleBlur,
    name: formField.field.name,
    placeholder: formField.texts.placeholder,
    type: visible ? 'text' : 'password',
    ...restProps,
  }

  return (
    <FormField formField={formField}>
      {(FieldControl) => (
        <MaybeInputGroup addons={allAddons}>
          {(hasAddons) => (
            <FieldControl>
              {hasAddons ? (
                <InputGroupInput {...inputProps} />
              ) : (
                <Input {...inputProps} />
              )}
            </FieldControl>
          )}
        </MaybeInputGroup>
      )}
    </FormField>
  )
})

export default PasswordField
