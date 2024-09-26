<script lang="ts" setup>
import { Chips, Dropdowns, Icon, MenuItem } from '@storipress/core-component'
import type { PublicationsInfo } from '../definition'
import Suspend from './components/Suspend.vue'
import type { RoleKeys } from '~/utils/definition'
import type { ListWorkspacesQuery, UserStatus, Workspace } from '~/graphql-operations'
import { ListWorkspacesDocument } from '~/graphql-operations'
import { env } from '~/env'

useHead({
  title: 'Storipress account profile',
})

const { result } = useQuery(ListWorkspacesDocument)
const workspaces = computed(() => {
  return result.value?.workspaces ?? ([] as ListWorkspacesQuery['workspaces'])
})

const suspend = ref(false)
const publicationInfo = ref<Omit<Workspace, 'hidden'> | undefined>()
function onOpenSuspendUser(publicationData: Omit<Workspace, 'hidden'>) {
  suspend.value = true
  publicationInfo.value = publicationData
}

const publicationsInfo: PublicationsInfo[] = [
  {
    key: 'owner',
    title: 'Publications you own',
    info: 'Publications you own and which count towards your plan limit',
  },
  {
    key: 'admin',
    title: 'Admin Editor',
    info: 'Publications you’re an Admin of',
  },
  {
    key: 'editor',
    title: 'Editor',
    info: 'Publications you’re an Editor for',
  },
  {
    key: 'author',
    title: 'Writer',
    info: 'Publications you’re an Writer for',
  },
  {
    key: 'contributor',
    title: 'Guest',
    info: 'Publications you’re a Guest to',
  },
]

const isLastItem = computed(() => (item: ListWorkspacesQuery['workspaces'], index: number) => {
  return item.length - index === 1
})
const multiplePublications = computed(() => (item: ListWorkspacesQuery['workspaces']) => {
  return item.length > 1
})

const workspace = computed(() => (role: RoleKeys) => {
  return workspaces.value?.filter((item) => item.role === role)
})

const isSuspended = computed(() => (status: UserStatus) => {
  return status !== 'active'
})

function onGoToHomepage(workspace: string) {
  window.open(`https://${workspace}.${env.VITE_STORIPRESS_DOMAIN}`)
}
</script>

<template>
  <Section title="Publications" class="w-full">
    <template v-for="publication in publicationsInfo">
      <SectionContent
        v-if="workspaces.map((info) => info.role).includes(publication.key)"
        :key="publication.key"
        :sub-title="publication.title"
        :content="publication.info"
      >
        <template #content>
          <div
            v-for="(item, index) in workspace(publication.key)"
            :key="index"
            class="flex items-center justify-between"
            :class="{
              'mb-5 border-b border-stone-200 pb-5':
                multiplePublications(workspace(publication.key)) && !isLastItem(workspace(publication.key), index),
            }"
          >
            <div :class="{ 'opacity-25': isSuspended(item.status) }">
              <div role="button" class="text-base font-semibold text-[#353535]">
                {{ item.name }}
                <Icon
                  icon-name="goto-url"
                  class="ml-2 text-[0.75rem] text-stone-500 hover:opacity-60 hover:duration-75"
                  @click="onGoToHomepage(item.workspace)"
                />
              </div>
              <div class="text-body text-stone-800">{{ item.workspace }}</div>
            </div>
            <Chips v-if="isSuspended(item.status)" label="Suspended" color="warning" class="mr-3" />
            <Dropdowns v-if="!isSuspended(item.status)" placement="left-start">
              <MenuItem>
                <a :href="`/${item.id}`">Go to publication</a>
              </MenuItem>
              <MenuItem v-if="item.role !== 'owner'" @click="onOpenSuspendUser(item)">Leave publication</MenuItem>
            </Dropdowns>
          </div>
        </template>
      </SectionContent>
    </template>
  </Section>
  <Suspend v-if="publicationInfo" :open="suspend" :publication="publicationInfo" @close="suspend = false" />
</template>

<style></style>
