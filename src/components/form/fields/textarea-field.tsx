import { Textarea } from '@/components/ui/textarea'
import { InputGroupTextarea } from '@/components/ui/input-group'
import { createTextInputField } from '../internal/create-text-input-field'

const TextareaField = createTextInputField<'textarea'>({
  Component: Textarea,
  GroupComponent: InputGroupTextarea,
})

export default TextareaField
