import React, { useContext, useEffect, useRef } from 'react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { FieldConfig } from '@/lib/form/types'
import { AnyFieldApi } from '@tanstack/react-form'
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
    name: context.id,
    'aria-invalid': context.isInvalid,
    onBlur: context.field.handleBlur,
    ...originalProps,
  } as React.HTMLAttributes<HTMLElement>)
}

const BaseField = ({
  label,
  config,
  children,
  description,
  suppressErrors,
  field,
  id,
}: {
  children: (FieldControl: typeof FieldControlComponent) => React.ReactElement
  field: AnyFieldApi
  label: string
  id: string
  description?: string
  suppressErrors?: boolean
  config?: FieldConfig
}) => {
  const { orientation, groupedDescription, inputFirst } = config ?? {}

  const isArrayField = Array.isArray(field.state.value)

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const errors = field.state.meta.errors
  const errorsSuppressed = suppressErrors ?? isArrayField

  const controlRef = useRef<React.ReactElement | null>(null)

  const registerControl = (element: React.ReactElement) => {
    controlRef.current = element
  }

  const labelElement = <FieldLabel htmlFor={id}>{label}</FieldLabel>
  const descriptionElement = description ? (
    <FieldDescription>{description}</FieldDescription>
  ) : null

  const errorElement =
    isInvalid && errors && !errorsSuppressed ? (
      <FieldError
        errors={errors.map((error) =>
          typeof error === 'string' ? { message: error } : error,
        )}
      />
    ) : null

  const useFieldContent = Boolean(description && groupedDescription)

  const renderedChildren = children(FieldControlComponent)

  const groupedContent = (
    <FieldContent>
      {labelElement}
      {descriptionElement}
      {inputFirst && errorElement}
    </FieldContent>
  )

  const content = inputFirst ? (
    <>
      {renderedChildren}
      {useFieldContent ? (
        groupedContent
      ) : (
        <>
          {labelElement}
          {descriptionElement}
          {errorElement}
        </>
      )}
    </>
  ) : (
    <>
      {useFieldContent ? groupedContent : labelElement}
      {renderedChildren}
      {useFieldContent ? (
        errorElement
      ) : (
        <>
          {descriptionElement}
          {errorElement}
        </>
      )}
    </>
  )

  return (
    <FieldControlContext.Provider
      value={{ registerControl, isInvalid, id, field }}
    >
      <Field data-invalid={isInvalid} orientation={orientation}>
        {content}
      </Field>
    </FieldControlContext.Provider>
  )
}

export default BaseField
