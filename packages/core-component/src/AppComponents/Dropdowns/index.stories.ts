import SubMenu from '../SubMenu/index.vue'
import MenuItem from '../MenuItem/index.vue'
import Icon from '../Icon/index.vue'
import MyDropdown from './Dropdowns.vue'

export default {
  title: 'App Components/Dropdowns',
  component: MyDropdown,
  argTypes: {},
}

function Template(args) {
  return {
    components: { MyDropdown, SubMenu, MenuItem },
    setup() {
      return { args }
    },
    template: `
  <my-dropdown v-bind="args" placement="bottom-start">
    <SubMenu title="Sort">
      <MenuItem>Date created (newest first)</MenuItem>
      <MenuItem>Date created (oldest first)</MenuItem>
      <MenuItem>Article name (a-z)</MenuItem>
      <MenuItem>Article name (z-a)</MenuItem>
    </SubMenu>
    <MenuItem>Add stage</MenuItem>
    <MenuItem>Rename stage</MenuItem>
    <MenuItem>Delete stage</MenuItem>
  </my-dropdown>
  `,
  }
}

export const Horizontal = Template.bind({})
Horizontal.args = {}

export const Vertical = Template.bind({})
Vertical.args = {
  isVertical: true,
}

export function WithIcon(args) {
  return {
    components: { MyDropdown, SubMenu, MenuItem, Icon },
    setup() {
      return { args }
    },
    template: `
  <my-dropdown v-bind="args" placement="bottom-start">
    <MenuItem>
      <Icon iconName="arrow_right" class="mr-2.5" />Help articles + tutorials
    </MenuItem>
    <MenuItem>
      <Icon iconName="comment" class="mr-2.5" />Live support chat
    </MenuItem>
  </my-dropdown>
  `,
  }
}

export function SamePadding(args) {
  return {
    components: { MyDropdown, SubMenu, MenuItem, Icon },
    setup() {
      return { args }
    },
    template: `
  <my-dropdown v-bind="args" placement="bottom-start">
    <MenuItem class="pr-4">
      <Icon iconName="arrow_right" class="mr-2.5" />Help articles + tutorials
    </MenuItem>
    <MenuItem class="pr-4">
      <Icon iconName="comment" class="mr-2.5" />Live support chat
    </MenuItem>
  </my-dropdown>
  `,
  }
}

export function MultiLevel(args) {
  return {
    components: { MyDropdown, SubMenu, MenuItem },
    setup() {
      return { args }
    },
    template: `
  <my-dropdown v-bind="args" placement="bottom-start">
    <SubMenu title="Sort">
      <MenuItem>Date created (newest first)</MenuItem>
      <MenuItem>Date created (oldest first)</MenuItem>
      <MenuItem>Article name (a-z)</MenuItem>
      <MenuItem>Article name (z-a)</MenuItem>
      <SubMenu title="Multi">
        <MenuItem>Multi 1</MenuItem>
        <MenuItem>Multi 2</MenuItem>
      </SubMenu>
    </SubMenu>
    <MenuItem>Add stage</MenuItem>
    <MenuItem>Rename stage</MenuItem>
    <MenuItem>Delete stage</MenuItem>
  </my-dropdown>
  `,
  }
}
