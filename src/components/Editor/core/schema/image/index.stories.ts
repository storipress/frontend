import { h } from 'vue'
import { createStoryComponent } from '../story-helper'
import { Image } from './index'
import { clientID } from '~/components/Editor/core/client'

const ImageView = createStoryComponent(Image)

export default {
  title: 'EditorCore/Schema/Image',
  component: ImageView,
}

export function Default() {
  return {
    setup: () => () => h(ImageView, { attrs: { src: 'https://picsum.photos/seed/picsum/200/300' } }),
  }
}

export function UseUnsplash() {
  return {
    setup: () => () => h(ImageView, { attrs: { provider: 'unsplash', cid: clientID } }),
  }
}
