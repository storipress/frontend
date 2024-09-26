import type { BasicCustomFieldInput } from '../AddNewFieldModel/definition'
import type { CustomFieldGroupType, CustomFieldOptions, CustomFieldType, Maybe } from '~/graphql-operations'

interface BasicCustomField {
  id?: string
  name: string
  key: string
  type: CustomFieldType
  options?: Maybe<CustomFieldOptions>
}

export interface CustomFieldGroupData<T extends BasicCustomField = BasicCustomFieldInput> {
  id: string
  key: string
  name: string
  description?: string | null
  type: CustomFieldGroupType
  fields: T[]
}
