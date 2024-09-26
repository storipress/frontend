import type { Story } from '@storybook/vue3'
import SearchPreview from './index'

export default {
  title: 'Manager/Editor/components/SearchPreview',
  layout: 'fullscreen',
}

const Template: Story = (args) => ({
  components: { SearchPreview },
  template: `
    <div>
      <SearchPreview v-bind="args" />
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
  title: 'Title',
  slug: 'slug-prefix/slug',
  description: 'description',
}
