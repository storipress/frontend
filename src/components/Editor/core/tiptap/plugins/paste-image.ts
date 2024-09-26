import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Slice } from '@tiptap/pm/model'
import { clientID } from '../../client'
import { EXTERNAL_IMAGE, getImageSource } from '~/utils/image-source'

const pasteExternalImageKey = new PluginKey('pasteImage')

const pasteExternalImagePlugin = new Plugin({
  key: pasteExternalImageKey,
  props: {
    transformPasted(slice) {
      const fragment = slice.content
      let result = fragment

      fragment.forEach((node, _, index) => {
        if (node.type.name === 'image') {
          const { src } = node.attrs
          if (isExternalImage(src)) {
            // we simply attach `cid` here so the NodeView will understand that it should fetch the image
            // ref: src/components/Editor/core/schema/image/view.vue
            result = result.replaceChild(index, node.type.create({ src, cid: clientID, provider: EXTERNAL_IMAGE }))
          }
        }
      })

      return new Slice(result, slice.openStart, slice.openEnd)
    },
  },
})

export const pasteExternalImage = Extension.create({
  addProseMirrorPlugins() {
    return [pasteExternalImagePlugin]
  },
})

// All other than our CDN and Unsplash are external
export function isExternalImage(url: string) {
  return getImageSource(url) === 'external-image'
}
