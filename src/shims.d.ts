import 'vue-router'
import type { SearchInputType } from '~/components/Navbar'
declare interface Window {
  // extend the window
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-router' {
  interface RouteMeta {
    searchPlaceholder?: string
    searchInputType?: SearchInputType
  }
}

// ref: https://github.com/microsoft/TypeScript/issues/46907
// TODO: remove this once TypeScript support it
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Intl {
    type ListType = 'conjunction' | 'disjunction'

    interface ListFormatOptions {
      localeMatcher?: 'lookup' | 'best fit'
      type?: ListType
      style?: 'long' | 'short' | 'narrow'
    }

    interface ListFormatPart {
      type: 'element' | 'literal'
      value: string
    }

    class ListFormat {
      constructor(locales?: string | string[], options?: ListFormatOptions)
      format(values: any[]): string
      formatToParts(values: any[]): ListFormatPart[]
      supportedLocalesOf(locales: string | string[], options?: ListFormatOptions): string[]
    }
  }

  interface Window {
    safari: any
  }

  interface Element {
    _iframeResize?: (rect: DOMRect) => void
  }
}
