import { defineComponent, reactive } from 'vue'
import { key } from './definition'
import DraggableEntity from './DraggableEntity'

export default defineComponent({
  setup() {
    provide(key, reactive(new DraggableEntity()))
  },
  render() {
    return this.$slots.default?.()
  },
})
