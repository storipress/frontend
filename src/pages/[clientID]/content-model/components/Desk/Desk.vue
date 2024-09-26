<script lang="ts" setup>
import { Icon, Buttons as SpButton } from '@storipress/core-component'
import { useFuse } from '@vueuse/integrations/useFuse'
import TransitionWrap from '../TransitionWrap.vue'
import type { ContentModelState } from '../../definition'
import { SymbolContentModelState } from '../../definition'
import DeskEditor from './DeskEditor.vue'
import type { CustomFieldGroupsQuery } from '~/graphql-operations'
import {
  CustomFieldGroupType,
  DesksCustomFieldDocument,
  SyncGroupableToCustomFieldGroupDocument,
} from '~/graphql-operations'

type Groups = NonNullable<CustomFieldGroupsQuery['customFieldGroups']>['data']
const props = withDefaults(defineProps<{ groups: Groups }>(), {})

const contentModelState = inject(SymbolContentModelState) as ContentModelState

const group = computed(() => props.groups.find(({ type }) => type === CustomFieldGroupType.DeskMetafield))

const router = useRouter()
const route = useRoute()

function toEdit() {
  if (group.value) {
    router.push({
      name: 'content-model-edit',
      params: {
        clientID: route.params.clientID,
        id: group.value.id,
      },
    })
  }
}

const { result: desks } = useQuery(DesksCustomFieldDocument)
const { mutate: mutateSyncGroup } = useMutation(SyncGroupableToCustomFieldGroupDocument)
watchEffect(async () => {
  if (!group.value?.id || !desks.value) return
  const targetIds = desks.value.desks.map(({ id }) => id)
  await mutateSyncGroup({ input: { id: group.value.id, target_ids: targetIds, detaching: false } })
})

const currentDeskId = ref('')
const currentDesk = computed(() => {
  if (!currentDeskId) return null
  return desks.value?.desks?.find(({ id }) => id === currentDeskId.value) ?? null
})

const { results } = useFuse(
  computed(() => contentModelState.searchValue),
  computed(() => desks.value?.desks ?? []),
  {
    fuseOptions: {
      keys: ['name'],
    },
    matchAllWhenSearchEmpty: true,
  },
)
const filtedDesks = computed(() => results.value.map(({ item }) => item))
</script>

<template>
  <div class="flex-1 bg-stone-50 p-6">
    <div class="mb-6 flex items-center">
      <h1 class="text-display-small mr-2 font-bold">{{ group?.name ?? 'Desk' }} ({{ filtedDesks.length ?? 0 }})</h1>
      <div class="text-display-small text-stone-500">Desk Group</div>
      <div class="flex-1" />
      <SpButton class="shadow-1-layer" @click="toEdit">Edit content model</SpButton>
    </div>
    <ul class="flex flex-wrap gap-2">
      <li
        v-for="desk of filtedDesks"
        :key="desk.id"
        class="flex size-[6.25rem] cursor-pointer flex-col items-center overflow-hidden rounded-lg bg-white py-5 text-stone-600 shadow-1-layer transition-shadow hover:shadow-2-layer"
        @click="currentDeskId = desk.id"
      >
        <Icon icon-name="desk" class="mb-3 text-[2rem]" />
        <p class="text-body w-full flex-1 self-center truncate px-2 text-center">
          {{ desk.name }}
        </p>
      </li>
    </ul>
    <TransitionWrap>
      <DeskEditor v-if="currentDeskId" :desk="currentDesk" :custom-field-group="group" @close="currentDeskId = ''" />
    </TransitionWrap>
  </div>
</template>
