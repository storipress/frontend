<script setup lang="ts">
import type * as Y from 'yjs'
import type { FormModel } from '../types'
import { RichInput } from '~/components/Editor/rich-input'

withDefaults(
  defineProps<{
    hasProseInit: { loaded: boolean; title: boolean; blurb: boolean }
    formModel: Pick<FormModel, 'title' | 'blurb'>
    ydoc: Y.Doc
    changeTitle: (value: FormModel['title']) => void
    changeBlurb: (value: FormModel['blurb']) => void
  }>(),
  {},
)
</script>

<template>
  <RichInput
    :model-value="hasProseInit.title ? undefined : formModel.title"
    class="has-dark rounded-md p-2 font-iAWriterQuattro text-4xl leading-relaxed text-stone-800 transition-colors hover:bg-stone-900/5 dark:text-stone-100 dark:hover:bg-stone-200/5"
    placeholder="Enter your headline"
    field-name="title"
    :ydoc="ydoc"
    @update:model-value="changeTitle($event)"
  />
  <RichInput
    :model-value="hasProseInit.blurb ? undefined : formModel.blurb"
    class="has-dark rounded-md p-2 font-iAWriterQuattro text-xl leading-relaxed text-stone-800 transition-colors hover:bg-stone-900/5 dark:text-stone-100 dark:hover:bg-stone-200/5"
    placeholder="Enter your article subheading"
    field-name="blurb"
    :ydoc="ydoc"
    @update:model-value="changeBlurb($event)"
  />
</template>
