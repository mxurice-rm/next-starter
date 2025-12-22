import { Switch } from '@/components/ui/switch'
import FormField from '@/components/form/form-field'
import { createFormField } from '@/lib/form/create-form-field'

const SwitchField = createFormField<typeof Switch, boolean>(
  ({ formField, props }) => {
    const { field } = formField

    return (
      <FormField
        formField={formField}
        config={{ orientation: 'horizontal', groupFieldContent: true }}
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
