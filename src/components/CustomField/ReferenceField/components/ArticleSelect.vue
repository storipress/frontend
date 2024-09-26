<script setup lang="ts">
import { AutoComplete as SpAutoComplete, SelectTypeahead as SpSelectTypeahead } from '@storipress/core-component'
import { AisHits, AisInstantSearch, AisSearchBox } from 'vue-instantsearch/vue3/es'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
import type { SearchClient } from 'typesense'
import type { Article, CustomFieldReferenceTargetValue, GetArticleSearchKeyQuery } from '~/graphql-operations'
import { GetArticleSearchKeyDocument } from '~/graphql-operations'
import { env } from '~/env'
import { filterHTMLTag } from '~/utils'

const props = withDefaults(
  defineProps<{
    modelValue: CustomFieldReferenceTargetValue[]
    label?: string
    htmlName: string
    placeholder?: string
    multiple?: boolean
  }>(),
  {
    modelValue: () => [],
    label: '',
    placeholder: '',
    multiple: false,
  },
)
const emit = defineEmits<(event: 'update:modelValue', value: string[]) => void>()

const route = useRoute()

const { result: resultOfSearchKey } = useQuery<GetArticleSearchKeyQuery>(GetArticleSearchKeyDocument, undefined, {
  fetchPolicy: 'network-only',
  nextFetchPolicy: 'network-only',
})

const searchClient = ref<SearchClient | undefined>(undefined)

const multipleDefaultValue = computed(() => {
  return props.modelValue.flatMap((item) =>
    item.__typename === 'Article' ? { title: filterHTMLTag(item.title), id: item.id } : [],
  )
})
const defaultValue = computed(() => {
  const result = props.modelValue?.find((item) => item.__typename === 'Article') as Article
  return result ? { title: filterHTMLTag(result.title), id: result.id } : undefined
})

watch(resultOfSearchKey, () => {
  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
      apiKey: resultOfSearchKey.value?.articleSearchKey || '',
      nodes: [
        {
          host: env.VITE_TYPESENSE_DOMAIN,
          port: 443,
          protocol: 'https',
        },
      ],
    },
    additionalSearchParameters: {
      query_by: 'title',
    },
  })
  searchClient.value = typesenseInstantsearchAdapter.searchClient
})
</script>

<template>
  <AisInstantSearch v-if="searchClient" :index-name="route.params.clientID" :search-client="searchClient">
    <AisHits v-slot="{ items }">
      <AisSearchBox v-slot="{ currentRefinement, refine }">
        <SpSelectTypeahead
          v-if="multiple"
          :label="label"
          :placeholder="placeholder"
          :name="htmlName"
          :items="items"
          :model-value="undefined"
          :input-value="currentRefinement"
          :default-value="modelValue ? multipleDefaultValue : undefined"
          option-label-prop="title"
          @update:model-value="
            emit(
              'update:modelValue',
              $event.map((item: CustomFieldReferenceTargetValue) => item.id),
            )
          "
          @update:input-value="refine($event)"
        />
        <SpAutoComplete
          v-else
          :label="label"
          :placeholder="placeholder"
          :html-name="htmlName"
          :items="items"
          :default-item="defaultValue"
          option-label-prop="title"
          @update:model-value="
            defaultValue?.id !== ($event as CustomFieldReferenceTargetValue).id &&
              emit('update:modelValue', [($event as CustomFieldReferenceTargetValue).id])
          "
          @input="refine($event.target.value)"
        />
      </AisSearchBox>
    </AisHits>
  </AisInstantSearch>
</template>

<style scoped></style>
