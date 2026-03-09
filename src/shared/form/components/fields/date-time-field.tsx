import { format } from 'date-fns'
import { CalendarIcon, Clock } from 'lucide-react'
import { de } from 'react-day-picker/locale'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { FormField } from '@/shared/form/components/form-field'
import { createFormField } from '@/shared/form/lib'

const toLocalISO = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm")

const parseValue = (value: string) => {
  const date = value ? new Date(value) : undefined
  const isValid = date && !isNaN(date.getTime())
  return {
    date: isValid ? date : undefined,
    time: value.split('T')[1] ?? '08:00',
  }
}

export const DateTimeField = createFormField<typeof Button, string>(
  ({ formField, props }) => {
    const { field, texts } = formField

    const value: string = field.state.value ?? ''
    const { date, time } = parseValue(value)

    return (
      <FormField formField={formField}>
        {(FieldControl) => (
          <Popover>
            <FieldControl>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start font-normal',
                    !date && 'text-muted-foreground',
                  )}
                  {...props}
                >
                  <CalendarIcon />
                  {date
                    ? format(date, 'dd.MM.yyyy, HH:mm')
                    : texts.placeholder || 'Datum & Uhrzeit wählen'}
                </Button>
              </PopoverTrigger>
            </FieldControl>
            <PopoverContent className="w-full p-0" align="start">
              <Calendar
                mode="single"
                locale={de}
                selected={date}
                onSelect={(selected) => {
                  if (!selected) return

                  const [h, m] = time.split(':')
                  selected.setHours(Number(h), Number(m))

                  field.handleChange(toLocalISO(selected))
                  field.handleBlur()
                }}
              />
              <Separator />
              <div className="flex items-center gap-2 p-3">
                <Clock className="text-muted-foreground size-4" />
                <Label htmlFor={`${field.name}-time`}>Uhrzeit</Label>
                <Input
                  id={`${field.name}-time`}
                  type="time"
                  value={time}
                  onChange={(e) => {
                    const day = date ?? new Date()
                    field.handleChange(
                      format(day, 'yyyy-MM-dd') + 'T' + e.target.value,
                    )
                    field.handleBlur()
                  }}
                  className="ml-auto w-auto"
                />
              </div>
            </PopoverContent>
          </Popover>
        )}
      </FormField>
    )
  },
)
