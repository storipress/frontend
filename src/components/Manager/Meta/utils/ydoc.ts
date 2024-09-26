import type * as Y from 'yjs'
import { TextAreaBinding } from 'y-textarea'
import * as Sentry from '@sentry/vue'
import { Array, Effect, pipe } from 'effect'
import type { TextAreaBinding as TypeTextAreaBinding } from 'y-textarea'
import type { DeferredPromise } from 'p-defer'
import type { z } from 'zod'
import type { TMetaStore } from './store'
import { useMetaStore } from './store'
import { authorsSchema, enableSchema, featureSchema, tagsSchema, userSchema } from './schema'
import type { MediaEnableSetting, MediaUserSetting } from '.'
import type { Author, FormModel, TCover, Tag } from '~/pages/[clientID]/articles/[id]/edit/types'
import { updateYDocText } from '~/pages/[clientID]/articles/[id]/edit/utils/utils'
import { useEditorStore } from '~/stores/editor'
import {
  AddAuthorToArticleDocument,
  AddTagToArticleDocument,
  GetTagsDocument,
  RemoveAuthorFromArticleDocument,
  RemoveTagFromArticleDocument,
} from '~/graphql-operations'
import { env } from '~/env'
export type TYdocValue = string | Tag[] | Author[] | MediaEnableSetting | MediaUserSetting | TCover | boolean

interface IYdocField<ItemType extends z.ZodTypeAny> {
  ydoc: Y.Doc
  name: string
  schema: ItemType
  initValue?: ItemType['_output']
  writeToModel?: (value: ItemType['_output'], name: string) => void
  shouldObserve?: boolean
}

export interface IDefineYdocMapReturn<Output> {
  ydocMap: Y.Map<Output>
  showValue: globalThis.Ref<Output>
  set: (value: Output) => void
  get: () => Output | undefined
}

interface IYdocListField<ItemType extends z.ZodTypeAny, ListItem> extends IYdocField<ItemType> {
  mutateAdd: (value: ListItem, context: IDefineYdocMapReturn<ItemType['_output']>) => Promise<void>
  mutateRemove: (value: ListItem, context: IDefineYdocMapReturn<ItemType['_output']>) => Promise<void>
  refetch?: () => Promise<void>
}

export function checkIfDuplicated(inputValue: string) {
  if (!inputValue) return false
  const halfIndex = Math.ceil(inputValue.length / 2)
  if (halfIndex * 2 === inputValue.length) {
    const frontString = inputValue.slice(0, halfIndex)
    const afterString = inputValue.slice(halfIndex)
    if (frontString.includes(afterString)) {
      return true
    }
  }
  return false
}

export function setAPIStatus(value: boolean) {
  const editorStore = useEditorStore()
  editorStore.SET_API_IS_RUNNING(value)
}

export function defineYdocMap<ItemType extends z.ZodTypeAny>({
  ydoc,
  name,
  initValue,
  schema,
  writeToModel,
  shouldObserve = true,
}: IYdocField<ItemType>): IDefineYdocMapReturn<ItemType['_output']> {
  const ydocMap = ydoc.getMap<ItemType['_output']>(name)
  const showValue: Ref<ItemType['_output']> = ref(initValue ?? undefined)

  if (shouldObserve) {
    ydocMap.observe(() => {
      showValue.value = ensureValidate({ name, schema, value: ydocMap.get(name) })
      if (writeToModel) {
        writeToModel(showValue.value, name)
      }
    })
  }

  return {
    ydocMap,
    showValue,
    set: (value: ItemType['_output']) => {
      ydocMap.set(name, ensureValidate({ name, schema, value }))
    },
    get: () => {
      return ydocMap.get(name)
    },
  }
}

export function defineYdocMapList<ItemType extends z.ZodTypeAny, ListItem>({
  ydoc,
  name,
  schema,
  writeToModel,
  mutateAdd,
  mutateRemove,
  refetch,
}: IYdocListField<ItemType, ListItem>) {
  const ctx = defineYdocMap({
    ydoc,
    name,
    schema,
    writeToModel,
    shouldObserve: false,
  })

  ctx.ydocMap.observe(() => {
    if (refetch) {
      refetch()
    }
    ctx.showValue.value = ensureValidate({ name, schema, value: ctx.ydocMap.get(name) })
    if (writeToModel) {
      writeToModel(ctx.showValue.value, name)
    }
  })

  return {
    ...ctx,
    mutateAdd: (item: ListItem) => mutateAdd(item, ctx),
    mutateRemove: (item: ListItem) => mutateRemove(item, ctx),
  }
}

interface EnsureValidateInput<Schema extends z.ZodTypeAny> {
  name: string
  schema: Schema
  value: z.infer<Schema>
}

function ensureValidate<Schema extends z.ZodTypeAny>({
  name,
  schema,
  value,
}: EnsureValidateInput<Schema>): z.infer<Schema> {
  if (env.DEV) {
    return schema.parse(value)
  }

  const parsed = schema.safeParse(value)
  if (!parsed.success) {
    Sentry.captureException(new Error('ydocMap observe wrong value'), (scope) => {
      scope.setContext('ydocMap', { name, value, error: parsed.error })
      return scope
    })
  }
  return value
}

export function awaitInitApi(
  deferred: [DeferredPromise<unknown>, DeferredPromise<unknown>, DeferredPromise<unknown>],
  setAPIStatus: (status: boolean) => void,
) {
  return Effect.gen(function* ($) {
    setAPIStatus(true)
    yield* $(
      Effect.all(
        pipe(
          deferred,
          Array.map((d) => Effect.promise(() => d.promise)),
        ),
        { concurrency: 'unbounded' },
      ),
    )
    setAPIStatus(false)
  })
}

export function useConnectYdoc(
  id: string,
  ydoc: Y.Doc,
  formModel: FormModel,
  collaborationChangeArticle: (value: TYdocValue | undefined, column: string) => void,
) {
  const metaStore = useMetaStore()
  const editorStore = useEditorStore()
  const { refetch: refetchTags } = useQuery(GetTagsDocument)
  const { mutate: mutateAddAuthor } = useMutation(AddAuthorToArticleDocument)
  const { mutate: mutateRemoveAuthor } = useMutation(RemoveAuthorFromArticleDocument)
  const { mutate: mutateAddTag } = useMutation(AddTagToArticleDocument)
  const { mutate: mutateRemoveTag } = useMutation(RemoveTagFromArticleDocument)

  const ydocColMapping = {
    searchTitle: {
      id: '#searchTitleId',
      update: (value: string) => {
        metaStore.SET_SEARCH_TITLE(value)
      },
    },
    searchDescription: {
      id: '#searchDescriptionId',
      update: (value: string) => {
        metaStore.SET_SEARCH_DESCRIPTION(value)
      },
    },
    socialTitle: {
      id: '#socialTitleId',
      update: (value: string) => {
        metaStore.SET_SOCIAL_TITLE(value)
      },
    },
    socialDescription: {
      id: '#socialDescriptionId',
      update: (value: string) => {
        metaStore.SET_SOCIAL_DESCRIPTION(value)
      },
    },
    slug: {
      id: '#slugId',
      update: (value: string) => {
        metaStore.SET_SLUG(value)
      },
    },
    FBText: {
      id: '#FBTextId',
      update: (value: string) => {
        metaStore.SET_FB_TEXT(value)
      },
    },
    TWText: {
      id: '#TWTextId',
      update: (value: string) => {
        metaStore.SET_TW_TEXT(value)
      },
    },
    LNText: {
      id: '#LNTextId',
      update: (value: string) => {
        metaStore.SET_LN_TEXT(value)
      },
    },
  }
  const editorElementsBinding = ref<TypeTextAreaBinding[]>([])

  const ydocFeature = defineYdocMap({
    ydoc,
    name: 'feature',
    schema: featureSchema,
    writeToModel: collaborationChangeArticle,
  })

  const ydocTags = defineYdocMapList({
    ydoc,
    name: 'tags',
    schema: tagsSchema,
    writeToModel: collaborationChangeArticle,
    mutateAdd: async (e: Tag, { get, set }) => {
      const tags = (get() || []).filter((item) => item.name !== e.name)
      set([...tags, e])
      await mutateAddTag({
        id,
        tagId: e.id,
      })
    },
    mutateRemove: async (e: Tag, { get, set }) => {
      set(get()?.filter((item) => item.id !== e.id) ?? [])
      await mutateRemoveTag({
        id,
        tagId: e.id,
      })
    },
    refetch: async () => {
      await refetchTags()
    },
  })

  const ydocAuthors = defineYdocMapList({
    ydoc,
    name: 'authors',
    schema: authorsSchema,
    writeToModel: collaborationChangeArticle,
    mutateAdd: async (e: Author, { get, set }) => {
      const authors = (get() || []).filter((item) => item.id !== e.id)
      set([...authors, e])
      await mutateAddAuthor({
        id,
        userId: e.id,
      })
    },
    mutateRemove: async (e: Author, { get, set }) => {
      set(get()?.filter((item) => item.id !== e.id) || [])
      await mutateRemoveAuthor({
        id,
        userId: e.id,
      })
    },
  })

  const ydocEnable = defineYdocMap({
    ydoc,
    name: 'enable',
    schema: enableSchema,
    initValue: {
      Facebook: false,
      Twitter: false,
      LinkedIn: false,
    },
    writeToModel: (value) => {
      collaborationChangeArticle(value?.Facebook, 'FBEnable')
      collaborationChangeArticle(value?.Twitter, 'TWEnable')
      collaborationChangeArticle(value?.LinkedIn, 'LNEnable')
    },
  })

  const ydocUser = defineYdocMap({
    ydoc,
    name: 'user',
    schema: userSchema,
    initValue: {
      Facebook: {
        id: '',
        name: '',
        thumbnail: '',
      },
      Twitter: {
        id: '',
        name: '',
        thumbnail: '',
      },
      LinkedIn: {
        id: '',
        name: '',
        thumbnail: '',
      },
    },
    writeToModel: (value) => {
      collaborationChangeArticle(value?.Facebook.id ?? '', 'FBPageId')
      collaborationChangeArticle(value?.Twitter.id ?? '', 'TWUserId')
      collaborationChangeArticle(value?.LinkedIn.id ?? '', 'LNAuthorId')
    },
  })

  const ydocCover = ydoc.getMap<TCover>('cover')

  async function updateMetaStore(text: string, update: (value: string) => void, key: string) {
    update(text)
    collaborationChangeArticle(text, key)
  }

  function bindYdocInput() {
    Object.entries(ydocColMapping).forEach(([key, value]) => {
      const input = ydoc.getText(key)
      input?.observe((event: Y.YTextEvent) => {
        if (event.delta.length > 0) {
          const inputValue = event.target.toJSON()

          if (key === 'slug') {
            if (checkIfDuplicated(inputValue)) {
              sendTrackUnchecked(
                'ydoc_slug_duplicated',
                {
                  column: key,
                  inputValue,
                },
                true,
              )
            }
          }
          updateMetaStore(event.target.toJSON(), value.update, key)
        }
      })

      if (typeof formModel[key as keyof typeof formModel] === 'string' && !metaStore[key as keyof TMetaStore]) {
        const modelValue = (formModel[key as keyof typeof formModel] as string) ?? ''
        // input.toString() to check whether the input have initial value
        // if input have initial value, delete the initial value and insert the api value
        if (input.toString()) {
          updateYDocText(ydoc, input, modelValue)
        } else {
          // Ensure column always have value by update the metaStore
          updateMetaStore(modelValue, value.update, key)
        }
      }
      const element = document.querySelector(value.id) as HTMLInputElement | HTMLTextAreaElement
      if (element) {
        editorElementsBinding.value = editorElementsBinding.value.concat(new TextAreaBinding(input, element))
      }
    })
  }

  function destroyBindYdocInput() {
    editorElementsBinding.value.forEach((element) => {
      element.destroy()
    })
  }

  function initYdoc() {
    const { featured, FBEnable, TWEnable, LNEnable, authors, tags, coverUrl, coverAlt, coverCaption, coverCrop } =
      formModel
    ydocFeature.set(featured ? 'Featured' : 'Unfeatured')
    ydocTags.set(tags)
    ydocAuthors.set(authors)
    ydocEnable.set({
      Facebook: FBEnable ?? 'false',
      Twitter: TWEnable ?? 'false',
      LinkedIn: LNEnable ?? 'false',
    })
    ydocCover.set('cover', {
      url: coverUrl,
      alt: coverAlt,
      caption: coverCaption,
      crop: coverCrop,
    })
  }

  // Reset all metaStore values on component mount
  onMounted(async () => {
    metaStore.RESET_ALL()
    await Effect.runPromise(
      awaitInitApi(
        [editorStore.deferredGetArticle, editorStore.deferredGetYdoc, editorStore.deferredGetIndexedDB],
        setAPIStatus,
      ),
    )
    initYdoc()
    bindYdocInput()
  })

  onUnmounted(() => {
    destroyBindYdocInput()
    metaStore.RESET_ALL()
  })

  return {
    ydocTags,
    ydocAuthors,
    ydocFeature,
    ydocEnable,
    ydocUser,
  }
}
