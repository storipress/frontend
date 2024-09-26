<script lang="ts" setup>
import * as Sentry from '@sentry/vue'
import { Icon, NOTIFICATION_KEY } from '@storipress/core-component'
import { onBeforeRouteLeave } from 'vue-router'
import OnboardingCard from './components/OnboardingCard.vue'
import { useCreateArticle } from '~/components/NewArticle/helper'
import { useMeStore } from '~/stores/me'
import { UsedFeature, useMeTenantScopedMeta, useNoPermissionRedirect, useSiteURL, useUsedFeature } from '~/composables'

const props = defineProps<{ clientID: string }>()

const route = useRoute()
const router = useRouter()

useNoPermissionRedirect('canAccessOnboarding', () => `/${route.params.clientID}/articles/desks/all`)

const { mutate } = useCreateArticle()
const meStore = useMeStore()
const userId = computed(() => meStore.userIdentification?.id ?? '')

let userFirstFeature: string | undefined

onBeforeRouteLeave(() => {
  sendTrackUnchecked('onboarding_step_completed', {
    step: 5,
    stepName: 'first_feature',
    first_feature: userFirstFeature,
  })
})

const featureList = [
  {
    key: 'goManager',
    icon: 'desk',
    title: 'Explore our workflow tools',
    info: 'See how Storipress can align your team with your content strategy.',
    handler: () => {
      router.push(`/${props.clientID}/articles/desks/all`)
    },
  },
  {
    key: 'goEditor',
    icon: 'draft',
    title: 'Write your first post',
    info: 'Test out the editor and get a feel for creating content in Storipress.',
    handler: async () => {
      const input = {
        desk_id: '1',
        author_ids: [userId.value],
      }
      const res = await mutate({ input })

      const id = res?.data?.createArticle.id
      if (!id) return

      router.push({
        name: 'clientID-articles-id-edit',
        params: {
          clientID: props.clientID,
          id,
        },
      })
    },
  },
  // Comment out newsletter and builder steps
  // {
  //    key: 'goMember',
  //    icon: 'billing',
  //    title: 'Setup newsletters & monetize content',
  //    info: 'Import your subscribers and setup email newsletters and paywalls and memberships.',
  //    handler: () => {
  //      router.push(`/${props.clientID}/members/setup`)
  //    },
  //  },
  //  {
  //    key: 'goBuilder',
  //    icon: 'theme',
  //    title: 'Customize your site',
  //    info: 'If you’re starting from scratch, go to our site builder and tweak your design.',
  //    handler: () => {
  //      location.href = `/builder/${props.clientID}/front-page`
  //    },
  //  },
]

const { isSetShopify, isSetWebflow } = useSiteURL()
const disabledShowFeature = computed<Record<string, boolean>>(() => ({
  goBuilder: Boolean(isSetShopify.value || isSetWebflow.value),
}))

const notifications = inject(NOTIFICATION_KEY)
const [isFirstFeatureUsed, setFirstFeatureUsed] = useUsedFeature(UsedFeature.FirstFeature)
const { setScopedMeta } = useMeTenantScopedMeta()
const { isLoading, execute } = useAsyncState(checkUserId, null)

async function onClickFeatureCard(key: string, handle: () => void) {
  const userIdIsDefined = await execute()
  if (!userIdIsDefined) {
    Sentry.captureException(new Error('user id is undefined in first feature page'))

    notifications?.({
      title: 'Something went wrong. Please reload the page to try again.',
      type: 'warning',
      iconName: 'warning',
    })

    return
  }

  userFirstFeature = key
  setScopedMeta({ first_feature: key })
  if (!isFirstFeatureUsed.value) {
    sendIdentify(userId.value, { first_feature: key })
    setFirstFeatureUsed()
  }
  handle()
}

async function checkUserId() {
  try {
    if (!userId.value) {
      meStore.fetchMeEmail()
    }
    await until(userId).toBeTruthy({ timeout: 1000, throwOnTimeout: true })

    return true
  } catch (e) {
    return false
  }
}
</script>

<template>
  <div class="flex h-screen bg-stone-50">
    <div class="min-w-full overflow-y-scroll py-12 md:min-w-fit md:basis-[39%] md:px-14 md:py-[5.5rem]">
      <main class="mx-auto w-auto md:w-[28.5rem]">
        <div class="px-4 md:w-[26rem]">
          <div class="mb-16">
            <h1 class="text-display-large mb-4 text-stone-800">Your publication is ready!</h1>
            <h2 class="text-body text-stone-500">You’re ready to start using Storipress</h2>
          </div>

          <h3 class="text-body mb-4 font-bold text-neutral-800">What do you want to do first?</h3>
          <div class="flex flex-col gap-y-3">
            <template v-for="item in featureList" :key="item.key">
              <OnboardingCard
                v-if="typeof disabledShowFeature[item.key] !== 'undefined' ? !disabledShowFeature[item.key] : true"
                :title="item.title"
                :info="item.info"
                :disabled="isLoading"
                @on-click="onClickFeatureCard(item.key, item.handler)"
              >
                <template #icon>
                  <Icon
                    :icon-name="item.icon"
                    class="mr-4 flex min-h-[2.5rem] min-w-[2.5rem] items-center justify-center rounded-full bg-white text-[1.25rem] text-gray-600"
                  />
                </template>
              </OnboardingCard>
            </template>
          </div>
        </div>
      </main>
    </div>

    <div
      class="layer-2 mt-9 hidden w-full basis-[58%] items-center justify-center overflow-hidden rounded-t-xl border border-gray-100 bg-stone-50 bg-[url('@assets/preview.png')] bg-contain bg-top bg-no-repeat shadow-[5px_10px_30px_0_rgba(0,0,0,0.15)] md:flex"
    />
  </div>
</template>
