'use client'

import { useAppForm } from '@/hooks/use-app-form'
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { UserIcon } from 'lucide-react'
import { RadioGroup } from '@/components/ui/radio-group'
import { InputGroupText } from '@/components/ui/input-group'

const notifications = [
  {
    id: 'push',
    label: 'Push notifications',
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
  },
  {
    id: 'email',
    label: 'Email notifications',
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing',
  },
] as const

const plans = [
  {
    value: 'plan-1',
    label: 'Plan 1',
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
  },
  {
    value: 'plan-2',
    label: 'Plan 2',
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing',
  },
  {
    value: 'plan-3',
    label: 'Plan 3',
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing',
  },
] as const

const billingPeriods = [
  {
    value: 'monthly',
    label: 'Monthly',
  },
  {
    value: 'yearly',
    label: 'Yearly',
  },
]

const EasyForm = () => {
  const form = useAppForm({
    defaultValues: {
      name: '',
      description: '',
      notifications: [] as string[], // ARRAY FIELD
      plan: '', // NON ARRAY FIELD BUT ITEM MAP
      terms: false,
      multiAuth: false,
      billingPeriod: '',
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        {/* ----------------- NAME FIELD (Input) ----------------- */}
        <form.AppField
          name="name"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Name ist erforderlich'
              if (value.length < 2)
                return {
                  message: 'Name muss mindestens 2 Zeichen lang sein',
                }
              return undefined
            },
            onBlur: ({ value }) => {
              if (value && value.length > 20)
                return {
                  message: 'Name darf maximal 20 Zeichen lang sein',
                }
              return undefined
            },
          }}
        >
          {(field) => {
            return (
              <field.TextField
                autoComplete={field.name}
                fieldDisplay={{
                  description: 'Lorem ipsum dolor sit amet, consetetur',
                  label: 'Name',
                  placeholder: 'Max Mustermann',
                }}
                addons={[
                  {
                    content: <UserIcon />,
                    align: 'inline-start',
                  },
                ]}
              />
            )
          }}
        </form.AppField>
        {/* ----------------- NAME FIELD (Input) ----------------- */}

        {/* ----------------- DESCRIPTION FIELD (Textarea) ----------------- */}
        <form.AppField
          name="description"
          validators={{
            onBlur: ({ value }) => {
              if (value && value.length > 20)
                return {
                  message: 'Name darf maximal 20 Zeichen lang sein',
                }
              return undefined
            },
          }}
        >
          {(field) => (
            <field.TextareaField
              fieldDisplay={{
                label: 'Beschreibung',
                placeholder: 'Beschreibung...',
                description: 'lorem ipsum',
              }}
              addons={[
                {
                  content: (
                    <InputGroupText className="text-muted-foreground text-xs">
                      120 characters left
                    </InputGroupText>
                  ),
                  align: 'block-end',
                },
              ]}
            />
          )}
        </form.AppField>
        {/* ----------------- DESCRIPTION FIELD (Textarea) ----------------- */}

        {/* ----------------- NOTIFICATION FIELD (Checkbox) ----------------- */}
        <form.AppField
          name="notifications"
          mode="array"
          validators={{
            onChange: ({ value }) => {
              if (!value || value.length === 0) {
                return {
                  message:
                    'Bitte wähle mindestens eine Benachrichtigungsart aus',
                }
              }
              return undefined
            },
          }}
        >
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <FieldSet>
                <FieldLegend variant="label">Notifications</FieldLegend>
                <FieldDescription>Lorem ipsum dolor sit amet</FieldDescription>
                <FieldGroup data-slot="checkbox-group">
                  {notifications.map((notification) => (
                    <field.CheckboxField
                      key={notification.id}
                      id={`${field.name}-${notification.id}`}
                      fieldDisplay={{
                        label: notification.label,
                        description: notification.description,
                      }}
                    />
                  ))}
                </FieldGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            )
          }}
        </form.AppField>
        {/* ----------------- NOTIFICATION FIELD (Checkbox) ----------------- */}

        {/* ----------------- PLAN FIELD (RadioGroup) ----------------- */}
        <form.AppField
          name="plan"
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                return {
                  message: 'Bitte wähle eine Benachrichtigungsmethode',
                }
              }
              if (value === 'plan-1') {
                return {
                  message:
                    'SMS-Benachrichtigungen sind aktuell nicht verfügbar',
                }
              }
              return undefined
            },
          }}
        >
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <FieldSet>
                <FieldLegend variant="label">Plan</FieldLegend>
                <FieldDescription>
                  Lorem ipsum dolor sit amet, consetetur sadipscing
                </FieldDescription>
                <RadioGroup
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  {plans.map((plan) => (
                    <field.RadioField
                      key={plan.value}
                      value={plan.value}
                      fieldDisplay={{
                        label: plan.label,
                        description: plan.description,
                      }}
                    />
                  ))}
                </RadioGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            )
          }}
        </form.AppField>
        {/* ----------------- PLAN FIELD (RadioGroup) ----------------- */}

        {/* ----------------- TERMS FIELD (Checkbox) ----------------- */}
        <form.AppField
          name="terms"
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                return { message: 'Du musst diese Checkbox aktivieren' }
              }
              return undefined
            },
          }}
        >
          {(field) => {
            return (
              <field.CheckboxField
                fieldDisplay={{
                  label: 'Terms',
                  description:
                    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut',
                }}
              />
            )
          }}
        </form.AppField>
        {/* ----------------- NAME FIELD (Input) ----------------- */}

        {/* ----------------- MULTIAUTH FIELD (Switch) ----------------- */}
        <form.AppField
          name="multiAuth"
          validators={{
            onChange: ({ value }) => {
              if (value) {
                return { message: 'Du musst diesen Switch aktivieren' }
              }
              return undefined
            },
          }}
        >
          {(field) => {
            return (
              <field.SwitchField
                fieldDisplay={{
                  label: 'Multi-factor authentication',
                  description:
                    'Enable multi-factor authentication. If you do not have a two-factor device, you can use a one-time code sent to your email.',
                }}
              />
            )
          }}
        </form.AppField>
        {/* ----------------- MULTIAUTH FIELD (Switch) ----------------- */}

        {/* ----------------- BILLINGPERIOD FIELD (Select) ----------------- */}
        <form.AppField
          name="billingPeriod"
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                return {
                  message: 'Bitte wähle eine Rolle aus',
                }
              }
              if (value === 'yearly') {
                return {
                  message: 'Die Admin-Rolle kann nicht ausgewählt werden',
                }
              }
              return undefined
            },
          }}
        >
          {(field) => {
            return (
              <field.SelectField
                fieldDisplay={{
                  label: 'Billing Period',
                  description: 'Choose how often you want to be billed.',
                  placeholder: 'Select',
                }}
                options={billingPeriods}
              />
            )
          }}
        </form.AppField>
        {/* ----------------- BILLINGPERIOD FIELD (Select) ----------------- */}
      </FieldGroup>
    </form>
  )
}

export default EasyForm
