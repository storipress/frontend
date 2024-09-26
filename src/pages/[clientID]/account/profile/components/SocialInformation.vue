<script setup lang="ts">
import { Icon, Inputs, Select } from '@storipress/core-component'
import type { NewSocialInfo, SocialLink, UserInfo } from '../definitions'
import { SocialNetworkList } from '../definitions'

const props = withDefaults(
  defineProps<{
    userInfo: UserInfo
    newSocialList: NewSocialInfo[]
    errors: Record<string, string | undefined>
  }>(),
  {},
)

const { website, contact_email, socials } = toRefs(props.userInfo)
const { newSocialList } = toRefs(props)
const socialNetworkList = Object.values(SocialNetworkList)

const selectedSocialType = ref(new Set<SocialNetworkList>())

const availableSocialNetworkList = computed(() => {
  return socialNetworkList.filter((item) => !selectedSocialType.value.has(item))
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
  [socials, newSocialList],
  ([socials, newSocialInfo]) => {
    selectedSocialType.value.clear()
    if (socials) {
      for (const social of socials) {
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
    sub-title="Contact and social information"
    content="Social links on your author page promote readers to follow you on other platforms."
    class="border-b border-stone-200"
  >
    <template #content>
      <div class="flex flex-wrap">
        <Inputs
          v-model="website"
          input-id="personal-website"
          add-on
          label="Personal website"
          placeholder="storipress.com"
          html-name="userWebsite"
          autocomplete="url"
          class="mb-4 w-full"
        />
        <Inputs
          v-model="contact_email"
          input-id="public-email"
          label="Public email"
          placeholder="hello@storipress.com"
          html-name="publicEmail"
          :show-error="Boolean(errors.publicEmail)"
          class="mb-4 w-full"
        />
        <template v-if="socials">
          <div v-for="(item, index) in socials" :key="index" class="relative mb-4 flex w-full items-end">
            <Inputs
              :key="index"
              v-model="item.url"
              :input-id="`social-links-${index}`"
              add-on
              :label="`Personal ${item.type} Profile`"
              :placeholder="`${item.type.toLowerCase()}.com/storipress`"
              :html-name="`userSocialLinks[${index}]`"
              :show-error="Boolean(errors[`userSocialLinks[${index}]`])"
              autocomplete="url"
              class="w-full"
            />
            <div
              role="button"
              aria-label="delete-social-link"
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
              :input-id="`new-social-links-${index}`"
              :items="availableSocialNetworkList"
              label="Social network"
              placeholder="Select ..."
              :name="`userNewSocialLinksType[${index}]`"
              class="mr-2 w-36"
            />
            <div class="flex items-end">
              <Inputs
                v-model="item.url"
                label="Link"
                placeholder="www..."
                :html-name="`userNewSocialLinks[${index}]`"
                :show-error="Boolean(errors[`userNewSocialLinks[${index}]`])"
                autocomplete="url"
                class="w-80"
              />
              <div
                role="button"
                aria-label="delete-new-social-link"
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
