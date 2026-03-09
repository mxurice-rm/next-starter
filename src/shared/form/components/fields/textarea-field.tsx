import { InputGroupTextarea } from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/shared/form/components/form-field'
import { MaybeInputGroup } from '@/shared/form/components/helpers/maybe-input-group'
import { createFormField } from '@/shared/form/lib'
import { buildTextInputProps } from '@/shared/form/lib/text-input-props'
import { FieldAddon } from '@/shared/form/lib/types'

interface TextareaFieldProps {
  addons?: FieldAddon[]
}

export const TextareaField = createFormField<
  typeof Textarea,
  string,
  TextareaFieldProps,
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
                <InputGroupTextarea {...inputProps} />
              ) : (
                <Textarea {...inputProps} />
              )}
            </FieldControl>
          )}
        </MaybeInputGroup>
      )}
    </FormField>
  )
})
