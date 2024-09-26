import type { Story } from '@storybook/vue3'
import UploadHero from './index'

export default {
  title: 'Manager/Editor/UploadImage',
  layout: 'fullscreen',
}

const Template: Story = (args) => ({
  components: { UploadHero },
  template: `
    <div>
      <UploadHero v-bind="args" />
    </div>
  `,
  setup() {
    return {
      args,
    }
  },
})
export const Empty = Template.bind({})
Empty.args = {
  imageUrl: '',
  imageAlt: '',
  onUploadImage: () => {},
  onRemoveImage: () => {},
}

export const Uploaded = Template.bind({})
Uploaded.args = {
  imageUrl: 'https://i.pravatar.cc/150?img=3',
  imageAlt: '',
  onUploadImage: () => {},
  onRemoveImage: () => {},
}
