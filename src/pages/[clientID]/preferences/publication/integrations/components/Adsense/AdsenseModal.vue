<script setup lang="ts">
import { Buttons, Toggles } from '@storipress/core-component'
import type { GoogleAdsense } from '../../utils'
import { BasicDialog, FormView } from '~/components/Integrations'
import CodeTextarea from '~/components/CodeTextarea/CodeTextarea.vue'
import { useNotification } from '~/composables'

const props = defineProps<{
  modelValue: boolean
  label: string
  info: string
  img: string
  isActivated: boolean
  integrationData: GoogleAdsense
}>()
const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'update:integrationData': []
  deactivate: []
  activate: []
  update: []
}>()

const visible = useVModel(props, 'modelValue', emit)
const integrationData = useVModel(props, 'integrationData', emit)

const uploadRef = ref()
const file = ref<File | null>()

const { create: notifications } = useNotification()

const reader = new FileReader()
reader.onload = () => {
  const text = reader.result?.toString() ?? ''
  if (!text) {
    notifications({
      title: 'Ads.txt file has no content',
      type: 'warning',
      iconName: 'warning',
      content: 'Please verify the content of your Ads.txt file and re-upload it',
    })
  }
  integrationData.value['ads.txt'] = text
}

function uploadAdsTxt(e: Event) {
  const $el = e.target as HTMLInputElement
  file.value = $el.files?.[0]

  if (file.value) reader.readAsText(file.value)
}
</script>

<template>
  <BasicDialog v-model="visible" :img="img" :integration-name="label" :info="info">
    <FormView
      :is-activated="isActivated"
      @activate="$emit('activate')"
      @deactivate="$emit('deactivate')"
      @update="$emit('update')"
    >
      <div class="border-b border-stone-200 p-5">
        <CodeTextarea
          v-model="integrationData.code"
          textarea-label="1. Add site Header code"
          textarea-id="adsense-header-code"
        />
      </div>

      <div class="border-b border-stone-200 p-5">
        <div class="w-full">
          <div class="text-subheading mb-4">2. Upload ads.txt file</div>
          <div>
            <input ref="uploadRef" type="file" class="hidden" @change="uploadAdsTxt" />
            <Buttons is-shadow class="mr-2.5" @click="uploadRef.click()">Upload</Buttons>
            <span v-if="file" class="text-body text-stone-800">{{ file.name }}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between border-b border-stone-200 p-5">
        <div>
          <div class="text-subheading mb-4">3. Integrate adsense in articles</div>
          <div class="text-body">Activate the toggle to integrate Adsense in your articles</div>
        </div>
        <Toggles v-model="integrationData.scopes.articles" type="simple" />
      </div>

      <div class="flex items-center justify-between p-5">
        <div>
          <div class="text-subheading mb-4">4. Integrate adsense on front page</div>
          <div class="text-body">Activate the toggle to integrate Adsense on your front page</div>
        </div>
        <Toggles v-model="integrationData.scopes['front-page']" type="simple" />
      </div>
    </FormView>
  </BasicDialog>
</template>
