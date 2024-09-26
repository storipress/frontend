import freeEmailDomains from 'free-email-domains'
import { z } from 'zod'

const emailSchema = z.string().email()

export function isEmail(str: string) {
  return emailSchema.safeParse(str).success
}

export function isCompanyEmail(email: string) {
  // check user domain with free email domain list
  const parts = email.split('@')
  const domain = parts[1]
  return !freeEmailDomains.includes(domain)
}
