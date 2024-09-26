import { z } from 'zod'

export const featureSchema = z.string()
export const tagsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
)
export const authorsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string(),
  }),
)
export const enableSchema = z.object({
  Facebook: z.boolean(),
  Twitter: z.boolean(),
  LinkedIn: z.boolean(),
})
export const userSchema = z.object({
  Facebook: z.object({
    id: z.string(),
    name: z.string(),
    thumbnail: z.string(),
  }),
  Twitter: z.object({
    id: z.string(),
    name: z.string(),
    thumbnail: z.string(),
  }),
  LinkedIn: z.object({
    id: z.string(),
    name: z.string(),
    thumbnail: z.string(),
  }),
})
