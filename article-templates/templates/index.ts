import type { Component } from 'vue'

import Item1 from './source/article-basically-one/block/index.js'
import preview1 from './source/article-basically-one/preview.webp'
import Item2 from './source/article-the-cut-one/block/index.js'
import preview2 from './source/article-the-cut-one/preview.webp'
import Item0 from './source/Gen-Zine-1/block/index.js'
import preview0 from './source/Gen-Zine-1/preview.webp'
import Item3 from './source/gen-zine-2/block/index.js'
import preview3 from './source/gen-zine-2/preview.webp'
import Item4 from './source/minimalistic/block/index.js'
import preview4 from './source/minimalistic/preview.webp'
import Item5 from './source/minimalistic-no-hero/block/index.js'
import preview5 from './source/minimalistic-no-hero/preview.webp'
import Item6 from './source/nytmag-1/block/index.js'
import preview6 from './source/nytmag-1/preview.webp'
import Item7 from './source/nytmag-2/block/index.js'
import preview7 from './source/nytmag-2/preview.webp'
import Item8 from './source/the-outline-1/block/index.js'
import preview8 from './source/the-outline-1/preview.webp'
import Item9 from './source/the-outline-2/block/index.js'
import preview9 from './source/the-outline-2/preview.webp'
import Item10 from './source/wired-1/block/index.js'
import preview10 from './source/wired-1/preview.webp'

export interface ItemDescriptor {
  name: string
  component: Component
  preview: string | null
}

export { DEFAULT_TEMPLATE, Fallback } from './fallback'

export const TEMPLATE_MAP: Record<string, Component> = {
  'Gen-Zine-1': Item0,
  'basically-one': Item1,
  'the-cut-one': Item2,
  'gen-zine-2': Item3,
  minimalistic: Item4,
  'minimalistic-no-hero': Item5,
  'nytmag-1': Item6,
  'nytmag-2': Item7,
  'the-outline-1': Item8,
  'the-outline-2': Item9,
  'wired-1': Item10,
}

export const PREVIEW_MAP: Record<string, string> = {
  'Gen-Zine-1': preview0,
  'basically-one': preview1,
  'the-cut-one': preview2,
  'gen-zine-2': preview3,
  minimalistic: preview4,
  'minimalistic-no-hero': preview5,
  'nytmag-1': preview6,
  'nytmag-2': preview7,
  'the-outline-1': preview8,
  'the-outline-2': preview9,
  'wired-1': preview10,
}
