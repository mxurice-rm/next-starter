import { Alert, AlertDescription } from '@/components/ui/alert'
import { useFormContext } from '@/shared/form/context/form-context'
import { AlertCircleIcon } from 'lucide-react'

const ErrorAlert = () => {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => ({
        formError: state.errorMap.onSubmit?.form,
        submissionAttempts: state.submissionAttempts,
      })}
    >
      {({ formError, submissionAttempts }) => {
        if (!formError || submissionAttempts === 0) return null

        return (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )
      }}
    </form.Subscribe>
  )
}

export default ErrorAlert
