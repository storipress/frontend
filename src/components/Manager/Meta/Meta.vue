<!-- eslint-disable tailwindcss/no-custom-classname -->
<script lang="ts" setup>
import { debounce } from 'lodash-es'
import type { z } from 'zod'
import { useForm } from 'vee-validate'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import {
  Inputs as CustomInput,
  Select as CustomSelect,
  SelectTypeahead as CustomSelectTypeHead,
  Textarea as CustomTextarea,
  Icon,
} from '@storipress/core-component'
import transliterate from '@sindresorhus/transliterate'
import * as Sentry from '@sentry/vue'
import Facebook from '@assets/ss-facebook.svg'
import Twitter from '@assets/ss-twitter.svg'
import LinkedIn from '@assets/ss-linkedin.svg'

import type * as Y from 'yjs'
import SearchPreview from '../SearchPreview/SearchPreview.vue'
import UploadImage from '../UploadImage/UploadImage.vue'
import { useSlugUnique } from './use-slug-unique'
import FBPreview from './components/FBPreview.vue'
import TWPreview from './components/TWPreview.vue'
import { AutoReplyButton, ConnectedCard, CustomField, NotConnectedCard } from './components'
import { featuredList, initialValues, validationSchema } from './setting'
import { SocialMedia, seoColumns, useAI, useConnectYdoc, useSocial } from './utils'
import type { GeneratingControllerKey, TGenerating } from './utils/store'
import { useMetaStore } from './utils/store'
import type { Author, FormModel, IgnoreFormModel, Tag } from '~/pages/[clientID]/articles/[id]/edit/types'
import { useMeMeta, useNotification, useSocialConnect } from '~/composables'
import { thirdPartyErrorMessage } from '~/composables/social-connect'
import { warning } from '~/lib/linter'
import { useLinterStore } from '~/stores/linter'
import { updateYDocText } from '~/pages/[clientID]/articles/[id]/edit/utils/utils'
import { maxEnterTimes } from '~/pages/[clientID]/articles/[id]/edit/setting'
import { OpenTransition } from '~/components/Transitions'
import { useIntegrationStore } from '~/stores/integration'
import type { ListSimpleUsersQuery } from '~/graphql-operations'
import {
  ActivateIntegrationDocument,
  CreateTagDocument,
  GetArticleMetafieldDocument,
  GetTagsDocument,
} from '~/graphql-operations'
import type { FieldValues } from '~/composables/custom-field-editor'
import GreenCircle from '~/pages/[clientID]/articles/[id]/edit/components/green-circle.vue'
import { useEditorStore } from '~/stores/editor'

import { filterHTMLTag, isFirefox } from '~/utils'
import { Flags } from '~/lib/feature-flag'
import { useGlobalIntegration } from '~/stores/global-integration'

// Define properties for the component
const props = withDefaults(
  defineProps<{
    id: string
    formModel: FormModel
    ignoreFormModel: IgnoreFormModel
    urlPrefix: string
    coverUrl: string
    socialImageUrl: string
    hasSlug: boolean
    userList: ListSimpleUsersQuery | undefined
    updateOgImage: (input: Event | undefined) => Promise<string>
    ydoc: Y.Doc
  }>(),
  {
    coverUrl: '',
    socialImageUrl: '',
    hasSlug: false,
    updateOgImage: async () => {
      return await ''
    },
  },
)

// Define emitted events for the component
const emit = defineEmits([
  'editing',
  'changeArticle',
  'updateSeo',
  'updateHasSlug',
  'updateAutoPosting',
  'updateArticleColumn',
])

// Define reactive variables
const selectedTab = ref(0)
const uploadingFile = ref(false)
const nowFeatured = ref('Unfeatured')
const tagRef = ref(null)
const authorRef = ref()

// Initialize notification and store hooks
const { create: notifications } = useNotification()
const linterStore = useLinterStore()
const metaStore = useMetaStore()
const globalIntegration = useGlobalIntegration()

// Define mutations for GraphQL operations
const { mutate: mutateCreateTag } = useMutation(CreateTagDocument)
const { mutate: mutateActivateIntegration } = useMutation(ActivateIntegrationDocument)

// Define queries for GraphQL operations
const { userMeta } = useMeMeta()
const { askAI } = useAI()
const { result: tagsResult, refetch: refetchTags } = useQuery(GetTagsDocument)
const integrationStore = useIntegrationStore()
const editorStore = useEditorStore()
integrationStore.fetchIntegrations()
const { result: articleMetafieldResult, refetch: refetchArticleMetafield } = useFeatureFlaggedQuery(
  Flags.CustomSite,
  GetArticleMetafieldDocument,
  {
    id: props.id,
  },
)
const integrations = computed(() => integrationStore?.integrations)

// Connect to Yjs document
const { ydocTags, ydocAuthors, ydocFeature, ydocEnable, ydocUser } = useConnectYdoc(
  props.id,
  props.ydoc,
  props.formModel,
  collaborationChangeArticle,
)

// Use social media integrations
const { twitterActivated, twitterList, facebookActivated, facebookList, linkedinActivated, linkedinList } = useSocial(
  integrations,
  props.formModel,
  ydocEnable,
  ydocUser,
  emit,
)

// Callback function for successful social media integration
function successCallback(key: 'twitter' | 'facebook' | 'linkedin') {
  mutateActivateIntegration({ key })
  sendTrackUnchecked('integration_enabled', { integration: key, source: 'editor' })
  integrationStore.fetchIntegrations()
}
function errorCallback(key: 'twitter' | 'facebook' | 'linkedin') {
  notifications?.(thirdPartyErrorMessage(key))
}

// Define social media connection functions
const { openNewWindow: openTwitter } = useSocialConnect(
  integrationStore.editorSocialConnect('twitter'),
  () => successCallback('twitter'),
  () => errorCallback('twitter'),
)
const { openNewWindow: openFacebook } = useSocialConnect(
  integrationStore.editorSocialConnect('facebook'),
  () => successCallback('facebook'),
  () => errorCallback('facebook'),
)

const { openNewWindow: openLinkedin } = useSocialConnect(
  integrationStore.editorSocialConnect('linkedin'),
  () => {
    successCallback('linkedin')
    globalIntegration.linkedInNotify = true
  },
  () => errorCallback('linkedin'),
)

// Define reactive variables for hiding elements
const isTabHide = ref(true)
const isPreviewHide = ref(true)
const isSocialHide = ref(true)
const isFBHide = ref(true)
const isTWHide = ref(true)
const isLNHide = ref(true)

// Computed property to show social indicator based on user's enter times and social media list lengths
const showSocialIndicator = computed(() => {
  return (
    userMeta.value?.enterTimes > maxEnterTimes &&
    (!facebookList.value || facebookList.value?.length === 0) &&
    (!twitterList.value || twitterList.value?.length === 0) &&
    (!linkedinList.value || linkedinList.value?.length === 0)
  )
})

// Initialize form with initial values and validation schema
const { errors, setFieldError } = useForm({
  initialValues,
  validationSchema: validationSchema(),
  validateOnMount: true,
})

// Computed property to get and set the link conversion
const convertLink = computed({
  get: () => (props.hasSlug ? metaStore.slug : ''),
  set: (value: string) => {
    metaStore.slug = value
  },
})

// Computed property to get the list of tags
const tagsList = computed(() => {
  return (
    tagsResult?.value?.tags?.map((item) => ({
      id: item.id,
      name: item.name,
    })) ?? []
  )
})

// Computed property to get the list of users
const usersList = computed(() => {
  return (
    props.userList?.users?.map((item) => ({
      ...item,
      id: item.id,
      name: item.full_name || item.email,
    })) ?? []
  )
})

// Computed property to get the preMetafields
const preMetafields = computed(() => {
  return articleMetafieldResult.value?.article?.metafields?.map(({ id, key, type, values, group }) => ({
    id,
    key,
    type,
    values,
    group,
  }))
})
// Define a reactive variable for metafields
const metafields: Ref<FieldValues | undefined> = ref(undefined)

// Watch for changes in preMetafields and update metafields accordingly
watchOnce(preMetafields, (preValues) => {
  metafields.value = preValues
})

// Computed property to get the groups
const groups = computed(() => {
  const result = new Map()
  if (metafields.value) {
    for (const { group } of metafields.value) {
      if (!group.key.startsWith('__')) {
        result.set(group.id, group)
      }
    }
  }
  return [...result.values()]
})

// Function to build notification
function buildNotification() {
  notifications({
    title: 'Integration activated',
    type: 'primary',
    content: 'Changes may take 3-5 minutes to go live.',
  })
}

// Function to add author
function addAuthor(e: Author) {
  ydocAuthors.mutateAdd(e)
}

// Async function to remove author
function removeAuthor(e: Author) {
  ydocAuthors.mutateRemove(e)
}

// Function to remove image
function removeImage() {
  props.updateOgImage(undefined)
}

// Function to upload image
function uploadImage(e: Event) {
  return props.updateOgImage(e)
}

// Function to add tag
function addTag(e: Tag) {
  ydocTags.mutateAdd(e)
}

async function createTag(tagName: string, retry = true): Promise<{ id: string; name: string } | null> {
  if (!tagName.trim()) {
    notifications({
      title: 'Error',
      type: 'warning',
      iconName: 'warning',
      content: 'Tag name cannot be empty.',
    })
    return null
  }

  // Check if tag already exists
  // If it does, add it to the article
  // If it doesn't, create it and then add it to the article
  const targetTag = tagsList.value.find((tag) => tag.name === tagName.trim())
  if (targetTag) {
    await addTag(targetTag)
    return {
      id: targetTag.id,
      name: targetTag.name,
    }
  } else {
    try {
      // If tag doesn't exist, create a new tag
      const result = await mutateCreateTag({
        name: tagName,
      })

      if (result?.data?.createTag) {
        // If tag creation is successful, add the new tag to the article
        await ydocTags.mutateAdd(result.data.createTag)
        return {
          id: result.data.createTag.id,
          name: result.data.createTag.name,
        }
      } else {
        // If tag creation is unsuccessful, refetch tags and retry if possible
        await refetchTags()
        if (retry) {
          return await createTag(tagName, false)
        } else {
          // If retry is not possible, log error and show notification
          Sentry.captureException(new Error('create tag return empty data'), (scope) => {
            scope.setTag('errorType', 'createTag')
            scope.setContext('createTag', {
              tagName,
              retry,
            })
            return scope
          })
          notifications({
            title: 'Error',
            type: 'warning',
            iconName: 'warning',
            content: 'An error occurred. Try again later.',
          })
          return null
        }
      }
    } catch (error) {
      // If an error occurs during tag creation, log error and show notification
      Sentry.captureException(error, (scope) => {
        scope.setTag('errorType', 'createTag')
        scope.setContext('createTag', {
          tagName,
          retry,
        })
        return scope
      })
      await refetchTags()
      if (retry) {
        return await createTag(tagName, false)
      } else {
        notifications({
          title: 'Error',
          type: 'warning',
          iconName: 'warning',
          content: 'An error occurred. Retry later.',
        })
      }
    }
    return null
  }
}

function removeTag(e: Tag) {
  // Get the ID of the tag to be removed
  const tagId = e.id ?? tagsList.value.find((item) => item.name === e?.name)?.id ?? ''
  // If the tag is not in the list, it means it's cannot be removed
  if (!tagId) return
  // Remove the tag from the article
  ydocTags.mutateRemove({ id: tagId, name: e.name })
}

const tagInputValue = ref('')
async function handleTagBlur() {
  // When the tag input field loses focus, create a new tag if the input value is not empty
  if (tagInputValue.value) {
    const tag = await createTag(tagInputValue.value)
    if (tag) {
      tagInputValue.value = ''
      const formModel = props.formModel
      if (!formModel.tags.find((item) => item.id === tag.id)) {
        formModel.tags.push(tag)
      }
    }
  }
}

function hideClick() {
  // Toggle the visibility of the tab
  isTabHide.value = !isTabHide.value
}

async function changeTab(index: number) {
  // Change the active tab
  // If a file is being uploaded, do not change the tab
  if (uploadingFile.value) return
  isTabHide.value = false
  selectedTab.value = index
  await refetchArticleMetafield()
  metafields.value = preMetafields.value
}

function handleFeatureChange() {
  // Handle changes to the feature status of the article
  ydocFeature.set(nowFeatured.value)
  emit('changeArticle', nowFeatured.value === 'Featured', 'featured')
  emit('updateArticleColumn', nowFeatured.value === 'Featured', 'featured')
}

// Function to handle SEO changes
function handleSeoChange(value: string, column: string) {
  emit('editing', column)
  emit('changeArticle', value, column)
  emit('updateSeo')
}

// Function to handle auto posting changes
function handleAutoPostingChange(value: string | boolean, column: string) {
  emit('editing', column)
  emit('changeArticle', value, column)
  emit('updateAutoPosting')
}

function collaborationChangeArticle<ItemType extends z.ZodTypeAny>(value: ItemType['_output'], column: string) {
  emit('changeArticle', value, column)
}

const checkSlugUnique = useSlugUnique(props.id, (msg) => {
  setFieldError('slug', msg)
})

// Function to canonicalize slug with debounce
const canonicalizeSlug = debounce(async () => {
  let value = metaStore.slug
  if (value) {
    value = transliterate(value, { customReplacements: [[' ', '-']] })
    value = encodeURIComponent(value)
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .toLowerCase()
    emit('changeArticle', value, 'slug')
    emit('changeArticle', true, 'hasSlug')
    const slugInput = props.ydoc.getText('slug')
    updateYDocText(props.ydoc, slugInput, value)
    metaStore.SET_SLUG(value)

    if (value?.length <= 255) {
      if (!(await checkSlugUnique(value))) {
        return
      }
      emit('updateHasSlug')
    }
  } else {
    emit('changeArticle', '', 'slug')
    emit('changeArticle', false, 'hasSlug')
    emit('updateHasSlug')
  }
}, 1000)

// Function to handle slug changes
function handleSlugChange() {
  emit('editing', 'slug')
  canonicalizeSlug()
}

// Function to activate Twitter
function activateTwitter() {
  successCallback('twitter')
  buildNotification()
}

// Function to activate Facebook
function activateFacebook() {
  successCallback('facebook')
  buildNotification()
}

// Function to activate LinkedIn
function activateLinkedin() {
  successCallback('linkedin')
  buildNotification()
}

// Function to focus on search
function focusSearch() {
  isPreviewHide.value = false
}

// Function to focus on social
function focusSocial() {
  isSocialHide.value = false
}

// Function to focus on Facebook
function focusFB() {
  isFBHide.value = false
}

// Function to focus on Twitter
function focusTW() {
  isTWHide.value = false
}

// Function to hide modal
function modalHide() {
  isPreviewHide.value = true
  isSocialHide.value = true
  isFBHide.value = true
  isTWHide.value = true
  isLNHide.value = true
}

async function generateAIResponse(promptType: GeneratingControllerKey | string, column: string) {
  metaStore.SET_GENERATING_AI(column as keyof TGenerating, true)
  const input = props.ydoc.getText(column)
  const response = ref('')
  const aborted = ref(false)
  watch(response, (val) => {
    updateYDocText(props.ydoc, input, val)
  })

  watch(
    () => metaStore.generatingController[promptType as GeneratingControllerKey],
    () => {
      aborted.value = true
    },
  )

  await askAI(promptType, response, editorStore.GET_CONTENT())
  metaStore.SET_GENERATING_AI(column as keyof TGenerating, false)

  if (aborted.value) {
    aborted.value = false
    return
  }

  emit('changeArticle', response.value, column)
  if (seoColumns.includes(column)) {
    emit('updateSeo')
  } else {
    emit('updateAutoPosting')
  }
}

// Watch for errors and update linter issues accordingly
watch(errors, (newErrors) => {
  Object.keys(initialValues).forEach((key: string) => {
    if (newErrors[key]) {
      linterStore.issues[key] = newErrors[key] || warning.none
    } else {
      linterStore.issues[key] = warning.none
    }
  })
})

watch(
  () => ydocFeature.showValue.value,
  (val) => {
    nowFeatured.value = val
  },
)

watch(
  () => ydocAuthors.showValue.value,
  (val) => {
    if (val.length === 0) {
      authorRef.value.selectedItems.clear()
    }
  },
)

// Handle click outside of tag input
onClickOutside(tagRef, () => {
  if (tagInputValue.value) {
    handleTagBlur()
  }
})
</script>

<template>
  <!-- Tab Group Component with selected index and change event -->
  <TabGroup :selected-index="selectedTab" @change="changeTab">
    <div class="mb-6 flex w-full flex-col space-y-2 rounded-lg border border-black/5 bg-stone-100/75 p-2 md:w-[45rem]">
      <!-- Tab List with flex styling -->
      <TabList class="flex items-center">
        <!-- Div for Tab spacing -->
        <div class="flex space-x-1.5">
          <Tab v-slot="{ selected }" as="template" @click="isTabHide = false">
            <button
              class="text-button cursor-pointer rounded p-2 font-medium outline-none transition-colors hover:bg-stone-200"
              :class="[selected ? 'text-stone-800 dark:text-stone-900' : 'text-stone-400 dark:text-stone-500']"
            >
              SEO
            </button>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <button
              class="text-button relative flex cursor-pointer rounded p-2 font-medium outline-none transition-colors hover:bg-stone-200"
              :class="[selected ? 'text-stone-800 dark:text-stone-900' : 'text-stone-400 dark:text-stone-500']"
            >
              <!-- Green Circle Indicator for Social Sharing Tab -->
              <GreenCircle v-if="showSocialIndicator" class="mr-[-0.25rem] mt-[0.125rem]" />
              <span> Share to Socials </span>
            </button>
          </Tab>
          <Tab v-for="group in groups" :key="group.key" v-slot="{ selected }" as="template">
            <button
              class="text-button relative flex cursor-pointer rounded p-2 font-medium outline-none transition-colors hover:bg-stone-200"
              :class="[selected ? 'text-stone-800 dark:text-stone-900' : 'text-stone-400 dark:text-stone-500']"
            >
              <span>{{ group.name }}</span>
            </button>
          </Tab>
        </div>
        <!-- Chevron open menu button -->
        <div
          class="ml-auto flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-stone-200"
          @click.prevent="hideClick"
        >
          <!-- Icon for Chevron -->
          <Icon class="text-xs text-stone-600" :icon-name="isTabHide ? 'chevron_down' : 'chevron_up'" />
        </div>
      </TabList>
      <!-- Open Menus -->
      <div :class="{ hidden: isTabHide }">
        <!-- Tab Panels -->
        <!-- Tab Panels Container -->
        <TabPanels>
          <!-- Divider Line -->
          <div class="mb-2 border-b-[1px] border-black/5" />
          <!-- First Tab Panel -->
          <TabPanel v-show="selectedTab === 0" :static="true">
            <!-- Container for Custom PlaceHolder -->
            <div class="custom-placeHolder space-y-2">
              <!-- Container for Custom Select and Custom Select Type Head Components -->
              <div class="flex w-full flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <!-- Custom Select for Feature Article -->
                <CustomSelect
                  v-model="nowFeatured"
                  label="Feature article?"
                  class="w-full md:w-36"
                  :items="featuredList"
                  @blur="handleFeatureChange"
                />
                <!-- Custom Select Type Head for Author Byline -->
                <span class="flex-1">
                  <CustomSelectTypeHead
                    ref="authorRef"
                    :default-value="ydocAuthors.showValue.value"
                    :model-value="ydocAuthors.showValue.value"
                    option-label-prop="name"
                    label="Author byline"
                    :items="usersList"
                    unique-key="id"
                    @add-tag="addAuthor"
                    @remove-tag="removeAuthor"
                  />
                </span>
                <!-- Custom Select Type Head for Tags -->
                <span class="flex-1">
                  <CustomSelectTypeHead
                    ref="tagRef"
                    :default-value="ydocTags.showValue.value"
                    :model-value="ydocTags.showValue.value"
                    option-label-prop="name"
                    label="Tags"
                    type="inputTag"
                    :items="tagsList"
                    @add-tag="addTag"
                    @create-tag="createTag"
                    @remove-tag="removeTag"
                  />
                </span>
              </div>
              <!-- Custom Input for Permalink -->
              <!-- use input for chrome, and update:model-value for firefox -->
              <CustomInput
                v-if="isFirefox"
                v-model="convertLink"
                input-id="slugId"
                class="pb-1.5"
                label="Permalink"
                html-type="text"
                html-name="slug"
                :show-error="!!errors.slug && warning.slug !== errors.slug"
                add-on
                :add-on-label="urlPrefix"
                placeholder="defaults-to-headline"
                @update:model-value="handleSlugChange()"
              />
              <!-- Custom Input for Permalink -->
              <CustomInput
                v-else
                v-model="convertLink"
                input-id="slugId"
                class="pb-1.5"
                label="Permalink"
                html-type="text"
                html-name="slug"
                :show-error="!!errors.slug && warning.slug !== errors.slug"
                add-on
                :add-on-label="urlPrefix"
                placeholder="defaults-to-headline"
                @input="handleSlugChange()"
              />
              <div class="relative flex w-full flex-col space-y-4">
                <CustomInput
                  input-id="searchTitleId"
                  :model-value="metaStore.searchTitle"
                  :show-error="false"
                  label="Search title"
                  placeholder="World News"
                  html-name="searchTitle"
                  html-type="text"
                  show-count
                  @input="handleSeoChange(($event.target as HTMLInputElement).value, 'searchTitle')"
                  @focus="focusSearch"
                  @blur="modalHide"
                />
                <!-- AI Button -->

                <AutoReplyButton
                  class="layer-2 absolute right-1.5 top-2.5 flex size-8 cursor-pointer items-center justify-center rounded-full bg-stone-50 transition-colors hover:bg-stone-100"
                  prompt-type="search-title"
                  col-name="searchTitle"
                  :generating="metaStore.generatingAI.searchTitle"
                  @generate-response="generateAIResponse"
                />
                <!-- Search Description -->
                <div class="relative w-full pb-4">
                  <CustomTextarea
                    textarea-id="searchDescriptionId"
                    class="custom-textarea-full-width"
                    :model-value="metaStore.searchDescription"
                    label="Search description"
                    textarea-name="searchDescription"
                    html-name="searchDescription"
                    placeholder="The description used in search results. If left empty, this defaults to your dek."
                    html-type="text"
                    resize="resize-y"
                    show-count
                    @input="handleSeoChange(($event.target as HTMLInputElement).value, 'searchDescription')"
                    @focus="focusSearch"
                    @blur="modalHide"
                  />
                  <!-- AI Button -->
                  <AutoReplyButton
                    class="layer-2 absolute bottom-6 right-1.5 flex size-8 cursor-pointer items-center justify-center rounded-full bg-stone-50 transition-colors hover:bg-stone-100"
                    prompt-type="search-description"
                    col-name="searchDescription"
                    :generating="metaStore.generatingAI.searchDescription"
                    @generate-response="generateAIResponse"
                  />
                </div>
              </div>
              <!-- Search Description Preview -->
              <div class="absolute">
                <OpenTransition>
                  <SearchPreview
                    v-if="!isPreviewHide"
                    :title="filterHTMLTag(metaStore.searchTitle || ignoreFormModel.title)"
                    :slug="`${urlPrefix}${metaStore.slug}`"
                    :description="filterHTMLTag(metaStore.searchDescription || ignoreFormModel.blurb)"
                  />
                </OpenTransition>
              </div>
            </div>
          </TabPanel>
          <!-- Second Tab Panel -->
          <TabPanel v-show="selectedTab === 1" :static="true" class="space-y-4">
            <!-- Container for Social Sharing Options -->
            <div class="flex flex-col space-y-4 md:flex-row md:space-y-0">
              <!-- Container for Facebook, Twitter and LinkedIn Cards -->
              <div class="flex flex-1 flex-col md:flex-row">
                <!-- Facebook card -->
                <!-- If Facebook is connected and activated, show the connected card, otherwise show the not connected card -->
                <div class="w-full">
                  <ConnectedCard
                    v-show="facebookList?.length > 0 && facebookActivated"
                    :id="formModel.FBPageId"
                    text-area-id="FBTextId"
                    :media-name="SocialMedia.facebook"
                    :list="facebookList"
                    :enable="ydocEnable.showValue.value.Facebook"
                    :user="ydocUser.showValue.value.Facebook"
                    :text="metaStore.FBText"
                    :ydoc="ydoc"
                    :ydoc-enable="ydocEnable"
                    :ydoc-user="ydocUser"
                    textarea-name="FBText"
                    @update:model-value="handleAutoPostingChange"
                    @generate-response="generateAIResponse"
                    @focus="focusFB"
                    @blur="modalHide"
                  />
                  <NotConnectedCard
                    v-show="facebookList?.length <= 0 || !facebookActivated"
                    :connected="facebookList?.length > 0"
                    :media-name="SocialMedia.facebook"
                    :icon-src="Facebook"
                    @connect="openFacebook"
                    @activate="activateFacebook"
                  />
                </div>
                <!-- Facebook preview -->
                <div class="flex-1">
                  <OpenTransition>
                    <FBPreview
                      v-if="!isFBHide"
                      :title="filterHTMLTag(metaStore.socialTitle || metaStore.searchTitle || ignoreFormModel.title)"
                      :slug="`${urlPrefix}${metaStore.slug}`"
                      :text="metaStore.FBText"
                      :description="
                        filterHTMLTag(
                          metaStore.socialDescription || metaStore.searchDescription || ignoreFormModel.blurb,
                        )
                      "
                      :img-url="socialImageUrl || coverUrl"
                      :user="ydocUser.showValue.value.Facebook"
                      :list="facebookList"
                    />
                  </OpenTransition>
                </div>
              </div>
              <div class="flex flex-1 flex-col md:flex-row">
                <!-- Twitter card -->
                <!-- If Twitter is connected and activated, show the connected card, otherwise show the not connected card -->
                <div class="w-full md:ml-4">
                  <ConnectedCard
                    v-show="twitterList?.length > 0 && twitterActivated"
                    :id="formModel.TWUserId"
                    text-area-id="TWTextId"
                    :media-name="SocialMedia.twitter"
                    :list="twitterList"
                    :form-model="formModel"
                    :enable="ydocEnable.showValue.value.Twitter"
                    :user="ydocUser.showValue.value.Twitter"
                    :text="metaStore.TWText"
                    :ydoc="ydoc"
                    :ydoc-enable="ydocEnable"
                    :ydoc-user="ydocUser"
                    textarea-name="TWText"
                    @update:model-value="handleAutoPostingChange"
                    @generate-response="generateAIResponse"
                    @focus="focusTW"
                    @blur="modalHide"
                  />
                  <NotConnectedCard
                    v-show="twitterList?.length <= 0 || !twitterActivated"
                    :connected="twitterList?.length > 0"
                    :media-name="SocialMedia.twitter"
                    :icon-src="Twitter"
                    @connect="openTwitter"
                    @activate="activateTwitter"
                  />
                </div>
                <!-- Twitter preview -->
                <div class="flex-1">
                  <OpenTransition>
                    <TWPreview
                      v-if="!isTWHide"
                      :title="filterHTMLTag(metaStore.socialTitle || metaStore.searchTitle || ignoreFormModel.title)"
                      :slug="`${urlPrefix}${metaStore.slug}`"
                      :img-url="socialImageUrl || coverUrl"
                      :text="metaStore.TWText"
                      :user="ydocUser.showValue.value.Twitter"
                      :list="twitterList"
                    />
                  </OpenTransition>
                </div>
              </div>
            </div>
            <div class="flex flex-col space-y-4 md:flex-row md:space-y-0">
              <!-- LinkedIn card -->
              <!-- If LinkedIn is connected and activated, show the connected card, otherwise show the not connected card -->
              <div class="flex flex-1 flex-col md:flex-row">
                <div class="w-full">
                  <ConnectedCard
                    v-show="linkedinList?.length > 0 && linkedinActivated"
                    :id="formModel.LNAuthorId"
                    text-area-id="LNTextId"
                    :media-name="SocialMedia.linkedin"
                    :list="linkedinList"
                    :enable="ydocEnable.showValue.value.LinkedIn"
                    :user="ydocUser.showValue.value.LinkedIn"
                    :text="metaStore.LNText"
                    :ydoc="ydoc"
                    :ydoc-enable="ydocEnable"
                    :ydoc-user="ydocUser"
                    textarea-name="LNText"
                    @update:model-value="handleAutoPostingChange"
                    @generate-response="generateAIResponse"
                    @focus="isLNHide = false"
                    @blur="modalHide"
                  />
                  <NotConnectedCard
                    v-show="linkedinList?.length <= 0 || !linkedinActivated"
                    :connected="linkedinList?.length > 0"
                    :media-name="SocialMedia.linkedin"
                    :icon-src="LinkedIn"
                    @connect="openLinkedin"
                    @activate="activateLinkedin"
                  />
                </div>
                <!-- LinkedIn preview -->
                <div class="flex-1">
                  <OpenTransition>
                    <!-- Show LinkedIn preview if it's not hidden -->
                    <FBPreview
                      v-if="!isLNHide"
                      :title="filterHTMLTag(metaStore.socialTitle || metaStore.searchTitle || ignoreFormModel.title)"
                      :slug="`${urlPrefix}${metaStore.slug}`"
                      :text="metaStore.LNText"
                      :description="
                        filterHTMLTag(
                          metaStore.socialDescription || metaStore.searchDescription || ignoreFormModel.blurb,
                        )
                      "
                      :img-url="socialImageUrl || coverUrl"
                      :user="ydocUser.showValue.value.LinkedIn"
                      :list="linkedinList"
                    />
                  </OpenTransition>
                </div>
              </div>
              <!-- Social title and description input fields -->
              <div class="flex flex-1 flex-col md:flex-row">
                <div class="w-full space-y-4 md:ml-4">
                  <!-- Social title input field -->
                  <CustomInput
                    input-id="socialTitleId"
                    :model-value="metaStore.socialTitle"
                    :show-error="false"
                    label="Social title"
                    placeholder="If left empty defaults to the search title"
                    html-name="socialTitle"
                    html-type="text"
                    @input="handleSeoChange(($event.target as HTMLInputElement).value, 'socialTitle')"
                    @focus="focusSocial"
                    @blur="modalHide"
                  />
                  <!-- Social description input field -->
                  <CustomTextarea
                    textarea-id="socialDescriptionId"
                    :model-value="metaStore.socialDescription"
                    label="Social description"
                    class="custom-textarea-full-width-height"
                    textarea-name="socialDescription"
                    placeholder="If left empty, defaults to search description"
                    html-type="text"
                    resize="resize-y"
                    @input="handleSeoChange(($event.target as HTMLInputElement).value, 'socialDescription')"
                    @focus="focusSocial"
                    @blur="modalHide"
                  />
                </div>
                <!-- Social preview -->
                <div class="flex-1">
                  <OpenTransition>
                    <!-- Show social preview if it's not hidden -->
                    <FBPreview
                      v-if="!isSocialHide"
                      :text="metaStore.FBText"
                      :title="filterHTMLTag(metaStore.socialTitle || metaStore.searchTitle || ignoreFormModel.title)"
                      :slug="`${urlPrefix}${metaStore.slug}`"
                      :img-url="socialImageUrl || coverUrl"
                      :description="
                        filterHTMLTag(
                          metaStore.socialDescription || metaStore.searchDescription || ignoreFormModel.blurb,
                        )
                      "
                      :user="ydocUser.showValue.value.Facebook"
                      :list="facebookList"
                    />
                  </OpenTransition>
                </div>
              </div>
            </div>
            <!-- Social image upload section -->
            <div class="flex flex-col space-y-4 md:flex-row md:space-y-0">
              <div class="flex size-full flex-col">
                <!-- Label for social image -->
                <div class="text-body mb-1">Social image</div>
                <!-- Social image upload component -->
                <div class="layer-0 flex h-80 w-full items-center justify-center overflow-hidden rounded-lg bg-white">
                  <UploadImage :image-url="socialImageUrl" :upload-image="uploadImage" :remove-image="removeImage" />
                </div>
              </div>
            </div>
          </TabPanel>
          <!-- Custom fields tab panel -->
          <TabPanel v-for="group in groups" :key="group.key">
            <div class="custom-placeHolder space-y-4">
              <CustomField
                :fields="group.fields"
                :field-values="metafields"
                :target-id="id"
                :refetch="refetchArticleMetafield"
                @loading="(val) => (uploadingFile = val)"
              />
            </div>
          </TabPanel>
        </TabPanels>
      </div>
    </div>
  </TabGroup>
</template>

<style lang="scss" scoped>
// Style for full width custom textarea
:deep .custom-textarea-full-width {
  width: 100%;

  div textarea {
    width: 100%;
  }
}

// Style for full width and height custom textarea
:deep .custom-textarea-full-width-height {
  width: 100%;

  div textarea {
    width: 100%;
    height: 119px;
  }
}

:deep .custom-placeHolder input {
  &::placeholder {
    @apply text-stone-800/25;
  }
}

:deep .custom-placeHolder textarea {
  &::placeholder {
    @apply text-stone-800/25;
  }
}

:deep.typeahead {
  & > .typeahead-wrap {
    @apply w-full;
  }

  & .simple-typeahead-list {
    @apply z-10;
  }
}
</style>
