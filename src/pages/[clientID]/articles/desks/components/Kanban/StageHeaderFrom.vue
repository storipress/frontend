<script lang="ts" setup>
import { ref } from 'vue'
import { MenuItems, mergeTailwind } from '@storipress/core-component'
import { Menu, MenuButton } from '@headlessui/vue'
import type { UpdateStageInputData } from './definition'
import Icon from './Icon.vue'

const props = defineProps<{
  name: string
  color: string
  icon: string
  defaultIcon?: string
}>()
defineEmits<{
  (event: 'save', data: UpdateStageInputData): void
  (event: 'cancel'): void
}>()

const draftFroEditing = ref<UpdateStageInputData>({
  name: props.name,
  color: props.color,
  icon: props.icon,
})
watch(props, () => {
  draftFroEditing.value = {
    name: props.name,
    color: props.color,
    icon: props.icon,
  }
})

const iconOptions = [
  'note',
  'clipboard-tick',
  'sprout-grow',
  'attachment',
  'preview',
  'fountain_pen_tip',
  'flag',
  'comment',
  'light-bulb',
]
const colorOptions = ['#ef4444', '#84cc16', '#14b8a6', '#64748b', '#0369a1', '#8b5cf6']

function updateDraftByShownDefaultIcon($event: 'default' | 'normal') {
  if ($event === 'default' && props.defaultIcon) {
    draftFroEditing.value.icon = props.defaultIcon
  }
}
</script>

<template>
  <h4 class="mb-[0.875rem] flex items-center px-2 pt-[0.344rem]" data-testid="stage-header-form">
    <Menu as="div" class="relative z-10 -ml-1 flex items-center">
      <MenuButton
        class="mr-[0.188rem] flex h-7 w-8 items-center rounded-sm bg-stone-200 py-1 pl-1"
        data-testid="stage-header-form-menu"
      >
        <span class="mr-[0.375rem] h-5 w-[0.188rem] rounded-r-sm" :style="{ background: draftFroEditing.color }"></span>
        <Icon
          class="text-stone-600"
          :icon-name="draftFroEditing.icon"
          :default-icon="defaultIcon"
          @show="updateDraftByShownDefaultIcon"
        />
      </MenuButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems class="shadow-lg absolute top-full mt-[0.156rem] box-content h-[8.5rem] rounded">
          <div class="w-20">
            <div class="flex flex-wrap justify-between gap-[0.125rem] px-[0.125rem] py-[0.156rem]">
              <button
                v-for="option in iconOptions"
                :key="option"
                class="flex size-6 items-center justify-center rounded-sm hover:bg-stone-200"
                data-testid="stage-header-form-menu-icon"
                @click="() => (draftFroEditing.icon = option)"
              >
                <Icon
                  :class="
                    mergeTailwind(['scale-75 text-stone-600', { 'text-sky-600': option === draftFroEditing.icon }])
                  "
                  :icon-name="option"
                />
              </button>
            </div>
            <hr class="mx-[0.375rem] mb-[0.094rem] border-stone-200" />
            <div class="flex flex-wrap justify-between gap-2 p-2">
              <button
                v-for="option in colorOptions"
                :key="option"
                :class="
                  mergeTailwind([
                    'h-4 w-4 rounded-full border border-solid border-stone-200 hover:bg-stone-200',
                    { 'border-sky-600': option === draftFroEditing.color },
                  ])
                "
                data-testid="stage-header-form-menu-color"
                :style="{ background: option }"
                @click="draftFroEditing.color = option"
              ></button>
            </div>
          </div>
        </MenuItems>
      </transition>
    </Menu>
    <form class="flex items-center" action="" @submit.prevent="$emit('save', draftFroEditing)">
      <input
        v-model="draftFroEditing.name"
        name="stage-name"
        placeholder="Name"
        required
        :class="mergeTailwind('text-caption mr-2 w-[11.188rem] rounded border border-gray-400 py-1 pl-2 pr-3')"
      />
      <button class="mr-1 flex items-center justify-center" type="button">
        <Icon
          data-testid="stage-header-form-cancel"
          class="scale-75 cursor-pointer text-red-700"
          icon-name="cross_thin"
          @click="$emit('cancel')"
        />
      </button>
      <button data-testid="stage-header-form-save" class="mr-[0.125rem] flex items-center justify-center" type="submit">
        <Icon class="scale-75 text-emerald-600" icon-name="tick" />
      </button>
    </form>
  </h4>
</template>

<style scoped></style>
