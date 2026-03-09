import { Input } from '@/components/ui/input'
import { InputGroupInput } from '@/components/ui/input-group'
import { FormField } from '@/shared/form/components/form-field'
import { MaybeInputGroup } from '@/shared/form/components/helpers/maybe-input-group'
import { createFormField } from '@/shared/form/lib'
import { buildTextInputProps } from '@/shared/form/lib/text-input-props'
import { FieldAddon } from '@/shared/form/lib/types'

interface TextFieldProps {
  addons?: FieldAddon[]
}

export const TextField = createFormField<
  typeof Input,
  string,
  TextFieldProps,
  'placeholder'
>(({ formField, props }) => {
  const { addons, ...restProps } = props
  const inputProps = buildTextInputProps(formField, restProps)

  return (
    <FormField formField={formField}>
      {(FieldControl) => (
        <MaybeInputGroup addons={addons}>
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
