import type { Story } from '@storybook/vue3'
import PhotoMenu from './index'

export default {
  title: 'Manager/Editor/components/PhotoMenu',
  layout: 'fullscreen',
}

const Template: Story = (args) => ({
  components: { PhotoMenu },
  template: `
    <div>
      <PhotoMenu v-bind="args" />
    </div>
  `,
  setup() {
    return {
      args,
    }
  },
})
export const Uploaded = Template.bind({})
Uploaded.args = {
  buttonArray: [
    {
      prefix: 'hero',
      iconName: 'add_image',
      description: 'Upload from computer',
      isUpload: true,
      onClick: () => {},
    },
    {
      prefix: 'hero',
      iconName: 'unsplash',
      description: 'Select from Unsplash',
      onClick: () => {},
    },
    {
      prefix: 'hero',
      iconName: 'delete',
      description: 'Remove photo',
      onClick: () => {},
    },
  ],
}

export const BeforeUpload = Template.bind({})
BeforeUpload.args = {
  prefix: 'hero',
  buttonArray: [
    {
      iconName: 'add_image',
      description: 'Upload from computer',
      isUpload: true,
      onClick: () => {},
    },
    {
      iconName: 'unsplash',
      description: 'Select from Unsplash',
      onClick: () => {},
    },
  ],
}
