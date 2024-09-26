<script lang="ts" setup>
import type { PropType } from 'vue'
import { MenuButton } from '@headlessui/vue'
import * as Y from 'yjs'
import { captureException } from '@sentry/vue'
import { Dropdowns as Dropdown, HoverHint, Icon, MenuItem } from '@storipress/core-component'
import InviteButton from './InviteButton.vue'
import InviteModal from './InviteModal.vue'
import ScheduleModal from './ScheduleModal.vue'
import UserMenu from './UserMenu.vue'
import { planMapping } from './setting'
import PreviewButton from './PreviewButton.vue'
import { useFeatureFlag } from '~/lib/feature-flag'
import type { ListSimpleUsersQuery } from '~/graphql-operations'
import { ChangeArticleStageDocument, GetStagesDocument } from '~/graphql-operations'
import { filterHTMLTag } from '~/utils'
import { sendLog } from '~/utils/axiom-log'
import { useSiteStore } from '~/stores/site'
import { useMeStore } from '~/stores/me'
import { usePublicationPermission } from '~/composables/permission/publication'
import type { Article } from '~/components/Scheduler/definitions'
import SlackModal from '~/components/SlackModal/SlackModal.vue'
import type { FormModel } from '~/pages/[clientID]/articles/[id]/edit/types'
import { useNotification } from '~/composables'

// Define Avatar interface
interface Avatar {
  name: string
  src: string
  color: string
}

// Define stageType interface
interface stageType {
  id: string
  name: string
  order: number
}

// Define component props
const props = defineProps({
  id: { type: String, required: true },
  avatars: {
    type: Array as PropType<Avatar[]>,
  },
  formModel: {
    type: Object as () => FormModel,
    required: true,
  },
  isPreview: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  userDevice: {
    type: String,
    required: true,
  },
  hasUpdated: {
    type: Boolean,
    required: true,
  },
  articleModel: {
    type: Object as () => Article,
    required: true,
  },
  userList: {
    type: Object as () => ListSimpleUsersQuery | undefined,
    required: true,
  },
  ydoc: {
    type: Y.Doc,
    required: true,
  },
})
// Define component emits
const emit = defineEmits([
  'changeArticle',
  'updateArticle',
  'publishArticle',
  'unpublishArticle',
  'buildArticle',
  'updateAutoPosting',
  'previewChange',
  'changeDevice',
  'sendEmail',
])

const slackModalVisible = ref(false)
const inviteModalOpen = ref(false)
const enableMembers = useFeatureFlag('members')
const siteStore = useSiteStore()
const meStore = useMeStore()
const setupDone = computed(() => siteStore?.subscriptionSetup === 'done')
const subscription = computed(() => siteStore?.subscription)
const { canPublishedArticle } = usePublicationPermission()
const { mutate: mutateChangeArticleStage } = useMutation(ChangeArticleStageDocument)
const { result: stagesResult } = useQuery(GetStagesDocument)
const { create: notifications } = useNotification()
const modalVisible = ref(false)
const route = useRoute()
const router = useRouter()
// Filter HTML tags from title
const titleFilter = computed(() => {
  return filterHTMLTag(props.title)
})
// Compute stages
const stages = computed(() => {
  return (
    stagesResult?.value?.stages?.map((item) => ({
      id: item.id,
      order: item.order,
      default: item.default,
    })) ?? []
  )
})

// Compute default stage
const defaultStage = computed(() => {
  return (stagesResult?.value?.stages?.find((item) => item.default) || {}) as stageType
})

// Function to change article stage
function changeArticleStage(fromDefault: boolean) {
  const stagesSort = stages.value.sort((a, b) => a.order - b.order)
  emit('changeArticle', !fromDefault, 'draft')
  mutateChangeArticleStage({
    input: {
      id: props.id,
      stage_id: fromDefault
        ? stagesSort.find((item) => item.order > defaultStage.value?.order)?.id ?? ''
        : defaultStage.value?.id,
    },
  })

  if (fromDefault) {
    notifications({
      title: 'Article submitted for approval',
      type: 'info',
      iconName: 'for_review',
      iconClass: 'text-sky-700',
      content: 'Article moved to for review column.',
    })
  }
}

// Function to handle auto posting change
function handleAutoPostingChange(value: string, column: string) {
  emit('changeArticle', value, column)
  emit('updateAutoPosting')
}

// Function to toggle email
function toggleEmail() {
  emit('changeArticle', !props.formModel.newsletter, 'newsletter')
  emit('updateArticle')
}

// Function to change device
function changeDevice(device: string) {
  emit('changeDevice', device)
}

// Function to change plan
function changePlan(plan: 'free' | 'member' | 'subscriber') {
  emit('changeArticle', plan, 'plan')
  emit('updateArticle')
  const planVisibilityMap = {
    free: 'free',
    member: 'need_login',
    subscriber: 'paid',
  }
  const visibility = planVisibilityMap[plan]
  sendTrackUnchecked('article_visibility_changed', { visibility, article_id: props.id })
}

// Function to change preview
function previewChange() {
  emit('previewChange')
}

// Function to publish article
function publishArticle() {
  emit('publishArticle')
}
// Function to unpublish article
function unpublishArticle() {
  emit('unpublishArticle')
}
// Function to build article
function buildArticle() {
  emit('buildArticle')
}

// Function to send email
function sendEmail() {
  emit('sendEmail')
}

// Function to close modal
function modalClose() {
  modalVisible.value = false
}

// Function to open modal
function modalOpen() {
  modalVisible.value = true
}

// Function to open slack modal
function slackModalOpen() {
  slackModalVisible.value = true
}

//  Function to handle back navigation, it is hacky method, ref:https://stackoverflow.com/a/70965943
const isBacking = ref(false)
async function handleBack() {
  if (isBacking.value) return null
  isBacking.value = true

  const lastPath = router?.options?.history?.state?.back

  try {
    if (!route.params.clientID) {
      sendLog({
        message: `Client ID cannot be found within the route params of this URL: ${location.href}`,
        user_id: meStore.me?.id,
        client_id: route.params.clientID,
      })
      await nextTick()
    }

    const clientID = route.params.clientID ?? location.pathname.split('/')[1]

    return lastPath && !(lastPath as string).includes('/onboarding')
      ? router.back()
      : router.push(`/${clientID}/articles/desks/all`)
  } catch (error) {
    isBacking.value = false
    captureException(error)
    return null
  }
}

const articleInfo = computed(() => {
  return {
    id: props.id,
    slug: props.formModel.slug,
    url: props.formModel.url,
  }
})
</script>

<template>
  <div class="fixed left-0 top-0 z-[52] flex w-full bg-stone-50/80 backdrop-blur-lg dark:bg-stone-900/80">
    <div class="w-1 rounded-br" :style="{ 'background-color': formModel.navColor }" />
    <div class="flex w-full items-center">
      <!-- Members button -->
      <div class="absolute left-[50%] flex -translate-x-1/2 items-center">
        <span
          v-if="enableMembers"
          class="flex h-7 items-center rounded-full bg-stone-100 text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
        >
          <HoverHint :disabled="setupDone">
            <!-- Members dropdown -->
            <Dropdown :hidden="!setupDone" :model-value="formModel.plan" class="z-10">
              <template #button>
                <MenuButton class="flex">
                  <div class="flex items-center space-x-2 px-3 pb-1.5" :class="{ 'opacity-50': !setupDone }">
                    <!-- Plan name -->
                    <span class="text-caption whitespace-nowrap break-normal text-stone-500 dark:text-stone-400">
                      {{ planMapping[formModel.plan] }}
                    </span>
                    <!-- Dropdown icon -->
                    <Icon class="text-[.625rem] text-stone-500 dark:text-stone-400" icon-name="chevron_down" />
                  </div>
                </MenuButton>
              </template>
              <!-- Dropdown items -->
              <template #default>
                <MenuItem @click.prevent="changePlan('free')">Free access</MenuItem>
                <MenuItem @click.prevent="changePlan('member')">Subscribers only</MenuItem>
                <MenuItem v-if="subscription" @click.prevent="changePlan('subscriber')">Paid subscribers only</MenuItem>
              </template>
            </Dropdown>
            <!-- Members activation hint -->
            <template #content>
              <span class="text-body text-white">Activate Members to send this article to subscribers</span>
            </template>
          </HoverHint>
        </span>
      </div>
      <!-- Back to manager button -->
      <div class="flex items-center">
        <button class="flex items-center" @click="handleBack">
          <Icon class="mx-2 text-[1rem] text-stone-600 dark:text-stone-100" icon-name="arrow_left" />
        </button>
        <!-- Article title -->
        <div class="mr-4 hidden w-full max-w-[10rem] md:flex">
          <div class="text-body line-clamp-1 w-full break-all text-stone-600 dark:text-stone-100">
            {{ titleFilter || 'New Story' }}
          </div>
        </div>
        <!-- Avatars container -->
        <div class="relative ml-1 -space-x-2 md:flex">
          <!-- Loop through avatars -->
          <img
            v-for="(avatar, index) in avatars"
            :key="avatar.name"
            :src="avatar.src"
            class="relative size-6 min-h-[1.5rem] min-w-[1.5rem] rounded-full ring-2"
            :style="{ 'z-index': 3 - index, '--tw-ring-color': avatar.color, '--tw-ring-opacity': 1 }"
          />
        </div>
        <InviteButton @click="inviteModalOpen = true" />
      </div>
      <!-- Right side of the navigation bar -->
      <div class="ml-auto mr-0 flex items-center pl-2">
        <!-- Preview mode viewport selection buttons -->
        <div v-if="isPreview" class="ml-4 mr-3 flex space-x-6">
          <!-- Desktop preview button -->
          <button aria-label="desktop" class="flex items-center" @click="changeDevice('desktop')">
            <Icon
              class="text-[1.5rem] hover:opacity-75 hover:duration-75"
              icon-name="desktop"
              :class="userDevice === 'desktop' ? 'text-[#047857]' : 'text-stone-600 dark:text-stone-100'"
            />
          </button>
          <!-- Tablet preview button -->
          <button
            aria-label="tablet"
            class="flex items-center hover:opacity-75 hover:duration-75"
            @click="changeDevice('tablet')"
          >
            <Icon
              class="text-[1.5rem]"
              icon-name="tablet"
              :class="userDevice === 'tablet' ? 'text-[#047857]' : 'text-stone-600 dark:text-stone-100'"
            />
          </button>
          <!-- Mobile preview button -->
          <button
            aria-label="mobile"
            class="flex items-center hover:opacity-75 hover:duration-75"
            @click="changeDevice('mobile')"
          >
            <Icon
              class="text-[1.5rem]"
              icon-name="mobile"
              :class="userDevice === 'mobile' ? 'text-[#047857]' : 'text-stone-600 dark:text-stone-100'"
            />
          </button>
        </div>
        <div class="flex items-center">
          <!-- Preview button -->
          <PreviewButton
            class="hidden h-full items-center px-3 py-1 transition-colors hover:bg-gray-50 dark:hover:bg-stone-700 md:flex"
            :model-value="isPreview"
            @update:model-value="previewChange"
          />
          <!-- Publish menu -->
          <UserMenu
            class="rounded-none"
            :live-url="`https://${slug}`"
            :published="formModel.published"
            :draft="formModel.draft"
            :article-model="articleModel"
            :article-info="articleInfo"
            :can-published-article="canPublishedArticle"
            :slack-text="formModel.slackText"
            :newsletter-at="formModel?.newsletterAt"
            :newsletter="formModel?.newsletter"
            :has-updated="hasUpdated"
            @on-unpublish-article="unpublishArticle"
            @on-publish-article="publishArticle"
            @on-change-article-stage="changeArticleStage"
            @on-update-article="buildArticle"
            @auto-posting-change="handleAutoPostingChange"
            @modal-open="modalOpen"
            @slack-modal-open="slackModalOpen"
            @toggle-email="toggleEmail"
            @send-email="sendEmail"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- Slack modal -->
  <SlackModal v-model="slackModalVisible" source="editor" />
  <!-- Schedule modal -->
  <ScheduleModal
    :new-article="articleModel"
    class="z-[53]"
    :visible="modalVisible"
    @change-published-article="$emit('changeArticle', $event, 'published')"
    @modal-close="modalClose"
  />
  <InviteModal
    :id="id"
    :ydoc="ydoc"
    :open="inviteModalOpen"
    :user-list="userList"
    @modal-close="inviteModalOpen = false"
  />
</template>
