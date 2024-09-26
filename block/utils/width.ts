import { isObject } from 'lodash'
import type { Breakpoint } from '~/lib/dynamic-style'

export const SPACING_PATH = ['spacing']

export function normalizeWidth(width: number | string | Record<string, unknown>): Breakpoint {
  if (isObject(width)) {
    return { xs: 'auto', ...width } as Breakpoint
  }

  return {
    xs: width,
  }
}
