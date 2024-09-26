<script lang="ts">
import { defineComponent } from 'vue'
import { noop } from 'lodash-es'
import { Icon } from '@storipress/core-component'
import type { EventClickStepDataInterface } from './definition'
import GuideProgress from '~/components/Navbar/GuideProgress.vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useSiteStore } from '~/stores/site'
import { useTutorials } from '~/composables'

export default defineComponent({
  name: 'SettingsNavbar',
  components: {
    Icon,
    GuideProgress,
  },
  emits: ['onCloseNavbar'],
  setup() {
    const router = useRouter()
    const route = useRoute()
    const workspaceStore = useWorkspaceStore()
    const siteStore = useSiteStore()
    let clickCustomiseTheme: ReturnType<typeof useTutorials>['clickCustomiseTheme'] = noop

    const inPublication = computed(() => route.params?.clientID !== '_')
    if (inPublication.value) {
      clickCustomiseTheme = useTutorials().clickCustomiseTheme

      siteStore.fetchSiteTutorials()
    }

    const currentWorkspace = computed(() => workspaceStore.currentWorkspace)
    const siteTutorials = computed(() => siteStore?.siteTutorials)

    function handleClickGuideStep($event: EventClickStepDataInterface) {
      if ($event.path) {
        router.replace(`/${currentWorkspace.value?.id}${$event.path}`)
      }
      switch ($event.key) {
        case 'setCreateDesks':
          siteStore.changeNewDeskTutorials(true)
          router.push(`/${currentWorkspace.value?.id}/articles/desks/all`)
          break
        case 'setCustomiseTheme':
          clickCustomiseTheme()
          break
      }
    }
    return {
      siteTutorials,
      handleClickGuideStep,
      inPublication,
    }
  },
})
</script>

<template>
  <div class="z-20 border-b border-stone-200 bg-white/80 backdrop-blur-lg">
    <div class="mx-auto flex h-[3.5rem] w-full items-center justify-between pl-4 pr-[1.375rem]">
      <div><slot /></div>
      <div class="flex items-center">
        <GuideProgress
          v-if="inPublication"
          data-testid="guide-progress"
          class="mr-5"
          :guide-progress="siteTutorials"
          @click-step="handleClickGuideStep"
        />
        <button class="flex items-center" @click="$emit('onCloseNavbar')">
          <Icon icon-name="cross_thin" class="text-[1.125rem] text-[#4f4f4f]" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
