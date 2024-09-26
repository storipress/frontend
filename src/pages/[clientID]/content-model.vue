<script lang="ts" setup>
import * as Sentry from '@sentry/vue'
import { useFuse } from '@vueuse/integrations/useFuse'
import Navbar from './content-model/components/Navbar.vue'
import Sidebar from './content-model/components/Sidebar.vue'
import AddFieldsSidebar from './content-model/components/AddFieldsSidebar.vue'
import Content from './content-model/components/Content.vue'
import Tags from './content-model/components/Tags/Tags.vue'
import Desk from './content-model/components/Desk/Desk.vue'
import { SymbolContentModelState, parametersTypeMap } from './content-model/definition'
import type { CustomFieldGroup } from '~/graphql-operations'
import {
  CreateCustomFieldGroupDocument,
  CustomFieldGroupType,
  CustomFieldGroupsDocument,
  DesksCustomFieldDocument,
} from '~/graphql-operations'
import { useWorkspaceStore } from '~/stores/workspace'

const workspaceStore = useWorkspaceStore()

useHead({
  title: computed(() => `${workspaceStore.currentWorkspace?.name ?? ''} - Content Model - Storipress`),
})

const route = useRoute()

const addModalVisible = ref(false)
provide('addModalVisible', addModalVisible)

const active = computed(() => {
  return parametersTypeMap[route.params.group as string] ?? route.params.group
})

const contentModelState = reactive({
  searchValue: '',
})
provide(SymbolContentModelState, contentModelState)

const { result: customFieldGroupsResult, refetch } = useQuery(CustomFieldGroupsDocument)
const { result: desksResult } = useQuery(DesksCustomFieldDocument)
const customFieldGroups = computed(() => customFieldGroupsResult.value?.customFieldGroups?.data || [])

// initialize desk group
const { mutate: createCustomFieldGroup } = useMutation(CreateCustomFieldGroupDocument)
watch(customFieldGroups, async (groups) => {
  const deskMetafield = groups.find(({ type }) => type === CustomFieldGroupType.DeskMetafield)
  if (deskMetafield) return

  await createCustomFieldGroup({
    input: {
      key: 'desk',
      type: CustomFieldGroupType.DeskMetafield,
      name: 'Desk',
      description: 'Desk',
    },
  }).catch((error) => {
    Sentry.captureException(error, (scope) => {
      scope.setTag('request_fail', 'createCustomFieldGroup')
      return scope
    })
  })
  refetch()
})

const groupNameList = computed(() => customFieldGroups.value.map(({ name }) => name))
const { results: fuseResult } = useFuse(toRef(contentModelState, 'searchValue'), groupNameList)

const filtedGroups = computed(() => {
  if (contentModelState.searchValue && fuseResult.value.length === 0) return []

  const searchResults = contentModelState.searchValue
    ? fuseResult.value.map(({ refIndex }) => customFieldGroups.value[refIndex])
    : customFieldGroups.value

  return searchResults.filter(({ type, key }) => {
    if (key.startsWith('__')) return false
    if (active.value === '') return true
    return type === active.value
  })
})

const desksCount = computed(() => {
  return desksResult.value?.desks.length ?? 0
})

const tagGroups = computed(() => {
  const tags = customFieldGroups.value
    .filter(({ type }) => type === CustomFieldGroupType.TagMetafield)
    ?.map(({ name, tags }) => ({ name, count: tags.length }))
  return tags ?? []
})

const isContentTypes = computed(() =>
  new Set([CustomFieldGroupType.ArticleContentBlock, CustomFieldGroupType.ArticleMetafield, '']).has(active.value),
)
const isTag = computed(() => /^tag-.+/.test(active.value as CustomFieldGroupType))

const isGroupPage = computed(() => route.name === 'clientID-content-model-group')

const router = useRouter()
router.beforeEach((to, _from, next) => {
  if (to.name !== 'clientID-content-model-group') {
    if (isContentTypes.value) {
      to.meta.isContent = true
      to.meta.groups = filtedGroups.value
    } else {
      if (isTag.value) {
        to.meta.isTag = true
        to.meta.active = active.value
      } else {
        to.meta.isDesk = true
      }
      to.meta.groups = customFieldGroups.value
    }
  }
  contentModelState.searchValue = ''
  next()
})
</script>

<template>
  <div class="flex h-screen flex-col">
    <Navbar v-model="contentModelState.searchValue" />
    <div class="flex flex-1" :class="{ 'overflow-y-hidden': !isGroupPage }">
      <Sidebar v-if="isGroupPage" v-model="active" class="w-60" :tag-groups="tagGroups" :desk-count="desksCount" />
      <AddFieldsSidebar v-else @add-field="addModalVisible = true" />

      <div class="flex flex-1">
        <Content
          v-if="route.meta.isContent || isContentTypes"
          class="flex-1"
          :groups="(route.meta.groups as CustomFieldGroup[]) || filtedGroups"
        />
        <Tags
          v-else-if="route.meta.isTag || isTag"
          :groups="customFieldGroups || route.meta.groups"
          :active="(route.meta.active as string) || active"
        />
        <Desk v-else-if="route.meta.isDesk || !isTag" :groups="customFieldGroups || route.meta.groups" />
      </div>
    </div>

    <router-view />
  </div>
</template>

<style lang="scss"></style>
