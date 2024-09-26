export interface CustomFieldInput {
  id?: string
  name: string
  key: string
  description?: string
  required: boolean
  repeat: boolean
  multiline?: boolean
  min?: number
  max?: number
  regex?: string
  multiple?: boolean
  target?: string
  choices?: Record<string, string>
}
