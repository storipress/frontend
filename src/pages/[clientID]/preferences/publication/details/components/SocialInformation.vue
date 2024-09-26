<script setup lang="ts">
import { Icon, Inputs, Select } from '@storipress/core-component'
import type { NewSocialInfo, PublicationInfo, SocialLink } from './definitions'
import { SocialNetworkList } from './definitions'
import { usePublicationPermission } from '~/composables/permission/publication'
import { watchToDisabledAllContainedInputs } from '~/composables/permission/watch-permission'

const props = defineProps<{
  publicationInfo: PublicationInfo
  newSocialList: NewSocialInfo[]
  errors: Record<string, string | undefined>
}>()

const { canUpdateSettingContactAndSocialInfo } = usePublicationPermission()
const contactAndSocialInfoDivRef = watchToDisabledAllContainedInputs(canUpdateSettingContactAndSocialInfo)

const { email, socials } = toRefs(props.publicationInfo)
const { newSocialList } = toRefs(props)
const socialNetworkList = Object.values(SocialNetworkList)

const selectedSocialType = ref(new Set<SocialNetworkList>())

const availableSocialNetworkList = computed(() => {
  return socialNetworkList.filter((item) => !selectedSocialType.value.has(item) && item !== SocialNetworkList.Homepage)
})

function onAddSocialLink() {
  newSocialList.value.push({ type: undefined, url: '' })
}

function onDeleteSocialLink({ type, index }: SocialLink) {
  if (type === 'currentSocial') {
    socials.value.splice(index, 1)
  } else {
    newSocialList.value.splice(index, 1)
  }
}

watch(
  [() => socials, newSocialList],
  ([socials, newSocialInfo]) => {
    selectedSocialType.value.clear()
    if (socials) {
      for (const social of socials.value) {
        selectedSocialType.value.add(social.type!)
      }
    }
    if (newSocialInfo) {
      for (const social of newSocialInfo) {
        social.type && selectedSocialType.value.add(social.type)
      }
    }
  },
  { deep: true },
)
</script>

<template>
  <SectionContent
    :ref="(element: any) => (contactAndSocialInfoDivRef = element && element.$el)"
    sub-title="Contact and social information"
    content="Links to socials are used where your site has a social button e.g. navbars"
    class="relative border-b border-stone-200"
    :class="{
      'opacity-50 after:absolute after:left-0 after:top-0 after:size-full after:content-[\'&nbsp;\']':
        !canUpdateSettingContactAndSocialInfo,
    }"
  >
    <template #content>
      <div class="flex flex-wrap">
        <Inputs
          v-model="email"
          label="Publication email"
          placeholder="hello@storipress.com"
          html-name="publicationEmail"
          :show-error="Boolean(errors.publicationEmail)"
          autocomplete="email"
          class="mb-4 w-full"
        />
        <template v-if="socials">
          <div v-for="(item, index) in socials" :key="index" class="relative mb-4 flex w-full items-end">
            <Inputs
              v-model="item.url"
              add-on
              :label="`Publication ${item.type} Profile`"
              :placeholder="`${item.type?.toLowerCase()}.com/storipress`"
              :html-name="`publicationSocialLinks[${index}]`"
              :show-error="Boolean(errors[`publicationSocialLinks[${index}]`])"
              autocomplete="url"
              class="w-full"
            />
            <div
              role="button"
              class="ml-2 flex size-9 cursor-pointer rounded-3xl p-2.5 duration-75 ease-in-out hover:bg-gray-100"
              @click="onDeleteSocialLink({ type: 'currentSocial', index })"
            >
              <icon icon-name="delete" class="text-stone-500" />
            </div>
          </div>
        </template>
        <template v-if="newSocialList">
          <div v-for="(item, index) in newSocialList" :key="index" class="relative mb-3 flex w-full">
            <Select
              v-model="item.type"
              :items="availableSocialNetworkList"
              label="Social network"
              placeholder="Select ..."
              :name="`publicationNewSocialLinksType[${index}]`"
              class="mr-2 w-36"
            />
            <div class="flex items-end">
              <Inputs
                v-model="item.url"
                label="Link"
                placeholder="www..."
                :html-name="`publicationNewSocialLinks[${index}]`"
                autocomplete="url"
                class="w-80"
              />
              <div
                role="button"
                class="ml-2 flex size-9 cursor-pointer rounded-3xl p-2.5 duration-75 ease-in-out hover:bg-gray-100"
                @click="onDeleteSocialLink({ type: 'newSocial', index })"
              >
                <icon icon-name="delete" class="text-stone-500" />
              </div>
            </div>
          </div>
        </template>
        <button class="mt-1.5 flex items-center" @click="onAddSocialLink">
          <Icon icon-name="plus_circle" class="mr-2 text-emerald-700" />
          <span class="text-caption text-emerald-700">Add another social link</span>
        </button>
      </div>
    </template>
  </SectionContent>
</template>

<style scoped></style>
