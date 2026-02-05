import { ReactNode } from 'react'
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group'
import { FieldAddon } from '@/shared/form/lib/types'

export const MaybeInputGroup = ({
  addons,
  children,
}: {
  addons?: FieldAddon[]
  children: (hasAddons: boolean) => ReactNode
}) => {
  const hasAddons = addons && addons.length > 0

  if (!hasAddons) {
    return children(false)
  }

  return (
    <InputGroup>
      {addons.map((addon, index) => (
        <InputGroupAddon key={index} align={addon.position}>
          {addon.content}
        </InputGroupAddon>
      ))}
      {children(true)}
    </InputGroup>
  )
}
