'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { useFormContext } from '@/context/form-context'
import { Spinner } from '@/components/ui/spinner'

const SubmitButton = ({
  label = 'Submit',
  icon,
}: {
  label: string
  icon: React.ReactElement
}) => {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit}>
          {isSubmitting ? <Spinner /> : icon} {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

export default SubmitButton
