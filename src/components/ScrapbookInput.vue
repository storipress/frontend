<script setup lang="ts">
import { Buttons, HoverHint, Icon } from '@storipress/core-component'
import copy from 'copy-to-clipboard'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'

const props = withDefaults(
  defineProps<{
    inputValue?: string
    placeholder?: string
    label?: string
    hint?: string
    needHide?: boolean
    needRotate?: boolean
  }>(),
  {
    inputValue: '',
    placeholder: 'API keys are only visible to users with Admin permissions and above.',
    label: 'API key',
    hint: 'API Credentials Copied',
    needHide: true,
    needRotate: false,
  },
)
const emit = defineEmits<{
  rotateApiKey: []
}>()

const autoInputId = `${Math.random()}-${Date.now()}`

const [isHide, toggleHide] = useToggle(props.needHide)
const inputType = computed(() => {
  if (!props.inputValue) return 'text'

  return isHide.value ? 'password' : 'text'
})

const showMessage = ref(false)
const delay = 1500
const timer = ref()
function copyValue() {
  if (timer) {
    clearTimeout(timer.value)
    timer.value = undefined
  }
  copy(props.inputValue, { format: 'text/plain' })
  showMessage.value = true
  timer.value = setTimeout(() => (showMessage.value = false), delay)
}

const [confirmRotateApiKey] = useConfirmFunction([
  {
    type: 'warning',
    icon: 'refresh',
    title: 'Rotate Newstand API key',
    description:
      'Are you sure you want to regenerate the API Key? This action will invalidate the current API Key and generate a new one.',
    okText: 'Rotate API key',
  },
])

async function onShowDialog() {
  const confirmed = await confirmRotateApiKey()
  if (confirmed) {
    emit('rotateApiKey')
  }
}
</script>

<template>
  <form @submit.prevent>
    <label v-if="label" :for="autoInputId" class="text-body relative mb-1 block text-stone-800">
      {{ label }}
      <Transition
        enter-active-class="transition duration-100 ease-out origin-top"
        enter-from-class="transform scale-y-95 opacity-0"
        enter-to-class="transform scale-y-100 opacity-100"
        leave-active-class="transition duration-75 ease-in origin-top"
        leave-from-class="transform scale-y-100 opacity-100"
        leave-to-class="transform scale-y-95 opacity-0"
      >
        <div
          v-if="showMessage"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-sm bg-stone-800 px-2 py-1 text-white"
        >
          {{ hint }}
        </div>
      </Transition>
    </label>

    <div class="flex">
      <HoverHint :disabled="Boolean(inputValue)" reference-class="flex flex-1">
        <input
          :value="props.inputValue || props.placeholder"
          :type="inputType"
          :disabled="!inputValue"
          class="text-inputs block w-full cursor-pointer rounded-md border border-gray-400 px-3 pb-[0.312rem] pt-1.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          readonly
          @click="copyValue"
        />
        <button
          v-if="needHide"
          class="ml-1 block size-9 rounded-full hover:bg-gray-100"
          type="button"
          @click="() => toggleHide()"
        >
          <Icon icon-name="preview" class="text-base text-stone-500" />
        </button>
        <Buttons
          v-if="needRotate"
          type="main"
          color="primary"
          html-type="submit"
          class="size-9 transition-colors duration-200 ease-in-out"
          @click="onShowDialog"
        >
          <Icon icon-name="refresh" class="scale-[.6] rounded-full bg-white p-1.5 text-emerald-700" />
        </Buttons>
        <template #content>
          <span class="text-body text-white">{{ placeholder }}</span>
        </template>
      </HoverHint>
    </div>
  </form>
</template>
