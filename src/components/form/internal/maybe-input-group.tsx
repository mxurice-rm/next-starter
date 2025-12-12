import { ReactNode } from 'react'
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group'
import { InputGroupAddon as TInputGroupAddon } from '@/lib/form/types'

export const MaybeInputGroup = ({
  addons,
  children,
}: {
  addons?: TInputGroupAddon[]
  children: (hasAddons: boolean) => ReactNode
}) => {
  const hasAddons = addons && addons.length > 0

  if (!hasAddons) {
    return children(false)
  }

  return (
    <InputGroup>
      {addons.map((addon, index) => (
        <InputGroupAddon key={index} align={addon.align}>
          {addon.content}
        </InputGroupAddon>
      ))}
      {children(true)}
    </InputGroup>
  )
}
