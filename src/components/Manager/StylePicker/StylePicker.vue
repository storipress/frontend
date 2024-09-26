<script lang="ts" setup>
import { Buttons } from '@storipress/core-component'
import { snakeCase } from 'lodash-es'
import type { LayoutData } from './definitions'
import { usePolyfill } from './polyfill'
import { injectRequire } from '~/utils/editor/inject-require'
import { assertStyleTree, createStyleTree } from '~/lib/dynamic-style'
import { InlinePreview } from '~/components/Preview'
import { isAdmin, useUserPermission } from '~/composables/permission/user-permission'
import type { SiteTemplate } from '~/graphql-operations'
import type { TCustomComponent } from '~/utils/customLayout/types'
import { useIntegrationStore } from '~/stores/integration'

interface Layout {
  id: string
  name?: string
  template?: string
  data?: string
}

const props = withDefaults(
  defineProps<{
    previewId: string
    layoutList: Layout[]
    customLayouts: SiteTemplate[] | []
  }>(),
  {
    customLayouts: () => [],
  },
)

const emit = defineEmits<{
  (event: 'clickLayout', layoutId: string, template: string, data: LayoutData): void
  (event: 'clickCustomLayout', layoutId: string, layoutUrl: string): void
  (event: 'editDesign', id: string): void
}>()

const compoentsArray = ref<TCustomComponent[]>([])
const integrationStore = useIntegrationStore()
integrationStore.fetchIntegrations()

const shopifyConnected = computed(() => {
  const shopifyData = JSON.parse(integrationStore.integrations?.find((item) => item.key === 'shopify')?.data || '{}')
  return Object.keys(shopifyData).length > 0
})

const parseLayoutArray = computed(() => {
  return props.layoutList
    .filter((layout: Layout) => layout.data)
    .map((layout: Layout) => {
      return { ...layout, data: parseData(layout.data || "{dropcap: 'none', blockquote: 'regular'}") }
    })
})

function clickLayout(layoutId: string, template: string, layoutData: LayoutData) {
  emit('clickLayout', layoutId, template, layoutData)
}

function clickCustomLayout(layoutId: string, layoutUrl: string) {
  emit('clickCustomLayout', layoutId, layoutUrl)
}

const hasPermission = computed(() => isAdmin(useUserPermission().value.role))
const showEditButton = computed(
  () => !shopifyConnected.value && compoentsArray.value.length === 0 && hasPermission.value,
)

function parseData(json: string) {
  const data: LayoutData = JSON.parse(json)
  return {
    elements: data.elements || {},
    styles: assertStyleTree(data.styles || createStyleTree('article'), 'article'),
  }
}

watchEffect(async () => {
  const newCustomLayouts = props.customLayouts
  if (newCustomLayouts.length > 0) {
    compoentsArray.value = await Promise.all(
      newCustomLayouts.map(async ({ url }) => {
        const jsFile = await import(url)
        const module = { exports: {}, url } as TCustomComponent
        jsFile.default.factory(module, injectRequire(true))
        module.exports.__name = snakeCase(module.exports.__name)
        return module
      }),
    )
  }
})

usePolyfill()
</script>

<template>
  <div class="sticky top-0 flex h-full flex-col items-center">
    <div class="flex flex-col items-center overflow-y-auto">
      <div class="sticky top-1 z-50 mb-6 flex items-center" :class="showEditButton ? 'pt-14' : 'pt-12'">
        <Buttons
          v-if="showEditButton"
          type="main"
          :is-shadow="true"
          :is-border="true"
          @click="emit('editDesign', previewId)"
        >
          Edit Article Designs
        </Buttons>
      </div>
      <div v-if="compoentsArray.length > 0">
        <div
          v-for="layout of compoentsArray"
          :key="layout.exports.__name"
          class="layer-1 z-40 mb-4 h-[12.5rem] min-h-[12.5rem] w-56 cursor-pointer overflow-hidden rounded border transition-opacity duration-100 hover:opacity-75"
          :class="[
            layout.exports.__name === previewId ? 'border-2 border-emerald-700 bg-sky-600/[.15]' : 'border-stone-900/5',
          ]"
          @click="clickCustomLayout(layout.exports.__name, layout.url)"
        >
          <InlinePreview template-name="custom" :is-custom="true" :data="layout.exports" :is-custom-layout="true" />
        </div>
      </div>
      <div v-else>
        <div
          v-for="layout of parseLayoutArray"
          :key="layout.id"
          class="layer-1 z-40 mb-4 h-[12.5rem] min-h-[12.5rem] w-56 cursor-pointer overflow-hidden rounded border transition-opacity duration-100 hover:opacity-75"
          :class="[layout.id === previewId ? 'border-2 border-emerald-700 bg-sky-600/[.15]' : 'border-stone-900/5']"
          @click="clickLayout(layout.id, layout.template || '', layout.data)"
        >
          <InlinePreview
            :template-name="layout.template || ''"
            :style-tree="layout.data.styles"
            :data="layout.data"
            :scope="layout.template"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
