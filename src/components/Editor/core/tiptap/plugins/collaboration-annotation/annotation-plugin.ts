import { Plugin } from 'prosemirror-state'
import type * as Y from 'yjs'

import { AnnotationState } from './annotation-state'
import { AnnotationPluginKey } from './key'

export interface AnnotationPluginOptions {
  HTMLAttributes: Record<string, any>
  map: Y.Map<any>
  instance: string
}

export function AnnotationPlugin(options: AnnotationPluginOptions) {
  return new Plugin({
    key: AnnotationPluginKey,

    state: {
      init() {
        return new AnnotationState({
          HTMLAttributes: options.HTMLAttributes,
          map: options.map,
          instance: options.instance,
        })
      },
      apply(transaction, pluginState, oldState, newState) {
        return pluginState.apply(transaction, newState)
      },
    },

    props: {
      decorations(state) {
        const { decorations } = this.getState(state)
        const { selection } = state

        if (!selection.empty) {
          return decorations
        }

        return decorations
      },
    },
  })
}
