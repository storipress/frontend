<!-- User setup progress bar menu -->
<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import { Dropdowns, mergeTailwind } from '@storipress/core-component'
import { MenuButton as HMenuButton, MenuItem as HMenuItem } from '@headlessui/vue'
import CircleProgress from './CircleProgress.vue'
import CheckItem from './CheckItem.vue'
import type {
  EventClickStepDataInterface,
  EventClickTextDataInterface,
  TutorialDataInterface,
  TutorialKeyType,
} from './definition'
import { useSiteURL } from '~/composables'

export default defineComponent({
  name: 'NavbarGuideProgress',
  components: {
    HMenuButton,
    HMenuItem,
    CircleProgress,
    CheckItem,
    Dropdowns,
  },
  props: {
    guideProgress: {
      type: Object as PropType<Record<TutorialKeyType, boolean>>,
      default: () => ({}),
      required: true,
    },
  },
  emits: ['clickStep', 'showGuideProgress'],
  setup(props, { emit }) {
    const { isSetShopify, isSetWebflow, isSetWordpress } = useSiteURL()
    const isConnectedSiteBuilder = computed(() => isSetShopify.value || isSetWebflow.value || isSetWordpress.value)

    const baseTutorials = [
      { name: 'Add a favicon / logomark', key: 'setPublicationDetail', path: '/preferences/publication/details' },
      { name: 'Create a desk (a content category)', key: 'setCreateDesks' },
      { name: 'Customize theme', key: 'setCustomiseTheme' },
      {
        name: 'Connect domain, Webflow, or Shopify',
        key: 'setDomain',
        path: '/preferences/publication/integrations',
      },
      {
        name: 'Connect a social account',
        key: 'setSocialConnect',
        path: '/preferences/publication/integrations',
      },
    ] as TutorialDataInterface[]

    const tutorials = computed<TutorialDataInterface[]>(() => {
      if (isConnectedSiteBuilder.value) {
        return baseTutorials.filter((tutorial) => tutorial.key !== 'setCustomiseTheme')
      }

      return baseTutorials
    })

    const finishedItemNum = computed(() => {
      if (props.guideProgress) {
        const finished = tutorials.value.filter((tutorial) => Boolean(props.guideProgress[tutorial.key]))
        return finished.length
      }
      return 0
    })

    whenever(
      () => tutorials.value.length - finishedItemNum.value !== 0,
      () => {
        emit('showGuideProgress')
      },
      { immediate: true },
    )

    return {
      tutorials,
      finishedItemNum,
      handleClickStepWithIndex(data: EventClickTextDataInterface, index: number, tutorial: TutorialDataInterface) {
        emit('clickStep', {
          index,
          ...tutorial,
          ...data,
        } as EventClickStepDataInterface)
      },
      mergeTailwind,
    }
  },
})
</script>

<template>
  <Dropdowns
    v-if="tutorials.length - finishedItemNum > 0"
    as="div"
    :class="mergeTailwind(['relative inline-flex', $attrs.class])"
    :class-items="mergeTailwind(['mr-2', 'mt-1.5', 'overflow-hidden'])"
  >
    <template #button>
      <HMenuButton class="inline-flex w-full justify-center">
        <CircleProgress :value="finishedItemNum" :denominator="tutorials.length" data-testid="navbar-guide-trigger" />
      </HMenuButton>
    </template>
    <template #default>
      <div class="w-[19rem] px-4 py-3">
        <p class="text-body mb-4 font-semibold text-stone-800">
          Make the most out of Storipress by completing publication setup:
        </p>
        <ul>
          <HMenuItem v-for="(tutorial, index) in tutorials" :key="index">
            <CheckItem
              :checked="guideProgress && guideProgress[tutorial.key]"
              :text="tutorial.name"
              @click-text="(data) => handleClickStepWithIndex(data, index, tutorial)"
            />
          </HMenuItem>
        </ul>
      </div>
    </template>
  </Dropdowns>
</template>
