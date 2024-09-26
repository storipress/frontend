import type { Modifier } from '@popperjs/core'
import type { InjectionKey, Ref } from 'vue'
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { isNil, omitBy } from 'lodash'
import type { Instance, Placement } from 'tippy.js'
import createTippy from 'tippy.js'

export interface SetStyleInput {
  path: string[]
  data: Record<string, unknown>
  skipHistory?: boolean
  breakpoint?: string
}

export interface ColorPickerAPI {
  readStyle: (path: readonly string[]) => Record<string, unknown>
  setElementStyle: (input: SetStyleInput) => void
}

export interface Options {
  element: Readonly<Ref<ColorPickerAPI>>
  prefix: string
  backgroundColor?: string | Record<string, unknown>
  kind?: string
}

export const SINGLETON_LIST: InjectionKey<Instance[]> = Symbol('singleton_list')

export const decidePlacement: Modifier<'decidePlacement', unknown> = {
  name: 'decidePlacement',
  enabled: true,
  phase: 'main',
  fn: ({ state }) => {
    const { width, height } = state.rects.reference
    const placement: Placement = width < 50 || height < 50 ? 'bottom' : 'right-start'
    if (placement !== state.placement) {
      state.placement = placement
      state.reset = true
    }
  },
}

export function useColorPicker({ element, prefix, kind, backgroundColor }: Options) {
  const root = ref<HTMLElement>()
  const picker = ref<Vue & { hide: () => void }>()
  const path = kind ? [prefix, kind] : [prefix]
  let instances: Instance[]

  if (!kind) {
    // we are the top level color area
    instances = []
    provide(SINGLETON_LIST, instances)
  } else {
    instances = inject(SINGLETON_LIST, [])
  }

  function updateColor(color: string) {
    element.value.setElementStyle({
      path,
      data: omitBy(
        {
          backgroundColor: color,
        },
        isNil,
      ),
    })
  }

  const color = computed({
    get(): string {
      const bg = element.value.readStyle(path).backgroundColor
      if (bg === undefined) {
        return 'fff'
      }
      return bg as string
    },
    set: updateColor,
  })

  onMounted(() => {
    element.value.setElementStyle({
      path,
      data: omitBy(
        {
          backgroundColor,
        },
        isNil,
      ),
      skipHistory: true,
      breakpoint: 'xs',
    })

    const instance = createColorPickerTippy(root, picker, instances)

    watch(
      color,
      (color) => {
        if (color === null) {
          instance.disable()
        } else {
          instance.enable()
        }
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      const index = instances.indexOf(instance)
      if (index !== -1) {
        instances.splice(index, 1)
      }
      instance.destroy()
    })

    instances.push(instance)
  })

  return {
    root,
    picker,
    color,
  }
}

function createColorPickerTippy(
  root: Ref<HTMLElement | undefined>,
  picker: Ref<{ $el: Element; hide: () => void } | undefined>,
  instances: Instance[],
) {
  const instance = createTippy(root.value!, {
    content: picker.value!.$el,
    arrow: false,
    interactive: true,
    theme: 'none',
    placement: 'right-start',
    // set to mouseenter only to prevent it hangs at there after clicked as we disable hideOnClick
    trigger: 'mouseenter',
    // set to false to prevent it hide on click
    hideOnClick: false,
    interactiveDebounce: 100,
    offset({ placement, reference, popper }) {
      if (placement === 'bottom') {
        // we are display at a small icon
        return [0, 8]
      }

      // reverse because we add it to array on mounted and it will be reversed order
      const activeInstances = instances.filter((instance) => instance.state.isVisible).reverse()
      const selfIndex = activeInstances.indexOf(instance)
      // when we are not the first instance and we may cover on each other, we need to add the offset
      const extraDistance =
        selfIndex > 0 &&
        // reference does not have `top` and `left` properties
        reference.y - activeInstances[selfIndex - 1].popperInstance!.state.rects.reference.y < 32 &&
        reference.x - activeInstances[selfIndex - 1].popperInstance!.state.rects.reference.x < 32
          ? selfIndex * 36
          : 0
      if (popper.width >= reference.width + 32) {
        return [0, 0]
      }

      return [4 + extraDistance, -popper.width - 4]
    },
    popperOptions: {
      modifiers: [
        decidePlacement,
        {
          name: 'flip',
          enabled: false,
        },
      ],
    },
    onHide() {
      // eslint-disable-next-line scanjs-rules/call_hide
      picker.value!.hide()
    },
  })

  return instance
}
