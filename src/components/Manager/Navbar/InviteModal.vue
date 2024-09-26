<!-- Invite collaborators button -->
<script lang="ts" setup>
import type * as Y from 'yjs'
import { captureException } from '@sentry/vue'
import { MenuButton } from '@headlessui/vue'
import { Buttons, Dropdowns, Icon, MenuItem, SelectTypeahead } from '@storipress/core-component'
import { Modals } from './Modals'
import { defineYdocMapList } from '~/components/Manager/Meta/utils/ydoc'
import { authorsSchema } from '~/components/Manager/Meta/utils/schema'
import type { Author } from '~/pages/[clientID]/articles/[id]/edit/types'
import { AddAuthorToArticleDocument, RemoveAuthorFromArticleDocument } from '~/graphql-operations'
import type { ListSimpleUsersQuery } from '~/graphql-operations'
import { useWorkspaceStore } from '~/stores/workspace'

const props = defineProps<{
  id: string
  ydoc: Y.Doc
  open: boolean
  userList: ListSimpleUsersQuery | undefined
}>()

const emits = defineEmits(['modalClose'])
const workspaceStore = useWorkspaceStore()
const { mutate: mutateAddAuthor } = useMutation(AddAuthorToArticleDocument)
const { mutate: mutateRemoveAuthor } = useMutation(RemoveAuthorFromArticleDocument)
const ydocAuthors = defineYdocMapList({
  ydoc: props.ydoc,
  name: 'authors',
  schema: authorsSchema,
  mutateAdd: async (e: Author, { get, set }) => {
    const authors = (get() || []).filter((item) => item.id !== e.id)
    set([...authors, e])
    await mutateAddAuthor({
      id: props.id,
      userId: e.id,
    })
  },
  mutateRemove: async (e: Author, { get, set }) => {
    set(get()?.filter((item) => item.id !== e.id) || [])
    await mutateRemoveAuthor({
      id: props.id,
      userId: e.id,
    })
  },
})

const addedAuthors = ref([] as Author[])
const refAuthor = ref()
const publication = computed(() => workspaceStore.currentWorkspace?.name || '')

const usersList = computed(() => {
  if (!ydocAuthors.showValue.value) {
    // skipcq: TCV-001
    captureException(new Error('ydocAuthors.showValue.value return empty data'), (scope) => {
      scope.setContext('ydocAuthors', {
        showValue: ydocAuthors.showValue.value,
        ydocAuthors,
      })
      return scope
    })
  }
  return (
    props.userList?.users
      ?.map((item) => ({
        ...item,
        name: item.full_name || item.email,
      }))
      .filter((item) => !ydocAuthors.showValue.value?.find((author) => item.id === author.id)) ?? []
  )
})

function closeModal() {
  emits('modalClose')
}

function addTag(e: Author) {
  addedAuthors.value = [...addedAuthors.value, e]
}

function removeTag(e: Author) {
  addedAuthors.value = addedAuthors.value.filter((item: Author) => item.id !== e.id)
}

function inviteAuthor() {
  const nowAuthors = ydocAuthors.get()
  addedAuthors.value.forEach((author) => {
    ydocAuthors.mutateAdd(author)
  })
  ydocAuthors.set([...(nowAuthors || []), ...(addedAuthors.value as Author[])])
  addedAuthors.value = []
  refAuthor.value.selectedItems.clear()
}

function removeAuthor(author: Author) {
  const nowAuthors = ydocAuthors.get()?.filter((item) => item.id !== author.id) || []
  ydocAuthors.mutateRemove(author)
  ydocAuthors.set(nowAuthors)
}
</script>

<template>
  <Modals :open="open" @modal-close="closeModal">
    <!-- ref: https://headlessui.com/vue/dialog#managing-initial-focus 
    Dialog will auto focus on first first focusable element, we render a invisible input to auto focus
    -->
    <input class="absolute size-0" />
    <div class="h-full w-[32rem] space-y-[1.375rem] p-[.875rem]">
      <div class="flex w-full space-x-2">
        <SelectTypeahead
          ref="refAuthor"
          :model-value="addedAuthors"
          :items="usersList"
          option-label-prop="name"
          class="w-full"
          unique-key="id"
          placeholder="Add teammates..."
          @add-tag="addTag"
          @remove-tag="removeTag"
        />
        <Buttons :disabled="addedAuthors.length === 0" type="main" color="primary" @click="inviteAuthor"
          >Invite</Buttons
        >
      </div>
      <div class="flex flex-col space-y-2.5">
        <span class="text-subheading">From {{ publication }}'s team</span>
        <div class="space-y-2">
          <div v-for="user in ydocAuthors.showValue.value" :key="user.id" class="flex flex-row items-center">
            <img v-if="user.avatar" :src="user.avatar" class="mr-2.5 size-8 items-center justify-center rounded-full" />
            <div class="mr-auto flex flex-col">
              <span class="text-body">{{ user.name }}</span>
              <span class="text-caption opacity-50">{{ user.email }}</span>
            </div>
            <span class="flex h-7 items-center rounded-md text-stone-600 transition-colors hover:bg-stone-100">
              <Dropdowns>
                <template #button>
                  <MenuButton>
                    <div class="flex items-center space-x-2 px-3 pb-1.5 opacity-50">
                      <span class="text-caption whitespace-nowrap break-normal text-stone-500 dark:text-stone-400">
                        On byline
                      </span>
                      <Icon class="text-[.625rem] text-stone-500 dark:text-stone-400" icon-name="chevron_down" />
                    </div>
                  </MenuButton>
                </template>
                <template #default>
                  <MenuItem>On byline</MenuItem>
                  <MenuItem @click.prevent="removeAuthor({ ...user, full_name: user.name })">Remove</MenuItem>
                </template>
              </Dropdowns>
            </span>
          </div>
        </div>
      </div>
    </div>
  </Modals>
</template>
