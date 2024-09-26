import { fireEvent } from '@testing-library/vue'
import InfoDialog from './InfoDialog.vue'
import { render } from '~/test-helpers'

it('click button', async () => {
  const onClick = vi.fn()
  const { getByRole } = render(InfoDialog, {
    props: {
      title: 'Mock title',
      content: 'Mock content',
      buttonText: 'Mock button text',
      onClick,
    },
  })

  const button = getByRole('button')
  await fireEvent.click(button)
  expect(onClick).toHaveBeenCalledTimes(1)
})
