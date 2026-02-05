'use client'

import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from '@/shared/form/context/form-context'
import TextField from '@/shared/form/components/fields/text-field'
import CheckboxField from '@/shared/form/components/fields/checkbox-field'
import RadioField from '@/shared/form/components/fields/radio-field'
import SwitchField from '@/shared/form/components/fields/switch-field'
import SelectField from '@/shared/form/components/fields/select-field'
import TextareaField from '@/shared/form/components/fields/textarea-field'
import PasswordField from '@/shared/form/components/fields/password-field'
import SubmitButton from '@/shared/form/components/submit-button'
import ErrorAlert from '@/shared/form/components/error-alert'

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
    PasswordField,
  },
  formComponents: {
    SubmitButton,
    ErrorAlert,
  },
})
