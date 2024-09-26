import { fireEvent } from '@testing-library/vue'
import MappingDialog from '../MappingDialog.vue'
import { render } from '~/test-helpers'

const candidates = [
  { name: 'Storipress field 1', value: 'body' },
  { name: 'Storipress field 2', value: 'blurb' },
  { name: 'Storipress field 3', value: 'cover' },
  { name: 'Storipress field 4', value: 'headline' },
]
const collection = {
  id: '0',
  displayName: 'Blog Posts',
  fields: [
    { id: '00', displayName: 'Field 1', isRequired: false, type: 'switch', candidates },
    { id: '01', displayName: 'Field 2', isRequired: false, type: 'multiReference', candidates },
  ],
  mappings: JSON.stringify({ '00': null, '01': 'cover' }),
}

it('click sync', async () => {
  const onSubmit = vi.fn()
  const { getByRole, getAllByRole } = render(MappingDialog, {
    props: {
      collection,
      collectionType: 'blog',
      onSubmit,
    },
  })

  const selectButton = getByRole('button', { name: 'Storipress Headline' })
  const syncButton = getByRole('button', { name: 'Sync' })
  await fireEvent.click(selectButton)
  const fieldList = getByRole('listbox', {
    name: /storipress field name/i,
  })
  expect(fieldList).toBeVisible()
  await fireEvent.click(getAllByRole('option')[0])
  await selectButton.blur()
  expect(fieldList).not.toBeVisible()
  await fireEvent.submit(syncButton)
  expect(onSubmit).toHaveBeenCalledTimes(1)
})

it('click back', async () => {
  const onSubmit = vi.fn()
  const onBack = vi.fn()
  const { getByRole } = render(MappingDialog, {
    props: {
      collection,
      collectionType: 'blog',
      onSubmit,
      onClick: onBack,
    },
  })

  const backButton = getByRole('button', { name: 'Back' })
  await fireEvent.click(backButton)
  expect(onBack).toHaveBeenCalledTimes(1)
  expect(onSubmit).toHaveBeenCalledTimes(0)
})
