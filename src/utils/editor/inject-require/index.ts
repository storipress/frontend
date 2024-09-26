import * as vue from 'vue'
import * as customField from '@storipress/custom-field'
import * as vueuse from '@vueuse/core'
import * as serverRenderer from 'vue/server-renderer'
import { inline } from './components/inline'
import { preview } from './components/preview'
import * as utils from './utils'
import * as resources from './resources'

const returnMapping: Record<string, unknown> = {
  vue,
  '@vueuse/core': vueuse,
  'vue/server-renderer': serverRenderer,
  '@storipress/custom-field': customField,
  '@storipress/sdk/article/utils': utils,
  '@storipress/sdk/resources': resources,
}

const inlineMapping: Record<string, unknown> = {
  '@storipress/sdk/article/components': inline,
  ...returnMapping,
}

const previewMapping: Record<string, unknown> = {
  '@storipress/sdk/article/components': preview,
  ...returnMapping,
}

export function injectRequire(isInline: boolean) {
  return (name: string) => {
    const mergeMapping = isInline ? inlineMapping : previewMapping
    if (mergeMapping[name]) {
      return mergeMapping[name]
    }

    throw new Error(`cannot find module \`${name}\``)
  }
}
