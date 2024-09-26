<!-- menu for help / change user settings -->
<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { Menu as HMenu, MenuButton as HMenuButton, MenuItems as HMenuItems } from '@headlessui/vue'
import { mergeTailwind } from '@storipress/core-component'
import Avatar from './Avatar.vue'
import NavbarMenuLinkItem from './NavbarMenuLinkItem.vue'
import type { UserInfoInterface } from './definition'
import { useAuthStore } from '~/stores/auth'
import { useMutation } from '~/lib/apollo'
import { LogoutDocument } from '~/graphql-operations'
import { usePublicationPermission } from '~/composables/permission/publication'
import { useMe } from '~/composables/me'

export default defineComponent({
  name: 'UserMenu',
  components: {
    HMenu,
    HMenuButton,
    HMenuItems,
    NavbarMenuLinkItem,
    Avatar,
  },
  props: {
    workspaceId: {
      type: String,
      required: true,
    },
    userInfo: {
      type: Object as PropType<UserInfoInterface>,
      default: () => ({}),
      required: true,
    },
  },
  setup() {
    const authStore = useAuthStore()
    const { mutate } = useMutation(LogoutDocument)
    const me = useMe()
    const { canUseBilling } = usePublicationPermission()
    const showIndicator = computed<boolean>(() => {
      return me.value
        ? !(
            me.value.avatar &&
            new URL(me.value.avatar).host === 'assets.stori.press' &&
            me.value.first_name &&
            me.value.last_name &&
            me.value.location &&
            me.value.bio
          )
        : false
    })
    return {
      mergeTailwind,
      showIndicator,
      canUseBilling,
      logout() {
        mutate()
        authStore.$reset()
        window.location.href = '/auth/login'
      },
    }
  },
})
</script>

<template>
  <HMenu as="div" :class="mergeTailwind(['relative inline-flex', $attrs.class])">
    <HMenuButton class="relative inline-flex w-full justify-center" data-testid="navbar-user-trigger">
      <Avatar class="shadow-[1px_1px_5px_0_rgba(0,0,0,0.2)]" :src="userInfo.avatarSrc" />
      <span v-if="showIndicator" class="absolute -right-1 -top-1 flex size-4 items-center justify-center">
        <span class="absolute inline-flex size-3 animate-ping rounded-full bg-emerald-600 opacity-50"></span>
        <span class="relative inline-flex size-[0.625rem] rounded-full bg-emerald-600"></span>
      </span>
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
        class="layer-2 absolute right-[-0.5rem] z-[52s] mt-11 flex origin-right rounded-lg bg-stone-800 focus:outline-none"
      >
        <div v-if="showIndicator" class="w-[11.5rem] border-r border-white/[.15] px-6 pt-8">
          <h4 class="mb-3 text-[1.25rem] leading-[1.5rem] text-white">Finish setting up your Author Profile 👉</h4>
          <p class="text-body text-white">
            Details like your profile photo, name, and author byline are all used on your author page on a publication's
            website!
          </p>
        </div>
        <div class="w-52 divide-y divide-white/[.15]">
          <div class="px-5 py-3">
            <div class="text-sm font-thin leading-normal text-white">Signed in as</div>
            <div class="text-sm leading-normal text-white">
              {{ userInfo.name }}
            </div>
          </div>
          <div class="p-2">
            <NavbarMenuLinkItem
              icon-name="users"
              icon-class="text-white/50"
              text="My profile"
              text-container-class="flex-grow"
              :show-indicator="showIndicator"
              :to="`/${workspaceId}/account/profile`"
            />
            <NavbarMenuLinkItem
              v-if="canUseBilling"
              icon-name="billing"
              icon-class="text-white/50"
              text="Billing & earnings"
              text-container-class="flex-grow"
              :show-indicator="showIndicator"
              :to="`/${workspaceId}/account/billing`"
            />
            <NavbarMenuLinkItem
              icon-name="publication"
              icon-class="text-white/50"
              text="My publications"
              :to="`/${workspaceId}/account/publications`"
            />
            <NavbarMenuLinkItem icon-name="logout" icon-class="text-white/50" text="Log out" to="#" @click="logout" />
          </div>
          <div class="p-2">
            <NavbarMenuLinkItem
              text="Storipress Help Center"
              href="https://help.storipress.com"
              target="_blank"
              rel="noopener noreferrer"
            />
            <NavbarMenuLinkItem
              text="Hire a Storipress expert"
              href="mailto:hello@storipress.com?subject=Hire a Storipress expert
              &body=Need assistance implementing a custom theme, feature, or advertiser integration? Our team can help."
            />
          </div>
        </div>
      </HMenuItems>
    </transition>
  </HMenu>
</template>
