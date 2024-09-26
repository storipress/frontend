import { Icon } from '@storipress/core-component'
import Sidebar from './index.vue'

export default {
  title: 'Settings/Sidebar',
  component: Sidebar,
}

export function Default(args) {
  return {
    components: { Sidebar, Icon },
    setup() {
      const navigation = [
        { name: 'Publication details', icon: 'publication', path: '/' },
        { name: 'Team', icon: 'team', path: 'team' },
        { name: 'Integrations', icon: 'integrations', path: 'integrations' },
        { name: 'Domains', icon: 'web', path: 'domains' },
      ]

      return {
        navigation,
        args,
      }
    },
    template: `
  <Sidebar class="mr-8 w-72 min-w-[18rem]" :list="navigation">
    <div class="text-body mb-0.5 text-stone-800">Site Owner</div>
    <div class="flex items-center">
      <div class="text-display-small text-stone-600">New York Times</div>
      <Icon
        icon-name="goto-url"
        class="ml-3 cursor-pointer text-[14px] text-stone-600"
      />
    </div>
  </Sidebar>`,
  }
}
