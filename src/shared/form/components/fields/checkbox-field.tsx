import { Checkbox } from '@/components/ui/checkbox'
import FormField from '@/shared/form/components/form-field'
import { createFormField } from '@/shared/form/lib'

const CheckboxField = createFormField<typeof Checkbox, boolean | string[]>(
  ({ formField, props }) => {
    const { field, isArrayField, inputId } = formField

    const isChecked = isArrayField
      ? (field.state.value as string[]).includes(inputId)
      : Boolean(field.state.value)

    const handleCheckedChange = (checked: boolean) => {
      if (!isArrayField) {
        field.handleChange(checked)
        return
      }

      if (!inputId) return

      const currentValue = Array.isArray(field.state.value)
        ? (field.state.value as string[])
        : []

      if (checked) {
        if (!currentValue.includes(inputId)) {
          field.pushValue?.(inputId)
        }
        return
      }

      const index = currentValue.indexOf(inputId)
      if (index !== -1) {
        field.removeValue?.(index)
      }
    }

    return (
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
            <Checkbox
              {...props}
              name={field.name}
              checked={isChecked}
              onCheckedChange={handleCheckedChange}
            />
          </FieldControl>
        )}
      </FormField>
    )
  },
)

export default CheckboxField
