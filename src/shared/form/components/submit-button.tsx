'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useFormContext } from '@/shared/form/context/form-context'

export const SubmitButton = ({
  label = 'Submit',
  icon,
}: {
  label: string
  icon: React.ReactElement
}) => {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
    >
      {({ canSubmit, isSubmitting }) => (
        <Button
          type="submit"
          disabled={!canSubmit}
          onMouseDown={(e) => e.preventDefault()}
        >
          {isSubmitting ? <Spinner /> : icon} {label}
        </Button>
      )}
    </form.Subscribe>
  )
}
