import { h } from 'vue'
import { createStoryComponent } from '../story-helper'

// import { clientID } from '../../core/client'
import { Embed } from './index'

const EmbedView = createStoryComponent(Embed)

export default {
  title: 'EditorCore/Schema/HTML',
  component: EmbedView,
}

export function Default() {
  return {
    setup: () => () => h(EmbedView, { attrs: {}, class: 'w-80 ml-10' }),
  }
}
