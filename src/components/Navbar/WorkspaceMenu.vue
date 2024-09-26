<!-- menu to switch workspaces / change workspace settings -->
<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { Menu as HMenu, MenuButton as HMenuButton, MenuItems as HMenuItems } from '@headlessui/vue'
import { Buttons as MyButton, mergeTailwind } from '@storipress/core-component'
import { match } from 'ts-pattern'
import NavbarMenuLinkItem from './NavbarMenuLinkItem.vue'
import type { WorkspaceInfoInterface } from './definition'
import { Flags, useFeatureFlag } from '~/lib/feature-flag'
import { usePublicationPermission } from '~/composables/permission/publication'
import { ConnectedTarget, useSiteURL, useTutorials, useUserSubscription } from '~/composables'

export default defineComponent({
  name: 'WorkspaceMenu',
  components: {
    HMenu,
    HMenuButton,
    HMenuItems,
    NavbarMenuLinkItem,
    MyButton,
  },
  props: {
    currentWorkspace: {
      type: Object as PropType<WorkspaceInfoInterface>,
      default: () => ({}),
      required: true,
    },
    workspaceList: {
      type: Array as PropType<WorkspaceInfoInterface[]>,
      default: () => [],
      required: true,
    },
  },
  setup() {
    const { canAccessBuilder, canSettingContentModel } = usePublicationPermission()
    const { canAccessAllPlusFeatures } = useUserSubscription()
    const { setTutorials } = useTutorials()
    const { siteURL, isSupportCustomTheme, connectedTarget } = useSiteURL()
    const goToSiteText = computed(() => {
      return match(connectedTarget.value)
        .with(ConnectedTarget.Webflow, () => 'Go to Webflow site')
        .with(ConnectedTarget.Shopify, () => 'Go to Shopify site')
        .with(ConnectedTarget.WordPress, () => 'Go to WordPress site')
        .otherwise(() => 'Go to site')
    })

    return {
      canAccessBuilder,
      canSettingContentModel,
      canAccessAllPlusFeatures,
      mergeTailwind,
      setTutorials,
      enableCustomSite: useFeatureFlag(Flags.CustomSite),
      goToSiteText,
      siteURL,
      // TODO: should we hide content model if no custom site?
      hasCustomSite: true,
      isSupportCustomTheme,
    }
  },
})
</script>

<template>
  <HMenu as="div" :class="mergeTailwind(['relative inline-flex', $attrs.class])">
    <HMenuButton class="inline-flex w-full justify-center">
      <MyButton
        is-shadow
        class="line-clamp-1 h-8 max-w-[14rem] truncate py-2 transition-colors duration-150 md:min-w-[6.5rem]"
        type="main"
        color="primary"
        data-testid="navbar-workspace-trigger"
        >{{ currentWorkspace.name }}</MyButton
      >
    </HMenuButton>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <HMenuItems
        class="layer-2 absolute right-0 z-[52] mt-11 flex origin-right divide-x divide-white/[.15] rounded-lg bg-stone-800 focus:outline-none"
      >
        <!-- left publication switcher -->
        <div class="flex max-h-96 w-64 flex-col justify-between overflow-y-auto p-2">
          <div class="flex flex-col justify-start">
            <NavbarMenuLinkItem
              v-for="workspace in workspaceList"
              :key="workspace.id"
              :text="workspace.name"
              :hint="workspace.domain"
              :href="`/${workspace.id}/`"
            />
          </div>
          <NavbarMenuLinkItem
            class="mt-1 justify-center"
            icon-name="publication"
            icon-class="text-white/50"
            text="View more"
            text-class="font-light"
            to="/workspaces"
          />
        </div>
        <!-- right current publication menu -->
        <div class="w-52 p-2">
          <NavbarMenuLinkItem
            icon-name="settings"
            icon-class="text-white/50"
            text="Publication settings"
            :to="`/${currentWorkspace.id}/preferences/publication/details`"
          />
          <NavbarMenuLinkItem
            v-if="canAccessBuilder && isSupportCustomTheme"
            icon-name="theme"
            icon-class="text-white/50"
            text="Customise theme"
            :href="`/builder/${currentWorkspace.id}/front-page`"
            @click="setTutorials('setCustomiseTheme')"
          />
          <NavbarMenuLinkItem
            v-if="enableCustomSite && hasCustomSite && canSettingContentModel && canAccessAllPlusFeatures"
            icon-name="database"
            icon-class="text-white/50"
            text="Content model"
            :to="`/${currentWorkspace.id}/content-model`"
          />
          <NavbarMenuLinkItem
            icon-name="goto-url"
            icon-class="text-white/50"
            :text="goToSiteText"
            :href="siteURL"
            target="_blank"
            rel="noreferrer noopener"
          />
        </div>
      </HMenuItems>
    </transition>
  </HMenu>
</template>
