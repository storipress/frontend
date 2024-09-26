import type { Story } from '@storybook/vue3'
import Meta from './index'

export default {
  title: 'Manager/Editor/Meta',
  layout: 'fullscreen',
}

const Template: Story = (args) => ({
  components: { Meta },
  template: `
    <div>
      <Meta v-bind="args" />
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
  formModel: {
    title: '',
    blurb: '',
    searchTitle: '',
    searchDescription: '',
    socialTitle: '',
    socialDescription: '',
    tags: [],
    authors: [],
    slug: 'test-test',
    hasSlug: true,
  },
  urlPrefix: 'nytimes.com/posts/',
}
