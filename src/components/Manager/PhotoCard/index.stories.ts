import type { Story } from '@storybook/vue3'
import { UnsplashPicker } from '../../Editor/unsplash-picker'
import { createUnsplashClient } from './unsplash'
import PhotoCard from './index'
import type { DialogInfo } from '~/modules/editor/remote-dialog'
import { useRemoteDialog } from '~/modules/editor/remote-dialog/composite'

interface UnsplashPhoto {
  src: string
  alt: string
  title: string
}
type UnsplashDialogInfo = DialogInfo<'unsplash', true, UnsplashPhoto>

export default {
  title: 'Manager/Editor/components/PhotoCard',
  layout: 'fullscreen',
}

const Template: Story = (args) => ({
  components: { PhotoCard, UnsplashPicker },
  template: `
    <div class="m-10">
      <PhotoCard v-bind="args"  />
      <UnsplashPicker :client="client" />
    </div>
  `,
  setup() {
    const client = createUnsplashClient('')
    return {
      args,
      client,
    }
  },
})
export const Empty = Template.bind({})
Empty.args = {
  img: '',
  alt: '',
  caption: '',
  uploadImg: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('https://i.pravatar.cc/150?img=3')
      }, 2000)
    })
  },
  removeImg: () => {},
  callUnsplash: async () => {
    const { open } = useRemoteDialog<UnsplashDialogInfo>('unsplash')
    const res = await open(true)
    return res
  },
  updateAlt: () => {},
  updateCaption: () => {},
}

export const Uploaded = Template.bind({})
Uploaded.args = {
  img: 'https://i.pravatar.cc/150?img=3',
  alt: '',
  caption: '',
  uploadImg: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('https://i.pravatar.cc/150?img=3')
      }, 2000)
    })
  },
  removeImg: () => {},
  callUnsplash: async () => {
    const { open } = useRemoteDialog<UnsplashDialogInfo>('unsplash')
    const res = await open(true)
    return res
  },
  updateAlt: () => {},
  updateCaption: () => {},
}
