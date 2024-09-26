import { Inputs, Select } from '@storipress/core-component'
import { Section, SectionContent } from '.'

export default {
  title: 'Settings/Section',
  component: Section,
  argTypes: {},
}

function Template(args) {
  return {
    components: { Section, SectionContent, Inputs, Select },
    setup() {
      return { args }
    },
    template: `
  <Section v-bind="args">
    <SectionContent subTitle="Basic information" content="The logomark is converted to a favicon and used on your site.">
      <template #content>
        <Inputs label="Personal website" placeholder="storipress.com" addOn />
        <div class="flex pt-4">
        <Select label="Social network" class="min-w-[7.625rem] pr-2" />
        <Inputs label="Link" placeholder="https..." class="w-full" />
        </div>
      </template>
    </SectionContent>
  </Section>
  `,
  }
}

export const Default = Template.bind({})
Default.args = {
  title: 'Publication details',
}
