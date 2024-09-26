<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

import LinkElement from '../common/link-element.vue'
import { styleProps } from '../utils/style-props'
import TextElement from './text-element.vue'

interface Author {
  name: string
  url: string
}

export default defineComponent({
  components: { LinkElement, TextElement },

  props: {
    kind: {
      type: String,
      required: true,
    },
    blockType: {
      type: String,
    },
    component: {
      type: String,
      default: 'p',
    },
    authorComponent: {
      type: String,
      default: 'span',
    },
    authors: {
      type: Array as PropType<Author[]>,
      required: true,
    },
    separator: {
      type: String,
      default: ', ',
    },
    authorClass: {
      type: String,
    },
    separatorClass: {
      type: String,
    },
    ...styleProps,
  },

  computed: {
    textProps() {
      const { component, authorComponent, authors, authorClass, separator, separatorClass, ...rest } = this.$props
      return {
        component: authorComponent,
        ...rest,
      }
    },
  },
})
</script>

<template>
  <component :is="component">
    <template v-for="(author, i) of authors" :key="i">
      <slot name="separator" :index="i" :author="author">
        <template v-if="i === 0" />
        <span v-else-if="i === authors.length - 1" :key="`${i}-sep`" :class="separatorClass"> and </span>
        <span v-else :class="separatorClass">{{ separator }}</span>
      </slot>
      <LinkElement :href="author.url" :class="authorClass">
        <slot name="author" :author="author" :index="i">
          <TextElement v-bind="textProps">{{ author.name }}</TextElement>
        </slot>
      </LinkElement>
    </template>
  </component>
</template>
