export interface TCreatePaginationProps {
  pagesLength: number
  onChange: (pages: TPages) => void
  currentPage?: number
}

export interface TPages {
  currentPage: number
  pages: TPage[]
}

export interface TPage {
  action: TAction
  value: number | PaginatorControls
  isActive?: boolean
}

export enum PaginatorControls {
  Next = 'Next',
  Prev = 'Prev',
  Ellipsis = '...',
}

export type TPaginationMethods = keyof ReturnType<typeof createPagination>
export type TAction = Exclude<TPaginationMethods, 'setPagesLength'>

export default function createPagination({ pagesLength = 1, currentPage = 1, onChange }: TCreatePaginationProps) {
  const getPages = () => {
    if (pagesLength <= 0) {
      return {
        currentPage,
        pages: [] as TPage[],
      }
    }

    function getStartNumber() {
      if (currentPage - 2 <= 0) return 1
      const overNumber = currentPage + 2 - pagesLength
      if (overNumber > 0) return currentPage - 2 - overNumber
      return currentPage - 2
    }
    const startNumber = getStartNumber()

    const currentRange = Array.from({ length: 5 }, (_, index) => {
      const value = startNumber + index
      return { isActive: value === currentPage, action: 'setPage', value }
    }).filter(({ value }) => value >= 1 && value <= pagesLength)

    const firstOption = currentRange[0]?.value === 1 ? [] : [{ action: 'setPage', value: 1 }]

    const endOption =
      currentRange[currentRange.length - 1].value === pagesLength ? [] : [{ action: 'setPage', value: pagesLength }]

    const previousPageOption = [{ action: 'previousPage', value: PaginatorControls.Prev }]

    const nextPageOption = [{ action: 'nextPage', value: PaginatorControls.Next }]

    const getMoreOptions = (bool: boolean) =>
      bool ? [{ action: 'doNotThing', value: PaginatorControls.Ellipsis }] : []
    const currentRangeValue = Array.from(currentRange, ({ value }) => value)

    return {
      currentPage,
      pages: [
        ...previousPageOption,
        ...firstOption,
        ...getMoreOptions(Math.min(...currentRangeValue) > 1 + 1),
        ...currentRange,
        ...getMoreOptions(Math.max(...currentRangeValue) < pagesLength - 1),
        ...endOption,
        ...nextPageOption,
      ] as TPage[],
    }
  }

  const setPage = (n: number) => {
    currentPage = Number(n)
    const pages = getPages()
    onChange(pages)
    return pages
  }

  const setPagesLength = (newPagesLength: number, newCurrentPage: number) => {
    if (newPagesLength <= 0) return { currentPage, pages: [] as TPage[] }
    pagesLength = Number(newPagesLength)
    if (newCurrentPage) currentPage = newCurrentPage
    return getPages()
  }

  const getCurrentPage = () => currentPage

  const nextPage = () => setPage(currentPage + 1 > pagesLength ? pagesLength : currentPage + 1)

  const previousPage = () => setPage(currentPage - 1 < 1 ? 1 : currentPage - 1)

  const firstPage = () => setPage(1)

  const lastPage = () => setPage(pagesLength)

  const doNotThing = () => {}

  return {
    setPage,
    setPagesLength,
    getPages,
    getCurrentPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    doNotThing,
  }
}
