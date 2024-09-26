import type { Ref } from 'vue'
import type { MemberDataInterface } from '../pages/[clientID]/preferences/publication/team/definition'

interface Data {
  [key: string]: any
}
interface Column {
  key: string
  title?: string
  sortable?: boolean
}
interface onClickSortParams {
  column: Column
  sortby: 'ASC' | 'DESC'
}

type Sorter = (previous: Data, next: Data, key: string) => number

export function useSort(
  data: Ref<Data[]>,
  { sortRule, defaultSorter = _defaultSorter }: { sortRule?: Record<string, any>; defaultSorter?: Sorter },
) {
  const sortMap = ref<Record<string, 'ASC' | 'DESC'>>({})

  const sortby = ({ column, sortby }: onClickSortParams) => {
    const key: string = column.key
    sortMap.value = { [key]: sortby }
    data.value = data.value.sort((a, b) => {
      return (sortRule?.[key] || defaultSorter)(a, b, key)
    })
    if (sortby === 'DESC') {
      data.value = data.value.reverse()
    }
  }
  return {
    sortMap,
    sortby,
  }
}

function _defaultSorter(previous: Data, next: Data, key: string) {
  return previous[key].localeCompare(next[key])
}

export function desksSorter(previous: Data, next: Data, key: string) {
  return previous[key].join('|').localeCompare(next[key].join('|'))
}

export function roleSorter(previous: MemberDataInterface, next: MemberDataInterface) {
  const roleMap: Record<string, number> = {
    owner: 5,
    admin: 10,
    editor: 15,
    author: 20,
    contributor: 25,
  }
  if (Boolean(previous.suspended) === Boolean(next.suspended)) {
    return roleMap[previous.role] - roleMap[next.role]
  } else if (previous.suspended) {
    return 1
  } else {
    return -1
  }
}
