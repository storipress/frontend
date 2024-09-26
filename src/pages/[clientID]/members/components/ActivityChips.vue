<script lang="ts" setup>
import { Chips, Icon } from '@storipress/core-component'
import { getRank } from './utils'

const props = withDefaults(defineProps<{ bounced?: boolean; newsletter?: boolean; activity: number }>(), {
  bounced: false,
  newsletter: false,
  activity: 0,
})

enum Status {
  Normal = 'Normal',
  Bounced = 'Bounced',
  Unsubscribed = 'Unsubscribed',
}
const status = computed<Status>(() => {
  if (props.bounced) return Status.Bounced
  if (!props.newsletter) return Status.Unsubscribed
  return Status.Normal
})

const rank = computed(() => getRank(props.activity))
</script>

<template>
  <Chips
    v-if="status !== Status.Normal"
    :label="status"
    :class="{
      'bg-warning/[.2] text-warning': status === Status.Bounced,
      'bg-stone-800/[.2] text-stone-800': status === Status.Unsubscribed,
    }"
  />
  <template v-else>
    <Icon v-for="val in rank" :key="`star_${val}`" icon-name="star" class="mr-0.5 text-[1rem] text-yellow-500" />
    <Icon
      v-for="val in 5 - rank"
      :key="`star_outline_${val}`"
      icon-name="star_outline"
      class="mr-0.5 text-[1rem] text-yellow-500"
    />
  </template>
</template>
