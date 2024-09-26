import type { Ref } from 'vue'
import { computed, ref } from 'vue'

export interface Rect {
  left: number
  right: number
  top: number
  bottom: number
}

export interface ElementDescriptor {
  kind: string
  rect: Rect
}

export type PseudoElement = ($el: Element, pos?: { x: number; y: number }) => ElementDescriptor | undefined

export interface PseudoElementProps {
  pseudoElements: PseudoElement[]
}

export interface UsePseudoElementInput {
  props: PseudoElementProps
  editable: Ref<boolean>
  setHover: () => void
  updateStore: (type: 'hover', payload: string) => void
}

export function usePseudoElement({ props, editable, setHover, updateStore }: UsePseudoElementInput) {
  const root = ref<HTMLElement>()
  const rect = ref<Rect | null>(null)
  const pseudo = ref<string | null>(null)

  const hasPseudoElement = computed(() => {
    if (editable.value) {
      return false
    }

    return props.pseudoElements.length > 0
  })

  function findPseudoElement(event: MouseEvent): string | undefined {
    const res = runPseudoElementPredicates({ x: event.offsetX, y: event.offsetY })
    if (!res) {
      return
    }
    rect.value = res.rect
    pseudo.value = res.kind
    return res.kind
  }

  function runPseudoElementPredicates(pos: { x: number; y: number }): ElementDescriptor | undefined {
    for (const predicate of props.pseudoElements) {
      const descriptor = predicate(root.value as Element, pos)
      if (descriptor) {
        return descriptor
      }
    }
  }

  return {
    root,
    rect,
    pseudo,
    findPseudoElement,
    hasPseudoElement,
    refreshRect: () => {
      if (props.pseudoElements.length === 0 || !pseudo.value || !root.value) {
        return
      }

      for (const fn of props.pseudoElements) {
        const descriptor = fn(root.value as Element)
        if (descriptor?.kind === pseudo.value) {
          rect.value = descriptor.rect
          return
        }
      }
    },
    listeners: computed(() => {
      return hasPseudoElement.value
        ? {
            mousemove: (event: MouseEvent) => {
              const name = findPseudoElement(event)
              if (name) {
                updateStore('hover', name)
              } else {
                setHover()
              }
            },
          }
        : {}
    }),
  }
}
