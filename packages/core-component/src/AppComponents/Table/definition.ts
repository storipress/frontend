// skipcq: JS-0323
export type TableData = Record<string, any>

export interface TableColumn {
  key: string
  title?: string
  sortable?: boolean
}

export type SortBy = 'ASC' | 'DESC'

export interface SelectRowParam {
  row: TableData
  index: number
}

export interface SortByParam {
  column: TableColumn
  sortby: SortBy
}
