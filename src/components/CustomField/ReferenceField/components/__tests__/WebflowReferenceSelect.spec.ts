import { fireEvent, within } from '@testing-library/vue'
import WebflowReferenceSelect from '../WebflowReferenceSelect.vue'
import { render } from '~/test-helpers'

it('renders single variant correctly', async () => {
  const { getByRole, getByText, findByLabelText } = render(WebflowReferenceSelect, {
    props: {
      modelValue: [{ id: '1' }],
      label: 'Ref',
      htmlName: 'htmlName',
      placeholder: 'placeholder',
      multiple: false,
      options: {
        target: 'webflow',
        collection_id: 'collection_id',
      },
    },
  })

  const labelText = await findByLabelText('Ref')

  const dropdownTrigger = getByRole('button')
  expect(labelText).toBeVisible()
  expect(dropdownTrigger).toBeVisible()
  expect(getByText('Item 1')).toBeVisible()

  await fireEvent.click(dropdownTrigger)

  const dropdownContent = getByRole('listbox')
  expect(dropdownContent).toBeVisible()
  expect(within(dropdownContent).getByText('Item 1')).toBeVisible()
  expect(within(dropdownContent).getByText('Item 2')).toBeVisible()
})

it('renders multiple variant correctly', async () => {
  const { getByRole, findByText } = render(WebflowReferenceSelect, {
    props: {
      modelValue: [{ id: '1' }],
      label: 'Ref',
      htmlName: 'htmlName',
      placeholder: 'placeholder',
      multiple: true,
      options: {
        target: 'webflow',
        collection_id: 'collection_id',
      },
    },
  })

  const itemText = await findByText('Item 1')

  expect(itemText).toBeVisible()
  expect(getByRole('textbox')).toBeVisible()
})
