import { Switch } from '@/components/ui/switch'
import FormField from '@/shared/form/components/form-field'
import { createFormField } from '@/shared/form/lib'

const SwitchField = createFormField<typeof Switch, boolean>(
  ({ formField, props }) => {
    const { field } = formField

    return (
      <FormField
        formField={formField}
        config={{ orientation: 'horizontal', wrapContent: true }}
      >
        {(FieldControl) => (
          <FieldControl>
            <Switch
              {...props}
              checked={field.state.value}
              onCheckedChange={field.handleChange}
            />
          </FieldControl>
        )}
      </FormField>
    )
  },
)

export default SwitchField
