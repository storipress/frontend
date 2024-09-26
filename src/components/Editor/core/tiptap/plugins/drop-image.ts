import { Extension } from '@tiptap/core'
import { nanoid } from 'nanoid'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import invariant from 'tiny-invariant'

import { droppedItems } from '../../schema/image'
import { filterSupportImageFiles, isInvalidImage } from '~/utils/file'

export const dropImage = Extension.create({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('dropImage'),
        props: {
          handlePaste(view, event, slice) {
            const items = [...(event.clipboardData?.items || [])]
            if (slice.size === 0 && items.some((item) => item.type.startsWith('image'))) {
              const images = filterSupportImageFiles(items).map((item) => item.getAsFile() as File)

              if (images.length === 0) {
                return false
              }

              event.preventDefault()

              insertAllImages(view, images, view.state.selection.from)
              return true
            }
            return false
          },
          handleDOMEvents: {
            drop(view, e) {
              // we are dragging inside the editor so we don't want to handle this
              if (view.dragging) {
                return false
              }

              const event = e as DragEvent
              if (!event.dataTransfer) {
                return true
              }

              const hasFiles = event.dataTransfer.files && event.dataTransfer.files.length > 0
              const url =
                event.dataTransfer.getData('url') ??
                event.dataTransfer.getData('text/plain') ??
                event.dataTransfer.getData('text/uri-list')

              if (!hasFiles && !url) {
                return true
              }

              if (url) {
                event.preventDefault()

                const { schema, tr } = view.state
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
                invariant(coordinates, 'cannot find drop coordinate')

                const id = nanoid()
                droppedItems.set(id, { kind: 'url', url })
                const node = schema.nodes.image.create({
                  file: id,
                })
                const transaction = tr.insert(coordinates.pos, node)
                view.dispatch(transaction)

                return false
              }

              const images = filterSupportImageFiles([...(event.dataTransfer?.files ?? [])])

              if (images.length > 0) {
                event.preventDefault()

                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
                invariant(coordinates, 'cannot find drop coordinate')
                insertAllImages(view, images, coordinates.pos)
                return false
              }

              return true
            },
          },
        },
      }),
    ]
  },
})

async function insertAllImages(view: EditorView, images: File[], pos: number) {
  const { schema, tr } = view.state
  const acceptedImages = (
    await Promise.all(images.map(async (img) => (!(await isInvalidImage(img)) ? img : undefined)))
  ).filter((img): img is File => typeof img !== 'undefined')
  acceptedImages.forEach((img) => {
    const id = nanoid()
    droppedItems.set(id, { kind: 'file', file: img })
    const node = schema.nodes.image.create({
      file: id,
    })
    const transaction = tr.insert(pos, node)
    view.dispatch(transaction)
  })
}
