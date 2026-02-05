import FormField from '@/shared/form/components/form-field'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { FieldLabel } from '@/components/ui/field'
import { createFormField } from '@/shared/form/lib'

interface RadioFieldProps {
  value: string
  asCard?: boolean
}

const RadioField = createFormField<
  typeof RadioGroupItem,
  string,
  RadioFieldProps
>(({ formField, props }) => {
  const { value, asCard, ...restProps } = props

  const content = (
    <FormField
      formField={formField}
      config={{
        controlFirst: true,
        wrapContent: true,
        orientation: 'horizontal',
      }}
    >
      {(FieldControl) => (
        <FieldControl>
          <RadioGroupItem value={value} {...restProps} />
        </FieldControl>
      )}
    </FormField>
  )

  if (asCard) {
    return <FieldLabel htmlFor={formField.inputId}>{content}</FieldLabel>
  }

  return content
}).withOptions({ isIteratedField: true })

export default RadioField
