import { ref } from 'vue'
import NavbarSave from './NavbarSave.vue'

export default {
  title: 'Settings/Navbar',
}

export const Save = (args) => ({
  components: { NavbarSave },
  setup() {
    const show = ref(true)
    function onDiscard() {
      show.value = false
      console.log('click Discard')
    }
    function onSave() {
      show.value = false
      console.log('click Save')
    }
    return {
      args,
      show,
      onDiscard,
      onSave,
    }
  },
  template: '<NavbarSave :show="show" @onDiscard="onDiscard" @onSave="onSave" v-bind="args"></NavbarSave>',
})
