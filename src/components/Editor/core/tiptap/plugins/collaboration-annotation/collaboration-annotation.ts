import { Extension } from '@tiptap/core'
import { sortBy } from 'lodash-es'
import invariant from 'tiny-invariant'
import type * as Y from 'yjs'

import { AnnotationPlugin } from './annotation-plugin'
import type { AnnotationState } from './annotation-state'
import { AnnotationPluginKey } from './key'
import type { AddAnnotationAction, DeleteAnnotationAction, UpdateAnnotationAction } from './types'
import { getRelativeTop } from '~/utils/editor'

export interface AnnotationOptions {
  HTMLAttributes: Record<string, any>
  /**
   * An initialized Y.js document.
   */
  document: Y.Doc | null
  /**
   * Name of a Y.js map, can be changed to sync multiple fields with one Y.js document.
   */
  field: string
  /**
   * A raw Y.js map, can be used instead of `document` and `field`.
   */
  map: Y.Map<any> | null
  instance: string
}

export interface AnnotationPosition {
  id: string
  top: number
  from: number
  to: number
}

export interface AnnotationStorage {
  positions: AnnotationPosition[]
}

function getMapFromOptions(options: AnnotationOptions): Y.Map<any> {
  return options.map ? options.map : (options.document?.getMap(options.field) as Y.Map<any>)
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    annotation: {
      addAnnotation: (id: string, data: any) => ReturnType
      addAnnotationAt: (id: string, from: number, to: number, data: any) => ReturnType
      updateAnnotation: (id: string, data: any) => ReturnType
      deleteAnnotation: (id: string) => ReturnType
      refreshAnnotation: () => ReturnType
    }
  }
}

export const CollaborationAnnotation = Extension.create<AnnotationOptions, AnnotationStorage>({
  name: 'annotation',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'annotation',
      },
      document: null,
      field: 'annotations',
      map: null,
      instance: '',
    }
  },

  addStorage() {
    return {
      positions: [],
    }
  },

  onCreate() {
    const map = getMapFromOptions(this.options)

    map.observe(() => {
      this.editor.commands.refreshAnnotation()
    })
  },

  onTransaction() {
    const { editor } = this
    const parentRect = editor.view.dom.getBoundingClientRect()
    const annotationState = AnnotationPluginKey.getState(editor.state)
    invariant(annotationState, 'Annotation plugin state is undefined')

    const positions = annotationState.annotations.map(
      ({ spec, from, to }): AnnotationPosition => ({
        id: spec.id as string,
        top: getRelativeTop(editor.view, from, to, parentRect),
        from,
        to,
      }),
    )

    this.storage.positions = sortBy(positions, ({ from }) => from)
  },

  addCommands() {
    return {
      addAnnotation:
        (id: string, data: any) =>
        ({ commands, state }) => {
          const { selection } = state
          if (selection.empty) {
            return false
          }
          const { from, to } = selection
          return commands.addAnnotationAt(id, from, to, data)
        },
      addAnnotationAt:
        (id: string, from: number, to: number, data: any) =>
        ({ dispatch, state }) => {
          const { tr } = state

          const pluginState = AnnotationPluginKey.getState(state) as AnnotationState
          if (pluginState.annotationsInRange(from, to).length > 0) {
            return false
          }

          if (dispatch && data) {
            tr.setMeta(AnnotationPluginKey, {
              type: 'addAnnotation',
              from,
              to,
              id,
              data,
            } as AddAnnotationAction)
          }

          return true
        },
      updateAnnotation:
        (id: string, data: any) =>
        ({ dispatch, state }) => {
          if (dispatch) {
            state.tr.setMeta(AnnotationPluginKey, {
              type: 'updateAnnotation',
              id,
              data,
            } as UpdateAnnotationAction)
          }

          return true
        },
      deleteAnnotation:
        (id) =>
        ({ dispatch, state }) => {
          if (dispatch) {
            state.tr.setMeta(AnnotationPluginKey, {
              type: 'deleteAnnotation',
              id,
            } as DeleteAnnotationAction)
          }

          return true
        },
      refreshAnnotation:
        () =>
        ({ dispatch, tr }) => {
          const transaction = tr.setMeta(AnnotationPluginKey, {
            type: 'createDecorations',
          })

          if (dispatch) {
            dispatch(transaction)
          }

          return true
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      AnnotationPlugin({
        HTMLAttributes: this.options.HTMLAttributes,
        map: getMapFromOptions(this.options),
        instance: this.options.instance,
      }),
    ]
  },
})
