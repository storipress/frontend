import { z } from 'zod'
import type { IntegrationsKey } from '~/schema/integration'
import { IntegrationsDataSchema } from '~/schema/integration'

export { IntegrationsKey } from '~/schema/integration'

export function getDefaults<Schema extends z.ZodTypeAny>(schema: Schema): z.infer<Schema> {
  if (schema instanceof z.ZodObject) {
    return Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]) => {
        if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()]
        return [key, undefined]
      }),
    )
  }
  return []
}

export function createDefaultData<T extends IntegrationsKey>(key: T) {
  const schema = IntegrationsDataSchema.shape[key]
  return getDefaults(schema) as z.infer<typeof schema>
}
