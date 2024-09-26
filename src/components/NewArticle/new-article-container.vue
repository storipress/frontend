<script lang="ts" setup>
import { useVModel, whenever } from '@vueuse/core'
import { logicAnd } from '@vueuse/math'
import { ApolloError } from '@apollo/client/core'
import type { Desk, NewArticleInput } from './definitions'
import NewArticle from './new-article.vue'
import { useCreateArticle } from './helper'
import { useWorkspaceStore } from '~/stores/workspace'
import { useDesks, useNotification } from '~/composables'

const props = defineProps<{
  maybeDeskId?: string | Desk | undefined
  openEditor: boolean
  options: Omit<NewArticleInput, 'desk' | 'openEditor'>
  modelValue: boolean
}>()

const emit = defineEmits<(event: 'update:modelValue', val: boolean) => void>()

const router = useRouter()
const { mutate, optimisticResponse } = useCreateArticle()
const { desks, refetch } = useDesks()
const open = useVModel(props, 'modelValue', emit, { passive: true, defaultValue: false })

const workspaceStore = useWorkspaceStore()
const publication = computed(() => workspaceStore.currentWorkspace?.name || '')
const initialDesk = ref<Desk | undefined>()

whenever(
  logicAnd(open, () => props.maybeDeskId),
  () => {
    if (typeof props.maybeDeskId === 'string') {
      initialDesk.value = desks.value
        .flatMap((desk) => [desk, ...desk.desks])
        .find((desk) => desk.id === props.maybeDeskId)
    } else {
      initialDesk.value = props.maybeDeskId
    }
  },
  { flush: 'sync', immediate: true },
)

async function handleSubmit({
  title,
  blurb,
  desk,
  authors,
}: {
  title: string
  blurb: string
  desk: string
  authors: string[]
}) {
  const input = {
    ...props.options.extraFields,
    title,
    blurb,
    desk_id: desk,
    author_ids: authors,
  }
  try {
    const res = await mutate(
      { input },
      !props.openEditor
        ? {
            optimisticResponse: optimisticResponse({ input }),
            update: (cache, { data }) => {
              props.options.updateApolloCache?.(cache, data)
            },
          }
        : undefined,
    )

    open.value = false

    const id = res?.data?.createArticle.id
    if (!id || !props.openEditor) {
      return
    }

    router.push({
      name: 'clientID-articles-id-edit',
      params: {
        clientID: router.currentRoute.value.params.clientID,
        id,
      },
    })
  } catch (error) {
    handleError(error)

    await refetch()
  }
}

const { create: notifications } = useNotification()
function handleError(error: unknown) {
  const isApolloError = error instanceof ApolloError
  const defaultMessage = {
    title: 'Error',
    type: 'warning',
    iconName: 'warning',
    content: 'An error occurred. Try again later.',
  } as const

  if (!isApolloError) {
    notifications(defaultMessage)
    return
  }

  const validationError = new Set(Object.keys(error?.graphQLErrors?.[0]?.extensions?.validation ?? {}))
  if (validationError.has('desk_id')) {
    notifications({
      title: 'Error',
      type: 'warning',
      iconName: 'warning',
      content: 'Unable to create an article in the selected Desk, possibly because the Desk has been deleted.',
    })
    return
  }

  notifications(defaultMessage)
}
</script>

<template>
  <NewArticle v-model="open" :initial-desk="initialDesk" :publication="publication" @submit="handleSubmit" />
</template>
