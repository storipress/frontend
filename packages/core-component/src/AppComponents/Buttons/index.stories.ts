import MyButton from './index.vue'
import Icon from '../Icon/index.vue'

export default {
  title: 'App Components/Buttons',
  component: { MyButton, Icon },
  argTypes: {
    onClick: {},
    type: {
      control: { type: 'select' },
      options: ['main', 'transparent'],
    },
    color: {
      control: {
        type: 'select',
        // labels: {
        //   '': 'default',
        //   primary: 'primary',
        //   info: 'info',
        //   warning: 'warning',
        // },
      },
      options: ['', 'primary', 'info', 'warning'],
    },
  },
}

const Template = (args) => ({
  components: { MyButton },
  setup() {
    return { args }
  },
  template: '<my-button is-shadow v-bind="args">{{ args.default }}</my-button>',
})

export const Primary = Template.bind({})
Primary.args = {
  default: 'Button',
  type: 'main',
  color: 'primary',
}

export const Info = Template.bind({})
Info.args = {
  default: 'Button',
  color: 'info',
}

export const Warning = Template.bind({})
Warning.args = {
  default: 'Button',
  color: 'warning',
}

export const WithSymbol = (args) => ({
  components: { MyButton, Icon },
  setup() {
    args = {
      default: 'Button',
      type: 'main',
      color: 'primary',
    }
    return { args }
  },
  template: '<my-button is-shadow v-bind="args">Button<icon iconName="arrow_right" iconRight /></my-button>',
})

export const OnlySymbol = (args) => ({
  components: { MyButton, Icon },
  setup() {
    args = {
      type: 'main',
      color: 'primary',
    }
    return { args }
  },
  template: `
    <my-button is-shadow v-bind="args">
      <icon iconName="arrow_right" />
    </my-button>
  `,
})

export const BorderOnlySymbol = (args) => ({
  components: { MyButton, Icon },
  setup() {
    args = {
      isBorder: true,
    }
    return { args }
  },
  template: `
    <my-button is-shadow v-bind="args">
      <icon iconName="arrow_right" class="text-stone-400" />
    </my-button>
    `,
})

export const Border = Template.bind({})
Border.args = {
  default: 'Button',
  isBorder: true,
}

export const TransparentBright = Template.bind({})
TransparentBright.args = {
  default: 'Button',
  type: 'transparent',
}

export const TransparentDark = Template.bind({})
TransparentDark.args = {
  default: 'Button',
  type: 'transparent',
  isDark: true,
}

export const Loading = Template.bind({})
Loading.args = {
  default: 'Button',
  type: 'main',
  color: 'primary',
  isLoading: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  default: 'Button',
  type: 'main',
  color: 'primary',
  disabled: true,
}
