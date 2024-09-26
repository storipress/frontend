import type { InjectionKey, Ref } from 'vue'
import { watchPostEffect } from 'vue'
import { sortBy } from 'lodash-es'
import { useFocus } from '@vueuse/core'
import invariant from 'tiny-invariant'

interface Focusable {
  focused: Ref<boolean>
  order: number
}
interface FocusLoopOptions {
  repeat?: boolean
}

interface FocusLoopState {
  nextOrder: number
  focusable: Focusable[]
}

interface FocusLoopApi {
  options: FocusLoopOptions
  state: FocusLoopState
  addFocusable(focused: Ref<boolean>, order?: number): Focusable
  focusNext(focusable: Focusable): void
}

const FOCUS_LOOP_KEY: InjectionKey<FocusLoopApi> = Symbol('focus-loop')

export function useFocusLoopProvider(options?: FocusLoopOptions) {
  const state: FocusLoopState = {
    focusable: [],
    nextOrder: 0,
  }

  const api = {
    options,
    state,
    addFocusable(focused: Ref<boolean>, order = state.nextOrder) {
      if (order >= state.nextOrder) {
        state.nextOrder = order + 1
      }

      const focusable: Focusable = {
        focused,
        order,
      }
      state.focusable = sortBy([...state.focusable, focusable], ({ order }) => order)

      return focusable
    },
    focusNext(key: Focusable) {
      const index = state.focusable.indexOf(key)
      const next: Focusable | undefined =
        state.focusable[index + 1] || (options?.repeat ? state.focusable[0] : undefined)
      if (next) {
        next.focused.value = true
      }
    },
  }

  provide(FOCUS_LOOP_KEY, api)
}

export function useFocusLoop(target: Ref<HTMLElement | undefined>, order?: number) {
  const api = inject(FOCUS_LOOP_KEY)
  invariant(api, 'no focus loop api')

  const { focused } = useFocus(target)

  let key: Focusable | undefined

  watchPostEffect(() => {
    if (target.value) {
      key = api.addFocusable(focused, order)
    } else if (key) {
      api.state.focusable = api.state.focusable.filter((focusable) => focusable !== key)
    }
  })

  return {
    focused,
    focusNext() {
      if (!key) {
        return
      }

      api.focusNext(key)
    },
  }
}
