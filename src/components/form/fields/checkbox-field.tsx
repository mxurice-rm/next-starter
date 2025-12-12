import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { useBaseField } from '@/hooks/use-base-field'
import BaseField from '@/components/form/fields/base-field'

const CheckboxField = ({
  label,
  description,
  ...props
}: { label: string; description?: string } & React.ComponentProps<
  typeof Checkbox
>) => {
  const { field, inputId, isArrayField } = useBaseField<string[] | boolean>(
    props.id,
  )

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
    <BaseField
      field={field}
      id={inputId}
      label={label}
      description={description}
      config={{
        inputFirst: true,
        groupedDescription: true,
        orientation: 'horizontal',
      }}
    >
      {(FieldControl) => (
        <FieldControl>
          <Checkbox
            {...props}
            checked={isChecked}
            onCheckedChange={handleCheckedChange}
          />
        </FieldControl>
      )}
    </BaseField>
  )
}

export default CheckboxField
