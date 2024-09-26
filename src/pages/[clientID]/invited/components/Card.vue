<script setup lang="ts">
import { Buttons, Inputs } from '@storipress/core-component'
import { Form } from 'vee-validate'
import * as Yup from 'yup'
import type { UserInfo } from '../definitions'
import type { GetMeQuery } from '~/graphql-operations'
import { UploadImage } from '~/graphql-operations'
import { allowedImageType, isInvalidImage } from '~/utils/file'
import { useUploadImage } from '~/composables'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import { errorModalMapping } from '~/pages/[clientID]/articles/[id]/edit/setting'
import RichTextArea from '~/pages/[clientID]/account/profile/components/RichTextArea/index.vue'

const props = withDefaults(
  defineProps<{
    userInfo: UserInfo
    publication: string
    incompleteAvatar: boolean
  }>(),
  {
    incompleteAvatar: true,
  },
)
const emit = defineEmits<{
  (event: 'updateAvatar', favicon: GetMeQuery['me']['avatar']): void
  (event: 'submit', input: UserInfo): void
}>()

const { id, avatar, firstName, lastName, location, bio } = toRefs(props.userInfo)
const uploadRef = ref()
const isLoading = ref(false)

const userInfoSchema = Yup.object().shape({
  firstName: Yup.string().required().label('This'),
  lastName: Yup.string().required().label('This'),
  location: Yup.string().required().label('This'),
})

const completeAllInfo = computed(() => {
  return Boolean(firstName.value && lastName.value && location.value)
})

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
    id: id.value,
    file,
    type: UploadImage.UserAvatar,
  })
  isLoading.value = false

  emit('updateAvatar', url)
}

function removePhoto() {
  emit('updateAvatar', null)
}

function onSubmit() {
  emit('submit', {
    id: id.value,
    avatar: avatar.value,
    firstName: firstName.value,
    lastName: lastName.value,
    location: location.value,
    bio: bio.value,
  })
}

function updateBio(val: string) {
  bio.value = val
}
</script>

<template>
  <div
    class="px-4 md:layer-2 md:fixed md:left-1/2 md:top-1/2 md:w-[23.5rem] md:-translate-y-1/2 md:translate-x-1/3 md:rounded-lg md:bg-white md:px-0 md:py-6"
  >
    <div class="mb-6 flex items-center md:mb-0 md:border-b md:border-stone-200 md:px-5 md:pb-[1.875rem]">
      <img
        v-if="userInfo.avatar"
        class="mr-3.5 size-10 min-w-[2.5rem] rounded-full border border-stone-900/10"
        :class="{ 'animate-pulse': incompleteAvatar }"
        :src="userInfo.avatar"
      />
      <div
        v-else
        class="mr-3.5 size-10 min-w-[2.5rem] rounded-full border border-stone-900/10 bg-black/25"
        :class="{ 'animate-pulse': incompleteAvatar }"
      />
      <div class="relative mr-2 basis-1/2 md:basis-[38%]">
        <div
          v-if="incompleteAvatar"
          class="absolute -right-0.5 -top-0.5 size-2 animate-ping rounded-full bg-green-700"
        />
        <input ref="uploadRef" type="file" :accept="allowedImageType" class="hidden" @change="uploadPhoto" />
        <Buttons :is-loading="isLoading" is-shadow is-border type="main" class="w-full" @click="uploadRef.click()">
          Upload photo
        </Buttons>
      </div>
      <Buttons
        :disabled="isLoading"
        is-shadow
        is-border
        type="main"
        class="basis-1/2 md:basis-2/5"
        @click="removePhoto"
      >
        Remove photo
      </Buttons>
    </div>
    <div class="flex flex-wrap md:px-5 md:pt-[1.375rem]">
      <Form :validation-schema="userInfoSchema" @submit="onSubmit">
        <div class="mb-4 flex w-full gap-x-4">
          <Inputs v-model="firstName" input-id="first-name" label="First name" html-name="firstName" class="w-full" />
          <Inputs v-model="lastName" input-id="last-name" label="Last name" html-name="lastName" class="w-full" />
        </div>
        <Inputs v-model="location" input-id="location" label="Location" html-name="location" class="mb-4 w-full" />
        <div class="custom-placeholder">
          <RichTextArea
            :model-value="bio"
            textarea-name="bio"
            textarea-width="w-[calc(100vw-2rem)] md:w-[21rem]"
            textarea-height="h-[7.5rem]"
            placeholder="A short paragraph that tells readers a little bit about you as an author, and how to contact the author or read additional content by the author."
            @update:model-value="updateBio"
          />
        </div>
        <Buttons
          html-type="submit"
          is-shadow
          type="main"
          color="primary"
          :disabled="!completeAllInfo || isLoading"
          class="mt-7 h-16 w-full"
        >
          {{ `Enter ${publication}` }}
        </Buttons>
      </Form>
    </div>
  </div>
</template>

<style scoped>
:deep .custom-placeholder {
  .editor__content {
    .is-editor-empty {
      &.empty-node:only-child {
        &::before {
          @apply text-inputs opacity-40;

          content: attr(data-placeholder);
        }
      }
    }
  }
}
</style>
