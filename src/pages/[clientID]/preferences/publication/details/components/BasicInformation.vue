<script setup lang="ts">
import { AutoComplete, Buttons, Inputs } from '@storipress/core-component'
import invariant from 'tiny-invariant'
import timezones from '../timezones'
import type { PublicationInfo } from './definitions'
import { languageList } from './definitions'
import { allowedImageType } from '~/utils/file'
import { UploadImage } from '~/graphql-operations'
import type { GetSiteQuery } from '~/graphql-operations'
import { usePublicationPermission } from '~/composables/permission/publication'
import { watchToDisabledAllContainedInputs } from '~/composables/permission/watch-permission'
import { useUploadImageWithState } from '~/composables'
import { useWorkspaceStore } from '~/stores/workspace'

const props = withDefaults(
  defineProps<{
    publicationInfo: PublicationInfo
    errors: Record<string, string | undefined>
  }>(),
  {},
)
const emit = defineEmits<(event: 'updateLogomark', favicon: GetSiteQuery['site']['favicon']) => void>()

const { canUpdateSettingBasicInfo } = usePublicationPermission()
const basicInfoDivRef = watchToDisabledAllContainedInputs(canUpdateSettingBasicInfo)

const { favicon, name, language, timezone } = toRefs(props.publicationInfo)

const uploadLogoRef = ref()

const { uploadImage, isLoading } = useUploadImageWithState()
const workspaceStore = useWorkspaceStore()

async function uploadLogomark(e: Event) {
  const $el = e.target as HTMLInputElement
  const file = $el.files?.[0] as File
  if (!file) return
  invariant(workspaceStore.currentWorkspace?.id, 'no publication id')
  const { url } = await uploadImage({
    file,
    id: workspaceStore.currentWorkspace?.id,
    type: UploadImage.PublicationFavicon,
  })
  emit('updateLogomark', url)
}

function removeLogomark() {
  emit('updateLogomark', null)
}
</script>

<template>
  <SectionContent
    :ref="(element: any) => (basicInfoDivRef = element && element.$el)"
    sub-title="Basic information"
    content="The logomark is converted to a favicon and used on your site."
    class="relative border-b border-stone-200"
    :class="{
      'opacity-50 after:absolute after:left-0 after:top-0 after:size-full after:content-[\'&nbsp;\']':
        !canUpdateSettingBasicInfo,
    }"
  >
    <SectionContentBlock>
      <div class="flex items-center border-b border-stone-200 px-5 pb-[1.875rem]">
        <img v-if="favicon" class="mr-3.5 size-10 rounded-full border border-stone-900/10" :src="favicon" />
        <div v-else class="mr-3.5 size-10 rounded-full border border-stone-900/10 bg-black/25" />
        <div class="mr-2 basis-[30%]">
          <input ref="uploadLogoRef" type="file" :accept="allowedImageType" class="hidden" @change="uploadLogomark" />
          <Buttons
            :is-loading="isLoading"
            is-shadow
            is-border
            type="main"
            class="w-full"
            @click="uploadLogoRef.click()"
          >
            Upload favicon
          </Buttons>
        </div>
        <Buttons :disabled="isLoading" is-shadow is-border type="main" @click="removeLogomark">Remove favicon</Buttons>
      </div>
      <div class="flex flex-wrap px-5 pt-[1.375rem]">
        <div class="mb-4 flex w-full">
          <Inputs
            v-model="name"
            label="Publication name"
            html-name="publicationName"
            :show-error="Boolean(errors.publicationName)"
            class="mr-4 w-1/2"
          />
          <AutoComplete
            v-model="language"
            :items="languageList"
            option-label-prop="value"
            label="Default Language"
            html-name="publicationLanguage"
            class="w-1/2"
          />
        </div>
        <AutoComplete
          v-model="timezone"
          :items="timezones"
          option-label-prop="text"
          label="Timezone"
          html-name="publicationTimezone"
          class="w-full"
        />
      </div>
    </SectionContentBlock>
  </SectionContent>
</template>
