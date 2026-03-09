'use client'

import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { FormField } from '@/shared/form/components/form-field'
import { MaybeInputGroup } from '@/shared/form/components/helpers/maybe-input-group'
import { createFormField } from '@/shared/form/lib'
import { buildTextInputProps } from '@/shared/form/lib/text-input-props'
import { FieldAddon } from '@/shared/form/lib/types'

interface PasswordFieldProps {
  addons?: FieldAddon[]
}

export const PasswordField = createFormField<
  typeof Input,
  string,
  PasswordFieldProps,
  'placeholder' | 'type'
>(({ formField, props }) => {
  const { addons = [], ...restProps } = props
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

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
    ...buildTextInputProps(formField, restProps),
    ref: inputRef,
    type: visible ? 'text' : 'password',
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
