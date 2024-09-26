<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import { BlockType } from '../../utils'
import type { Format } from './action-list'
import { primary } from './action-list'
import { useListCustomBlocks } from './custom-blocks'
import { useLayouts } from '~/pages/[clientID]/articles/[id]/edit/utils'
import { TemplateType } from '~/graphql-operations'
import type { SiteTemplate } from '~/graphql-operations'

type CustomBlock = SiteTemplate & { id?: string }

const emit = defineEmits<{
  (event: 'applyCommand', format: Format): void
  (event: 'applyOn', format: Format): void
}>()

const { customBlocks: availableCustomBlocks } = useLayouts()
const customFieldGroups = useListCustomBlocks()

const customBlocks = computed(() => {
  const ids = new Set(availableCustomBlocks.value.map(({ name }) => name))
  return [
    ...availableCustomBlocks.value,
    ...customFieldGroups.value
      .filter(({ key }) => !ids.has(key))
      .map(({ id, key, description }) => ({ id, name: key, description, type: TemplateType.EditorBlock })),
  ] as CustomBlock[]
})

function insertCustomBlock(block: CustomBlock) {
  const uuid = crypto.randomUUID()
  emit('applyOn', {
    key: BlockType.custom,
    name: 'Embed',
    action: 'setEmbed',
    options: { name: 'html', blockName: block.name, uuid, ...(block?.id && { id: block.id }) },
  })
}
</script>

<template>
  <div class="w-[21.5rem] rounded-lg bg-white py-2.5 shadow-2-layer" @click.stop>
    <p class="text-subheading ml-4 pb-1.5 text-stone-500">Basic Blocks</p>

    <!-- Basic Block Button Parent -->
    <section class="grid grid-cols-5 gap-2 px-2.5">
      <!-- Basic Block Button -->
      <div
        v-for="format in primary"
        :key="format.name"
        class="flex size-14 cursor-pointer flex-col items-center justify-center rounded shadow-[0_1px_5px_0_rgb(0,0,0,0.1)] transition duration-200 hover:bg-stone-100 hover:shadow-2-layer"
        @mousedown="$emit('applyCommand', format)"
      >
        <!-- Basic Block Button Icon -->
        <div class="flex size-6 justify-center" :class="{ 'scale-150': format.name === 'Embed' }">
          <!-- <componet :is="format.component" /> -->
          <img :src="format.component as string" />
        </div>

        <!-- Basic Block Button Text -->
        <span class="mt-1 text-center text-[0.55rem] text-stone-400"> {{ format.name }} </span>
      </div>
    </section>

    <template v-if="customBlocks.length > 0">
      <!-- Divider -->
      <div class="my-5 h-px w-full bg-stone-200" />

      <p class="text-subheading mb-0.5 ml-4 pb-1.5 text-stone-500">Custom Article Blocks</p>

      <section class="grid grid-cols-2 gap-2 px-2.5">
        <div
          v-for="block in customBlocks"
          :key="`${block.name}${block.type}`"
          class="flex h-14 w-full cursor-pointer flex-row items-center justify-start rounded pl-2.5 shadow-[0_1px_5px_0_rgb(0,0,0,0.1)] transition-all duration-100 hover:bg-stone-100 hover:shadow-2-layer"
          @mousedown="insertCustomBlock(block)"
        >
          <!-- Custom Block Button Icon -->
          <div class="flex size-6 justify-center">
            <Icon icon-name="lego" class="text-[1.5rem] text-stone-600" />
          </div>

          <!-- Custom Block Button Text -->
          <div class="ml-2.5 flex h-full flex-col justify-center">
            <div class="text-body text-stone-500">{{ block.name }}</div>
            <div class="line-clamp-1 text-[0.55rem] font-light text-stone-400">{{ block.description }}</div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
