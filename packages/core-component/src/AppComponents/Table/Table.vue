<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, ref } from 'vue'
import Checkbox from '../Checkbox/index.vue'
import Pagination from '../Pagination/Pagination.vue'
import type { SelectRowParam, SortByParam, TableColumn, TableData } from './definition'
import TableRoot from './TableRoot.vue'
import TableHead from './TableHead.vue'
import TableHeadRow from './TableHeadRow.vue'
import TableHeadCheckbox from './TableHeadCheckbox.vue'
import TableBody from './TableBody.vue'
import TableRow from './TableRow.vue'
import TableItem from './TableItem.vue'
import TableSortIcon from './TableSortIcon.vue'
import TableHeadItem from './TableHeadItem.vue'

defineOptions({
  name: 'SpTable',
})

const props = defineProps({
  rowKey: {
    type: String,
    required: true,
    default: 'id',
  },
  sortMap: {
    type: Object,
    default: () => ({}),
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => [],
  },
  data: {
    type: Array as PropType<TableData[]>,
    default: () => [],
  },
  pageItemQuantity: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  selectAll: []
  deselectAll: []
  selectRow: [SelectRowParam]
  deselectRow: [SelectRowParam]
  selected: [Set<string>]
  sortby: [SortByParam]
  itemClick: [number]
}>()

defineSlots<{
  [column: `column-${number}`]: () => void
  ['row-checkbox']: (props: {
    row: TableData
    rowIndex: number
    selectedRows: Set<string>
    handleClickSelectRow: (isChecked: boolean, row: TableData, index: number) => void
  }) => void
  [data: `data-${number}`]: (props: { column: TableColumn; row: TableData; rowIndex: number; colIndex: number }) => void
  tfoot: () => void
}>()

const selectedRows = ref(new Set<string>())
const isSelectedAll = computed(() => {
  return props.data.length > 0 && props.data.every((row) => selectedRows.value.has(row[props.rowKey]))
})
function handleClickSelectAll(isChecked: boolean) {
  if (isChecked) {
    props.data.forEach((row: TableData) => selectedRows.value.add(row[props.rowKey]))
    emit('selectAll')
  } else {
    selectedRows.value.clear()
    emit('deselectAll')
  }
  emit('selected', selectedRows.value)
}
function handleClickSelectRow(isChecked: boolean, row: TableData, index: number) {
  if (isChecked) {
    selectedRows.value.add(row[props.rowKey])
    emit('selectRow', { row, index })
  } else {
    selectedRows.value.delete(row[props.rowKey])
    emit('deselectRow', { row, index })
  }
  emit('selected', selectedRows.value)
}

function onClickSort({ column, sortby }: SortByParam) {
  emit('sortby', {
    column,
    sortby,
  })
}

function onItemClick(rowIndex: number) {
  emit('itemClick', rowIndex)
}

const pageLength = computed(() => {
  const dataLength = props.data?.length || 0
  if (props.pageItemQuantity <= 0 || dataLength <= 0) return 0
  return Math.ceil(dataLength / props.pageItemQuantity)
})
const currentPage = ref(1)
const pageData = computed(() => {
  if (props.pageItemQuantity <= 0) return props.data
  const start = (currentPage.value - 1) * props.pageItemQuantity
  const end = start + props.pageItemQuantity
  return props.data?.slice(start, end)
})
</script>

<template>
  <TableRoot>
    <TableHead>
      <TableHeadRow>
        <TableHeadCheckbox v-if="selectable" :model-value="isSelectedAll" @update:model-value="handleClickSelectAll" />
        <TableHeadItem
          v-for="(column, index) in columns"
          :key="index"
          :sortable="column.sortable"
          @click="
            onClickSort({
              column,
              sortby: sortMap[column.key] === 'ASC' ? 'DESC' : 'ASC',
            })
          "
        >
          <slot :name="`column-${index}`">
            <span>{{ column.title }}</span>
            <TableSortIcon v-if="column.sortable" :is-desc="sortMap[column.key] !== 'ASC'" />
          </slot>
        </TableHeadItem>
      </TableHeadRow>
    </TableHead>
    <TableBody>
      <TableRow v-for="(row, rowIndex) in pageData" :key="rowIndex" @click="onItemClick(rowIndex)">
        <slot name="row-checkbox" v-bind="{ row, rowIndex, selectedRows, handleClickSelectRow }">
          <td v-if="selectable" class="px-4">
            <Checkbox
              :model-value="selectedRows.has(row[rowKey])"
              @update:model-value="(isChecked: boolean) => handleClickSelectRow(isChecked, row, rowIndex)"
              @click.stop
            />
          </td>
        </slot>
        <TableItem v-for="(column, colIndex) in columns" :key="colIndex">
          <slot :name="`data-${colIndex}`" v-bind="{ column, row, rowIndex, colIndex }">
            {{ row[column.key] }}
          </slot>
        </TableItem>
      </TableRow>
    </TableBody>
    <slot name="tfoot">
      <tfoot v-if="Boolean(pageItemQuantity) && Boolean(data?.length)">
        <tr>
          <td :colspan="(columns?.length ?? 1) + 1">
            <div class="flex items-center bg-white px-8 py-[0.813rem]">
              <p class="text-body text-stone-600">
                Showing
                <span class="font-bold">
                  {{ (currentPage - 1) * pageItemQuantity + 1 }}
                </span>
                to
                <span class="font-bold">
                  {{ currentPage === pageLength ? data?.length : currentPage * pageItemQuantity }}
                </span>
                of
                <span class="font-bold">{{ data?.length }}</span>
                results
              </p>
              <div class="flex-1" />
              <Pagination v-model="currentPage" :page-length="pageLength" />
            </div>
          </td>
        </tr>
      </tfoot>
    </slot>
  </TableRoot>
</template>
