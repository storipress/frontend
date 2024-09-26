import { Icon } from '@storipress/core-component'
import spLogo from '@storipress/core-component/assets/images/icons/settings/sp-logo-white.svg'
import Navbar from './index.vue'

export default {
  title: 'Settings/Navbar',
  component: Navbar,
}

export function PublicationSettings(args) {
  return {
    components: { Navbar, Icon },
    setup() {
      function onCloseNavbar() {
        console.log('onCloseNavbar')
      }
      return {
        args,
        onCloseNavbar,
      }
    },
    template:
      '<Navbar v-bind="args" @onCloseNavbar="onCloseNavbar"><Icon iconName="settings" class="text-[30px] text-[#4f4f4f]" /></Navbar>',
  }
}

export function UserSettings(args) {
  return {
    components: { Navbar },
    setup() {
      return {
        args,
        spLogo,
      }
    },
    template: '<Navbar v-bind="args"><img :src="spLogo"></Navbar>',
  }
}
