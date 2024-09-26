export interface EventClickTextDataInterface {
  text: string
  checked: boolean
}

export interface EventClickStepDataInterface extends EventClickTextDataInterface {
  index: number
  path: string
  key: string
}
