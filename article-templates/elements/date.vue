<script lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { omit } from 'lodash'
import { Element } from './base'

dayjs.extend(utc)
dayjs.extend(timezone)

export default defineComponent({
  mixins: [Element],
  props: {
    format: {
      type: String,
      default: 'MMM-DD-YYYY hh:mmA [GMT]Z',
    },
  },

  computed: {
    date(): dayjs.Dayjs {
      return dayjs(this.$element?.date)
    },

    datetime(): string {
      try {
        return this.date.toISOString()
      } catch {
        return ''
      }
    },

    display(): string {
      return this.date.format(this.format)
    },

    styleWithoutFormat(): Record<string, unknown> {
      return omit(this.styles, 'format')
    },
  },
})
</script>

<template>
  <ArticleElement component="p" kind="article-date" class="article-date" :styles="styleWithoutFormat">
    <time v-if="datetime" :datetime="datetime">{{ display }}</time>
    <time v-else-if="typeof date === 'string'" :datetime="date">{{ date }}</time>
  </ArticleElement>
</template>
