import { number as yupNumber, object as yupObject, string as yupString } from 'yup'
import type { AnySchema } from 'yup'
import { useForm } from 'vee-validate'
import type { Ref } from 'vue'
import invariant from 'tiny-invariant'
import { Base64 } from 'js-base64'
import ky from 'ky'
import { toMD5 } from './upload-image'
import {
  CreateCustomFieldValueDocument,
  CustomFieldType,
  DeleteCustomFieldValueDocument,
  RequestPresignedUploadUrlDocument,
  UpdateCustomFieldValueDocument,
} from '~/graphql-operations'
import type {
  CustomField,
  CustomFieldGroup,
  CustomFieldValue,
  GetArticleContentBlockQuery,
  GetCustomFieldGroupQuery,
} from '~/graphql-operations'
import type {
  CustomFieldMeta,
  CustomFieldOptions as MetaCustomFieldOptions,
  RepeatCustomFieldValue,
} from '~/components/CustomField/definition'

type customFieldGroup = NonNullable<GetCustomFieldGroupQuery['customFieldGroup']>
type customFieldGroupFields = customFieldGroup['fields'][number]
export type CustomFieldOptions = NonNullable<customFieldGroupFields['options']> & MetaCustomFieldOptions

type Id = string
export type MetaMap = Record<Id, CustomFieldValue[]>
export type CustomFields = Omit<CustomField, 'values' | 'group'> & { group: Pick<CustomFieldGroup, 'key'> }

type Article = NonNullable<GetArticleContentBlockQuery['article']>
type ArticleContentBlocksValues = Article['content_blocks']
export type FieldValues = ArticleContentBlocksValues

interface GenerateSchemaParameters {
  name: string
  min?: number
  max?: number
  regex?: string
}
type SchemaHandle = (parameters: GenerateSchemaParameters) => AnySchema

export function inputIsEmpty(input: unknown) {
  if (typeof input !== 'boolean') {
    return !input || (Array.isArray(input) && input.length === 0) || Object.keys(input).length === 0
  }
  return false
}

export function useCustomFields(customFields: Ref<CustomFields[]>, fieldValues: Ref<FieldValues>) {
  const meta = ref<CustomFieldMeta<CustomFieldOptions>[]>([])
  const editedValues = ref<Map<Id, CustomFieldMeta<CustomFieldOptions>>>(new Map())
  const isUploadingFile = ref(false)

  const repeatValue = (val: RepeatCustomFieldValue, index: number) => {
    meta.value.splice(index, 0, {
      value: null,
      validateKey: randString(`${val.field.key}-`),
      field: { ...val.field },
      group: { ...val.group },
      isRepeating: val.isRepeating,
    })
  }

  // convert values to object `id => values array`
  const metaMap = computedEager(() => {
    const fields = fieldValues.value
    const map: MetaMap = {}
    Object.assign(
      map,
      ...fields
        .filter((field) => !field.key.startsWith('__'))
        .map(({ id, values }) => ({ [id]: values.length ? [...values] : [{ value: null }] })),
    )
    return map
  })

  // convert fields + values -> form values
  watch(
    [customFields, metaMap],
    ([fields, map]) => {
      meta.value = fieldsToFormValues(fields, map)
    },
    { immediate: true },
  )

  const { mutate: requestPresignedUploadURL } = useMutation(RequestPresignedUploadUrlDocument)

  const uploadFile = async (file: File) => {
    const hash = await toMD5(file)
    const md5 = Base64.btoa(hash)

    const presignedURLResponse = await requestPresignedUploadURL({ md5 })
    invariant(presignedURLResponse?.data, 'cannot create presigned url')
    const { key, url: uploadURL } = presignedURLResponse.data.requestPresignedUploadURL
    await ky.put(uploadURL, {
      body: file,
      headers: {
        'Content-Type': file.type,
        'Content-MD5': md5,
      },
      timeout: false,
    })

    return key
  }

  const DEFAULT_VALUE = {
    text: '',
    boolean: false,
    number: null,
    color: null,
    url: '',
    file: null,
    date: null,
    json: '',
    richText: '',
    select: [],
    reference: [],
  }
  const { mutate: createCustomFieldValueMutate } = useMutation(CreateCustomFieldValueDocument)
  const newValues = computed(() =>
    meta.value.filter((meta) => {
      if (meta.field.type === 'file') {
        return !meta.id && meta.value
      }
      return !meta.id
    }),
  )

  const createCustomFieldValue = async (targetId: string) => {
    const addCustomFieldValuePromise = newValues.value.map(async (item) => {
      const { field, value } = item
      let result
      if (field.type === 'file') {
        if (!value) {
          return
        }
        isUploadingFile.value = true
        const key = await uploadFile(value)
        result = key
      } else {
        result = value || DEFAULT_VALUE[field.type]

        if (field.type === 'url' && result && /^(?!http|https).*/.test(result)) {
          result = `https://${result}`
        }
      }

      if (inputIsEmpty(result)) return

      const res = await createCustomFieldValueMutate({
        input: {
          id: field.id,
          target_id: targetId,
          value: field.type === 'json' ? JSON.stringify(result) : result,
        },
      })
      if (res?.data?.createCustomFieldValue.id) {
        const id = res?.data?.createCustomFieldValue.id
        item.id = id
      }
      return res
    })
    const results = await Promise.all(addCustomFieldValuePromise)
    isUploadingFile.value = false

    return {
      ids: results.map((res) => res?.data?.createCustomFieldValue.id).filter((x): x is string => Boolean(x)),
      results,
    }
  }

  const { mutate: updateCustomFieldValueMutate } = useMutation(UpdateCustomFieldValueDocument)
  const { mutate: deleteCustomFieldValueMutate } = useMutation(DeleteCustomFieldValueDocument)

  const editCustomFieldValue = async () => {
    if (!editedValues.value.size) {
      return
    }
    const promise = []
    const deletePromise = []
    for (const { id, type, value, field } of editedValues.value.values()) {
      if (type === 'update') {
        let result = value || DEFAULT_VALUE[field.type]
        if (field.type === 'url' && result && /^(?!http|https).*/.test(result)) {
          result = `https://${result}`
        }

        promise.push(
          updateCustomFieldValueMutate({
            input: {
              id: id!,
              value: field.type === 'json' ? JSON.stringify(result) : result,
            },
          }),
        )
      } else if (type === 'delete') {
        deletePromise.push(deleteCustomFieldValueMutate({ id: id! }))
      }
    }
    const updateResults = await Promise.all(promise)
    const deleteResults = await Promise.all(deletePromise)
    editedValues.value.clear()
    return { updateResults, deleteResults }
  }

  const schema = ref({})
  const { handleSubmit } = useForm({
    validationSchema: schema,
  })
  // use for generating validation options
  const GAIN_OPTIONS_MAP = new Map<string, { min: string; max: string; regex?: string }>()
    .set('CustomFieldTextOptions', { min: 'textMin', max: 'textMax', regex: 'regex' })
    .set('CustomFieldNumberOptions', { min: 'numberMin', max: 'numberMax' })
  const getOptions = (options: CustomFieldOptions) => {
    if (!options.__typename || !GAIN_OPTIONS_MAP.get(options.__typename)) {
      return
    }
    const result = {}
    for (const [key, value] of Object.entries(GAIN_OPTIONS_MAP.get(options.__typename) || {})) {
      // @ts-expect-error convert options
      Object.assign(result, { ...(options[value] && { [key]: options[value] }) })
    }
    return result
  }
  const generateFieldSchema = (key: string, values: GenerateSchemaParameters, schemaHandle: SchemaHandle) => {
    return { [key]: schemaHandle({ ...values }) }
  }
  watch(
    meta,
    (metaValue) => {
      const result = metaValue.reduce((acc, cur) => {
        const { options, name } = cur.field
        if (options?.__typename === 'CustomFieldTextOptions') {
          const opts = getOptions(options)
          const schema = generateFieldSchema(cur.validateKey, { name, ...opts }, generateTextSchema)

          return Object.assign(acc, schema)
        } else if (options?.__typename === 'CustomFieldNumberOptions') {
          const opts = getOptions(options)
          const schema = generateFieldSchema(cur.validateKey, { name, ...opts }, generateNumberSchema)

          return Object.assign(acc, schema)
        } else if (options?.__typename === 'CustomFieldColorOptions') {
          const schema = generateFieldSchema(cur.validateKey, { name }, generateColorSchema)

          return Object.assign(acc, schema)
        } else if (options?.__typename === 'CustomFieldUrlOptions') {
          const schema = generateFieldSchema(cur.validateKey, { name }, generateUrlSchema)

          return Object.assign(acc, schema)
        } else {
          return acc
        }
      }, {})

      schema.value = yupObject(result)
    },
    { immediate: true },
  )

  return {
    meta: meta as Ref<CustomFieldMeta<CustomFieldOptions>[]>,
    newValues,
    editedValues,
    isUploadingFile,
    isEdited: computed(() => newValues.value.length > 0 || editedValues.value.size > 0),
    uploadFile,
    repeatValue,
    handleSubmit,
    createCustomFieldValue,
    editCustomFieldValue,
    createCustomFieldValueMutate,
    updateCustomFieldValueMutate,
  }
}

export function fieldsToFormValues(fields: CustomFields[], map: MetaMap): CustomFieldMeta<CustomFieldOptions>[] {
  return fields
    .filter((field) => isFieldEditable(field))
    .flatMap((field) => {
      const { options, ...opts } = field
      const fieldValues = map[field.id] ?? []
      invariant(Array.isArray(fieldValues), 'fieldValues is not array')
      return fieldValues.map((result, idx): CustomFieldMeta<CustomFieldOptions> => {
        return {
          ...(options?.repeat && idx === 0 && { repeat: options.repeat }),
          ...(options?.repeat && idx !== 0 && { isRepeating: options.repeat }),
          ...switchValue(result),
          validateKey: `${opts.type}-${opts.key}-${result.id}`,
          field: { options, ...opts },
          group: opts.group,
        } as CustomFieldMeta<CustomFieldOptions>
      })
    })
}

function isFieldEditable(field: CustomFields): unknown {
  // If keys starts with __, it's a internal field
  return !field.key.startsWith('__') && !isUnsupportedReferenceField(field)
}

export function isUnsupportedReferenceField(field: CustomFields) {
  return (
    field.options?.__typename === 'CustomFieldReferenceOptions' &&
    field.options?.type === CustomFieldType.Reference &&
    field.options.target == null
  )
}

function randString(prefix: string) {
  return Math.random()
    .toString(36)
    .replace('0.', prefix || '')
}

function generateTextSchema({ name = '', min = 0, max = 999999, regex = '' }) {
  const valueRegex = new RegExp(regex?.replaceAll('/', ''))
  return yupString()
    .default('')
    .min(min)
    .max(max)
    .test((value) => (regex ? valueRegex.test(value) : true))
    .nullable()
    .label(name)
}

function generateNumberSchema({ name = '', min = 0, max = 999999 }) {
  return yupNumber()
    .typeError('must specify a number')
    .transform((v, o) => (o === '' ? null : v))
    .default(0)
    .nullable()
    .min(min)
    .max(max)
    .label(name)
}

function generateColorSchema({ name = '' }) {
  const colorRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
  return yupString()
    .default('')
    .test((value) => (value ? colorRegex.test(value) : true))
    .nullable()
    .label(name)
}

function generateUrlSchema({ name = '' }) {
  return yupString()
    .default('')
    .url()
    .transform((value, originalValue) => {
      if (value && /^(?!http|https).*/.test(value)) {
        return `https://${originalValue}`
      }
      return value
    })
    .nullable()
    .label(name)
}

const SWITCH_VALUE_MAP: Record<string, string> = {
  CustomFieldNumberValue: 'numberValue',
  CustomFieldBooleanValue: 'booleanValue',
  CustomFieldJsonValue: 'jsonValue',
  CustomFieldRichTextValue: 'jsonValue',
  CustomFieldFileValue: 'fileValue',
  CustomFieldDateValue: 'dateValue',
  CustomFieldSelectValue: 'selectValue',
  CustomFieldReferenceValue: 'referenceValue',
}
function switchValue(values: { __typename?: string } & Record<string, unknown>) {
  if (values?.__typename) {
    const valueKey = SWITCH_VALUE_MAP[values.__typename]
    return { value: values[valueKey], ...values }
  } else {
    return { id: values.id, value: values.value }
  }
}
