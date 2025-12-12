'use client'

import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from '@/context/form-context'
import TextField from '@/components/form/fields/text-field'
import TextareaField from '@/components/form/fields/textarea-field'
import CheckboxField from '@/components/form/fields/checkbox-field'

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    CheckboxField,
  },
  formComponents: {},
})
