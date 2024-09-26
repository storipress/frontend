import { fireEvent } from '@testing-library/vue'
import BasicDialog from './BasicDialog.vue'
import { render } from '~/test-helpers'

it('close dialog', async () => {
  const closeModel = vi.fn()
  const { getByRole, getByTestId } = render(BasicDialog, {
    props: {
      modelValue: true,
      onOnModalClose: closeModel,
      info: 'test',
      integrationName: 'Test',
    },
    slots: { default: 'Modal Content' },
  })

  expect(getByTestId('model-content').textContent).toBe('Modal Content')

  const close = getByRole('button', { name: 'close' })
  await fireEvent.click(close)
  expect(closeModel).toHaveBeenCalledTimes(1)
})
