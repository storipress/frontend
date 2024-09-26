<script setup lang="ts">
import copy from 'copy-to-clipboard'
import invariant from 'tiny-invariant'
import { hasProtocol, withHttps } from 'ufo'
import LinkAction from './link-action.vue'

const props = withDefaults(
  defineProps<{
    alwaysShowMenu?: boolean
    autoFocus?: boolean
    modelValue?: string
  }>(),
  {
    alwaysShowMenu: false,
    autoFocus: true,
    modelValue: '',
  },
)

const emit = defineEmits<{ setLink: [string]; change: [string]; 'update:modelValue': [string] }>()

const inputElement = ref<HTMLInputElement>()
const input = useModel(props, 'modelValue', { local: true })
const formattedLink = computed(() => {
  const value = input.value ?? ''
  if (!value) {
    return ''
  }

  return !hasProtocol(value) ? withHttps(value) : value
})

onMounted(() => {
  if (props.autoFocus) {
    invariant(inputElement.value, 'no input')
    inputElement.value.focus()
  }
})

function handleComplete() {
  emit('setLink', formattedLink.value)
}
function copyURL() {
  copy(formattedLink.value)
}
</script>

<template>
  <div class="layer-1 w-80 rounded-sm bg-white p-2 text-sm [.has-dark_&]:dark:bg-stone-800">
    <input
      ref="inputElement"
      v-model="input"
      class="h-9 w-full rounded-sm border-2 border-sky-500 bg-stone-200 pl-2 focus:outline-none [.has-dark_&]:dark:bg-stone-700"
      :placeholder="`${input ? 'Edit' : 'Paste'} link`"
      type="url"
      @change="$emit('change', formattedLink)"
      @keydown.enter.prevent="handleComplete"
    />

    <template v-if="alwaysShowMenu || input">
      <div class="mb-1 ml-2 mt-2 pt-2 text-xs font-bold uppercase text-stone-900 [.has-dark_&]:dark:text-stone-200">
        Link to
      </div>

      <LinkAction :href="formattedLink" icon="web">
        {{ formattedLink }}
      </LinkAction>

      <hr class="-mx-2 my-1" />

      <LinkAction icon="copy" @click="copyURL">Copy Link</LinkAction>

      <LinkAction icon="delete" @click="$emit('setLink', '')">Remove Link</LinkAction>
    </template>
  </div>
</template>
