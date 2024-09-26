<script setup lang="ts">
import { Buttons } from '@storipress/core-component'

withDefaults(
  defineProps<{
    img: string
    title: string
    content: string
    buttonText?: string
    href?: string
  }>(),
  { buttonText: '', href: undefined },
)
const emit = defineEmits<{
  clickButton: []
}>()
</script>

<template>
  <div class="min-h-[27rem] pb-[4.5rem] pt-[2.035rem]">
    <div class="m-auto w-80">
      <img :src="img" class="m-auto -mb-4 h-[11.215rem]" />

      <div class="px-10 text-center">
        <p class="text-display-medium mb-2 text-neutral-800">{{ title }}</p>
        <p class="text-body mb-6 text-zinc-500">{{ content }}</p>
      </div>
    </div>

    <slot name="buttonArea">
      <div class="text-center">
        <Buttons type="main" color="primary" is-shadow @click="emit('clickButton')">
          <a v-if="href" :href="href" target="_blank" rel="noopener noreferrer" class="-mx-4 -my-2.5 px-4 py-2.5">
            {{ buttonText }}
          </a>
          <template v-else>{{ buttonText }}</template>
        </Buttons>
      </div>
    </slot>

    <slot />
  </div>
</template>
