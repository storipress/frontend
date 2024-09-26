<!-- Storipress Manager universal searchbar -->

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, ref, toRefs } from 'vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { Icon } from '@storipress/core-component'
import slashIcon from '@assets/slash-command.svg'
import iconsSettings2 from '@assets/icons-settings-2.svg'
import { useDebounceFn, useEventListener } from '@vueuse/core'
import CalendarDateRangeSelector from './CalendarDateRangeSelector.vue'
import { SearchInputType } from './definition'
import type { PlanItem, SearchDataInterface } from './definition'
import PlanSelectTypeahead from './PlanSelectTypeahead.vue'
import { cn } from '~/lib/cn'
import type { UserType } from '~/components/UserSelectTypeahead/definition'
import UserSelectTypeahead from '~/components/UserSelectTypeahead'
import type { TagType } from '~/components/TagSelectTypeahead/definition'
import TagSelectTypeahead from '~/components/TagSelectTypeahead'
import DeskSelectTypeahead from '~/components/DeskSelectTypeahead'
import type { ListDesksQuery } from '~/graphql-operations'

defineOptions({
  name: 'SearchInput',
})

const props = defineProps({
  modelValue: {
    type: Object as PropType<SearchDataInterface>,
    default: () => ({}),
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String as PropType<SearchInputType>,
    default: SearchInputType.Article,
  },
})

const emit = defineEmits(['update:modelValue'])

const { modelValue } = toRefs(props)
const searchInput = ref<HTMLInputElement | null>(null)
const filterButton = ref<HTMLElement | null>(null)
const hasFilterValue = computed<boolean>(() => {
  const verifiedDateRange = Boolean(modelValue.value?.range?.[0] && modelValue.value?.range?.[1])
  return Boolean(modelValue.value?.people?.length || modelValue.value?.tags?.length || verifiedDateRange)
})
const update = useDebounceFn((newValue: SearchDataInterface) => {
  emit('update:modelValue', newValue as SearchDataInterface)
}, 150)
function handleKeyDown(event: KeyboardEvent) {
  if (
    event.key === '/' &&
    // Deactivate event listener if user is focused on a text input
    document.activeElement?.tagName !== 'INPUT' &&
    document.activeElement?.tagName !== 'TEXTAREA'
  ) {
    event.preventDefault()
    searchInput.value?.focus()
    searchInput.value?.select()
  } else if (event.key === 'Escape' && document.activeElement?.tagName === 'INPUT') {
    event.preventDefault()
    searchInput.value?.blur()
  } else if (
    event.key === 'f' &&
    document.activeElement?.tagName !== 'INPUT' &&
    document.activeElement?.tagName !== 'TEXTAREA'
  ) {
    event.preventDefault()
    filterButton.value?.click()
  }
}
useEventListener(window, 'keydown', handleKeyDown)

const assets = {
  slashIcon,
  iconsSettings2,
}

function handleInput(event: Event) {
  update({ ...modelValue.value, text: (event.target as HTMLInputElement | null)?.value })
}

function handleRangeChange(range: [Date, Date]) {
  emit('update:modelValue', {
    ...modelValue.value,
    range,
  } as SearchDataInterface)
}

function handlePeopleChange(people: UserType[]) {
  update({ ...modelValue.value, people })
}

function handleTagsChange(tags: TagType[]) {
  update({ ...modelValue.value, tags })
}

function handleDesksChange(desks: ListDesksQuery['desks']) {
  update({ ...modelValue.value, desks })
}

function handlePlansChange(plans: PlanItem[]) {
  update({ ...modelValue.value, plans })
}
</script>

<template>
  <!-- Popover component for search bar -->
  <Popover as="div" :class="cn(['relative h-9 w-full', $attrs.class])">
    <!-- Search icon -->
    <img class="absolute ml-[0.562rem] h-9 w-5 select-none" :src="assets.slashIcon" />
    <!-- Search input field -->
    <input
      ref="searchInput"
      class="text-body size-full rounded border border-solid border-stone-200 bg-white/60 py-1.5 pl-[2.35rem] pr-8 outline-none transition duration-300 hover:bg-white hover:shadow-2-layer focus:bg-white focus:shadow-2-layer"
      type="text"
      :placeholder="placeholder"
      :value="modelValue.text"
      @input="handleInput"
    />
    <!-- Filter popover button -->
    <PopoverButton
      v-if="!(type === SearchInputType.Members || type === SearchInputType.Other)"
      class="absolute right-[0.781rem] inline-flex h-9 items-center justify-center border-none bg-transparent outline-none"
      as="button"
      data-testid="navbar-search-filter-trigger"
    >
      <button ref="filterButton" class="hidden" />
      <Icon
        :class="[
          hasFilterValue
            ? 'text-xs text-sky-600 transition-colors duration-150 hover:text-sky-700'
            : 'text-xs text-stone-400 transition-colors duration-150 hover:text-stone-500',
        ]"
        icon-name="filter"
      />
    </PopoverButton>
    <!-- Transition effect for filter popover -->
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <!-- Popover panel for filter options -->
      <PopoverPanel
        class="layer-2 absolute right-0 mt-2 box-content w-[18.5rem] origin-top-right rounded-lg focus:outline-none"
        role="dialog"
        aria-label="Search filter"
      >
        <!-- Filter options -->
        <div :class="cn(['rounded-t-lg bg-sky-600 p-4', { 'rounded-b-lg': type !== SearchInputType.Article }])">
          <!-- Filter search heading -->
          <h4 class="mb-4 flex items-center text-white">
            <img class="mr-2 inline-block size-5 select-none" :src="assets.iconsSettings2" />
            <span class="text-pageheading text-white"> Filter Search </span>
          </h4>
          <!-- User select typeahead -->
          <div class="mb-2 flex w-full items-center">
            <Icon class="ml-[0.125rem] mr-[0.625rem] size-4 text-[1rem] text-white" icon-name="users" />
            <UserSelectTypeahead
              class="grow"
              placeholder="People"
              :model-value="modelValue.people ?? []"
              @update:model-value="handlePeopleChange"
            />
          </div>
          <!-- Desk select typeahead -->
          <div class="mb-2 flex w-full items-center">
            <Icon class="ml-[0.125rem] mr-[0.625rem] size-4 text-[1rem] text-white" icon-name="desk" />
            <DeskSelectTypeahead
              class="grow"
              placeholder="Desks"
              :model-value="modelValue.desks ?? []"
              @update:model-value="handleDesksChange"
            />
          </div>
          <!-- Tag select typeahead -->
          <div class="mb-2 flex w-full items-center">
            <Icon class="ml-[0.125rem] mr-[0.625rem] size-4 text-[1rem] text-white" icon-name="tag" />
            <TagSelectTypeahead
              class="grow"
              placeholder="Tags"
              :model-value="modelValue.tags ?? []"
              @update:model-value="handleTagsChange"
            />
          </div>
          <!-- Plan select typeahead -->
          <PlanSelectTypeahead
            class="mb-2 flex w-full items-center"
            :model-value="modelValue.plans ?? []"
            @update:model-value="handlePlansChange"
          />
        </div>
        <!-- Calendar date range selector -->
        <CalendarDateRangeSelector
          v-if="type === SearchInputType.Article"
          class="rounded-b-lg bg-white px-2 pb-4 pt-5"
          :model-value="modelValue.range"
          @update:model-value="handleRangeChange"
        />
        <!-- Popover for hint -->
        <Popover
          v-if="type === SearchInputType.Article"
          v-slot="{ close }"
          as="div"
          class="absolute bottom-[1.375rem] right-5 flex"
        >
          <!-- Popover button for hint -->
          <PopoverButton class="flex outline-none">
            <Icon
              class="size-4 cursor-pointer text-[1rem] text-stone-400"
              icon-name="question-mark-inverse"
              data-testid="navbar-search-hint-trigger"
              @mouseenter="(event) => (event.target as any | null)?.click()"
            />
          </PopoverButton>
          <!-- Transition effect for hint popover panel -->
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <!-- Hint popover panel -->
            <PopoverPanel
              class="layer-2 absolute left-[-0.187rem] top-[-0.25rem] w-52 overflow-hidden rounded-lg bg-white"
              @mouseleave="close"
            >
              <!-- Hint text -->
              <div class="p-4">
                <p class="text-body text-stone-400">
                  Setting a date range filters drafts by creation date and published articles by their publish date.
                </p>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<style lang="scss" scoped>
:deep .typeahead {
  &-wrap {
    min-height: 1.75rem;
    @apply flex
      items-center
      rounded-none
      border-0
      border-b
      border-stone-200
      bg-white/[.1]
      p-1
      text-white outline-none;
    font-size: 0.75rem;
    line-height: 1rem;
    > ul {
      @apply gap-[0.125rem];
      > li:last-child {
        @apply flex
          items-center;
      }
    }
  }
  &-label {
    @apply text-white/[.75];
  }
  &-tag {
    @apply relative
      mb-0
      mr-0
      gap-[0.125rem]
      bg-white/[.25]
      pl-[0.375rem]
      pr-[0.235rem]
      text-white;
    & > span:nth-child(1) {
      @apply pr-4;
    }
    & > span:nth-child(2) {
      @apply absolute
        right-0
        h-4
        w-4
        origin-center
        scale-50
        text-[1rem]
        opacity-75;
    }
  }
  & .simple-typeahead-list {
    @apply mt-[0.125rem];
  }
}
</style>
