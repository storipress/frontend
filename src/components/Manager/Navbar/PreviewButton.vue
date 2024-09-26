<script setup lang="ts">
import { HoverHint, Icon } from '@storipress/core-component'
import { ConnectedTarget, useSiteURL } from '~/composables'

const props = defineProps<{
  modelValue: boolean
}>()
defineEmits<{
  'update:modelValue': [value: boolean]
}>()
const preview = useVModel(props)
const togglePreview = useToggle(preview)
const { isSetWebflow, isSetWordpress } = useSiteURL()
const disabledPreview = computed(
  () => (isSetWebflow.value && ConnectedTarget.Webflow) || (isSetWordpress.value && ConnectedTarget.WordPress),
)
</script>

<template>
  <HoverHint :disabled="!disabledPreview">
    <template #default>
      <button
        class="disabled:cursor-not-allowed"
        :disabled="disabledPreview"
        :class="disabledPreview && 'opacity-70'"
        v-bind="$attrs"
        @click="togglePreview()"
      >
        <Icon
          class="text-[1.5rem] transition-colors hover:text-emerald-700"
          icon-name="preview"
          :class="[preview ? 'text-emerald-700' : 'text-stone-600 dark:text-stone-400']"
        />
      </button>
    </template>
    <template #content>
      <div class="text-body max-w-sm whitespace-break-spaces text-white">
        Preview is not supported when connected to {{ disabledPreview }}
      </div>
    </template>
  </HoverHint>
</template>
