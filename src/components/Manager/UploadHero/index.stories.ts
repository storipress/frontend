import type { Story } from '@storybook/vue3'
import { UnsplashPicker } from '../../Editor/unsplash-picker'
import { createUnsplashClient } from '../PhotoCard/unsplash'
import UploadHero from './index'
import type { DialogInfo } from '~/modules/editor/remote-dialog'
import { useRemoteDialog } from '~/modules/editor/remote-dialog/composite'

interface UnsplashPhoto {
  src: string
  alt: string
  title: string
}
type UnsplashDialogInfo = DialogInfo<'unsplash', true, UnsplashPhoto>

export default {
  title: 'Manager/Editor/UploadHero',
  layout: 'fullscreen',
}

const Template: Story = (args) => ({
  components: { UploadHero, UnsplashPicker },
  template: `
    <div>
      <UploadHero v-bind="args" />
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
  coverUrl: '',
  coverAlt: '',
  addCover: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('https://i.pravatar.cc/150?img=3')
      }, 2000)
    })
  },
  callUnsplash: async () => {
    const { open } = useRemoteDialog<UnsplashDialogInfo>('unsplash')
    const res = await open(true)
    return res
  },
  removeCover: () => {},
  updateCoverAlt: () => {},
}

export const Uploaded = Template.bind({})
Uploaded.args = {
  coverUrl: 'https://i.pravatar.cc/150?img=3',
  coverAlt: '',
  addCover: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('https://i.pravatar.cc/150?img=3')
      }, 2000)
    })
  },
  callUnsplash: async () => {
    const { open } = useRemoteDialog<UnsplashDialogInfo>('unsplash')
    const res = await open(true)
    return res
  },
  removeCover: () => {},
  updateCoverAlt: () => {},
}
