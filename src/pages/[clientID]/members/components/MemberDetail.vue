<script lang="ts" setup>
import { computed, defineProps, ref, withDefaults } from 'vue'
import { Pagination, Stats } from '@storipress/core-component'
import useSubscriberEvents from './hooks/useSubscriberEvents'
import useSubscriberStats, { getSubscriberType } from './hooks/useSubscriberStats'
import { dayjs } from '~/lib/dayjs'
import { GetSiteDocument } from '~/graphql-operations'

interface TProps {
  id: string
}
const props = withDefaults(defineProps<TProps>(), {
  id: '',
})

const { data, statsList } = useSubscriberStats(props.id)

const { result: siteResult } = useQuery(GetSiteDocument)
const cards = computed(() => {
  const currency = siteResult.value?.site.currency ?? 'US'
  const subscriber = data.value
  return [
    { title: 'Subscriber type', content: getSubscriberType(subscriber?.subscription_type) },
    { title: 'Signup source', content: subscriber?.signed_up_source?.toString() },
    { title: 'Paid so far', content: `${currency}$${subscriber?.revenue?.replace(/\B(?=\d{2}$)/, '.')}` },
    { title: 'Emails received', content: subscriber?.email_receives?.toString() },
    { title: 'Emails opened', content: subscriber?.email_opens_total?.toString() },
    { title: 'Email links clicked', content: subscriber?.email_link_clicks_total?.toString() },
  ]
})

enum StatsType {
  Events = 'Events',
  Stats = 'Stats',
  // Comments = 'Comments',
}

const selectedStat = ref<StatsType>(StatsType.Events)

const { events, eventsContent, turnPages } = useSubscriberEvents(props.id ?? '')
const pageLength = computed(() => events.value?.paginatorInfo.lastPage || 1)
const currentPage = ref(1)
watch(currentPage, turnPages)
</script>

<template>
  <SectionContent
    :sub-title="data?.email ?? ''"
    :content="`${data?.subscription_type} subscriber, on your list since ${dayjs(data?.created_at).format(
      'D MMM YYYY',
    )}. ${data?.renew_on ? `Subscription renews on ${dayjs(data?.renew_on).format('D MMM YYYY')}.` : ''}`"
    class="section-content"
  >
    <div class="flex-1" />
    <div class="shrink pb-8">
      <div class="grid grid-cols-3 gap-2 overflow-hidden">
        <div v-for="statsData in cards" :key="statsData.title" class="flex">
          <Stats v-bind="statsData" class="w-48 flex-1 overflow-hidden" />
        </div>
      </div>
      <p v-if="data?.renew_on" class="text-style-2 mt-3 text-stone-500">
        Paid subscription renews on {{ dayjs(data?.renew_on).format('D MMM YYYY') }}
      </p>
    </div>
  </SectionContent>
  <Section title="Detailed stats">
    <hr class="mb-4 h-px bg-stone-200" />
    <div class="mb-4 grid grid-flow-col grid-cols-4">
      <div class="table-border col-span-3 rounded-md bg-white">
        <div class="flex gap-3 px-4 py-3">
          <button
            v-for="stat in StatsType"
            :key="stat"
            class="text-body text-stone-600"
            :class="{ 'font-bold': stat === selectedStat }"
            @click="selectedStat = stat"
          >
            {{ stat }}
          </button>
        </div>
        <template v-if="selectedStat === StatsType.Stats">
          <div v-for="item in statsList" :key="item.title" class="text-body flex gap-3 border-t px-4 py-3">
            <div class="w-2/5 text-stone-400">
              {{ item.title }}
            </div>
            <div class="flex-1 pl-4 text-stone-700">
              <component :is="item.component" v-if="item.component" />
              <span v-else>
                {{ item.value }}
              </span>
            </div>
          </div>
        </template>
        <template v-else>
          <component :is="element" v-for="element in eventsContent" :key="element.id" />
          <div v-if="pageLength > 1" class="mt-5 flex justify-end">
            <Pagination v-model="currentPage" :page-length="pageLength" />
          </div>
        </template>
      </div>
    </div>
  </Section>
</template>

<style lang="postcss">
.table-border {
  @apply border;
  border-color: (176, 182, 187, 0.25);
}
</style>
