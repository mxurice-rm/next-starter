import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFormContext } from '@/context/form-context'
import { AlertCircleIcon } from 'lucide-react'

const ErrorAlert = () => {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => ({
        errorMap: state.errorMap,
        isDirty: state.isDirty,
      })}
    >
      {({ errorMap, isDirty }) => {
        return errorMap.onSubmit?.form && isDirty ? (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Es ist ein Fehler aufgetreten!</AlertTitle>
            <AlertDescription>{errorMap.onSubmit.form}</AlertDescription>
          </Alert>
        ) : null
      }}
    </form.Subscribe>
  )
}

export default ErrorAlert
