<script lang="ts" setup>
import { RadioGroupOption } from '@headlessui/vue'
import DeskButton from './desk-button.vue'
import type { Desk } from './definitions'
import SubdeskItem from './subdesk-item.vue'
import { useTogglePopup } from '~/composables'

const props = defineProps<{
  desk?: Desk
  parent?: Desk
  selected?: Desk
  index?: number

  mainDeskMap: Map<string, string>
  active?: boolean
  target?: HTMLElement
}>()

const name = computed(() => {
  if (
    props.desk &&
    props.selected &&
    // we are the parent desk of the selected desk
    props.desk.id !== props.selected.id &&
    props.mainDeskMap.get(props.selected.id) === props.desk.id
  ) {
    return `${props.desk.name}/${props.selected.name}`
  }
  if (props.parent && props.desk) {
    return `${props.parent.name}/${props.desk.name}`
  }
  if (props.desk) {
    return props.desk.name
  }
  if (props.parent) {
    return props.parent.name
  }
  return ''
})

const deskSelectRef = ref(null)
const { width } = useElementSize(deskSelectRef)
const selected = ref()
const desks = computed(() => props.desk?.desks ?? [])
const { reference, popup, open, togglePopup } = useTogglePopup({
  options: {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'flip',
        enabled: false,
      },
      {
        name: 'offset',
        options: {
          offset: [0, 4],
        },
      },
    ],
  },
})

// Clean up the selected desk when the selected one is not in the list of the child desks
watchEffect(() => {
  if (!props.selected) {
    return
  }

  if (!props.parent) {
    if (props.mainDeskMap.get(props.selected.id) !== props.desk?.id) {
      selected.value = undefined
    } else if (selected.value !== props.selected) {
      selected.value = props.selected.desks?.length ? props.selected.desks[0] : props.selected
    }
  }
})

defineExpose({
  width,
})
</script>

<template>
  <RadioGroupOption v-if="desks.length === 0" ref="deskSelectRef" v-slot="{ checked }" :value="desk">
    <DeskButton :active="active || (desk && checked)" :data-intercom-target="index != null && `Desk Button ${index}`">
      {{ name }}
    </DeskButton>
  </RadioGroupOption>
  <div v-else ref="deskSelectRef" class="relative inline-block">
    <div ref="reference" class="trigger">
      <div class="inline-flex w-full justify-start focus:outline-none">
        <DeskButton
          :active="open || mainDeskMap.get(selected?.id) === desk?.id"
          :data-intercom-target="index != null && `Desk Button ${index}`"
          @click="togglePopup"
        >
          {{ name }}
        </DeskButton>
      </div>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <Teleport :to="target" :disabled="!target">
        <div
          v-show="open"
          ref="popup"
          class="layer-2 max-h-72 w-max overflow-y-auto rounded-md bg-white py-1 focus:outline-none"
          @click="open = false"
        >
          <SubdeskItem v-for="d of desks" :key="d.id" :item="d" />
        </div>
      </Teleport>
    </transition>
  </div>
</template>
