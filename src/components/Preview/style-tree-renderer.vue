<script lang="ts" setup>
import { defineProps } from 'vue'
import type { StyleTree } from '~/lib/dynamic-style'
import { generate, scopeTree } from '~/lib/dynamic-style'
import { aliasParagraph } from '~/lib/dynamic-style/patch-style-tree'

const props = defineProps<{
  scope?: string
  styleTree: StyleTree
}>()

const style = 'style'

const css = computed(() => {
  let tree = aliasParagraph(props.styleTree)
  if (props.scope) {
    tree = scopeTree(props.scope, tree)
  }

  return generate(tree)
})
</script>

<template>
  <component :is="style" v-text="css" />
</template>
