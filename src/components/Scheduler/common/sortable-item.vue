<script lang="ts" setup>
import { SlickItem } from '@storipress/vue-slicksort'
import { isSchedulable } from '../helpers'
import { ArticleLine } from '../ArticleLine'
import type { Article, Location } from '../definitions'
import { useUserPermission } from '~/composables'
import type { dayjs } from '~/lib/dayjs'

const props = defineProps<{
  index: number
  article: Article
  proposedTime?: dayjs.Dayjs
  today?: dayjs.Dayjs
  loc?: Location
}>()

const emit = defineEmits<(event: 'update:proposedTime', proposedTime?: dayjs.Dayjs) => void>()

const attrs = useAttrs()

const userPermission = useUserPermission()

const disabled = computed(() => !isSchedulable(props.article, userPermission.value.role, props.loc))

const articleProps = computed(() => {
  const { index, ...p } = props
  return {
    ...p,
    ...attrs,
    disabled: disabled.value,
    'onUpdate:proposedTime': (proposedTime?: dayjs.Dayjs) => {
      emit('update:proposedTime', proposedTime)
    },
  }
})
</script>

<template>
  <SlickItem :index="index" :disabled="disabled">
    <ArticleLine v-bind="articleProps" />
  </SlickItem>
</template>
