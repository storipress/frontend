export interface DeskInterface {
  id: string
  name: string
  description?: string | null | undefined
  desks?: DeskInterface[]
}

export interface EventSubmitDataInterface {
  id: string
  name: string
  description: string
  parentId: string
}
