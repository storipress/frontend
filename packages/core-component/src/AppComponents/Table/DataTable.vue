<script setup lang="ts" generic="TData">
import type { Column, Table } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import TableRoot from './TableRoot.vue'
import TableHead from './TableHead.vue'
import TableHeadRow from './TableHeadRow.vue'
import TableBody from './TableBody.vue'
import TableRow from './TableRow.vue'
import TableItem from './TableItem.vue'
import TableSortIcon from './TableSortIcon.vue'
import TableHeadItem from './TableHeadItem.vue'

withDefaults(
  defineProps<{
    model: Table<TData>
    clickable?: boolean
  }>(),
  { clickable: false },
)

defineEmits<{
  itemClick: [number]
}>()

function toggleSorting(column: Column<TData>) {
  if (column.columnDef.enableSorting) {
    column.toggleSorting(column.getIsSorted() === 'asc')
  }
}
</script>

<template>
  <TableRoot>
    <TableHead>
      <TableHeadRow>
        <TableHeadItem
          v-for="(header, index) in model.getFlatHeaders()"
          :key="index"
          :sortable="header.column.columnDef.enableSorting"
          @click="toggleSorting(header.column)"
        >
          <slot :name="`column-${index}`">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
            <TableSortIcon
              v-if="header.column.columnDef.enableSorting"
              :is-desc="header.column.getIsSorted() !== 'asc'"
            />
          </slot>
        </TableHeadItem>
      </TableHeadRow>
    </TableHead>
    <TableBody>
      <TableRow
        v-for="(row, rowIndex) in model.getRowModel().rows"
        :key="rowIndex"
        :class="{ 'cursor-pointer': clickable }"
        @click="$emit('itemClick', rowIndex)"
      >
        <TableItem v-for="(cell, colIndex) in row.getVisibleCells()" :key="colIndex">
          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
        </TableItem>
      </TableRow>
    </TableBody>
    <slot name="tfoot" />
  </TableRoot>
</template>
