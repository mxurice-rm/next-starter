import React from 'react'
import { FieldTexts, FieldState } from './types'
import { useFormField } from '@/shared/form/hooks/use-form-field'

export type FieldOptions = {
  isIteratedField?: boolean
}

// --- Render Types ---

type RenderContext<TProps> = {
  formField: FieldState
  props: TProps
}

type Renderer<TProps> = (context: RenderContext<TProps>) => React.ReactElement

// --- Component Props ---

type BaseProps<
  TComponent extends React.ElementType,
  TOmit extends keyof React.ComponentProps<TComponent> = never,
> = {
  texts?: FieldTexts
} & Omit<React.ComponentProps<TComponent>, TOmit>

type ComponentProps<
  TComponent extends React.ElementType,
  TSpecificProps,
  TOmit extends keyof React.ComponentProps<TComponent>,
> = TSpecificProps & BaseProps<TComponent, TOmit>

type RendererProps<
  TComponent extends React.ElementType,
  TSpecificProps,
  TOmit extends keyof React.ComponentProps<TComponent>,
> = TSpecificProps & Omit<React.ComponentProps<TComponent>, TOmit>

// --- Component Types ---

type FieldComponent<
  TComponent extends React.ElementType,
  TSpecificProps,
  TOmit extends keyof React.ComponentProps<TComponent>,
> = (
  props: ComponentProps<TComponent, TSpecificProps, TOmit>,
) => React.ReactElement

type ChainableFieldComponent<
  TComponent extends React.ElementType,
  TSpecificProps,
  TOmit extends keyof React.ComponentProps<TComponent>,
> = FieldComponent<TComponent, TSpecificProps, TOmit> & {
  withOptions: (
    options: FieldOptions,
  ) => FieldComponent<TComponent, TSpecificProps, TOmit>
}

export function createFormField<
  TComponent extends React.ElementType,
  TValue = unknown,
  TSpecificProps = object,
  TOmit extends keyof React.ComponentProps<TComponent> = never,
>(
  render: Renderer<RendererProps<TComponent, TSpecificProps, TOmit>>,
  options?: FieldOptions,
): ChainableFieldComponent<TComponent, TSpecificProps, TOmit> {
  const buildFieldComponent = (
    fieldOptions?: FieldOptions,
  ): FieldComponent<TComponent, TSpecificProps, TOmit> => {
    return (allProps: ComponentProps<TComponent, TSpecificProps, TOmit>) => {
      const { texts, ...restProps } = allProps
      const formField = useFormField<TValue>(restProps, {
        texts,
        ...fieldOptions,
      })

      return render({
        formField,
        props: restProps as RendererProps<TComponent, TSpecificProps, TOmit>,
      })
    }
  }

  const component = buildFieldComponent(options) as ChainableFieldComponent<
    TComponent,
    TSpecificProps,
    TOmit
  >

  component.withOptions = (newOptions: FieldOptions) =>
    buildFieldComponent(newOptions)

  return component
}
