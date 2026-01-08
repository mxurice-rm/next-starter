'use client'

import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from '@/context/form-context'
import TextField from '@/components/form/fields/text-field'
import CheckboxField from '@/components/form/fields/checkbox-field'
import RadioField from '@/components/form/fields/radio-field'
import SwitchField from '@/components/form/fields/switch-field'
import SelectField from '@/components/form/fields/select-field'
import TextareaField from '@/components/form/fields/textarea-field'
import SubmitButton from '@/components/form/submit-button'
import ErrorAlert from '@/components/form/error-alert'

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    CheckboxField,
    RadioField,
    SwitchField,
    SelectField,
    TextareaField,
  },
  formComponents: {
    SubmitButton,
    ErrorAlert,
  },
})
