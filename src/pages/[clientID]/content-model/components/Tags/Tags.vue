<script lang="ts" setup>
import { Icon, Buttons as SpButton } from '@storipress/core-component'
import { useFuse } from '@vueuse/integrations/useFuse'
import TransitionWrap from '../TransitionWrap.vue'
import AddTagsModal from '../AddTagsModal/Modal.vue'
import type { ContentModelState } from '../../definition'
import { SymbolContentModelState } from '../../definition'
import TagEditor from './TagEditor.vue'
import type { CustomFieldGroupsQuery } from '~/graphql-operations'

type Groups = NonNullable<CustomFieldGroupsQuery['customFieldGroups']>['data']
const props = withDefaults(defineProps<{ groups: Groups; active: string }>(), {})

const contentModelState = inject(SymbolContentModelState) as ContentModelState

const currentGroup = computed(() => {
  return props.groups.find(({ name }) => props.active.replace(/^tag-/, '') === name)
})

const { results } = useFuse(
  computed(() => contentModelState.searchValue),
  computed(() => currentGroup.value?.tags ?? []),
  {
    fuseOptions: {
      keys: ['name'],
    },
    matchAllWhenSearchEmpty: true,
  },
)
const filtedTags = computed(() => results.value.map(({ item }) => item))

const router = useRouter()
const route = useRoute()

function toEdit() {
  const group = currentGroup.value
  if (group) {
    router.push({
      name: 'content-model-edit',
      params: {
        clientID: route.params.clientID,
        id: group.id,
      },
    })
  }
}

const modalsOpen = ref(false)

const currentTagId = ref('')
const currentTag = computed(() => {
  if (!currentTagId) return null
  return currentGroup.value?.tags?.find(({ id }) => id === currentTagId.value) ?? null
})
</script>

<template>
  <div class="flex-1 bg-stone-50 p-6">
    <div class="mb-6 flex items-center">
      <h1 class="text-display-small mr-2 font-bold">
        {{ currentGroup?.name ?? 'Tags' }} ({{ filtedTags.length ?? 0 }})
      </h1>
      <div class="text-display-small mr-6 text-stone-500">Tag Group</div>
      <SpButton
        class="text-caption h-[1.375rem] px-[.375rem] uppercase text-stone-400 shadow-1-layer transition-colors hover:bg-stone-100"
        @click="modalsOpen = true"
      >
        <Icon icon-name="plus" class="mr-1.5" />
        New tag to group
      </SpButton>
      <div class="flex-1" />
      <SpButton class="shadow-1-layer" @click="toEdit">Edit content model</SpButton>
    </div>
    <ul class="flex flex-wrap gap-2">
      <li
        v-for="tag of filtedTags"
        :key="tag.id"
        class="flex size-[6.25rem] cursor-pointer flex-col items-center overflow-hidden rounded-lg bg-white py-5 text-stone-600 shadow-1-layer transition-shadow hover:shadow-2-layer"
        @click="currentTagId = tag.id"
      >
        <Icon icon-name="tag" class="mb-2.5 text-[2rem]" />
        <p class="text-body w-full flex-1 self-center truncate px-2.5 text-center">
          {{ tag.name }}
        </p>
      </li>
    </ul>
    <TransitionWrap>
      <TagEditor v-if="currentTagId" :tag="currentTag" :custom-field-group="currentGroup" @close="currentTagId = ''" />
    </TransitionWrap>
    <AddTagsModal v-model="modalsOpen" :group-id="currentGroup?.id ?? ''" />
  </div>
</template>
