<script setup lang="ts">
import { Buttons, Inputs } from '@storipress/core-component'
import type { UserInfo } from '../definitions'
import RichTextArea from './RichTextArea/index.vue'
import { allowedImageType, isInvalidImage } from '~/utils/file'
import { useMe } from '~/composables/permission/account'
import type { GetMeQuery } from '~/graphql-operations'
import { UploadImage } from '~/graphql-operations'
import { showConfetti, useUploadImage } from '~/composables'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import { errorModalMapping } from '~/pages/[clientID]/articles/[id]/edit/setting'

const props = withDefaults(
  defineProps<{
    userInfo: UserInfo
    errors: Record<string, string | undefined>
  }>(),
  {},
)
const emit = defineEmits<(event: 'updateAvatar', favicon: GetMeQuery['me']['avatar']) => void>()

const { avatar, first_name, last_name, job_title, location, bio } = toRefs(props.userInfo)
const uploadRef = ref()
const isLoading = ref(false)
const me = useMe()

const [showErrorPopup] = useConfirmFunction([
  {
    ...errorModalMapping.imageUpload,
    type: 'warning',
    cancelButtonClass: 'hidden',
  },
])
const uploadAvatar = useUploadImage(async () => {
  await showErrorPopup()
})

async function uploadPhoto(e: Event) {
  const $el = e.target as HTMLInputElement
  const file = $el.files?.[0] as File
  if (!file) return
  if (await isInvalidImage(file)) return
  isLoading.value = true
  const { url } = await uploadAvatar({
    id: me.value?.id as string,
    file,
    type: UploadImage.UserAvatar,
  })
  isLoading.value = false

  if (!url) {
    $el.value = ''
    return
  }
  if (new URL(avatar.value).host !== 'assets.stori.press' && url) showConfetti()
  emit('updateAvatar', url)
}

function removePhoto() {
  emit('updateAvatar', null)
}

function updateBio(val: string) {
  bio.value = val
}
</script>

<template>
  <SectionContent
    sub-title="Details"
    content="Tell your readers about yourself. This profile info populates a site's author page."
    class="border-b border-stone-200"
  >
    <div class="layer-1 h-auto w-[34rem] rounded-lg bg-white py-5">
      <div class="flex items-center border-b border-stone-200 px-5 pb-[1.875rem]">
        <img
          v-if="userInfo.avatar"
          class="mr-3.5 size-10 rounded-full border border-stone-900/10"
          :src="userInfo.avatar"
        />
        <div v-else class="mr-3.5 size-10 rounded-full border border-stone-900/10 bg-black/25" />
        <div class="mr-2 basis-[25%]">
          <input ref="uploadRef" type="file" :accept="allowedImageType" class="hidden" @change="uploadPhoto" />
          <Buttons :is-loading="isLoading" is-shadow is-border type="main" class="w-full" @click="uploadRef.click()">
            Upload photo
          </Buttons>
        </div>
        <Buttons :disabled="isLoading" is-shadow is-border type="main" @click="removePhoto">Remove photo</Buttons>
      </div>
      <div class="flex flex-wrap px-5 pt-[1.375rem]">
        <form>
          <div class="mb-4 flex w-full">
            <Inputs
              v-model="first_name"
              input-id="first-name"
              label="First name"
              html-name="firstName"
              :show-error="Boolean(errors.firstName)"
              class="mr-4 w-40"
            />
            <Inputs
              v-model="last_name"
              input-id="last-name"
              label="Last name"
              html-name="lastName"
              :show-error="Boolean(errors.lastName)"
              class="mr-4 w-40"
            />
          </div>
          <Inputs v-model="location" input-id="location" label="Location" html-name="location" class="mb-4 w-[21rem]" />
          <Inputs
            v-model="job_title"
            input-id="job-title"
            label="Job title"
            html-name="jobTitle"
            class="mb-4 w-[21rem]"
          />
          <RichTextArea :model-value="bio" @update:model-value="updateBio" />
        </form>
      </div>
    </div>
  </SectionContent>
</template>

<style scoped></style>
