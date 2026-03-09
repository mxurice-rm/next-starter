import { Check, ChevronsUpDown, XIcon } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { FormField } from '@/shared/form/components/form-field'
import { createFormField } from '@/shared/form/lib'
import type { SelectOption } from '@/shared/form/lib/types'

interface ComboboxFieldProps {
  options: SelectOption[]
}

export const ComboboxField = createFormField<
  typeof PopoverTrigger,
  string[],
  ComboboxFieldProps
>(({ formField, props }) => {
  const { options, ...restProps } = props
  const { field, texts } = formField

  const values: string[] = field.state.value ?? []

  const toggleValue = (value: string) => {
    const next = values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value]
    field.handleChange(next)
    field.handleBlur()
  }

  const removeValue = (value: string) => {
    field.handleChange(values.filter((v) => v !== value))
    field.handleBlur()
  }

  return (
    <FormField formField={formField}>
      {(FieldControl) => (
        <Popover>
          <FieldControl>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-auto min-h-9 w-full justify-between py-1.5 font-normal whitespace-normal',
                  values.length === 0 && 'text-muted-foreground',
                )}
                {...restProps}
              >
                {values.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {values.map((value) => {
                      const option = options.find((o) => o.value === value)
                      return (
                        <Badge
                          key={value}
                          variant="secondary"
                          className="gap-1 pr-1"
                        >
                          {option?.label}
                          <span
                            role="button"
                            tabIndex={-1}
                            aria-label={`${option?.label} entfernen`}
                            className="hover:bg-muted-foreground/20 rounded-xs p-0.5"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation()
                              removeValue(value)
                            }}
                          >
                            <XIcon className="size-3" />
                          </span>
                        </Badge>
                      )
                    })}
                  </div>
                ) : (
                  texts.placeholder || ''
                )}
                <ChevronsUpDown />
              </Button>
            </PopoverTrigger>
          </FieldControl>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command>
              <CommandInput placeholder="Suchen..." />
              <CommandList>
                <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => toggleValue(option.value)}
                    >
                      {option.label}
                      {values.includes(option.value) && (
                        <Check className="absolute right-2" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </FormField>
  )
}).withOptions({ singleField: true })
