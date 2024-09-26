import type { Table } from '@tanstack/vue-table'
import { createColumnHelper, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { render } from '@testing-library/vue'
import { expect, it } from 'vitest'
import DataTable from './DataTable.vue'

interface User {
  id: number
  name: string
  age: number
}

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor('name', {
    header: 'Name',
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
]

it('can render table', () => {
  const table = useVueTable({
    data: [
      {
        id: 1,
        name: 'John',
        age: 20,
      },
    ],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { getByRole, getAllByRole } = render(DataTable, { props: { model: table as Table<unknown> } })

  expect(getByRole('table')).toBeInTheDocument()
  expect(getAllByRole('cell')).toHaveLength(3)
})
