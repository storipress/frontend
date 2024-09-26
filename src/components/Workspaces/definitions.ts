export interface TabDataInterface {
  name: string
  tabKey: string | number
  count: number
}

export const key = Symbol('current-tab')
