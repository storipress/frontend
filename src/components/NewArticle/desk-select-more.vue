<script setup lang="ts">
import { MenuButton, MenuItem } from '@headlessui/vue'
import { Dropdowns, SubMenu } from '@storipress/core-component'
import type { Options } from '@popperjs/core'
import SubdeskItem from './subdesk-item.vue'
import DeskButton from './desk-button.vue'
import type { Desk } from './definitions'

const props = defineProps<{
  desk?: Desk[]
  selected?: Desk

  mainDeskMap: Map<string, string>
  active?: boolean
  target?: HTMLElement
}>()

const element = document.querySelector('#app')
const popperOptions: Partial<Options> = {
  modifiers: [
    {
      name: 'preventOverflow',
      options: {
        mainAxis: false,
      },
    },
    {
      name: 'flip',
      options: {
        boundary: element,
      },
    },
  ],
}

const name = computed(() => {
  const result = props.desk?.find((desk) => {
    return desk.id === props.selected?.id || desk.desks?.find((subDesk) => subDesk.id === props.selected?.id)
  })
  if (result?.desks?.length) {
    const subDesk = result?.desks.find((subDesk) => subDesk.id === props.selected?.id)
    return `${result.name}/${subDesk?.name}`
  } else {
    return result?.name
  }
})
</script>

<template>
  <Dropdowns placement="top-start">
    <template #button="{ open }">
      <MenuButton as="template">
        <DeskButton :active="open || Boolean(name)">{{ name || `More desks…` }}</DeskButton>
      </MenuButton>
    </template>
    <template v-for="d of desk" :key="d.id">
      <MenuItem v-if="d.desks?.length === 0">
        <SubdeskItem :item="d" />
      </MenuItem>
      <SubMenu v-else :title="d.name" placement="right-start" :options="popperOptions">
        <MenuItem v-for="sub of d.desks" :key="sub.id">
          <SubdeskItem :item="sub" />
        </MenuItem>
      </SubMenu>
    </template>
  </Dropdowns>
</template>

<style scoped></style>
