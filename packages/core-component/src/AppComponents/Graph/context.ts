import type { Ref } from 'vue'
import { warn } from 'vue'

export interface GraphContextInput {
  animation?: boolean
}

export interface GraphContext {
  animationEnd: Ref<boolean>
}

const [provideGraphContext, injectGraphContext_] = createInjectionState<[GraphContextInput], GraphContext>((props) => {
  return {
    animationEnd: ref(!props.animation),
  }
})

export { provideGraphContext }

export function injectGraphContext(): GraphContext {
  const context = injectGraphContext_()
  if (!context) {
    warn('GraphContext not found')
    return { animationEnd: ref(false) }
  }
  return context
}
