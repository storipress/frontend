import { array as yupArray, object as yupObject } from 'yup'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { destr } from 'destr'
import { useWebflowCollection } from '../composables'
import type {
  GetWebflowCollectionQuery,
  UpdateWebflowCollectionMappingValueInput,
  WebflowCollectionFieldCandidate,
  WebflowCollectionType,
} from '~/graphql-operations'

export type WebflowCollection = GetWebflowCollectionQuery['webflowCollection']

export interface UseMappingDialogInput {
  collection: WebflowCollection
  isActivated: boolean
  collectionType: WebflowCollectionType
}

const TYPE_UNSUPPORTED_CUSTOM_FIELD = new Set(['author', 'desk', 'tag'])

export function useMappingDialog(input: UseMappingDialogInput) {
  const noCustomFieldSupport = computed(() => TYPE_UNSUPPORTED_CUSTOM_FIELD.has(input.collectionType))
  const { loading: isLoading, updateCollectionMapping } = useWebflowCollection()

  const syncList = reactive(new Map<string, UpdateWebflowCollectionMappingValueInput>())

  const schema = toTypedSchema(
    yupObject().shape({
      webflowFields: yupArray().of(
        yupObject()
          .test((value, { options, createError }) => {
            // Yup's context will have array index in `options`
            const field = input.collection?.fields[(options as Record<string, number>).index]

            if (input.collection?.mappings && field?.isRequired && !value) {
              return createError({
                message:
                  !field?.candidates?.length && noCustomFieldSupport.value
                    ? 'This field cannot be set as required'
                    : 'This is required field',
              })
            } else {
              return true
            }
          })
          .label('This'),
      ),
    }),
  )

  const form = useForm({
    validationSchema: schema,
    validateOnMount: true,
  })

  // sometime the initial value is not loaded yet, so we need to manually set the initial value
  whenever(
    () => input.collection?.mappings,
    (mappings) => {
      const map = destr<Record<string, string | null>>(mappings)
      const fields = input.collection?.fields ?? []
      for (const [index, field] of fields.entries()) {
        const { id } = field
        if (map[id]) {
          // We only use vee-validate to validate required fields
          // Here we need to correctly set the initial value or we could get a validation error
          form.setFieldValue(`webflowFields.${index}`, {})
        }
      }
    },
  )

  const hasValidationError = computed(() => Object.keys(form.errors.value).length > 0)

  const onSubmit = form.handleSubmit(async () => {
    if (!input.isActivated || hasValidationError.value) return
    await updateCollectionMapping({
      type: input.collectionType,
      value: Array.from(syncList.values()),
    })
  })

  // `candidate` can be undefined on optional field
  function updateSyncList(candidate: WebflowCollectionFieldCandidate | undefined, webflowId: string) {
    if (!candidate?.value) return
    syncList.set(webflowId, { webflow_id: webflowId, storipress_id: candidate.value })
  }

  return {
    form,
    isLoading,
    onSubmit,
    validate: form.validate,
    hasValidationError,
    updateSyncList,
  }
}
