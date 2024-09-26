import type { Story } from '@storybook/vue3'
import Navbar from './index'

export default {
  title: 'Manager/Editor/Navbar',
  layout: 'fullscreen',
  parameters: {
    featureFlags: ['members'],
  },
}

const Template: Story = (args) => ({
  components: { Navbar },
  template: `
    <div>
      <Navbar v-bind="args"/>
    </div>
  `,
  setup() {
    return {
      args,
    }
  },
})
export const Default = Template.bind({})
Default.args = {
  id: 19,
  avatars: [
    { src: 'https://i.pravatar.cc/150?img=3', name: 'test1', color: 'hsl(0, 100%, 50%)' },
    { src: 'https://i.pravatar.cc/150?img=4', name: 'test2', color: 'hsl(234, 100%, 50%)' },
    { src: 'https://i.pravatar.cc/150?img=5', name: 'test3', color: 'hsl(117, 31%, 46%)' },
  ],
  draft: false,
  published: false,
  title: 'How GraphQL Turned Web Development on its Head',
  navColor: '#44a604',
  plan: 'member',
  isPreview: true,
}
