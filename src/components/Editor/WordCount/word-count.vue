<script lang="ts" setup>
import { ref } from 'vue'
import { Dialog, DialogOverlay } from '@headlessui/vue'
import WordCountDialog from './word-count-dialog.vue'
import { useWordCount } from '~/modules/editor/word-count/pinia'

const open = ref(false)
const store = useWordCount()

const formatter = new Intl.NumberFormat()
const count = computed((): string => {
  return formatter.format(store.statistics.words)
})
</script>

<template>
  <button
    class="layer-2 block w-fit min-w-[5rem] whitespace-nowrap rounded-md bg-white px-2.5 py-1 transition duration-100 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700"
    role="button"
    aria-label="Word Count"
    @click="open = true"
  >
    <span class="text-body font-bold dark:text-stone-50">{{ count }}</span>
    <span class="text-body text-stone-400 dark:text-stone-200"> words</span>
    <Dialog class="fixed inset-0 flex items-center justify-center" :open="open" @click="open = false">
      <DialogOverlay
        class="absolute inset-0 z-0 size-full bg-stone-800/75 dark:bg-stone-900/75"
        @click="open = false"
      />

      <WordCountDialog class="relative" @close="open = false" />
    </Dialog>
  </button>
</template>
