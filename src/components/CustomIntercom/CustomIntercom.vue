<script setup lang="ts">
import { Dropdowns, Icon, MenuItem } from '@storipress/core-component'
import { MenuButton } from '@headlessui/vue'
import publicationLogo from '@assets/intercom-question-mark.svg'
import type { OptionsGeneric, StrictModifiers } from '@popperjs/core'

const options: Partial<OptionsGeneric<StrictModifiers>> = {
  modifiers: [{ name: 'offset', options: { offset: [0, 6] } }],
}
</script>

<template>
  <div class="fixed bottom-5 right-5 z-[27]">
    <Dropdowns placement="top-end" :options="options">
      <template #button>
        <MenuButton
          aria-label="open-dropdown"
          class="layer-1 flex size-9 items-center justify-center rounded-full bg-gray-100"
        >
          <img :src="publicationLogo" class="h-4" />
        </MenuButton>
      </template>
      <template #default>
        <a href="https://help.storipress.com/" target="_blank" rel="noreferrer noopener">
          <MenuItem class="pr-6">
            <Icon icon-name="steps" class="mr-2.5" />
            Help articles + tutorials
          </MenuItem>
        </a>
        <a href="mailto:hello@storipress.com">
          <MenuItem class="pr-6">
            <Icon icon-name="comment" class="mr-2.5" />
            Email support
          </MenuItem>
        </a>
      </template>
    </Dropdowns>
  </div>
</template>
