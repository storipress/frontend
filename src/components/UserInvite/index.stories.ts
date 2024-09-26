import UserInvite from './index.vue'

export default {
  title: 'Settings/UserInvite',
  component: UserInvite,
  argTypes: {},
}

const desks = [
  { name: 'World' },
  { name: 'Politics' },
  { name: 'Business' },
  { name: 'Opinion' },
  { name: 'Tech' },
  { name: 'Science' },
  { name: 'Health' },
  { name: 'Sports' },
  { name: 'Arts' },
  { name: 'Books' },
  { name: 'Style' },
  { name: 'Food' },
]

function Template(args) {
  return {
    components: { UserInvite },
    setup() {
      return { args, desks }
    },
    template: '<User-Invite v-bind="args" />',
  }
}

export const Default = Template.bind({})
Default.args = {
  desks,
}
