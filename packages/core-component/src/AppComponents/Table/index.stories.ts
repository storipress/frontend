import { computed, ref } from 'vue'
import Dropdowns from '../Dropdowns/Dropdowns.vue'
import MenuItem from '../MenuItem/index.vue'
import Icon from '../Icon/index.vue'
import { generateMembersData } from './utils'
import Avatar from './Avatar.vue'
import MyTable from './Table.vue'

export default {
  title: 'App Components/Table',
  component: MyTable,
}

export function HeaderRow(args) {
  return {
    components: { MyTable, Avatar, Dropdowns, MenuItem },
    setup() {
      const members = [
        {
          id: '0',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
          name: 'Jane Cooper',
          status: 'Active',
          role: 'Site Owner',
          desks: ['All'],
        },
        {
          id: '1',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
          name: 'Jessica Nacci',
          status: 'Active',
          role: 'Editor (Admin)',
          desks: ['All'],
        },
        {
          id: '2',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
          name: 'Alex Cheng',
          status: 'Active',
          role: 'Author',
          desks: ['Opinion', 'Business', 'Politics'],
        },
        {
          id: '3',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
          name: 'Amanda Phar',
          status: 'Invited',
          role: 'Author',
          desks: ['World News', 'Business'],
        },
        {
          id: '4',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
          name: 'Chris Dartmouth',
          status: 'Suspended',
          role: 'Contributor',
          desks: ['Politics'],
        },
      ]

      const columnsInfo = [
        { key: 'name', title: 'Name', sortable: true },
        { key: 'status', title: 'Status', sortable: true },
        { key: 'role', title: 'Role', sortable: true },
        { key: 'desks', title: 'Desks', sortable: true },
        { key: 'extra' },
      ]

      const desksResult = computed(() => (desks) => {
        return desks.join(', ')
      })

      const statusColor = computed(() => (row) => {
        let result = ''
        switch (row.status) {
          case 'Active':
            result = 'text-emerald-700'
            break
          case 'Invited':
            result = 'text-sky-700'
            break
          case 'Suspended':
            result = 'text-stone-400'
            break
        }
        return result
      })
      const sortMap = ref({})
      function sortby({ column, sortby }) {
        sortMap.value = { [column.key]: sortby }
      }
      return {
        args,
        statusColor,
        members,
        columnsInfo,
        desksResult,
        sortMap,
        sortby,
      }
    },
    template: `
  <my-table selectable v-bind="args" :columns="columnsInfo" :data="members" :sort-map="sortMap" @sortby="sortby">
    <template v-slot:data-0="{ row, column }">
      <div
        class="flex items-center"
      >
        <Avatar :src="row.avatar" classSize="w-6 h-6" />
        <span class="text-stone-800 ml-3">{{row.name}}</span>
      </div>
    </template>
    <template v-slot:data-1="{ row, column }">
      <div
        :class="statusColor(row)"
      >
        {{ row.status }}
      </div>
    </template>
    <template v-slot:data-3="{ row, column }">
      <div>
        {{ desksResult(row[column.key]) }}
      </div>
    </template>
    <template v-slot:data-4="{ row, column, rowIndex }">
      <Dropdowns placement="left">
        <MenuItem>Remove from list</MenuItem>
      </Dropdowns>
    </template>
  </my-table>
  `,
  }
}

export function HeaderRow6(args) {
  return {
    components: { MyTable, Avatar, Dropdowns, MenuItem, Icon },
    setup() {
      const members = [
        {
          id: '0',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
          subscriber: 'ann.cooper@example.com',
          subscriptionType: 'Free',
          activity: 1,
          subscriptionDate: 'December 4th, 2021',
          revenue: 'US$24.00',
        },
        {
          id: '1',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
          subscriber: 'jane.cooper@example.com',
          subscriptionType: 'Free',
          activity: 3,
          subscriptionDate: 'December 4th, 2021',
          revenue: 'US$24.00',
        },
        {
          id: '2',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
          subscriber: 'sid.cooper@example.com',
          subscriptionType: 'Free',
          activity: 5,
          subscriptionDate: 'December 4th, 2021',
          revenue: 'US$24.00',
        },
        {
          id: '3',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
          subscriber: 'david.cooper@example.com',
          subscriptionType: 'Free',
          activity: 4,
          subscriptionDate: 'December 4th, 2021',
          revenue: 'US$24.00',
        },
        {
          id: '4',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
          subscriber: 'zoe.cooper@example.com',
          subscriptionType: 'Free',
          activity: 3,
          subscriptionDate: 'December 4th, 2021',
          revenue: 'US$24.00',
        },
      ]

      const columnsInfo = [
        {
          key: 'subscriber',
          title: 'Subscriber',
          sortable: true,
        },
        {
          key: 'subscriptionType',
          title: 'Subscription type',
          sortable: true,
        },
        {
          key: 'activity',
          title: 'Activity',
          sortable: true,
        },
        {
          key: 'subscriptionDate',
          title: 'Subscription date',
          sortable: true,
        },
        { key: 'revenue', title: 'Revenue', sortable: true },
        { key: 'extra' },
      ]

      const sortMap = ref({})
      function sortby({ column, sortby }) {
        sortMap.value = { [column.key]: sortby }
      }
      return { args, members, columnsInfo, sortMap, sortby }
    },
    template: `
  <my-table selectable v-bind="args" :columns="columnsInfo" :data="members" :sort-map="sortMap" @sortby="sortby">
    <template v-slot:data-0="{ row, column }">
      <div
        class="flex items-center w-max"
      >
        <Avatar :src="row.avatar" classSize="w-6 h-6" />
        <span class="text-stone-800 ml-3">{{row.subscriber}}</span>
      </div>
    </template>
    <template v-slot:data-2="{ row, column, rowIndex }">
      <Icon v-for="(val, index) in row.activity" iconName="star" class="text-[1rem] text-yellow-500 mr-0.5" />
      <Icon
        v-for="(val, index) in (5 - row.activity)"
        iconName="star_outline"
        class="text-[1rem] text-yellow-500 mr-0.5"
      />
    </template>
    <template v-slot:data-5="{ row, column, rowIndex }">
      <Dropdowns placement="left">
        <MenuItem>Remove from list</MenuItem>
      </Dropdowns>
    </template>
  </my-table>
  `,
  }
}

export function TableHasPagination(args) {
  return {
    components: { MyTable, Avatar, Dropdowns, MenuItem, Icon },
    setup() {
      const members = generateMembersData(299)

      const columnsInfo = [
        {
          key: 'subscriber',
          title: 'Subscriber',
          sortable: true,
        },
        {
          key: 'subscriptionType',
          title: 'Subscription type',
          sortable: true,
        },
        {
          key: 'activity',
          title: 'Activity',
          sortable: true,
        },
        {
          key: 'subscriptionDate',
          title: 'Subscription date',
          sortable: true,
        },
        { key: 'revenue', title: 'Revenue', sortable: true },
        { key: 'extra' },
      ]

      const sortMap = ref({})
      function sortby({ column, sortby }) {
        sortMap.value = { [column.key]: sortby }
      }
      return { args, members, columnsInfo, sortMap, sortby }
    },
    template: /* html */ `
  <my-table selectable v-bind="args" :columns="columnsInfo" :data="members" :sort-map="sortMap" @sortby="sortby">
    <template v-slot:data-0="{ row, column }">
      <div
        class="flex items-center w-max"
      >
        <Avatar :src="row.avatar" classSize="w-6 h-6" />
        <span class="text-stone-800 ml-3">{{row.subscriber}}</span>
      </div>
    </template>
    <template v-slot:data-2="{ row, column, rowIndex }">
      <Icon v-for="(val, index) in row.activity" iconName="star" class="text-[1rem] text-yellow-500 mr-0.5" />
      <Icon
        v-for="(val, index) in (5 - row.activity)"
        iconName="star_outline"
        class="text-[1rem] text-yellow-500 mr-0.5"
      />
    </template>
    <template v-slot:data-5="{ row, column, rowIndex }">
      <Dropdowns placement="left">
        <MenuItem>Remove from list</MenuItem>
      </Dropdowns>
    </template>
  </my-table>
  `,
  }
}
TableHasPagination.args = { pageItemQuantity: 20 }
