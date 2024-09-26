<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import {
  LeftHandNav,
  LeftHandNavBody,
  LeftHandNavFooter,
  LeftHandNavHeader,
  LeftHandNavItem,
} from '~/components/ui/LeftHandNav'
import { usePublicationPermission } from '~/composables/permission/publication'

const router = useRouter()

const { canSetupMember } = usePublicationPermission()

enum PageLevel {
  Home = 'Home',
  Stats = 'Stats',
}
const currentLevel = ref<PageLevel>(PageLevel.Home)

function gotoSetup() {
  router.push(`${router.currentRoute.value.fullPath}/setup`)
}
</script>

<template>
  <LeftHandNav v-bind="$attrs">
    <LeftHandNavHeader>
      <LeftHandNavItem
        :id="PageLevel.Home"
        icon-name="home"
        :text="PageLevel.Home"
        :is-target="currentLevel === PageLevel.Home"
        @click="currentLevel = PageLevel.Home"
      />
    </LeftHandNavHeader>

    <LeftHandNavBody />
    <LeftHandNavFooter>
      <button
        v-if="canSetupMember"
        class="text-button flex items-center justify-between rounded p-2 text-stone-600 hover:bg-stone-800/5"
        @click="gotoSetup"
      >
        <Icon class="mr-4 text-[1.125rem]" icon-name="settings" />
        Members Settings
      </button>
    </LeftHandNavFooter>
  </LeftHandNav>
</template>
