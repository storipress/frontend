export interface DeskDataInterface {
  id: string
  name: string
  description: string
  slug: string
  desks?: DeskDataInterface[]
  desk?: DeskDataInterface
  order: number
}

export type EventClickDeskDataInterface = DeskDataInterface
export type EventClickAddSubdeskDataInterface = DeskDataInterface

export const DEFAULT_ITEM = {
  ALL: { id: 'ALL', name: 'All' },
  FEATURED: { id: 'FEATURED', name: 'Featured' },
  MY_ARTICLES: { id: 'MY_ARTICLES', name: 'My Articles' },
}

export const COMMON_DEFAULT = {
  description: '',
  order: -1,
  slug: '',
  desks: [],
  open_access: true,
}

export const FALLBACK_DEFAULT = {
  ...COMMON_DEFAULT,
  open_access: false,
}
