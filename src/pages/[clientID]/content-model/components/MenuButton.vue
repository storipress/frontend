<script lang="ts" setup>
import { Menu as HMenu, MenuButton as HMenuButton, MenuItems as HMenuItems } from '@headlessui/vue'
import { Icon, Buttons as SpButton } from '@storipress/core-component'
import { contentTypeParamsMap } from './AddContentTypeSlideOver/definition'
import { CustomFieldGroupType } from '~/graphql-operations'

const route = useRoute()
const hover = ref<CustomFieldGroupType>(CustomFieldGroupType.ArticleContentBlock)
const description = computed(() => {
  switch (hover.value) {
    case CustomFieldGroupType.ArticleContentBlock:
      return {
        icon: 'lego',
        content: 'Add info <span class="font-bold">inside article body</span>.',
      }
    case CustomFieldGroupType.ArticleMetafield:
      return {
        icon: 'swap-replace',
        content: 'Add info <span class="font-bold">outside article body</span>',
      }
    case CustomFieldGroupType.TagMetafield:
      return {
        icon: 'tag',
        content: 'Add metadata to <span class="font-bold">article categories</span>.',
      }

    default:
      return {
        icon: 'lego',
        content: 'Add info <span class="font-bold">inside the article body</span>.',
      }
  }
})
</script>

<template>
  <HMenu v-slot="{ close }" as="div" class="relative mx-8">
    <HMenuButton class="inline-flex w-full justify-center">
      <SpButton
        is-shadow
        class="text-button whitespace-nowrap text-white"
        type="main"
        color="primary"
        data-testid="navbar-workspace-trigger"
      >
        Add content type
      </SpButton>
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
        class="layer-2 absolute right-0 z-[52] mt-1 flex origin-right divide-x divide-white/[.15] rounded-lg bg-stone-800 focus:outline-none"
        @click="close"
      >
        <div class="w-48 pb-6">
          <nav class="border-b border-white/[0.15] p-2">
            <router-link
              class="link"
              :to="{
                name: 'content-model-add',
                params: {
                  clientID: route.params.clientID,
                  customFieldGroupType: contentTypeParamsMap[CustomFieldGroupType.ArticleMetafield],
                },
              }"
              @mouseover="hover = CustomFieldGroupType.ArticleMetafield"
            >
              <Icon class="link-icon" icon-name="swap-replace" />
              Article Metafield
            </router-link>
            <router-link
              class="link"
              :to="{
                name: 'content-model-add',
                params: {
                  clientID: route.params.clientID,
                  customFieldGroupType: contentTypeParamsMap[CustomFieldGroupType.ArticleContentBlock],
                },
              }"
              @mouseover="hover = CustomFieldGroupType.ArticleContentBlock"
            >
              <Icon class="link-icon" icon-name="lego" />
              Article Block
            </router-link>
            <router-link
              class="link"
              :to="{
                name: 'content-model-add',
                params: {
                  clientID: route.params.clientID,
                  customFieldGroupType: contentTypeParamsMap[CustomFieldGroupType.TagMetafield],
                },
              }"
              @mouseover="hover = CustomFieldGroupType.TagMetafield"
            >
              <Icon class="link-icon" icon-name="tag" />
              Tag Group
            </router-link>
          </nav>
          <div class="flex flex-col items-center text-gray-200">
            <Icon class="my-6 block text-[4rem] text-stone-200/80" :icon-name="description.icon" />
            <p class="text-caption mx-4 text-gray-200" v-html="description.content" />
          </div>
        </div>
      </HMenuItems>
    </transition>
  </HMenu>
</template>

<style lang="postcss" scoped>
.link {
  @apply text-body text-white/80;
  @apply flex h-10 items-center rounded px-2 opacity-80;
  @apply transition-colors duration-100 hover:bg-white/20;
}
.link-icon {
  @apply mr-4 w-4;
}
</style>
