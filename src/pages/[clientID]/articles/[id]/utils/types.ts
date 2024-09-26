import type { CustomFieldType } from '~/graphql-operations'

export enum FieldType {
  Text = 'TEXT',
  Number = 'NUM',
  Bool = 'BOOL',
  File = 'FILE',
  URL = 'URL',
  Color = 'COLOR',
  Date = 'DATE',
  RichText = 'RICHTEXT',
  Json = 'JSON',
  Ref = 'REF',
}

export enum FieldTypeMap {
  boolean = 'Bool',
  color = 'Color',
  date = 'Date',
  file = 'File',
  json = 'Json',
  number = 'Number',
  richText = 'RichText',
  text = 'Text',
  url = 'URL',
}

export interface MetaFieldValue {
  __typename: string
  id: string
  [value: string]: string | number | boolean | Date | unknown
}

export interface MetaFields {
  id: string
  key: string
  type: CustomFieldType
  values: MetaFieldValue[]
  group: {
    id: string
    key: string
  }
}
