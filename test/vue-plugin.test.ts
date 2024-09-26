import { KEY } from './setupFiles/constant'
import { render } from '~/test-helpers'

const Component = defineComponent({
  setup() {
    const value = inject(KEY)
    return () => h('div', value)
  },
})

it('vue plugin install success', () => {
  const { getByText } = render(Component)

  expect(getByText('secret-key')).toBeTruthy()
})
