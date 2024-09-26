<script lang="ts" setup>
import { Dropdowns as Dropdown, Icon, MenuItem, Textarea, Toggles } from '@storipress/core-component'
import { MenuButton } from '@headlessui/vue'
import type * as Y from 'yjs'
import type { IDefineYdocMapReturn, MediaEnableSetting, MediaUserSettingCard, SocialMedia } from '../utils'
import { mediaSetting } from '../utils'
import type { GeneratingControllerKey, GeneratingKey } from '../utils/store'
import { useMetaStore } from '../utils/store'
import type { IntegrationsData } from '../utils/types'
import { updateYdocEnable, updateYdocUser } from './utils'
import AutoReplyButton from './AutoReplyButton.vue'
import type { LinkedInAuthors } from '~/graphql-operations'
import type { FBuser, TWuser } from '~/pages/[clientID]/articles/[id]/edit/types'

const props = defineProps<{
  mediaName: SocialMedia
  list: any
  id: string
  textAreaId: string
  enable: boolean
  text: string
  user: IntegrationsData | LinkedInAuthors | FBuser | TWuser
  textareaName: GeneratingKey
  ydoc: Y.Doc
  ydocEnable: IDefineYdocMapReturn<MediaEnableSetting>
  ydocUser: IDefineYdocMapReturn<MediaUserSettingCard>
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean | string, column: string): void
  (event: 'focus'): void
  (event: 'blur'): void
  (event: 'generateResponse', promptType: string, column: string): void
}>()

const metaStore = useMetaStore()

function changeEnableModel() {
  updateYdocEnable(props.enable, props.ydocEnable, props.mediaName)
  emit('update:modelValue', !props.enable, mediaSetting[props.mediaName].toggle)
}

function toggleClick() {
  if (props.enable) {
    // auto clean the content if set unable
    metaStore.SET_GENERATING_ABORT(props.mediaName.toLocaleLowerCase() as GeneratingControllerKey)
    const input = props.ydoc.getText(props.textareaName)
    input.delete(0, props.text.length)
    emit('update:modelValue', '', mediaSetting[props.mediaName].text)
  }
  changeEnableModel()
}

function generateAIResponse() {
  if (!props.enable) {
    changeEnableModel()
  }
  emit('generateResponse', props.mediaName.toLocaleLowerCase(), props.textareaName)
}

function textChange(value: string) {
  emit('update:modelValue', value, mediaSetting[props.mediaName].text)
}

function idChange(value: string) {
  updateYdocUser(value, props.ydocUser, props.mediaName, props.list)
  emit('update:modelValue', value, mediaSetting[props.mediaName].id)
}

function handleFocus() {
  emit('focus')
}

function handleBlur() {
  emit('blur')
}

const placeholderText = computed(() =>
  props.enable ? 'Write something …' : `Turn on the Share to ${props.mediaName} toggle above to draft your Post text`,
)
</script>

<template>
  <div class="flex w-full flex-col space-y-1.5">
    <div class="flex items-center">
      <div class="flex items-center justify-center">
        <span class="text-heading mb-1.5 mr-2">
          {{ mediaSetting[props.mediaName].shareText }}
        </span>
        <Toggles :model-value="enable" type="short" color="bg-emerald-600" @update:model-value="toggleClick" />
      </div>
      <Dropdown class="ml-auto">
        <template #button>
          <MenuButton class="layer-0 text-caption flex h-6 w-32 items-center rounded-full bg-white px-1.5 py-1">
            <img
              v-if="user?.thumbnail || list?.[0]?.thumbnail"
              class="layer-1 absolute left-[-.25rem] w-6 rounded-full"
              :src="user?.thumbnail || list?.[0]?.thumbnail"
            />
            <div class="ml-5 w-[4.75rem]">
              <p v-if="user?.name || list?.[0]?.name" class="text-caption truncate">
                {{ user?.name || list?.[0]?.name }}
              </p>
            </div>
            <Icon class="ml-auto cursor-pointer text-[.5rem] text-stone-800" icon-name="chevron_down" />
          </MenuButton>
        </template>
        <template #default>
          <template v-for="item in list" :key="item.id">
            <MenuItem @click.prevent="idChange(item.id)">
              <div class="flex max-w-[10rem] items-center">
                <img class="mr-2.5 w-6 rounded-full" :src="item.thumbnail" />
                <p class="truncate">{{ item.name }}</p>
              </div>
            </MenuItem>
          </template>
        </template>
      </Dropdown>
    </div>
    <Textarea
      class="custom-textarea-full-width"
      :textarea-id="textAreaId"
      :model-value="text"
      :label="mediaSetting[props.mediaName].labelText"
      textarea-height="h-[10rem]"
      :textarea-name="textareaName"
      :placeholder="placeholderText"
      html-type="text"
      :disabled="!enable"
      :show-error="true"
      @input="textChange(($event.target as HTMLInputElement).value)"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <AutoReplyButton
      class="layer-2 z-[1] ml-auto mr-2 flex size-8 items-center justify-center rounded-full transition-colors"
      :class="[
        enable ? 'bg-stone-50 hover:bg-stone-100' : 'bg-stone-200 hover:bg-stone-100',
        metaStore.generatingAI[textareaName] ? 'cursor-default' : 'cursor-pointer',
      ]"
      :style="{ marginTop: '-2.4rem' }"
      :prompt-type="mediaName.toLocaleLowerCase()"
      :col-name="textareaName"
      :generating="metaStore.generatingAI[textareaName]"
      @generate-response="generateAIResponse"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep .custom-textarea-full-width {
  width: 100%;
  div textarea {
    width: 100%;
  }
}
</style>
