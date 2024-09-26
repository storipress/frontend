// modify from https://github.com/scottcorgan/contrast/blob/master/index.js

import type { IroColorValue } from '@irojs/iro-core'
import { IroColor } from '@irojs/iro-core'

export function contrast(color: IroColorValue): 'dark' | 'light' {
  const { r, g, b, a = 1 } = new IroColor(color).rgba
  // transparent
  if (a === 0) {
    return 'light'
  }
  const o = Math.round((r * 299 + g * 587 + b * 114) / 1000)
  return o <= 100 ? 'dark' : 'light'
}
