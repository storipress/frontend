import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'

const ourLink = ['https://assets.stori.press', 'https://unsplash.com']

export const trackPaste = Extension.create({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('trackPaste'),
        props: {
          handlePaste(_, __, slice) {
            let pastedPictures = 0
            let pastedText = 0
            slice.content.forEach((node) => {
              if (node.attrs.src) {
                sendTrack('editor_photo_upload', {
                  type: 'paste',
                  isHotLink: !(node.attrs.src.startsWith(ourLink[0]) || node.attrs.src.startsWith(ourLink[1])),
                })
                pastedPictures += 1
              } else if (node.textContent) {
                pastedText += node.textContent.length
              }
            })
            sendTrackUnchecked('editor_pasted', {
              pastedPictures,
              pastedText,
            })
          },
        },
      }),
    ]
  },
})
