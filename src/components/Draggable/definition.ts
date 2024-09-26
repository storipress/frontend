import type { InjectionKey, UnwrapNestedRefs } from 'vue'
import type DraggableEntity from './DraggableEntity'

export interface DraggableComponentInfo {
  $el?: HTMLElement
  groupName?: string
  blockGroup?: string[]
  disabled?: { sorting: boolean; group: boolean }
  draggingInfo: {
    index?: number
    srcElement?: HTMLElement
    draggingItemTemplate?: string
    location?: [number, number]
    draggingItemContainer?: HTMLElement
  }
  dragIn: () => void
  dragOut: () => void
  dragMove: (point: Point) => void
  dropped?: () => void
  getHoverIndex: () => string | number | undefined
  setHoverIndex: (index: string | number) => void
  clearHoverIndex: () => void
  reset: () => void
}

export const key = Symbol('draggable-group') as InjectionKey<UnwrapNestedRefs<DraggableEntity>>

export interface Point {
  x: number
  y: number
}
