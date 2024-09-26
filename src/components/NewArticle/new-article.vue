<script lang="ts" setup>
import { Dialog, DialogOverlay, MenuButton, RadioGroup, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Buttons, Dropdowns, HoverHint, Icon, MenuItem } from '@storipress/core-component'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { AutoSizeTextarea } from '../Shared'
import DeskSelect from './desk-select.vue'
import DeskSelectMore from './desk-select-more.vue'
import type { Desk } from './definitions'
import { useDesks } from '~/composables'
import { useMe } from '~/composables/me'
import type { GetMeQuery, ListSimpleUsersQuery } from '~/graphql-operations'
import { ListSimpleUsersDocument } from '~/graphql-operations'
import { isAdmin } from '~/composables/permission/user-permission'

const props = withDefaults(
  defineProps<{
    publication: string
    modelValue?: boolean
    initialTitle?: string
    initialBlurb?: string
    initialDesk?: Desk
  }>(),
  { modelValue: false },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'submit', value: { title: string; blurb: string; desk: string; authors: string[] }): void
}>()

const target = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()

const open = useVModel(props, 'modelValue', emit, { passive: true, defaultValue: false })

const titleMessage = 'Title is required'
const deskMessage = 'Select a desk'
const { handleSubmit: wrapSubmit } = useForm({
  validationSchema: {
    title: yup.string().min(1, titleMessage).required(titleMessage),
    desk: yup.object({ id: yup.string().required(deskMessage) }).required(deskMessage),
  },
  initialValues: {
    title: props.initialTitle || '',
    desk: props.initialDesk,
  },
  validateOnMount: true,
})

const { value: title, errorMessage: titleError } = useField<string>('title', undefined, {
  syncVModel: false,
})
const blurb = ref(props.initialBlurb || '')

const { value: selectedDesk, errorMessage: deskError } = useField<Desk | undefined>('desk', undefined, {
  syncVModel: false,
})

const me = useMe()
const selectedAuthors = ref<GetMeQuery['me'][]>([])
const { desks, mainDeskMap } = useDesks()

const desksFilterByPermission = computed(() => {
  const deskIdCounter = selectedAuthors.value.reduce<Record<string, number>>(
    (res, { role, desks }) => {
      if (isAdmin(role as string)) {
        Object.keys(res).forEach((key) => res[key]++)
        return res
      } else {
        return desks.reduce((res, { id }) => {
          if (res[id]) res[id]++
          else res[id] = 1
          return res
        }, res)
      }
    },
    Object.fromEntries(desks.value.map((desk) => [desk.id, 0])),
  )
  const deskIdSet = new Set<string>(
    Object.entries(deskIdCounter)
      .filter(([, value]) => value === selectedAuthors.value.length)
      .map(([key]) => key),
  )
  return desks.value.filter((desk) => desk.open_access || deskIdSet.has(desk.id))
})

// when open, load initial value
whenever(
  open,
  () => {
    nextTick(() => titleRef.value?.focus())
    title.value = props.initialTitle ?? ''
    blurb.value = props.initialBlurb ?? ''

    if (desksFilterByPermission.value.length === 1 && !props.initialDesk) {
      selectedDesk.value = desksFilterByPermission.value[0]
    } else {
      selectedDesk.value = props.initialDesk
    }

    if (selectedDesk.value?.desks?.length) {
      selectedDesk.value = selectedDesk.value.desks[0]
    }
    if (me.value) selectedAuthors.value = [me.value]
  },
  { flush: 'sync' },
)

const radioGroupRef = ref()
const moreDesksRef = ref()
const { width: radioGroupRefWidth } = useElementSize(radioGroupRef)
const { width: moreDesksRefWidth } = useElementSize(moreDesksRef)
const desksRefs = ref(new Map())

function setDesksRefs(el: ComponentPublicInstance | Element | null, id: string) {
  if (!(el as ComponentPublicInstance<{ width: number }>)?.width || !moreDesksRefWidth.value) return
  desksRefs.value.set(id, el)
}

const lastShownDeskIndex = computed(() => {
  if (!radioGroupRefWidth.value) return
  let widthAccumulator: number
  widthAccumulator = moreDesksRefWidth.value
  const arr = Array.from(desksRefs.value, ([id, el]) => ({ id, width: el.width }))
  const index = arr.findIndex((item) => {
    // accumulate each desk width and gap
    widthAccumulator += item.width + 6
    return widthAccumulator >= radioGroupRefWidth.value
  })

  return index
})
const deskList = computed(() => {
  if (lastShownDeskIndex.value === -1) {
    return { show: desksFilterByPermission.value }
  } else {
    return {
      show: desksFilterByPermission.value.slice(0, lastShownDeskIndex.value),
      more: desksFilterByPermission.value.slice(lastShownDeskIndex.value),
    }
  }
})

whenever(me, (me) => {
  selectedAuthors.value = [me]
})
const { result: usersResult } = useQuery<ListSimpleUsersQuery>(ListSimpleUsersDocument)
const selectableUsers = computed(() => {
  let selectableUsers
  if (selectedDesk.value) {
    const mainDeskId = mainDeskMap.value.get(selectedDesk.value.id)
    if (desks.value.find(({ id }) => id === mainDeskId)?.open_access) {
      selectableUsers = usersResult.value?.users ?? []
    } else {
      selectableUsers =
        usersResult.value?.users.filter(
          ({ desks, role }) => isAdmin(role as string) || desks.some((item) => item.id === mainDeskId),
        ) ?? []
    }
  } else {
    const meDeskIdSet = new Set(desksFilterByPermission.value?.map((desk) => desk.id))
    selectableUsers =
      usersResult.value?.users.filter(
        ({ desks, role }) => isAdmin(role as string) || desks.some((item) => meDeskIdSet.has(item.id)),
      ) ?? []
  }
  const selectedUserIdSet = new Set(selectedAuthors.value.map(({ id }) => id))
  return selectableUsers.filter(({ id }) => !selectedUserIdSet.has(id))
})

const error = computed(() => {
  return titleError.value || deskError.value
})

const handleSubmit = wrapSubmit(() => {
  // HACK: no idea why unit test can bypass the validation
  if (!selectedDesk.value) {
    return
  }

  emit('submit', {
    title: title.value || '',
    blurb: blurb.value,
    desk: selectedDesk.value.id,
    authors: selectedAuthors.value?.map(({ id }) => id),
  })
})
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="fixed inset-0 z-[51]" @close="open = false">
      <div class="flex h-screen max-h-[stretch] items-end justify-center text-center sm:block sm:p-0">
        <DialogOverlay class="fixed inset-0" />

        <!-- This element is to trick browser into centering modal contents -->
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        <TransitionChild
          as="template"
          show
          enter="ease-out duration-300"
          enter-from="translate-y-96 sm:translate-y-0 sm:scale-95"
          enter-to=" translate-y-0 sm:scale-100"
          leave="ease-out duration-200"
          leave-from="translate-y-0 sm:scale-100"
          leave-to="translate-y-96 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="layer-2 inline-block w-screen transform rounded-t-lg bg-white text-left align-bottom transition-all sm:my-8 sm:rounded-lg sm:align-middle md:w-[44.5rem]"
          >
            <div class="flex flex-col border-b border-stone-200 px-4 pt-4">
              <!-- dialog header -->
              <div class="flex items-center gap-2 pb-1 pr-1">
                <div class="text-caption rounded bg-gray-100 px-2 py-1 text-center text-stone-600/75">
                  {{ publication }}
                </div>
                <Icon icon-name="chevron_right" class="text-[0.5rem] text-stone-400" />
                <div class="text-body text-center text-stone-500">New Story</div>
                <button class="ml-auto focus:outline-none" @click="open = false">
                  <Icon icon-name="cross_thin" class="text-[0.75rem] text-stone-400" />
                </button>
              </div>

              <!-- title -->
              <AutoSizeTextarea
                ref="titleRef"
                v-model="title"
                name="title"
                rows="1"
                class="text-display-small my-4 text-stone-600 focus:outline-none"
                placeholder="Add a Headline ..."
                single-line
                data-intercom-target="Headline Input"
              />

              <!-- blurb -->
              <AutoSizeTextarea
                v-model="blurb"
                name="blurb"
                placeholder="Add a Subheading ..."
                class="text-body mb-4 h-[20vh] text-stone-600 sm:h-auto"
                single-line
              />
              <span class="text-caption text-gray-400">Select a desk</span>

              <RadioGroup
                ref="radioGroupRef"
                v-model="selectedDesk"
                class="flex gap-1.5 overflow-x-auto overflow-y-visible pb-3 pt-1 scrollbar-hide"
                by="id"
              >
                <DeskSelect
                  v-for="(desk, index) of deskList.show"
                  :ref="(el) => setDesksRefs(el, desk.id)"
                  :key="desk.id"
                  :desk="desk"
                  :target="target"
                  :index="index"
                  :selected="selectedDesk"
                  :main-desk-map="mainDeskMap"
                />
                <DeskSelectMore
                  v-if="lastShownDeskIndex !== -1"
                  ref="moreDesksRef"
                  :desk="deskList.more"
                  :target="target"
                  :selected="selectedDesk"
                  :main-desk-map="mainDeskMap"
                />
              </RadioGroup>
            </div>
            <div class="flex items-end justify-end p-4">
              <div class="mr-2 flex flex-grow flex-wrap items-center gap-2">
                <div
                  v-if="!selectableUsers.length"
                  class="layer-1 flex cursor-default items-center rounded-2xl border border-stone-100 bg-stone-50"
                >
                  <img class="mr-2 size-7 rounded-full" :src="me?.avatar || ''" alt="" />
                  <div class="mr-3 flex h-full items-center py-1">
                    <span class="text-body text-[0.875rem] leading-5 text-stone-600">
                      {{ me?.full_name || me?.email }}
                    </span>
                  </div>
                </div>
                <Dropdowns
                  v-for="(author, index) of selectedAuthors"
                  v-else
                  :key="author.id"
                  class="relative flex items-center"
                >
                  <template #button>
                    <div
                      class="layer-1 flex cursor-pointer items-center rounded-2xl border border-stone-100 bg-stone-50"
                    >
                      <MenuButton class="flex items-center">
                        <img class="mr-2 size-7 rounded-full" :src="author.avatar || ''" alt="" />
                        <div class="flex h-full items-center py-1" :class="[{ 'mr-3': index === 0 }]">
                          <span class="text-body text-[0.875rem] leading-5 text-stone-600">{{
                            author.full_name || author.email
                          }}</span>
                        </div>
                      </MenuButton>
                      <button
                        v-if="index !== 0"
                        class="mx-[0.625rem] flex items-center"
                        @click="() => selectedAuthors.splice(index, 1)"
                      >
                        <Icon icon-name="cross_thin" class="size-3 scale-50 cursor-pointer text-stone-400" />
                      </button>
                    </div>
                  </template>
                  <div class="max-h-[50vh] w-40 overflow-y-auto md:max-h-60">
                    <MenuItem
                      v-for="user of selectableUsers"
                      :key="user.id"
                      class="px-4 py-1.5"
                      @click="() => selectedAuthors.splice(index, 1, user as any)"
                    >
                      <span class="flex items-center">
                        <img class="mr-2.5 size-6 rounded-xl" :src="user.avatar || ''" alt="" />
                        <span class="line-clamp-1">{{ user.full_name }}</span>
                      </span>
                    </MenuItem>
                  </div>
                </Dropdowns>
                <Dropdowns
                  v-if="selectableUsers.length"
                  class="relative flex items-center"
                  placement="bottom-start"
                  data-testid="plus-button"
                >
                  <template #button>
                    <MenuButton
                      class="layer-1 flex cursor-pointer items-center rounded-2xl border border-stone-100 bg-stone-50 p-2"
                    >
                      <Icon icon-name="plus" class="text-[0.75rem]" />
                    </MenuButton>
                  </template>
                  <div class="max-h-[50vh] w-40 overflow-y-auto md:max-h-60">
                    <MenuItem
                      v-for="user of selectableUsers"
                      :key="user.id"
                      class="px-4 py-1.5"
                      @click.stop.prevent="() => selectedAuthors.push(user as any)"
                    >
                      <span class="flex items-center">
                        <img class="mr-2.5 size-6 rounded-xl" :src="user.avatar || ''" alt="" />
                        <span class="line-clamp-1">{{ user.full_name }}</span>
                      </span>
                    </MenuItem>
                  </div>
                </Dropdowns>
              </div>
              <HoverHint :disabled="!error" reference-class="min-w-[calc(6.75rem+1px)]">
                <template #default>
                  <Buttons
                    :disabled="!!error"
                    :class="error && 'cursor-not-allowed bg-stone-200 text-stone-600 hover:bg-stone-200'"
                    type="main"
                    color="primary"
                    data-intercom-target="Create Story Button"
                    @click="handleSubmit"
                    >New Story</Buttons
                  >
                </template>
                <template v-if="error" #content>
                  {{ error }}
                </template>
              </HoverHint>
            </div>
            <div ref="target" />
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
