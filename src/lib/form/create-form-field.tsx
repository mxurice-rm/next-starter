import React from 'react'
import { FormFieldBaseProps, FormFieldState } from './types'
import { useFormField } from '@/hooks/use-form-field'

export type FieldOptions = {
  isIteratedField?: boolean
}

type FieldRenderContext<TProps> = {
  formField: FormFieldState
  props: TProps
}

type FieldRenderer<TProps> = (
  context: FieldRenderContext<TProps>,
) => React.ReactElement

type FieldComponentProps<
  TComponent extends React.ElementType,
  TSpecificProps,
  TOmit extends keyof React.ComponentProps<TComponent>,
> = TSpecificProps & FormFieldBaseProps<TComponent, TOmit>

type FieldRendererProps<
  TComponent extends React.ElementType,
  TSpecificProps,
  TOmit extends keyof React.ComponentProps<TComponent>,
> = TSpecificProps & Omit<React.ComponentProps<TComponent>, TOmit>

type BaseFieldComponent<
  TComponent extends React.ElementType,
  TSpecificProps,
  TOmit extends keyof React.ComponentProps<TComponent>,
> = (
  props: FieldComponentProps<TComponent, TSpecificProps, TOmit>,
) => React.ReactElement

type FieldComponentWithChaining<
  TComponent extends React.ElementType,
  TSpecificProps,
  TOmit extends keyof React.ComponentProps<TComponent>,
> = BaseFieldComponent<TComponent, TSpecificProps, TOmit> & {
  withOptions: (
    options: FieldOptions,
  ) => BaseFieldComponent<TComponent, TSpecificProps, TOmit>
}

export function createFormField<
  TComponent extends React.ElementType,
  TValue = unknown,
  TSpecificProps = object,
  TOmit extends keyof React.ComponentProps<TComponent> = never,
>(
  render: FieldRenderer<FieldRendererProps<TComponent, TSpecificProps, TOmit>>,
  options?: FieldOptions,
): FieldComponentWithChaining<TComponent, TSpecificProps, TOmit> {
  const buildFieldComponent = (
    fieldOptions?: FieldOptions,
  ): BaseFieldComponent<TComponent, TSpecificProps, TOmit> => {
    return (
      allProps: FieldComponentProps<TComponent, TSpecificProps, TOmit>,
    ) => {
      const { fieldDisplay, ...restProps } = allProps
      const formField = useFormField<TValue>(restProps, {
        fieldDisplay,
        ...fieldOptions,
      })

      return render({
        formField,
        props: restProps as FieldRendererProps<
          TComponent,
          TSpecificProps,
          TOmit
        >,
      })
    }
  }

  const component = buildFieldComponent(options) as FieldComponentWithChaining<
    TComponent,
    TSpecificProps,
    TOmit
  >

  component.withOptions = (newOptions: FieldOptions) =>
    buildFieldComponent(newOptions)

  return component
}
