import { Input } from '@/components/ui/input'
import { InputGroupInput } from '@/components/ui/input-group'
import { createTextInputField } from '../internal/create-text-input-field'

const TextField = createTextInputField<'input'>({
  Component: Input,
  GroupComponent: InputGroupInput,
})

export default TextField
