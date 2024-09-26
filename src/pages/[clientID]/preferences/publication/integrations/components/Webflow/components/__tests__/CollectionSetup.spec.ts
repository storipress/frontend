import { fireEvent, waitFor } from '@testing-library/vue'
import CollectionSetup from '../CollectionSetup.vue'
import { render } from '~/test-helpers'

it('click next', async () => {
  const onSubmit = vi.fn()
  const { getByRole, getByText } = render(CollectionSetup, {
    props: {
      collectionType: ['blog'],
      onSubmit,
    },
  })

  await waitFor(() => {
    expect(getByText('Next')).not.toHaveClass('invisible')
  })
  const selectButton = getByRole('button', { name: /Select your Webflow collection/i })
  const nextButton = getByRole('button', { name: 'Next' })
  await fireEvent.click(selectButton)
  const collectionList = getByRole('listbox', {
    name: /blog collection/i,
  })
  expect(collectionList).toBeVisible()
  await fireEvent.submit(nextButton)
  expect(onSubmit).toHaveBeenCalledTimes(1)
})
