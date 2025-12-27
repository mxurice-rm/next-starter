import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { FieldLayout, FieldState } from '@/lib/form/types'
import React, { useContext, useEffect, useRef } from 'react'
import { FieldControlContext } from '@/context/form-context'

const FieldControlComponent = ({
  children,
}: {
  children: React.ReactElement
}) => {
  const context = useContext(FieldControlContext)

  if (!context) {
    throw new Error('FieldControl must be used within a BaseField')
  }

  useEffect(() => {
    context.registerControl(children)
  }, [children, context])

  const originalProps = children.props as Record<string, unknown>

  return React.cloneElement(children, {
    id: context.id,
    'aria-invalid': context.isInvalid,
    ...originalProps,
  } as React.InputHTMLAttributes<HTMLInputElement>)
}

const FormField = ({
  suppressErrors,
  config,
  children,
  formField,
}: {
  suppressErrors?: boolean
  config?: FieldLayout
  formField: FieldState
  children: (FieldControl: typeof FieldControlComponent) => React.ReactElement
}) => {
  const { field, isInvalid, isArrayField, inputId, labels } = formField
  const { label, description } = labels
  const { orientation, wrapContent, controlFirst } = config ?? {}

  const errors = field.state.meta.errors
  const errorsSuppressed = suppressErrors ?? isArrayField

  const controlRef = useRef<React.ReactElement | null>(null)

  const registerControl = (element: React.ReactElement) => {
    controlRef.current = element
  }

  const labelElement = <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
  const descriptionElement = <FieldDescription>{description}</FieldDescription>

  const errorElement =
    isInvalid && errors && !errorsSuppressed ? (
      <FieldError
        errors={errors.map((error: string | { message: string }) =>
          typeof error === 'string' ? { message: error } : error,
        )}
      />
    ) : null

  const fieldControlElement = children(FieldControlComponent)

  const hasDescription = Boolean(description)
  const useFieldContent = Boolean(description && wrapContent)

  const labelNode = label ? labelElement : null
  const descNode = hasDescription ? descriptionElement : null

  let renderField: React.ReactNode

  if (useFieldContent) {
    const fieldContent = (
      <FieldContent>
        {labelNode}
        {descNode}
        {errorElement}
      </FieldContent>
    )

    renderField = controlFirst ? (
      <>
        {fieldControlElement}
        {fieldContent}
      </>
    ) : (
      <>
        {fieldContent}
        {fieldControlElement}
      </>
    )
  } else if (hasDescription) {
    renderField = controlFirst ? (
      <>
        {fieldControlElement}
        {labelNode}
        {descNode}
        {errorElement}
      </>
    ) : (
      <>
        {labelNode}
        {fieldControlElement}
        {descNode}
        {errorElement}
      </>
    )
  } else {
    const content = (
      <>
        {labelNode}
        {errorElement}
      </>
    )

    renderField = controlFirst ? (
      <>
        {fieldControlElement}
        {content}
      </>
    ) : (
      <>
        {content}
        {fieldControlElement}
      </>
    )
  }

  return (
    <FieldControlContext.Provider
      value={{ registerControl, isInvalid, id: inputId }}
    >
      <Field data-invalid={isInvalid} orientation={orientation}>
        {renderField}
      </Field>
    </FieldControlContext.Provider>
  )
}

export default FormField
