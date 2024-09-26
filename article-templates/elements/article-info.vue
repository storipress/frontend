<script lang="ts">
import { computed, defineComponent, readonly } from 'vue'

import { useArticleElement } from './inject'

export default defineComponent({
  setup() {
    const element = useArticleElement()

    return {
      article: computed(() => {
        const { title, blurb, headlineCaption, desk, authors, date, headlineURL, headlineFocus, headlineAlt } = element

        return {
          title,
          blurb,
          headlineCaption,
          desk,
          deskUrl: '#',
          authors,
          date,
          headlineURL,
          headlineFocus,
          headlineAlt,

          headline: headlineURL,
        }
      }),
      socials: readonly({
        facebook: '#',
        twitter: '#',
        email: '#',
      }),
    }
  },
})
</script>

<template>
  <div>
    <slot :article="article" :socials="socials" />
  </div>
</template>
