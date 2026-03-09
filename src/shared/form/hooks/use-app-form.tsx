'use client'

import { createFormHook } from '@tanstack/react-form'

import { ErrorAlert } from '@/shared/form/components/error-alert'
import { CheckboxField } from '@/shared/form/components/fields/checkbox-field'
import { ComboboxField } from '@/shared/form/components/fields/combobox-field'
import { DateTimeField } from '@/shared/form/components/fields/date-time-field'
import { PasswordField } from '@/shared/form/components/fields/password-field'
import { RadioField } from '@/shared/form/components/fields/radio-field'
import { SelectField } from '@/shared/form/components/fields/select-field'
import { SwitchField } from '@/shared/form/components/fields/switch-field'
import { TextField } from '@/shared/form/components/fields/text-field'
import { TextareaField } from '@/shared/form/components/fields/textarea-field'
import { SubmitButton } from '@/shared/form/components/submit-button'
import { fieldContext, formContext } from '@/shared/form/context/form-context'

export const { useAppForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    CheckboxField,
    RadioField,
    SwitchField,
    SelectField,
    ComboboxField,
    TextareaField,
    PasswordField,
    DateTimeField,
  },
  formComponents: {
    SubmitButton,
    ErrorAlert,
  },
})
