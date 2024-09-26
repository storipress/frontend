import { PluginKey } from 'prosemirror-state'
import type { AnnotationState } from './annotation-state'

export const AnnotationPluginKey = new PluginKey<AnnotationState>('annotation')
