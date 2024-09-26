import type { Ref } from 'vue'
import { inject, ref } from 'vue'

export interface Site {
  name: string
  facebook?: null | string
  twitter?: null | string
}

export interface CommonInjected {
  site: Site
  logo: string
  scale: number
}

const INJECTED_DEFAULT: CommonInjected = {
  site: {
    name: '',
  },
  logo: '',
  scale: 1,
}

export function useElement(): Ref<CommonInjected> {
  return ref(inject('$element', INJECTED_DEFAULT))
}
