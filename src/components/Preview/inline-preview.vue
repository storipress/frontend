<script lang="ts" setup>
import { defineProps, ref, toRef, withDefaults } from 'vue'
import { stubObject } from 'lodash-es'
import type { ArticleInjected } from '@article-templates/elements/inject'
import { usePreviewData } from './hooks'
import Imageify from './imageify.vue'
import Preview from './preview.vue'
import { DEFAULT_PREVIEW_DATA } from './preview-data'
import type { StyleTree } from '~/lib/dynamic-style'
import { createStyleTree } from '~/lib/dynamic-style'
import type { TCustomModule } from '~/utils/customLayout/types'

const props = withDefaults(
  defineProps<{
    templateName: string
    isCustomLayout?: boolean
    styleTree?: StyleTree
    interactive?: boolean
    title?: string
    scope?: string
    width?: number
    data?: Partial<ArticleInjected | TCustomModule>
  }>(),
  {
    styleTree: () => createStyleTree(),
    width: 1070,
    isCustomLayout: false,
    data: stubObject,
  },
)

const height = ref(props.isCustomLayout ? 3000 : 800)

const tree = usePreviewData({
  data: {
    ...DEFAULT_PREVIEW_DATA,
    ...props.data,
    elements: { ...DEFAULT_PREVIEW_DATA.elements, ...props.data.elements },
  },
  userStyleTree: toRef(props, 'styleTree'),
})
</script>

<template>
  <Imageify :width="width" :height="height" :title="title" :interactive="interactive">
    <div v-if="isCustomLayout" class="flex h-full bg-white">
      <component :is="data" />
    </div>
    <Preview v-else v-model:height="height" :template-name="templateName" :style-tree="tree" :scope="scope" />
  </Imageify>
</template>
