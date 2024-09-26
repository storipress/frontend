<script lang="ts" setup>
import dayjs from 'dayjs'
import type { ArticleInjected } from '../../elements/inject'
import { createProvider } from '../../elements/provider'
import { data } from './article-data'

const provided = createProvider({ ...data, date: dayjs(data.date).toDate(), site: { name: 'Storipress' } })

provide<ArticleInjected>('$element', provided)
</script>

<template>
  <slot />
</template>
