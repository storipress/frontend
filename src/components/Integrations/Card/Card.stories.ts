import { ref } from 'vue'
import integrationImg from '@assets/icons-google-analytics.svg'
import IntegrationCard from './Card.vue'

export default {
  title: 'Settings/Integrations/Card',
  component: IntegrationCard,
}

function Template(args) {
  return {
    components: { IntegrationCard },
    setup() {
      const enabled = ref(false)
      function onSwitch() {
        enabled.value = !enabled.value
      }
      return { args, enabled, onSwitch }
    },
    template: `
  <IntegrationCard v-bind="args" :enabled="enabled" @on-switch="onSwitch" />
  `,
  }
}

export const Card = Template.bind({})
Card.args = {
  label: 'Google Analytics',
  integrationImg,
}
