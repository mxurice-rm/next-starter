import { FieldConfig, InputGroupAddon } from '@/lib/form/types'
import React from 'react'
import { useBaseField } from '@/hooks/use-base-field'
import BaseField from '@/components/form/fields/base-field'
import { MaybeInputGroup } from '@/components/form/internal/maybe-input-group'

export function createTextInputField<TElement extends 'input' | 'textarea'>({
  Component,
  GroupComponent,
}: {
  Component: React.ComponentType<React.ComponentProps<TElement>>
  GroupComponent: React.ComponentType<React.ComponentProps<TElement>>
}) {
  const TextInputField = ({
    label,
    description,
    addons,
    config,
    ...props
  }: {
    label: string
    description?: string
    addons?: InputGroupAddon[]
    config?: FieldConfig
  } & React.ComponentProps<TElement>) => {
    const { field } = useBaseField<string>()

    const onChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      field.handleChange(e.target.value)
    }

    const inputProps = {
      ...props,
      onChange,
    } as React.ComponentProps<TElement>

    return (
      <BaseField
        field={field}
        id={field.name}
        label={label}
        description={description}
        config={config}
      >
        {(FieldControl) => (
          <MaybeInputGroup addons={addons}>
            {(hasAddons) => {
              return (
                <FieldControl>
                  {hasAddons ? (
                    <GroupComponent {...inputProps} />
                  ) : (
                    <Component {...inputProps} />
                  )}
                </FieldControl>
              )
            }}
          </MaybeInputGroup>
        )}
      </BaseField>
    )
  }

  TextInputField.displayName = `TextInputField(${Component.displayName || Component.name})`

  return TextInputField
}
