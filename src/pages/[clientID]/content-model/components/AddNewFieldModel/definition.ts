import { CustomFieldType } from '~/graphql-operations'
import type { CustomFieldOptions, Maybe } from '~/graphql-operations'

export interface NewCustomField {
  type: CustomFieldType
  icon: string
  name: string
  info: string
  options: string[]
}
export interface BasicCustomFieldInput {
  id?: string
  name: string
  key: string
  description?: string
  type: CustomFieldType
  options?: Maybe<CustomFieldOptions>
}

const TEXT_OPTIONS = ['max', 'min', 'multiline', 'regex', 'repeat', 'required']
const NUMBER_OPTIONS = ['float', 'max', 'min', 'repeat', 'required']
const DATE_OPTIONS = ['repeat', 'required', 'time']
const REFERENCE_OPTIONS = ['required', 'target', 'multiple']
const SELECT_OPTIONS = ['required', 'choices', 'multiple']
const IGNORE_OPTIONS = ['ignore', 'repeat', 'required']

export const referenceTarget = ['article', 'desk', 'tag', 'user']

// not implement `JSON`, `Rich text` and `Reference` yet
export const fields: NewCustomField[] = [
  // {
  //   type: CustomFieldType.RichText,
  //   icon: '',
  //   name: 'Rich text',
  //   info: 'Text formatting with references and media',
  // },
  {
    type: CustomFieldType.Text,
    icon: 'text',
    name: 'Text',
    info: 'Titles, names, paragraphs, lists of names.',
    options: TEXT_OPTIONS,
  },
  {
    type: CustomFieldType.Number,
    icon: 'list_number',
    name: 'Number',
    info: 'Review rating, quantity, reader ID.',
    options: NUMBER_OPTIONS,
  },
  {
    type: CustomFieldType.Date,
    icon: 'calendar',
    name: 'Date and time',
    info: 'Event dates',
    options: DATE_OPTIONS,
  },
  {
    type: CustomFieldType.File,
    icon: 'gallery',
    name: 'Media',
    info: 'Images, videos, PDFs, and other files',
    options: IGNORE_OPTIONS,
  },
  {
    type: CustomFieldType.Boolean,
    icon: 'boolean',
    name: 'Boolean',
    info: 'Yes or no, 1 or 0, true or false.',
    options: IGNORE_OPTIONS,
  },
  // {
  //   type: CustomFieldType.Json,
  //   icon: 'code_2',
  //   name: 'JSON object',
  //   info: 'Text formatting with references and media',
  //   options: IGNORE_OPTIONS,
  // },
  // {
  //   type: CustomFieldType,
  //   icon: 'swap-replace',
  //   name: 'Reference',
  //   info: 'For example, an article can reference a related article.',
  // },
  {
    type: CustomFieldType.Color,
    icon: 'color',
    name: 'Color',
    info: 'A field to store a HEX code value.',
    options: IGNORE_OPTIONS,
  },
  { type: CustomFieldType.Url, icon: 'link_variant', name: 'URL', info: 'A link.', options: IGNORE_OPTIONS },
  {
    type: CustomFieldType.Reference,
    icon: 'swap-replace',
    name: 'Reference',
    info: 'For example, an article can reference a related article.',
    options: REFERENCE_OPTIONS,
  },
  {
    type: CustomFieldType.Select,
    icon: 'arrow-down',
    name: 'Select',
    info: 'Select one or multiple items from a pre-defined list.',
    options: SELECT_OPTIONS,
  },
]
