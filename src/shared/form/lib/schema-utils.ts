import type { AnyFieldApi } from '@tanstack/react-form'

type RequiredIndicator = 'required' | 'optional' | null

// Zod v4 exposes internal state via `schema._zod.def`, but the shape of
// `def` varies by type (checks, shape, format, innerType, ...) and has no
// exported type — so we use a minimal duck-typed interface with `any` def.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ZodDef = Record<string, any>
type ZodSchema = { _zod?: { def?: ZodDef } }

const WRAPPER_TYPES = new Set(['optional', 'nullable', 'default', 'readonly'])

const def = (schema: ZodSchema | undefined) => schema?._zod?.def

const unwrap = (schema: ZodSchema | undefined): ZodSchema | undefined => {
  if (!schema) return undefined
  let current = schema
  while (WRAPPER_TYPES.has(def(current)?.type ?? '')) {
    const inner = def(current)?.innerType as ZodSchema | undefined
    if (!inner) break
    current = inner
  }
  return current
}

const hasCheck = (
  schema: ZodSchema | undefined,
  predicate: (c: ZodDef) => boolean,
): boolean =>
  (def(schema)?.checks as ZodSchema[] | undefined)?.some((check) => {
    const c = def(check)
    return c ? predicate(c) : false
  }) ?? false

const hasMinLength = (schema: ZodSchema | undefined): boolean =>
  hasCheck(schema, (c) => c.check === 'min_length' && c.minimum >= 1)

const isStringRequired = (schema: ZodSchema | undefined): boolean => {
  // z.email() / z.url() etc. → format on def level → rejects empty strings
  if (def(schema)?.format) return true
  // z.string().min(1) or z.string().email() → checks array
  return (
    hasMinLength(schema) || hasCheck(schema, (c) => c.check === 'string_format')
  )
}

export const resolveFieldSchema = (
  field: AnyFieldApi,
): ZodSchema | undefined => {
  const validators = (
    field.form.options as { validators?: Record<string, ZodSchema> }
  ).validators

  const schema = validators?.onSubmit ?? validators?.onSubmitAsync
  const shape = def(schema)?.shape as Record<string, ZodSchema> | undefined

  return shape?.[String(field.name)]
}

export const isFieldRequired = (
  schema: ZodSchema | undefined,
): RequiredIndicator => {
  const d = def(schema)
  if (!d) return null

  if (d.type === 'optional' || d.type === 'nullable') return 'optional'

  const inner = unwrap(schema)
  const innerType = def(inner)?.type
  if (!innerType) return null

  if (innerType === 'boolean') return null
  if (innerType === 'enum' || innerType === 'custom') return 'required'
  if (innerType === 'number' || innerType === 'int') return 'required'
  if (innerType === 'string')
    return isStringRequired(inner) ? 'required' : 'optional'
  if (innerType === 'array')
    return hasMinLength(inner) ? 'required' : 'optional'

  return null
}
