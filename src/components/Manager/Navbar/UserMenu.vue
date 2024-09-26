<script lang="ts">
import { Buttons, Textarea as CustomTextarea, mergeTailwind } from '@storipress/core-component'
import type { Ref } from 'vue'
import { defineComponent } from 'vue'
import { Menu as HMenu, MenuButton as HMenuButton, MenuItems as HMenuItems } from '@headlessui/vue'
import invariant from 'tiny-invariant'
import { match } from 'ts-pattern'
import NavbarMenuLinkItem from './NavbarMenuLinkItem.vue'
import type { TUserEmail, TUserMenu } from './setting'
import {
  canEmail,
  canPublish,
  isDraft,
  isPublished,
  menuText,
  redOrder,
  userMenuEnum,
  userMenuSetting,
  warningOrder,
  yellowOrder,
} from './setting'
import { useLinterStore } from '~/stores/linter'
import { useFeatureFlag } from '~/lib/feature-flag'
import { useIntegrationStore } from '~/stores/integration'
import type { ArticleInfo } from '~/composables'
import { ConnectedTarget, useNotification, useSiteURL } from '~/composables'
import { GetSiteDocument } from '~/graphql-operations'
import GreenCircle from '~/pages/[clientID]/articles/[id]/edit/components/green-circle.vue'
import { raf } from '~/utils'

interface TWarning {
  text: string
  color: string
}

export default defineComponent({
  name: 'UserMenu',
  components: {
    HMenu,
    HMenuButton,
    HMenuItems,
    NavbarMenuLinkItem,
    Buttons,
    CustomTextarea,
    GreenCircle,
  },
  props: {
    published: {
      type: Boolean,
      required: true,
    },
    draft: {
      type: Boolean,
      required: true,
    },
    liveUrl: {
      type: String,
      required: true,
    },
    articleInfo: {
      type: Object as PropType<ArticleInfo>,
      required: true,
    },
    slackText: {
      type: String,
      required: true,
    },
    canPublishedArticle: {
      type: Boolean,
      required: true,
    },
    newsletterAt: {
      type: String as () => string | null,
      required: true,
    },
    newsletter: {
      type: Boolean,
      required: true,
    },
    hasUpdated: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    'onUpdateArticle',
    'onUnpublishArticle',
    'onPublishArticle',
    'onChangeArticleStage',
    'modalOpen',
    'slackModalOpen',
    'autoPostingChange',
    'toggleEmail',
    'sendEmail',
  ],
  setup(props, { emit }) {
    const { result: siteResult } = useQuery(GetSiteDocument)
    const { socialData, socialActivateStatus } = useIntegrationStore()
    const { create: notifications } = useNotification()
    const computedSocialData = computed(() => socialData)
    const linterStore = useLinterStore()
    const warningArray: Ref<TWarning[]> = ref([])
    const enableSlack = useFeatureFlag('slack-integration')
    const slackConnectedData = computed(() => {
      if (Array.isArray(computedSocialData.value('slack'))) {
        return computedSocialData.value('slack').length
      } else {
        return computedSocialData.value('slack')
      }
    })
    const shopifyIntegration = computed(() => {
      const status = socialActivateStatus('shopify')
      const data = socialData('shopify')
      return {
        status,
        data: Array.isArray(data) ? data.length : data,
      }
    })
    const enableEmail = computed(() => {
      if (siteResult.value?.site) {
        const { subscription_setup, newsletter } = siteResult.value.site
        return subscription_setup === 'done' && newsletter
      }
      return false
    })

    const handleSlackChange = (e: Event) => {
      emit('autoPostingChange', (e.target as HTMLInputElement).value, 'slackText')
    }

    const { getArticleURL, connectedTarget } = useSiteURL()
    const goToText = computed(() => {
      return match(connectedTarget.value)
        .with(ConnectedTarget.Webflow, () => menuText.GoToWebflow)
        .with(ConnectedTarget.Shopify, () => menuText.GoToShopify)
        .with(ConnectedTarget.WordPress, () => menuText.GoToWordPress)
        .otherwise(() => menuText.GoToLiveArticle)
    })
    const liveUrl = getArticleURL(toRef(props, 'articleInfo'))

    const nowUserMenu = computed(() => {
      const { canPublishedArticle, published, draft, newsletterAt, newsletter } = props
      const allSetting = userMenuSetting(
        liveUrl.value,
        goToText.value,
        () => emit('onUpdateArticle'),
        () => emit('onUnpublishArticle'),
        () => emit('onPublishArticle'),
        async () => {
          await nextTick()
          await raf()
          emit('modalOpen')
        },
        (fromDefault: boolean) => emit('onChangeArticleStage', fromDefault),
        () => {
          emit('sendEmail')
          notifications({
            title: 'Email = blasted',
            type: 'primary',
            iconName: 'email',
            content: 'Article will be sent to all subscribers.',
          })
        },
        newsletter,
        newsletterAt,
      )

      const nowUserMenu: TUserMenu = `${canPublish(canPublishedArticle)}${isPublished(published)}${isDraft(
        canPublishedArticle,
        published,
        draft,
      )}`
      const nowEmail: TUserEmail = `${canEmail(enableEmail.value)}${enableEmail.value ? isPublished(published) : ''}`
      invariant(nowUserMenu === userMenuEnum[nowUserMenu as userMenuEnum])
      invariant(nowEmail === userMenuEnum[nowEmail as userMenuEnum])
      return [...allSetting[nowUserMenu], ...allSetting[nowEmail]]
    })

    watch(linterStore, (newStore) => {
      const redWarning = warningOrder
        .filter((key) => newStore.issues[key] && redOrder.has(newStore.issues[key]))
        .map((key) => ({ color: 'bg-red-700', text: newStore.issues[key] }))
      const yellowWarning = warningOrder
        .filter((key) => newStore.issues[key] && yellowOrder.has(newStore.issues[key]))
        .map((key) => ({ color: 'bg-yellow-500', text: newStore.issues[key] }))

      warningArray.value = redWarning.concat(yellowWarning)
    })

    return {
      slackConnectedData,
      shopifyIntegration,
      enableSlack,
      mergeTailwind,
      warningArray,
      handleSlackChange,
      enableEmail,
      nowUserMenu,
    }
  },
})
</script>

<template>
  <HMenu as="div" :class="mergeTailwind(['relative inline-flex', $attrs.class])">
    <HMenuButton data-testid="navbar-user-trigger">
      <Buttons type="main" color="primary" class="h-10 rounded-l-sm rounded-r-none font-normal" :is-shadow="true">
        <GreenCircle v-if="published && !hasUpdated" class="mr-[-0.25rem] mt-[-0.25rem]" />
        {{ published ? 'Update' : 'Publish' }}
      </Buttons>
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
        class="layer-2 absolute right-[0.25rem] z-20 mt-11 origin-right rounded-lg bg-stone-800 focus:outline-none"
      >
        <div class="flex flex-row divide-x divide-white/[.15]">
          <div v-if="enableSlack">
            <div
              v-if="slackConnectedData?.published?.length > 0 || slackConnectedData?.stage?.length > 0"
              class="flex h-full w-60 flex-col p-4 text-white"
            >
              <div class="mb-auto">
                <div class="text-subheading text-white">Leave an Editor Note:</div>
                <CustomTextarea
                  :model-value="slackText"
                  textarea-width="w-[13rem]"
                  textarea-height="h-[16rem]"
                  placeholder="Type something here ..."
                  class="mb-10"
                  @input="handleSlackChange"
                  @keydown.space.stop
                  @keydown.enter.stop
                />
              </div>
              <div>
                <div class="relative mb-6 flex items-center justify-center">
                  <img src="@assets/SPLogoRound.png" class="w-12" />
                  <div class="layer-2 absolute left-28 top-[-0.8rem] rounded-full bg-white p-1.5">
                    <img src="@assets/icons-slack.svg" class="w-[1.125rem]" />
                  </div>
                </div>
                <div class="text-caption italic text-white">
                  Feedback is shared with the author using Storipress’ Slack integration
                </div>
              </div>
            </div>
            <div v-else class="flex h-full w-60 flex-col p-4 text-white">
              <div class="mb-auto">
                <div class="mb-2 text-2xl leading-tight">Power users connect Storipress to Slack.</div>
                <div class="text-body text-white">
                  Leave feedback on finished articles and have it automatically forwarded to the author on Slack. Level
                  up your team with proactive coaching.
                </div>
              </div>
              <div>
                <div class="my-12 flex items-center justify-center">
                  <div class="layer-2 rounded-full bg-white p-4">
                    <img src="@assets/icons-slack.svg" class="text-9xl" />
                  </div>
                </div>
                <Buttons color="primary" class="w-full py-2.5" @click="$emit('slackModalOpen')">
                  {{ slackConnectedData ? 'Select a channel' : 'Connect to Slack' }}
                </Buttons>
              </div>
            </div>
          </div>
          <div class="w-80 divide-y divide-white/[.15]">
            <div class="py-4 text-white">
              <div class="mb-2 pl-10">
                <div class="text-subheading text-white">SEO Guidance</div>
              </div>
              <div class="space-y-4">
                <div v-for="{ text, color } in warningArray" :key="text" class="flex items-center pl-4 pr-2">
                  <div>
                    <div class="size-2.5 rounded-full" :class="color" />
                  </div>
                  <div class="text-caption ml-3.5 pr-4 text-white">
                    {{ text }}
                  </div>
                </div>
              </div>
            </div>
            <div class="p-2">
              <NavbarMenuLinkItem
                v-for="item in nowUserMenu"
                :key="item.name"
                :icon-name="item.name"
                :text="item.text"
                :href="item.href"
                :disabled="!!item.disabled"
                :switch-status="item.switchStatus"
                :has-switch="item.hasSwitch"
                @click="item.click"
                @toggle="$emit('toggleEmail')"
              />
            </div>
          </div>
        </div>
      </HMenuItems>
    </transition>
  </HMenu>
</template>
