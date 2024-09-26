<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import MenuButton from './MenuButton.vue'
import { SearchInputType } from '~/components/Navbar/definition'
import SearchInput from '~/components/Navbar/SearchInput.vue'

const props = withDefaults(defineProps<{ modelValue?: string }>(), {
  modelValue: '',
})
const emit = defineEmits<(event: 'update:modelValue', value: string) => void>()

const searchValue = useVModel(props, 'modelValue', emit)

const router = useRouter()
const route = useRoute()
async function goBack() {
  const lastPath = router?.options?.history?.state?.back
  return lastPath ? router.back() : router.push(`/${route.params.clientID}/articles/desks/all`)
}
</script>

<template>
  <header class="flex items-center border border-stone-200 bg-stone-50 py-2.5 pr-5">
    <h1 class="text-display-small w-60 flex-shrink-0 pl-5 font-bold">
      <Icon class="mr-4 size-[1.375rem]" icon-name="database" />Content Model
    </h1>
    <SearchInput
      placeholder="Search filter …"
      :model-value="{ text: searchValue }"
      :type="SearchInputType.Other"
      @update:model-value="({ text }) => (searchValue = text)"
    />
    <MenuButton />
    <button class="border-transparent bg-transparent" @click="goBack">
      <Icon class="size-[1.375rem] text-[#5c5f62]" icon-name="cross_thin" />
    </button>
  </header>
</template>
