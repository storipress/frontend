import type { StyleTree } from '~/lib/dynamic-style'

export interface LayoutData {
  elements: Record<string, string>
  styles: StyleTree
}
