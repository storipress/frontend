<script lang="ts" setup>
import { defineEmits } from 'vue'
import { Icon } from '@storipress/core-component'
import WordCountItem from './word-count-item.vue'
import { useWordCount } from '~/modules/editor/word-count/pinia'

defineEmits<(event: 'close') => void>()

const formatter = new Intl.NumberFormat()
const store = useWordCount()

const paragraphs = computed((): string => {
  return formatter.format(store.statistics.paragraphs)
})

const words = computed((): string => {
  return formatter.format(store.statistics.words)
})

const characters = computed((): string => {
  return formatter.format(store.statistics.characters)
})

const characterWithoutSpace = computed((): string => {
  const { characters, spaces } = store.statistics

  return formatter.format(characters - spaces)
})

const readTime = computed((): number => store.readTime)
</script>

<template>
  <div class="layer-2 w-72 rounded-3xl bg-stone-50 px-5 pb-3 pt-5 dark:bg-stone-800">
    <!-- header -->
    <div class="mb-2 flex">
      <h2 class="text-display-small grow text-stone-900 dark:text-stone-50">Word Count</h2>
      <button
        class="-mr-1 inline-flex size-6 items-center justify-center rounded-md transition-colors duration-100 hover:bg-stone-200 dark:hover:bg-stone-700"
        @click="$emit('close')"
      >
        <Icon class="text-caption text-stone-900/50 dark:text-stone-50/50" icon-name="cross_thin" />
      </button>
    </div>

    <!-- word counts -->
    <article class="text-body divide-y">
      <WordCountItem title="Estimated reading time">{{ readTime }} mins</WordCountItem>
      <WordCountItem title="Paragraphs">{{ paragraphs }}</WordCountItem>
      <WordCountItem title="Words">{{ words }}</WordCountItem>
      <WordCountItem title="Characters">{{ characters }}</WordCountItem>
      <WordCountItem title="Chars excluding spaces">{{ characterWithoutSpace }}</WordCountItem>
    </article>
  </div>
</template>
