import type { Story } from '@storybook/vue3'
import StylePicker from './index'

export default {
  title: 'Manager/Editor/Preview/StylePicker',
  layout: 'fullscreen',
}

const Template: Story = (args) => ({
  components: { StylePicker },
  template: `
    <div class="mt-20">
      <StylePicker v-bind="args" />
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
  previewId: '',
  layoutList: [
    {
      id: '4',
      name: 'color-area-test',
      template: 'the-outline-1',
      data: '{"elements":{"dropcap":"large","blockquote":"regular"},"styles":{"name":"article","styles":[],"children":[]}}',
      preview: {
        url: 'https://assets.stori.press/D6RX98VXN/layouts/01FJ67YVQ3VY71ZB9SKTDNP05D.png',
      },
    },
    {
      id: '5',
      name: 'caption-test',
      template: 'the-outline-2',
      data: '{"elements":{"dropcap":"regular","blockquote":"wide","subscribe":"block"},"styles":{"name":"article","styles":[],"children":{"article-content":{"name":"article-content","styles":[],"children":{"& .main-content p:first-of-type::first-letter":{"name":"& .main-content p:first-of-type::first-letter","styles":{"fontFamily":{"xs":"Quebec","md":"Quebec","lg":"Quebec"},"fontSize":{"xs":186,"md":186,"lg":186}},"children":[],"meta":{"dirty":{"fontFamily":"lg","fontSize":"lg"}}}}}}}}',
      preview: {
        url: 'https://assets.stori.press/D6RX98VXN/layouts/01FHCPWNWZY2P9HW4N2VWPEYAD.png',
      },
    },
    {
      id: '7',
      name: 'aaabbb',
      template: 'nytmag-1',
      data: '{"elements":{"dropcap":"out","blockquote":"regular"},"styles":{"name":"article","styles":[],"children":{"article-content":{"name":"article-content","styles":[],"children":{"& .main-content p":{"name":"& .main-content p","styles":{"bold":{"xs":false,"md":false,"lg":false},"italic":{"xs":false,"md":false,"lg":false}},"children":[],"meta":{"dirty":{"bold":"lg","italic":"lg"}}}}}}}}',
      preview: null,
    },
  ],
}
